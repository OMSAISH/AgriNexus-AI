from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserRoleEnum
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop
from app.models.crop_cycle import CropCycle
from app.models.farm_activity import FarmActivity
from app.models.audit_log import AuditLog
from app.schemas.crop import (
    CropCreate,
    CropUpdate,
    CropResponse,
    CropDetailResponse,
    CropCycleCreate,
    CropCycleResponse,
    CropStageTransitionRequest,
    CropPerformanceSummaryResponse,
    CropPerformanceSummaryItem,
)
from app.api.deps import get_current_user, get_authorized_field, get_authorized_crop

router = APIRouter(prefix="/crops", tags=["Crop & Lifecycle Management"])


@router.post(
    "",
    response_model=CropResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New Crop on Field"
)
def create_crop(
    crop_in: CropCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Register a cultivated crop on an authorized field plot.
    """
    field = get_authorized_field(crop_in.field_id, db, current_user)

    crop = Crop(
        field_id=field.id,
        crop_name=crop_in.crop_name,
        crop_type=crop_in.crop_type,
        variety=crop_in.variety,
        sowing_date=crop_in.sowing_date,
        expected_harvest_date=crop_in.expected_harvest_date,
        actual_harvest_date=crop_in.actual_harvest_date,
        current_stage=crop_in.current_stage,
        cultivated_area=crop_in.cultivated_area or field.area_acres,
        expected_yield=crop_in.expected_yield,
        current_status=crop_in.current_status,
        target_moisture_min=crop_in.target_moisture_min,
        target_moisture_max=crop_in.target_moisture_max,
    )
    db.add(crop)
    db.commit()
    db.refresh(crop)

    audit = AuditLog(
        user_id=current_user.id,
        action="CREATE",
        resource_type="CROP",
        resource_id=crop.id,
        details={"crop_name": crop.crop_name, "field_id": field.id},
    )
    db.add(audit)
    db.commit()

    return CropResponse.model_validate(crop)


@router.post(
    "/{crop_id}/stage",
    response_model=CropResponse,
    status_code=status.HTTP_200_OK,
    summary="Advance Crop Phenological Growth Stage"
)
def transition_crop_stage(
    crop_id: str,
    stage_req: CropStageTransitionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crop = get_authorized_crop(crop_id, db, current_user)
    prev_stage = crop.current_stage.value if hasattr(crop.current_stage, "value") else str(crop.current_stage)
    new_stage = stage_req.new_stage

    crop.current_stage = new_stage
    db.commit()
    db.refresh(crop)

    # Automatically create an activity record for the farm timeline
    field = db.query(Field).filter(Field.id == crop.field_id).first()
    farm_id = field.farm_id if field else None
    if farm_id:
        act = FarmActivity(
            farm_id=farm_id,
            crop_id=crop.id,
            field_id=crop.field_id,
            activity_type="OTHER",
            title=f"Stage Advanced: {crop.crop_name} -> {new_stage.value if hasattr(new_stage, 'value') else new_stage}",
            notes=stage_req.notes or f"Phenological progression transitioned from {prev_stage} to {new_stage.value if hasattr(new_stage, 'value') else new_stage}",
            status="COMPLETED",
            completed_date=date.today(),
        )
        db.add(act)
        db.commit()

    return CropResponse.model_validate(crop)


@router.get(
    "",
    response_model=List[CropDetailResponse],
    status_code=status.HTTP_200_OK,
    summary="List Crops"
)
def list_crops(
    field_id: Optional[str] = Query(None, description="Filter by Field ID"),
    farm_id: Optional[str] = Query(None, description="Filter by Farm ID"),
    status: Optional[str] = Query(None, description="Filter by status (e.g. ACTIVE)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List crops cultivated across user's farms and fields.
    """
    query = db.query(Crop).join(Field, Crop.field_id == Field.id).join(Farm, Field.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)

    if field_id:
        query = query.filter(Crop.field_id == field_id)
    if farm_id:
        query = query.filter(Field.farm_id == farm_id)
    if status:
        query = query.filter(Crop.current_status == status)

    crops = query.order_by(Crop.sowing_date.desc()).all()

    results = []
    for c in crops:
        field = db.query(Field).filter(Field.id == c.field_id).first()
        farm = db.query(Farm).filter(Farm.id == field.farm_id).first() if field else None
        
        detail = CropDetailResponse.model_validate(c)
        detail.field_name = field.name if field else None
        detail.farm_id = farm.id if farm else None
        detail.farm_name = farm.name if farm else None
        results.append(detail)

    return results


@router.get(
    "/performance/summary",
    response_model=CropPerformanceSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Crop Performance Summary Across Holdings"
)
def get_crop_performance_summary(
    farm_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Crop).join(Field, Crop.field_id == Field.id).join(Farm, Field.farm_id == Farm.id)
    if current_user.primary_role != UserRoleEnum.ADMIN:
        query = query.filter(Farm.user_id == current_user.id)
    if farm_id:
        query = query.filter(Field.farm_id == farm_id)

    active_crops = query.filter(Crop.current_status == "ACTIVE").all()
    
    total_area = sum((c.cultivated_area or 0) for c in active_crops)
    stages: dict = {}
    items = []
    
    for c in active_crops:
        stage_str = c.current_stage.value if hasattr(c.current_stage, "value") else str(c.current_stage)
        stages[stage_str] = stages.get(stage_str, 0) + 1
        
        eff = None
        if c.expected_yield and c.actual_yield and c.expected_yield > 0:
            eff = round(float(c.actual_yield / c.expected_yield) * 100.0, 1)

        items.append(CropPerformanceSummaryItem(
            crop_id=c.id,
            crop_name=c.crop_name,
            variety=c.variety,
            cultivated_area=c.cultivated_area or 0,
            current_stage=stage_str,
            expected_yield=c.expected_yield,
            actual_yield=c.actual_yield,
            yield_efficiency_pct=eff,
            status=c.current_status,
        ))

    return CropPerformanceSummaryResponse(
        total_active_crops=len(active_crops),
        total_cultivated_area=total_area,
        stages_breakdown=stages,
        crops=items,
    )


@router.get(
    "/{crop_id}",
    response_model=CropDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Crop by ID"
)
def get_crop(
    crop_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific crop with ownership authorization.
    """
    crop = get_authorized_crop(crop_id, db, current_user)
    field = db.query(Field).filter(Field.id == crop.field_id).first()
    farm = db.query(Farm).filter(Farm.id == field.farm_id).first() if field else None

    detail = CropDetailResponse.model_validate(crop)
    detail.field_name = field.name if field else None
    detail.farm_id = farm.id if farm else None
    detail.farm_name = farm.name if farm else None
    return detail


@router.put(
    "/{crop_id}",
    response_model=CropResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Crop Details"
)
def update_crop(
    crop_id: str,
    crop_update: CropUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update crop progress, harvest date, growth stage, or moisture limits.
    """
    crop = get_authorized_crop(crop_id, db, current_user)

    update_data = crop_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(crop, key, value)

    db.commit()
    db.refresh(crop)

    audit = AuditLog(
        user_id=current_user.id,
        action="UPDATE",
        resource_type="CROP",
        resource_id=crop.id,
        details={"updated_fields": list(update_data.keys())},
    )
    db.add(audit)
    db.commit()

    return CropResponse.model_validate(crop)


@router.delete(
    "/{crop_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Crop Record"
)
def delete_crop(
    crop_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a crop record.
    """
    crop = get_authorized_crop(crop_id, db, current_user)

    audit = AuditLog(
        user_id=current_user.id,
        action="DELETE",
        resource_type="CROP",
        resource_id=crop.id,
        details={"crop_name": crop.crop_name},
    )
    db.add(audit)

    db.delete(crop)
    db.commit()

    return {"success": True, "message": f"Crop '{crop.crop_name}' was deleted."}


# Crop Cycle Endpoints
@router.post(
    "/{crop_id}/cycles",
    response_model=CropCycleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Crop Cycle Record"
)
def create_crop_cycle(
    crop_id: str,
    cycle_in: CropCycleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crop = get_authorized_crop(crop_id, db, current_user)
    cycle = CropCycle(
        crop_id=crop.id,
        field_id=crop.field_id,
        cycle_name=cycle_in.cycle_name,
        season=cycle_in.season,
        start_date=cycle_in.start_date,
        end_date=cycle_in.end_date,
        target_yield_quintals=cycle_in.target_yield_quintals,
        actual_yield_quintals=cycle_in.actual_yield_quintals,
        status=cycle_in.status,
        notes=cycle_in.notes,
    )
    db.add(cycle)
    db.commit()
    db.refresh(cycle)
    return CropCycleResponse.model_validate(cycle)


@router.get(
    "/{crop_id}/cycles",
    response_model=List[CropCycleResponse],
    status_code=status.HTTP_200_OK,
    summary="List Crop Cycles"
)
def list_crop_cycles(
    crop_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crop = get_authorized_crop(crop_id, db, current_user)
    cycles = db.query(CropCycle).filter(CropCycle.crop_id == crop.id).order_by(CropCycle.start_date.desc()).all()
    return [CropCycleResponse.model_validate(c) for c in cycles]
