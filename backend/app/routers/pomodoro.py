from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.models import User, PomodoroSession, Task
from app.schemas import PomodoroSessionCreate, PomodoroSession as PomodoroSessionSchema, PomodoroStats
from app.auth import get_current_active_user

router = APIRouter()

@router.post("/start", response_model=PomodoroSessionSchema)
async def start_session(
    session_data: PomodoroSessionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Start a new Pomodoro session"""
    db_session = PomodoroSession(
        task_id=session_data.task_id,
        user_id=current_user.id,
        start_time=datetime.utcnow(),
        duration=session_data.duration,
        type=session_data.type
    )
    
    try:
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start session"
        )
    
    return PomodoroSessionSchema.from_orm(db_session)

@router.put("/{session_id}/end", response_model=PomodoroSessionSchema)
async def end_session(
    session_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """End a Pomodoro session"""
    session = db.query(PomodoroSession).filter(
        PomodoroSession.id == session_id,
        PomodoroSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.end_time:
        raise HTTPException(status_code=400, detail="Session already ended")
    
    session.end_time = datetime.utcnow()
    session.completed = True
    
    try:
        db.commit()
        db.refresh(session)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to end session"
        )
    
    return PomodoroSessionSchema.from_orm(session)

@router.get("/sessions", response_model=List[PomodoroSessionSchema])
async def get_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    date: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's Pomodoro sessions"""
    query = db.query(PomodoroSession).filter(PomodoroSession.user_id == current_user.id)
    
    if date:
        try:
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            next_day = date_obj + timedelta(days=1)
            query = query.filter(
                PomodoroSession.start_time >= date_obj,
                PomodoroSession.start_time < next_day
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    sessions = query.offset(skip).limit(limit).all()
    return [PomodoroSessionSchema.from_orm(session) for session in sessions]

@router.get("/stats", response_model=PomodoroStats)
async def get_stats(
    period: Optional[str] = "week",  # week, month, year
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get Pomodoro statistics"""
    now = datetime.utcnow()
    
    if period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now - timedelta(days=30)
    elif period == "year":
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=7)
    
    sessions = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == current_user.id,
        PomodoroSession.start_time >= start_date
    ).all()
    
    total_sessions = len(sessions)
    completed_sessions = len([s for s in sessions if s.completed])
    incomplete_sessions = total_sessions - completed_sessions
    
    total_work_time = sum(s.duration for s in sessions if s.type == "work")
    total_break_time = sum(s.duration for s in sessions if s.type == "break")
    
    average_session_length = total_sessions > 0 and (total_work_time + total_break_time) / total_sessions or 0
    
    return PomodoroStats(
        total_sessions=total_sessions,
        total_work_time=total_work_time,
        total_break_time=total_break_time,
        average_session_length=average_session_length,
        completed_sessions=completed_sessions,
        incomplete_sessions=incomplete_sessions
    ) 