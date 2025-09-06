from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import uuid
import shutil
from pathlib import Path
import json
import re
from striprtf import striprtf

from admin_models import *
from admin_auth import get_current_admin_user
from pymongo import MongoClient
import os

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

article_router = APIRouter(prefix="/api/admin/articles", tags=["admin-articles"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
ARTICLE_DIR = UPLOAD_DIR / "articles"
ARTICLE_DIR.mkdir(exist_ok=True)

@article_router.post("/upload")
async def upload_article(
    current_admin: AdminUser = Depends(get_current_admin_user),
    title: str = Form(...),
    summary: str = Form(...),
    author_name: str = Form(...),
    category: str = Form(...),
    subcategory: str = Form(None),
    tags: str = Form(""),  # Comma-separated tags
    featured: bool = Form(False),
    trending: bool = Form(False),
    premium: bool = Form(False),
    reading_time: int = Form(5),
    hero_image_url: str = Form(None),
    content_file: UploadFile = File(...)
):
    """Upload a new article from RTF or text file"""
    try:
        # Validate file type
        allowed_extensions = ['.rtf', '.txt']
        file_extension = Path(content_file.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Only RTF and TXT files are allowed")
        
        if content_file.size > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(status_code=400, detail="File size must be less than 5MB")
        
        # Read and process file content
        content_bytes = await content_file.read()
        
        if file_extension == '.rtf':
            try:
                # Parse RTF content
                content_text = striprtf(content_bytes.decode('utf-8'))
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to parse RTF file: {str(e)}")
        else:
            # Plain text file
            content_text = content_bytes.decode('utf-8')
        
        # Clean and format content
        content_text = clean_article_content(content_text)
        
        # Generate article slug
        slug = generate_article_slug(title)
        
        # Check if slug already exists
        existing_article = db.articles.find_one({"slug": slug})
        if existing_article:
            slug = f"{slug}-{str(uuid.uuid4())[:8]}"
        
        # Parse tags
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
        
        # Create article record
        article_data = {
            "id": str(uuid.uuid4()),
            "title": title,
            "body": content_text,
            "summary": summary,
            "hero_image": hero_image_url,
            "author_name": author_name,
            "category": category.lower(),
            "subcategory": subcategory.lower() if subcategory else None,
            "tags": tag_list,
            "featured": featured,
            "trending": trending,
            "premium": premium,
            "is_premium": premium,  # Compatibility field
            "views": 0,
            "reading_time": reading_time,
            "slug": slug,
            "published_at": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": current_admin.username,
            "status": "published"
        }
        
        # Save to database
        result = db.articles.insert_one(article_data)
        
        return {
            "message": "Article uploaded successfully",
            "article_id": article_data["id"],
            "slug": slug,
            "title": title
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@article_router.put("/{article_id}")
async def update_article(
    article_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user),
    title: Optional[str] = Form(None),
    body: Optional[str] = Form(None),
    summary: Optional[str] = Form(None),
    author_name: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    subcategory: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    featured: Optional[bool] = Form(None),
    trending: Optional[bool] = Form(None),
    premium: Optional[bool] = Form(None),
    reading_time: Optional[int] = Form(None),
    hero_image: Optional[str] = Form(None),
    status: Optional[str] = Form(None)
):
    """Update an existing article"""
    try:
        # Build update data
        update_data = {
            "updated_at": datetime.utcnow(),
            "updated_by": current_admin.username
        }
        
        if title is not None:
            update_data["title"] = title
            # Update slug if title changed
            new_slug = generate_article_slug(title)
            existing_with_slug = db.articles.find_one({"slug": new_slug, "id": {"$ne": article_id}})
            if existing_with_slug:
                new_slug = f"{new_slug}-{str(uuid.uuid4())[:8]}"
            update_data["slug"] = new_slug
            
        if body is not None:
            update_data["body"] = clean_article_content(body)
        if summary is not None:
            update_data["summary"] = summary
        if author_name is not None:
            update_data["author_name"] = author_name
        if category is not None:
            update_data["category"] = category.lower()
        if subcategory is not None:
            update_data["subcategory"] = subcategory.lower() if subcategory else None
        if tags is not None:
            update_data["tags"] = [tag.strip() for tag in tags.split(",") if tag.strip()]
        if featured is not None:
            update_data["featured"] = featured
        if trending is not None:
            update_data["trending"] = trending
        if premium is not None:
            update_data["premium"] = premium
            update_data["is_premium"] = premium  # Compatibility
        if reading_time is not None:
            update_data["reading_time"] = reading_time
        if hero_image is not None:
            update_data["hero_image"] = hero_image
        if status is not None:
            update_data["status"] = status
        
        # Update article
        result = db.articles.update_one(
            {"id": article_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        
        return {"message": "Article updated successfully", "updated_fields": len(update_data)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@article_router.get("/{article_id}/edit")
async def get_article_for_edit(
    article_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Get article data for editing"""
    try:
        article = await db.articles.find_one({"id": article_id})
        
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Convert ObjectId to string
        article["id"] = str(article.get("_id", article.get("id")))
        if "_id" in article:
            del article["_id"]
        
        return article
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get article: {str(e)}")

@article_router.post("/{article_id}/duplicate")
async def duplicate_article(
    article_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Duplicate an existing article"""
    try:
        # Get original article
        original_article = await db.articles.find_one({"id": article_id})
        
        if not original_article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Create new article data
        new_article = dict(original_article)
        new_article["id"] = str(uuid.uuid4())
        new_article["title"] = f"{original_article['title']} (Copy)"
        new_article["slug"] = generate_article_slug(new_article["title"])
        new_article["views"] = 0
        new_article["created_at"] = datetime.utcnow()
        new_article["updated_at"] = datetime.utcnow()
        new_article["created_by"] = current_admin.username
        new_article["status"] = "draft"
        
        # Remove _id field
        if "_id" in new_article:
            del new_article["_id"]
        
        # Save duplicate
        result = await db.articles.insert_one(new_article)
        
        return {
            "message": "Article duplicated successfully",
            "new_article_id": new_article["id"],
            "new_title": new_article["title"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Duplication failed: {str(e)}")

@article_router.put("/{article_id}/status")
async def update_article_status(
    article_id: str,
    status: str = Form(...),  # published, draft, archived
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Update article status"""
    try:
        valid_statuses = ["published", "draft", "archived"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        result = await db.articles.update_one(
            {"id": article_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow(),
                    "updated_by": current_admin.username
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        
        return {"message": f"Article status updated to {status}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status update failed: {str(e)}")

@article_router.get("/categories/stats")
async def get_category_stats(current_admin: AdminUser = Depends(get_current_admin_user)):
    """Get article statistics by category"""
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$category",
                    "count": {"$sum": 1},
                    "total_views": {"$sum": "$views"},
                    "featured_count": {"$sum": {"$cond": ["$featured", 1, 0]}},
                    "premium_count": {"$sum": {"$cond": ["$premium", 1, 0]}}
                }
            },
            {"$sort": {"count": -1}}
        ]
        
        stats = await db.articles.aggregate(pipeline).to_list(None)
        
        return {"category_stats": stats}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@article_router.post("/bulk-update")
async def bulk_update_articles(
    article_ids: str = Form(...),  # Comma-separated IDs
    action: str = Form(...),  # featured, trending, premium, category, status
    value: str = Form(...),
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Bulk update multiple articles"""
    try:
        # Parse article IDs
        ids = [id.strip() for id in article_ids.split(",") if id.strip()]
        
        if not ids:
            raise HTTPException(status_code=400, detail="No article IDs provided")
        
        # Build update data based on action
        update_data = {
            "updated_at": datetime.utcnow(),
            "updated_by": current_admin.username
        }
        
        if action == "featured":
            update_data["featured"] = value.lower() == "true"
        elif action == "trending":
            update_data["trending"] = value.lower() == "true"
        elif action == "premium":
            update_data["premium"] = value.lower() == "true"
            update_data["is_premium"] = value.lower() == "true"
        elif action == "category":
            update_data["category"] = value.lower()
        elif action == "status":
            if value not in ["published", "draft", "archived"]:
                raise HTTPException(status_code=400, detail="Invalid status")
            update_data["status"] = value
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        # Update articles
        result = await db.articles.update_many(
            {"id": {"$in": ids}},
            {"$set": update_data}
        )
        
        return {
            "message": f"Bulk update completed: {action} = {value}",
            "updated_count": result.modified_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk update failed: {str(e)}")

def clean_article_content(content: str) -> str:
    """Clean and format article content"""
    # Remove excessive whitespace
    content = re.sub(r'\n\s*\n', '\n\n', content)
    content = re.sub(r' +', ' ', content)
    
    # Remove common RTF artifacts
    content = re.sub(r'\\[a-z]+\d*\s*', '', content)
    content = re.sub(r'[{}]', '', content)
    
    # Clean up line breaks
    content = content.strip()
    
    return content

def generate_article_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    # Convert to lowercase and replace spaces/special chars with hyphens
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    slug = slug.strip('-')
    
    # Limit length
    if len(slug) > 60:
        slug = slug[:60].rstrip('-')
    
    return slug