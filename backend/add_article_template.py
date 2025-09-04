#!/usr/bin/env python3
"""
STANDARDIZED ARTICLE ADDITION TEMPLATE
Use this template for adding new articles consistently
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def add_article():
    """
    TEMPLATE FOR ADDING NEW ARTICLES
    
    Replace the article_data dictionary with your article details
    All fields are required for consistency
    """
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # ARTICLE DATA TEMPLATE - REPLACE WITH YOUR ARTICLE
        article_data = {
            "id": str(uuid.uuid4()),
            "slug": "your-article-slug-here",  # URL-friendly version of title
            "title": "Your Article Title Here",
            "dek": "Article subtitle/description that appears in card previews",
            "body": """Your complete article content goes here.
            
This can be multiple paragraphs with proper formatting.

You can include quotes, lists, and detailed content.""",
            "author_name": "Author Name",
            "author_id": "author-slug", 
            "category": "technology",  # Must match existing category slug
            "subcategory": "gadgets",  # Must match subcategory from standardized list
            "tags": ["tag1", "tag2", "tag3", "category-name"],  # Include category in tags
            "hero_image": "https://your-image-url.com/image.jpg",  # Main article image
            "gallery": [  # Additional images (optional)
                "https://your-image-url.com/image1.jpg",
                "https://your-image-url.com/image2.jpg"
            ],
            "published_at": datetime.now(),
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "is_featured": True,  # Featured on homepage
            "is_trending": False,  # Trending section
            "is_premium": False,  # Requires subscription
            "reading_time": 5,  # Estimated reading time in minutes
            "view_count": 0,
            "like_count": 0,
            "share_count": 0
        }
        
        # Validate category and subcategory exist
        category = await db.categories.find_one({"slug": article_data["category"]})
        if not category:
            print(f"❌ Error: Category '{article_data['category']}' does not exist")
            return False
            
        if article_data["subcategory"] not in category.get("subcategories", []):
            print(f"❌ Error: Subcategory '{article_data['subcategory']}' not found in '{article_data['category']}'")
            print(f"Available subcategories: {', '.join(category.get('subcategories', []))}")
            return False
        
        # Check if article already exists
        existing_article = await db.articles.find_one({"slug": article_data["slug"]})
        if existing_article:
            print("Article with this slug already exists. Updating...")
            await db.articles.replace_one({"slug": article_data["slug"]}, article_data)
            print("✅ Article updated successfully!")
        else:
            await db.articles.insert_one(article_data)
            print("✅ Article added successfully!")
        
        # Verify the addition
        article_count = await db.articles.count_documents({
            "category": article_data["category"], 
            "subcategory": article_data["subcategory"]
        })
        print(f"✅ Total articles in {article_data['category']}/{article_data['subcategory']}: {article_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error adding article: {e}")
        return False
    finally:
        client.close()

# AVAILABLE CATEGORIES AND SUBCATEGORIES
CATEGORY_STRUCTURE = {
    "fashion": ["men", "women", "luxury", "accessories", "trends"],
    "business": ["entrepreneurship", "leadership", "finance", "startups", "corporate"], 
    "technology": ["gadgets", "innovations", "mobile", "reviews", "smart", "ai"],
    "finance": ["investment", "wealth", "crypto", "markets", "planning"],
    "travel": ["destinations", "luxury", "adventure", "resorts", "culture"],
    "health": ["fitness", "nutrition", "wellness", "mental", "longevity"],
    "culture": ["arts", "music", "literature", "events", "heritage"],
    "art": ["contemporary", "classical", "galleries", "artists", "collections"],
    "entertainment": ["movies", "shows", "celebrities", "music", "events"],
    "food": ["chefs", "dining", "drinks", "food review", "recipes"],
    "auto": ["cars", "bikes", "classics", "concept", "evs", "reviews"],
    "grooming": ["skincare", "hair", "fragrance", "style", "wellness"],
    "people": ["leaders", "entrepreneurs", "celebrities", "innovators", "profiles"]
}

if __name__ == "__main__":
    print("📝 ARTICLE ADDITION TEMPLATE")
    print("=" * 50)
    print("Available categories and subcategories:")
    print()
    for category, subcategories in CATEGORY_STRUCTURE.items():
        print(f"• {category.upper()}: {', '.join(subcategories)}")
    print()
    print("⚠️  This is a template. Edit the article_data dictionary above before running.")
    print("   Uncomment the line below to run the addition:")
    print()
    # asyncio.run(add_article())  # Uncomment this line to run