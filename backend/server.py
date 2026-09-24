import hashlib
import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from pymongo.errors import DuplicateKeyError, PyMongoError
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware

load_dotenv(Path(__file__).parent / '.env')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
client = AsyncIOMotorClient(os.getenv('MONGO_URL', 'mongodb://localhost:27017'), serverSelectionTimeoutMS=5000)
db = client[os.getenv('DB_NAME', 'appetiser_india')]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.enquiries.create_index('request_id', unique=True)
    await db.enquiries.create_index([('work_email', 1), ('created_at', -1)])
    await db.enquiries.create_index([('ip_hash', 1), ('created_at', -1)])
    yield
    client.close()


SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'Cache-Control': 'no-store',
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        for key, value in SECURITY_HEADERS.items():
            response.headers.setdefault(key, value)
        return response


def client_ip_hash(request: Request) -> str:
    forwarded = request.headers.get('x-forwarded-for', '')
    ip = forwarded.split(',')[0].strip() if forwarded else (request.client.host if request.client else '')
    return hashlib.sha256(ip.encode()).hexdigest()


app = FastAPI(title='Appetiser India', lifespan=lifespan)
api = APIRouter(prefix='/api')
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv(
        'CORS_ORIGINS', 'http://localhost:3000'
    ).split(',') if origin.strip()],
    allow_credentials=False,
    allow_methods=['GET', 'POST'],
    allow_headers=['Content-Type'],
)


class EnquiryCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra='forbid')
    request_id: uuid.UUID
    name: str = Field(min_length=2, max_length=100)
    work_email: EmailStr = Field(max_length=254)
    company: str = Field(default='', max_length=160)
    interest: Literal['Building a new product', 'Improving an existing product', 'BitByte Restro', 'Product strategy', 'Other']
    idea: str = Field(min_length=20, max_length=5000)
    budget: Literal['Not sure yet', 'Under ₹5 lakh', '₹5–15 lakh', '₹15–30 lakh', '₹30 lakh+']
    timeline: Literal['Exploring for now', 'As soon as possible', '1–3 months', '3–6 months', '6+ months']
    consent: bool
    website: str = Field(default='', max_length=200)

    @field_validator('consent')
    @classmethod
    def must_consent(cls, value):
        if not value:
            raise ValueError('Please agree to being contacted about your enquiry.')
        return value


class EnquiryReceipt(BaseModel):
    id: str
    message: str


@api.get('/')
async def root():
    return {'company': 'Appetiser India', 'status': 'ok'}


@api.get('/health')
async def health():
    try:
        await db.command('ping')
        return {'status': 'ok'}
    except PyMongoError:
        raise HTTPException(503, 'Temporarily unavailable')


@api.post('/enquiries', response_model=EnquiryReceipt, status_code=201)
async def create_enquiry(payload: EnquiryCreate, request: Request):
    if payload.website:
        raise HTTPException(400, 'Unable to submit this enquiry.')
    request_id = str(payload.request_id)
    email = str(payload.work_email).lower()
    ip_hash = client_ip_hash(request)
    try:
        existing = await db.enquiries.find_one({'request_id': request_id}, {'_id': 0, 'id': 1})
        if existing:
            return EnquiryReceipt(id=existing['id'], message='Your enquiry has been received.')
        since = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
        count = await db.enquiries.count_documents({'work_email': email, 'created_at': {'$gte': since}})
        if count >= 5:
            raise HTTPException(429, 'You’ve sent a few enquiries recently. Please try again in an hour.')
        ip_count = await db.enquiries.count_documents({'ip_hash': ip_hash, 'created_at': {'$gte': since}})
        if ip_count >= 10:
            raise HTTPException(429, 'Too many enquiries from this connection. Please try again in an hour.')
        receipt = EnquiryReceipt(id=str(uuid.uuid4()), message='Your enquiry has been received. Thank you for sharing your idea.')
        document = payload.model_dump(mode='json', exclude={'website'})
        document.update(id=receipt.id, work_email=email, ip_hash=ip_hash, created_at=datetime.now(timezone.utc).isoformat(), status='new')
        await db.enquiries.insert_one(document)
        return receipt
    except DuplicateKeyError:
        existing = await db.enquiries.find_one({'request_id': request_id}, {'_id': 0, 'id': 1})
        return EnquiryReceipt(id=existing['id'], message='Your enquiry has been received.')
    except PyMongoError:
        logger.exception('Enquiry storage unavailable')
        raise HTTPException(503, 'We couldn’t save your enquiry right now. Please try again shortly.')


app.include_router(api)