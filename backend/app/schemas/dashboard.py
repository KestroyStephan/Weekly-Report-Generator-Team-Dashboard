from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SummaryOut(BaseModel):
    total_submitted: int
    total_pending_review: int
    total_needs_correction: int
    total_approved: int
    open_blockers_count: int

class TasksTrendItem(BaseModel):
    week_start_date: str
    completed_tasks: int
    planned_tasks: int

class StatusByMemberItem(BaseModel):
    member_id: str
    member_name: str
    submitted: int
    approved: int
    needs_correction: int
    draft: int

class WorkloadByProjectItem(BaseModel):
    project_id: str
    project_name: str
    task_count: int

class HoursByTypeItem(BaseModel):
    category: str
    hours: float

class ActivityFeedItem(BaseModel):
    id: str
    report_id: str
    user_name: str
    action: str  # "submitted" | "approved" | "requested_changes" | "created_draft"
    details: str
    timestamp: str
