import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
import mongomock_motor
from beanie import init_beanie

from app.main import app
from app.models.user import User
from app.models.project import Project
from app.models.report import Report, ReportVersion
from app.services.auth_service import hash_password, create_access_token

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(autouse=True)
async def init_test_db():
    mock_client = mongomock_motor.AsyncMongoMockClient()
    db = mock_client["test_weekly_report_db"]
    await init_beanie(database=db, document_models=[User, Project, Report, ReportVersion])
    yield
    await User.delete_all()
    await Project.delete_all()
    await Report.delete_all()
    await ReportVersion.delete_all()

@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

@pytest_asyncio.fixture
async def test_users():
    pwd_hash = hash_password("Password123")
    
    manager = User(name="Test Manager", email="test_manager@demo.com", password_hash=pwd_hash, role="manager")
    member1 = User(name="Test Member 1", email="test_member1@demo.com", password_hash=pwd_hash, role="member")
    member2 = User(name="Test Member 2", email="test_member2@demo.com", password_hash=pwd_hash, role="member")
    
    await manager.insert()
    await member1.insert()
    await member2.insert()
    
    return {
        "manager": manager,
        "member1": member1,
        "member2": member2
    }

@pytest.fixture
def auth_headers(test_users):
    manager_token = create_access_token({"sub": str(test_users["manager"].id), "role": "manager", "email": test_users["manager"].email})
    member1_token = create_access_token({"sub": str(test_users["member1"].id), "role": "member", "email": test_users["member1"].email})
    member2_token = create_access_token({"sub": str(test_users["member2"].id), "role": "member", "email": test_users["member2"].email})
    
    return {
        "manager": {"Authorization": f"Bearer {manager_token}"},
        "member1": {"Authorization": f"Bearer {member1_token}"},
        "member2": {"Authorization": f"Bearer {member2_token}"}
    }
