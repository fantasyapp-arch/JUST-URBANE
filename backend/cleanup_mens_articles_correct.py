#!/usr/bin/env python3
"""
Clean up Men's Fashion Articles in the CORRECT DATABASE (just_urbane)
Keep only the "Perfect Suit Guide for Men" and remove dummy articles
Fix thumbnail image
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

async def cleanup_mens_articles_correct():
    """Remove dummy articles and fix the main article's thumbnail in just_urbane database"""
    
    # Connect to MongoDB - use just_urbane database (what backend actually uses)
    mongo_url = 'mongodb://localhost:27017'
    client = AsyncIOMotorClient(mongo_url)
    db = client.just_urbane  # This is the correct database
    
    try:
        # First, let's see what articles exist in fashion > men
        men_articles = await db.articles.find({"category": "fashion", "subcategory": "men"}).to_list(None)
        
        print(f"🔍 Found {len(men_articles)} articles in Fashion > Men (just_urbane database):")
        for article in men_articles:
            print(f"   📰 {article.get('title', 'No Title')} (ID: {article.get('_id', 'No ID')})")
        
        # Find the "Perfect Suit Guide for Men" article and identify dummy articles
        perfect_suit_article = None
        articles_to_remove = []
        
        for article in men_articles:
            title = article.get('title', '').lower()
            if 'perfect suit guide' in title or ('suit guide' in title and 'corporate dressing' in title):
                perfect_suit_article = article
                print(f"✅ Found main article: {article.get('title')}")
            else:
                articles_to_remove.append(article)
                print(f"🗑️  Will remove dummy article: {article.get('title')}")
        
        # Remove dummy/extra articles
        if articles_to_remove:
            print(f"\n🧹 Removing {len(articles_to_remove)} dummy articles...")
            for article in articles_to_remove:
                result = await db.articles.delete_one({"_id": article.get('_id')})
                if result.deleted_count > 0:
                    print(f"   ✅ Removed: {article.get('title')}")
                else:
                    print(f"   ❌ Failed to remove: {article.get('title')}")
        else:
            print("✅ No dummy articles to remove")
        
        # Fix the main article's thumbnail image
        if perfect_suit_article:
            print(f"\n🖼️  Fixing thumbnail for: {perfect_suit_article.get('title')}")
            
            # Use a working professional men's suit image from Unsplash
            new_hero_image = "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1NjM4NjA4Mnww&ixlib=rb-4.1.0&q=85"
            
            # Update the article with working image
            update_result = await db.articles.update_one(
                {"_id": perfect_suit_article.get('_id')},
                {
                    "$set": {
                        "hero_image": new_hero_image,
                        "updated_at": datetime.now(),
                        # Also update other image references if they exist
                        "gallery.0.url": new_hero_image  # Update first gallery image if exists
                    }
                }
            )
            
            if update_result.modified_count > 0:
                print(f"   ✅ Updated hero image successfully")
                print(f"   🔗 New image URL: {new_hero_image}")
            else:
                print(f"   ❌ Failed to update hero image")
        else:
            print("❌ Could not find 'Perfect Suit Guide for Men' article!")
        
        # Verify final state
        print("\n📊 Final verification...")
        final_articles = await db.articles.find({"category": "fashion", "subcategory": "men"}).to_list(None)
        print(f"✅ Fashion > Men now has {len(final_articles)} article(s):")
        
        for article in final_articles:
            print(f"   📰 {article.get('title')}")
            print(f"   🖼️  Hero Image: {article.get('hero_image', 'No Image')[:60]}...")
            print(f"   🏷️  Slug: {article.get('slug')}")
            print(f"   📅 Updated: {article.get('updated_at')}")
            print()
        
        print("🎉 Cleanup completed successfully in just_urbane database!")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(cleanup_mens_articles_correct())