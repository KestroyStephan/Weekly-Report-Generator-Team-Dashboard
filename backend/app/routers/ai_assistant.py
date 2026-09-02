from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.models.user import User
from app.services.ai_service import AIService
from app.deps import require_role

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

class ChatRequest(BaseModel):
    question: str
    week_start_date: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    provider: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    request: ChatRequest,
    current_user: User = Depends(require_role("manager", "admin"))
):
    answer = await AIService.chat(request.question, request.week_start_date)
    return ChatResponse(
        answer=answer,
        provider="ollama/grok"
    )
