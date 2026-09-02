from datetime import datetime
from typing import List, Optional, Dict, Any
from beanie import Document
from pydantic import BaseModel, Field

class TaskItem(BaseModel):
    task_name: str
    priority: str = "medium"  # "low" | "medium" | "high"
    planned_pct: int = 100
    actual_pct: int = 0
    status: str = "in_progress"  # "todo" | "in_progress" | "completed" | "blocked"
    time_planned_hrs: float = 0.0
    time_spent_hrs: float = 0.0
    deliverable: str = ""

class PlannedTaskItem(BaseModel):
    task_name: str
    priority: str = "medium"
    notes: str = ""

class BlockerItem(BaseModel):
    text: str
    is_key_issue: bool = False

class AchievementItem(BaseModel):
    text: str
    is_key_achievement: bool = False

class HoursByType(BaseModel):
    development: float = 0.0
    testing: float = 0.0
    meetings: float = 0.0
    documentation: float = 0.0
    other: float = 0.0

class ReportContent(BaseModel):
    tasks_completed: List[TaskItem] = Field(default_factory=list)
    tasks_planned_next_week: List[PlannedTaskItem] = Field(default_factory=list)
    blockers: List[BlockerItem] = Field(default_factory=list)
    achievements: List[AchievementItem] = Field(default_factory=list)
    hours_by_type: HoursByType = Field(default_factory=HoursByType)
    notes: str = ""

class ReviewDetail(BaseModel):
    reviewed_by: Optional[str] = None  # user_id
    reviewer_name: Optional[str] = None
    comment: Optional[str] = None
    reviewed_at: Optional[datetime] = None

class Report(Document):
    user_id: str
    user_name: Optional[str] = ""
    project_id: Optional[str] = None
    project_name: Optional[str] = ""
    week_start_date: str  # YYYY-MM-DD
    week_end_date: str    # YYYY-MM-DD
    status: str = "draft"  # "draft" | "submitted" | "needs_correction" | "approved"
    version: int = 1
    is_latest: bool = True
    content: ReportContent = Field(default_factory=ReportContent)
    review: ReviewDetail = Field(default_factory=ReviewDetail)
    submitted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reports"

class ReportVersion(Document):
    report_group_id: str  # e.g. "{user_id}_{week_start_date}"
    report_id: str
    version_number: int
    content: ReportContent
    status_at_time: str
    review_comment_at_time: Optional[str] = None
    submitted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "report_versions"
