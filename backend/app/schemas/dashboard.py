from datetime import datetime, date
from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel


class CropDistributionItem(BaseModel):
    crop_name: str
    variety: Optional[str] = None
    area_acres: Decimal
    percentage: float


class UpcomingActivityItem(BaseModel):
    id: str
    title: str
    activity_type: str
    status: str
    priority: str
    scheduled_date: date
    field_name: Optional[str] = None
    crop_name: Optional[str] = None


class MonthlyCashflowItem(BaseModel):
    month: str
    income: Decimal
    expense: Decimal


class DashboardSummaryResponse(BaseModel):
    total_farms: int
    total_fields: int
    total_cultivated_acres: Decimal
    active_crops_count: int
    total_expenses: Decimal
    recorded_income: Decimal
    estimated_profit: Decimal
    profit_margin_pct: float
    crop_distribution: List[CropDistributionItem]
    upcoming_activities: List[UpcomingActivityItem]
    monthly_cashflow: List[MonthlyCashflowItem]
    low_stock_alerts_count: int = 0
    active_labour_count: int = 0
    operational_machinery_count: int = 0
    last_updated: datetime
