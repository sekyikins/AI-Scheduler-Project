from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, User as UserSchema
from app.auth import (
    verify_password, 
    get_password_hash, 
    create_user_session,
    get_current_active_user,
    invalidate_session,
    cleanup_expired_sessions,
    security
)

router = APIRouter()

@router.post("/register")
async def register(user_data: UserCreate, db: Session = Depends(get_db), request: Request = None):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    # Create user session
    session = create_user_session(db_user.id, db, request)
    
    return {
        "data": {
            "token": session.session_token,
            "user": UserSchema.from_orm(db_user),
            "session_info": {
                "expires_at": session.expires_at.isoformat(),
                "created_at": session.created_at.isoformat()
            }
        },
        "message": "User registered successfully",
        "success": True
    }

@router.post("/login")
async def login(login_data: dict, db: Session = Depends(get_db), request: Request = None):
    # Find user by email
    user = db.query(User).filter(User.email == login_data.get("email")).first()
    if not user or not verify_password(login_data.get("password"), user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create user session
    session = create_user_session(user.id, db, request)
    
    return {
        "data": {
            "token": session.session_token,
            "user": UserSchema.from_orm(user),
            "session_info": {
                "expires_at": session.expires_at.isoformat(),
                "created_at": session.created_at.isoformat()
            }
        },
        "message": "Login successful",
        "success": True
    }

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return {
        "data": UserSchema.from_orm(current_user),
        "message": "User info retrieved successfully",
        "success": True
    }

@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_active_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    # Invalidate the current session
    token = credentials.credentials
    invalidated = invalidate_session(token, db)
    
    return {
        "data": None,
        "message": "Successfully logged out" if invalidated else "Session not found",
        "success": True
    }

@router.post("/refresh")
async def refresh_session(
    current_user: User = Depends(get_current_active_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
    request: Request = None
):
    # Invalidate old session
    old_token = credentials.credentials
    invalidate_session(old_token, db)
    
    # Create new session
    session = create_user_session(current_user.id, db, request)
    
    return {
        "data": {
            "token": session.session_token,
            "session_info": {
                "expires_at": session.expires_at.isoformat(),
                "created_at": session.created_at.isoformat()
            }
        },
        "message": "Session refreshed successfully",
        "success": True
    }

@router.post("/logout-all")
async def logout_all_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Logout from all active sessions for the current user"""
    # Invalidate all active sessions for the user
    active_sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.is_active == True
    ).all()
    
    for session in active_sessions:
        session.is_active = False
    
    db.commit()
    
    return {
        "data": {"sessions_invalidated": len(active_sessions)},
        "message": f"Logged out from {len(active_sessions)} active sessions",
        "success": True
    }

@router.get("/sessions")
async def get_user_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all active sessions for the current user"""
    active_sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.is_active == True
    ).all()
    
    sessions_data = []
    for session in active_sessions:
        sessions_data.append({
            "session_token": session.session_token[:8] + "...",  # Show only first 8 chars for security
            "created_at": session.created_at.isoformat(),
            "last_used_at": session.last_used_at.isoformat(),
            "expires_at": session.expires_at.isoformat(),
            "ip_address": session.ip_address,
            "user_agent": session.user_agent
        })
    
    return {
        "data": {
            "sessions": sessions_data,
            "total_active_sessions": len(sessions_data)
        },
        "message": "User sessions retrieved successfully",
        "success": True
    }

@router.post("/cleanup")
async def cleanup_sessions(db: Session = Depends(get_db)):
    """Clean up expired sessions (admin function)"""
    cleaned_count = cleanup_expired_sessions(db)
    
    return {
        "data": {"cleaned_sessions": cleaned_count},
        "message": f"Cleaned up {cleaned_count} expired sessions",
        "success": True
    } 