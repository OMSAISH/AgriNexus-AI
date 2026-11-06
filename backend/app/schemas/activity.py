from datetime import datetime, date
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class FarmActivityBase(BaseModel):
    farm_id: str
    field_id: Optional[str] = None
    crop_id: Optional[str] = None
    title: str = Field(..., min_length=2, max_length=150)
    activity_type: str = Field(..., max_length=50)
    status: str = Field(default="SCHEDULED", max_length=50)
    priority: str = Field(default="MEDIUM", max_length=20)
    scheduled_date: date = Field(default_factory=date.today)
    completed_date: Optional[date] = None
    cost: Decimal = Field(default=Decimal("0.00"), ge=0, decimal_places=2)
    assigned_to: Optional[str] = Field(None, max_length=150)
    notes: Optional[str] = None


class FarmActivityCreate(FarmActivityBase):
    pass


class FarmActivityUpdate(BaseModel):
    field_id: Optional[str] = None
    crop_id: Optional[str] = None
    title: Optional[str] = None
    activity_type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    scheduled_date: Optional[date] = None
    completed_date: Optional[date] = None
    cost: Optional[Decimal] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class FarmActivityResponse(FarmActivityBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
