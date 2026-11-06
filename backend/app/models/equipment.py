import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    equipment_type = Column(String(50), nullable=False)  # TRACTOR, TILLER, SPRAYER, PUMP, HARVESTER, DRIP_CONTROLLER, OTHER
    model_number = Column(String(100), nullable=True)
    serial_number = Column(String(100), nullable=True)
    purchase_date = Column(Date, nullable=True)
    purchase_price = Column(Numeric(12, 2), default=0.00, nullable=False)
    status = Column(String(30), default="OPERATIONAL", nullable=False)  # OPERATIONAL, MAINTENANCE, RETIRED
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    farm = relationship("Farm", back_populates="equipment_fleet")
    maintenance_records = relationship("EquipmentMaintenance", back_populates="equipment", cascade="all, delete-orphan")


class EquipmentMaintenance(Base):
    __tablename__ = "equipment_maintenance"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    equipment_id = Column(String(36), ForeignKey("equipment.id", ondelete="CASCADE"), nullable=False, index=True)
    maintenance_date = Column(Date, default=date.today, nullable=False)
    service_type = Column(String(50), default="ROUTINE", nullable=False)  # ROUTINE, REPAIR, OVERHAUL
    cost = Column(Numeric(10, 2), default=0.00, nullable=False)
    description = Column(Text, nullable=False)
    technician_name = Column(String(150), nullable=True)
    next_service_due = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    equipment = relationship("Equipment", back_populates="maintenance_records")
