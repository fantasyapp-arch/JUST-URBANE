#!/usr/bin/env python3

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def add_dual_wristing_article():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.get_database()
    
    # Article data
    article_data = {
        "id": str(uuid.uuid4()),
        "title": "The Art of Double Wristing: Why Two Watches Are Better Than One",
        "slug": "double-wristing-smartwatch-traditional-watch-trend",
        "author": "Krishna Mohod",
        "category": "technology",
        "subcategory": "gadgets",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "hero_image": "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/moyhrk7b_shutterstock_2167685257.jpg",
        "reading_time": "4 min read",
        "excerpt": "In today's digital era, the practice of double wristing—wearing both a smartwatch and traditional timepiece—is becoming the new normal among fashion-forward individuals.",
        "body": """In the world where men are embracing gender fluidity and exhibiting crazy clothes, being spotted sporting a watch in both hands might not seem so weird. Double wristing is more than a style and status statement. In today's digital era, when one single smartwatch provides you all the features, you might wonder what's the use of sporting two watches. Well let me help you understand the relevance of double wristing.

This practice is trending and many icons and celebrities seem to love it. However, it has been observed that many watch sailors were practicing it for decades.

## The Perfect Tech-Art Combination

Drilling this trend may grab people's attention towards you. They might question you for doing the same. But trust me! It will make a lot of sense. Because the smartwatches digital technology will lend you digital access and help you to keep updating yourselves with all latest technology. Traditional watches will give you a perfect vintage look holding up their finest craftsmanship and artisanal creations. This duo of tech-art will make you stand out from the crowd.

## Celebrity Endorsement

If you are a person who keeps an eye on traditional watches or spends time scrolling through the latest updates of watch-selling companies, double wristing might not be so rare for you. It has already been raised as a highlighted topic. Hodinkee was the first company to publish a story on wearing an Apple watch and vintage watch together in 2019.

Double-downing horological masterpieces simultaneously were already normalized in the world of celebrities. Chris Pratt, Billie Eilish, and even the late Princess Diana have already been highlighted in the headlines practicing this trend. Actor Bill Murray was also spotted wearing a double-wristing at the Cannes Film Festival 2022.

## The Future of Wearable Tech

One has to agree with the fact that double wristing has been popular with the advent of smartwatches. Many watch enthusiasts have found a way to combine their luxury timepieces with smartwatches. The digital features of the smartwatches and the spacious artisanship of vintage timepieces are a perfect combo to sport with any outfit.

The moment when you start practising this method of watch wearing, you will realize that smartwatches and traditional watches both are different devices that gives you different experiences. Not all watches are created similarly. Some are really horological pieces that can show the time, but others are technically forward, having a lot of features.

## Why Settle When You Can Make It Double?

I believe this trend is here to stay. The fact that we are in a time where timeless beauty and craftsmanship can be combined with the latest technology is simply mind-boggling. I can't wait for the time when sporting two watches becomes the new normal. Who knows what will happen next? Honestly, it's all just a game of time.

We all were born with two wrists for a good reason. Here is the new trend called 'Double Wristing' - combining smartwatch functionality with conventional watch elegance to enhance your personality in any outfit.""",
        "tags": ["technology", "gadgets", "smartwatch", "wearable tech", "fashion tech", "watches", "style", "trends"],
        "is_premium": False,
        "is_featured": False,
        "is_trending": True,
        "view_count": 0,
        "images": [
            "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/moyhrk7b_shutterstock_2167685257.jpg"
        ]
    }
    
    try:
        # Insert the article
        result = await db.articles.insert_one(article_data)
        print(f"✅ Successfully inserted dual wristing article with ID: {result.inserted_id}")
        print(f"Article slug: {article_data['slug']}")
        print(f"Category: {article_data['category']} > {article_data['subcategory']}")
        
        # Verify the insertion
        inserted_article = await db.articles.find_one({"id": article_data["id"]})
        if inserted_article:
            print(f"✅ Article verification successful")
            print(f"Title: {inserted_article['title']}")
            print(f"Author: {inserted_article['author']}")
            print(f"Hero Image: {inserted_article['hero_image']}")
        else:
            print("❌ Article verification failed")
            
        # Check if technology category exists, create it if needed
        tech_category = await db.categories.find_one({"name": "technology"})
        if not tech_category:
            category_data = {
                "id": str(uuid.uuid4()),
                "name": "technology",
                "display_name": "Technology",
                "subcategories": ["gadgets", "smartphones", "artificial-intelligence", "innovation"]
            }
            await db.categories.insert_one(category_data)
            print("✅ Created Technology category with gadgets subcategory")
        else:
            # Update to ensure gadgets subcategory exists
            if "gadgets" not in tech_category.get("subcategories", []):
                await db.categories.update_one(
                    {"name": "technology"},
                    {"$addToSet": {"subcategories": "gadgets"}}
                )
                print("✅ Added gadgets subcategory to Technology category")
            
    except Exception as e:
        print(f"❌ Error inserting article: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_dual_wristing_article())