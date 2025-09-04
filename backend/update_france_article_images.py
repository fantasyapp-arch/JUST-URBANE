#!/usr/bin/env python3
"""
Update France Travel Article with Additional Images
Add the 4 new topic-specific images to the gallery
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def update_france_article_images():
    """Update the France travel article with additional images"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # Updated gallery with all 9 images organized by topic
        updated_gallery = [
            # Original 4 images
            "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/flk6kpul_corsica.jpg",
            "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/97rlqsxn_Loire%20valley%202.jpg",
            "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/3emjw578_St.%20Micheal.jpg",
            "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/99v653zg_Strasbourg.jpg",
            # New 4 images
            "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/bmn4zpsi_corsica%20%282%29.jpg",
            "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/lyt2pdxx_Lavender%202.jpg",
            "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/o978n16c_Corsica%20%283%29.jpg",
            "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/wn9rzw2p_Paris.jpg"
        ]
        
        # Update the article
        result = await db.articles.update_one(
            {"slug": "when-in-france-travel-destinations"},
            {
                "$set": {
                    "gallery": updated_gallery,
                    "updated_at": datetime.now()
                }
            }
        )
        
        if result.modified_count > 0:
            print("✅ France travel article updated successfully with additional images!")
            print(f"✅ Gallery now contains {len(updated_gallery)} images")
            
            # Verify the update
            article = await db.articles.find_one({"slug": "when-in-france-travel-destinations"})
            if article and len(article.get("gallery", [])) == len(updated_gallery):
                print("✅ Update verified - all images properly saved")
                return True
            else:
                print("❌ Update verification failed")
                return False
        else:
            print("❌ No article was updated - article not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating France article images: {e}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    print("🖼️ UPDATING FRANCE TRAVEL ARTICLE IMAGES")
    print("=" * 50)
    asyncio.run(update_france_article_images())