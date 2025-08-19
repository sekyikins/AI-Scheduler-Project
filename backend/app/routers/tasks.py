from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import User, Task
from app.schemas import TaskCreate, TaskUpdate, Task as TaskSchema, PaginatedResponse
from app.auth import get_current_active_user
import json

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(Task).filter(Task.user_id == current_user.id)
    
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    
    total = query.count()
    tasks = query.offset(skip).limit(limit).all()
    
    return PaginatedResponse(
        data=[TaskSchema.from_orm(task).dict() for task in tasks],
        total=total,
        page=skip // limit + 1,
        limit=limit,
        has_next=skip + limit < total,
        has_prev=skip > 0
    )

@router.get("/{task_id}", response_model=TaskSchema)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return TaskSchema.from_orm(task)

@router.post("/", response_model=TaskSchema)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Convert tags list to JSON string if provided
    tags_json = None
    if task_data.tags:
        tags_json = json.dumps(task_data.tags)
    
    db_task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
        estimated_duration=task_data.estimated_duration,
        tags=tags_json,
        user_id=current_user.id
    )
    
    try:
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task"
        )
    
    return TaskSchema.from_orm(db_task)

@router.put("/{task_id}", response_model=TaskSchema)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update task fields
    update_data = task_update.dict(exclude_unset=True)
    
    # Handle tags conversion
    if "tags" in update_data:
        update_data["tags"] = json.dumps(update_data["tags"])
    
    for field, value in update_data.items():
        setattr(task, field, value)
    
    try:
        db.commit()
        db.refresh(task)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update task"
        )
    
    return TaskSchema.from_orm(task)

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    try:
        db.delete(task)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete task"
        )
    
    return {"message": "Task deleted successfully"}

@router.put("/bulk", response_model=List[TaskSchema])
async def bulk_update_tasks(
    updates: List[dict],  # List of {id: int, updates: TaskUpdate}
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    updated_tasks = []
    
    for update_item in updates:
        task_id = update_item.get("id")
        task_updates = update_item.get("updates", {})
        
        task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
        if not task:
            continue
        
        # Handle tags conversion
        if "tags" in task_updates:
            task_updates["tags"] = json.dumps(task_updates["tags"])
        
        for field, value in task_updates.items():
            setattr(task, field, value)
        
        updated_tasks.append(task)
    
    try:
        db.commit()
        for task in updated_tasks:
            db.refresh(task)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update tasks"
        )
    
    return [TaskSchema.from_orm(task) for task in updated_tasks] 