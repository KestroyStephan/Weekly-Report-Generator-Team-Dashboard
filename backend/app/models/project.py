from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field

class Project(Document):
    name: str
    description: Optional[str] = ""
    status: str = "active"  # "active" | "archived"
    created_by: str  # user_id
    assigned_members: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "projects"
