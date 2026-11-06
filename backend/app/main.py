import logging
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.core.exceptions import (
    AgriNexusException,
    agrinexus_exception_handler,
    validation_exception_handler,
    global_exception_handler,
)
from app.api.v1.router import api_v1_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger("agrinexus.main")

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Farm Operations & Decision Support Platform REST API",
    version="1.0.0-phase3",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Custom Exception Handlers
app.add_exception_handler(AgriNexusException, agrinexus_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Mount API Routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/api/v1/docs", include_in_schema=False)
def docs_redirect():
    return RedirectResponse(url="/docs")


@app.get("/", tags=["Root"])
def root_redirect():
    """Root entrypoint providing basic service info and documentation links."""
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "documentation": f"{settings.API_V1_STR}/docs",
        "health_check": f"{settings.API_V1_STR}/health",
        "database_health": f"{settings.API_V1_STR}/health/database",
    }
