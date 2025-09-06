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
import razorpay
import hmac
import hashlib

# Import admin functionality
from admin_routes import admin_router
from admin_magazine_routes import magazine_router
from admin_homepage_routes import homepage_router
from admin_article_routes import article_router
from admin_media_routes import media_router

load_dotenv()

app = FastAPI(title="Just Urbane API", version="1.0.0")

# Include admin routes
app.include_router(admin_router)
app.include_router(magazine_router)
app.include_router(homepage_router)
app.include_router(article_router)
app.include_router(media_router)

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

# Razorpay Configuration
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

# Initialize Razorpay client
razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Subscription packages
subscription_packages = {
    "digital_annual": {
        "name": "Digital Subscription",
        "price": 1.0,  # INR - Trial price
        "currency": "INR",
        "features": [
            "Unlimited premium articles access",
            "Ad-free reading experience",
            "Weekly exclusive newsletter",
            "Mobile app with offline reading",
            "Digital magazine archive",
            "Premium podcast episodes",
            "Early access to new content",
            "Cross-device synchronization"
        ],
        "billing_period": "annual",
        "popular": True
    },
    "print_annual": {
        "name": "Print Subscription",
        "price": 499.0,  # INR
        "currency": "INR",
        "features": [
            "Monthly premium print magazine",
            "High-quality paper and printing",
            "Collector's edition covers",
            "Exclusive print-only content",
            "Free shipping across India",
            "Gift subscription options",
            "Premium packaging",
            "Vintage cover reprints access"
        ],
        "billing_period": "annual",
        "popular": False
    },
    "combined_annual": {
        "name": "Print + Digital Subscription",
        "price": 999.0,  # INR
        "currency": "INR",
        "features": [
            "Everything in Digital Subscription",
            "Everything in Print Subscription",
            "Monthly premium print delivery",
            "Complete digital library access",
            "Exclusive subscriber events",
            "Priority customer support",
            "Behind-the-scenes content",
            "Special edition magazines"
        ],
        "billing_period": "annual",
        "popular": False
    }
}

# Pydantic Models
class CustomerDetails(BaseModel):
    email: str
    full_name: str
    phone: str
    password: str  # Required password field
    # Address fields (required for print subscriptions)
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = "India"

class RazorpayOrderRequest(BaseModel):
    package_id: str
    customer_details: CustomerDetails
    payment_method: str = "razorpay"

class RazorpayOrder(BaseModel):
    id: str
    amount: int  # Amount in paise
    currency: str
    status: str

class RazorpayPaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    package_id: str
    customer_details: CustomerDetails

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
    phone: str

class User(BaseModel):
    id: Optional[str] = None
    email: str
    full_name: str
    hashed_password: Optional[str] = None
    is_premium: bool = False
    subscription_type: Optional[str] = None
    subscription_expires_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class Article(BaseModel):
    id: Optional[str] = None
    title: str
    body: str
    summary: Optional[str] = None
    hero_image: Optional[str] = None
    author_name: str
    category: str
    subcategory: Optional[str] = None
    tags: List[str] = []
    featured: bool = False
    trending: bool = False
    premium: bool = False
    is_premium: bool = False
    views: int = 0
    published_at: datetime = datetime.utcnow()
    created_at: datetime = datetime.utcnow()
    reading_time: Optional[int] = None
    slug: Optional[str] = None

class ArticleCreate(BaseModel):
    title: str
    body: str
    summary: Optional[str] = None
    hero_image: Optional[str] = None
    author_name: str
    category: str
    subcategory: Optional[str] = None
    tags: List[str] = []
    featured: bool = False
    trending: bool = False
    premium: bool = False
    is_premium: bool = False

class Category(BaseModel):
    id: Optional[str] = None
    name: str
    display_name: Optional[str] = None
    description: Optional[str] = None
    subcategories: List[str] = []

class Review(BaseModel):
    id: Optional[str] = None
    title: str
    body: str
    rating: Optional[float] = None
    score: Optional[float] = None  # Alternative to rating
    product_name: Optional[str] = None
    product: Optional[str] = None  # Alternative to product_name
    author_name: str
    published_at: datetime = datetime.utcnow()

class Issue(BaseModel):
    id: Optional[str] = None
    title: str
    cover_image: str
    description: str
    month: str
    year: int
    pages: List[Dict[str, Any]] = []
    is_digital: bool = True
    published_at: datetime = datetime.utcnow()

class Destination(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    image: str
    category: str
    location: str
    best_time_to_visit: Optional[str] = None
    highlights: List[str] = []

class Author(BaseModel):
    id: Optional[str] = None
    name: str
    bio: Optional[str] = None
    image: Optional[str] = None
    email: Optional[str] = None
    social_links: Dict[str, str] = {}

class PaymentPackage(BaseModel):
    id: str
    name: str
    price: float
    currency: str
    features: List[str]
    billing_period: str
    popular: bool

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
    return user

def convert_objectid_to_str(item):
    if isinstance(item, dict):
        return {k: (str(v) if isinstance(v, ObjectId) else 
                   (v.isoformat() if isinstance(v, datetime) else convert_objectid_to_str(v))) 
                for k, v in item.items()}
    elif isinstance(item, list):
        return [convert_objectid_to_str(i) for i in item]
    elif isinstance(item, ObjectId):
        return str(item)
    elif isinstance(item, datetime):
        return item.isoformat()
    else:
        return item

def prepare_item_response(item):
    if item is None:
        return None
    
    # Convert ObjectId to string and rename _id to id
    item = convert_objectid_to_str(item)
    if '_id' in item:
        item['id'] = item.pop('_id')
    
    return item

def prepare_list_response(items):
    return [prepare_item_response(item) for item in items]

# Health check
@app.get("/api/homepage/content")
async def get_public_homepage_content():
    """Get homepage content for public display"""
    try:
        # Get active homepage configuration
        homepage_config = await db.homepage_config.find_one({"active": True})
        
        if not homepage_config:
            # Return default structure if no config exists
            return {
                "hero_article": None,
                "featured_articles": [],
                "trending_articles": [],
                "latest_articles": [],
                "category_sections": {}
            }
        
        # Helper function to get articles by IDs
        async def get_articles_by_ids(article_ids):
            if not article_ids:
                return []
            articles = []
            for article_id in article_ids[:6]:  # Limit to 6 articles max per section
                article = await db.articles.find_one({"id": article_id})
                if article:
                    # Convert ObjectId to string for JSON serialization
                    article["id"] = str(article.get("_id", article.get("id")))
                    if "_id" in article:
                        del article["_id"]
                    articles.append(article)
            return articles
        
        # Get hero article
        hero_article = None
        if homepage_config.get("hero_article"):
            hero_data = await db.articles.find_one({"id": homepage_config["hero_article"]})
            if hero_data:
                hero_article = hero_data
                hero_article["id"] = str(hero_article.get("_id", hero_article.get("id")))
                if "_id" in hero_article:
                    del hero_article["_id"]
        
        # Get articles for each section
        sections_data = {}
        
        # Featured articles
        if homepage_config.get("featured_articles"):
            sections_data["featured"] = await get_articles_by_ids(homepage_config["featured_articles"])
        
        # Trending articles  
        if homepage_config.get("trending_articles"):
            sections_data["trending"] = await get_articles_by_ids(homepage_config["trending_articles"])
        
        # Latest articles
        if homepage_config.get("latest_articles"):
            sections_data["latest"] = await get_articles_by_ids(homepage_config["latest_articles"])
        
        # Category sections
        categories = ["fashion", "people", "business", "technology", "travel", "culture", "entertainment"]
        for category in categories:
            section_key = f"{category}_articles"
            if homepage_config.get(section_key):
                sections_data[category] = await get_articles_by_ids(homepage_config[section_key])
        
        return {
            "hero_article": hero_article,
            "sections": sections_data,
            "last_updated": homepage_config.get("updated_at", datetime.utcnow()).isoformat()
        }
        
    except Exception as e:
        # Return fallback data in case of error
        print(f"Homepage content error: {str(e)}")
        
        # Fallback: get some articles automatically
        try:
            # Get trending articles (by views)
            trending = await db.articles.find({}).sort([("views", -1)]).limit(4).to_list(4)
            
            # Get latest articles
            latest = await db.articles.find({}).sort([("created_at", -1)]).limit(6).to_list(6)
            
            # Get featured articles
            featured = await db.articles.find({"featured": True}).limit(3).to_list(3)
            if not featured:
                featured = await db.articles.find({}).sort([("views", -1)]).limit(3).to_list(3)
            
            # Convert ObjectIds
            for articles_list in [trending, latest, featured]:
                for article in articles_list:
                    article["id"] = str(article.get("_id", article.get("id")))
                    if "_id" in article:
                        del article["_id"]
            
            return {
                "hero_article": featured[0] if featured else None,
                "sections": {
                    "featured": featured,
                    "trending": trending,
                    "latest": latest
                },
                "fallback": True
            }
        except Exception as fallback_error:
            print(f"Fallback error: {str(fallback_error)}")
            return {"error": "Failed to load homepage content"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Just Urbane API is running"}

# Authentication endpoints
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user.password)
    user_dict["id"] = str(uuid.uuid4())
    user_dict["is_premium"] = False
    user_dict["subscription_type"] = None
    user_dict["subscription_status"] = None
    user_dict["subscription_expires_at"] = None
    user_dict["created_at"] = datetime.utcnow()
    del user_dict["password"]
    
    db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    user_response = {k: v for k, v in user_dict.items() if k != "hashed_password"}
    user_response = prepare_item_response(user_response)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    # Find user
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    user_response = {k: v for k, v in db_user.items() if k != "hashed_password"}
    user_response = prepare_item_response(user_response)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    user_response = {k: v for k, v in current_user.items() if k != "hashed_password"}
    return prepare_item_response(user_response)

# Payment endpoints - Razorpay only
@app.get("/api/payments/packages")
async def get_payment_packages():
    """Get available subscription packages"""
    packages = []
    for package_id, package_info in subscription_packages.items():
        packages.append({
            "id": package_id,
            **package_info
        })
    return {"packages": packages}

@app.post("/api/payments/razorpay/create-order")
async def create_razorpay_order(
    order_request: RazorpayOrderRequest
):
    """Create Razorpay order for subscription with customer details - Guest checkout allowed"""
    
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Razorpay not configured")
    
    # Get package details
    package = subscription_packages.get(order_request.package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    # Validate address for print subscriptions
    if order_request.package_id in ["print_annual", "combined_annual"]:
        customer = order_request.customer_details
        required_fields = ["address_line_1", "city", "state", "postal_code"]
        missing_fields = [field for field in required_fields if not getattr(customer, field)]
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Address fields required for print subscription: {', '.join(missing_fields)}"
            )
    
    try:
        # Create Razorpay order
        amount_in_paise = int(package["price"] * 100)
        receipt_id = f"ord_{order_request.package_id[:8]}_{order_request.customer_details.email[:8]}_{int(datetime.utcnow().timestamp())}"[:40]
        razorpay_order = razorpay_client.order.create({
            "amount": amount_in_paise,
            "currency": package["currency"],
            "receipt": receipt_id,
            "notes": {
                "package_id": order_request.package_id,
                "user_email": order_request.customer_details.email,
                "customer_name": order_request.customer_details.full_name
            }
        })
        
        # Store order in database (guest order)
        order_doc = {
            "id": str(uuid.uuid4()),
            "razorpay_order_id": razorpay_order["id"],
            "user_id": None,  # Guest order
            "customer_details": order_request.customer_details.dict(),
            "package_id": order_request.package_id,
            "amount": package["price"],
            "currency": package["currency"],
            "status": "created",
            "payment_method": "razorpay",
            "created_at": datetime.utcnow()
        }
        
        db.orders.insert_one(order_doc)
        
        return {
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key_id": RAZORPAY_KEY_ID,
            "package_id": order_request.package_id,
            "package_name": package["name"],
            "customer_details": order_request.customer_details.dict()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@app.post("/api/payments/razorpay/verify")
async def verify_razorpay_payment(
    payment_data: RazorpayPaymentVerification
):
    """Verify Razorpay payment signature and create/update subscription - Guest checkout supported"""
    
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Razorpay not configured")
    
    try:
        # Verify payment signature
        signature = payment_data.razorpay_signature
        order_id = payment_data.razorpay_order_id
        payment_id = payment_data.razorpay_payment_id
        
        # Create signature string
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature != generated_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Get package details
        package = subscription_packages.get(payment_data.package_id)
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")
        
        # Update order status
        db.orders.update_one(
            {"razorpay_order_id": order_id},
            {
                "$set": {
                    "status": "completed",
                    "razorpay_payment_id": payment_id,
                    "razorpay_signature": signature,
                    "completed_at": datetime.utcnow()
                }
            }
        )
        
        # Check if user exists, if not create a new user
        customer_email = payment_data.customer_details.email
        existing_user = db.users.find_one({"email": customer_email})
        
        # Determine if user gets digital magazine access based on subscription type
        has_digital_access = payment_data.package_id in ["digital_annual", "combined_annual"]
        
        if not existing_user:
            # Create new user from customer details
            user_doc = {
                "id": str(uuid.uuid4()),
                "email": customer_email,
                "full_name": payment_data.customer_details.full_name,
                "hashed_password": get_password_hash(payment_data.customer_details.password),  # Hash the password
                "is_premium": has_digital_access,  # Only digital and combined get premium access
                "subscription_type": payment_data.package_id,
                "subscription_status": "active",  # Set active status for magazine access
                "subscription_expires_at": datetime.utcnow() + timedelta(days=365),
                "created_at": datetime.utcnow()
            }
            db.users.insert_one(user_doc)
            user_id = user_doc["id"]
        else:
            # Update existing user subscription and password
            subscription_expires_at = datetime.utcnow() + timedelta(days=365)  # 1 year
            db.users.update_one(
                {"email": customer_email},
                {
                    "$set": {
                        "hashed_password": get_password_hash(payment_data.customer_details.password),  # Update password
                        "is_premium": has_digital_access,  # Only digital and combined get premium access
                        "subscription_type": payment_data.package_id,
                        "subscription_status": "active",  # Set active status for magazine access
                        "subscription_expires_at": subscription_expires_at
                    }
                }
            )
            user_id = existing_user["id"]
        
        # Store transaction record
        transaction_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "customer_details": payment_data.customer_details.dict(),
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "package_id": payment_data.package_id,
            "amount": package["price"],
            "currency": package["currency"],
            "status": "success",
            "payment_method": "razorpay",
            "created_at": datetime.utcnow()
        }
        
        db.transactions.insert_one(transaction_doc)
        
        # Generate access token for the user (auto-login after payment)
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": customer_email}, expires_delta=access_token_expires
        )
        
        # Get full user data for response
        user_data = db.users.find_one({"email": customer_email})
        user_response = {k: v for k, v in user_data.items() if k != "hashed_password"}
        user_response = prepare_item_response(user_response)
        
        return {
            "status": "success",
            "message": "Payment verified and subscription activated",
            "subscription_type": payment_data.package_id,
            "has_digital_access": has_digital_access,
            "expires_at": (datetime.utcnow() + timedelta(days=365)).isoformat(),
            "user_created": existing_user is None,
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

@app.post("/api/payments/razorpay/webhook")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhooks"""
    try:
        body = await request.body()
        signature = request.headers.get("X-Razorpay-Signature")
        
        if not signature:
            raise HTTPException(status_code=400, detail="Missing signature")
        
        # Verify webhook signature (optional - for production)
        # webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
        # if webhook_secret:
        #     expected_signature = hmac.new(
        #         webhook_secret.encode(),
        #         body,
        #         hashlib.sha256
        #     ).hexdigest()
        #     if signature != expected_signature:
        #         raise HTTPException(status_code=400, detail="Invalid webhook signature")
        
        webhook_data = json.loads(body)
        event = webhook_data.get("event")
        
        if event == "payment.captured":
            payment_entity = webhook_data.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = payment_entity.get("order_id")
            
            if order_id:
                # Update order status
                db.orders.update_one(
                    {"razorpay_order_id": order_id},
                    {"$set": {"webhook_received": True, "webhook_at": datetime.utcnow()}}
                )
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

# Content endpoints (keeping existing functionality)
@app.get("/api/articles", response_model=List[Article])
async def get_articles(
    category: Optional[str] = Query(None),
    subcategory: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    trending: Optional[bool] = Query(None),
    limit: int = Query(20, le=100)
):
    filter_dict = {}
    if category:
        filter_dict["category"] = category
    if subcategory:
        filter_dict["subcategory"] = subcategory
    if featured is not None:
        filter_dict["featured"] = featured
    if trending is not None:
        filter_dict["trending"] = trending

    articles = list(db.articles.find(filter_dict).limit(limit))
    return prepare_list_response(articles)

@app.get("/api/articles/{article_id}")
async def get_article(article_id: str):
    # Try to find by ID first, then by slug
    article = db.articles.find_one({"$or": [{"id": article_id}, {"slug": article_id}]})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment view count
    db.articles.update_one(
        {"_id": article["_id"]},
        {"$inc": {"views": 1}}
    )
    
    return prepare_item_response(article)

@app.post("/api/articles", response_model=Article)
async def create_article(article: ArticleCreate, current_user: dict = Depends(get_current_user)):
    article_dict = article.dict()
    article_dict["id"] = str(uuid.uuid4())
    article_dict["views"] = 0
    article_dict["created_at"] = datetime.utcnow()
    article_dict["published_at"] = datetime.utcnow()
    
    # Generate slug if not provided
    if not article_dict.get("slug"):
        article_dict["slug"] = article_dict["title"].lower().replace(" ", "-").replace(",", "")
    
    db.articles.insert_one(article_dict)
    return prepare_item_response(article_dict)

@app.get("/api/categories", response_model=List[Category])
async def get_categories():
    categories = list(db.categories.find())
    return prepare_list_response(categories)

@app.get("/api/reviews", response_model=List[Review])
async def get_reviews():
    reviews = list(db.reviews.find())
    return prepare_list_response(reviews)

@app.get("/api/issues", response_model=List[Issue])
async def get_issues():
    issues = list(db.issues.find())
    return prepare_list_response(issues)

@app.get("/api/destinations", response_model=List[Destination])
async def get_destinations():
    destinations = list(db.destinations.find())
    return prepare_list_response(destinations)

@app.get("/api/authors", response_model=List[Author])
async def get_authors():
    authors = list(db.authors.find())
    return prepare_list_response(authors)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)