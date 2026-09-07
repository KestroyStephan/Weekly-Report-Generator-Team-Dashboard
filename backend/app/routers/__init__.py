from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.projects import router as projects_router
from app.routers.reports import router as reports_router
from app.routers.reviews import router as reviews_router
from app.routers.dashboard import router as dashboard_router
from app.routers.ai_assistant import router as ai_router
from app.routers.notifications import router as notifications_router
from app.routers.tasks import router as tasks_router

__all__ = [
    "auth_router", "users_router", "projects_router",
    "reports_router", "reviews_router", "dashboard_router", "ai_router",
    "notifications_router", "tasks_router"
]

