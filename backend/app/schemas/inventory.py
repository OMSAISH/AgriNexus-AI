from typing import Optional
from decimal import Decimal
from datetime import date, datetime
from pydantic import BaseModel, Field


class InventoryItemBase(BaseModel):
    name: str = Field(..., max_length=150)
    category: str = Field(..., description="SEEDS, FERTILIZER, PESTICIDE, TOOL, FUEL, OTHER")
    unit: str = Field(default="KG", description="KG, LITER, BAG, PACKET, NOS")
    current_stock: Decimal = Field(default=Decimal("0.00"), ge=0)
    reorder_level: Decimal = Field(default=Decimal("10.00"), ge=0)
    unit_price: Decimal = Field(default=Decimal("0.00"), ge=0)
    supplier: Optional[str] = None
    batch_number: Optional[str] = None
    expiry_date: Optional[date] = None


class InventoryItemCreate(InventoryItemBase):
    farm_id: str


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    current_stock: Optional[Decimal] = Field(None, ge=0)
    reorder_level: Optional[Decimal] = Field(None, ge=0)
    unit_price: Optional[Decimal] = Field(None, ge=0)
    supplier: Optional[str] = None
    batch_number: Optional[str] = None
    expiry_date: Optional[date] = None


class InventoryItemResponse(InventoryItemBase):
    id: str
    farm_id: str
    is_low_stock: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InventoryTransactionCreate(BaseModel):
    item_id: str
    transaction_type: str = Field(..., description="INWARD, OUTWARD, ADJUSTMENT")
    quantity: Decimal = Field(..., gt=0)
    unit_price: Decimal = Field(default=Decimal("0.00"), ge=0)
    transaction_date: Optional[date] = None
    reference_activity_id: Optional[str] = None
    notes: Optional[str] = None


class InventoryTransactionResponse(BaseModel):
    id: str
    item_id: str
    transaction_type: str
    quantity: Decimal
    unit_price: Decimal
    total_cost: Decimal
    transaction_date: date
    reference_activity_id: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class LowStockAlertResponse(BaseModel):
    item_id: str
    name: str
    category: str
    current_stock: Decimal
    reorder_level: Decimal
    unit: str
    urgency: str  # CRITICAL, WARNING
