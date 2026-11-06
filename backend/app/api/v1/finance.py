from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.crop import Crop
from app.models.finance import FinancialTransaction
from app.models.audit_log import AuditLog
from app.schemas.finance import (
    FinancialTransactionCreate,
    FinancialTransactionUpdate,
    FinancialTransactionResponse,
    FinancialSummaryResponse,
    FinancialCategorySummary,
    MonthlyFlow,
)
from app.api.deps import get_current_user, get_authorized_farm

router = APIRouter(prefix="/finance", tags=["Financial Operations & Ledger"])


@router.post(
    "/transactions",
    response_model=FinancialTransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record Financial Transaction"
)
def create_transaction(
    trans_in: FinancialTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Record an income or expense transaction linked to an authorized farm.
    """
    farm = get_authorized_farm(trans_in.farm_id, db, current_user)

    if trans_in.crop_id:
        crop = db.query(Crop).filter(Crop.id == trans_in.crop_id).first()
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Associated crop with ID '{trans_in.crop_id}' does not exist.",
            )

    transaction = FinancialTransaction(
        user_id=current_user.id,
        farm_id=farm.id,
        crop_id=trans_in.crop_id,
        transaction_type=trans_in.transaction_type.upper(),
        category=trans_in.category.upper(),
        amount=trans_in.amount,
        transaction_date=trans_in.transaction_date,
        payment_method=trans_in.payment_method.upper(),
        invoice_number=trans_in.invoice_number,
        description=trans_in.description,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    audit = AuditLog(
        user_id=current_user.id,
        action="CREATE",
        resource_type="FINANCE",
        resource_id=transaction.id,
        details={
            "type": transaction.transaction_type,
            "category": transaction.category,
            "amount": float(transaction.amount),
        },
    )
    db.add(audit)
    db.commit()

    return FinancialTransactionResponse.model_validate(transaction)


@router.get(
    "/transactions",
    response_model=List[FinancialTransactionResponse],
    status_code=status.HTTP_200_OK,
    summary="List Financial Transactions"
)
def list_transactions(
    farm_id: Optional[str] = Query(None, description="Filter by Farm ID"),
    crop_id: Optional[str] = Query(None, description="Filter by Crop ID"),
    transaction_type: Optional[str] = Query(None, description="INCOME or EXPENSE"),
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Query financial records for the authenticated user's farms.
    """
    query = db.query(FinancialTransaction)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(FinancialTransaction.user_id == current_user.id)

    if farm_id:
        query = query.filter(FinancialTransaction.farm_id == farm_id)
    if crop_id:
        query = query.filter(FinancialTransaction.crop_id == crop_id)
    if transaction_type:
        query = query.filter(FinancialTransaction.transaction_type == transaction_type.upper())
    if start_date:
        query = query.filter(FinancialTransaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(FinancialTransaction.transaction_date <= end_date)

    transactions = query.order_by(FinancialTransaction.transaction_date.desc()).all()
    return [FinancialTransactionResponse.model_validate(t) for t in transactions]


@router.get(
    "/transactions/{transaction_id}",
    response_model=FinancialTransactionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Transaction by ID"
)
def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    transaction = db.query(FinancialTransaction).filter(FinancialTransaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found.",
        )
    if transaction.user_id != current_user.id and current_user.primary_role != UserRoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not own this transaction.",
        )
    return FinancialTransactionResponse.model_validate(transaction)


@router.put(
    "/transactions/{transaction_id}",
    response_model=FinancialTransactionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Transaction"
)
def update_transaction(
    transaction_id: str,
    trans_update: FinancialTransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    transaction = db.query(FinancialTransaction).filter(FinancialTransaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found.",
        )
    if transaction.user_id != current_user.id and current_user.primary_role != UserRoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not own this transaction.",
        )

    update_data = trans_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key in ("transaction_type", "category", "payment_method") and isinstance(value, str):
            value = value.upper()
        setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)

    audit = AuditLog(
        user_id=current_user.id,
        action="UPDATE",
        resource_type="FINANCE",
        resource_id=transaction.id,
        details={"updated_fields": list(update_data.keys())},
    )
    db.add(audit)
    db.commit()

    return FinancialTransactionResponse.model_validate(transaction)


@router.delete(
    "/transactions/{transaction_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Transaction"
)
def delete_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    transaction = db.query(FinancialTransaction).filter(FinancialTransaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found.",
        )
    if transaction.user_id != current_user.id and current_user.primary_role != UserRoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not own this transaction.",
        )

    db.delete(transaction)
    db.commit()
    return {"success": True, "message": "Transaction deleted."}


@router.get(
    "/summary",
    response_model=FinancialSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Financial Analytics Summary"
)
def get_financial_summary(
    farm_id: Optional[str] = Query(None, description="Optional filter by Farm ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes real database-derived financial aggregation metrics.
    """
    base_query = db.query(FinancialTransaction)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        base_query = base_query.filter(FinancialTransaction.user_id == current_user.id)
    if farm_id:
        base_query = base_query.filter(FinancialTransaction.farm_id == farm_id)

    total_income = base_query.filter(FinancialTransaction.transaction_type == "INCOME").with_entities(
        func.coalesce(func.sum(FinancialTransaction.amount), 0)
    ).scalar() or Decimal("0.00")

    total_expenses = base_query.filter(FinancialTransaction.transaction_type == "EXPENSE").with_entities(
        func.coalesce(func.sum(FinancialTransaction.amount), 0)
    ).scalar() or Decimal("0.00")

    total_income = Decimal(str(total_income))
    total_expenses = Decimal(str(total_expenses))
    net_profit = total_income - total_expenses
    profit_margin = float((net_profit / total_income * 100)) if total_income > 0 else 0.0

    # Income Categories
    inc_cat_query = base_query.filter(FinancialTransaction.transaction_type == "INCOME").with_entities(
        FinancialTransaction.category, func.sum(FinancialTransaction.amount)
    ).group_by(FinancialTransaction.category).all()

    income_categories = []
    for cat, amt in inc_cat_query:
        amt_dec = Decimal(str(amt))
        pct = float((amt_dec / total_income * 100)) if total_income > 0 else 0.0
        income_categories.append(FinancialCategorySummary(category=cat, total_amount=amt_dec, percentage=round(pct, 1)))

    # Expense Categories
    exp_cat_query = base_query.filter(FinancialTransaction.transaction_type == "EXPENSE").with_entities(
        FinancialTransaction.category, func.sum(FinancialTransaction.amount)
    ).group_by(FinancialTransaction.category).all()

    expense_categories = []
    for cat, amt in exp_cat_query:
        amt_dec = Decimal(str(amt))
        pct = float((amt_dec / total_expenses * 100)) if total_expenses > 0 else 0.0
        expense_categories.append(FinancialCategorySummary(category=cat, total_amount=amt_dec, percentage=round(pct, 1)))

    # Monthly Cash Flow (Aggregated by month)
    monthly_data = {}
    all_trans = base_query.all()
    for t in all_trans:
        m_str = t.transaction_date.strftime("%b %Y")
        if m_str not in monthly_data:
            monthly_data[m_str] = {"income": Decimal("0.00"), "expense": Decimal("0.00")}
        if t.transaction_type == "INCOME":
            monthly_data[m_str]["income"] += t.amount
        else:
            monthly_data[m_str]["expense"] += t.amount

    monthly_flow = [
        MonthlyFlow(
            month=m,
            income=vals["income"],
            expense=vals["expense"],
            net=vals["income"] - vals["expense"],
        )
        for m, vals in sorted(monthly_data.items(), reverse=False)
    ]

    return FinancialSummaryResponse(
        total_income=total_income,
        total_expenses=total_expenses,
        net_profit=net_profit,
        profit_margin_pct=round(profit_margin, 1),
        income_categories=income_categories,
        expense_categories=expense_categories,
        monthly_flow=monthly_flow,
    )
