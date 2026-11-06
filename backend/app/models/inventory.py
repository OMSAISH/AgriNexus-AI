import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # SEEDS, FERTILIZER, PESTICIDE, TOOL, FUEL, OTHER
    unit = Column(String(20), default="KG", nullable=False)  # KG, LITER, BAG, PACKET, NOS
    current_stock = Column(Numeric(10, 2), default=0.00, nullable=False)
    reorder_level = Column(Numeric(10, 2), default=10.00, nullable=False)
    unit_price = Column(Numeric(10, 2), default=0.00, nullable=False)
    supplier = Column(String(150), nullable=True)
    batch_number = Column(String(100), nullable=True)
    expiry_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    farm = relationship("Farm", back_populates="inventory_items")
    transactions = relationship("InventoryTransaction", back_populates="item", cascade="all, delete-orphan")


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String(36), ForeignKey("inventory_items.id", ondelete="CASCADE"), nullable=False, index=True)
    transaction_type = Column(String(20), nullable=False)  # INWARD, OUTWARD, ADJUSTMENT
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_cost = Column(Numeric(12, 2), nullable=False)
    reference_activity_id = Column(String(36), nullable=True)
    transaction_date = Column(Date, default=date.today, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    item = relationship("InventoryItem", back_populates="transactions")
