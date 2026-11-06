from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.farm_activity import FarmActivity
from app.schemas.activity import FarmActivityCreate, FarmActivityUpdate, FarmActivityResponse
from app.api.deps import get_current_user, get_authorized_farm

router = APIRouter(prefix="/activities", tags=["Farm Operations & Activities"])


@router.post(
    "",
    response_model=FarmActivityResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Schedule or Record Farm Activity"
)
def create_activity(
    activity_in: FarmActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    farm = get_authorized_farm(activity_in.farm_id, db, current_user)
    activity = FarmActivity(
        farm_id=farm.id,
        field_id=activity_in.field_id,
        crop_id=activity_in.crop_id,
        title=activity_in.title,
        activity_type=activity_in.activity_type.upper(),
        status=activity_in.status.upper(),
        priority=activity_in.priority.upper(),
        scheduled_date=activity_in.scheduled_date,
        completed_date=activity_in.completed_date,
        cost=activity_in.cost,
        assigned_to=activity_in.assigned_to,
        notes=activity_in.notes,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return FarmActivityResponse.model_validate(activity)


@router.get(
    "",
    response_model=List[FarmActivityResponse],
    status_code=status.HTTP_200_OK,
    summary="List Farm Activities"
)
def list_activities(
    farm_id: Optional[str] = Query(None, description="Filter by Farm ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(FarmActivity).join(Farm, FarmActivity.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)

    if farm_id:
        query = query.filter(FarmActivity.farm_id == farm_id)
    if status:
        query = query.filter(FarmActivity.status == status.upper())

    activities = query.order_by(FarmActivity.scheduled_date.desc()).all()
    return [FarmActivityResponse.model_validate(a) for a in activities]


@router.put(
    "/{activity_id}",
    response_model=FarmActivityResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Activity"
)
def update_activity(
    activity_id: str,
    activity_update: FarmActivityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activity = db.query(FarmActivity).filter(FarmActivity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found.")
    farm = get_authorized_farm(activity.farm_id, db, current_user)

    update_data = activity_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key in ("status", "priority", "activity_type") and isinstance(value, str):
            value = value.upper()
        setattr(activity, key, value)

    db.commit()
    db.refresh(activity)
    return FarmActivityResponse.model_validate(activity)


@router.delete(
    "/{activity_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Activity"
)
def delete_activity(
    activity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activity = db.query(FarmActivity).filter(FarmActivity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found.")
    get_authorized_farm(activity.farm_id, db, current_user)

    db.delete(activity)
    db.commit()
    return {"success": True, "message": "Activity deleted."}
