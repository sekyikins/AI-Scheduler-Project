from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import User, CalendarEvent, Task
from app.schemas import CalendarEventCreate, CalendarEventUpdate, CalendarEvent as CalendarEventSchema
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/events", response_model=List[CalendarEventSchema])
async def get_events(
    start: datetime,
    end: datetime,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get calendar events for a date range"""
    events = db.query(CalendarEvent).filter(
        CalendarEvent.user_id == current_user.id,
        CalendarEvent.start >= start,
        CalendarEvent.end <= end
    ).all()
    
    return [CalendarEventSchema.from_orm(event) for event in events]

@router.post("/events", response_model=CalendarEventSchema)
async def create_event(
    event_data: CalendarEventCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new calendar event"""
    db_event = CalendarEvent(
        title=event_data.title,
        description=event_data.description,
        start=event_data.start,
        end=event_data.end,
        all_day=event_data.all_day,
        task_id=event_data.task_id,
        user_id=current_user.id
    )
    
    try:
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create event"
        )
    
    return CalendarEventSchema.from_orm(db_event)

@router.put("/events/{event_id}", response_model=CalendarEventSchema)
async def update_event(
    event_id: int,
    event_update: CalendarEventUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a calendar event"""
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.user_id == current_user.id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    try:
        db.commit()
        db.refresh(event)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update event"
        )
    
    return CalendarEventSchema.from_orm(event)

@router.delete("/events/{event_id}")
async def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a calendar event"""
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.user_id == current_user.id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    try:
        db.delete(event)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete event"
        )
    
    return {"message": "Event deleted successfully"}

@router.post("/sync")
async def sync_to_google_calendar(
    task_ids: List[int],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Sync tasks to Google Calendar"""
    # This would implement Google Calendar API integration
    # For now, return a placeholder response
    return {"message": f"Synced {len(task_ids)} tasks to Google Calendar"} 