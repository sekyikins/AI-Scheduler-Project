# AI Scheduler MVP - Getting Started Guide

## 🚀 Quick Start

This guide will help you set up and run the AI Scheduler MVP application on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

### Verify Installation
```bash
python --version  # Should show Python 3.8+
node --version   # Should show Node.js 16+
npm --version    # Should show npm version
git --version    # Should show Git version
```

## 🔧 Step 1: Clone and Setup Project

### 1.1 Clone the Repository
```bash
git clone <your-repository-url>
cd ai-scheduler-mvp
```

### 1.2 Run Automated Setup (Recommended)
```bash
python setup.py
```

This script will automatically:
- Install Python dependencies
- Install Node.js dependencies
- Create environment files from examples
- Verify installations

### 1.3 Manual Setup (Alternative)

If the automated setup doesn't work, follow these manual steps:

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp env.example .env
```

#### Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
```

## 🔑 Step 2: Configure API Keys

### 2.1 Backend Configuration (`backend/.env`)

Edit `backend/.env` and add your API keys:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (Use your existing Firebase project)
FIREBASE_PROJECT_ID=web-mobile-app-ab977
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id

# SendGrid Configuration (Optional for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Google Calendar Configuration (Optional for calendar sync)
GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Application Configuration
APP_ENV=development
DEBUG=true
SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 2.2 Frontend Configuration (`frontend/.env`)

Edit `frontend/.env` and add your configuration:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Firebase Configuration (Already configured in your project)
REACT_APP_FIREBASE_API_KEY=AIzaSyB-AzTT-L1wjFO-MrND6Sf8EhXxBchtbXE
REACT_APP_FIREBASE_AUTH_DOMAIN=web-mobile-app-ab977.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=web-mobile-app-ab977
REACT_APP_FIREBASE_STORAGE_BUCKET=web-mobile-app-ab977.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=231070395279
REACT_APP_FIREBASE_APP_ID=1:231070395279:web:8dcf6c17f576ddd726f9fa

# Application Configuration
REACT_APP_APP_NAME=AI Scheduler MVP
REACT_APP_VERSION=1.0.0
```

## 🔥 Step 3: Firebase Setup

### 3.1 Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `web-mobile-app-ab977`
3. Go to **Project Settings** → **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file
6. Copy the values to your `backend/.env` file

### 3.2 Enable Firebase Services

In your Firebase Console:

1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Email/Password** authentication

2. **Firestore Database**:
   - Go to Firestore Database
   - Create database in **test mode** (for development)
   - Choose a location close to you

## 🤖 Step 4: OpenAI Setup (Optional)

If you want to use the NLP features:

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add the key to `backend/.env`

## 📧 Step 5: SendGrid Setup (Optional)

If you want email notifications:

1. Go to [SendGrid](https://sendgrid.com/)
2. Create an account and get your API key
3. Verify your sender email
4. Add the key to `backend/.env`

## 🚀 Step 6: Start the Application

### 6.1 Start Backend Server

Open a terminal and run:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 6.2 Start Frontend Development Server

Open another terminal and run:

```bash
cd frontend
npm start
```

You should see:
```
Compiled successfully!

You can now view ai-scheduler-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.100:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### 6.3 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 👤 Step 7: Create Your First Account

1. Open http://localhost:3000 in your browser
2. Click **"Don't have an account? Sign up"**
3. Enter your email and password
4. Click **"Create Account"**
5. You'll be redirected to the dashboard

## 🧪 Step 8: Test the Features

### 8.1 Create Your First Task

1. Go to the **Tasks** page
2. Click **"Add Task"**
3. Fill in the task details
4. Click **"Create"**

### 8.2 Try Natural Language Processing

1. Go to the **Tasks** page
2. Click **"Voice Command"**
3. Type: *"Create a high priority task to finish the project report by tomorrow 3pm"*
4. Click **"Parse Command"**
5. Review the parsed task and click **"Use This Task"**

### 8.3 Test Pomodoro Timer

1. Go to the **Pomodoro** page
2. Click **"Start Work Session"**
3. The timer will start counting down from 25 minutes
4. Try pausing and resuming the timer

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues

**Error: "Module not found"**
```bash
cd backend
pip install -r requirements.txt
```

**Error: "Firebase not initialized"**
- Check your Firebase configuration in `backend/.env`
- Verify your service account key is correct

**Error: "Port 8000 already in use"**
```bash
# Find the process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
```

#### Frontend Issues

**Error: "Module not found"**
```bash
cd frontend
npm install
```

**Error: "Port 3000 already in use"**
```bash
# Find the process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

**Error: "Firebase auth failed"**
- Check your Firebase configuration in `frontend/.env`
- Verify Authentication is enabled in Firebase Console

### API Testing

Test the backend API directly:

```bash
# Health check
curl http://localhost:8000/health

# Should return:
# {"status": "healthy", "message": "AI Scheduler MVP is running"}
```

## 📚 Next Steps

### Development

1. **Explore the Codebase**:
   - Backend: `backend/app/` - FastAPI application
   - Frontend: `frontend/src/` - React components
   - API Docs: http://localhost:8000/docs

2. **Add Features**:
   - Modify task models in `backend/app/models/`
   - Add new API endpoints in `backend/app/routers/`
   - Create new React components in `frontend/src/components/`

3. **Run Tests**:
   ```bash
   # Backend tests
   cd backend
   pytest
   
   # Frontend tests
   cd frontend
   npm test
   ```

### Production Deployment

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy Backend**:
   - Follow the [Deployment Guide](DEPLOYMENT_GUIDE.md)
   - Choose your preferred hosting platform

3. **Environment Variables**:
   - Update all environment variables for production
   - Set `APP_ENV=production` and `DEBUG=false`

## 🆘 Need Help?

- **Documentation**: Check the [API Documentation](API_DOCUMENTATION.md)
- **Deployment**: See the [Deployment Guide](DEPLOYMENT_GUIDE.md)
- **Issues**: Create an issue in the repository
- **Questions**: Check the troubleshooting section above

## 🎉 Congratulations!

You've successfully set up the AI Scheduler MVP! You now have a fully functional task management application with:

- ✅ User authentication with Firebase
- ✅ Task creation and management
- ✅ Natural language processing
- ✅ Pomodoro timer
- ✅ Email notifications
- ✅ Google Calendar integration
- ✅ Modern, responsive UI

Happy coding! 🚀 