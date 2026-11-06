import uuid
from datetime import datetime, date
import enum
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import ENUM as PgEnum
from sqlalchemy.orm import relationship
from app.core.database import Base


class CropTypeEnum(str, enum.Enum):
    ONION = "ONION"
    SOYBEAN = "SOYBEAN"
    SUGARCANE = "SUGARCANE"
    WHEAT = "WHEAT"
    COTTON = "COTTON"
    FALLOW = "FALLOW"


class CropStageEnum(str, enum.Enum):
    SOWING = "SOWING"
    VEGETATIVE = "VEGETATIVE"
    FLOWERING = "FLOWERING"
    MATURITY = "MATURITY"
    HARVESTED = "HARVESTED"


class Crop(Base):
    __tablename__ = "crops"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="CASCADE"), nullable=False, index=True)
    crop_name = Column(String(100), nullable=False)
    crop_type = Column(
        PgEnum(CropTypeEnum, name="croptypeenum", create_type=False),
        nullable=False,
        default=CropTypeEnum.ONION,
    )
    variety = Column(String(100), nullable=True)
    sowing_date = Column(Date, default=date.today, nullable=False)
    expected_harvest_date = Column(Date, nullable=True)
    actual_harvest_date = Column(Date, nullable=True)
    current_stage = Column(
        PgEnum(CropStageEnum, name="cropstageenum", create_type=False),
        nullable=False,
        default=CropStageEnum.VEGETATIVE,
    )
    cultivated_area = Column(Numeric(5, 2), nullable=True)
    expected_yield = Column(Numeric(8, 2), nullable=True)  # in Quintals
    actual_yield = Column(Numeric(8, 2), nullable=True)  # in Quintals
    current_status = Column(String(50), default="ACTIVE", nullable=False)  # ACTIVE, HARVESTED, FAILED
    target_moisture_min = Column(Numeric(4, 1), default=40.0, nullable=False)
    target_moisture_max = Column(Numeric(4, 1), default=70.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    field = relationship("Field", back_populates="crops")
    crop_cycles = relationship("CropCycle", back_populates="crop", cascade="all, delete-orphan")
    financial_transactions = relationship("FinancialTransaction", back_populates="crop")
    diagnoses = relationship("DiseaseDiagnosis", back_populates="crop")
    irrigation_records = relationship("IrrigationRecord", back_populates="crop")
    activities = relationship("FarmActivity", back_populates="crop")
