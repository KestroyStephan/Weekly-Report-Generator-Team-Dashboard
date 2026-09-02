from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models.report import Report, ReportVersion
from app.models.user import User
from app.schemas.report import ReportCreate, ReportUpdate, ReportOut, ReportVersionOut
from app.services.report_service import ReportService
from app.deps import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[ReportOut])
async def list_reports(
    week_start_date: Optional[str] = None,
    user_id: Optional[str] = None,
    project_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user)
):
    query = {}
    
    # Scoped access: member can only view their own reports
    if current_user.role == "member":
        query["user_id"] = str(current_user.id)
    elif user_id:
        query["user_id"] = user_id
        
    if week_start_date:
        query["week_start_date"] = week_start_date
    if project_id:
        query["project_id"] = project_id
    if status_filter:
        query["status"] = status_filter

    reports = await Report.find(query).sort("-created_at").to_list()
    return [
        ReportOut(
            id=str(r.id),
            user_id=r.user_id,
            user_name=r.user_name or "",
            project_id=r.project_id,
            project_name=r.project_name or "",
            week_start_date=r.week_start_date,
            week_end_date=r.week_end_date,
            status=r.status,
            version=r.version,
            is_latest=r.is_latest,
            content=r.content,
            review=r.review,
            submitted_at=r.submitted_at,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in reports
    ]

@router.post("", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_in: ReportCreate,
    current_user: User = Depends(get_current_user)
):
    report = await ReportService.create_or_get_draft(current_user, report_in)
    return ReportOut(
        id=str(report.id),
        user_id=report.user_id,
        user_name=report.user_name or "",
        project_id=report.project_id,
        project_name=report.project_name or "",
        week_start_date=report.week_start_date,
        week_end_date=report.week_end_date,
        status=report.status,
        version=report.version,
        is_latest=report.is_latest,
        content=report.content,
        review=report.review,
        submitted_at=report.submitted_at,
        created_at=report.created_at,
        updated_at=report.updated_at
    )

@router.get("/{report_id}", response_model=ReportOut)
async def get_report(
    report_id: str,
    current_user: User = Depends(get_current_user)
):
    report = await Report.get(report_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    
    # Check permissions
    if current_user.role == "member" and report.user_id != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return ReportOut(
        id=str(report.id),
        user_id=report.user_id,
        user_name=report.user_name or "",
        project_id=report.project_id,
        project_name=report.project_name or "",
        week_start_date=report.week_start_date,
        week_end_date=report.week_end_date,
        status=report.status,
        version=report.version,
        is_latest=report.is_latest,
        content=report.content,
        review=report.review,
        submitted_at=report.submitted_at,
        created_at=report.created_at,
        updated_at=report.updated_at
    )

@router.put("/{report_id}", response_model=ReportOut)
async def update_report(
    report_id: str,
    update_in: ReportUpdate,
    current_user: User = Depends(get_current_user)
):
    report = await ReportService.update_report_content(report_id, current_user, update_in)
    return ReportOut(
        id=str(report.id),
        user_id=report.user_id,
        user_name=report.user_name or "",
        project_id=report.project_id,
        project_name=report.project_name or "",
        week_start_date=report.week_start_date,
        week_end_date=report.week_end_date,
        status=report.status,
        version=report.version,
        is_latest=report.is_latest,
        content=report.content,
        review=report.review,
        submitted_at=report.submitted_at,
        created_at=report.created_at,
        updated_at=report.updated_at
    )

@router.post("/{report_id}/submit", response_model=ReportOut)
async def submit_report(
    report_id: str,
    current_user: User = Depends(get_current_user)
):
    report = await ReportService.submit_report(report_id, current_user)
    return ReportOut(
        id=str(report.id),
        user_id=report.user_id,
        user_name=report.user_name or "",
        project_id=report.project_id,
        project_name=report.project_name or "",
        week_start_date=report.week_start_date,
        week_end_date=report.week_end_date,
        status=report.status,
        version=report.version,
        is_latest=report.is_latest,
        content=report.content,
        review=report.review,
        submitted_at=report.submitted_at,
        created_at=report.created_at,
        updated_at=report.updated_at
    )

@router.get("/{report_id}/versions", response_model=List[ReportVersionOut])
async def get_report_versions(
    report_id: str,
    current_user: User = Depends(get_current_user)
):
    report = await Report.get(report_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    
    if current_user.role == "member" and report.user_id != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    report_group_id = f"{report.user_id}_{report.week_start_date}"
    versions = await ReportVersion.find(
        ReportVersion.report_group_id == report_group_id
    ).sort("version_number").to_list()

    return [
        ReportVersionOut(
            id=str(v.id),
            report_group_id=v.report_group_id,
            report_id=v.report_id,
            version_number=v.version_number,
            content=v.content,
            status_at_time=v.status_at_time,
            review_comment_at_time=v.review_comment_at_time,
            submitted_at=v.submitted_at,
            created_at=v.created_at
        )
        for v in versions
    ]
