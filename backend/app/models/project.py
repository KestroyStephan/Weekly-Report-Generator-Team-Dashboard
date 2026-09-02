from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field

class Project(Document):
    name: str
    description: Optional[str] = ""
    status: str = "active"  # "active" | "archived"
    created_by: str  # user_id
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "projects"
