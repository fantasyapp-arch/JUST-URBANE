#!/usr/bin/env python3
"""
Update Sustainable Travel Article Images - Add Additional Location Image
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def update_sustainable_travel_images():
    """Add additional image to the sustainable travel article gallery"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # New image URL to add
        new_image_url = "https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/9edzgrib_shutterstock_1611400012.jpg"
        
        # Find and update the sustainable travel article
        result = await db.articles.update_one(
            {"slug": "sustainable-travel-conscious-guide"},
            {"$addToSet": {"gallery": new_image_url}}
        )
        
        if result.modified_count > 0:
            print("✅ Successfully added new image to sustainable travel article gallery")
        else:
            print("⚠️ Article not found or image may already exist in gallery")
        
        # Verify the update
        article = await db.articles.find_one({"slug": "sustainable-travel-conscious-guide"})
        if article:
            print(f"Article: \"{article.get('title', '')}\"")
            print(f"Total gallery images: {len(article.get('gallery', []))}")
            print("Gallery images:")
            for i, img_url in enumerate(article.get('gallery', []), 1):
                print(f"  {i}. {img_url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating sustainable travel article images: {e}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    print("🌍 ADDING LOCATION IMAGE TO SUSTAINABLE TRAVEL ARTICLE")
    print("=" * 60)
    asyncio.run(update_sustainable_travel_images())