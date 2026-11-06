from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from app.models.user import UserRoleEnum


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=150)
    phone_number: Optional[str] = None
    preferred_language: str = Field(default="en", max_length=10)
    role: UserRoleEnum = UserRoleEnum.FARMER


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    confirm_password: Optional[str] = None

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, values):
        # Allow optional confirm_password validation if provided
        if v is not None and "password" in values.data and v != values.data["password"]:
            raise ValueError("Passwords do not match.")
        return v

    @field_validator("role")
    @classmethod
    def restrict_admin_registration(cls, v):
        # Do not allow public registration as ADMIN
        if v == UserRoleEnum.ADMIN:
            raise ValueError("Public registration as Administrator is not permitted.")
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=150)
    phone_number: Optional[str] = None
    preferred_language: Optional[str] = None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str
    phone_number: Optional[str] = None
    preferred_language: str = "en"
    primary_role: UserRoleEnum
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
