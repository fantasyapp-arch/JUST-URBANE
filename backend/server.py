from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile, Query, Request, Response
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
import aiohttp

# Stripe Integration
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

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

# Stripe Configuration
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")

# Subscription packages - UPDATED AS PER PDF REQUIREMENTS
SUBSCRIPTION_PACKAGES = {
    "digital_annual": {
        "name": "Digital Subscription",
        "amount": 499.0,  # ₹499 as per PDF
        "currency": "inr",
        "period": "year",
        "features": ["Unlimited premium articles", "Ad-free experience", "Weekly newsletter", "Mobile app access", "Exclusive digital content", "Early access to features"]
    },
    "print_annual": {
        "name": "Print Subscription", 
        "amount": 499.0,  # ₹499 as per PDF
        "currency": "inr",
        "period": "year",
        "features": ["Monthly print magazine", "Premium paper quality", "Collector's edition", "Exclusive print content", "Free shipping", "Gift options"]
    },
    "combined_annual": {
        "name": "Print + Digital Subscription",
        "amount": 999.0,  # ₹999 as per PDF
        "currency": "inr", 
        "period": "year",
        "features": ["Everything Digital + Print", "Exclusive subscriber events", "Priority support", "Behind-the-scenes content", "Special editions", "Best value"]
    }
}

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

class PaymentRequest(BaseModel):
    package_id: str  # digital_annual, print_annual, combined_annual
    origin_url: str

class SubscriptionRequest(BaseModel):
    package_id: str
    user_details: Optional[Dict[str, Any]] = None  # For print subscriptions
    
class UserAddress(BaseModel):
    full_name: str
    address_line_1: str
    address_line_2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    phone_number: str

class PaymentTransaction(BaseModel):
    id: str
    session_id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    package_id: str
    amount: float
    currency: str
    payment_status: str  # initiated, pending, paid, failed, expired
    status: str  # open, complete, expired
    metadata: Dict[str, str] = {}
    created_at: datetime
    updated_at: datetime

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
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
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

# Optional user dependency
async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        
        user = db.users.find_one({"email": email})
        if user is None:
            return None
        
        user["id"] = str(user["_id"])
        del user["_id"]
        return user
    except JWTError:
        return None

# API Routes

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Just Urbane API is running"}

# Google Authentication Routes
@app.get("/api/auth/google-login-url")
async def get_google_login_url(request: Request):
    """Get Google authentication URL"""
    try:
        # Get the base URL from the request
        base_url = str(request.base_url).rstrip('/')
        redirect_url = f"{base_url}/profile"
        
        # Create Google auth URL
        auth_url = f"https://auth.emergentagent.com/?redirect={redirect_url}"
        
        return {"auth_url": auth_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate auth URL")

@app.post("/api/auth/google-callback")
async def google_auth_callback(session_id: str, response: Response):
    """Handle Google authentication callback"""
    try:
        # Call Emergent auth API to get user data
        async with aiohttp.ClientSession() as session:
            async with session.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            ) as resp:
                if resp.status != 200:
                    raise HTTPException(status_code=400, detail="Invalid session ID")
                
                user_data = await resp.json()
        
        # Check if user already exists
        existing_user = db.users.find_one({"email": user_data["email"]})
        
        if not existing_user:
            # Create new user
            user_dict = {
                "_id": str(uuid.uuid4()),
                "name": user_data["name"],
                "email": user_data["email"],
                "picture": user_data.get("picture"),
                "google_id": user_data["id"],
                "created_at": datetime.utcnow(),
                "is_premium": False,
                "subscription_status": "inactive",
                "auth_provider": "google"
            }
            db.users.insert_one(user_dict)
        else:
            user_dict = existing_user
            user_dict["id"] = str(user_dict["_id"])
        
        # Save session token in sessions table
        session_dict = {
            "_id": str(uuid.uuid4()),
            "session_token": user_data["session_token"],
            "user_id": user_dict["_id"] if "_id" in user_dict else user_dict["id"],
            "user_email": user_data["email"],
            "expires_at": datetime.utcnow() + timedelta(days=7),
            "created_at": datetime.utcnow()
        }
        db.sessions.insert_one(session_dict)
        
        # Set session cookie
        response.set_cookie(
            key="session_token",
            value=user_data["session_token"],
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            secure=True,
            samesite="none",
            path="/"
        )
        
        return {
            "success": True,
            "user": {
                "id": user_dict["_id"] if "_id" in user_dict else user_dict["id"],
                "name": user_data["name"],
                "email": user_data["email"],
                "picture": user_data.get("picture")
            }
        }
        
    except Exception as e:
        print(f"Google auth error: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed")

async def get_current_user_from_session(request: Request):
    """Get current user from session cookie or bearer token"""
    # Try session cookie first
    session_token = request.cookies.get("session_token")
    
    # Try bearer token as fallback
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
    
    # Find session in database
    session = db.sessions.find_one({
        "session_token": session_token,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not session:
        return None
    
    # Get user data
    user = db.users.find_one({"_id": session["user_id"]})
    if user:
        user["id"] = str(user["_id"])
        del user["_id"]
        return user
    
    return None
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

# Payment Routes
@app.post("/api/payments/create-checkout")
async def create_payment_checkout(
    payment_request: PaymentRequest,
    request: Request,
    current_user = Depends(get_current_user_optional)
):
    """Create Stripe checkout session for subscription"""
    
    # Validate package
    if payment_request.package_id not in SUBSCRIPTION_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid subscription package")
    
    package = SUBSCRIPTION_PACKAGES[payment_request.package_id]
    
    try:
        # Initialize Stripe
        host_url = str(request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Build success and cancel URLs
        success_url = f"{payment_request.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{payment_request.origin_url}/pricing"
        
        # Prepare metadata
        metadata = {
            "package_id": payment_request.package_id,
            "package_name": package["name"],
            "user_email": current_user["email"] if current_user else "guest",
            "user_id": current_user["id"] if current_user else "guest"
        }
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=package["amount"],
            currency=package["currency"],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        transaction_dict = {
            "_id": str(uuid.uuid4()),
            "session_id": session.session_id,
            "user_id": current_user["id"] if current_user else None,
            "user_email": current_user["email"] if current_user else None,
            "package_id": payment_request.package_id,
            "amount": package["amount"],
            "currency": package["currency"],
            "payment_status": "initiated",
            "status": "open",
            "metadata": metadata,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        db.payment_transactions.insert_one(transaction_dict)
        
        return {"checkout_url": session.url, "session_id": session.session_id}
        
    except Exception as e:
        print(f"Payment error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment session")

@app.get("/api/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    """Get payment status and update transaction"""
    
    try:
        # Get transaction from database
        transaction = db.payment_transactions.find_one({"session_id": session_id})
        if not transaction:
            raise HTTPException(status_code=404, detail="Payment session not found")
        
        # Check if already processed to avoid duplicate processing
        if transaction["payment_status"] == "paid":
            return {
                "status": "complete",
                "payment_status": "paid",
                "message": "Payment already processed"
            }
        
        # Initialize Stripe
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
        
        # Get status from Stripe
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction in database
        update_data = {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "updated_at": datetime.utcnow()
        }
        
        db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        # If payment successful, update user subscription
        if checkout_status.payment_status == "paid" and transaction["payment_status"] != "paid":
            if transaction["user_email"]:
                # Update user subscription status
                subscription_end_date = datetime.utcnow()
                if transaction["package_id"] == "premium_monthly":
                    subscription_end_date += timedelta(days=30)
                elif transaction["package_id"] == "premium_annual":
                    subscription_end_date += timedelta(days=365)
                
                db.users.update_one(
                    {"email": transaction["user_email"]},
                    {
                        "$set": {
                            "is_premium": True,
                            "subscription_status": "active",
                            "subscription_package": transaction["package_id"],
                            "subscription_end_date": subscription_end_date,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
        
        return {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "amount": checkout_status.amount_total,
            "currency": checkout_status.currency,
            "metadata": checkout_status.metadata
        }
        
    except Exception as e:
        print(f"Payment status error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check payment status")

@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    
    try:
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        if not STRIPE_API_KEY:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        # Initialize Stripe
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update transaction based on webhook
        if webhook_response.session_id:
            update_data = {
                "payment_status": webhook_response.payment_status,
                "updated_at": datetime.utcnow()
            }
            
            if webhook_response.event_type:
                update_data["webhook_event_type"] = webhook_response.event_type
            
            db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": update_data}
            )
        
        return {"received": True}
        
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

@app.get("/api/payments/packages")
async def get_subscription_packages():
    """Get available subscription packages"""
    return SUBSCRIPTION_PACKAGES

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