from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
from dotenv import load_dotenv
import os

from app.routers import auth, tasks, ai, pomodoro, calendar, notifications
from app.database import engine
from app.models import Base

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="AI Task Scheduler API",
    description="Backend API for AI Task Scheduler application",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1"]
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(pomodoro.router, prefix="/api/v1/pomodoro", tags=["Pomodoro"])
app.include_router(calendar.router, prefix="/api/v1/calendar", tags=["Calendar"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])

@app.get("/")
async def root():
    return {"message": "AI Task Scheduler API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 