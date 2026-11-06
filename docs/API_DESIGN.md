# AgriNexus AI — REST API Design Specification
**API Version:** v1 (`/api/v1`)  
**Specification Format:** OpenAPI 3.1 / RFC 7807 compliant  
**Base URL:** `http://localhost:8000/api/v1`  
**Authentication Scheme:** Bearer JWT in `Authorization` HTTP Header

---

## 1. Global API Conventions

### 1.1 Standard Response Envelopes

#### Success Envelope
```json
{
  "success": true,
  "timestamp": "2026-11-05T19:25:00Z",
  "data": { ... },
  "metadata": {
    "page": 1,
    "page_size": 20,
    "total_records": 100
  }
}
```

#### RFC 7807 Standard Error Envelope
```json
{
  "success": false,
  "timestamp": "2026-11-05T19:25:00Z",
  "error": {
    "type": "https://agrinexus.ai/errors/resource-not-found",
    "title": "Resource Not Found",
    "status": 404,
    "detail": "Parcel with ID 'a1b2c3d4' does not exist under your farm.",
    "instance": "/api/v1/parcels/a1b2c3d4",
    "validation_errors": []
  }
}
```

---

## 2. API Endpoint Matrix

### 2.1 Core & Health Monitoring

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | System liveness probe, database ping, and AI engine status. |
| `GET` | `/version` | Public | Returns semantic version, environment, and release commit. |

---

### 2.2 Authentication & Profile Management (`/api/v1/auth`)

| Method | Endpoint | Access | Request Body | Response Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | `{ email, password, full_name, phone_number, role }` | Created user details & access token |
| `POST` | `/auth/login` | Public | `{ username (email), password }` | `{ access_token, refresh_token, token_type, user }` |
| `POST` | `/auth/refresh` | Public | `{ refresh_token }` | `{ access_token, token_type }` |
| `GET` | `/auth/me` | Authenticated | *None* | Detailed profile of logged-in user |

---

### 2.3 Farm & Geospatial Parcel Management (`/api/v1/farms`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/farms` | Authenticated | List all farms belonging to current user with summary stats. |
| `POST` | `/farms` | Farmer/Admin | Register a new agricultural holding (acres, village, coordinates). |
| `GET` | `/farms/{farm_id}` | Authenticated | Detailed farm metadata, aggregated acreage, and soil profile. |
| `PUT` | `/farms/{farm_id}` | Owner/Admin | Update farm parameters (e.g., irrigation setup, soil type). |
| `GET` | `/farms/{farm_id}/parcels` | Authenticated | Fetch all parcels with Leaflet-compatible GeoJSON polygons. |
| `POST` | `/farms/{farm_id}/parcels` | Owner/Admin | Add a new crop parcel with GeoJSON boundary and crop type. |
| `GET` | `/parcels/{parcel_id}` | Authenticated | Single parcel details, active crop stage, and test history. |
| `PUT` | `/parcels/{parcel_id}` | Owner/Admin | Update parcel crop stage, planting dates, or boundary. |
| `DELETE` | `/parcels/{parcel_id}` | Owner/Admin | Soft-delete or archive a parcel. |

---

### 2.4 Soil Health & Agronomic Advisory (`/api/v1/soil`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/soil/tests` | Authenticated | Record laboratory soil test results (pH, N-P-K, EC, OC). |
| `GET` | `/soil/parcels/{parcel_id}/latest` | Authenticated | Retrieve latest soil health card with nutrient status indicators. |
| `GET` | `/soil/parcels/{parcel_id}/recommendations` | Authenticated | Calculate targeted NPK fertilizer recommendations based on crop type. |

---

### 2.5 AI Crop Disease Diagnostics (`/api/v1/crops`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/crops/diagnose` | Authenticated | Multipart upload (`image`, `parcel_id`, `crop_type`). Runs vision model inference. |
| `GET` | `/crops/scans/history` | Authenticated | Paginated history of past scans for the farm/parcel. |
| `GET` | `/crops/scans/{scan_id}` | Authenticated | Full diagnostic report with symptoms, chemical, and organic treatments. |
| `GET` | `/crops/supported-diseases` | Public | Master taxonomy of detectable diseases for Onion, Soybean, Sugarcane. |

---

### 2.6 Microclimate & Agro-Meteorology (`/api/v1/weather`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/weather/current` | Authenticated | Current temperature, humidity, precipitation, and wind for farm coordinates. |
| `GET` | `/weather/forecast` | Authenticated | 7-day hourly and daily forecast with spray/irrigation advisories. |
| `GET` | `/weather/historical` | Authenticated | 30-day precipitation and thermal accumulation (GDD). |

---

### 2.7 APMC Mandi Market Intelligence (`/api/v1/market`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/market/prices` | Authenticated | Filterable mandi commodity prices (Onion, Soybean, Sugarcane) across Mandis. |
| `GET` | `/market/trends` | Authenticated | 30-day and 90-day modal price trend curves for Apache ECharts visualization. |
| `GET` | `/market/harvest-advisory` | Authenticated | Strategic timing advisory indicating whether to sell immediately or store. |

---

### 2.8 Executive Dashboard Analytics (`/api/v1/analytics`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/analytics/overview` | Authenticated | Consolidated KPI telemetry: Active acreage, crop distribution, pending alerts, soil readiness. |
| `GET` | `/analytics/crop-distribution` | Authenticated | Acreage breakdown formatted for ECharts Donut chart. |
| `GET` | `/analytics/soil-radar` | Authenticated | Multi-axis NPK, pH, and OC radar dataset for ECharts. |

---

## 3. Detailed Request & Response Payloads

### 3.1 Authentication: Login Request & Response

#### Request (`POST /api/v1/auth/login`)
```json
{
  "email": "farmer.rahata@agrinexus.ai",
  "password": "Password123!"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-05T19:25:00Z",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "7b68903c-83b6-4b8c-b63e-f1cf0ea8b19a",
      "email": "farmer.rahata@agrinexus.ai",
      "full_name": "Dnyaneshwar Kisan Shinde",
      "role": "FARMER"
    }
  }
}
```

---

### 3.2 AI Diagnostic: Multipart Scan Upload

#### Response (`200 OK`)
```json
{
  "success": true,
  "timestamp": "2026-11-05T19:25:30Z",
  "data": {
    "scan_id": "90e386da-e7cb-4b53-9d48-356a1bce8ef4",
    "crop_type": "ONION",
    "detected_condition": "Purple Blotch (Alternaria porri)",
    "confidence_score": 0.942,
    "severity_level": "MODERATE",
    "symptoms": "Small, water-soaked lesions on older leaves, rapidly turning brown to purple with chlorotic halos.",
    "treatment": {
      "chemical": [
        "Foliar spray of Mancozeb 75% WP @ 2.5g/L water.",
        "Alternatively, Tebuconazole 25.9% EC @ 1.0ml/L water at 10-day intervals."
      ],
      "organic": [
        "Spray *Trichoderma viride* @ 5g/L water during early morning hours.",
        "Ensure good drainage and avoid overhead sprinkler irrigation."
      ]
    },
    "urgent_action_required": true
  }
}
```
