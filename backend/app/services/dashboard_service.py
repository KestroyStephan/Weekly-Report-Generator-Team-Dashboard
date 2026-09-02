from typing import List, Dict, Any
from app.models.report import Report
from app.models.user import User
from app.models.project import Project
from app.schemas.dashboard import (
    SummaryOut, TasksTrendItem, StatusByMemberItem,
    WorkloadByProjectItem, HoursByTypeItem, ActivityFeedItem
)

class DashboardService:

    @staticmethod
    async def get_summary() -> SummaryOut:
        reports = await Report.find(Report.is_latest == True).to_list()
        
        submitted_count = sum(1 for r in reports if r.status == "submitted")
        needs_correction_count = sum(1 for r in reports if r.status == "needs_correction")
        approved_count = sum(1 for r in reports if r.status == "approved")
        
        # Open blockers
        open_blockers = 0
        for r in reports:
            if r.content and r.content.blockers:
                open_blockers += sum(1 for b in r.content.blockers if b.is_key_issue)

        return SummaryOut(
            total_submitted=submitted_count,
            total_pending_review=submitted_count,
            total_needs_correction=needs_correction_count,
            total_approved=approved_count,
            open_blockers_count=open_blockers
        )

    @staticmethod
    async def get_tasks_trend() -> List[TasksTrendItem]:
        reports = await Report.find_all().to_list()
        by_week: Dict[str, Dict[str, int]] = {}
        
        for r in reports:
            week = r.week_start_date
            if week not in by_week:
                by_week[week] = {"completed": 0, "planned": 0}
            
            if r.content:
                by_week[week]["completed"] += len(r.content.tasks_completed)
                by_week[week]["planned"] += len(r.content.tasks_planned_next_week)

        sorted_weeks = sorted(by_week.keys())
        return [
            TasksTrendItem(
                week_start_date=w,
                completed_tasks=by_week[w]["completed"],
                planned_tasks=by_week[w]["planned"]
            )
            for w in sorted_weeks
        ]

    @staticmethod
    async def get_status_by_member() -> List[StatusByMemberItem]:
        users = await User.find(User.role == "member").to_list()
        reports = await Report.find_all().to_list()
        
        member_stats = {
            str(u.id): {"name": u.name, "submitted": 0, "approved": 0, "needs_correction": 0, "draft": 0}
            for u in users
        }

        for r in reports:
            uid = r.user_id
            if uid in member_stats:
                st = r.status
                if st in member_stats[uid]:
                    member_stats[uid][st] += 1

        return [
            StatusByMemberItem(
                member_id=uid,
                member_name=data["name"],
                submitted=data["submitted"],
                approved=data["approved"],
                needs_correction=data["needs_correction"],
                draft=data["draft"]
            )
            for uid, data in member_stats.items()
        ]

    @staticmethod
    async def get_workload_by_project() -> List[WorkloadByProjectItem]:
        projects = await Project.find_all().to_list()
        reports = await Report.find_all().to_list()
        
        proj_counts: Dict[str, Dict[str, Any]] = {
            str(p.id): {"name": p.name, "count": 0}
            for p in projects
        }
        proj_counts["unassigned"] = {"name": "General / Other", "count": 0}

        for r in reports:
            pid = r.project_id or "unassigned"
            if pid not in proj_counts:
                proj_counts[pid] = {"name": r.project_name or "Project", "count": 0}
            
            if r.content:
                task_count = len(r.content.tasks_completed) + len(r.content.tasks_planned_next_week)
                proj_counts[pid]["count"] += max(1, task_count)

        return [
            WorkloadByProjectItem(
                project_id=pid,
                project_name=info["name"],
                task_count=info["count"]
            )
            for pid, info in proj_counts.items()
            if info["count"] > 0
        ]

    @staticmethod
    async def get_hours_by_type() -> List[HoursByTypeItem]:
        reports = await Report.find_all().to_list()
        totals = {
            "development": 0.0,
            "testing": 0.0,
            "meetings": 0.0,
            "documentation": 0.0,
            "other": 0.0
        }

        for r in reports:
            if r.content and r.content.hours_by_type:
                h = r.content.hours_by_type
                totals["development"] += h.development
                totals["testing"] += h.testing
                totals["meetings"] += h.meetings
                totals["documentation"] += h.documentation
                totals["other"] += h.other

        return [
            HoursByTypeItem(category=cat.capitalize(), hours=round(val, 1))
            for cat, val in totals.items()
        ]

    @staticmethod
    async def get_activity_feed() -> List[ActivityFeedItem]:
        reports = await Report.find_all().sort("-updated_at").limit(15).to_list()
        feed = []
        
        for r in reports:
            if r.review and r.review.reviewed_at:
                action = "approved" if r.status == "approved" else "requested_changes"
                feed.append(ActivityFeedItem(
                    id=f"{r.id}_review",
                    report_id=str(r.id),
                    user_name=r.review.reviewer_name or "Manager",
                    action=action,
                    details=f"{action.replace('_', ' ').capitalize()} report for {r.user_name} ({r.week_start_date})",
                    timestamp=r.review.reviewed_at.isoformat()
                ))
            if r.submitted_at:
                feed.append(ActivityFeedItem(
                    id=f"{r.id}_submit",
                    report_id=str(r.id),
                    user_name=r.user_name or "Team Member",
                    action="submitted",
                    details=f"Submitted weekly report for {r.week_start_date}",
                    timestamp=r.submitted_at.isoformat()
                ))

        feed.sort(key=lambda x: x.timestamp, reverse=True)
        return feed[:10]
