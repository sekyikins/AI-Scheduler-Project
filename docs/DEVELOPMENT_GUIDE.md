# AI Scheduler MVP - Development Guide

## 🛠️ Development Setup

This guide is for developers who want to contribute to or extend the AI Scheduler MVP.

## 📁 Project Structure

```
ai-scheduler-mvp/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Pydantic data models
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic
│   │   └── database.py     # (Firebase) configuration
│   ├── tests/              # Backend tests
│   ├── main.py             # FastAPI application entry
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── config/         # Configuration files
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
├── docs/                   # Documentation
└── README.md              # Project overview
```

## 🔧 Development Environment

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git
- VS Code (recommended)

### VS Code Extensions
```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.black-formatter",
    "ms-python.flake8",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 🚀 Quick Development Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ai-scheduler-mvp
python setup.py
```

### 2. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm start
```

### 3. Access Development Tools
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📝 Code Style Guidelines

### Backend (Python)
- **Formatter**: Black
- **Linter**: Flake8
- **Type Hints**: Required for all functions
- **Docstrings**: Google style

```python
def create_task(user_id: str, task_data: TaskCreate) -> TaskResponse:
    """Create a new task for the user.
    
    Args:
        user_id: The ID of the user creating the task
        task_data: The task data to create
        
    Returns:
        TaskResponse: The created task
        
    Raises:
        HTTPException: If task creation fails
    """
    # Implementation here
```

### Frontend (React/TypeScript)
- **Formatter**: Prettier
- **Linter**: ESLint
- **Components**: Functional components with hooks
- **Props**: TypeScript interfaces

```typescript
interface TaskProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskComponent: React.FC<TaskProps> = ({ task, onUpdate, onDelete }) => {
  // Component implementation
};
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
pytest --cov=app tests/
pytest -v tests/test_tasks.py
```

### Frontend Testing
```bash
cd frontend
npm test
npm test -- --coverage
npm test -- --watch
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/v1/tasks/
```

## 🔄 Adding New Features

### 1. Backend Feature Development

#### Add a New Model
```python
# backend/app/models/new_feature.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NewFeatureCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None

class NewFeatureResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
```

#### Add a New Service
```python
# backend/app/services/new_feature_service.py
from app.database import get_db
from app.models.new_feature import NewFeatureCreate, NewFeatureResponse

class NewFeatureService:
    def __init__(self):
        self.db = get_db()
        self.collection = "new_features"
    
    async def create_feature(self, user_id: str, feature_data: NewFeatureCreate) -> NewFeatureResponse:
        # Implementation here
        pass
```

#### Add a New Router
```python
# backend/app/routers/new_feature.py
from fastapi import APIRouter, HTTPException, Depends, status
from app.models.new_feature import NewFeatureCreate, NewFeatureResponse
from app.services.new_feature_service import NewFeatureService
from app.services.auth_service import verify_token

router = APIRouter()
service = NewFeatureService()

@router.post("/", response_model=NewFeatureResponse)
async def create_feature(
    feature_data: NewFeatureCreate,
    user_id: str = Depends(verify_token)
):
    return await service.create_feature(user_id, feature_data)
```

#### Register the Router
```python
# backend/main.py
from app.routers import new_feature

app.include_router(new_feature.router, prefix="/api/v1/new-features", tags=["New Features"])
```

### 2. Frontend Feature Development

#### Add a New Component
```typescript
// frontend/src/components/NewFeature.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface NewFeatureProps {
  title: string;
  onAction: () => void;
}

const NewFeature: React.FC<NewFeatureProps> = ({ title, onAction }) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Button onClick={onAction}>Action</Button>
    </Box>
  );
};

export default NewFeature;
```

#### Add a New Page
```typescript
// frontend/src/pages/NewFeature.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { newFeatureAPI } from '../services/api';

const NewFeaturePage: React.FC = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load data
  }, []);

  return (
    <Box>
      <Typography variant="h4">New Feature</Typography>
      {/* Page content */}
    </Box>
  );
};

export default NewFeaturePage;
```

#### Add API Service
```typescript
// frontend/src/services/api.ts
export const newFeatureAPI = {
  create: (data: any) => api.post('/api/v1/new-features/', data),
  getAll: () => api.get('/api/v1/new-features/'),
  getById: (id: string) => api.get(`/api/v1/new-features/${id}`),
  update: (id: string, data: any) => api.put(`/api/v1/new-features/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/new-features/${id}`),
};
```

#### Add Route
```typescript
// frontend/src/App.js
import NewFeaturePage from './pages/NewFeature';

// In your routes
<Route path="new-feature" element={<NewFeaturePage />} />
```

## 🔍 Debugging

### Backend Debugging
```python
# Add logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Add breakpoints
import pdb; pdb.set_trace()

# Use FastAPI debug mode
uvicorn main:app --reload --log-level debug
```

### Frontend Debugging
```javascript
// Add console logs
console.log('Debug data:', data);

// Use React DevTools
// Install React Developer Tools browser extension

// Use browser dev tools
debugger;
```

### Database Debugging
```python
# Check Firestore data
from app.database import get_db
db = get_db()
docs = db.collection('tasks').stream()
for doc in docs:
    print(doc.to_dict())
```

## 📊 Performance Monitoring

### Backend Performance
```python
import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.2f} seconds")
        return result
    return wrapper
```

### Frontend Performance
```javascript
// Use React Profiler
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(`Component ${id} took ${actualDuration}ms to render`);
}

<Profiler id="TaskList" onRender={onRenderCallback}>
  <TaskList />
</Profiler>
```

## 🔒 Security Best Practices

### Backend Security
- Always validate user input
- Use proper authentication and authorization
- Sanitize data before storing
- Use HTTPS in production
- Implement rate limiting

### Frontend Security
- Never store sensitive data in localStorage
- Validate forms on both client and server
- Use HTTPS in production
- Implement proper CORS policies

## 🚀 Deployment Preparation

### Environment Variables
```bash
# Production environment
APP_ENV=production
DEBUG=false
ALLOWED_ORIGINS=https://yourdomain.com
```

### Build Commands
```bash
# Frontend build
cd frontend
npm run build

# Backend build
cd backend
pip install -r requirements.txt
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🐛 Common Issues

### Import Errors
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Port Conflicts
```bash
# Find processes using ports
lsof -i :8000
lsof -i :3000

# Kill processes
kill -9 <PID>
```

### Firebase Issues
- Check service account credentials
- Verify Firebase project settings
- Enable required Firebase services

---

Happy coding! 🚀 