from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import User
from app.schemas.report import ReviewAction, ReportOut
from app.services.report_service import ReportService
from app.deps import require_role

router = APIRouter(prefix="/reports", tags=["Reviews"])

@router.post("/{report_id}/review", response_model=ReportOut)
async def review_report(
    report_id: str,
    review_in: ReviewAction,
    current_user: User = Depends(require_role("manager", "admin"))
):
    report = await ReportService.review_report(report_id, current_user, review_in)
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
