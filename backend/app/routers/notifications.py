from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import User, Notification
from app.schemas import NotificationCreate, Notification as NotificationSchema, PaginatedResponse
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    read: Optional[bool] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user notifications"""
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    
    if read is not None:
        query = query.filter(Notification.read == read)
    
    total = query.count()
    notifications = query.offset(skip).limit(limit).all()
    
    return PaginatedResponse(
        data=[NotificationSchema.from_orm(notification).dict() for notification in notifications],
        total=total,
        page=skip // limit + 1,
        limit=limit,
        has_next=skip + limit < total,
        has_prev=skip > 0
    )

@router.post("/", response_model=NotificationSchema)
async def create_notification(
    notification_data: NotificationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new notification"""
    db_notification = Notification(
        title=notification_data.title,
        message=notification_data.message,
        type=notification_data.type,
        task_id=notification_data.task_id,
        user_id=current_user.id
    )
    
    try:
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create notification"
        )
    
    return NotificationSchema.from_orm(db_notification)

@router.put("/{notification_id}/read", response_model=NotificationSchema)
async def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.read = True
    
    try:
        db.commit()
        db.refresh(notification)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update notification"
        )
    
    return NotificationSchema.from_orm(notification)

@router.put("/read-all")
async def mark_all_as_read(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read"""
    try:
        db.query(Notification).filter(
            Notification.user_id == current_user.id,
            Notification.read == False
        ).update({"read": True})
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark notifications as read"
        )
    
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a notification"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    try:
        db.delete(notification)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete notification"
        )
    
    return {"message": "Notification deleted successfully"} 