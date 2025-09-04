#!/usr/bin/env python3
"""
Standardize Categories and Subcategories System
Create a comprehensive structure for easy article additions
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def standardize_categories():
    """Create comprehensive category structure"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # Comprehensive category structure for premium lifestyle magazine
        categories_structure = {
            "fashion": {
                "name": "Fashion",
                "description": "Expert insights on style, elegance, and luxury fashion for modern living",
                "hero_image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
                "subcategories": ["men", "women", "luxury", "accessories", "trends"]
            },
            "business": {
                "name": "Business", 
                "description": "Entrepreneurship, leadership insights, and success stories from industry leaders",
                "hero_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
                "subcategories": ["entrepreneurship", "leadership", "finance", "startups", "corporate"]
            },
            "technology": {
                "name": "Technology",
                "description": "Latest gadgets, innovations, and tech trends for the luxury lifestyle", 
                "hero_image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
                "subcategories": ["gadgets", "innovations", "mobile", "reviews", "smart", "ai"]
            },
            "finance": {
                "name": "Finance",
                "description": "Investment strategies, wealth management, and financial insights for affluent readers",
                "hero_image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800", 
                "subcategories": ["investment", "wealth", "crypto", "markets", "planning"]
            },
            "travel": {
                "name": "Travel",
                "description": "Luxury destinations, exclusive experiences, and premium travel insights",
                "hero_image": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
                "subcategories": ["destinations", "luxury", "adventure", "resorts", "culture"]
            },
            "health": {
                "name": "Health", 
                "description": "Wellness, fitness, and health optimization for peak performance",
                "hero_image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
                "subcategories": ["fitness", "nutrition", "wellness", "mental", "longevity"]
            },
            "culture": {
                "name": "Culture",
                "description": "Arts, music, literature, and cultural movements shaping our world",
                "hero_image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
                "subcategories": ["arts", "music", "literature", "events", "heritage"]
            },
            "art": {
                "name": "Art",
                "description": "Contemporary art, gallery exhibitions, and artistic expressions worldwide", 
                "hero_image": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
                "subcategories": ["contemporary", "classical", "galleries", "artists", "collections"]
            },
            "entertainment": {
                "name": "Entertainment",
                "description": "Movies, shows, celebrities, and entertainment industry insights",
                "hero_image": "https://images.unsplash.com/photo-1489599735225-8e6c9b2b8e6e?w=800",
                "subcategories": ["movies", "shows", "celebrities", "music", "events"]
            },
            "food": {
                "name": "Food",
                "description": "Discover culinary excellence with expert restaurant reviews, chef profiles, recipe guides, and food trends",
                "hero_image": "https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/oaskh2yo_Celini.JPG",
                "subcategories": ["chefs", "dining", "drinks", "food review", "recipes"]
            },
            "auto": {
                "name": "Auto",
                "description": "Luxury automobiles, performance cars, and automotive excellence",
                "hero_image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
                "subcategories": ["cars", "bikes", "classics", "concept", "evs", "reviews"]
            },
            "grooming": {
                "name": "Grooming",
                "description": "Men's grooming, skincare, and personal care for the modern gentleman", 
                "hero_image": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800",
                "subcategories": ["skincare", "hair", "fragrance", "style", "wellness"]
            },
            "people": {
                "name": "People",
                "description": "Profiles of influential leaders, entrepreneurs, and changemakers",
                "hero_image": "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800",
                "subcategories": ["leaders", "entrepreneurs", "celebrities", "innovators", "profiles"]
            }
        }
        
        # Update or create each category
        for slug, data in categories_structure.items():
            existing_category = await db.categories.find_one({"slug": slug})
            
            category_doc = {
                "name": data["name"],
                "slug": slug,
                "description": data["description"],
                "hero_image": data["hero_image"],
                "subcategories": data["subcategories"],
                "updated_at": datetime.now()
            }
            
            if existing_category:
                # Update existing
                await db.categories.update_one(
                    {"slug": slug},
                    {"$set": category_doc}
                )
                print(f"✅ Updated category: {data['name']}")
            else:
                # Create new
                category_doc["_id"] = str(uuid.uuid4())
                category_doc["created_at"] = datetime.now()
                await db.categories.insert_one(category_doc)
                print(f"✅ Created category: {data['name']}")
        
        # Fix article categories - standardize 'tech' to 'technology'
        tech_articles = await db.articles.count_documents({"category": "tech"})
        if tech_articles > 0:
            await db.articles.update_many(
                {"category": "tech"},
                {"$set": {"category": "technology"}}
            )
            print(f"✅ Fixed {tech_articles} tech articles to use 'technology' category")
        
        # Get final statistics
        total_categories = await db.categories.count_documents({})
        total_articles = await db.articles.count_documents({})
        
        print(f"\n📊 FINAL STATISTICS:")
        print(f"✅ Total categories: {total_categories}")
        print(f"✅ Total articles: {total_articles}")
        
        # Show category distribution
        print(f"\n📂 CATEGORY STRUCTURE:")
        categories = await db.categories.find({}, {"name": 1, "slug": 1, "subcategories": 1}).to_list(None)
        for cat in sorted(categories, key=lambda x: x['name']):
            subcats = cat.get('subcategories', [])
            if isinstance(subcats, list):
                print(f"• {cat['name']} ({cat['slug']}): {len(subcats)} subcategories")
                for subcat in subcats:
                    article_count = await db.articles.count_documents({
                        "category": cat['slug'], 
                        "subcategory": subcat
                    })
                    print(f"  - {subcat}: {article_count} articles")
            else:
                print(f"• {cat['name']} ({cat['slug']}): object-based subcategories")
        
    except Exception as e:
        print(f"❌ Error standardizing categories: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(standardize_categories())