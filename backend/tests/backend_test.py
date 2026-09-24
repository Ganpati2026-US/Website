"""Backend tests for Appetiser India — enquiries API + health."""
import os
import uuid
import time
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://appetiser-preview.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


def _valid_payload(**overrides):
    payload = {
        "request_id": str(uuid.uuid4()),
        "name": "Test User",
        "work_email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "company": "TestCo",
        "interest": "BitByte Restro",
        "idea": "This is a valid idea description longer than twenty chars.",
        "budget": "Not sure yet",
        "timeline": "Exploring for now",
        "consent": True,
        "website": "",
    }
    payload.update(overrides)
    return payload


# --- Health ---
def test_health_ok():
    r = requests.get(f"{API}/health", timeout=10)
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_root_ok():
    r = requests.get(f"{API}/", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"


# --- Enquiries success ---
def test_create_enquiry_success_and_persistence():
    payload = _valid_payload()
    r = requests.post(f"{API}/enquiries", json=payload, timeout=10)
    assert r.status_code == 201, r.text
    data = r.json()
    assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
    assert "message" in data

    # verify persistence in MongoDB via re-post with same request_id (idempotent returns same id)
    r2 = requests.post(f"{API}/enquiries", json=payload, timeout=10)
    assert r2.status_code == 201
    assert r2.json()["id"] == data["id"]


def test_honeypot_rejected():
    payload = _valid_payload(website="spammy")
    r = requests.post(f"{API}/enquiries", json=payload, timeout=10)
    assert r.status_code == 400


def test_consent_false_422():
    payload = _valid_payload(consent=False)
    r = requests.post(f"{API}/enquiries", json=payload, timeout=10)
    assert r.status_code == 422


def test_idea_too_short_422():
    payload = _valid_payload(idea="too short")
    r = requests.post(f"{API}/enquiries", json=payload, timeout=10)
    assert r.status_code == 422


def test_invalid_interest_422():
    payload = _valid_payload(interest="Nonsense")
    r = requests.post(f"{API}/enquiries", json=payload, timeout=10)
    assert r.status_code == 422


def test_rate_limit_429():
    email = f"ratelimit_{uuid.uuid4().hex[:8]}@example.com"
    ids = []
    for i in range(5):
        p = _valid_payload(work_email=email)
        r = requests.post(f"{API}/enquiries", json=p, timeout=10)
        assert r.status_code == 201, f"attempt {i}: {r.status_code} {r.text}"
        ids.append(r.json()["id"])
    # 6th should be blocked
    p = _valid_payload(work_email=email)
    r = requests.post(f"{API}/enquiries", json=p, timeout=10)
    assert r.status_code == 429, r.text


def test_mongo_persistence_direct():
    """Verify record ends up in MongoDB enquiries collection."""
    from pymongo import MongoClient
    payload = _valid_payload()
    r = requests.post(f"{API}/enquiries", json=payload, timeout=10)
    assert r.status_code == 201
    rec_id = r.json()["id"]
    mc = MongoClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
    db = mc[os.environ.get('DB_NAME', 'test_database')]
    doc = db.enquiries.find_one({"id": rec_id})
    assert doc is not None
    assert doc["work_email"] == payload["work_email"].lower()
    assert doc["interest"] == payload["interest"]
    assert doc.get("status") == "new"
    mc.close()
