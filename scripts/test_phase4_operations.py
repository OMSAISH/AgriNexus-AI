import sys
import requests
import json
from decimal import Decimal

BASE_URL = "http://localhost:8000"

def test_operations():
    print("Testing AgriNexus AI Farm Operations Management APIs...")
    
    # 1. Login
    login_resp = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
        "email": "farmer.rahata@agrinexus.ai",
        "password": "Farmer@Rahata2026"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✓ Farmer Login successful")

    # 2. Farm & Fields
    farms_resp = requests.get(f"{BASE_URL}/api/v1/farms", headers=headers)
    assert farms_resp.status_code == 200
    farms = farms_resp.json()
    assert len(farms) > 0
    farm_id = farms[0]["id"]
    farm_total_area = float(farms[0]["total_area_acres"])
    print(f"✓ Farm retrieved: {farms[0]['name']} (Total Area: {farm_total_area} Ac)")

    # 3. Test Field Area Limit Validation (Reject area exceeding farm size)
    excess_resp = requests.post(f"{BASE_URL}/api/v1/fields", headers=headers, json={
        "farm_id": farm_id,
        "name": "Excessive Plot",
        "area_acres": farm_total_area + 5.0,
        "soil_type": "BLACK_REGUR",
        "irrigation_type": "DRIP"
    })
    assert excess_resp.status_code == 400, f"Expected 400 rejection for excess area, got {excess_resp.status_code}"
    print(f"✓ Field area validation properly blocked excess area: {excess_resp.json()['detail']}")

    # 4. Inventory APIs
    inv_resp = requests.get(f"{BASE_URL}/api/v1/inventory/items", headers=headers)
    assert inv_resp.status_code == 200
    items = inv_resp.json()
    assert len(items) >= 5, f"Expected at least 5 items, got {len(items)}"
    target_item = items[0]
    print(f"✓ Retrieved {len(items)} inventory items. Target: {target_item['name']} (Stock: {target_item['current_stock']} {target_item['unit']})")

    # 5. Outward Transaction & Negative Stock Prevention
    # Replenish stock first to ensure test idempotency
    inward_resp = requests.post(f"{BASE_URL}/api/v1/inventory/transactions", headers=headers, json={
        "item_id": target_item["id"],
        "transaction_type": "INWARD",
        "quantity": "5.00",
        "notes": "Test stock replenishment"
    })
    assert inward_resp.status_code == 201

    # Test outward transaction
    outward_resp = requests.post(f"{BASE_URL}/api/v1/inventory/transactions", headers=headers, json={
        "item_id": target_item["id"],
        "transaction_type": "OUTWARD",
        "quantity": "1.00",
        "notes": "Field application test"
    })
    assert outward_resp.status_code == 201, f"Outward failed: {outward_resp.text}"
    print(f"✓ Outward transaction logged: -1.00 {target_item['unit']}")

    # Test negative stock prevention
    huge_outward_resp = requests.post(f"{BASE_URL}/api/v1/inventory/transactions", headers=headers, json={
        "item_id": target_item["id"],
        "transaction_type": "OUTWARD",
        "quantity": "99999.00",
        "notes": "Invalid excessive withdrawal"
    })
    assert huge_outward_resp.status_code == 400, "Negative stock was not prevented!"
    print(f"✓ Negative stock prevention successfully blocked transaction: {huge_outward_resp.json()['detail']}")

    # 6. Low stock alerts
    alerts_resp = requests.get(f"{BASE_URL}/api/v1/inventory/alerts", headers=headers)
    assert alerts_resp.status_code == 200
    alerts = alerts_resp.json()
    print(f"✓ Low-stock alerts endpoint: {len(alerts)} alerts currently active")

    # 7. Labour Management APIs
    labour_resp = requests.get(f"{BASE_URL}/api/v1/labour/workers", headers=headers)
    assert labour_resp.status_code == 200
    workers = labour_resp.json()
    assert len(workers) >= 4, f"Expected 4 workers, got {len(workers)}"
    print(f"✓ Retrieved {len(workers)} farm workers")

    # Log attendance
    att_resp = requests.post(f"{BASE_URL}/api/v1/labour/attendance", headers=headers, json={
        "labour_id": workers[0]["id"],
        "farm_id": farm_id,
        "status": "PRESENT",
        "hours_worked": "8.0",
        "notes": "Weeding and moisture inspection"
    })
    assert att_resp.status_code == 201
    print(f"✓ Recorded attendance with calculated wage ₹{att_resp.json()['wage_paid']}")

    # Summary
    summary_resp = requests.get(f"{BASE_URL}/api/v1/labour/summary", headers=headers)
    assert summary_resp.status_code == 200
    l_sum = summary_resp.json()
    print(f"✓ Labour Summary: Active={l_sum['active_workers']}, Today Present={l_sum['today_present']}, MTD Wages=₹{l_sum['month_to_date_wages']}")

    # 8. Equipment Management APIs
    eq_resp = requests.get(f"{BASE_URL}/api/v1/equipment/items", headers=headers)
    assert eq_resp.status_code == 200
    equipment = eq_resp.json()
    assert len(equipment) >= 4
    print(f"✓ Retrieved {len(equipment)} equipment assets")

    # Log maintenance
    maint_resp = requests.post(f"{BASE_URL}/api/v1/equipment/maintenance", headers=headers, json={
        "equipment_id": equipment[0]["id"],
        "service_type": "ROUTINE",
        "cost": "1200.00",
        "description": "Air filter cleaning and lubrication check",
        "technician_name": "Rahata Agro Mechanics"
    })
    assert maint_resp.status_code == 201
    print("✓ Recorded equipment maintenance service record")

    # Equipment summary
    eq_sum_resp = requests.get(f"{BASE_URL}/api/v1/equipment/summary", headers=headers)
    assert eq_sum_resp.status_code == 200
    print(f"✓ Equipment summary: Operational={eq_sum_resp.json()['operational_count']}, Total={eq_sum_resp.json()['total_equipment']}")

    # 9. Crop Lifecycle & Phenology Transition
    crops_resp = requests.get(f"{BASE_URL}/api/v1/crops", headers=headers)
    assert crops_resp.status_code == 200
    crops = crops_resp.json()
    assert len(crops) > 0
    target_crop = crops[0]

    # Advance stage
    stage_resp = requests.post(f"{BASE_URL}/api/v1/crops/{target_crop['id']}/stage", headers=headers, json={
        "new_stage": "MATURITY",
        "notes": "Bulbs reached full physiological maturity; preparing for drying cycle."
    })
    assert stage_resp.status_code == 200
    assert stage_resp.json()["current_stage"] == "MATURITY"
    print(f"✓ Phenological growth stage advanced to MATURITY for {target_crop['crop_name']}")

    # Crop performance summary
    perf_resp = requests.get(f"{BASE_URL}/api/v1/crops/performance/summary", headers=headers)
    assert perf_resp.status_code == 200
    perf = perf_resp.json()
    print(f"✓ Crop performance summary: Total Cultivated={perf['total_cultivated_area']} Ac, Stages={perf['stages_breakdown']}")

    # 10. Dashboard Operational KPIs
    dash_resp = requests.get(f"{BASE_URL}/api/v1/dashboard/summary", headers=headers)
    assert dash_resp.status_code == 200
    dash = dash_resp.json()
    print(f"✓ Dashboard KPIs: Farms={dash['total_farms']}, Cultivated={dash['total_cultivated_acres']} Ac, Profit=₹{dash['estimated_profit']}, LowStock={dash['low_stock_alerts_count']}, Labour={dash['active_labour_count']}, Machinery={dash['operational_machinery_count']}")

    print("\n🎉 ALL 10 PHASE 4 FARM OPERATIONS BACKEND TESTS PASSED COMPLETELY!")

if __name__ == "__main__":
    test_operations()
