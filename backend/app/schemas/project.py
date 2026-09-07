from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    status: Optional[str] = "active"
    assigned_members: Optional[List[str]] = Field(default_factory=list)

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assigned_members: Optional[List[str]] = None

class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str
    status: str
    created_by: str
    assigned_members: List[str]
    created_at: datetime
