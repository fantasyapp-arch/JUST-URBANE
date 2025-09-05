#!/usr/bin/env python3
"""
Update Oscars Fashion Article with 4 Additional Images
Add the new uploaded images to the existing article
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

async def update_oscars_article_images():
    """Add the 4 new images to the existing Oscars fashion article"""
    
    # Connect to MongoDB - use just_urbane database
    mongo_url = 'mongodb://localhost:27017'
    client = AsyncIOMotorClient(mongo_url)
    db = client.just_urbane
    
    try:
        # New image URLs from uploaded assets
        new_images = [
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/geeqo4rh_94_AR_0848.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/48qamudk_94_AR_0660.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/viltuaeq_94_AR_0892%20-%20Copy.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/wuo6l24b_94_AR_0665.jpg"
        ]
        
        # Find the Oscars article
        article = await db.articles.find_one({"slug": "oscars-2022-best-dressed-fashion-red-carpet"})
        
        if article:
            print(f"✅ Found Oscars article: {article.get('title')}")
            
            # Get existing gallery
            existing_gallery = article.get("gallery", [])
            
            # Add new images to gallery
            new_gallery_items = [
                {
                    "url": new_images[0],
                    "caption": "Elegant red carpet fashion moments showcasing stunning designer gowns and sophisticated celebrity styling",
                    "alt": "Celebrity red carpet fashion with visible faces and designer outfits at the Academy Awards"
                },
                {
                    "url": new_images[1], 
                    "caption": "Academy Awards fashion excellence featuring luxury designer collaborations and statement accessories",
                    "alt": "Oscar fashion highlights with clear celebrity portraits and haute couture gowns"
                },
                {
                    "url": new_images[2],
                    "caption": "Hollywood glamour at its finest with impeccable styling and designer fashion statements",
                    "alt": "Red carpet elegance with visible celebrity faces and premium fashion choices"
                },
                {
                    "url": new_images[3],
                    "caption": "Sophisticated Oscar night fashion featuring bold design choices and luxury brand partnerships",
                    "alt": "Celebrity fashion portraits showcasing the best dressed looks from the Academy Awards"
                }
            ]
            
            # Combine existing and new gallery items
            updated_gallery = existing_gallery + new_gallery_items
            
            # Update the article
            result = await db.articles.update_one(
                {"_id": article.get("_id")},
                {
                    "$set": {
                        "gallery": updated_gallery,
                        "updated_at": datetime.now()
                    }
                }
            )
            
            if result.modified_count > 0:
                print(f"✅ Successfully added {len(new_images)} new images to the article")
                print(f"✅ Total gallery images: {len(updated_gallery)}")
                
                for i, img in enumerate(new_images, 1):
                    print(f"   📸 New Image {i}: {img}")
                
            else:
                print("❌ Failed to update article with new images")
        else:
            print("❌ Oscars article not found!")
            
    except Exception as e:
        print(f"❌ Error updating article: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_oscars_article_images())