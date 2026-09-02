from typing import List
from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.dashboard import (
    SummaryOut, TasksTrendItem, StatusByMemberItem,
    WorkloadByProjectItem, HoursByTypeItem, ActivityFeedItem
)
from app.services.dashboard_service import DashboardService
from app.deps import require_role

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=SummaryOut)
async def get_summary(current_user: User = Depends(require_role("manager", "admin"))):
    return await DashboardService.get_summary()

@router.get("/charts/tasks-trend", response_model=List[TasksTrendItem])
async def get_tasks_trend(current_user: User = Depends(require_role("manager", "admin"))):
    return await DashboardService.get_tasks_trend()

@router.get("/charts/status-by-member", response_model=List[StatusByMemberItem])
async def get_status_by_member(current_user: User = Depends(require_role("manager", "admin"))):
    return await DashboardService.get_status_by_member()

@router.get("/charts/workload-by-project", response_model=List[WorkloadByProjectItem])
async def get_workload_by_project(current_user: User = Depends(require_role("manager", "admin"))):
    return await DashboardService.get_workload_by_project()

@router.get("/charts/hours-by-type", response_model=List[HoursByTypeItem])
async def get_hours_by_type(current_user: User = Depends(require_role("manager", "admin"))):
    return await DashboardService.get_hours_by_type()

@router.get("/activity-feed", response_model=List[ActivityFeedItem])
async def get_activity_feed(current_user: User = Depends(require_role("manager", "admin"))):
    return await DashboardService.get_activity_feed()
