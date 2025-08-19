# AI Task Scheduler Backend

A FastAPI-based backend for the AI Task Scheduler application, providing RESTful APIs for task management, Pomodoro sessions, calendar integration, and AI-powered features.

## Features

- **Authentication**: JWT-based authentication with user registration and login
- **Task Management**: Full CRUD operations for tasks with priority, status, and tags
- **Pomodoro Timer**: Session management and statistics
- **Calendar Integration**: Event management with Google Calendar sync
- **AI Features**: Natural language task parsing and AI-powered suggestions
- **Notifications**: User notification system
- **Database**: PostgreSQL with SQLAlchemy ORM

## Tech Stack

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt with passlib
- **AI Integration**: OpenAI GPT-3.5
- **Email**: SendGrid (optional)
- **Calendar**: Google Calendar API (optional)

## Prerequisites

- Python 3.8+
- PostgreSQL
- OpenAI API key (for AI features)

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE ai_scheduler;
   CREATE USER ai_scheduler_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ai_scheduler TO ai_scheduler_user;
   ```

6. **Update DATABASE_URL in .env**
   ```
   DATABASE_URL=postgresql://ai_scheduler_user:your_password@localhost:5432/ai_scheduler
   ```

## Running the Application

### Development Mode
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/api/docs
- **ReDoc Documentation**: http://localhost:8000/api/redoc

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token

### Tasks
- `GET /api/v1/tasks/` - Get user tasks (paginated)
- `GET /api/v1/tasks/{task_id}` - Get specific task
- `POST /api/v1/tasks/` - Create new task
- `PUT /api/v1/tasks/{task_id}` - Update task
- `DELETE /api/v1/tasks/{task_id}` - Delete task
- `PUT /api/v1/tasks/bulk` - Bulk update tasks

### AI Features
- `POST /api/v1/ai/parse` - Parse natural language commands
- `POST /api/v1/ai/suggest` - Get AI task suggestions
- `POST /api/v1/ai/optimize` - Optimize task schedule

### Pomodoro
- `POST /api/v1/pomodoro/start` - Start Pomodoro session
- `PUT /api/v1/pomodoro/{session_id}/end` - End session
- `GET /api/v1/pomodoro/sessions` - Get user sessions
- `GET /api/v1/pomodoro/stats` - Get Pomodoro statistics

### Calendar
- `GET /api/v1/calendar/events` - Get calendar events
- `POST /api/v1/calendar/events` - Create calendar event
- `PUT /api/v1/calendar/events/{event_id}` - Update event
- `DELETE /api/v1/calendar/events/{event_id}` - Delete event
- `POST /api/v1/calendar/sync` - Sync to Google Calendar

### Notifications
- `GET /api/v1/notifications/` - Get user notifications
- `POST /api/v1/notifications/` - Create notification
- `PUT /api/v1/notifications/{notification_id}/read` - Mark as read
- `PUT /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/{notification_id}` - Delete notification

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | JWT secret key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `SENDGRID_API_KEY` | SendGrid API key for emails | No |

## Database Schema

The application uses the following main tables:

- **users**: User accounts and authentication
- **tasks**: Task management with priority, status, and metadata
- **pomodoro_sessions**: Pomodoro timer sessions
- **calendar_events**: Calendar events and Google Calendar sync
- **notifications**: User notifications

## Development

### Code Style
- Use Black for code formatting
- Use Flake8 for linting
- Follow PEP 8 guidelines

### Testing
```bash
pytest
```

### Database Migrations
```bash
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Deployment

### Docker (Recommended)
```bash
docker build -t ai-scheduler-backend .
docker run -p 8000:8000 ai-scheduler-backend
```

### Manual Deployment
1. Set up a PostgreSQL database
2. Configure environment variables
3. Install dependencies
4. Run database migrations
5. Start the application with a production WSGI server

## Security Considerations

- Use strong SECRET_KEY in production
- Enable HTTPS in production
- Implement rate limiting
- Use environment variables for sensitive data
- Regular security updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. 