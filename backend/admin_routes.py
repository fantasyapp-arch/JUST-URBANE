from fastapi import APIRouter, HTTPException, Depends, status, File, UploadFile, Form, Query
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import uuid
import shutil
from pathlib import Path
import json

from admin_models import *
from admin_auth import *
from pymongo import MongoClient
import razorpay
import os

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

# Razorpay Configuration
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

# Initialize Razorpay client
razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

admin_router = APIRouter(prefix="/api/admin", tags=["admin"])

# Initialize default admin on startup
@admin_router.on_event("startup")
def startup_event():
    create_default_admin()

# Admin Authentication Endpoints
@admin_router.post("/login", response_model=AdminToken)
def admin_login(admin_credentials: AdminLogin):
    # Find admin user
    admin_user = db.admin_users.find_one({"username": admin_credentials.username})
    if not admin_user or not verify_admin_password(admin_credentials.password, admin_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    db.admin_users.update_one(
        {"_id": admin_user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_admin_access_token(
        data={"sub": admin_user["username"]}, expires_delta=access_token_expires
    )
    
    # Prepare user data for response
    user_data = {
        "id": str(admin_user["_id"]),
        "username": admin_user["username"],
        "full_name": admin_user["full_name"],
        "email": admin_user["email"],
        "is_super_admin": admin_user["is_super_admin"]
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin_user": user_data
    }

@admin_router.get("/me")
def get_current_admin(current_admin: AdminUser = Depends(get_current_admin_user)):
    return current_admin

# Dashboard Analytics Endpoints
@admin_router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(current_admin: AdminUser = Depends(get_current_admin_user)):
    # Get basic counts
    total_articles = db.articles.count_documents({})
    total_magazines = db.issues.count_documents({})
    total_users = db.users.count_documents({})
    total_subscribers = db.users.count_documents({"is_premium": True})
    
    # Calculate total revenue from transactions
    revenue_pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    revenue_result = list(db.transactions.aggregate(revenue_pipeline))
    total_revenue = revenue_result[0]["total"] / 100 if revenue_result else 0  # Convert from paise
    
    # Get popular articles (top 5 by views)
    popular_articles = list(db.articles.find({}, {"title": 1, "views": 1, "category": 1}).sort([("views", -1)]).limit(5))
    for article in popular_articles:
        article["id"] = str(article["_id"])
        del article["_id"]
    
    # Get recent activities (recent articles and transactions)
    recent_articles = list(db.articles.find({}).sort([("created_at", -1)]).limit(3))
    recent_transactions = list(db.transactions.find({}).sort([("created_at", -1)]).limit(3))
    
    recent_activities = []
    for article in recent_articles:
        recent_activities.append({
            "type": "article_created",
            "title": f"New article: {article['title']}",
            "timestamp": article.get("created_at", datetime.utcnow()),
            "details": {"category": article.get("category", ""), "author": article.get("author_name", "")}
        })
    
    for transaction in recent_transactions:
        recent_activities.append({
            "type": "payment_received",
            "title": f"Payment received: ₹{transaction.get('amount', 0) / 100}",
            "timestamp": transaction.get("created_at", datetime.utcnow()),
            "details": {"package": transaction.get("package_id", ""), "status": transaction.get("status", "")}
        })
    
    # Sort recent activities by timestamp (newest first)
    recent_activities.sort(key=lambda x: x["timestamp"], reverse=True)
    recent_activities = recent_activities[:10]  # Keep only top 10
    
    return DashboardStats(
        total_articles=total_articles,
        total_magazines=total_magazines,
        total_users=total_users,
        total_subscribers=total_subscribers,
        total_revenue=total_revenue,
        monthly_visitors=0,  # TODO: Implement visitor tracking
        popular_articles=popular_articles,
        recent_activities=recent_activities
    )

# Content Management Endpoints
@admin_router.get("/articles")
def get_all_articles_admin(
    current_admin: AdminUser = Depends(get_current_admin_user),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None
):
    skip = (page - 1) * limit
    query = {}
    
    if category:
        query["category"] = category
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"body": {"$regex": search, "$options": "i"}},
            {"author_name": {"$regex": search, "$options": "i"}}
        ]
    
    articles = list(db.articles.find(query).skip(skip).limit(limit).sort([("created_at", -1)]))
    total_count = db.articles.count_documents(query)
    
    # Convert ObjectId to string
    for article in articles:
        article["id"] = str(article["_id"])
        del article["_id"]
    
    return {
        "articles": articles,
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "total_pages": (total_count + limit - 1) // limit
    }

@admin_router.delete("/articles/{article_id}")
def delete_article_admin(
    article_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    # Delete article
    result = db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return {"message": "Article deleted successfully"}

@admin_router.get("/magazines")
def get_all_magazines_admin(current_admin: AdminUser = Depends(get_current_admin_user)):
    magazines = list(db.issues.find({}).sort([("year", -1), ("month", -1)]))
    
    # Convert ObjectId to string
    for magazine in magazines:
        magazine["id"] = str(magazine["_id"])
        del magazine["_id"]
    
    return {"magazines": magazines}

@admin_router.delete("/magazines/{magazine_id}")
def delete_magazine_admin(
    magazine_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    # Delete magazine
    result = db.issues.delete_one({"id": magazine_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Magazine not found")
    
    return {"message": "Magazine deleted successfully"}

# User Management Endpoints
@admin_router.get("/users")
async def get_all_users_admin(
    current_admin: AdminUser = Depends(get_current_admin_user),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    skip = (page - 1) * limit
    users = await db.users.find({}, {"hashed_password": 0}).skip(skip).limit(limit).sort([("created_at", -1)]).to_list(limit)
    total_count = await db.users.count_documents({})
    
    # Convert ObjectId to string
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    
    return {
        "users": users,
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "total_pages": (total_count + limit - 1) // limit
    }

# Payment Analytics Endpoints
@admin_router.get("/payments/analytics")
async def get_payment_analytics(current_admin: AdminUser = Depends(get_current_admin_user)):
    # Monthly revenue calculation
    monthly_revenue = {}
    transactions = await db.transactions.find({"status": "success"}).to_list(1000)
    
    for transaction in transactions:
        created_at = transaction.get("created_at", datetime.utcnow())
        month_key = created_at.strftime("%Y-%m")
        amount = transaction.get("amount", 0) / 100  # Convert from paise
        
        if month_key in monthly_revenue:
            monthly_revenue[month_key] += amount
        else:
            monthly_revenue[month_key] = amount
    
    # Package popularity
    package_stats = {}
    for transaction in transactions:
        package_id = transaction.get("package_id", "unknown")
        if package_id in package_stats:
            package_stats[package_id] += 1
        else:
            package_stats[package_id] = 1
    
    return {
        "monthly_revenue": monthly_revenue,
        "package_popularity": package_stats,
        "total_transactions": len(transactions),
        "total_revenue": sum(t.get("amount", 0) for t in transactions) / 100
    }

# System Health Endpoints
@admin_router.get("/system/health")
async def admin_system_health(current_admin: AdminUser = Depends(get_current_admin_user)):
    # Check database connection
    try:
        await db.command("ping")
        db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    # Check Razorpay connection
    razorpay_status = "configured" if razorpay_client else "not configured"
    
    return {
        "database": db_status,
        "razorpay": razorpay_status,
        "server_time": datetime.utcnow().isoformat(),
        "admin_session": "active"
    }