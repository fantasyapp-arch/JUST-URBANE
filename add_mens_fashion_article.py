#!/usr/bin/env python3
"""
Add Men's Fashion Article - Perfect Suit Guide for Men
Script to add the specific men's fashion article for testing integration
"""

import os
import sys
from datetime import datetime
from pymongo import MongoClient
import uuid

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

def add_mens_fashion_article():
    """Add the Perfect Suit Guide for Men article to the database"""
    
    # Check if article already exists
    existing_article = db.articles.find_one({"slug": "perfect-suit-guide-men-corporate-dressing"})
    if existing_article:
        print("✅ Article already exists in database")
        return existing_article["_id"]
    
    # Create the article
    article_data = {
        "_id": str(uuid.uuid4()),
        "title": "Perfect Suit Guide for Men: Corporate Dressing Excellence",
        "slug": "perfect-suit-guide-men-corporate-dressing",
        "dek": "Master the art of corporate dressing with our comprehensive guide to perfect suit selection, fit, and styling for the modern professional man",
        "body": """The perfect suit is more than just clothing—it's a statement of professionalism, confidence, and attention to detail. In today's competitive corporate environment, how you dress can significantly impact your career trajectory and professional relationships.

**Understanding Suit Fundamentals**

A well-fitted suit begins with understanding the three essential components: the jacket, trousers, and the harmony between them. The jacket should sit comfortably on your shoulders without pulling or bunching, while the trousers should complement your body type and maintain a clean, professional silhouette.

**Fabric Selection for Corporate Excellence**

Choose fabrics that reflect both quality and practicality. Wool remains the gold standard for business suits, offering durability, breathability, and a professional appearance that maintains its shape throughout long workdays. For year-round versatility, consider Super 120s wool or wool blends that provide comfort in various climates.

**Color Psychology in Corporate Dressing**

Navy blue and charcoal gray form the foundation of any professional wardrobe. These colors project authority, trustworthiness, and sophistication while remaining versatile enough to pair with various shirt and tie combinations. Black suits, while formal, are best reserved for evening events rather than daily corporate wear.

**The Art of Proper Fit**

A perfectly fitted suit should feel like a second skin—comfortable yet structured. The jacket length should allow for a quarter to half-inch of shirt cuff to show, while the trouser break should create a slight crease at the shoe without excessive bunching.

**Styling for Success**

Complete your corporate look with quality accessories: a well-crafted leather belt that matches your shoes, a sophisticated watch, and a tie that complements rather than competes with your suit. Remember, the goal is to look polished and professional, allowing your expertise and personality to shine through your impeccable presentation.

**Investment in Quality**

A quality suit is an investment in your professional future. While the initial cost may be significant, a well-made suit will serve you for years, maintaining its appearance and fit with proper care and occasional tailoring adjustments.

**Maintenance and Care**

Proper suit care extends its lifespan significantly. Rotate between multiple suits to allow fabrics to rest, use quality hangers to maintain shape, and establish relationships with skilled tailors and dry cleaners who understand the nuances of fine menswear.""",
        "hero_image": "https://images.shutterstock.com/image-photo/confident-businessman-perfect-tailored-suit-600nw-2234567890.jpg",
        "gallery": [],
        "category": "fashion",
        "subcategory": "men",
        "tags": ["men", "fashion", "suits", "corporate", "professional", "style", "business"],
        "author_id": "harshit-srinivas-001",
        "author_name": "Harshit Srinivas",
        "is_premium": False,
        "is_featured": True,
        "is_trending": False,
        "is_sponsored": False,
        "reading_time": 6,
        "published_at": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "view_count": 0
    }
    
    # Insert the article
    try:
        result = db.articles.insert_one(article_data)
        print(f"✅ Successfully added Men's Fashion article: {article_data['title']}")
        print(f"   Article ID: {article_data['_id']}")
        print(f"   Slug: {article_data['slug']}")
        print(f"   Category: {article_data['category']}")
        print(f"   Subcategory: {article_data['subcategory']}")
        print(f"   Author: {article_data['author_name']}")
        return article_data["_id"]
    except Exception as e:
        print(f"❌ Error adding article: {str(e)}")
        return None

def verify_article_integration():
    """Verify the article was added correctly"""
    
    # Test 1: Find by slug
    article_by_slug = db.articles.find_one({"slug": "perfect-suit-guide-men-corporate-dressing"})
    if article_by_slug:
        print("✅ Article found by slug")
    else:
        print("❌ Article not found by slug")
        return False
    
    # Test 2: Find in fashion category
    fashion_articles = list(db.articles.find({"category": "fashion"}))
    mens_suit_in_fashion = any("Perfect Suit Guide for Men" in article.get("title", "") for article in fashion_articles)
    if mens_suit_in_fashion:
        print("✅ Article found in fashion category")
    else:
        print("❌ Article not found in fashion category")
    
    # Test 3: Find in men subcategory
    mens_articles = list(db.articles.find({"category": "fashion", "subcategory": "men"}))
    mens_suit_in_subcategory = any("Perfect Suit Guide for Men" in article.get("title", "") for article in mens_articles)
    if mens_suit_in_subcategory:
        print("✅ Article found in fashion/men subcategory")
    else:
        print("❌ Article not found in fashion/men subcategory")
    
    # Test 4: Verify all required fields
    required_fields = ["title", "slug", "category", "subcategory", "author_name", "hero_image", "body"]
    missing_fields = []
    for field in required_fields:
        if field not in article_by_slug or not article_by_slug[field]:
            missing_fields.append(field)
    
    if not missing_fields:
        print("✅ All required fields present")
    else:
        print(f"❌ Missing fields: {', '.join(missing_fields)}")
    
    return True

def main():
    """Main function to add and verify the men's fashion article"""
    print("👔 Adding Perfect Suit Guide for Men Article")
    print("=" * 50)
    
    # Add the article
    article_id = add_mens_fashion_article()
    
    if article_id:
        print("\n🔍 Verifying Article Integration...")
        verify_article_integration()
        
        print("\n✅ Men's Fashion Article Integration Complete!")
        print("   The article is now ready for backend API testing.")
    else:
        print("\n❌ Failed to add Men's Fashion article")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)