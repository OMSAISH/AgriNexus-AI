import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class DiseaseDiagnosis(Base):
    __tablename__ = "disease_diagnoses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True, index=True)
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="SET NULL"), nullable=True, index=True)
    image_url = Column(String(500), nullable=False)
    crop_name = Column(String(100), nullable=False)
    detected_disease = Column(String(150), nullable=False)
    confidence_pct = Column(Numeric(5, 2), nullable=False)
    severity = Column(String(30), default="MILD", nullable=False)  # HEALTHY, MILD, MODERATE, SEVERE
    symptoms = Column(Text, nullable=True)
    chemical_recommendations = Column(JSON, nullable=True)
    organic_recommendations = Column(JSON, nullable=True)
    diagnosed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="diagnoses")
    crop = relationship("Crop", back_populates="diagnoses")
