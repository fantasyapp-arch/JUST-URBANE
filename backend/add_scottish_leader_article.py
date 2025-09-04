#!/usr/bin/env python3
"""
Add Scottish Leader Whiskey Review Article to MongoDB
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def add_scottish_leader_article():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # Create the Scottish Leader article
        scottish_leader_article = {
            "id": str(uuid.uuid4()),
            "slug": "scottish-leader-whiskey-review",
            "title": "Scottish Leader Original Whiskey",
            "dek": "Scottish Leader Original whiskey is a blend of malt and grain whiskies, which has been recently introduced in India. But, does it have all that to fare against the existing great whiskeys in the market?",
            "body": """2022 couldn't have started better for whiskey lovers in India! After 45 years of splendid history, Distell International and Aspri Spirits joined hands to introduce the Scottish Leader Original whiskey in India. Honestly, I have never fallen in the category of whiskey drinkers for an obvious reason – its taste. But, when the brand insisted on trying out its very first launch product, I thought to myself, why not give it a try?

Unboxing the hamper, you find a bottle of whiskey in a red carton reminiscent of a famous brand, a pair of whiskey glasses, a peg measurer and a handy flask. The alcohol percentage in the whiskey is 42.8 percent volume per volume, and besides that, on the nose the Scottish Leader Original hints us of a malt, sherry or oak, with a soft smokiness behind.

The whiskey, when sipped with water and a few cubes of ice, tasted pleasant or rather sweet to me. You certainly get a taste of a whiskey with flavours of toffee and nuts, and bits of orange with caramel. The whiskey struck a perfect balance of spice and sweetness, smooth in every slurp with the rich taste, and had a long finish with a touch of mild oak.

With awards like 2019 Scotch Whiskey Masters Gold, 2019 World Whiskey Awards Silver, 2020 International Wine and Spirits Competition Silver and 2021 Scotch Whiskey Masters Silver, Scottish Leader Original is available across India in Punjab (Rs 1,500), Maharashtra (Rs 2,750), Karnataka (Rs 2,449) and Telangana (Rs 2,150).""",
            "author_name": "Harshit Srinivas",
            "author_id": "harshit-srinivas", 
            "category": "food",
            "subcategory": "drinks", 
            "tags": ["scottish whiskey", "whiskey review", "scotch", "distell international", "aspri spirits", "premium spirits", "scottish leader"],
            "hero_image": "https://customer-assets.emergentagent.com/job_premium-articles/artifacts/yfjyheh0_Scottish%20Leader_2.jpg",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_premium-articles/artifacts/yfjyheh0_Scottish%20Leader_2.jpg",
                "https://customer-assets.emergentagent.com/job_premium-articles/artifacts/714p0anm_Scottish%20Leader_3.jpg"
            ],
            "published_at": datetime.now(),
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "is_featured": True,
            "is_trending": False,
            "is_premium": False,
            "reading_time": 5,
            "view_count": 0,
            "like_count": 0,
            "share_count": 0
        }
        
        # Check if article already exists
        existing_article = await db.articles.find_one({"slug": "scottish-leader-whiskey-review"})
        if existing_article:
            print("Scottish Leader article already exists. Updating...")
            await db.articles.replace_one({"slug": "scottish-leader-whiskey-review"}, scottish_leader_article)
            print("✅ Scottish Leader article updated successfully!")
        else:
            await db.articles.insert_one(scottish_leader_article)
            print("✅ Scottish Leader article added successfully!")
        
        # Ensure drinks category exists
        drinks_category = await db.categories.find_one({"slug": "drinks"})
        if not drinks_category:
            drinks_cat = {
                "id": str(uuid.uuid4()),
                "name": "Drinks",
                "slug": "drinks",
                "description": "Premium spirits, cocktails, and beverage reviews",
                "subcategories": ["whiskey review", "cocktails", "wine", "spirits"]
            }
            await db.categories.insert_one(drinks_cat)
            print("✅ Drinks category added!")
        else:
            # Update subcategories if needed
            if "whiskey review" not in drinks_category.get("subcategories", []):
                await db.categories.update_one(
                    {"slug": "drinks"},
                    {"$addToSet": {"subcategories": "whiskey review"}}
                )
                print("✅ Added 'whiskey review' subcategory to drinks!")
        
        # Verify the data
        article_count = await db.articles.count_documents({"category": "drinks"})
        print(f"✅ Total drinks articles: {article_count}")
        
        categories_count = await db.categories.count_documents({})
        print(f"✅ Total categories: {categories_count}")
        
    except Exception as e:
        print(f"❌ Error adding Scottish Leader article: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_scottish_leader_article())