from datetime import datetime, date
from decimal import Decimal
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop
from app.models.farm_activity import FarmActivity
from app.models.finance import FinancialTransaction
from app.models.inventory import InventoryItem
from app.models.labour import Labour
from app.models.equipment import Equipment
from app.schemas.dashboard import (
    DashboardSummaryResponse,
    CropDistributionItem,
    UpcomingActivityItem,
    MonthlyCashflowItem,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Operational Dashboard"])


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Database-Derived Operational Dashboard Analytics"
)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes real-time, user-isolated agricultural and financial KPIs
    directly from relational database tables.
    """
    user_id = current_user.id
    is_admin = current_user.primary_role == UserRoleEnum.ADMIN

    # 1. Farms Query
    farms_query = db.query(Farm)
    if not is_admin:
        farms_query = farms_query.filter(Farm.user_id == user_id)
    farm_ids = [f.id for f in farms_query.all()]
    total_farms = len(farm_ids)

    # 2. Fields Query
    if farm_ids:
        fields = db.query(Field).filter(Field.farm_id.in_(farm_ids)).all()
        field_ids = [f.id for f in fields]
        total_fields = len(fields)
    else:
        fields = []
        field_ids = []
        total_fields = 0

    # 3. Crops & Cultivated Acreage
    if field_ids:
        active_crops = db.query(Crop).filter(
            Crop.field_id.in_(field_ids),
            Crop.current_status == "ACTIVE"
        ).all()
        active_crops_count = len(active_crops)

        # Calculate cultivated acreage
        total_cultivated_acres = sum((c.cultivated_area or Decimal("0.00") for c in active_crops), Decimal("0.00"))
        if total_cultivated_acres == Decimal("0.00"):
            # Fallback to sum of field areas if individual crop area not specified
            total_cultivated_acres = sum((f.area_acres for f in fields), Decimal("0.00"))
    else:
        active_crops = []
        active_crops_count = 0
        total_cultivated_acres = Decimal("0.00")

    # Crop Distribution Breakdown
    crop_dist_items = []
    if total_cultivated_acres > 0 and active_crops:
        crop_areas = {}
        for c in active_crops:
            area = c.cultivated_area or Decimal("1.00")
            crop_areas[c.crop_name] = crop_areas.get(c.crop_name, Decimal("0.00")) + area

        for c_name, c_area in crop_areas.items():
            pct = float((c_area / total_cultivated_acres) * 100)
            crop_dist_items.append(
                CropDistributionItem(
                    crop_name=c_name,
                    area_acres=c_area,
                    percentage=round(pct, 1),
                )
            )

    # 4. Financial Metrics (Income, Expense, Net)
    finance_query = db.query(FinancialTransaction)
    if not is_admin:
        finance_query = finance_query.filter(FinancialTransaction.user_id == user_id)

    raw_income = finance_query.filter(FinancialTransaction.transaction_type == "INCOME").with_entities(
        func.coalesce(func.sum(FinancialTransaction.amount), 0)
    ).scalar()
    recorded_income = Decimal(str(raw_income or 0))

    raw_expense = finance_query.filter(FinancialTransaction.transaction_type == "EXPENSE").with_entities(
        func.coalesce(func.sum(FinancialTransaction.amount), 0)
    ).scalar()
    total_expenses = Decimal(str(raw_expense or 0))

    estimated_profit = recorded_income - total_expenses
    profit_margin = float((estimated_profit / recorded_income * 100)) if recorded_income > 0 else 0.0

    # 5. Upcoming Activities
    upcoming_query = db.query(FarmActivity)
    if farm_ids:
        upcoming_query = upcoming_query.filter(
            FarmActivity.farm_id.in_(farm_ids),
            FarmActivity.status.in_(["SCHEDULED", "IN_PROGRESS"]),
            FarmActivity.scheduled_date >= date.today()
        ).order_by(FarmActivity.scheduled_date.asc()).limit(5)
        raw_upcoming = upcoming_query.all()
    else:
        raw_upcoming = []

    upcoming_activities = []
    for a in raw_upcoming:
        f_name = None
        c_name = None
        if a.field_id:
            fld = db.query(Field).filter(Field.id == a.field_id).first()
            if fld:
                f_name = fld.name
        if a.crop_id:
            crp = db.query(Crop).filter(Crop.id == a.crop_id).first()
            if crp:
                c_name = crp.crop_name

        upcoming_activities.append(
            UpcomingActivityItem(
                id=a.id,
                title=a.title,
                activity_type=a.activity_type,
                status=a.status,
                priority=a.priority,
                scheduled_date=a.scheduled_date,
                field_name=f_name,
                crop_name=c_name,
            )
        )

    # 6. Monthly Cash Flow
    monthly_data = {}
    for t in finance_query.all():
        m_str = t.transaction_date.strftime("%b %Y")
        if m_str not in monthly_data:
            monthly_data[m_str] = {"income": Decimal("0.00"), "expense": Decimal("0.00")}
        if t.transaction_type == "INCOME":
            monthly_data[m_str]["income"] += t.amount
        else:
            monthly_data[m_str]["expense"] += t.amount

    monthly_cashflow = [
        MonthlyCashflowItem(
            month=m,
            income=vals["income"],
            expense=vals["expense"],
        )
        for m, vals in sorted(monthly_data.items())
    ]

    # 7. Operational Farm Metrics (Inventory, Labour, Equipment)
    low_stock_count = 0
    active_labour = 0
    operational_machinery = 0
    if farm_ids:
        low_stock_count = db.query(InventoryItem).filter(
            InventoryItem.farm_id.in_(farm_ids),
            InventoryItem.current_stock <= InventoryItem.reorder_level
        ).count()
        active_labour = db.query(Labour).filter(
            Labour.farm_id.in_(farm_ids),
            Labour.is_active == True
        ).count()
        operational_machinery = db.query(Equipment).filter(
            Equipment.farm_id.in_(farm_ids),
            Equipment.status == "OPERATIONAL"
        ).count()

    return DashboardSummaryResponse(
        total_farms=total_farms,
        total_fields=total_fields,
        total_cultivated_acres=total_cultivated_acres,
        active_crops_count=active_crops_count,
        total_expenses=total_expenses,
        recorded_income=recorded_income,
        estimated_profit=estimated_profit,
        profit_margin_pct=round(profit_margin, 1),
        crop_distribution=crop_dist_items,
        upcoming_activities=upcoming_activities,
        monthly_cashflow=monthly_cashflow,
        low_stock_alerts_count=low_stock_count,
        active_labour_count=active_labour,
        operational_machinery_count=operational_machinery,
        last_updated=datetime.utcnow(),
    )
