import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Labour(Base):
    __tablename__ = "labour"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    full_name = Column(String(150), nullable=False)
    phone_number = Column(String(20), nullable=True)
    skill_type = Column(String(50), default="GENERAL", nullable=False)  # GENERAL, OPERATOR, HARVESTER, SUPERVISOR
    daily_wage = Column(Numeric(8, 2), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    farm = relationship("Farm", back_populates="labour_pool")
    attendance_records = relationship("LabourAttendance", back_populates="worker", cascade="all, delete-orphan")


class LabourAttendance(Base):
    __tablename__ = "labour_attendance"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    labour_id = Column(String(36), ForeignKey("labour.id", ondelete="CASCADE"), nullable=False, index=True)
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    attendance_date = Column(Date, default=date.today, nullable=False)
    status = Column(String(20), default="PRESENT", nullable=False)  # PRESENT, HALF_DAY, ABSENT
    hours_worked = Column(Numeric(4, 1), default=8.0, nullable=False)
    wage_paid = Column(Numeric(8, 2), default=0.00, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    worker = relationship("Labour", back_populates="attendance_records")
