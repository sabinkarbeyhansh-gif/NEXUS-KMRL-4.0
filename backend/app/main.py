from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base, SessionLocal
from app.database.seed_data import seed_database

# Routers
from app.api.auth import router as auth_router
from app.api.documents import router as documents_router
from app.api.tasks import router as tasks_router
from app.api.risks import router as risks_router
from app.api.conflicts import router as conflicts_router
from app.api.ai import router as ai_router
from app.api.analytics import router as analytics_router
from app.api.notifications import router as notifications_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Seed database with initial dataset
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="KMRL NEXUS - AI-Powered Document Intelligence, Operational Knowledge Graph & Decision Automation Platform for Kochi Metro Rail Limited",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(tasks_router, prefix=settings.API_V1_STR)
app.include_router(risks_router, prefix=settings.API_V1_STR)
app.include_router(conflicts_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "ai_provider": settings.ACTIVE_AI_PROVIDER,
        "database": "connected",
    }
