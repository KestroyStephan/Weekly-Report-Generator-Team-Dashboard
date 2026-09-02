from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, status
from app.models.report import Report, ReportVersion, ReportContent, ReviewDetail
from app.models.user import User
from app.models.project import Project
from app.schemas.report import ReportCreate, ReportUpdate, ReviewAction

class ReportService:

    @staticmethod
    async def create_or_get_draft(user: User, report_in: ReportCreate) -> Report:
        # Check if active report for this week already exists for this user
        existing_report = await Report.find_one(
            Report.user_id == str(user.id),
            Report.week_start_date == report_in.week_start_date
        )
        if existing_report:
            return existing_report

        project_name = ""
        if report_in.project_id:
            project = await Project.get(report_in.project_id)
            if project:
                project_name = project.name

        new_report = Report(
            user_id=str(user.id),
            user_name=user.name,
            project_id=report_in.project_id,
            project_name=project_name,
            week_start_date=report_in.week_start_date,
            week_end_date=report_in.week_end_date,
            status="draft",
            version=1,
            is_latest=True,
            content=report_in.content or ReportContent(),
            review=ReviewDetail(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        await new_report.insert()
        return new_report

    @staticmethod
    async def update_report_content(report_id: str, user: User, update_in: ReportUpdate) -> Report:
        report = await Report.get(report_id)
        if not report:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        
        # Enforce Ownership: Member can only update their own report
        if user.role == "member" and report.user_id != str(user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot edit another member's report")
        
        # Enforce Manager restriction: Managers cannot edit member report content directly
        if user.role in ["manager", "admin"] and report.user_id != str(user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Managers cannot modify member report content directly")

        # Enforce Status constraint: Can only edit draft or needs_correction
        if report.status not in ["draft", "needs_correction"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot edit report in status '{report.status}'. Edits are only allowed for 'draft' or 'needs_correction'."
            )

        if update_in.project_id is not None:
            report.project_id = update_in.project_id
            project = await Project.get(update_in.project_id)
            report.project_name = project.name if project else ""

        if update_in.content is not None:
            report.content = update_in.content

        report.updated_at = datetime.utcnow()
        await report.save()
        return report

    @staticmethod
    async def submit_report(report_id: str, user: User) -> Report:
        report = await Report.get(report_id)
        if not report:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        
        if report.user_id != str(user.id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only submit your own report")

        if report.status not in ["draft", "needs_correction"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Report cannot be submitted from status '{report.status}'"
            )

        report_group_id = f"{report.user_id}_{report.week_start_date}"

        # If this is a resubmission (or already had a prior submission state), save snapshot in ReportVersion
        if report.status == "needs_correction" or report.version > 1 or report.submitted_at is not None:
            version_snapshot = ReportVersion(
                report_group_id=report_group_id,
                report_id=str(report.id),
                version_number=report.version,
                content=report.content,
                status_at_time=report.status,
                review_comment_at_time=report.review.comment if report.review else None,
                submitted_at=report.submitted_at,
                created_at=datetime.utcnow()
            )
            await version_snapshot.insert()
            report.version += 1

        report.status = "submitted"
        report.submitted_at = datetime.utcnow()
        report.updated_at = datetime.utcnow()
        await report.save()
        return report

    @staticmethod
    async def review_report(report_id: str, reviewer: User, review_in: ReviewAction) -> Report:
        report = await Report.get(report_id)
        if not report:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

        if review_in.action == "approve":
            report.status = "approved"
        elif review_in.action == "request_changes":
            report.status = "needs_correction"
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Action must be 'approve' or 'request_changes'")

        report.review = ReviewDetail(
            reviewed_by=str(reviewer.id),
            reviewer_name=reviewer.name,
            comment=review_in.comment or "",
            reviewed_at=datetime.utcnow()
        )
        report.updated_at = datetime.utcnow()
        await report.save()
        return report
