# AI Scheduler MVP

A minimal viable product AI scheduling application focused on task management, time tracking, and productivity optimization.

## 🎯 MVP Features

- **Task Management**: Complete CRUD operations for tasks with priority and deadline tracking
- **Natural Language Processing**: Text-based command parsing using OpenAI ChatGPT (>85% accuracy)
- **Pomodoro Timer**: Standard 25/5 minute work cycles with session logging
- **Notifications**: Email and browser alerts for deadlines and daily summaries
- **Calendar Sync**: One-way export to Google Calendar (<5 seconds sync time)
- **Simple UI**: Clean, functional interface optimized for productivity

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Firebase project
- OpenAI API key
- Google Calendar API credentials

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm start
```

## 📋 Milestones

1. ✅ Backend Foundation (FastAPI + Firebase)
2. ✅ Core Task Management (CRUD operations)
3. ✅ Basic NLP (OpenAI integration)
4. ✅ Default Pomodoro Timer
5. ✅ Minimal Notification System
6. ✅ One-Way Google Calendar Sync
7. ✅ Simple UI Implementation

## 🛠 Tech Stack

- **Backend**: FastAPI, Firebase Firestore, OpenAI ChatGPT
- **Frontend**: React, Material-UI, Axios
- **Authentication**: Firebase Auth
- **Notifications**: SendGrid, Web Push API
- **Calendar**: Google Calendar API

## 📁 Project Structure

```
ai-scheduler-mvp/
├── backend/                 # FastAPI backend
├── frontend/               # React frontend
├── docs/                   # Documentation
└── README.md              # This file
```

## 🔧 Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_openai_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
SENDGRID_API_KEY=your_sendgrid_key
GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

## 📊 MVP Performance Targets

- **API Response Time**: <300ms average
- **Task Creation/Editing**: <100ms
- **Calendar Sync**: <5 seconds
- **NLP Processing**: <500ms with >85% accuracy
- **Concurrent Users**: 100+ support

## 🎉 MVP Success Metrics

- **Task Creation Success Rate**: >98%
- **NLP Command Parsing Accuracy**: >85%
- **Calendar Sync Success Rate**: >95%
- **Notification Delivery Rate**: >90%
- **User Retention (7 days)**: >40%
- **Feature Adoption Rate**: >80% for core features 