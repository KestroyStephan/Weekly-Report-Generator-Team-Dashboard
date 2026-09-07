from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, close_db
from app.routers import (
    auth_router, users_router, projects_router,
    reports_router, reviews_router, dashboard_router, ai_router,
    notifications_router, tasks_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize MongoDB / Beanie ODM
    await init_db()
    yield
    # Shutdown: Close database connection
    await close_db()

app = FastAPI(
    title="Weekly Report Generator & Team Dashboard API",
    description="API for weekly report submissions, manager reviews/corrections workflow, team analytics, and AI assistant.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(projects_router)
app.include_router(reports_router)
app.include_router(reviews_router)
app.include_router(dashboard_router)
app.include_router(ai_router)
app.include_router(notifications_router)
app.include_router(tasks_router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
