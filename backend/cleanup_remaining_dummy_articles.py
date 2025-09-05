#!/usr/bin/env python3

import os
import sys
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# Database configuration
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

# Remaining dummy articles to remove (generic food articles by fake authors)
REMAINING_DUMMY_ARTICLES = [
    "Fine Dining Excellence: Culinary Experiences",
    "Master Chefs: Culinary Visionaries", 
    "Fine Beverages: World of Premium Drinks"
]

# Real authors from our integrated articles (keep these)
REAL_AUTHORS = [
    "Harshit Srinivas",    # Perfect Suit Guide, Sunseeker yacht, Scottish Leader
    "Amisha Shirgave",     # When In France, Aastha Gill interview  
    "Komal Bhandekar",     # Sustainable travel
    "Rugved Marathe",      # Oscars fashion
    "Krishna Mohod",       # Dual Wristing
    "Team Urbane"          # Celini review
]

async def cleanup_remaining_dummy_articles():
    """Remove remaining dummy articles and keep only real integrated articles"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        print("🧹 Final cleanup of remaining dummy articles...")
        print("="*60)
        
        # Get all current articles
        all_articles = await db.articles.find({}).to_list(length=None)
        print(f"Found {len(all_articles)} total articles in database")
        
        # Identify dummy articles vs real articles
        articles_to_remove = []
        articles_to_keep = []
        
        for article in all_articles:
            title = article.get('title', '')
            author = article.get('author_name', '')
            category = article.get('category', 'Unknown')
            subcategory = article.get('subcategory', 'Unknown')
            
            # Remove articles with generic titles or fake authors
            if (title in REMAINING_DUMMY_ARTICLES or 
                (author in ['Vikram Singh', 'Ananya Krishnan'] and title.startswith(('Fine ', 'Master ', 'Industry ', 'Business ', 'Celebrity ')))):
                articles_to_remove.append(article)
                print(f"❌ REMOVING: {title} by {author} ({category} > {subcategory})")
            else:
                articles_to_keep.append(article)
                print(f"✅ KEEPING: {title} by {author} ({category} > {subcategory})")
        
        print(f"\n📊 FINAL CLEANUP SUMMARY:")
        print(f"Articles to remove: {len(articles_to_remove)}")
        print(f"Articles to keep: {len(articles_to_keep)}")
        
        # Remove remaining dummy articles
        if articles_to_remove:
            dummy_titles = [article['title'] for article in articles_to_remove]
            result = await db.articles.delete_many({
                "title": {"$in": dummy_titles}
            })
            print(f"\n🗑️  REMOVED {result.deleted_count} remaining dummy articles")
        else:
            print(f"\n✅ No remaining dummy articles found")
        
        # Verify final state
        final_articles = await db.articles.find({}).to_list(length=None)
        print(f"\n✅ FINAL VERIFICATION: {len(final_articles)} articles remain in database")
        
        print(f"\n📋 FINAL REAL ARTICLES (100% integrated content):")
        for article in final_articles:
            title = article.get('title', 'Unknown')
            author = article.get('author_name', 'Unknown')
            category = article.get('category', 'No category')
            subcategory = article.get('subcategory', 'No subcategory')
            print(f"   ✅ {title} by {author} ({category} > {subcategory})")
        
        print(f"\n🎉 COMPLETE DUMMY DATA CLEANUP FINISHED!")
        print(f"Database now contains ONLY real integrated articles.")
        
    except Exception as e:
        print(f"❌ Error during final cleanup: {e}")
        raise
    finally:
        client.close()

def sync_cleanup():
    """Synchronous wrapper for the async cleanup function"""
    asyncio.run(cleanup_remaining_dummy_articles())

if __name__ == "__main__":
    sync_cleanup()