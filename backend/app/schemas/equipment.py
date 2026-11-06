from typing import Optional
from decimal import Decimal
from datetime import date, datetime
from pydantic import BaseModel, Field


class EquipmentBase(BaseModel):
    name: str = Field(..., max_length=150)
    equipment_type: str = Field(
        ...,
        description="TRACTOR, TILLER, SPRAYER, PUMP, HARVESTER, DRIP_CONTROLLER, OTHER"
    )
    model_number: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_price: Decimal = Field(default=Decimal("0.00"), ge=0)
    status: str = Field(default="OPERATIONAL", description="OPERATIONAL, MAINTENANCE, RETIRED")


class EquipmentCreate(EquipmentBase):
    farm_id: str


class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    equipment_type: Optional[str] = None
    model_number: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_price: Optional[Decimal] = Field(None, ge=0)
    status: Optional[str] = None


class EquipmentResponse(EquipmentBase):
    id: str
    farm_id: str
    next_service_due: Optional[date] = None
    maintenance_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EquipmentMaintenanceCreate(BaseModel):
    equipment_id: str
    maintenance_date: Optional[date] = None
    service_type: str = Field(default="ROUTINE", description="ROUTINE, REPAIR, OVERHAUL")
    cost: Decimal = Field(default=Decimal("0.00"), ge=0)
    description: str
    technician_name: Optional[str] = None
    next_service_due: Optional[date] = None


class EquipmentMaintenanceResponse(BaseModel):
    id: str
    equipment_id: str
    maintenance_date: date
    service_type: str
    cost: Decimal
    description: str
    technician_name: Optional[str]
    next_service_due: Optional[date]
    created_at: datetime
    equipment_name: Optional[str] = None

    class Config:
        from_attributes = True


class EquipmentSummaryResponse(BaseModel):
    total_equipment: int
    operational_count: int
    maintenance_count: int
    retired_count: int
    upcoming_services_count: int
