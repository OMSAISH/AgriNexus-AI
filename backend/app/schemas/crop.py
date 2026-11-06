from datetime import datetime, date
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict
from app.models.crop import CropTypeEnum, CropStageEnum


class CropBase(BaseModel):
    field_id: str
    crop_name: str = Field(..., min_length=2, max_length=100)
    crop_type: CropTypeEnum = CropTypeEnum.ONION
    variety: Optional[str] = Field(None, max_length=100)
    sowing_date: date = Field(default_factory=date.today)
    expected_harvest_date: Optional[date] = None
    actual_harvest_date: Optional[date] = None
    current_stage: CropStageEnum = CropStageEnum.VEGETATIVE
    cultivated_area: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    expected_yield: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    current_status: str = Field(default="ACTIVE", max_length=50)
    target_moisture_min: Decimal = Field(default=Decimal("40.0"), decimal_places=1)
    target_moisture_max: Decimal = Field(default=Decimal("70.0"), decimal_places=1)


class CropCreate(CropBase):
    pass


class CropUpdate(BaseModel):
    crop_name: Optional[str] = Field(None, min_length=2, max_length=100)
    crop_type: Optional[CropTypeEnum] = None
    variety: Optional[str] = None
    sowing_date: Optional[date] = None
    expected_harvest_date: Optional[date] = None
    actual_harvest_date: Optional[date] = None
    current_stage: Optional[CropStageEnum] = None
    cultivated_area: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    expected_yield: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    current_status: Optional[str] = None
    target_moisture_min: Optional[Decimal] = None
    target_moisture_max: Optional[Decimal] = None


class CropResponse(CropBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime


class CropDetailResponse(CropResponse):
    field_name: Optional[str] = None
    farm_id: Optional[str] = None
    farm_name: Optional[str] = None


class CropCycleBase(BaseModel):
    crop_id: str
    field_id: str
    cycle_name: str = Field(..., min_length=2, max_length=100)
    season: str = Field(..., max_length=50)  # KHARIF, RABI, SUMMER, ANNUAL
    start_date: date = Field(default_factory=date.today)
    end_date: Optional[date] = None
    target_yield_quintals: Optional[Decimal] = None
    actual_yield_quintals: Optional[Decimal] = None
    status: str = Field(default="ACTIVE", max_length=50)
    notes: Optional[str] = None


class CropCycleCreate(CropCycleBase):
    pass


class CropCycleResponse(CropCycleBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime

class CropStageTransitionRequest(BaseModel):
    new_stage: CropStageEnum
    notes: Optional[str] = None
    transition_date: Optional[date] = None


class CropPerformanceSummaryItem(BaseModel):
    crop_id: str
    crop_name: str
    variety: Optional[str]
    cultivated_area: Decimal
    current_stage: str
    expected_yield: Optional[Decimal]
    actual_yield: Optional[Decimal]
    yield_efficiency_pct: Optional[float]
    status: str


class CropPerformanceSummaryResponse(BaseModel):
    total_active_crops: int
    total_cultivated_area: Decimal
    stages_breakdown: dict
    crops: list[CropPerformanceSummaryItem]
