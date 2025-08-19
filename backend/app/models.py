from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum
import uuid

class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class PomodoroType(str, enum.Enum):
    work = "work"
    break_session = "break"

class NotificationType(str, enum.Enum):
    info = "info"
    success = "success"
    warning = "warning"
    error = "error"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tasks = relationship("Task", back_populates="user")
    pomodoro_sessions = relationship("PomodoroSession", back_populates="user")
    calendar_events = relationship("CalendarEvent", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    sessions = relationship("UserSession", back_populates="user")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    ip_address = Column(String, nullable=True)
    user_agent = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="sessions")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Enum(TaskPriority), default=TaskPriority.medium)
    status = Column(Enum(TaskStatus), default=TaskStatus.pending)
    due_date = Column(DateTime(timezone=True), nullable=True)
    estimated_duration = Column(Integer, nullable=True)  # in minutes
    actual_duration = Column(Integer, nullable=True)  # in minutes
    ai_generated = Column(Boolean, default=False)
    tags = Column(Text, nullable=True)  # JSON string
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="tasks")
    pomodoro_sessions = relationship("PomodoroSession", back_populates="task")
    calendar_events = relationship("CalendarEvent", back_populates="task")

class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    duration = Column(Integer, nullable=False)  # in minutes
    type = Column(Enum(PomodoroType), default=PomodoroType.work)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    task = relationship("Task", back_populates="pomodoro_sessions")
    user = relationship("User", back_populates="pomodoro_sessions")

class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start = Column(DateTime(timezone=True), nullable=False)
    end = Column(DateTime(timezone=True), nullable=False)
    all_day = Column(Boolean, default=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    google_calendar_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    task = relationship("Task", back_populates="calendar_events")
    user = relationship("User", back_populates="calendar_events")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum(NotificationType), default=NotificationType.info)
    read = Column(Boolean, default=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications") 