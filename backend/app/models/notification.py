from datetime import datetime
from typing import Optional
from beanie import Document, Indexed
from pydantic import Field

class Notification(Document):
    user_id: Indexed(str)
    title: str
    message: str
    type: str = "system"  # "submission" | "review_request" | "approval" | "system"
    link: Optional[str] = None
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notifications"

class ActivityLog(Document):
    user_id: str
    user_name: str
    action: str  # "SUBMITTED_REPORT" | "REQUESTED_CORRECTION" | "APPROVED_REPORT" | "CREATED_PROJECT"
    details: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "activity_logs"
