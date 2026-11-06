import time
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.core.database import get_db, check_database_connection
from app.schemas.health import HealthCheckResponse, DatabaseHealthResponse

router = APIRouter(prefix="/health", tags=["Health & System Diagnostics"])


@router.get(
    "",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="Application Health Probe",
    description="Returns backend service liveness status and environment metadata."
)
def get_application_health() -> HealthCheckResponse:
    return HealthCheckResponse(
        success=True,
        status="healthy",
        timestamp=datetime.now(timezone.utc),
        service="AgriNexus AI Backend API",
        environment=settings.ENVIRONMENT,
        version="1.0.0-phase1",
    )


@router.get(
    "/database",
    response_model=DatabaseHealthResponse,
    summary="Database Connectivity & Readiness Probe",
    description="Executes a live query on the configured PostgreSQL database and returns latency metrics."
)
def get_database_health(response: Response, db: Session = Depends(get_db)) -> DatabaseHealthResponse:
    start_time = time.perf_counter()
    try:
        # Measure query latency
        query_start = time.perf_counter()
        db_version = db.execute(text("SELECT version();")).scalar()
        db_name = db.execute(text("SELECT current_database();")).scalar()
        current_time = db.execute(text("SELECT CURRENT_TIMESTAMP;")).scalar()
        latency_ms = round((time.perf_counter() - query_start) * 1000, 2)

        return DatabaseHealthResponse(
            success=True,
            status="connected",
            timestamp=datetime.now(timezone.utc),
            database_type="PostgreSQL",
            database_name=str(db_name),
            version=str(db_version),
            latency_ms=latency_ms,
            error=None,
            diagnostics={
                "server_host": settings.POSTGRES_SERVER,
                "server_port": settings.POSTGRES_PORT,
                "database_time": str(current_time),
                "pool_size": 10,
            },
        )
    except Exception as exc:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return DatabaseHealthResponse(
            success=False,
            status="disconnected",
            timestamp=datetime.now(timezone.utc),
            database_type="PostgreSQL",
            database_name=settings.POSTGRES_DB,
            version=None,
            latency_ms=None,
            error=str(exc),
            diagnostics={
                "server_host": settings.POSTGRES_SERVER,
                "server_port": settings.POSTGRES_PORT,
                "recommendation": "Check if PostgreSQL is running on port 5433 and database 'agrinexus_db' exists."
            },
        )
