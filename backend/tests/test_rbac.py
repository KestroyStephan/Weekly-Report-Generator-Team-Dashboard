import pytest
from app.models.report import Report, ReportContent, TaskItem

@pytest.mark.asyncio
async def test_member_cannot_access_other_members_report(async_client, test_users, auth_headers):
    # Member 2 creates a draft report
    rep2 = Report(
        user_id=str(test_users["member2"].id),
        user_name=test_users["member2"].name,
        week_start_date="2026-08-03",
        week_end_date="2026-08-09",
        status="draft",
        content=ReportContent()
    )
    await rep2.insert()

    # Member 1 attempts to fetch Member 2's report -> Should get 403 Forbidden
    response = await async_client.get(f"/reports/{rep2.id}", headers=auth_headers["member1"])
    assert response.status_code == 403, f"Expected 403 Forbidden, got {response.status_code}"

@pytest.mark.asyncio
async def test_member_cannot_hit_review_endpoint(async_client, test_users, auth_headers):
    # Create a submitted report
    rep = Report(
        user_id=str(test_users["member1"].id),
        user_name=test_users["member1"].name,
        week_start_date="2026-08-03",
        week_end_date="2026-08-09",
        status="submitted",
        content=ReportContent()
    )
    await rep.insert()

    # Member 1 attempts to review (approve) report -> Should get 403 Forbidden
    response = await async_client.post(
        f"/reports/{rep.id}/review",
        json={"action": "approve", "comment": "Self approving!"},
        headers=auth_headers["member1"]
    )
    assert response.status_code == 403, f"Expected 403 Forbidden, got {response.status_code}"

@pytest.mark.asyncio
async def test_manager_cannot_edit_report_content(async_client, test_users, auth_headers):
    # Member 1 has a draft report
    rep = Report(
        user_id=str(test_users["member1"].id),
        user_name=test_users["member1"].name,
        week_start_date="2026-08-03",
        week_end_date="2026-08-09",
        status="draft",
        content=ReportContent()
    )
    await rep.insert()

    # Manager attempts to modify Member 1's report content directly -> Should get 403 Forbidden
    response = await async_client.put(
        f"/reports/{rep.id}",
        json={"content": {"notes": "Manager tampering with content"}},
        headers=auth_headers["manager"]
    )
    assert response.status_code == 403, f"Expected 403 Forbidden, got {response.status_code}"

@pytest.mark.asyncio
async def test_review_workflow_and_version_history(async_client, test_users, auth_headers):
    # 1. Member 1 creates draft
    create_resp = await async_client.post(
        "/reports",
        json={"week_start_date": "2026-08-10", "week_end_date": "2026-08-16"},
        headers=auth_headers["member1"]
    )
    assert create_resp.status_code == 201
    report_id = create_resp.json()["id"]

    # 2. Member 1 updates content and submits
    update_resp = await async_client.put(
        f"/reports/{report_id}",
        json={
            "content": {
                "tasks_completed": [{"task_name": "Initial Task", "priority": "high", "planned_pct": 100, "actual_pct": 100, "status": "completed", "time_planned_hrs": 5, "time_spent_hrs": 5, "deliverable": "v1"}],
                "notes": "First version"
            }
        },
        headers=auth_headers["member1"]
    )
    assert update_resp.status_code == 200

    submit_resp = await async_client.post(f"/reports/{report_id}/submit", headers=auth_headers["member1"])
    assert submit_resp.status_code == 200
    assert submit_resp.json()["status"] == "submitted"

    # 3. Manager reviews and requests changes
    review_resp = await async_client.post(
        f"/reports/{report_id}/review",
        json={"action": "request_changes", "comment": "Please add planned tasks for next week."},
        headers=auth_headers["manager"]
    )
    assert review_resp.status_code == 200
    assert review_resp.json()["status"] == "needs_correction"

    # 4. Member 1 updates content and resubmits
    update_resp2 = await async_client.put(
        f"/reports/{report_id}",
        json={
            "content": {
                "tasks_completed": [{"task_name": "Initial Task", "priority": "high", "planned_pct": 100, "actual_pct": 100, "status": "completed", "time_planned_hrs": 5, "time_spent_hrs": 5, "deliverable": "v1"}],
                "tasks_planned_next_week": [{"task_name": "Next Task", "priority": "medium", "notes": "Planned"}],
                "notes": "Second version after feedback"
            }
        },
        headers=auth_headers["member1"]
    )
    assert update_resp2.status_code == 200

    resubmit_resp = await async_client.post(f"/reports/{report_id}/submit", headers=auth_headers["member1"])
    assert resubmit_resp.status_code == 200
    resub_data = resubmit_resp.json()
    assert resub_data["status"] == "submitted"
    assert resub_data["version"] == 2

    # 5. Check version history: should contain 1 past version snapshot
    versions_resp = await async_client.get(f"/reports/{report_id}/versions", headers=auth_headers["member1"])
    assert versions_resp.status_code == 200
    versions = versions_resp.json()
    assert len(versions) == 1
    assert versions[0]["version_number"] == 1
    assert versions[0]["review_comment_at_time"] == "Please add planned tasks for next week."

    # 6. Manager approves final version
    approve_resp = await async_client.post(
        f"/reports/{report_id}/review",
        json={"action": "approve", "comment": "Approved!"},
        headers=auth_headers["manager"]
    )
    assert approve_resp.status_code == 200
    assert approve_resp.json()["status"] == "approved"
