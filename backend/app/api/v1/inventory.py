from typing import List, Optional
from decimal import Decimal
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.inventory import InventoryItem, InventoryTransaction
from app.models.audit_log import AuditLog
from app.schemas.inventory import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryItemResponse,
    InventoryTransactionCreate,
    InventoryTransactionResponse,
    LowStockAlertResponse,
)
from app.api.deps import get_current_user, get_authorized_farm

router = APIRouter(prefix="/inventory", tags=["Inventory Management"])


def get_authorized_inventory_item(item_id: str, db: Session, user: User) -> InventoryItem:
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found.")
    if user.primary_role != UserRoleEnum.ADMIN:
        farm = db.query(Farm).filter(Farm.id == item.farm_id).first()
        if not farm or farm.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this inventory item.")
    return item


@router.post("/items", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    item_in: InventoryItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    farm = get_authorized_farm(item_in.farm_id, db, current_user)
    
    item = InventoryItem(
        farm_id=farm.id,
        name=item_in.name,
        category=item_in.category.upper(),
        unit=item_in.unit.upper(),
        current_stock=item_in.current_stock,
        reorder_level=item_in.reorder_level,
        unit_price=item_in.unit_price,
        supplier=item_in.supplier,
        batch_number=item_in.batch_number,
        expiry_date=item_in.expiry_date,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # If initial stock > 0, record initial inward transaction
    if item.current_stock > Decimal("0.00"):
        tx = InventoryTransaction(
            item_id=item.id,
            transaction_type="INWARD",
            quantity=item.current_stock,
            unit_price=item.unit_price,
            total_cost=item.current_stock * item.unit_price,
            transaction_date=date.today(),
            notes="Initial stock registration on system setup",
        )
        db.add(tx)
        db.commit()

    resp = InventoryItemResponse.model_validate(item)
    resp.is_low_stock = item.current_stock <= item.reorder_level
    return resp


@router.get("/items", response_model=List[InventoryItemResponse])
def list_inventory_items(
    farm_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    low_stock_only: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(InventoryItem).join(Farm, InventoryItem.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    
    if farm_id:
        query = query.filter(InventoryItem.farm_id == farm_id)
    if category:
        query = query.filter(InventoryItem.category == category.upper())
    
    items = query.order_by(InventoryItem.name.asc()).all()
    results = []
    for it in items:
        is_low = it.current_stock <= it.reorder_level
        if low_stock_only and not is_low:
            continue
        res = InventoryItemResponse.model_validate(it)
        res.is_low_stock = is_low
        results.append(res)
    return results


@router.get("/items/{item_id}", response_model=InventoryItemResponse)
def get_inventory_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = get_authorized_inventory_item(item_id, db, current_user)
    res = InventoryItemResponse.model_validate(item)
    res.is_low_stock = item.current_stock <= item.reorder_level
    return res


@router.put("/items/{item_id}", response_model=InventoryItemResponse)
def update_inventory_item(
    item_id: str,
    item_update: InventoryItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = get_authorized_inventory_item(item_id, db, current_user)
    update_data = item_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        if key in ["category", "unit"] and isinstance(value, str):
            value = value.upper()
        setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    
    res = InventoryItemResponse.model_validate(item)
    res.is_low_stock = item.current_stock <= item.reorder_level
    return res


@router.delete("/items/{item_id}")
def delete_inventory_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = get_authorized_inventory_item(item_id, db, current_user)
    name = item.name
    db.delete(item)
    db.commit()
    return {"success": True, "message": f"Inventory item '{name}' was deleted."}


@router.post("/transactions", response_model=InventoryTransactionResponse, status_code=status.HTTP_201_CREATED)
def record_inventory_transaction(
    tx_in: InventoryTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = get_authorized_inventory_item(tx_in.item_id, db, current_user)
    ttype = tx_in.transaction_type.upper()
    qty = Decimal(str(tx_in.quantity))
    unit_price = Decimal(str(tx_in.unit_price)) if tx_in.unit_price else item.unit_price

    if ttype == "INWARD":
        item.current_stock += qty
    elif ttype == "OUTWARD":
        if item.current_stock < qty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient inventory for {item.name}. Available: {item.current_stock} {item.unit}, Requested: {qty} {item.unit}."
            )
        item.current_stock -= qty
    elif ttype == "ADJUSTMENT":
        # Adjustment quantity is the net change
        if item.current_stock + qty < Decimal("0.00"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Adjustment would result in negative stock."
            )
        item.current_stock += qty
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid transaction type: {ttype}")

    total_cost = qty * unit_price
    tx = InventoryTransaction(
        item_id=item.id,
        transaction_type=ttype,
        quantity=qty,
        unit_price=unit_price,
        total_cost=total_cost,
        transaction_date=tx_in.transaction_date or date.today(),
        reference_activity_id=tx_in.reference_activity_id,
        notes=tx_in.notes,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return InventoryTransactionResponse.model_validate(tx)


@router.get("/transactions", response_model=List[InventoryTransactionResponse])
def list_inventory_transactions(
    item_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(InventoryTransaction).join(InventoryItem, InventoryTransaction.item_id == InventoryItem.id).join(Farm, InventoryItem.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    if item_id:
        query = query.filter(InventoryTransaction.item_id == item_id)
    
    txs = query.order_by(InventoryTransaction.created_at.desc()).limit(100).all()
    return [InventoryTransactionResponse.model_validate(t) for t in txs]


@router.get("/alerts", response_model=List[LowStockAlertResponse])
def get_low_stock_alerts(
    farm_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(InventoryItem).join(Farm, InventoryItem.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    if farm_id:
        query = query.filter(InventoryItem.farm_id == farm_id)

    items = query.filter(InventoryItem.current_stock <= InventoryItem.reorder_level).all()
    alerts = []
    for it in items:
        urgency = "CRITICAL" if it.current_stock == Decimal("0.00") else "WARNING"
        alerts.append(LowStockAlertResponse(
            item_id=it.id,
            name=it.name,
            category=it.category,
            current_stock=it.current_stock,
            reorder_level=it.reorder_level,
            unit=it.unit,
            urgency=urgency,
        ))
    return alerts
