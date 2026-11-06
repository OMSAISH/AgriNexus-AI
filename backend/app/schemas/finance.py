from datetime import datetime, date
from typing import Optional, Dict, List
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict


class FinancialTransactionBase(BaseModel):
    farm_id: str
    crop_id: Optional[str] = None
    transaction_type: str = Field(..., description="INCOME or EXPENSE")
    category: str = Field(..., max_length=50)
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    transaction_date: date = Field(default_factory=date.today)
    payment_method: str = Field(default="CASH", max_length=30)
    invoice_number: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class FinancialTransactionCreate(FinancialTransactionBase):
    pass


class FinancialTransactionUpdate(BaseModel):
    crop_id: Optional[str] = None
    transaction_type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    transaction_date: Optional[date] = None
    payment_method: Optional[str] = None
    invoice_number: Optional[str] = None
    description: Optional[str] = None


class FinancialTransactionResponse(FinancialTransactionBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime


class FinancialCategorySummary(BaseModel):
    category: str
    total_amount: Decimal
    percentage: float


class MonthlyFlow(BaseModel):
    month: str
    income: Decimal
    expense: Decimal
    net: Decimal


class FinancialSummaryResponse(BaseModel):
    total_income: Decimal
    total_expenses: Decimal
    net_profit: Decimal
    profit_margin_pct: float
    income_categories: List[FinancialCategorySummary]
    expense_categories: List[FinancialCategorySummary]
    monthly_flow: List[MonthlyFlow]
