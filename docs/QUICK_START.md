# AI Scheduler MVP - Quick Start Guide

## 🚀 Get Started in 10 Minutes

This guide will help you set up and run the AI Scheduler MVP locally for development and testing.

## Prerequisites

### Required Accounts
- [Firebase](https://console.firebase.google.com/) - Free account
- [OpenAI](https://platform.openai.com/) - Free tier available
- [SendGrid](https://sendgrid.com/) - Free tier available
- [Google Cloud](https://console.cloud.google.com/) - Free tier available

### System Requirements
- Python 3.8+
- Node.js 16+
- Git

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd AI-Task-Scheduler

# Verify the structure
ls -la
```

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp env.example .env
```

### Configure Environment Variables

Edit `backend/.env` with your actual values:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_CLIENT_ID=your-client-id

# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Google Calendar Configuration
GOOGLE_CALENDAR_CLIENT_ID=your-google-client-id
GOOGLE_CALENDAR_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Application Configuration
APP_ENV=development
DEBUG=true
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Start Backend Server

```bash
# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
✅ Firebase initialized successfully
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## Step 3: Frontend Setup

```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment template
cp env.example .env
```

### Configure Frontend Environment

Edit `frontend/.env`:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Application Configuration
REACT_APP_APP_NAME=AI Scheduler MVP
REACT_APP_VERSION=1.0.0
```

### Start Frontend Server

```bash
# Run development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view ai-scheduler-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.100:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

## Step 4: Verify Installation

### Test Backend Health

```bash
curl http://localhost:8000/health
```

**Expected Response:**
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

### Test API Documentation

Open your browser and navigate to:
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Test Frontend

Open your browser and navigate to:
- **Frontend**: http://localhost:3000

## Step 5: First User Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database

2. **Get Firebase Config**
   - Go to Project Settings
   - Add a web app
   - Copy the configuration to `frontend/.env`

3. **Create Service Account**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download JSON and extract values to `backend/.env`

## Step 6: Test Core Features

### Test Task Creation

```bash
# Create a task via API
curl -X POST "http://localhost:8000/api/v1/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "Testing the MVP",
    "priority": "high",
    "deadline": "2024-01-15T17:00:00"
  }'
```

### Test NLP Processing

```bash
# Test natural language parsing
curl -X POST "http://localhost:8000/api/v1/nlp/parse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "command": "Schedule a meeting tomorrow at 3pm for 1 hour"
  }'
```

### Test Pomodoro Timer

```bash
# Create a Pomodoro session
curl -X POST "http://localhost:8000/api/v1/pomodoro/sessions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "session_type": "work",
    "duration": 1500
  }'
```

## Troubleshooting

### Common Issues

#### 1. Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'firebase_admin'`

**Solution**:
```bash
cd backend
pip install -r requirements.txt
```

#### 2. Firebase Connection Error

**Error**: `Firebase connection failed`

**Solution**:
- Verify Firebase project ID in `.env`
- Check service account key format
- Ensure Firestore is enabled

#### 3. Frontend Build Error

**Error**: `Module not found`

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Errors

**Error**: `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked`

**Solution**:
- Check `ALLOWED_ORIGINS` in backend `.env`
- Ensure it includes `http://localhost:3000`

#### 5. OpenAI API Errors

**Error**: `OpenAI API error`

**Solution**:
- Verify API key in backend `.env`
- Check OpenAI account credits
- Test API key: `curl -H "Authorization: Bearer YOUR_KEY" https://api.openai.com/v1/models`

### Performance Issues

#### Slow API Responses

1. **Check Database Connection**
```bash
# Test Firebase connection
curl http://localhost:8000/health
```

2. **Monitor Resource Usage**
```bash
# Check CPU/Memory usage
top -p $(pgrep -f uvicorn)
```

3. **Optimize Queries**
- Check Firestore indexes
- Review database queries in logs

### Development Tips

#### 1. Enable Debug Mode

```bash
# Backend
export DEBUG=true
uvicorn main:app --reload

# Frontend
REACT_APP_DEBUG=true npm start
```

#### 2. Monitor Logs

```bash
# Backend logs
tail -f backend/app.log

# Frontend logs
# Check browser console
```

#### 3. Test Performance

```bash
# Test API response time
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8000/health"
```

## Next Steps

### 1. Explore Features
- Create tasks via web interface
- Test NLP command parsing
- Use Pomodoro timer
- Set up notifications
- Sync with Google Calendar

### 2. Customize Configuration
- Adjust performance settings
- Configure notification preferences
- Set up custom domains
- Optimize for your use case

### 3. Deploy to Production
- Follow the [Deployment Guide](DEPLOYMENT_GUIDE.md)
- Set up monitoring and logging
- Configure SSL certificates
- Set up CI/CD pipeline

### 4. Contribute
- Report bugs and issues
- Suggest improvements
- Submit pull requests
- Help with documentation

## Support

### Documentation
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)

### Community
- GitHub Issues: Report bugs and feature requests
- Discussions: Ask questions and share ideas
- Wiki: Additional documentation and guides

### Performance Monitoring

Monitor these key metrics:
- API response time: <300ms
- Task creation: <100ms
- NLP accuracy: >85%
- Calendar sync: <5s
- Uptime: >99.5%

## Success Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] Health check endpoint responding
- [ ] Firebase connection established
- [ ] OpenAI API working
- [ ] Task creation functional
- [ ] NLP parsing accurate
- [ ] Pomodoro timer working
- [ ] Notifications configured
- [ ] Calendar sync operational

**Congratulations!** Your AI Scheduler MVP is now running locally and ready for development and testing. 