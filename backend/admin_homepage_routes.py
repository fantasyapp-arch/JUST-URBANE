from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from admin_models import *
from admin_auth import get_current_admin_user
from server import db

homepage_router = APIRouter(prefix="/api/admin/homepage", tags=["admin-homepage"])

@homepage_router.get("/content")
def get_homepage_content(current_admin: AdminUser = Depends(get_current_admin_user)):
    """Get current homepage content configuration"""
    try:
        # Get homepage configuration
        homepage_config = db.homepage_config.find_one({"active": True})
        
        if not homepage_config:
            # Create default homepage configuration
            default_config = {
                "id": str(uuid.uuid4()),
                "active": True,
                "hero_article": None,
                "featured_articles": [],
                "fashion_articles": [],
                "people_articles": [],
                "business_articles": [],
                "technology_articles": [],
                "travel_articles": [],
                "culture_articles": [],
                "entertainment_articles": [],
                "trending_articles": [],
                "latest_articles": [],
                "category_priorities": [
                    "fashion", "people", "business", "technology", 
                    "travel", "culture", "art", "entertainment"
                ],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "updated_by": current_admin.username
            }
            
            result = db.homepage_config.insert_one(default_config)
            homepage_config = default_config
        
        # Convert ObjectId to string
        if "_id" in homepage_config:
            homepage_config["id"] = str(homepage_config["_id"])
            del homepage_config["_id"]
        
        # Get actual article data for configured articles
        homepage_data = populate_homepage_articles(homepage_config)
        
        return homepage_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get homepage content: {str(e)}")

@homepage_router.put("/hero")
def set_hero_article(
    article_id: str = Form(...),
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Set the hero article for homepage"""
    try:
        # Verify article exists
        article = db.articles.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Update homepage configuration
        result = db.homepage_config.update_one(
            {"active": True},
            {
                "$set": {
                    "hero_article": article_id,
                    "updated_at": datetime.utcnow(),
                    "updated_by": current_admin.username
                }
            },
            upsert=True
        )
        
        return {"message": "Hero article updated successfully", "article_id": article_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to set hero article: {str(e)}")

@homepage_router.put("/section/{section_name}")
def update_homepage_section(
    section_name: str,
    article_ids: str = Form(...),  # Comma-separated article IDs
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Update a specific homepage section with selected articles"""
    try:
        # Parse article IDs
        article_id_list = [id.strip() for id in article_ids.split(",") if id.strip()]
        
        # Validate section name
        valid_sections = [
            "featured_articles", "fashion_articles", "people_articles", 
            "business_articles", "technology_articles", "travel_articles",
            "culture_articles", "entertainment_articles", "trending_articles", "latest_articles"
        ]
        
        if section_name not in valid_sections:
            raise HTTPException(status_code=400, detail="Invalid section name")
        
        # Verify all articles exist
        for article_id in article_id_list:
            article = db.articles.find_one({"id": article_id})
            if not article:
                raise HTTPException(status_code=404, detail=f"Article {article_id} not found")
        
        # Update homepage configuration
        result = db.homepage_config.update_one(
            {"active": True},
            {
                "$set": {
                    section_name: article_id_list,
                    "updated_at": datetime.utcnow(),
                    "updated_by": current_admin.username
                }
            },
            upsert=True
        )
        
        return {
            "message": f"Section {section_name} updated successfully", 
            "article_count": len(article_id_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update section: {str(e)}")

@homepage_router.get("/articles/available")
def get_available_articles(
    current_admin: AdminUser = Depends(get_current_admin_user),
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    """Get available articles for homepage selection"""
    try:
        query = {}
        
        if category and category != "all":
            query["category"] = category
        
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"summary": {"$regex": search, "$options": "i"}},
                {"author_name": {"$regex": search, "$options": "i"}}
            ]
        
        articles = list(db.articles.find(query).limit(limit).sort([("created_at", -1)]))
        
        # Convert ObjectId to string and format for frontend
        formatted_articles = []
        for article in articles:
            formatted_article = {
                "id": article.get("id", str(article["_id"])),
                "title": article.get("title", ""),
                "summary": article.get("summary", ""),
                "author_name": article.get("author_name", ""),
                "category": article.get("category", ""),
                "subcategory": article.get("subcategory", ""),
                "hero_image": article.get("hero_image", ""),
                "featured": article.get("featured", False),
                "trending": article.get("trending", False),
                "premium": article.get("premium", False),
                "views": article.get("views", 0),
                "created_at": article.get("created_at", datetime.utcnow()),
                "reading_time": article.get("reading_time", 5)
            }
            formatted_articles.append(formatted_article)
        
        return {"articles": formatted_articles}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get articles: {str(e)}")

@homepage_router.post("/categories/reorder")
def reorder_homepage_categories(
    category_order: str = Form(...),  # Comma-separated category names
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Reorder homepage categories"""
    try:
        categories = [cat.strip().lower() for cat in category_order.split(",") if cat.strip()]
        
        # Update homepage configuration
        result = db.homepage_config.update_one(
            {"active": True},
            {
                "$set": {
                    "category_priorities": categories,
                    "updated_at": datetime.utcnow(),
                    "updated_by": current_admin.username
                }
            },
            upsert=True
        )
        
        return {"message": "Category order updated successfully", "categories": categories}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reorder categories: {str(e)}")

@homepage_router.post("/auto-populate")
async def auto_populate_homepage(
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Auto-populate homepage with smart article selection"""
    try:
        # Get articles by category
        categories = ["fashion", "people", "business", "technology", "travel", "culture", "art", "entertainment"]
        
        homepage_config = {
            "featured_articles": [],
            "trending_articles": [],
            "latest_articles": []
        }
        
        # Get trending articles (highest views)
        trending = await db.articles.find({}).sort([("views", -1)]).limit(4).to_list(4)
        homepage_config["trending_articles"] = [article.get("id", str(article["_id"])) for article in trending]
        
        # Get latest articles
        latest = await db.articles.find({}).sort([("created_at", -1)]).limit(6).to_list(6)
        homepage_config["latest_articles"] = [article.get("id", str(article["_id"])) for article in latest]
        
        # Get featured articles
        featured = await db.articles.find({"featured": True}).limit(3).to_list(3)
        if not featured:
            # If no featured articles, use most viewed
            featured = await db.articles.find({}).sort([("views", -1)]).limit(3).to_list(3)
        homepage_config["featured_articles"] = [article.get("id", str(article["_id"])) for article in featured]
        
        # Set hero article (most viewed article)
        hero_articles = await db.articles.find({}).sort([("views", -1)]).limit(1).to_list(1)
        if hero_articles:
            homepage_config["hero_article"] = hero_articles[0].get("id", str(hero_articles[0]["_id"]))
        
        # Populate category sections
        for category in categories:
            category_articles = await db.articles.find({"category": category}).sort([("views", -1)]).limit(4).to_list(4)
            section_name = f"{category}_articles"
            homepage_config[section_name] = [article.get("id", str(article["_id"])) for article in category_articles]
        
        # Update homepage configuration
        update_data = {
            **homepage_config,
            "updated_at": datetime.utcnow(),
            "updated_by": current_admin.username,
            "auto_populated": True
        }
        
        result = await db.homepage_config.update_one(
            {"active": True},
            {"$set": update_data},
            upsert=True
        )
        
        return {"message": "Homepage auto-populated successfully", "sections_updated": len(homepage_config)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to auto-populate homepage: {str(e)}")

@homepage_router.get("/preview")
async def preview_homepage(current_admin: AdminUser = Depends(get_current_admin_user)):
    """Get homepage preview data"""
    try:
        # Get current homepage configuration
        homepage_config = await db.homepage_config.find_one({"active": True})
        
        if not homepage_config:
            return {"message": "No homepage configuration found"}
        
        # Get populated article data
        preview_data = await populate_homepage_articles(homepage_config)
        
        return preview_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get homepage preview: {str(e)}")

async def populate_homepage_articles(config: dict) -> dict:
    """Helper function to populate homepage configuration with actual article data"""
    populated_config = dict(config)
    
    # Helper function to get article data
    async def get_articles_data(article_ids: List[str]) -> List[dict]:
        if not article_ids:
            return []
        
        articles = []
        for article_id in article_ids:
            article = await db.articles.find_one({"id": article_id})
            if article:
                formatted_article = {
                    "id": article.get("id", str(article["_id"])),
                    "title": article.get("title", ""),
                    "summary": article.get("summary", ""),
                    "author_name": article.get("author_name", ""),
                    "category": article.get("category", ""),
                    "subcategory": article.get("subcategory", ""),
                    "hero_image": article.get("hero_image", ""),
                    "views": article.get("views", 0),
                    "reading_time": article.get("reading_time", 5),
                    "created_at": article.get("created_at", datetime.utcnow())
                }
                articles.append(formatted_article)
        return articles
    
    # Populate hero article
    if config.get("hero_article"):
        hero_article = await db.articles.find_one({"id": config["hero_article"]})
        if hero_article:
            populated_config["hero_article_data"] = {
                "id": hero_article.get("id", str(hero_article["_id"])),
                "title": hero_article.get("title", ""),
                "summary": hero_article.get("summary", ""),
                "author_name": hero_article.get("author_name", ""),
                "hero_image": hero_article.get("hero_image", ""),
                "category": hero_article.get("category", ""),
                "views": hero_article.get("views", 0)
            }
    
    # Populate all sections
    sections = [
        "featured_articles", "fashion_articles", "people_articles",
        "business_articles", "technology_articles", "travel_articles",
        "culture_articles", "entertainment_articles", "trending_articles", "latest_articles"
    ]
    
    for section in sections:
        if section in config and config[section]:
            populated_config[f"{section}_data"] = await get_articles_data(config[section])
    
    return populated_config