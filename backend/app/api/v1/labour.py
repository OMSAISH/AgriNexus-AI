from typing import List, Optional
from decimal import Decimal
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.labour import Labour, LabourAttendance
from app.schemas.labour import (
    LabourCreate,
    LabourUpdate,
    LabourResponse,
    LabourAttendanceCreate,
    LabourAttendanceResponse,
    LabourSummaryResponse,
)
from app.api.deps import get_current_user, get_authorized_farm

router = APIRouter(prefix="/labour", tags=["Labour Management"])


def get_authorized_labour(labour_id: str, db: Session, user: User) -> Labour:
    worker = db.query(Labour).filter(Labour.id == labour_id).first()
    if not worker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Labour record not found.")
    if user.primary_role != UserRoleEnum.ADMIN:
        farm = db.query(Farm).filter(Farm.id == worker.farm_id).first()
        if not farm or farm.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this labour record.")
    return worker


@router.post("/workers", response_model=LabourResponse, status_code=status.HTTP_201_CREATED)
def register_worker(
    labour_in: LabourCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    farm = get_authorized_farm(labour_in.farm_id, db, current_user)
    worker = Labour(
        farm_id=farm.id,
        full_name=labour_in.full_name,
        phone_number=labour_in.phone_number,
        skill_type=labour_in.skill_type.upper(),
        daily_wage=labour_in.daily_wage,
        is_active=labour_in.is_active,
    )
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return LabourResponse.model_validate(worker)


@router.get("/workers", response_model=List[LabourResponse])
def list_workers(
    farm_id: Optional[str] = Query(None),
    active_only: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Labour).join(Farm, Labour.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    if farm_id:
        query = query.filter(Labour.farm_id == farm_id)
    if active_only:
        query = query.filter(Labour.is_active == True)
    
    workers = query.order_by(Labour.full_name.asc()).all()
    return [LabourResponse.model_validate(w) for w in workers]


@router.get("/workers/{labour_id}", response_model=LabourResponse)
def get_worker(
    labour_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    worker = get_authorized_labour(labour_id, db, current_user)
    return LabourResponse.model_validate(worker)


@router.put("/workers/{labour_id}", response_model=LabourResponse)
def update_worker(
    labour_id: str,
    worker_update: LabourUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    worker = get_authorized_labour(labour_id, db, current_user)
    update_data = worker_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "skill_type" and isinstance(value, str):
            value = value.upper()
        setattr(worker, key, value)
    db.commit()
    db.refresh(worker)
    return LabourResponse.model_validate(worker)


@router.delete("/workers/{labour_id}")
def delete_worker(
    labour_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    worker = get_authorized_labour(labour_id, db, current_user)
    name = worker.full_name
    db.delete(worker)
    db.commit()
    return {"success": True, "message": f"Worker '{name}' was removed."}


@router.post("/attendance", response_model=LabourAttendanceResponse, status_code=status.HTTP_201_CREATED)
def record_attendance(
    att_in: LabourAttendanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    worker = get_authorized_labour(att_in.labour_id, db, current_user)
    att_date = att_in.attendance_date or date.today()
    status_str = att_in.status.upper()

    # Calculate wage automatically if not explicitly overridden
    if att_in.wage_paid is not None:
        wage = att_in.wage_paid
    else:
        if status_str == "PRESENT":
            wage = worker.daily_wage * (att_in.hours_worked / Decimal("8.0"))
        elif status_str == "HALF_DAY":
            wage = worker.daily_wage * Decimal("0.5")
        else:
            wage = Decimal("0.00")

    attendance = LabourAttendance(
        labour_id=worker.id,
        farm_id=worker.farm_id,
        attendance_date=att_date,
        status=status_str,
        hours_worked=att_in.hours_worked,
        wage_paid=wage,
        notes=att_in.notes,
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    resp = LabourAttendanceResponse.model_validate(attendance)
    resp.worker_name = worker.full_name
    return resp


@router.get("/attendance", response_model=List[LabourAttendanceResponse])
def list_attendance(
    farm_id: Optional[str] = Query(None),
    labour_id: Optional[str] = Query(None),
    attendance_date: Optional[date] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(LabourAttendance).join(Labour, LabourAttendance.labour_id == Labour.id).join(Farm, LabourAttendance.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    if farm_id:
        query = query.filter(LabourAttendance.farm_id == farm_id)
    if labour_id:
        query = query.filter(LabourAttendance.labour_id == labour_id)
    if attendance_date:
        query = query.filter(LabourAttendance.attendance_date == attendance_date)

    records = query.order_by(LabourAttendance.attendance_date.desc()).limit(100).all()
    results = []
    for r in records:
        resp = LabourAttendanceResponse.model_validate(r)
        resp.worker_name = r.worker.full_name if r.worker else None
        results.append(resp)
    return results


@router.get("/summary", response_model=LabourSummaryResponse)
def get_labour_summary(
    farm_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    worker_query = db.query(Labour).join(Farm, Labour.farm_id == Farm.id)
    att_query = db.query(LabourAttendance).join(Farm, LabourAttendance.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        worker_query = worker_query.filter(Farm.user_id == current_user.id)
        att_query = att_query.filter(Farm.user_id == current_user.id)
    if farm_id:
        worker_query = worker_query.filter(Labour.farm_id == farm_id)
        att_query = att_query.filter(LabourAttendance.farm_id == farm_id)

    total_workers = worker_query.count()
    active_workers = worker_query.filter(Labour.is_active == True).count()

    today = date.today()
    today_records = att_query.filter(LabourAttendance.attendance_date == today).all()
    today_present = sum(1 for r in today_records if r.status == "PRESENT")
    today_half_day = sum(1 for r in today_records if r.status == "HALF_DAY")
    today_absent = sum(1 for r in today_records if r.status == "ABSENT")

    # Current month wages
    month_start = today.replace(day=1)
    month_wages = att_query.filter(LabourAttendance.attendance_date >= month_start).with_entities(func.coalesce(func.sum(LabourAttendance.wage_paid), Decimal("0.00"))).scalar()

    return LabourSummaryResponse(
        total_workers=total_workers,
        active_workers=active_workers,
        today_present=today_present,
        today_half_day=today_half_day,
        today_absent=today_absent,
        month_to_date_wages=month_wages or Decimal("0.00"),
    )
