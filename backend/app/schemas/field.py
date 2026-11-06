from datetime import datetime
from typing import Optional, Dict, Any
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class FieldBase(BaseModel):
    farm_id: str
    name: str = Field(..., min_length=2, max_length=100)
    area_acres: Decimal = Field(..., gt=0, decimal_places=2)
    soil_type: str = Field(default="MEDIUM_BLACK", max_length=100)
    soil_ph: Decimal = Field(default=Decimal("7.2"), ge=0, le=14, decimal_places=1)
    location: Optional[str] = Field(None, max_length=200)
    irrigation_type: str = Field(default="DRIP", max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    boundary_geojson: Optional[Dict[str, Any]] = None


class FieldCreate(FieldBase):
    pass


class FieldUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    area_acres: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    soil_type: Optional[str] = None
    soil_ph: Optional[Decimal] = Field(None, ge=0, le=14, decimal_places=1)
    location: Optional[str] = None
    irrigation_type: Optional[str] = None
    description: Optional[str] = None
    boundary_geojson: Optional[Dict[str, Any]] = None


class FieldResponse(FieldBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime


class FieldDetailResponse(FieldResponse):
    farm_name: Optional[str] = None
    active_crop_name: Optional[str] = None
