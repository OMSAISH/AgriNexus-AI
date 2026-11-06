from datetime import datetime
from typing import Optional, Dict, Any, List
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class FarmBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, description="Farm or holding name")
    village: str = Field(..., min_length=2, max_length=100)
    taluka: str = Field(..., min_length=2, max_length=100)
    district: str = Field(..., min_length=2, max_length=100)
    state: str = Field(default="Maharashtra", max_length=100)
    total_area_acres: Decimal = Field(..., gt=0, decimal_places=2, description="Total holding area in acres")
    area_unit: str = Field(default="acres", max_length=20)
    description: Optional[str] = Field(None, max_length=500)
    latitude: Decimal = Field(..., ge=-90, le=90, decimal_places=6)
    longitude: Decimal = Field(..., ge=-180, le=180, decimal_places=6)
    soil_type: str = Field(default="MEDIUM_BLACK", max_length=100)
    irrigation_source: str = Field(default="DRIP", max_length=50)
    boundary_geojson: Optional[Dict[str, Any]] = None


class FarmCreate(FarmBase):
    pass


class FarmUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    village: Optional[str] = None
    taluka: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    total_area_acres: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    area_unit: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    soil_type: Optional[str] = None
    irrigation_source: Optional[str] = None
    boundary_geojson: Optional[Dict[str, Any]] = None


class FarmResponse(FarmBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime


class FarmSummaryResponse(FarmResponse):
    fields_count: int = 0
    total_cultivated_acres: Decimal = Decimal("0.00")
