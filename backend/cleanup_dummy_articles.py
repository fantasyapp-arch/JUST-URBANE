#!/usr/bin/env python3

import os
import sys
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient

# Database configuration
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

# List of REAL articles to keep (these are the actual integrated articles)
REAL_ARTICLES_TO_KEEP = [
    "Perfect Suit Guide for Men: Corporate Dressing Excellence",
    "When In France", 
    "Sunseeker 65 Sport: The Ultimate Luxury Yacht Experience",
    "The 'Buzz' Queen: An Exclusive Interview with Aastha Gill",
    "The Art of Double Wristing: Why Two Watches Are Better Than One",
    "Travel With A Clear Conscious",  # Sustainable travel article
    "Oscars 2022: Best Dressed on the Red Carpet"  # Oscars fashion article
]

# List of DUMMY articles to remove (generic placeholder articles)
DUMMY_ARTICLES_TO_REMOVE = [
    "Smart Gadgets Revolution: Technology for Modern Living",
    "Mobile Technology Mastery: Smartphones for Every Lifestyle",
    "Luxury Automobiles: Performance Meets Sophistication", 
    "Electric Vehicle Revolution: The Future of Mobility",
    "Luxury Travel: Exquisite Destinations and Exclusive Experiences",
    "Luxury Accessories: Craftsmanship and Elegance",
    "Fashion Trends: Stay Ahead of the Curve",
    "Smart Technology: Innovation for Daily Life",
    "Tech Innovations: Shaping the Future", 
    "Technology Reviews: Expert Product Analysis",
    "Skincare Mastery: Advanced Grooming Solutions",
    "Hair Care Excellence: Styling and Maintenance",
    "Fragrance Mastery: The Art of Scent",
    "Motorcycle Excellence: Performance and Style",
    "Automotive Concepts: Visionary Design",
    "Classic Automobiles: Timeless Elegance",
    "Travel Destinations: Global Adventures",
    "Luxury Resorts: Unparalleled Comfort",
    "Timeless Elegance: Women's Fashion Fundamentals",
    "Luxury Fashion: The Art of Impeccable Craftsmanship"
]

async def cleanup_dummy_articles():
    """Remove dummy articles from the database, keeping only real integrated articles"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # Get all current articles
        all_articles = await db.articles.find({}).to_list(length=None)
        print(f"Found {len(all_articles)} total articles in database")
        
        # Count articles to keep vs remove
        articles_to_keep = []
        articles_to_remove = []
        
        for article in all_articles:
            title = article.get('title', '')
            if title in REAL_ARTICLES_TO_KEEP:
                articles_to_keep.append(article)
                print(f"✅ KEEPING: {title}")
            elif title in DUMMY_ARTICLES_TO_REMOVE:
                articles_to_remove.append(article)
                print(f"❌ REMOVING: {title}")
            else:
                # Unknown article - let's be cautious and list it for manual review
                print(f"❓ UNKNOWN: {title} - keeping for manual review")
                articles_to_keep.append(article)
        
        print(f"\n📊 SUMMARY:")
        print(f"Articles to keep: {len(articles_to_keep)}")
        print(f"Articles to remove: {len(articles_to_remove)}")
        
        # Remove dummy articles
        if articles_to_remove:
            dummy_titles = [article['title'] for article in articles_to_remove]
            result = await db.articles.delete_many({
                "title": {"$in": dummy_titles}
            })
            print(f"\n🗑️  REMOVED {result.deleted_count} dummy articles")
        
        # Verify remaining articles
        remaining_articles = await db.articles.find({}).to_list(length=None)
        print(f"\n✅ VERIFICATION: {len(remaining_articles)} articles remain in database")
        
        for article in remaining_articles:
            print(f"   - {article.get('title', 'Unknown')} ({article.get('category', 'No category')} > {article.get('subcategory', 'No subcategory')})")
        
        print(f"\n🎉 CLEANUP COMPLETED SUCCESSFULLY!")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        raise
    finally:
        client.close()

def sync_cleanup():
    """Synchronous wrapper for the async cleanup function"""
    asyncio.run(cleanup_dummy_articles())

if __name__ == "__main__":
    print("🧹 Starting cleanup of dummy articles...")
    print("="*60)
    sync_cleanup()