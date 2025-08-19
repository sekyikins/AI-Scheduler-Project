from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models import TaskPriority, TaskStatus, PomodoroType, NotificationType

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    avatar: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Session schemas
class UserSessionBase(BaseModel):
    user_id: int
    is_active: bool = True

class UserSessionCreate(UserSessionBase):
    session_token: str
    expires_at: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class UserSession(UserSessionBase):
    id: int
    session_token: str
    expires_at: datetime
    created_at: datetime
    last_used_at: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        from_attributes = True

class SessionInfo(BaseModel):
    session_token: str
    created_at: datetime
    last_used_at: datetime
    expires_at: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[datetime] = None
    estimated_duration: Optional[int] = None
    tags: Optional[List[str]] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None
    estimated_duration: Optional[int] = None
    actual_duration: Optional[int] = None
    tags: Optional[List[str]] = None

class Task(TaskBase):
    id: int
    status: TaskStatus
    actual_duration: Optional[int] = None
    ai_generated: bool
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PomodoroSessionBase(BaseModel):
    task_id: Optional[int] = None
    duration: int
    type: PomodoroType = PomodoroType.work

class PomodoroSessionCreate(PomodoroSessionBase):
    pass

class PomodoroSession(PomodoroSessionBase):
    id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CalendarEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start: datetime
    end: datetime
    all_day: bool = False
    task_id: Optional[int] = None

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start: Optional[datetime] = None
    end: Optional[datetime] = None
    all_day: Optional[bool] = None
    task_id: Optional[int] = None

class CalendarEvent(CalendarEventBase):
    id: int
    user_id: int
    google_calendar_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    title: str
    message: str
    type: NotificationType = NotificationType.info
    task_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    user_id: int
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

# AI schemas
class AICommand(BaseModel):
    command: str

class AIResponse(BaseModel):
    tasks: List[TaskCreate]
    message: str
    confidence: float

class AISuggestRequest(BaseModel):
    context: str

class AIOptimizeRequest(BaseModel):
    tasks: List[Task]

# API Response schemas
class ApiResponse(BaseModel):
    data: dict
    message: str
    success: bool

class PaginatedResponse(BaseModel):
    data: List[dict]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool

# Stats schemas
class PomodoroStats(BaseModel):
    total_sessions: int
    total_work_time: int  # in minutes
    total_break_time: int  # in minutes
    average_session_length: float
    completed_sessions: int
    incomplete_sessions: int 