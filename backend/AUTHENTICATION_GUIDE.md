# Database-Based Authentication System

This guide explains the new database-based authentication system that stores all authentication data in your local PostgreSQL database.

## Overview

The authentication system has been completely rewritten to use database-stored sessions instead of JWT tokens. All authentication data, including session tokens, user sessions, and session metadata, are stored in your local database.

## Key Features

### 🔐 Database-Stored Sessions
- All authentication tokens are stored in the `user_sessions` table
- Session tokens are UUID-based for security
- Sessions include metadata like IP address, user agent, and timestamps
- Automatic session expiration and cleanup

### 🛡️ Security Features
- Password hashing using bcrypt
- Session tokens are cryptographically secure UUIDs
- Automatic session invalidation on logout
- Session expiration with configurable timeout
- IP address and user agent tracking for security monitoring

### 📊 Session Management
- Multiple active sessions per user
- Session refresh functionality
- View all active sessions for a user
- Logout from all sessions at once
- Automatic cleanup of expired sessions

## Database Schema

### UserSession Table
```sql
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR,
    user_agent TEXT
);
```

## Environment Configuration

Update your `.env` file with these settings:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ai_scheduler

# Security
SECRET_KEY=your-very-long-random-secret-key-here
SESSION_EXPIRE_MINUTES=30

# Application Settings
DEBUG=True
ENVIRONMENT=development
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user and create a session.

**Request:**
```json
{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "data": {
        "token": "uuid-session-token",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "name": "John Doe",
            "created_at": "2024-01-01T00:00:00Z"
        },
        "session_info": {
            "expires_at": "2024-01-01T00:30:00Z",
            "created_at": "2024-01-01T00:00:00Z"
        }
    },
    "message": "User registered successfully",
    "success": true
}
```

#### POST `/api/auth/login`
Login with existing credentials and create a new session.

**Request:**
```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

**Response:** Same as register endpoint.

#### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <session_token>
```

#### POST `/api/auth/logout`
Logout and invalidate the current session.

**Headers:**
```
Authorization: Bearer <session_token>
```

#### POST `/api/auth/refresh`
Refresh the current session with a new token.

**Headers:**
```
Authorization: Bearer <session_token>
```

#### POST `/api/auth/logout-all`
Logout from all active sessions for the current user.

**Headers:**
```
Authorization: Bearer <session_token>
```

#### GET `/api/auth/sessions`
Get all active sessions for the current user.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response:**
```json
{
    "data": {
        "sessions": [
            {
                "session_token": "uuid1234...",
                "created_at": "2024-01-01T00:00:00Z",
                "last_used_at": "2024-01-01T00:15:00Z",
                "expires_at": "2024-01-01T00:30:00Z",
                "ip_address": "192.168.1.100",
                "user_agent": "Mozilla/5.0..."
            }
        ],
        "total_active_sessions": 1
    },
    "message": "User sessions retrieved successfully",
    "success": true
}
```

#### POST `/api/auth/cleanup`
Clean up expired sessions (admin function).

## Setup Instructions

### 1. Create Database Tables
```bash
cd backend
python create_tables.py
```

### 2. Update Environment Variables
```bash
cp env.example .env
# Edit .env with your actual values
```

### 3. Start the Backend
```bash
uvicorn main:app --reload
```

### 4. Test the Authentication System
```bash
python test_auth.py
```

## Security Considerations

### Session Security
- Session tokens are UUID-based and cryptographically secure
- Sessions automatically expire after the configured time
- Sessions can be invalidated immediately on logout
- IP address and user agent tracking for security monitoring

### Password Security
- Passwords are hashed using bcrypt
- No plain text passwords are stored
- Password verification is done securely

### Database Security
- All authentication data is stored in your local database
- No external authentication services required
- Full control over your authentication data
- Automatic cleanup of expired sessions

## Migration from JWT

If you're migrating from the previous JWT-based system:

1. **Database Changes**: The new system requires the `user_sessions` table
2. **Token Format**: Session tokens are now UUIDs instead of JWT tokens
3. **Session Management**: Sessions are now stored in the database
4. **API Changes**: The API responses now include session information

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure PostgreSQL is running
   - Check your `DATABASE_URL` in `.env`
   - Verify database exists and is accessible

2. **Session Expiration**
   - Sessions expire after `SESSION_EXPIRE_MINUTES`
   - Use the refresh endpoint to extend sessions
   - Check session expiration in the sessions endpoint

3. **Multiple Sessions**
   - Users can have multiple active sessions
   - Use logout-all to invalidate all sessions
   - Monitor active sessions with the sessions endpoint

### Testing

Run the test script to verify everything works:
```bash
python test_auth.py
```

This will test the complete authentication flow including registration, login, session management, and logout.

## Benefits of Database-Based Authentication

1. **Full Control**: All authentication data is in your database
2. **Session Management**: Track and manage user sessions
3. **Security Monitoring**: IP address and user agent tracking
4. **Immediate Invalidation**: Sessions can be invalidated instantly
5. **No External Dependencies**: No need for external authentication services
6. **Audit Trail**: Complete session history in the database 