import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class CropCycle(Base):
    __tablename__ = "crop_cycles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="CASCADE"), nullable=False, index=True)
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="CASCADE"), nullable=False, index=True)
    cycle_name = Column(String(100), nullable=False)
    season = Column(String(50), nullable=False)  # KHARIF, RABI, SUMMER, ANNUAL
    start_date = Column(Date, default=date.today, nullable=False)
    end_date = Column(Date, nullable=True)
    target_yield_quintals = Column(Numeric(8, 2), nullable=True)
    actual_yield_quintals = Column(Numeric(8, 2), nullable=True)
    status = Column(String(50), default="ACTIVE", nullable=False)  # ACTIVE, COMPLETED, TERMINATED
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    crop = relationship("Crop", back_populates="crop_cycles")
    field = relationship("Field", back_populates="crop_cycles")
