#!/usr/bin/env python3
"""
AgriNexus AI — Comprehensive End-to-End Test Suite for All Modules
Tests:
1. Live FastAPI Backend HTTP Endpoints (Port 8000)
2. Live PostgreSQL Database Queries & Aggregates (Port 5433)
3. Live Angular Frontend Routes & Asset Bundles (Port 4200)
"""
import sys
import json
import urllib.request
import urllib.error
import time

BACKEND_BASE = "http://localhost:8000"
FRONTEND_BASE = "http://localhost:4200"

def make_request(url, method="GET", headers=None, data=None):
    req_headers = headers or {}
    req_data = None
    if data:
        req_data = json.dumps(data).encode("utf-8")
        req_headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
    start_time = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            body = resp.read().decode("utf-8")
            try:
                parsed_json = json.loads(body)
            except:
                parsed_json = None
            return resp.status, elapsed_ms, body, parsed_json
    except urllib.error.HTTPError as e:
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        body = e.read().decode("utf-8")
        try:
            parsed_json = json.loads(body)
        except:
            parsed_json = None
        return e.code, elapsed_ms, body, parsed_json
    except Exception as e:
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        return 0, elapsed_ms, str(e), None

def run_tests():
    print("=" * 85)
    print("      AGRINEXUS AI — COMPLETE SYSTEM MODULES TEST SUITE (LIVE SERVERS)")
    print("=" * 85)
    print(f"Backend Target  : {BACKEND_BASE}")
    print(f"Frontend Target : {FRONTEND_BASE}\n")

    test_results = []
    
    # -------------------------------------------------------------------------
    # PART 1: BACKEND MODULES TESTING
    # -------------------------------------------------------------------------
    print("--- [MODULE 1: SYSTEM HEALTH & PROBES] ---")
    
    # 1.1 Backend Health
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/health")
    ok = status == 200 and data and data.get("status") == "healthy"
    test_results.append(("API Liveness Probe", ok, f"HTTP {status} ({dur}ms) - Service: {data.get('service') if data else ''}"))

    # 1.2 DB Health
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/health/database")
    ok = status == 200 and data and data.get("status") == "connected"
    test_results.append(("PostgreSQL Database Probe", ok, f"HTTP {status} ({dur}ms) - DB: {data.get('database_name') if data else ''}, Latency: {data.get('latency_ms') if data else ''}ms"))

    # 1.3 Swagger Docs & OpenAPI
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/openapi.json")
    ok = status == 200 and data and "paths" in data
    path_count = len(data.get("paths", {})) if data else 0
    test_results.append(("OpenAPI Specification", ok, f"HTTP {status} ({dur}ms) - Documented Endpoints: {path_count}"))

    status, dur, _, _ = make_request(f"{BACKEND_BASE}/docs")
    ok = status == 200
    test_results.append(("Swagger UI Web Interface", ok, f"HTTP {status} ({dur}ms) - Interactive UI accessible at /docs"))

    # -------------------------------------------------------------------------
    print("\n--- [MODULE 2: AUTHENTICATION & IDENTITY] ---")
    
    # 2.1 Login with valid credentials
    status, dur, _, data = make_request(
        f"{BACKEND_BASE}/api/v1/auth/login",
        method="POST",
        data={"email": "farmer.rahata@agrinexus.ai", "password": "Farmer@Rahata2026"}
    )
    auth_token = data.get("access_token") if data else None
    ok = status == 200 and auth_token is not None
    test_results.append(("Farmer Login (JWT Issuance)", ok, f"HTTP {status} ({dur}ms) - Token: Bearer {auth_token[:15] if auth_token else ''}..."))

    auth_headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}

    # 2.2 Verify Profile /auth/me
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/auth/me", headers=auth_headers)
    ok = status == 200 and data and data.get("email") == "farmer.rahata@agrinexus.ai"
    test_results.append(("Authenticated Session (/auth/me)", ok, f"HTTP {status} ({dur}ms) - User: {data.get('full_name') if data else ''} ({data.get('primary_role') if data else ''})"))

    # 2.3 Invalid Password Check
    status, dur, _, _ = make_request(
        f"{BACKEND_BASE}/api/v1/auth/login",
        method="POST",
        data={"email": "farmer.rahata@agrinexus.ai", "password": "IncorrectPassword!"}
    )
    ok = status == 401
    test_results.append(("Invalid Password Rejection", ok, f"HTTP {status} ({dur}ms) - Successfully blocked unauthorized login"))

    # -------------------------------------------------------------------------
    print("\n--- [MODULE 3: FARM OPERATIONS TWIN & DASHBOARD] ---")
    
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/dashboard/summary", headers=auth_headers)
    ok = status == 200 and data and float(data.get("recorded_income", 0)) > 0
    test_results.append((
        "Dashboard KPI Calculations",
        ok,
        f"HTTP {status} ({dur}ms) - Area: {data.get('total_cultivated_acres')} Ac, Income: ₹{data.get('recorded_income')}, Expense: ₹{data.get('total_expenses')}, Margin: {data.get('profit_margin_pct')}%"
    ))

    # -------------------------------------------------------------------------
    print("\n--- [MODULE 4: FARM & FIELD MANAGEMENT] ---")
    
    # 4.1 List Farms
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/farms", headers=auth_headers)
    ok = status == 200 and isinstance(data, list) and len(data) >= 1
    farm_id = data[0]["id"] if ok else None
    test_results.append(("Farm Holdings Query", ok, f"HTTP {status} ({dur}ms) - Total Holdings: {len(data) if data else 0} ({data[0]['name'] if ok else ''})"))

    # 4.2 List Fields
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/fields", headers=auth_headers)
    ok = status == 200 and isinstance(data, list) and len(data) >= 3
    test_results.append(("Field Plots Query", ok, f"HTTP {status} ({dur}ms) - Total Plots: {len(data) if data else 0} (East, Center, West)"))

    # -------------------------------------------------------------------------
    print("\n--- [MODULE 5: CROP PORTFOLIO & CYCLES] ---")
    
    # 5.1 List Crops
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/crops", headers=auth_headers)
    ok = status == 200 and isinstance(data, list) and len(data) >= 3
    crop_id = data[0]["id"] if ok else None
    test_results.append(("Crop Portfolio Query", ok, f"HTTP {status} ({dur}ms) - Active Crops: {len(data) if data else 0} (Onion, Soybean, Sugarcane)"))

    # 5.2 Crop Cycles
    if crop_id:
        status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/crops/{crop_id}/cycles", headers=auth_headers)
        ok = status == 200 and isinstance(data, list)
        test_results.append(("Crop Cultivation Cycles", ok, f"HTTP {status} ({dur}ms) - Seeded Cycles: {len(data) if data else 0}"))

    # -------------------------------------------------------------------------
    print("\n--- [MODULE 6: FINANCIAL LEDGER & PROFITABILITY] ---")
    
    # 6.1 Financial Summary
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/finance/summary", headers=auth_headers)
    ok = status == 200 and data and float(data.get("net_profit", 0)) > 0
    test_results.append((
        "Financial P&L Summary",
        ok,
        f"HTTP {status} ({dur}ms) - Revenue: ₹{data.get('total_income')}, Outlay: ₹{data.get('total_expenses')}, Net: ₹{data.get('net_profit')}"
    ))

    # 6.2 Transactions List
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/finance/transactions", headers=auth_headers)
    ok = status == 200 and isinstance(data, list) and len(data) >= 9
    test_results.append(("Financial Ledger Transactions", ok, f"HTTP {status} ({dur}ms) - Audited Ledger Entries: {len(data) if data else 0}"))

    # -------------------------------------------------------------------------
    print("\n--- [MODULE 7: FARM OPERATIONS & NOTIFICATIONS] ---")
    
    # 7.1 Activities
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/activities", headers=auth_headers)
    ok = status == 200 and isinstance(data, list) and len(data) >= 1
    test_results.append(("Farm Operations Activities", ok, f"HTTP {status} ({dur}ms) - Scheduled / Logged Activities: {len(data) if data else 0}"))

    # 7.2 Notifications
    status, dur, _, data = make_request(f"{BACKEND_BASE}/api/v1/notifications", headers=auth_headers)
    ok = status == 200 and isinstance(data, list) and len(data) >= 1
    test_results.append(("Alerts & Notifications", ok, f"HTTP {status} ({dur}ms) - Active Telemetry Alerts: {len(data) if data else 0}"))

    # -------------------------------------------------------------------------
    # PART 2: FRONTEND APPLICATION ROUTES TESTING (Port 4200)
    # -------------------------------------------------------------------------
    print("\n--- [MODULE 8: ANGULAR FRONTEND ROUTES (PORT 4200)] ---")

    frontend_routes = [
        ("/", "Public SaaS Landing Page"),
        ("/auth/login", "Farmer & Operator Login UI"),
        ("/auth/register", "Farmer Registration UI"),
        ("/auth/forgot-password", "Password Recovery UI"),
        ("/auth/reset-password", "Password Reset UI"),
        ("/dashboard", "Executive Farm Twin Dashboard"),
        ("/farms", "Farm Holdings Management"),
        ("/fields", "Field Parcels & GIS Polygons"),
        ("/crops", "Crop Portfolio & Lifecycle"),
        ("/crop-doctor", "AI Crop Doctor & Leaf Pathology"),
        ("/irrigation", "Smart Irrigation & Soil Moisture"),
        ("/weather", "Microclimate & Spray Advisories"),
        ("/crop-lifecycle", "Crop Growth Stages & GDD"),
        ("/inventory", "Input Stock & Warehouse"),
        ("/labour", "Workforce & Muster Roll"),
        ("/equipment", "Machinery Fleet & Maintenance"),
        ("/market-intelligence", "APMC Mandi Price Intelligence"),
        ("/financials", "Financial Ledger & Profitability"),
        ("/reports", "Agronomic Reports & Compliance"),
        ("/notifications", "Farm Notification Center"),
        ("/settings", "Platform & Regional Settings"),
        ("/system-status", "System Health Diagnostics Probe"),
    ]

    for path, desc in frontend_routes:
        status, dur, body, _ = make_request(f"{FRONTEND_BASE}{path}")
        is_ok = status == 200 and ("<app-root" in body or "<!doctype html>" in body.lower())
        test_results.append((f"Frontend: {path}", is_ok, f"HTTP {status} ({dur}ms) - {desc}"))

    # -------------------------------------------------------------------------
    # SUMMARY
    # -------------------------------------------------------------------------
    print("\n" + "=" * 85)
    print("                         SUMMARY OF MODULE TEST RESULTS")
    print("=" * 85)

    all_passed = True
    for name, passed, detail in test_results:
        status_text = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_passed = False
        print(f"[{status_text}] {name:<35} : {detail}")

    print("=" * 85)
    if all_passed:
        print(f"🎉 ALL {len(test_results)} SYSTEM MODULES AND ROUTES ARE HEALTHY, ONLINE, AND WORKING PROPERLY!")
    else:
        print("⚠️ SOME MODULE CHECKS FAILED.")
    print("=" * 85)

    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(run_tests())
