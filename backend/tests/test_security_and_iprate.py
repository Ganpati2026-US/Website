"""Iteration 2: security headers + per-IP rate limit tests.

Uses localhost:8001 directly for per-IP tests so we control the X-Forwarded-For
header (public preview URL rewrites XFF via ingress)."""
import hashlib
import os
import uuid

import pytest
import requests
from pymongo import MongoClient

PUBLIC = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001').rstrip('/')
LOCAL = 'http://localhost:8001'
API_PUBLIC = f"{PUBLIC}/api"
API_LOCAL = f"{LOCAL}/api"

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')


def _valid_payload(**overrides):
    payload = {
        "request_id": str(uuid.uuid4()),
        "name": "Iter2 User",
        "work_email": f"iter2_{uuid.uuid4().hex[:8]}@example.com",
        "company": "Iter2Co",
        "interest": "BitByte Restro",
        "idea": "This is a valid idea description longer than twenty chars.",
        "budget": "Not sure yet",
        "timeline": "Exploring for now",
        "consent": True,
        "website": "",
    }
    payload.update(overrides)
    return payload


REQUIRED_SECURITY_HEADERS = {
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': None,  # any value acceptable
    'strict-transport-security': None,
    'permissions-policy': None,
    'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
}


def _assert_security_headers(resp):
    for header, expected in REQUIRED_SECURITY_HEADERS.items():
        assert header in {k.lower() for k in resp.headers.keys()}, f"missing {header}"
        if expected is not None:
            actual = resp.headers.get(header) or resp.headers.get(header.title())
            assert expected in actual, f"{header}={actual!r} doesn't contain {expected!r}"


def test_health_returns_ok_and_security_headers():
    r = requests.get(f"{API_PUBLIC}/health", timeout=10)
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}
    _assert_security_headers(r)


def test_security_headers_on_enquiries_response():
    r = requests.post(f"{API_PUBLIC}/enquiries", json=_valid_payload(), timeout=10)
    assert r.status_code in (201, 429)
    _assert_security_headers(r)


def test_ip_hash_stored_and_no_raw_ip():
    """Post via localhost with a spoofed XFF and verify mongo doc has ip_hash but not raw ip fields."""
    xff = f"198.51.100.{uuid.uuid4().int % 200 + 1}"
    payload = _valid_payload()
    r = requests.post(f"{API_LOCAL}/enquiries", json=payload,
                      headers={"X-Forwarded-For": xff}, timeout=10)
    assert r.status_code == 201, r.text
    rec_id = r.json()["id"]

    mc = MongoClient(MONGO_URL)
    doc = mc[DB_NAME].enquiries.find_one({"id": rec_id})
    assert doc is not None
    assert 'ip_hash' in doc
    expected_hash = hashlib.sha256(xff.encode()).hexdigest()
    assert doc['ip_hash'] == expected_hash
    assert len(doc['ip_hash']) == 64
    # No raw IP fields
    for banned in ('ip', 'client_ip', 'remote_addr', 'x_forwarded_for'):
        assert banned not in doc, f"raw ip field {banned} leaked into doc"
    assert xff not in str(doc)
    mc.close()


def test_per_ip_rate_limit_11th_returns_429():
    """Send 10 enquiries with different emails but same spoofed IP -> all 201.
    11th -> 429 with 'this connection' message. Then a different IP should still succeed."""
    xff = f"203.0.113.{uuid.uuid4().int % 200 + 20}"  # unique per test run
    ip_hash = hashlib.sha256(xff.encode()).hexdigest()

    # Clean prior docs for this ip_hash to isolate bucket
    mc = MongoClient(MONGO_URL)
    mc[DB_NAME].enquiries.delete_many({"ip_hash": ip_hash})
    mc.close()

    for i in range(10):
        p = _valid_payload()
        r = requests.post(f"{API_LOCAL}/enquiries", json=p,
                          headers={"X-Forwarded-For": xff}, timeout=10)
        assert r.status_code == 201, f"attempt {i}: {r.status_code} {r.text}"

    # 11th
    p = _valid_payload()
    r = requests.post(f"{API_LOCAL}/enquiries", json=p,
                      headers={"X-Forwarded-For": xff}, timeout=10)
    assert r.status_code == 429, r.text
    body = r.json()
    detail = str(body.get('detail', '')).lower()
    assert 'connection' in detail, f"expected 'connection' in message, got: {detail}"

    # Different IP should still succeed
    xff2 = f"192.0.2.{uuid.uuid4().int % 200 + 20}"
    ip_hash2 = hashlib.sha256(xff2.encode()).hexdigest()
    mc = MongoClient(MONGO_URL)
    mc[DB_NAME].enquiries.delete_many({"ip_hash": ip_hash2})
    mc.close()
    r2 = requests.post(f"{API_LOCAL}/enquiries", json=_valid_payload(),
                       headers={"X-Forwarded-For": xff2}, timeout=10)
    assert r2.status_code == 201, r2.text


@pytest.fixture(autouse=True, scope="module")
def _cleanup():
    yield
    # Best-effort cleanup of iter2 seed docs
    try:
        mc = MongoClient(MONGO_URL)
        mc[DB_NAME].enquiries.delete_many({"work_email": {"$regex": "^iter2_"}})
        mc.close()
    except Exception:
        pass
