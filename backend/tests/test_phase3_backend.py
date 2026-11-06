import uuid
import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.user import User
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop

client = TestClient(app)


@pytest.fixture(scope="session")
def demo_auth_token():
    """Login with seeded Rahata farmer credentials."""
    resp = client.post("/api/v1/auth/login", json={
        "email": "farmer.rahata@agrinexus.ai",
        "password": "Farmer@Rahata2026"
    })
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    data = resp.json()
    assert "access_token" in data
    return data["access_token"]


def test_1_health_and_database_connectivity():
    """Verify health probes."""
    resp1 = client.get("/api/v1/health")
    assert resp1.status_code == 200
    assert resp1.json()["status"] == "healthy"

    resp2 = client.get("/api/v1/health/database")
    assert resp2.status_code == 200
    assert resp2.json()["status"] == "connected"


def test_2_registration_and_validation():
    """Verify user registration, role restriction, and duplicate rejection."""
    unique_suffix = str(uuid.uuid4())[:8]
    test_email = f"farmer.{unique_suffix}@agrinexus.ai"

    # 1. Admin registration rejected
    bad_resp = client.post("/api/v1/auth/register", json={
        "email": f"admin.{unique_suffix}@agrinexus.ai",
        "full_name": "Admin Candidate",
        "password": "SecurePassword123",
        "role": "ADMIN"
    })
    assert bad_resp.status_code in (400, 422, 403)

    # 2. Valid farmer registration
    good_resp = client.post("/api/v1/auth/register", json={
        "email": test_email,
        "full_name": "Suresh Patel",
        "phone_number": "+91-9876543210",
        "preferred_language": "mr",
        "password": "Password@123",
        "role": "FARMER"
    })
    assert good_resp.status_code == 201
    data = good_resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_email
    assert data["user"]["preferred_language"] == "mr"

    # 3. Duplicate email rejection
    dup_resp = client.post("/api/v1/auth/register", json={
        "email": test_email,
        "full_name": "Duplicate Tester",
        "password": "Password@123",
        "role": "FARMER"
    })
    assert dup_resp.status_code == 400


def test_3_login_and_invalid_passwords():
    """Verify login authentication checks."""
    # Valid login
    resp = client.post("/api/v1/auth/login", json={
        "email": "farmer.rahata@agrinexus.ai",
        "password": "Farmer@Rahata2026"
    })
    assert resp.status_code == 200
    token = resp.json()["access_token"]

    # Invalid password
    bad_pass = client.post("/api/v1/auth/login", json={
        "email": "farmer.rahata@agrinexus.ai",
        "password": "WrongPassword999"
    })
    assert bad_pass.status_code == 401

    # Protected me endpoint with token
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "farmer.rahata@agrinexus.ai"


def test_4_unauthorized_access():
    """Verify endpoints block requests without valid JWT token."""
    resp = client.get("/api/v1/farms")
    assert resp.status_code == 401

    resp2 = client.get("/api/v1/dashboard/summary")
    assert resp2.status_code == 401


def test_5_farm_crud_operations(demo_auth_token):
    """Verify complete Farm lifecycle: Create, Read, Update, Delete."""
    headers = {"Authorization": f"Bearer {demo_auth_token}"}

    # 1. Create a test farm
    farm_payload = {
        "name": "Test Experimental Plot",
        "village": "Shirdi Rural",
        "taluka": "Rahata",
        "district": "Ahilyanagar",
        "state": "Maharashtra",
        "total_area_acres": 2.50,
        "area_unit": "acres",
        "description": "Experimental organic testing block",
        "latitude": 19.760000,
        "longitude": 74.470000,
        "soil_type": "MEDIUM_BLACK",
        "irrigation_source": "DRIP"
    }
    create_resp = client.post("/api/v1/farms", json=farm_payload, headers=headers)
    assert create_resp.status_code == 201
    farm_data = create_resp.json()
    farm_id = farm_data["id"]
    assert farm_data["name"] == farm_payload["name"]

    # 2. Retrieve farm by ID
    get_resp = client.get(f"/api/v1/farms/{farm_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == farm_id

    # 3. Update farm
    update_resp = client.put(f"/api/v1/farms/{farm_id}", json={
        "name": "Updated Experimental Plot",
        "description": "Updated agronomic description"
    }, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "Updated Experimental Plot"

    # 4. Delete farm
    del_resp = client.delete(f"/api/v1/farms/{farm_id}", headers=headers)
    assert del_resp.status_code == 200

    # 5. Confirm deletion
    check_resp = client.get(f"/api/v1/farms/{farm_id}", headers=headers)
    assert check_resp.status_code == 404


def test_6_field_and_crop_creation(demo_auth_token):
    """Verify Field and Crop creation on Rahata farm."""
    headers = {"Authorization": f"Bearer {demo_auth_token}"}

    # Fetch existing farm
    farms_resp = client.get("/api/v1/farms", headers=headers)
    assert farms_resp.status_code == 200
    farms = farms_resp.json()
    assert len(farms) > 0
    farm_id = farms[0]["id"]

    # Create new subfield
    field_resp = client.post("/api/v1/fields", json={
        "farm_id": farm_id,
        "name": "Integration Test Parcel",
        "area_acres": 1.25,
        "soil_type": "MEDIUM_BLACK",
        "soil_ph": 7.3,
        "location": "North quadrant",
        "irrigation_type": "DRIP"
    }, headers=headers)
    assert field_resp.status_code == 201
    field_id = field_resp.json()["id"]

    # Create crop on that field
    crop_resp = client.post("/api/v1/crops", json={
        "field_id": field_id,
        "crop_name": "Wheat Durum",
        "crop_type": "WHEAT",
        "variety": "Pusa Tejas",
        "sowing_date": "2024-11-15",
        "current_stage": "SOWING",
        "cultivated_area": 1.25,
        "expected_yield": 35.00,
        "current_status": "ACTIVE"
    }, headers=headers)
    assert crop_resp.status_code == 201
    crop_id = crop_resp.json()["id"]

    # Verify crop retrieval
    get_crop = client.get(f"/api/v1/crops/{crop_id}", headers=headers)
    assert get_crop.status_code == 200
    assert get_crop.json()["crop_name"] == "Wheat Durum"

    # Clean up test crop & field
    client.delete(f"/api/v1/crops/{crop_id}", headers=headers)
    client.delete(f"/api/v1/fields/{field_id}", headers=headers)


def test_7_user_data_isolation(demo_auth_token):
    """Verify Farmer B cannot access or modify Farmer A's farm records."""
    headers_farmer_a = {"Authorization": f"Bearer {demo_auth_token}"}

    # Create Farm as Farmer A
    farm_a_resp = client.post("/api/v1/farms", json={
        "name": "Farmer A Secret Orchard",
        "village": "Rahata",
        "taluka": "Rahata",
        "district": "Ahilyanagar",
        "total_area_acres": 3.00,
        "latitude": 19.7200,
        "longitude": 74.4900
    }, headers=headers_farmer_a)
    assert farm_a_resp.status_code == 201
    farm_a_id = farm_a_resp.json()["id"]

    # Register Farmer B
    farmer_b_email = f"farmer_b_{uuid.uuid4().hex[:6]}@agrinexus.ai"
    reg_b = client.post("/api/v1/auth/register", json={
        "email": farmer_b_email,
        "full_name": "Farmer B",
        "password": "Password@123",
        "role": "FARMER"
    })
    assert reg_b.status_code == 201
    token_b = reg_b.json()["access_token"]
    headers_farmer_b = {"Authorization": f"Bearer {token_b}"}

    # Farmer B attempts to GET Farmer A's farm -> 403 Forbidden
    unauthorized_get = client.get(f"/api/v1/farms/{farm_a_id}", headers=headers_farmer_b)
    assert unauthorized_get.status_code == 403

    # Farmer B attempts to PUT Farmer A's farm -> 403 Forbidden
    unauthorized_put = client.put(f"/api/v1/farms/{farm_a_id}", json={"name": "Hacked Farm"}, headers=headers_farmer_b)
    assert unauthorized_put.status_code == 403

    # Farmer B attempts to DELETE Farmer A's farm -> 403 Forbidden
    unauthorized_del = client.delete(f"/api/v1/farms/{farm_a_id}", headers=headers_farmer_b)
    assert unauthorized_del.status_code == 403

    # Clean up Farmer A's test farm
    client.delete(f"/api/v1/farms/{farm_a_id}", headers=headers_farmer_a)


def test_8_dashboard_and_financial_calculations(demo_auth_token):
    """Verify dashboard KPI metrics and financial summaries reflect database records."""
    headers = {"Authorization": f"Bearer {demo_auth_token}"}

    # Fetch Dashboard Summary
    dash_resp = client.get("/api/v1/dashboard/summary", headers=headers)
    assert dash_resp.status_code == 200
    dash = dash_resp.json()

    assert dash["total_farms"] >= 1
    assert dash["total_fields"] >= 3
    assert float(dash["total_cultivated_acres"]) >= 5.0
    assert float(dash["recorded_income"]) > 0
    assert float(dash["total_expenses"]) > 0
    assert float(dash["estimated_profit"]) == float(dash["recorded_income"]) - float(dash["total_expenses"])
    assert len(dash["crop_distribution"]) > 0

    # Fetch Financial Summary
    fin_resp = client.get("/api/v1/finance/summary", headers=headers)
    assert fin_resp.status_code == 200
    fin = fin_resp.json()

    assert float(fin["total_income"]) == float(dash["recorded_income"])
    assert float(fin["total_expenses"]) == float(dash["total_expenses"])
    assert float(fin["net_profit"]) == float(dash["estimated_profit"])
    assert len(fin["income_categories"]) > 0
    assert len(fin["expense_categories"]) > 0
