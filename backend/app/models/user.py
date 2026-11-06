import uuid
from datetime import datetime
import enum
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import ENUM as PgEnum
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserRoleEnum(str, enum.Enum):
    FARMER = "FARMER"
    AGRONOMIST = "AGRONOMIST"
    CHC_OPERATOR = "CHC_OPERATOR"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone_number = Column(String(20), nullable=True)
    preferred_language = Column(String(10), default="en", nullable=False)
    primary_role = Column(
        PgEnum(UserRoleEnum, name="userroleenum", create_type=False),
        nullable=False,
        default=UserRoleEnum.FARMER,
    )
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    farms = relationship("Farm", back_populates="owner", cascade="all, delete-orphan")
    roles = relationship("Role", secondary="user_roles", back_populates="users")
    financial_transactions = relationship("FinancialTransaction", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    diagnoses = relationship("DiseaseDiagnosis", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")
