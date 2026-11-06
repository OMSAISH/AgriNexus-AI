from typing import Optional
from decimal import Decimal
from datetime import date, datetime
from pydantic import BaseModel, Field


class LabourBase(BaseModel):
    full_name: str = Field(..., max_length=150)
    phone_number: Optional[str] = None
    skill_type: str = Field(default="GENERAL", description="GENERAL, OPERATOR, HARVESTER, SUPERVISOR")
    daily_wage: Decimal = Field(..., ge=0)
    is_active: bool = True


class LabourCreate(LabourBase):
    farm_id: str


class LabourUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    skill_type: Optional[str] = None
    daily_wage: Optional[Decimal] = Field(None, ge=0)
    is_active: Optional[bool] = None


class LabourResponse(LabourBase):
    id: str
    farm_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LabourAttendanceCreate(BaseModel):
    labour_id: str
    farm_id: str
    attendance_date: Optional[date] = None
    status: str = Field(default="PRESENT", description="PRESENT, HALF_DAY, ABSENT")
    hours_worked: Decimal = Field(default=Decimal("8.0"), ge=0, le=24)
    wage_paid: Optional[Decimal] = None
    notes: Optional[str] = None


class LabourAttendanceResponse(BaseModel):
    id: str
    labour_id: str
    farm_id: str
    attendance_date: date
    status: str
    hours_worked: Decimal
    wage_paid: Decimal
    notes: Optional[str]
    created_at: datetime
    worker_name: Optional[str] = None

    class Config:
        from_attributes = True


class LabourSummaryResponse(BaseModel):
    total_workers: int
    active_workers: int
    today_present: int
    today_half_day: int
    today_absent: int
    month_to_date_wages: Decimal
