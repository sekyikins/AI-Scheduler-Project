# AI Scheduler MVP - Deployment Guide

## Overview

This guide covers the deployment of the AI Scheduler MVP, a minimal viable product focused on task management, time tracking, and productivity optimization.

## Prerequisites

### Required Services
- **PostgreSQL Project**: For authentication and database
- **OpenAI API Key**: For natural language processing
- **SendGrid Account**: For email notifications (Future implementation)
- **Google Cloud Project**: For Google Calendar integration (Future implementation)
- **Cloud Hosting**: For backend deployment (Cloud Run recommended) (Future implementation)

### System Requirements
- Python 3.8+
- Node.js 16+
- Git

## Environment Setup

<!-- ### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

### 2. OpenAI Configuration

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Ensure you have sufficient credits for NLP processing

### 3. SendGrid Configuration

1. Create a SendGrid account
2. Verify your sender domain
3. Generate an API key
4. Create a sender email address

### 4. Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Configure authorized redirect URIs -->

## Backend Deployment

### Local Development

1. **Clone and Setup**
```bash
git clone <repository-url>
cd AI-Task-Scheduler/backend
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Environment Configuration**
```bash
cp env.example .env
# Edit .env with your actual values
```

4. **Run Development Server**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Deployment (Cloud Run)

1. **Build Docker Image**
```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Deploy to Cloud Run**
```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-scheduler-backend

# Deploy
gcloud run deploy ai-scheduler-backend \
  --image gcr.io/PROJECT_ID/ai-scheduler-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

3. **Set Environment Variables**
```bash
gcloud run services update ai-scheduler-backend \
  --update-env-vars OPENAI_API_KEY=your_key \
  --update-env-vars FIREBASE_PROJECT_ID=your_project_id \
  --update-env-vars SENDGRID_API_KEY=your_key
```

## Frontend Deployment

### Local Development

1. **Setup**
```bash
cd frontend
npm install
```

2. **Environment Configuration**
```bash
cp env.example .env
# Edit .env with your backend URL
```

3. **Run Development Server**
```bash
npm start
```

### Production Deployment (Firebase Hosting)

1. **Build for Production**
```bash
npm run build
```

2. **Deploy to Firebase Hosting**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## Performance Optimization

### Backend Optimizations

1. **Database Indexing**
```javascript
// Firestore indexes for optimal performance
{
  "collectionGroup": "tasks",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "user_id", "order": "ASCENDING"},
    {"fieldPath": "created_at", "order": "DESCENDING"}
  ]
}
```

2. **Caching Strategy**
- Implement Redis for session caching
- Cache frequently accessed tasks
- Use CDN for static assets

3. **API Rate Limiting**
```python
# Add to main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/v1/tasks")
@limiter.limit("100/minute")
async def get_tasks():
    # Implementation
    pass
```

### Frontend Optimizations

1. **Code Splitting**
```javascript
// Lazy load components
const Tasks = React.lazy(() => import('./pages/Tasks'));
const Pomodoro = React.lazy(() => import('./pages/Pomodoro'));
```

2. **Service Worker**
```javascript
// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## Monitoring and Logging

### Health Checks

1. **Backend Health Endpoint**
```bash
curl https://your-backend-url/health
```

2. **Frontend Health Check**
```javascript
// Add to App.js
const healthCheck = async () => {
  try {
    const response = await fetch('/api/v1/health');
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
```

### Performance Monitoring

1. **Backend Metrics**
- API response times
- Database query performance
- Error rates
- Concurrent user count

2. **Frontend Metrics**
- Page load times
- User interaction metrics
- Error tracking

## Security Configuration

### Backend Security

1. **CORS Configuration**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

2. **Authentication**
- Firebase Auth integration
- Token validation
- User session management

3. **Data Validation**
- Input sanitization
- SQL injection prevention
- XSS protection

### Frontend Security

1. **Environment Variables**
```javascript
// Only expose necessary variables
REACT_APP_API_URL=https://your-backend-url
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

2. **Content Security Policy**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

## Testing

### Backend Testing

1. **Unit Tests**
```bash
cd backend
pytest tests/ -v
```

2. **Integration Tests**
```bash
pytest tests/test_integration.py -v
```

3. **Performance Tests**
```bash
# Test API response times
pytest tests/test_performance.py -v
```

### Frontend Testing

1. **Unit Tests**
```bash
cd frontend
npm test
```

2. **E2E Tests**
```bash
npm run test:e2e
```

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Firebase project setup complete
- [ ] OpenAI API key valid
- [ ] SendGrid account configured
- [ ] Google Calendar API enabled
- [ ] Database indexes created
- [ ] Tests passing
- [ ] Performance targets met

### Post-Deployment
- [ ] Health check endpoint responding
- [ ] Authentication working
- [ ] Task CRUD operations functional
- [ ] NLP processing accurate (>85%)
- [ ] Pomodoro timer working
- [ ] Notifications sending
- [ ] Calendar sync operational
- [ ] Frontend loading correctly
- [ ] Error monitoring active

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
```bash
# Check service account key format
cat .env | grep FIREBASE_PRIVATE_KEY
```

2. **OpenAI API Errors**
```bash
# Test API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.openai.com/v1/models
```

3. **Performance Issues**
```bash
# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s "YOUR_API_URL/health"
```

### Support

For deployment issues:
1. Check the logs: `gcloud logs read`
2. Verify environment variables
3. Test endpoints individually
4. Review performance metrics

## Success Metrics

### Technical Metrics
- API response time <300ms
- Task creation <100ms
- Calendar sync <5 seconds
- NLP accuracy >85%
- Uptime >99.5%

### User Metrics
- Task completion rate >60%
- Daily active usage >70%
- User retention (7 days) >40%
- Feature adoption >80%

## Cost Optimization

### Backend Costs
- Use Cloud Run for auto-scaling
- Implement caching to reduce database calls
- Monitor API usage for OpenAI costs
- Use Firebase free tier initially

### Frontend Costs
- Firebase Hosting free tier
- CDN for static assets
- Optimize bundle size

## Scaling Strategy

### Horizontal Scaling
- Cloud Run auto-scaling
- Load balancer for multiple regions
- Database read replicas

### Vertical Scaling
- Increase memory/CPU as needed
- Optimize database queries
- Implement caching layers

## Maintenance

### Regular Tasks
- Monitor performance metrics
- Update dependencies
- Review security patches
- Backup database
- Check error logs

### Updates
- Test in staging environment
- Use blue-green deployment
- Monitor after updates
- Rollback plan ready 