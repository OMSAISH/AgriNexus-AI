import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class SoilRecord(Base):
    __tablename__ = "soil_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="CASCADE"), nullable=False, index=True)
    test_date = Column(Date, default=date.today, nullable=False)
    ph_level = Column(Numeric(4, 2), nullable=False)
    nitrogen_ppm = Column(Numeric(6, 2), nullable=False)
    phosphorus_ppm = Column(Numeric(6, 2), nullable=False)
    potassium_ppm = Column(Numeric(6, 2), nullable=False)
    organic_carbon_pct = Column(Numeric(4, 2), nullable=True)
    moisture_pct = Column(Numeric(5, 2), nullable=True)
    electrical_conductivity = Column(Numeric(5, 2), nullable=True)
    nitrogen_status = Column(String(20), default="OPTIMAL", nullable=False)  # DEFICIENT, OPTIMAL, EXCESS
    phosphorus_status = Column(String(20), default="OPTIMAL", nullable=False)
    potassium_status = Column(String(20), default="OPTIMAL", nullable=False)
    recommendations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    field = relationship("Field", back_populates="soil_records")
