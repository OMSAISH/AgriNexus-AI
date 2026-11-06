import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class FinancialTransaction(Base):
    __tablename__ = "financial_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True, index=True)
    transaction_type = Column(String(20), nullable=False)  # INCOME, EXPENSE
    category = Column(String(50), nullable=False)  # HARVEST_SALE, SEEDS, FERTILIZERS, PESTICIDES, LABOUR, DIESEL, EQUIPMENT, IRRIGATION, SUBSIDY, OTHER
    amount = Column(Numeric(12, 2), nullable=False)
    transaction_date = Column(Date, default=date.today, nullable=False, index=True)
    payment_method = Column(String(30), default="CASH", nullable=False)  # CASH, UPI, BANK_TRANSFER, CHEQUE
    invoice_number = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="financial_transactions")
    farm = relationship("Farm", back_populates="financial_transactions")
    crop = relationship("Crop", back_populates="financial_transactions")
