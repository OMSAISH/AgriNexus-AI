import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class IrrigationRecord(Base):
    __tablename__ = "irrigation_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="CASCADE"), nullable=False, index=True)
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True, index=True)
    method = Column(String(50), default="DRIP", nullable=False)  # DRIP, SPRINKLER, FLOOD, FURROW
    duration_minutes = Column(Numeric(6, 1), nullable=False)
    water_volume_liters = Column(Numeric(10, 2), nullable=False)
    energy_units_kwh = Column(Numeric(6, 2), default=0.00, nullable=True)
    energy_cost = Column(Numeric(8, 2), default=0.00, nullable=True)
    applied_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    operator_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    field = relationship("Field", back_populates="irrigation_records")
    crop = relationship("Crop", back_populates="irrigation_records")
