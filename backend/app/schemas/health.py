from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    success: bool = True
    status: str = Field(..., description="healthy")
    timestamp: datetime
    service: str = Field(..., description="AgriNexus AI Backend API")
    environment: str = Field(..., description="development")
    version: str = Field(..., description="1.0.0-phase3")


class DatabaseHealthResponse(BaseModel):
    success: bool = True
    status: str = Field(..., description="connected")
    timestamp: datetime
    database_type: str = Field("PostgreSQL", description="PostgreSQL")
    database_name: str = Field(..., description="agrinexus_db")
    version: Optional[str] = None
    latency_ms: Optional[float] = None
    error: Optional[str] = None
    diagnostics: Dict[str, Any] = Field(default_factory=dict)
