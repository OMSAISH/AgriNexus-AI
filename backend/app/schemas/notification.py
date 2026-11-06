from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class NotificationCreate(BaseModel):
    title: str = Field(..., max_length=150)
    message: str
    notification_type: str = Field(default="INFO", max_length=30)
    link_url: Optional[str] = None


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    title: str
    message: str
    notification_type: str
    is_read: bool
    link_url: Optional[str] = None
    created_at: datetime
