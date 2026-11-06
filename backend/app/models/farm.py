import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    village = Column(String(100), nullable=False)
    taluka = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Maharashtra", nullable=False)
    total_area_acres = Column(Numeric(6, 2), nullable=False)
    area_unit = Column(String(20), default="acres", nullable=False)
    description = Column(String(500), nullable=True)
    latitude = Column(Numeric(9, 6), nullable=False)
    longitude = Column(Numeric(9, 6), nullable=False)
    boundary_geojson = Column(JSON, nullable=True)
    soil_type = Column(String(100), default="MEDIUM_BLACK", nullable=False)
    irrigation_source = Column(String(50), default="DRIP", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="farms")
    fields = relationship("Field", back_populates="farm", cascade="all, delete-orphan")
    activities = relationship("FarmActivity", back_populates="farm", cascade="all, delete-orphan")
    inventory_items = relationship("InventoryItem", back_populates="farm", cascade="all, delete-orphan")
    labour_pool = relationship("Labour", back_populates="farm", cascade="all, delete-orphan")
    equipment_fleet = relationship("Equipment", back_populates="farm", cascade="all, delete-orphan")
    financial_transactions = relationship("FinancialTransaction", back_populates="farm", cascade="all, delete-orphan")
