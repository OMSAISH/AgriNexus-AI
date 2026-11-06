import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Field(Base):
    __tablename__ = "fields"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    area_acres = Column(Numeric(5, 2), nullable=False)
    soil_type = Column(String(100), default="MEDIUM_BLACK", nullable=False)
    soil_ph = Column(Numeric(3, 1), default=7.2, nullable=False)
    location = Column(String(200), nullable=True)
    description = Column(String(500), nullable=True)
    boundary_geojson = Column(JSON, nullable=True)
    irrigation_type = Column(String(50), default="DRIP", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    farm = relationship("Farm", back_populates="fields")
    crops = relationship("Crop", back_populates="field", cascade="all, delete-orphan")
    crop_cycles = relationship("CropCycle", back_populates="field", cascade="all, delete-orphan")
    soil_records = relationship("SoilRecord", back_populates="field", cascade="all, delete-orphan")
    irrigation_records = relationship("IrrigationRecord", back_populates="field", cascade="all, delete-orphan")
    activities = relationship("FarmActivity", back_populates="field")
