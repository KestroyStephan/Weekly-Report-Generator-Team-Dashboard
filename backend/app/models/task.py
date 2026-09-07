from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field

class Task(Document):
    title: str
    description: Optional[str] = ""
    priority: str = "medium"  # "low", "medium", "high"
    status: str = "todo"      # "todo", "in_progress", "done"
    project_id: str           # References projects._id
    assigned_to: str          # References users._id
    created_by: str           # References users._id (Manager who created it)
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tasks"
