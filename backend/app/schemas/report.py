from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.models.report import ReportContent, ReviewDetail

class ReportCreate(BaseModel):
    project_id: Optional[str] = None
    week_start_date: str
    week_end_date: str
    content: Optional[ReportContent] = None

class ReportUpdate(BaseModel):
    project_id: Optional[str] = None
    content: Optional[ReportContent] = None

class ReviewAction(BaseModel):
    action: str  # "approve" | "request_changes"
    comment: Optional[str] = None

class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    user_name: Optional[str] = ""
    project_id: Optional[str] = None
    project_name: Optional[str] = ""
    week_start_date: str
    week_end_date: str
    status: str
    version: int
    is_latest: bool
    content: ReportContent
    review: ReviewDetail
    submitted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class ReportVersionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    report_group_id: str
    report_id: str
    version_number: int
    content: ReportContent
    status_at_time: str
    review_comment_at_time: Optional[str] = None
    submitted_at: Optional[datetime] = None
    created_at: datetime
