from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import uuid
import json
from pathlib import Path
import shutil

load_dotenv()

app = FastAPI(title="Just Urbane API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    is_premium: bool = False
    subscription_status: str = "inactive"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Article(BaseModel):
    id: str
    title: str
    slug: str
    dek: str  # subtitle/description
    body: str  # rich text content
    hero_image: Optional[str] = None
    gallery: List[str] = []
    category: str
    tags: List[str] = []
    author_id: str
    author_name: str
    is_premium: bool = False
    is_featured: bool = False
    is_trending: bool = False
    is_sponsored: bool = False
    reading_time: int  # in minutes
    published_at: datetime
    created_at: datetime
    updated_at: datetime
    view_count: int = 0

class ArticleCreate(BaseModel):
    title: str
    dek: str
    body: str
    hero_image: Optional[str] = None
    gallery: List[str] = []
    category: str
    tags: List[str] = []
    is_premium: bool = False
    is_featured: bool = False
    is_trending: bool = False
    is_sponsored: bool = False

class Category(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    hero_image: Optional[str] = None
    created_at: datetime

class Author(BaseModel):
    id: str
    name: str
    slug: str
    bio: str
    headshot: Optional[str] = None
    social_links: Dict[str, str] = {}
    created_at: datetime

class Review(BaseModel):
    id: str
    title: str
    slug: str
    product: str
    brand: str
    score: float  # 1-10 scale
    pros: List[str] = []
    cons: List[str] = []
    specs: Dict[str, str] = {}
    price_inr: Optional[int] = None
    affiliate_links: Dict[str, str] = {}  # retailer: url
    body: str
    images: List[str] = []
    category: str
    author_id: str
    author_name: str
    created_at: datetime
    updated_at: datetime

class MagazineIssue(BaseModel):
    id: str
    title: str
    slug: str
    cover_image: str
    release_date: datetime
    is_digital_available: bool = True
    pdf_url: Optional[str] = None
    article_ids: List[str] = []
    created_at: datetime

class TravelDestination(BaseModel):
    id: str
    name: str
    slug: str
    region: str
    hero_image: str
    gallery: List[str] = []
    description: str
    experiences: List[str] = []
    best_time_to_visit: str
    created_at: datetime

# Utility functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_slug(title: str) -> str:
    """Create URL-friendly slug from title"""
    import re
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    return slug.strip('-')

def calculate_reading_time(content: str) -> int:
    """Calculate reading time in minutes (assuming 200 words per minute)"""
    words = len(content.split())
    return max(1, round(words / 200))

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    
    user["id"] = str(user["_id"])
    del user["_id"]
    return user

# API Routes

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Just Urbane API is running"}

# Authentication Routes
@app.post("/api/auth/register", response_model=User)
async def register(user: UserCreate):
    # Check if user already exists
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "_id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_premium": False,
        "subscription_status": "inactive"
    }
    
    db.users.insert_one(user_dict)
    
    # Return user without password
    user_dict["id"] = user_dict["_id"]
    del user_dict["_id"]
    del user_dict["password"]
    
    return user_dict

@app.post("/api/auth/login")
async def login(user: UserLogin):
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Article Routes
@app.get("/api/articles", response_model=List[Article])
async def get_articles(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    trending: Optional[bool] = None,
    limit: int = Query(default=20, le=50),
    skip: int = 0
):
    filter_dict = {}
    if category:
        filter_dict["category"] = category
    if featured is not None:
        filter_dict["is_featured"] = featured
    if trending is not None:
        filter_dict["is_trending"] = trending
    
    articles = list(db.articles.find(filter_dict).sort("published_at", -1).skip(skip).limit(limit))
    
    # Convert ObjectId to string
    for article in articles:
        article["id"] = str(article["_id"])
        del article["_id"]
    
    return articles

@app.get("/api/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    article = db.articles.find_one({"_id": article_id})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment view count
    db.articles.update_one({"_id": article_id}, {"$inc": {"view_count": 1}})
    
    article["id"] = str(article["_id"])
    del article["_id"]
    return article

@app.post("/api/articles", response_model=Article)
async def create_article(article: ArticleCreate, current_user = Depends(get_current_user)):
    article_dict = article.dict()
    article_dict["_id"] = str(uuid.uuid4())
    article_dict["slug"] = create_slug(article.title)
    article_dict["author_id"] = current_user["id"]
    article_dict["author_name"] = current_user["name"]
    article_dict["reading_time"] = calculate_reading_time(article.body)
    article_dict["published_at"] = datetime.utcnow()
    article_dict["created_at"] = datetime.utcnow()
    article_dict["updated_at"] = datetime.utcnow()
    article_dict["view_count"] = 0
    
    db.articles.insert_one(article_dict)
    
    article_dict["id"] = article_dict["_id"]
    del article_dict["_id"]
    return article_dict

# Category Routes
@app.get("/api/categories", response_model=List[Category])
async def get_categories():
    categories = list(db.categories.find())
    for category in categories:
        category["id"] = str(category["_id"])
        del category["_id"]
    return categories

@app.post("/api/categories", response_model=Category)
async def create_category(name: str, description: str, hero_image: Optional[str] = None):
    category_dict = {
        "_id": str(uuid.uuid4()),
        "name": name,
        "slug": create_slug(name),
        "description": description,
        "hero_image": hero_image,
        "created_at": datetime.utcnow()
    }
    
    db.categories.insert_one(category_dict)
    
    category_dict["id"] = category_dict["_id"]
    del category_dict["_id"]
    return category_dict

# Reviews Routes
@app.get("/api/reviews", response_model=List[Review])
async def get_reviews(category: Optional[str] = None, limit: int = Query(default=20, le=50), skip: int = 0):
    filter_dict = {}
    if category:
        filter_dict["category"] = category
    
    reviews = list(db.reviews.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit))
    
    for review in reviews:
        review["id"] = str(review["_id"])
        del review["_id"]
    
    return reviews

@app.get("/api/reviews/{review_id}", response_model=Review)
async def get_review(review_id: str):
    review = db.reviews.find_one({"_id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review["id"] = str(review["_id"])
    del review["_id"]
    return review

# Magazine Issues Routes
@app.get("/api/issues", response_model=List[MagazineIssue])
async def get_magazine_issues():
    issues = list(db.magazine_issues.find().sort("release_date", -1))
    
    for issue in issues:
        issue["id"] = str(issue["_id"])
        del issue["_id"]
    
    return issues

# Travel Destinations Routes
@app.get("/api/destinations", response_model=List[TravelDestination])
async def get_destinations():
    destinations = list(db.travel_destinations.find().sort("created_at", -1))
    
    for destination in destinations:
        destination["id"] = str(destination["_id"])
        del destination["_id"]
    
    return destinations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)