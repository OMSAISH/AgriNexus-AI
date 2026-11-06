# AgriNexus AI — Intelligent Farm Operations & Decision Support Platform

[![Project](https://img.shields.io/badge/Project-AgriNexus_AI-2d6a4f.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-Angular_19+-1b4332.svg)](https://angular.dev)
[![Backend](https://img.shields.io/badge/Backend-FastAPI_Python_3.11+-40916c.svg)](https://fastapi.tiangolo.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_18-52b788.svg)](https://www.postgresql.org)
[![HCL](https://img.shields.io/badge/Evaluation-HCL_Academic_Project-blue.svg)](#)

---

## 👥 Project Team (Group 9)

- **Omsaish Kishor Dhokchaule**
- **Sahil Keshav Jawale**
- **Sarthak Balasaheb Harde**
- **Abhijeet Pankaj Kanawade**
- **Prathamesh Satish Shinde**

**Primary Case Study:** 5.0-acre agricultural holding in **Rahata Taluka, Ahilyanagar (Ahmednagar) District, Maharashtra** ($19.7126^\circ\text{ N}, 74.4842^\circ\text{ E}$).  
**Crops in Scope:** Rabi Onion (*Bhima Super*, 2.0 acres), Soybean (*JS 335*, 1.5 acres), Sugarcane (*Co 86032*, 1.5 acres).

---

## 🏗️ Repository Architecture

```text
AgriNexus-AI/
├── docs/                             # Core Architectural Specifications
│   ├── PROJECT_ARCHITECTURE.md       # C4 diagrams, responsibilities, trade-offs
│   ├── DATABASE_DESIGN.md            # PostgreSQL schema, ER diagram, indices
│   ├── API_DESIGN.md                 # REST OpenAPI v3.1 endpoints & RFC 7807 errors
│   ├── DEVELOPMENT_ROADMAP.md        # 7-phase execution roadmap & acceptance criteria
│   ├── COMPONENT_HIERARCHY.md        # Angular standalone hierarchy & design system
│   └── SECURITY_PLAN.md              # Threat model, JWT lifecycle, RBAC, input safety
│
├── backend/                          # FastAPI REST Application
│   ├── app/
│   │   ├── main.py                   # FastAPI entry point, CORS & exception handlers
│   │   ├── core/                     # Database, security (bcrypt/JWT), config
│   │   ├── models/                   # SQLAlchemy models (User, Role, Farm, Field, Crop)
│   │   ├── schemas/                  # Pydantic validation DTOs (Health, Auth)
│   │   └── api/v1/                   # REST endpoints (/health, /health/database, /auth)
│   ├── alembic/                      # Database migrations (PostgreSQL)
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Backend environment variable template
│   └── run.py                        # Local ASGI launcher
│
├── frontend/                         # Angular 19+ Application (TypeScript + SCSS)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                 # Centralized ApiService, HealthService, AuthService
│   │   │   ├── layout/               # AppLayout (Navbar, Outlet, Footer)
│   │   │   ├── shared/               # Reusable Navbar and Footer with design tokens
│   │   │   └── features/             # Lazy-loaded feature routes
│   │   │       ├── landing/          # Overview & case study highlights
│   │   │       ├── auth/             # Reactive forms for Login & Registration
│   │   │       ├── dashboard/        # Farm twin summary & plot allocation
│   │   │       ├── system-status/    # Live Triple-Handshake diagnostic probe
│   │   │       └── not-found/        # 404 page
│   │   ├── environments/             # API base URL configuration
│   │   └── styles.scss               # AgTech palette tokens (Forest, Emerald, Sage)
│   └── package.json                  # Node dependencies
│
└── scripts/
    ├── init_db.py                    # Database seeding script for Rahata case study
    └── test_connectivity.py          # Automated Phase 1 verification test suite
```

---

## ⚡ Quick Start & Verification

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is active. In this environment, PostgreSQL 18 is running on port `5433`:
```bash
# Verify database connection and seed initial case study data
python3 scripts/init_db.py
```

### 2. Backend Setup & Run (FastAPI)
```bash
cd backend

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run ASGI server on http://localhost:8000
python3 run.py
```
* Interactive Swagger Docs: `http://localhost:8000/api/v1/docs`
* Health Endpoint: `http://localhost:8000/api/v1/health`
* Database Probe: `http://localhost:8000/api/v1/health/database`

### 3. Frontend Setup & Run (Angular)
```bash
cd frontend

# Run local development server on http://localhost:4200
ng serve
```
* Application Home: `http://localhost:4200`
* Real-Time Triple-Handshake Probe: `http://localhost:4200/system-status`
* Farmer Login: `http://localhost:4200/auth/login`
* Farm Twin Dashboard: `http://localhost:4200/dashboard`

### 4. Automated Verification Suite
Run the comprehensive 8-step test suite verifying PostgreSQL, FastAPI, JWT Auth, and Angular build:
```bash
python3 scripts/test_connectivity.py
```
Result: **8/8 Tests Passed** (0 failures).
