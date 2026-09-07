from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from app.models.notification import Notification, ActivityLog
from app.models.user import User
from app.deps import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    link: Optional[str] = None
    is_read: bool
    created_at: str

class NotificationListResponse(BaseModel):
    unread_count: int
    notifications: List[NotificationOut]

class ActivityLogOut(BaseModel):
    id: str
    user_id: str
    user_name: str
    action: str
    details: str
    created_at: str

class ReminderRequest(BaseModel):
    user_id: str
    message: Optional[str] = "Please remember to submit your weekly report before the deadline."

@router.get("", response_model=NotificationListResponse)
async def list_notifications(current_user: User = Depends(get_current_user)):
    user_id = str(current_user.id)
    notifications = await Notification.find(
        Notification.user_id == user_id
    ).sort("-created_at").limit(20).to_list()
    
    unread_count = await Notification.find(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).count()

    out_items = [
        NotificationOut(
            id=str(n.id),
            user_id=n.user_id,
            title=n.title,
            message=n.message,
            type=n.type,
            link=n.link,
            is_read=n.is_read,
            created_at=n.created_at.isoformat()
        ) for n in notifications
    ]
    return NotificationListResponse(unread_count=unread_count, notifications=out_items)

@router.post("/send-reminder")
async def send_reminder(req: ReminderRequest, current_user: User = Depends(get_current_user)):
    target_user = await User.get(req.user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    n = Notification(
        user_id=str(target_user.id),
        title="Weekly Report Reminder",
        message=req.message,
        type="review_request",
        link="/my-report",
        is_read=False
    )
    await n.insert()
    return {"status": "success", "message": f"Reminder sent to {target_user.name}"}

@router.post("/{notification_id}/read")
async def mark_read(notification_id: str, current_user: User = Depends(get_current_user)):
    n = await Notification.get(notification_id)
    if not n or n.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    await n.save()
    return {"status": "success"}

@router.post("/read-all")
async def mark_all_read(current_user: User = Depends(get_current_user)):
    user_id = str(current_user.id)
    notifications = await Notification.find(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).to_list()
    for n in notifications:
        n.is_read = True
        await n.save()
    return {"status": "success"}

@router.get("/activity-logs", response_model=List[ActivityLogOut])
async def list_activity_logs(current_user: User = Depends(get_current_user)):
    logs = await ActivityLog.find_all().sort("-created_at").limit(30).to_list()
    return [
        ActivityLogOut(
            id=str(l.id),
            user_id=l.user_id,
            user_name=l.user_name,
            action=l.action,
            details=l.details,
            created_at=l.created_at.isoformat()
        ) for l in logs
    ]

