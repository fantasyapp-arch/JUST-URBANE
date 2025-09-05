#!/usr/bin/env python3
"""
Add Men's Fashion Article to MongoDB Database
Fashion Category / Men Subcategory
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

# Article content extracted from RTF
ARTICLE_CONTENT = """
As said, we are starting a new segment – the #man. This page has a lot to address the concerns of an evolving man, while at the same time will double up as a guide for you to be the man amongst the men. And, this month we prioritize addressing the primary concern on our list which is mastering the art of corporate dressing.

Now, we at Just Urbane have always followed the sigma rule of dressing in formals. Whether it be our workplace, events or our regular meetups, you will always find the team in corporate attire. This may look as a boring rule to a few, but for those who agree with us, realise its importance. And, just to help out those who agree with us, and who are willing to upgrade their wardrobe, here's a guide. This will not only help you to have plenty of options with a minimalist wardrobe, but also save you from drilling holes in your pockets.

And, fret not! This isn't coming from our personal experience either, but from someone whom most of us idolize as the most well dressed man across the globe. And, by that we mean, the favourite American host – Steve Harvey. Steve in one of his trending videos across various social media platforms shared his insights on which shades of suits a man should have.

Now, a lot of you might be taking your initial steps into the corporate world. And, if you are unaware about what to look for, you might end up picking some not so good choices, even after paying a heavy premium. Well, that's not your fault at all but the pressure of making you look presentable, many times put you in these tough times. And, you end up wearing a purple or a maroon suit at meetings. But, to save you from these situations here is what Steve suggests. A man should always have these five common colors of suit in his wardrobe, which include Black, Navy, Grey, Brown and Tan. Along with these, you should have a pair of white, cream and powder blue shirts. Now, what he wants you to do then is to make random combinations using all of these. Mind you, these will not only make you look class and elegant but also let you have access to a total of 75 combinations.

How? Because every shade of the blazer will go up with every shade of the pant and every shade of the pant and the blazer will go with any of the aforementioned shades of the shirts. And, as you read it to be this simple, similar is the way to picking these shades. Also apart from meeting you still can carry them elegantly at different occasions as well, whether it's a birthday, or a wedding, or an interview. You have a list to choose from.

That said, now looking for the perfect suit for you or someone else could not have been simplified so well. And, if you appreciate this segment of ours, you can definitely write to us with suggestions and topics to help you in our next, and trust us we will get the best from the world to address your concerns and topics.
"""

async def add_mens_fashion_article():
    """Add the men's fashion article to MongoDB"""
    
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client.urbane_magazine
    
    try:
        # Generate unique ID
        article_id = str(uuid.uuid4())
        
        # Create article document
        article_doc = {
            "id": article_id,
            "title": "Perfect Suit Guide for Men",
            "slug": "perfect-suit-guide-men-corporate-dressing",
            "category": "fashion",
            "subcategory": "men",
            "author_name": "Harshit Srinivas",
            "published_at": datetime.now().isoformat(),
            "is_premium": False,
            "is_featured": True,
            "is_trending": False,
            "view_count": 0,
            "reading_time": 5,
            "hero_image": "https://customer-assets.emergentagent.com/job_premium-urbane-1/artifacts/7cp5zt1z_shutterstock_516918613.jpg",
            "excerpt": "Master the art of corporate dressing with this comprehensive guide to building the perfect suit wardrobe. Learn from style icon Steve Harvey's insights on essential suit colors and combinations.",
            "body": ARTICLE_CONTENT,
            "tags": ["men's fashion", "corporate dressing", "suits", "style guide", "wardrobe essentials", "steve harvey"],
            "images": [
                {
                    "url": "https://customer-assets.emergentagent.com/job_premium-urbane-1/artifacts/7cp5zt1z_shutterstock_516918613.jpg",
                    "caption": "Perfect suit combinations for the modern professional man",
                    "alt": "Professional men's suits and styling guide"
                }
            ],
            "meta_description": "Complete guide to corporate dressing for men. Learn essential suit colors, combinations, and styling tips from Steve Harvey for the perfect professional wardrobe.",
            "meta_keywords": "men's fashion, corporate dressing, suit guide, professional attire, steve harvey style, wardrobe essentials"
        }
        
        # Insert the article
        result = await db.articles.insert_one(article_doc)
        print(f"✅ Article inserted successfully with ID: {result.inserted_id}")
        print(f"✅ Article UUID: {article_id}")
        print(f"✅ Slug: {article_doc['slug']}")
        print(f"✅ Category: {article_doc['category']}/{article_doc['subcategory']}")
        
        # Check if fashion category exists in categories collection
        fashion_category = await db.categories.find_one({"name": "fashion"})
        if fashion_category:
            # Check if 'men' subcategory exists
            if "men" not in fashion_category.get("subcategories", []):
                await db.categories.update_one(
                    {"name": "fashion"},
                    {"$addToSet": {"subcategories": "men"}}
                )
                print("✅ Added 'men' subcategory to fashion category")
            else:
                print("✅ 'Men' subcategory already exists in fashion category")
        else:
            # Create fashion category with men subcategory
            fashion_doc = {
                "id": str(uuid.uuid4()),
                "name": "fashion",
                "display_name": "Fashion",
                "description": "Latest fashion trends, style guides, and wardrobe essentials",
                "subcategories": ["men", "women", "accessories"],
                "created_at": datetime.now().isoformat()
            }
            await db.categories.insert_one(fashion_doc)
            print("✅ Created fashion category with men subcategory")
        
        print("\n🎉 Men's Fashion Article Integration Complete!")
        print(f"📖 Title: {article_doc['title']}")
        print(f"👤 Author: {article_doc['author_name']}")
        print(f"📂 Category: Fashion > Men")
        print(f"🔗 Slug: {article_doc['slug']}")
        print(f"📸 Hero Image: Available")
        print(f"⏱️ Reading Time: {article_doc['reading_time']} minutes")
        
    except Exception as e:
        print(f"❌ Error inserting article: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_mens_fashion_article())