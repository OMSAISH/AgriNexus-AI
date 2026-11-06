from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.farms import router as farms_router
from app.api.v1.fields import router as fields_router
from app.api.v1.crops import router as crops_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.finance import router as finance_router
from app.api.v1.activities import router as activities_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.inventory import router as inventory_router
from app.api.v1.labour import router as labour_router
from app.api.v1.equipment import router as equipment_router

api_v1_router = APIRouter()
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(farms_router)
api_v1_router.include_router(fields_router)
api_v1_router.include_router(crops_router)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(finance_router)
api_v1_router.include_router(activities_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(inventory_router)
api_v1_router.include_router(labour_router)
api_v1_router.include_router(equipment_router)
