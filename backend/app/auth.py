from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserSession
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
SESSION_EXPIRE_MINUTES = int(os.getenv("SESSION_EXPIRE_MINUTES", "30"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Session token security
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def generate_session_token() -> str:
    """Generate a unique session token"""
    return str(uuid.uuid4())

def create_user_session(user_id: int, db: Session, request: Request = None) -> UserSession:
    """Create a new user session in the database"""
    session_token = generate_session_token()
    expires_at = datetime.utcnow() + timedelta(minutes=SESSION_EXPIRE_MINUTES)
    
    # Get client information
    ip_address = None
    user_agent = None
    if request:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
    
    session = UserSession(
        session_token=session_token,
        user_id=user_id,
        expires_at=expires_at,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def verify_session_token(token: str, db: Session) -> Optional[UserSession]:
    """Verify a session token and return the session if valid"""
    session = db.query(UserSession).filter(
        UserSession.session_token == token,
        UserSession.is_active == True,
        UserSession.expires_at > datetime.utcnow()
    ).first()
    
    if session:
        # Update last used timestamp
        session.last_used_at = datetime.utcnow()
        db.commit()
        return session
    
        return None

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    session = verify_session_token(token, db)
    
    if not session:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise credentials_exception
    
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user 

def invalidate_session(token: str, db: Session) -> bool:
    """Invalidate a session by setting is_active to False"""
    session = db.query(UserSession).filter(
        UserSession.session_token == token,
        UserSession.is_active == True
    ).first()
    
    if session:
        session.is_active = False
        db.commit()
        return True
    
    return False

def cleanup_expired_sessions(db: Session) -> int:
    """Clean up expired sessions from the database"""
    expired_sessions = db.query(UserSession).filter(
        UserSession.expires_at <= datetime.utcnow(),
        UserSession.is_active == True
    ).all()
    
    count = len(expired_sessions)
    for session in expired_sessions:
        session.is_active = False
    
    db.commit()
    return count 