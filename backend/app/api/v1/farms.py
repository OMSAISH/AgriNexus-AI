from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.field import Field
from app.models.audit_log import AuditLog
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse, FarmSummaryResponse
from app.api.deps import get_current_user, get_authorized_farm

router = APIRouter(prefix="/farms", tags=["Farm Management"])


@router.post(
    "",
    response_model=FarmResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Farm Holding"
)
def create_farm(
    farm_in: FarmCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Register a new farm holding under the currently authenticated user.
    """
    farm = Farm(
        user_id=current_user.id,
        name=farm_in.name,
        village=farm_in.village,
        taluka=farm_in.taluka,
        district=farm_in.district,
        state=farm_in.state,
        total_area_acres=farm_in.total_area_acres,
        area_unit=farm_in.area_unit,
        description=farm_in.description,
        latitude=farm_in.latitude,
        longitude=farm_in.longitude,
        soil_type=farm_in.soil_type,
        irrigation_source=farm_in.irrigation_source,
        boundary_geojson=farm_in.boundary_geojson,
    )
    db.add(farm)
    db.commit()
    db.refresh(farm)

    audit = AuditLog(
        user_id=current_user.id,
        action="CREATE",
        resource_type="FARM",
        resource_id=farm.id,
        details={"name": farm.name, "area": float(farm.total_area_acres)},
    )
    db.add(audit)
    db.commit()

    return FarmResponse.model_validate(farm)


@router.get(
    "",
    response_model=List[FarmSummaryResponse],
    status_code=status.HTTP_200_OK,
    summary="List Authorized Farms"
)
def list_farms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all farms belonging to the current user (or all if admin).
    Includes fields count and cultivated acreage.
    """
    query = db.query(Farm)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    
    farms = query.order_by(Farm.created_at.desc()).all()

    results = []
    for f in farms:
        fields_count = db.query(func.count(Field.id)).filter(Field.farm_id == f.id).scalar() or 0
        total_cultivated = db.query(func.sum(Field.area_acres)).filter(Field.farm_id == f.id).scalar() or Decimal("0.00")
        
        farm_dict = FarmResponse.model_validate(f).model_dump()
        farm_dict["fields_count"] = fields_count
        farm_dict["total_cultivated_acres"] = total_cultivated
        results.append(FarmSummaryResponse(**farm_dict))

    return results


@router.get(
    "/{farm_id}",
    response_model=FarmResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Farm by ID"
)
def get_farm(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve specific farm details. Enforces ownership authorization.
    """
    farm = get_authorized_farm(farm_id, db, current_user)
    return FarmResponse.model_validate(farm)


@router.put(
    "/{farm_id}",
    response_model=FarmResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Farm Details"
)
def update_farm(
    farm_id: str,
    farm_update: FarmUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update farm attributes. Only authorized farm owners can perform updates.
    """
    farm = get_authorized_farm(farm_id, db, current_user)

    update_data = farm_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(farm, key, value)

    db.commit()
    db.refresh(farm)

    audit = AuditLog(
        user_id=current_user.id,
        action="UPDATE",
        resource_type="FARM",
        resource_id=farm.id,
        details={"updated_fields": list(update_data.keys())},
    )
    db.add(audit)
    db.commit()

    return FarmResponse.model_validate(farm)


@router.delete(
    "/{farm_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Farm Holding"
)
def delete_farm(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a farm and its associated parcels. Enforces ownership authorization.
    """
    farm = get_authorized_farm(farm_id, db, current_user)

    audit = AuditLog(
        user_id=current_user.id,
        action="DELETE",
        resource_type="FARM",
        resource_id=farm.id,
        details={"name": farm.name},
    )
    db.add(audit)

    db.delete(farm)
    db.commit()

    return {"success": True, "message": f"Farm '{farm.name}' and all associated entities were deleted."}
