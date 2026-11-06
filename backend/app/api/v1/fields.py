from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop
from app.models.audit_log import AuditLog
from app.schemas.field import FieldCreate, FieldUpdate, FieldResponse, FieldDetailResponse
from app.api.deps import get_current_user, get_authorized_farm, get_authorized_field

router = APIRouter(prefix="/fields", tags=["Field Management"])


@router.post(
    "",
    response_model=FieldResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Field on Farm"
)
def create_field(
    field_in: FieldCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new field plot under an authorized farm.
    """
    farm = get_authorized_farm(field_in.farm_id, db, current_user)

    # Validate that total assigned field area does not exceed available farm area
    existing_fields = db.query(Field).filter(Field.farm_id == farm.id).all()
    current_assigned = sum(float(f.area_acres) for f in existing_fields)
    new_total = current_assigned + float(field_in.area_acres)
    if new_total > float(farm.total_area_acres) + 0.001:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Field area ({field_in.area_acres} Ac) exceeds remaining available farm area ({max(0.0, float(farm.total_area_acres) - current_assigned):.2f} Ac of {farm.total_area_acres} Ac total)."
        )

    field = Field(
        farm_id=farm.id,
        name=field_in.name,
        area_acres=field_in.area_acres,
        soil_type=field_in.soil_type,
        soil_ph=field_in.soil_ph,
        location=field_in.location,
        irrigation_type=field_in.irrigation_type,
        description=field_in.description,
        boundary_geojson=field_in.boundary_geojson,
    )
    db.add(field)
    db.commit()
    db.refresh(field)

    audit = AuditLog(
        user_id=current_user.id,
        action="CREATE",
        resource_type="FIELD",
        resource_id=field.id,
        details={"name": field.name, "farm_id": farm.id, "area": float(field.area_acres)},
    )
    db.add(audit)
    db.commit()

    return FieldResponse.model_validate(field)


@router.get(
    "",
    response_model=List[FieldDetailResponse],
    status_code=status.HTTP_200_OK,
    summary="List Fields for User's Farms"
)
def list_fields(
    farm_id: Optional[str] = Query(None, description="Optional filter by Farm ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all fields located on user's authorized farms.
    """
    query = db.query(Field).join(Farm, Field.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    
    if farm_id:
        query = query.filter(Field.farm_id == farm_id)

    fields = query.order_by(Field.created_at.asc()).all()

    results = []
    for f in fields:
        farm = db.query(Farm).filter(Farm.id == f.farm_id).first()
        active_crop = db.query(Crop).filter(Crop.field_id == f.id, Crop.current_status == "ACTIVE").first()
        
        item = FieldDetailResponse.model_validate(f)
        item.farm_name = farm.name if farm else None
        item.active_crop_name = f"{active_crop.crop_name} ({active_crop.variety})" if active_crop else "Fallow / None"
        results.append(item)

    return results


@router.get(
    "/{field_id}",
    response_model=FieldDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Field by ID"
)
def get_field(
    field_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get field details with authorization check.
    """
    field = get_authorized_field(field_id, db, current_user)
    farm = db.query(Farm).filter(Farm.id == field.farm_id).first()
    active_crop = db.query(Crop).filter(Crop.field_id == field.id, Crop.current_status == "ACTIVE").first()
    
    res = FieldDetailResponse.model_validate(field)
    res.farm_name = farm.name if farm else None
    res.active_crop_name = f"{active_crop.crop_name} ({active_crop.variety})" if active_crop else "Fallow / None"
    return res


@router.put(
    "/{field_id}",
    response_model=FieldResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Field Details"
)
def update_field(
    field_id: str,
    field_update: FieldUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update field attributes with authorization check.
    """
    field = get_authorized_field(field_id, db, current_user)

    if field_update.area_acres is not None:
        farm = db.query(Farm).filter(Farm.id == field.farm_id).first()
        if farm:
            other_fields = db.query(Field).filter(Field.farm_id == farm.id, Field.id != field.id).all()
            other_assigned = sum(float(f.area_acres) for f in other_fields)
            new_total = other_assigned + float(field_update.area_acres)
            if new_total > float(farm.total_area_acres) + 0.001:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Updated field area ({field_update.area_acres} Ac) exceeds available farm area ({max(0.0, float(farm.total_area_acres) - other_assigned):.2f} Ac remaining)."
                )

    update_data = field_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(field, key, value)

    db.commit()
    db.refresh(field)

    audit = AuditLog(
        user_id=current_user.id,
        action="UPDATE",
        resource_type="FIELD",
        resource_id=field.id,
        details={"updated_fields": list(update_data.keys())},
    )
    db.add(audit)
    db.commit()

    return FieldResponse.model_validate(field)


@router.delete(
    "/{field_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Field"
)
def delete_field(
    field_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a field and its crops. Enforces authorization.
    """
    field = get_authorized_field(field_id, db, current_user)

    audit = AuditLog(
        user_id=current_user.id,
        action="DELETE",
        resource_type="FIELD",
        resource_id=field.id,
        details={"name": field.name},
    )
    db.add(audit)

    db.delete(field)
    db.commit()

    return {"success": True, "message": f"Field '{field.name}' was successfully deleted."}
