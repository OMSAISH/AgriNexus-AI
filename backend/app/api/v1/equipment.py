from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.equipment import Equipment, EquipmentMaintenance
from app.schemas.equipment import (
    EquipmentCreate,
    EquipmentUpdate,
    EquipmentResponse,
    EquipmentMaintenanceCreate,
    EquipmentMaintenanceResponse,
    EquipmentSummaryResponse,
)
from app.api.deps import get_current_user, get_authorized_farm

router = APIRouter(prefix="/equipment", tags=["Equipment Management"])


def get_authorized_equipment(eq_id: str, db: Session, user: User) -> Equipment:
    eq = db.query(Equipment).filter(Equipment.id == eq_id).first()
    if not eq:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found.")
    if user.primary_role != UserRoleEnum.ADMIN:
        farm = db.query(Farm).filter(Farm.id == eq.farm_id).first()
        if not farm or farm.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this equipment.")
    return eq


@router.post("/items", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
def register_equipment(
    eq_in: EquipmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    farm = get_authorized_farm(eq_in.farm_id, db, current_user)
    eq = Equipment(
        farm_id=farm.id,
        name=eq_in.name,
        equipment_type=eq_in.equipment_type.upper(),
        model_number=eq_in.model_number,
        serial_number=eq_in.serial_number,
        purchase_date=eq_in.purchase_date,
        purchase_price=eq_in.purchase_price,
        status=eq_in.status.upper(),
    )
    db.add(eq)
    db.commit()
    db.refresh(eq)
    return EquipmentResponse.model_validate(eq)


@router.get("/items", response_model=List[EquipmentResponse])
def list_equipment(
    farm_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Equipment).join(Farm, Equipment.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    if farm_id:
        query = query.filter(Equipment.farm_id == farm_id)
    if status_filter:
        query = query.filter(Equipment.status == status_filter.upper())

    equipments = query.order_by(Equipment.name.asc()).all()
    results = []
    for eq in equipments:
        res = EquipmentResponse.model_validate(eq)
        res.maintenance_count = len(eq.maintenance_records)
        # Find latest next_service_due
        next_dates = [m.next_service_due for m in eq.maintenance_records if m.next_service_due]
        res.next_service_due = min(next_dates) if next_dates else None
        results.append(res)
    return results


@router.get("/items/{equipment_id}", response_model=EquipmentResponse)
def get_equipment_detail(
    equipment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    eq = get_authorized_equipment(equipment_id, db, current_user)
    res = EquipmentResponse.model_validate(eq)
    res.maintenance_count = len(eq.maintenance_records)
    next_dates = [m.next_service_due for m in eq.maintenance_records if m.next_service_due]
    res.next_service_due = min(next_dates) if next_dates else None
    return res


@router.put("/items/{equipment_id}", response_model=EquipmentResponse)
def update_equipment(
    equipment_id: str,
    eq_update: EquipmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    eq = get_authorized_equipment(equipment_id, db, current_user)
    update_data = eq_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key in ["equipment_type", "status"] and isinstance(value, str):
            value = value.upper()
        setattr(eq, key, value)
    db.commit()
    db.refresh(eq)
    return EquipmentResponse.model_validate(eq)


@router.delete("/items/{equipment_id}")
def delete_equipment(
    equipment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    eq = get_authorized_equipment(equipment_id, db, current_user)
    name = eq.name
    db.delete(eq)
    db.commit()
    return {"success": True, "message": f"Equipment '{name}' was removed."}


@router.post("/maintenance", response_model=EquipmentMaintenanceResponse, status_code=status.HTTP_201_CREATED)
def log_maintenance(
    maint_in: EquipmentMaintenanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    eq = get_authorized_equipment(maint_in.equipment_id, db, current_user)
    maint = EquipmentMaintenance(
        equipment_id=eq.id,
        maintenance_date=maint_in.maintenance_date or date.today(),
        service_type=maint_in.service_type.upper(),
        cost=maint_in.cost,
        description=maint_in.description,
        technician_name=maint_in.technician_name,
        next_service_due=maint_in.next_service_due,
    )
    db.add(maint)
    
    # If service type is REPAIR, can put back to OPERATIONAL once completed
    if eq.status == "MAINTENANCE":
        eq.status = "OPERATIONAL"

    db.commit()
    db.refresh(maint)

    resp = EquipmentMaintenanceResponse.model_validate(maint)
    resp.equipment_name = eq.name
    return resp


@router.get("/maintenance", response_model=List[EquipmentMaintenanceResponse])
def list_maintenance_records(
    equipment_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(EquipmentMaintenance).join(Equipment, EquipmentMaintenance.equipment_id == Equipment.id).join(Farm, Equipment.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    if equipment_id:
        query = query.filter(EquipmentMaintenance.equipment_id == equipment_id)

    records = query.order_by(EquipmentMaintenance.maintenance_date.desc()).limit(100).all()
    results = []
    for r in records:
        resp = EquipmentMaintenanceResponse.model_validate(r)
        resp.equipment_name = r.equipment.name if r.equipment else None
        results.append(resp)
    return results


@router.get("/summary", response_model=EquipmentSummaryResponse)
def get_equipment_summary(
    farm_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Equipment).join(Farm, Equipment.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    if farm_id:
        query = query.filter(Equipment.farm_id == farm_id)

    all_eq = query.all()
    total_eq = len(all_eq)
    op_count = sum(1 for e in all_eq if e.status == "OPERATIONAL")
    maint_count = sum(1 for e in all_eq if e.status == "MAINTENANCE")
    retired_count = sum(1 for e in all_eq if e.status == "RETIRED")

    today = date.today()
    upcoming_services = db.query(EquipmentMaintenance).join(Equipment, EquipmentMaintenance.equipment_id == Equipment.id).join(Farm, Equipment.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        upcoming_services = upcoming_services.filter(Farm.user_id == current_user.id)
    if farm_id:
        upcoming_services = upcoming_services.filter(Equipment.farm_id == farm_id)
    
    upcoming_count = upcoming_services.filter(EquipmentMaintenance.next_service_due >= today).count()

    return EquipmentSummaryResponse(
        total_equipment=total_eq,
        operational_count=op_count,
        maintenance_count=maint_count,
        retired_count=retired_count,
        upcoming_services_count=upcoming_count,
    )
