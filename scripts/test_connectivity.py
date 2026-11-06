#!/usr/bin/env python3
"""
AgriNexus AI — Comprehensive Phase 1 Infrastructure Verification Script
Tests PostgreSQL, FastAPI, Health Endpoints, Auth Security, and Error Handling.
"""
import os
import sys
import json
import time

# Ensure backend package is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.core.database import engine, SessionLocal
from app.models.user import User
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop


def run_test_suite():
    print("=" * 70)
    print(" AGRINEXUS AI — PHASE 1 INFRASTRUCTURE & HANDSHAKE TEST SUITE")
    print("=" * 70)
    results = []

    client = TestClient(app)

    # -------------------------------------------------------------
    # Test 1: Direct PostgreSQL Database Connectivity
    # -------------------------------------------------------------
    t1_start = time.perf_counter()
    try:
        with engine.connect() as conn:
            pg_version = conn.execute(text("SELECT version();")).scalar()
            current_db = conn.execute(text("SELECT current_database();")).scalar()
            t1_duration = round((time.perf_counter() - t1_start) * 1000, 2)
            results.append(("PostgreSQL Connectivity", True, f"Connected to '{current_db}' in {t1_duration}ms. {pg_version[:45]}..."))
    except Exception as e:
        results.append(("PostgreSQL Connectivity", False, f"Failed: {e}"))

    # -------------------------------------------------------------
    # Test 2: Verify Seeded Relational Tables & Case Study Data
    # -------------------------------------------------------------
    try:
        db = SessionLocal()
        user_count = db.query(User).count()
        farm_count = db.query(Farm).count()
        field_count = db.query(Field).count()
        crop_count = db.query(Crop).count()
        db.close()
        results.append((
            "Database Schema & Seeds",
            user_count >= 1 and farm_count >= 1 and field_count >= 3 and crop_count >= 3,
            f"Found {user_count} users, {farm_count} farms, {field_count} fields, {crop_count} crops."
        ))
    except Exception as e:
        results.append(("Database Schema & Seeds", False, f"Failed: {e}"))

    # -------------------------------------------------------------
    # Test 3: Backend Liveness Probe GET /api/v1/health
    # -------------------------------------------------------------
    try:
        resp = client.get("/api/v1/health")
        data = resp.json()
        is_ok = resp.status_code == 200 and data.get("status") == "healthy"
        results.append((
            "GET /api/v1/health",
            is_ok,
            f"Status {resp.status_code}, service: '{data.get('service')}', env: '{data.get('environment')}'"
        ))
    except Exception as e:
        results.append(("GET /api/v1/health", False, f"Failed: {e}"))

    # -------------------------------------------------------------
    # Test 4: Database Health & Latency Probe GET /api/v1/health/database
    # -------------------------------------------------------------
    try:
        resp = client.get("/api/v1/health/database")
        data = resp.json()
        is_ok = resp.status_code == 200 and data.get("status") == "connected" and data.get("latency_ms") is not None
        results.append((
            "GET /api/v1/health/database",
            is_ok,
            f"Status {resp.status_code}, DB: '{data.get('database_name')}', Latency: {data.get('latency_ms')}ms"
        ))
    except Exception as e:
        results.append(("GET /api/v1/health/database", False, f"Failed: {e}"))

    # -------------------------------------------------------------
    # Test 5: Valid Authentication POST /api/v1/auth/login
    # -------------------------------------------------------------
    try:
        resp = client.post("/api/v1/auth/login", json={
            "email": "farmer.rahata@agrinexus.ai",
            "password": "Farmer@Rahata2026"
        })
        data = resp.json()
        is_ok = resp.status_code == 200 and "access_token" in data and data.get("token_type") == "bearer"
        results.append((
            "POST /api/v1/auth/login (Valid)",
            is_ok,
            f"Status {resp.status_code}, Token generated (expires in {data.get('expires_in')}s, user: {data.get('user', {}).get('full_name')})"
        ))
    except Exception as e:
        results.append(("POST /api/v1/auth/login (Valid)", False, f"Failed: {e}"))

    # -------------------------------------------------------------
    # Test 6: Invalid Authentication Handling (Wrong Password)
    # -------------------------------------------------------------
    try:
        resp = client.post("/api/v1/auth/login", json={
            "email": "farmer.rahata@agrinexus.ai",
            "password": "WrongPasswordXYZ!"
        })
        data = resp.json()
        is_ok = resp.status_code == 401
        results.append((
            "POST /api/v1/auth/login (Invalid)",
            is_ok,
            f"Status {resp.status_code}, Handled correctly: '{data.get('detail')}'"
        ))
    except Exception as e:
        results.append(("POST /api/v1/auth/login (Invalid)", False, f"Failed: {e}"))

    # -------------------------------------------------------------
    # Test 7: Malformed Payload Validation Error (RFC 7807 / 422)
    # -------------------------------------------------------------
    try:
        resp = client.post("/api/v1/auth/login", json={
            "email": "not-an-email-address",
            # missing password
        })
        data = resp.json()
        is_ok = resp.status_code == 422 and "error" in data and "validation_errors" in data["error"]
        results.append((
            "POST /api/v1/auth/login (Payload Validation)",
            is_ok,
            f"Status {resp.status_code}, Caught {len(data.get('error', {}).get('validation_errors', []))} validation errors."
        ))
    except Exception as e:
        results.append(("POST /api/v1/auth/login (Payload Validation)", False, f"Failed: {e}"))

    # -------------------------------------------------------------
    # Test 8: Frontend Build Artifacts Verification
    # -------------------------------------------------------------
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "frontend", "browser"))
    if not os.path.exists(dist_dir):
        dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "frontend"))
    try:
        files = os.listdir(dist_dir) if os.path.exists(dist_dir) else []
        has_index = "index.html" in files
        has_main = any(f.startswith("main") for f in files)
        has_styles = any(f.startswith("styles") for f in files)
        is_ok = has_index and has_main and has_styles
        results.append((
            "Angular Frontend Production Build",
            is_ok,
            f"Found {len(files)} compiled bundle files in {dist_dir} (index.html, styles, main, lazy chunks)."
        ))
    except Exception as e:
        results.append(("Angular Frontend Production Build", False, f"Failed: {e}"))

    # -------------------------------------------------------------
    # Summary Report
    # -------------------------------------------------------------
    print("\nTest Execution Results:\n")
    all_passed = True
    for name, passed, detail in results:
        status_sym = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_passed = False
        print(f"[{status_sym}] {name:<35} : {detail}")

    print("\n" + "=" * 70)
    if all_passed:
        print("🎉 ALL 8 INFRASTRUCTURE & HANDSHAKE TESTS PASSED PERFECTLY!")
    else:
        print("⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.")
    print("=" * 70)

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(run_test_suite())
