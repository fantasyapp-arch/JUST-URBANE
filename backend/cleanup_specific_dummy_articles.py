#!/usr/bin/env python3

import os
import sys
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# Database configuration
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

# Specific dummy articles to remove (as requested by user)
DUMMY_ARTICLES_TO_REMOVE = [
    "Adventure Travel: Thrilling Exploration",
    "Industry Leaders: Minds Shaping the Future", 
    "Business Entrepreneurs: Innovation and Growth",
    "Celebrity Spotlight: Lives and Achievements"
]

async def cleanup_specific_dummy_articles():
    """Remove specific dummy articles from the database as requested by user"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        print("🧹 Starting cleanup of specific dummy articles...")
        print("="*60)
        
        # Get all current articles
        all_articles = await db.articles.find({}).to_list(length=None)
        print(f"Found {len(all_articles)} total articles in database")
        
        # Find articles to remove
        articles_to_remove = []
        articles_to_keep = []
        
        for article in all_articles:
            title = article.get('title', '')
            if title in DUMMY_ARTICLES_TO_REMOVE:
                articles_to_remove.append(article)
                author = article.get('author_name', 'Unknown')
                category = article.get('category', 'Unknown')
                subcategory = article.get('subcategory', 'Unknown')
                print(f"❌ REMOVING: {title} by {author} ({category} > {subcategory})")
            else:
                articles_to_keep.append(article)
        
        print(f"\n📊 SUMMARY:")
        print(f"Articles to remove: {len(articles_to_remove)}")
        print(f"Articles to keep: {len(articles_to_keep)}")
        
        # Remove specific dummy articles
        if articles_to_remove:
            dummy_titles = [article['title'] for article in articles_to_remove]
            result = await db.articles.delete_many({
                "title": {"$in": dummy_titles}
            })
            print(f"\n🗑️  REMOVED {result.deleted_count} dummy articles")
        else:
            print(f"\n✅ No matching dummy articles found to remove")
        
        # Verify remaining articles
        remaining_articles = await db.articles.find({}).to_list(length=None)
        print(f"\n✅ VERIFICATION: {len(remaining_articles)} articles remain in database")
        
        print(f"\n📋 REMAINING ARTICLES:")
        for article in remaining_articles:
            title = article.get('title', 'Unknown')
            author = article.get('author_name', 'Unknown') 
            category = article.get('category', 'No category')
            subcategory = article.get('subcategory', 'No subcategory')
            print(f"   ✅ {title} by {author} ({category} > {subcategory})")
        
        print(f"\n🎉 SPECIFIC DUMMY ARTICLES CLEANUP COMPLETED!")
        print(f"Real articles are now more prominent in the database.")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        raise
    finally:
        client.close()

def sync_cleanup():
    """Synchronous wrapper for the async cleanup function"""
    asyncio.run(cleanup_specific_dummy_articles())

if __name__ == "__main__":
    sync_cleanup()