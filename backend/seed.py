import asyncio
from datetime import datetime, timedelta
from app.database import init_db, close_db
from app.models.user import User
from app.models.project import Project
from app.models.report import (
    Report, ReportVersion, ReportContent, TaskItem, PlannedTaskItem,
    BlockerItem, AchievementItem, HoursByType, ReviewDetail
)
from app.services.auth_service import hash_password

async def seed_data():
    print("Initializing Database connection for seeding...")
    await init_db()

    # Clear existing collections
    await User.delete_all()
    await Project.delete_all()
    await Report.delete_all()
    await ReportVersion.delete_all()

    print("Creating initial users...")
    password_hash = hash_password("Password123")

    manager = User(name="Alex Rivera", email="manager@demo.com", password_hash=password_hash, role="manager")
    admin = User(name="Admin User", email="admin@demo.com", password_hash=password_hash, role="admin")
    member1 = User(name="Sarah Chen", email="member1@demo.com", password_hash=password_hash, role="member")
    member2 = User(name="Marcus Vance", email="member2@demo.com", password_hash=password_hash, role="member")
    member3 = User(name="Elena Rostova", email="member3@demo.com", password_hash=password_hash, role="member")

    for u in [manager, admin, member1, member2, member3]:
        await u.insert()

    print("Creating sample projects...")
    proj1 = Project(name="Client Mobile Portal", description="Customer-facing mobile application and web portal", status="active", created_by=str(manager.id))
    proj2 = Project(name="Internal Analytics Engine", description="Real-time data aggregation pipeline", status="active", created_by=str(manager.id))
    proj3 = Project(name="Infrastructure & DevOps", description="CI/CD pipelines, Kubernetes migrations, and monitoring", status="active", created_by=str(manager.id))
    proj4 = Project(name="R&D AI Integration", description="LLM integration prototypes and assistant services", status="active", created_by=str(manager.id))

    for p in [proj1, proj2, proj3, proj4]:
        await p.insert()

    print("Creating report histories across 4 weeks...")
    weeks = [
        ("2026-08-03", "2026-08-09"),
        ("2026-08-10", "2026-08-16"),
        ("2026-08-17", "2026-08-23"),
        ("2026-08-24", "2026-08-30"),
    ]

    members = [member1, member2, member3]
    projects = [proj1, proj2, proj3]

    for idx, member in enumerate(members):
        project = projects[idx % len(projects)]

        # Week 1: Approved
        w1_start, w1_end = weeks[0]
        rep1 = Report(
            user_id=str(member.id),
            user_name=member.name,
            project_id=str(project.id),
            project_name=project.name,
            week_start_date=w1_start,
            week_end_date=w1_end,
            status="approved",
            version=1,
            is_latest=True,
            content=ReportContent(
                tasks_completed=[
                    TaskItem(task_name="Refactor authentication middleware", priority="high", planned_pct=100, actual_pct=100, status="completed", time_planned_hrs=12, time_spent_hrs=10, deliverable="PR #102 merged"),
                    TaskItem(task_name="Write unit tests for user service", priority="medium", planned_pct=100, actual_pct=100, status="completed", time_planned_hrs=8, time_spent_hrs=8, deliverable="Coverage increased to 88%")
                ],
                tasks_planned_next_week=[
                    PlannedTaskItem(task_name="Optimize database indexing", priority="high", notes="Target query latency < 50ms")
                ],
                blockers=[],
                achievements=[AchievementItem(text="Achieved 100% sprint task completion", is_key_achievement=True)],
                hours_by_type=HoursByType(development=24, testing=8, meetings=4, documentation=2, other=2),
                notes="Smooth week overall."
            ),
            review=ReviewDetail(
                reviewed_by=str(manager.id),
                reviewer_name=manager.name,
                comment="Great work on the auth middleware refactor!",
                reviewed_at=datetime.utcnow() - timedelta(days=20)
            ),
            submitted_at=datetime.utcnow() - timedelta(days=21),
            created_at=datetime.utcnow() - timedelta(days=22),
            updated_at=datetime.utcnow() - timedelta(days=20)
        )
        await rep1.insert()

        # Week 2: Approved after correction (has version history!)
        w2_start, w2_end = weeks[1]
        group_id = f"{member.id}_{w2_start}"

        # Snapshot of Version 1 (before correction)
        v1_snapshot = ReportVersion(
            report_group_id=group_id,
            report_id="placeholder",
            version_number=1,
            content=ReportContent(
                tasks_completed=[
                    TaskItem(task_name="Setup API routing", priority="high", planned_pct=100, actual_pct=50, status="in_progress", time_planned_hrs=15, time_spent_hrs=18, deliverable="Draft endpoints")
                ],
                tasks_planned_next_week=[],
                blockers=[BlockerItem(text="Waiting for third-party API keys", is_key_issue=True)],
                achievements=[],
                hours_by_type=HoursByType(development=20, testing=5, meetings=10, documentation=2, other=3),
                notes="Delayed due to missing credentials."
            ),
            status_at_time="needs_correction",
            review_comment_at_time="Please add planned tasks for next week and clarify deliverable status.",
            submitted_at=datetime.utcnow() - timedelta(days=14),
            created_at=datetime.utcnow() - timedelta(days=14)
        )

        rep2 = Report(
            user_id=str(member.id),
            user_name=member.name,
            project_id=str(project.id),
            project_name=project.name,
            week_start_date=w2_start,
            week_end_date=w2_end,
            status="approved",
            version=2,
            is_latest=True,
            content=ReportContent(
                tasks_completed=[
                    TaskItem(task_name="Setup API routing and mock handlers", priority="high", planned_pct=100, actual_pct=100, status="completed", time_planned_hrs=15, time_spent_hrs=18, deliverable="PR #115 merged")
                ],
                tasks_planned_next_week=[
                    PlannedTaskItem(task_name="Integrate webhook notifications", priority="high", notes="Ready for development")
                ],
                blockers=[BlockerItem(text="Waiting for third-party API keys", is_key_issue=False)],
                achievements=[AchievementItem(text="Completed mock API routing layer", is_key_achievement=True)],
                hours_by_type=HoursByType(development=22, testing=6, meetings=8, documentation=2, other=2),
                notes="Resubmitted with updated next week plans."
            ),
            review=ReviewDetail(
                reviewed_by=str(manager.id),
                reviewer_name=manager.name,
                comment="Looks much better, approved!",
                reviewed_at=datetime.utcnow() - timedelta(days=12)
            ),
            submitted_at=datetime.utcnow() - timedelta(days=13),
            created_at=datetime.utcnow() - timedelta(days=15),
            updated_at=datetime.utcnow() - timedelta(days=12)
        )
        await rep2.insert()
        v1_snapshot.report_id = str(rep2.id)
        await v1_snapshot.insert()

        # Week 3: Submitted (awaiting review) for member1/member2, Needs Correction for member3
        w3_start, w3_end = weeks[2]
        st3 = "submitted" if idx < 2 else "needs_correction"
        comment3 = None if idx < 2 else "Please detail the testing hours breakdown."
        
        rep3 = Report(
            user_id=str(member.id),
            user_name=member.name,
            project_id=str(project.id),
            project_name=project.name,
            week_start_date=w3_start,
            week_end_date=w3_end,
            status=st3,
            version=1,
            is_latest=True,
            content=ReportContent(
                tasks_completed=[
                    TaskItem(task_name="Implement dashboard chart aggregations", priority="high", planned_pct=100, actual_pct=90, status="in_progress", time_planned_hrs=20, time_spent_hrs=18, deliverable="Charts component prototype")
                ],
                tasks_planned_next_week=[
                    PlannedTaskItem(task_name="Finalize UX polish and responsive layout", priority="medium", notes="")
                ],
                blockers=[BlockerItem(text="High memory usage during large MongoDB aggregation queries", is_key_issue=True)],
                achievements=[AchievementItem(text="Built 4 interactive Recharts components", is_key_achievement=True)],
                hours_by_type=HoursByType(development=25, testing=5, meetings=5, documentation=3, other=2),
                notes="Pending manager review."
            ),
            review=ReviewDetail(
                reviewed_by=str(manager.id) if comment3 else None,
                reviewer_name=manager.name if comment3 else None,
                comment=comment3,
                reviewed_at=datetime.utcnow() - timedelta(days=2) if comment3 else None
            ),
            submitted_at=datetime.utcnow() - timedelta(days=3),
            created_at=datetime.utcnow() - timedelta(days=5),
            updated_at=datetime.utcnow() - timedelta(days=2)
        )
        await rep3.insert()

        # Week 4: Draft (current week in progress)
        w4_start, w4_end = weeks[3]
        rep4 = Report(
            user_id=str(member.id),
            user_name=member.name,
            project_id=str(project.id),
            project_name=project.name,
            week_start_date=w4_start,
            week_end_date=w4_end,
            status="draft",
            version=1,
            is_latest=True,
            content=ReportContent(
                tasks_completed=[
                    TaskItem(task_name="AI Chat Assistant integration", priority="high", planned_pct=50, actual_pct=50, status="in_progress", time_planned_hrs=15, time_spent_hrs=8, deliverable="Ollama service wrapper")
                ],
                tasks_planned_next_week=[],
                blockers=[],
                achievements=[],
                hours_by_type=HoursByType(development=10, testing=2, meetings=2, documentation=1, other=0),
                notes="Draft report for current week."
            ),
            review=ReviewDetail(),
            created_at=datetime.utcnow() - timedelta(days=1),
            updated_at=datetime.utcnow()
        )
        await rep4.insert()

    print("Data seeding completed successfully!")
    print("--------------------------------------------------")
    print("Seeded test accounts:")
    print("  Manager: manager@demo.com  / Password123")
    print("  Admin:   admin@demo.com    / Password123")
    print("  Member1: member1@demo.com  / Password123")
    print("  Member2: member2@demo.com  / Password123")
    print("  Member3: member3@demo.com  / Password123")
    print("--------------------------------------------------")
    await close_db()

if __name__ == "__main__":
    asyncio.run(seed_data())
