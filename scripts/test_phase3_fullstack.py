#!/usr/bin/env python3
"""
AgriNexus AI — Complete Phase 3 Full-Stack Integration Verification Suite
Tests PostgreSQL, Alembic, FastAPI, Auth, Farms, Fields, Crops, Dashboard,
Financial Ledger, Notifications, Data Isolation, and Angular Build.
"""
import os
import sys
import uuid
import time
from decimal import Decimal

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
from app.models.finance import FinancialTransaction


def run_fullstack_tests():
    print("=" * 80)
    print("  AGRINEXUS AI — PHASE 3 FULL-STACK INTEGRATION & VERIFICATION SUITE")
    print("=" * 80)
    results = []
    client = TestClient(app)

    # 1. PostgreSQL 18 Direct Connectivity
    t1_start = time.perf_counter()
    try:
        with engine.connect() as conn:
            pg_version = conn.execute(text("SELECT version();")).scalar()
            db_name = conn.execute(text("SELECT current_database();")).scalar()
            dur = round((time.perf_counter() - t1_start) * 1000, 2)
            results.append(("PostgreSQL Connectivity", True, f"Connected to '{db_name}' in {dur}ms. {pg_version[:40]}..."))
    except Exception as e:
        results.append(("PostgreSQL Connectivity", False, f"Failed: {e}"))

    # 2. Database Schema & Tables Inventory (21 Tables)
    try:
        with engine.connect() as conn:
            tables = conn.execute(text("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public' ORDER BY table_name;
            """)).fetchall()
            table_names = [t[0] for t in tables]
            required_tables = [
                'users', 'roles', 'user_roles', 'farms', 'fields', 'crops', 'crop_cycles',
                'farm_activities', 'soil_records', 'irrigation_records', 'inventory_items',
                'inventory_transactions', 'labour', 'labour_attendance', 'equipment',
                'equipment_maintenance', 'financial_transactions', 'notifications',
                'disease_diagnoses', 'audit_logs', 'alembic_version'
            ]
            missing = [t for t in required_tables if t not in table_names]
            is_ok = len(missing) == 0
            results.append((
                "Relational Schema (21 Tables)",
                is_ok,
                f"Found {len(table_names)} tables. All 21 required tables confirmed present." if is_ok else f"Missing: {missing}"
            ))
    except Exception as e:
        results.append(("Relational Schema (21 Tables)", False, f"Failed: {e}"))

    # 3. FastAPI Health Endpoints
    try:
        r1 = client.get("/api/v1/health")
        r2 = client.get("/api/v1/health/database")
        is_ok = r1.status_code == 200 and r2.status_code == 200 and r2.json().get("status") == "connected"
        results.append((
            "FastAPI & DB Health Probes",
            is_ok,
            f"Liveness HTTP {r1.status_code}, DB Health HTTP {r2.status_code} (latency: {r2.json().get('latency_ms')}ms)"
        ))
    except Exception as e:
        results.append(("FastAPI & DB Health Probes", False, f"Failed: {e}"))

    # 4. User Registration & Role Restriction
    try:
        rand_id = uuid.uuid4().hex[:6]
        # Admin public registration must be rejected
        admin_try = client.post("/api/v1/auth/register", json={
            "email": f"hacker_{rand_id}@agrinexus.ai",
            "full_name": "Unauthorized Admin",
            "password": "Password123!",
            "role": "ADMIN"
        })
        # Farmer registration must succeed
        farmer_reg = client.post("/api/v1/auth/register", json={
            "email": f"test_farmer_{rand_id}@agrinexus.ai",
            "full_name": "Test Farmer",
            "phone_number": "+91-98000-11111",
            "preferred_language": "mr",
            "password": "Password123!",
            "role": "FARMER"
        })
        is_ok = admin_try.status_code in (400, 403, 422) and farmer_reg.status_code == 201
        results.append((
            "User Registration & RBAC",
            is_ok,
            f"Public ADMIN blocked ({admin_try.status_code}), FARMER created ({farmer_reg.status_code}, token issued)"
        ))
    except Exception as e:
        results.append(("User Registration & RBAC", False, f"Failed: {e}"))

    # 5. JWT Login & Session Handling
    auth_token = None
    try:
        login_resp = client.post("/api/v1/auth/login", json={
            "email": "farmer.rahata@agrinexus.ai",
            "password": "Farmer@Rahata2026"
        })
        is_ok = login_resp.status_code == 200 and "access_token" in login_resp.json()
        if is_ok:
            auth_token = login_resp.json()["access_token"]
        # Verify /auth/me
        me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {auth_token}"})
        is_ok = is_ok and me_resp.status_code == 200 and me_resp.json()["email"] == "farmer.rahata@agrinexus.ai"
        results.append((
            "JWT Authentication & Session",
            is_ok,
            f"Login HTTP 200, Token issued, Profile resolved: {me_resp.json().get('full_name')} ({me_resp.json().get('primary_role')})"
        ))
    except Exception as e:
        results.append(("JWT Authentication & Session", False, f"Failed: {e}"))

    headers = {"Authorization": f"Bearer {auth_token}"}

    # 6. Farm CRUD Operations
    test_farm_id = None
    try:
        create_resp = client.post("/api/v1/farms", json={
            "name": "Integration Test Orchard",
            "village": "Loni",
            "taluka": "Rahata",
            "district": "Ahilyanagar",
            "state": "Maharashtra",
            "total_area_acres": 4.50,
            "latitude": 19.7250,
            "longitude": 74.4750,
            "soil_type": "MEDIUM_BLACK",
            "irrigation_source": "DRIP"
        }, headers=headers)
        test_farm_id = create_resp.json()["id"]
        get_resp = client.get(f"/api/v1/farms/{test_farm_id}", headers=headers)
        update_resp = client.put(f"/api/v1/farms/{test_farm_id}", json={"name": "Updated Orchard Holding"}, headers=headers)
        del_resp = client.delete(f"/api/v1/farms/{test_farm_id}", headers=headers)
        is_ok = (
            create_resp.status_code == 201 and 
            get_resp.status_code == 200 and 
            update_resp.status_code == 200 and 
            del_resp.status_code == 200
        )
        results.append((
            "Farm CRUD Operations",
            is_ok,
            f"Create (201) -> Read (200) -> Update (200) -> Delete (200) verified successfully."
        ))
    except Exception as e:
        results.append(("Farm CRUD Operations", False, f"Failed: {e}"))

    # 7. User Data Isolation (Farmer A vs Farmer B)
    try:
        # Create Farm as Farmer A
        farm_a = client.post("/api/v1/farms", json={
            "name": "Farmer A Holding",
            "village": "Rahata",
            "taluka": "Rahata",
            "district": "Ahilyanagar",
            "total_area_acres": 2.00,
            "latitude": 19.7100,
            "longitude": 74.4800
        }, headers=headers).json()
        farm_a_id = farm_a["id"]

        # Register Farmer B
        f_b = client.post("/api/v1/auth/register", json={
            "email": f"farmer_b_{uuid.uuid4().hex[:6]}@agrinexus.ai",
            "full_name": "Farmer B",
            "password": "Password123!",
            "role": "FARMER"
        }).json()
        headers_b = {"Authorization": f"Bearer {f_b['access_token']}"}

        # Farmer B attempts to access Farmer A's farm
        b_get = client.get(f"/api/v1/farms/{farm_a_id}", headers=headers_b)
        b_put = client.put(f"/api/v1/farms/{farm_a_id}", json={"name": "Compromised"}, headers=headers_b)
        b_del = client.delete(f"/api/v1/farms/{farm_a_id}", headers=headers_b)

        # Cleanup Farmer A farm
        client.delete(f"/api/v1/farms/{farm_a_id}", headers=headers)

        is_ok = b_get.status_code == 403 and b_put.status_code == 403 and b_del.status_code == 403
        results.append((
            "Cross-Tenant Data Isolation",
            is_ok,
            f"Unauthorized accesses blocked with HTTP 403 (GET: {b_get.status_code}, PUT: {b_put.status_code}, DELETE: {b_del.status_code})"
        ))
    except Exception as e:
        results.append(("Cross-Tenant Data Isolation", False, f"Failed: {e}"))

    # 8. Operational Dashboard Live Aggregation
    try:
        dash_resp = client.get("/api/v1/dashboard/summary", headers=headers)
        dash = dash_resp.json()
        is_ok = (
            dash_resp.status_code == 200 and
            dash["total_farms"] >= 1 and
            dash["total_fields"] >= 3 and
            float(dash["total_cultivated_acres"]) >= 5.0 and
            float(dash["recorded_income"]) > 0 and
            float(dash["total_expenses"]) > 0 and
            len(dash["crop_distribution"]) >= 3
        )
        results.append((
            "Dashboard Real-Time Aggregation",
            is_ok,
            f"Farms: {dash['total_farms']}, Fields: {dash['total_fields']}, Area: {dash['total_cultivated_acres']} Ac, Income: ₹{dash['recorded_income']}, Expense: ₹{dash['total_expenses']}, Profit: ₹{dash['estimated_profit']}"
        ))
    except Exception as e:
        results.append(("Dashboard Real-Time Aggregation", False, f"Failed: {e}"))

    # 9. Financial Management & Ledger Summary
    try:
        fin_resp = client.get("/api/v1/finance/summary", headers=headers)
        fin = fin_resp.json()
        txs_resp = client.get("/api/v1/finance/transactions", headers=headers)
        txs = txs_resp.json()
        is_ok = (
            fin_resp.status_code == 200 and
            txs_resp.status_code == 200 and
            float(fin["total_income"]) > 0 and
            float(fin["total_expenses"]) > 0 and
            len(txs) >= 9
        )
        results.append((
            "Financial Ledger & Summary",
            is_ok,
            f"{len(txs)} transactions recorded. Total Income: ₹{fin['total_income']}, Expenses: ₹{fin['total_expenses']}, Net: ₹{fin['net_profit']} ({fin['profit_margin_pct']}% margin)"
        ))
    except Exception as e:
        results.append(("Financial Ledger & Summary", False, f"Failed: {e}"))

    # 10. Notifications & Read Status
    try:
        notifs_resp = client.get("/api/v1/notifications", headers=headers)
        notifs = notifs_resp.json()
        is_ok = notifs_resp.status_code == 200 and len(notifs) >= 1
        if is_ok:
            first_id = notifs[0]["id"]
            patch_resp = client.patch(f"/api/v1/notifications/{first_id}/read", headers=headers)
            is_ok = is_ok and patch_resp.status_code == 200 and patch_resp.json()["is_read"] is True
        results.append((
            "User Notification Telemetry",
            is_ok,
            f"Found {len(notifs)} alerts. Mark-as-read successfully updated notification {notifs[0]['id'][:8]}..."
        ))
    except Exception as e:
        results.append(("User Notification Telemetry", False, f"Failed: {e}"))

    # 11. Angular Frontend Production Build
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "frontend", "browser"))
    if not os.path.exists(dist_dir):
        dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "frontend"))
    try:
        files = os.listdir(dist_dir) if os.path.exists(dist_dir) else []
        has_index = "index.html" in files
        has_main = any(f.startswith("main") for f in files)
        is_ok = has_index and has_main and len(files) >= 10
        results.append((
            "Angular Production Bundles",
            is_ok,
            f"Successfully compiled {len(files)} production artifacts in {dist_dir} (index.html, styles, main, lazy chunks)."
        ))
    except Exception as e:
        results.append(("Angular Production Bundles", False, f"Failed: {e}"))

    # Print Summary
    print("\nVerification Test Results:\n")
    all_passed = True
    for name, passed, detail in results:
        status_sym = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_passed = False
        print(f"[{status_sym}] {name:<35} : {detail}")

    print("\n" + "=" * 80)
    if all_passed:
        print("🎉 ALL 11 PHASE 3 INTEGRATION VERIFICATION CHECKS PASSED PERFECTLY!")
    else:
        print("⚠️ SOME CHECKS FAILED. PLEASE REVIEW LOGS ABOVE.")
    print("=" * 80)

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(run_fullstack_tests())
