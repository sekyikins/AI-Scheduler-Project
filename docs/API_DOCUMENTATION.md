# AI Scheduler MVP - API Documentation

## Overview

The AI Scheduler MVP API provides endpoints for task management, natural language processing, Pomodoro timer functionality, notifications, and calendar synchronization. All endpoints require authentication via Firebase Auth.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## Core Endpoints

### Task Management

#### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "Complete project proposal",
  "description": "Write the technical proposal for the new feature",
  "priority": "high",
  "deadline": "2024-01-15T17:00:00",
  "estimated_duration": 120,
  "tags": ["work", "proposal"],
  "category": "work"
}
```

**Response (201 Created):**
```json
{
  "id": "task-uuid",
  "user_id": "user-id",
  "title": "Complete project proposal",
  "description": "Write the technical proposal for the new feature",
  "priority": "high",
  "status": "pending",
  "deadline": "2024-01-15T17:00:00",
  "estimated_duration": 120,
  "tags": ["work", "proposal"],
  "category": "work",
  "created_at": "2024-01-10T10:00:00",
  "updated_at": "2024-01-10T10:00:00",
  "completed_at": null
}
```

**Performance Target:** <100ms

#### Get User Tasks
```http
GET /tasks?status=pending
```

**Response (200 OK):**
```json
[
  {
    "id": "task-uuid",
    "title": "Complete project proposal",
    "priority": "high",
    "status": "pending",
    "deadline": "2024-01-15T17:00:00",
    "created_at": "2024-01-10T10:00:00"
  }
]
```

#### Update Task
```http
PUT /tasks/{task_id}
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "urgent"
}
```

#### Delete Task
```http
DELETE /tasks/{task_id}
```

**Response (204 No Content)**

### Natural Language Processing

#### Parse Command
```http
POST /nlp/parse
Content-Type: application/json

{
  "command": "Schedule a meeting with the team tomorrow at 3pm for 1 hour"
}
```

**Response (200 OK):**
```json
{
  "title": "Meeting with team",
  "description": "Team meeting",
  "priority": "medium",
  "deadline": "2024-01-11T15:00:00",
  "estimated_duration": 60,
  "tags": ["meeting", "team"],
  "category": "work"
}
```

**Accuracy Target:** >85%

### Pomodoro Timer

#### Create Session
```http
POST /pomodoro/sessions
Content-Type: application/json

{
  "session_type": "work",
  "duration": 1500,
  "task_id": "task-uuid"
}
```

**Response (201 Created):**
```json
{
  "id": "session-uuid",
  "user_id": "user-id",
  "session_type": "work",
  "duration": 1500,
  "start_time": "2024-01-10T10:00:00",
  "end_time": null,
  "completed": false,
  "task_id": "task-uuid"
}
```

#### Get Sessions
```http
GET /pomodoro/sessions?limit=10
```

#### Complete Session
```http
PUT /pomodoro/sessions/{session_id}
Content-Type: application/json

{
  "completed": true,
  "end_time": "2024-01-10T10:25:00"
}
```

### Notifications

#### Send Task Reminder
```http
POST /notifications/send-reminder?task_id={task_id}
```

#### Update Preferences
```http
PUT /notifications/preferences
Content-Type: application/json

{
  "email": true,
  "browser": true,
  "daily_summary": false
}
```

### Calendar Sync

#### Sync Task to Calendar
```http
POST /calendar/sync-task/{task_id}
```

**Response (200 OK):**
```json
{
  "message": "Task synced to calendar successfully"
}
```

**Performance Target:** <5 seconds

#### Get Calendar Events
```http
GET /calendar/events?start_date=2024-01-10&end_date=2024-01-17
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Task has no deadline"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Error creating task: Database connection failed"
}
```

## Performance Metrics

- **API Response Time:** <300ms average
- **Task Creation:** <100ms
- **Calendar Sync:** <5 seconds
- **NLP Processing:** <500ms
- **Concurrent Users:** 100+

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "AI Scheduler MVP is running",
  "version": "1.0.0",
  "features": {
    "task_management": "enabled",
    "nlp_processing": "enabled",
    "pomodoro_timer": "enabled",
    "notifications": "enabled",
    "calendar_sync": "enabled"
  },
  "performance_targets": {
    "api_response_time": "<300ms",
    "task_creation": "<100ms",
    "calendar_sync": "<5s"
  }
}
``` 