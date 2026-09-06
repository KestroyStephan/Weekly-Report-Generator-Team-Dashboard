from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: Optional[str] = None
    role: Optional[str] = "member"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    role: str
    created_at: datetime
    invitation_link: Optional[str] = None

class UserRoleUpdate(BaseModel):
    role: str

class SetupPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    password: str

