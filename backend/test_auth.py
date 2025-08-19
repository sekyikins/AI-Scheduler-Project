#!/usr/bin/env python3
"""
Test script for the new database-based authentication system
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://100.66.254.176:8000"
API_URL = f"{BASE_URL}/api"

def test_authentication():
    """Test the complete authentication flow"""
    
    print("🧪 Testing Database-Based Authentication System")
    print("=" * 50)
    
    # Test data
    test_user = {
        "email": "test@example.com",
        "name": "Test User",
        "password": "testpassword123"
    }
    
    # 1. Test Registration
    print("\n1. Testing User Registration...")
    try:
        response = requests.post(f"{API_URL}/auth/register", json=test_user)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Registration successful!")
            print(f"User ID: {data['data']['user']['id']}")
            print(f"Session Token: {data['data']['token'][:20]}...")
            print(f"Session Expires: {data['data']['session_info']['expires_at']}")
            
            # Store token for later tests
            auth_token = data['data']['token']
            user_id = data['data']['user']['id']
        else:
            print(f"❌ Registration failed: {response.text}")
            return
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return
    
    # 2. Test Login
    print("\n2. Testing User Login...")
    try:
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        
        response = requests.post(f"{API_URL}/auth/login", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"New Session Token: {data['data']['token'][:20]}...")
            print(f"Session Expires: {data['data']['session_info']['expires_at']}")
            
            # Update token for later tests
            auth_token = data['data']['token']
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    # 3. Test Get Current User
    print("\n3. Testing Get Current User...")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_URL}/auth/me", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Get current user successful!")
            print(f"User: {data['data']['name']} ({data['data']['email']})")
        else:
            print(f"❌ Get current user failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get current user error: {e}")
    
    # 4. Test Get User Sessions
    print("\n4. Testing Get User Sessions...")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_URL}/auth/sessions", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Get user sessions successful!")
            print(f"Total active sessions: {data['data']['total_active_sessions']}")
            for session in data['data']['sessions']:
                print(f"  - Session: {session['session_token']}")
                print(f"    Created: {session['created_at']}")
                print(f"    Expires: {session['expires_at']}")
        else:
            print(f"❌ Get user sessions failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get user sessions error: {e}")
    
    # 5. Test Session Refresh
    print("\n5. Testing Session Refresh...")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{API_URL}/auth/refresh", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Session refresh successful!")
            print(f"New Session Token: {data['data']['token'][:20]}...")
            print(f"Session Expires: {data['data']['session_info']['expires_at']}")
            
            # Update token for logout test
            auth_token = data['data']['token']
        else:
            print(f"❌ Session refresh failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Session refresh error: {e}")
    
    # 6. Test Logout
    print("\n6. Testing Logout...")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{API_URL}/auth/logout", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Logout successful!")
            print(f"Message: {data['message']}")
        else:
            print(f"❌ Logout failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Logout error: {e}")
    
    # 7. Test Invalid Token Access
    print("\n7. Testing Invalid Token Access...")
    try:
        headers = {"Authorization": f"Bearer invalid_token_123"}
        response = requests.get(f"{API_URL}/auth/me", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Invalid token correctly rejected!")
        else:
            print(f"❌ Invalid token not properly rejected: {response.text}")
            
    except Exception as e:
        print(f"❌ Invalid token test error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Authentication system test completed!")

if __name__ == "__main__":
    test_authentication() 