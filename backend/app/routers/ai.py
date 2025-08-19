from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User
from app.schemas import AICommand, AIResponse, AISuggestRequest, AIOptimizeRequest, TaskCreate, Task
from app.auth import get_current_active_user
import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

@router.post("/parse", response_model=AIResponse)
async def parse_command(
    command: AICommand,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Parse natural language command and extract tasks"""
    try:
        # Simple prompt for task extraction
        prompt = f"""
        Parse the following command and extract tasks:
        "{command.command}"
        
        Return a JSON response with:
        - tasks: array of task objects with title, description, priority, due_date, estimated_duration
        - message: explanation of what was understood
        - confidence: confidence score (0-1)
        
        Priority should be 'low', 'medium', or 'high'.
        Due dates should be in ISO format if mentioned.
        Estimated duration should be in minutes.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7
        )
        
        # Parse the response (this is a simplified version)
        # In a real implementation, you'd want more robust parsing
        content = response.choices[0].message.content
        
        # For now, return a basic response
        # In production, you'd parse the AI response properly
        return AIResponse(
            tasks=[
                TaskCreate(
                    title=f"Task from: {command.command}",
                    description="AI-generated task",
                    priority="medium"
                )
            ],
            message=f"Parsed command: {command.command}",
            confidence=0.8
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI processing failed: {str(e)}"
        )

@router.post("/suggest", response_model=List[TaskCreate])
async def suggest_tasks(
    request: AISuggestRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Suggest tasks based on context"""
    try:
        prompt = f"""
        Based on this context: "{request.context}"
        
        Suggest 3-5 relevant tasks that would be helpful.
        Return as JSON array of task objects with title, description, priority.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.7
        )
        
        # Simplified response for now
        return [
            TaskCreate(
                title="Suggested task 1",
                description="AI-suggested task based on context",
                priority="medium"
            ),
            TaskCreate(
                title="Suggested task 2", 
                description="Another AI-suggested task",
                priority="low"
            )
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI suggestion failed: {str(e)}"
        )

@router.post("/optimize", response_model=List[Task])
async def optimize_schedule(
    request: AIOptimizeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Optimize task schedule using AI"""
    try:
        # This would implement AI-powered schedule optimization
        # For now, return the tasks as-is
        return request.tasks
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Schedule optimization failed: {str(e)}"
        ) 