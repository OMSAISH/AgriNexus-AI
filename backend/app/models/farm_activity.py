import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class FarmActivity(Base):
    __tablename__ = "farm_activities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="SET NULL"), nullable=True, index=True)
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(150), nullable=False)
    activity_type = Column(String(50), nullable=False)  # SOWING, IRRIGATION, FERTILIZATION, SPRAYING, WEEDING, HARVESTING, OTHER
    status = Column(String(50), default="SCHEDULED", nullable=False)  # SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    priority = Column(String(20), default="MEDIUM", nullable=False)  # LOW, MEDIUM, HIGH, URGENT
    scheduled_date = Column(Date, default=date.today, nullable=False)
    completed_date = Column(Date, nullable=True)
    cost = Column(Numeric(10, 2), default=0.00, nullable=False)
    assigned_to = Column(String(150), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    farm = relationship("Farm", back_populates="activities")
    field = relationship("Field", back_populates="activities")
    crop = relationship("Crop", back_populates="activities")
