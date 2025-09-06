from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import os
from admin_models import AdminUser, AdminToken
from pymongo import MongoClient

# Security configuration
admin_security = HTTPBearer()
admin_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ADMIN_SECRET_KEY = os.getenv("ADMIN_JWT_SECRET_KEY", "admin-super-secret-key-2025")
ADMIN_ALGORITHM = "HS256"
ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours for admin sessions

# Database connection (reuse from main app)
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

def create_admin_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "admin"})
    encoded_jwt = jwt.encode(to_encode, ADMIN_SECRET_KEY, algorithm=ADMIN_ALGORITHM)
    return encoded_jwt

def get_admin_password_hash(password):
    return admin_pwd_context.hash(password)

def verify_admin_password(plain_password, hashed_password):
    return admin_pwd_context.verify(plain_password, hashed_password)

async def get_current_admin_user(credentials: HTTPAuthorizationCredentials = Depends(admin_security)):
    from pymongo import MongoClient
    
    # Database connection
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
    client = MongoClient(mongo_url)
    db = client.just_urbane
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, ADMIN_SECRET_KEY, algorithms=[ADMIN_ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        if username is None or token_type != "admin":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Get admin user from database
    admin_user = db.admin_users.find_one({"username": username})
    if admin_user is None:
        raise credentials_exception
    
    # Convert ObjectId to string
    admin_user["id"] = str(admin_user["_id"])
    del admin_user["_id"]
    
    return AdminUser(**admin_user)

async def create_default_admin():
    """Create default admin user if none exists"""
    from pymongo import MongoClient
    
    # Database connection
    mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
    client = MongoClient(mongo_url)
    db = client.just_urbane
    
    existing_admin = db.admin_users.find_one({"username": "admin"})
    if not existing_admin:
        default_admin = {
            "username": "admin",
            "hashed_password": get_admin_password_hash("admin123"),  # Change this in production
            "full_name": "Just Urbane Admin",
            "email": "admin@justurbane.com",
            "is_super_admin": True,
            "created_at": datetime.utcnow()
        }
        result = db.admin_users.insert_one(default_admin)
        print(f"Created default admin user: admin/admin123")
        return result.inserted_id
    return None