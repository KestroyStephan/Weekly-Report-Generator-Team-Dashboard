from datetime import datetime
from typing import Optional
from beanie import Document, Indexed
from pydantic import Field, EmailStr

class User(Document):
    name: str
    email: Indexed(str, unique=True)
    password_hash: str
    role: str = "member"  # "member" | "manager" | "admin"
    invite_token: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
