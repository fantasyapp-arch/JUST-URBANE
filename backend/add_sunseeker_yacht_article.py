#!/usr/bin/env python3
"""
Add Sunseeker 65 Sport Yacht Article to MongoDB Database
Luxury Category / Yachts Subcategory
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

# Article content extracted and cleaned from RTF
ARTICLE_CONTENT = """
Say hello to the Sunseeker 65 Sport yacht. Finished in bespoke bronze, the yacht prioritises its unique emphasis on delivering yachts to the sailor in you with personal and bespoke finishes. The yacht for now is home at a California-based dealer – Sunseekers Southern.

**Design Excellence**

The 65 Sport yacht is the epitome of luxury marine engineering, combining performance with unparalleled sophistication. Its bespoke bronze finish sets it apart from conventional yachts, creating a distinctive presence on the water that commands attention and respect.

**Innovative Features**

Featuring a modular layout, the 65 Sport yacht is complimented with a SkyHelm, an IPS docking joystick, bespoke helm seats with carbon fibre backrests and an integrated centre console. These cutting-edge features ensure that every journey is not just a voyage, but an experience in luxury and precision.

**Accommodation & Comfort**

The yacht can accommodate a total of six guests along with the fully appointed crew, ensuring that every passenger enjoys the highest levels of comfort and service. The thoughtfully designed interiors provide a perfect balance of luxury and functionality.

**Beach Club Experience**

The 65 Sport features a dedicated Beach Club, allowing you to have direct access to the sea, complete with a bar, fridge and barbeque. Just what you need while cruising in luxury in your private yacht. This innovative design brings the ocean closer to you, creating an immersive water experience.

**Performance & Speed**

For now, further details are scarce but with speeds going up to 35 knots, this is a yacht delivering you a mixed rush of adrenaline just as you get while driving a high-performance convertible sports car. The Sunseeker 65 Sport doesn't just cruise the waters – it conquers them.

**The Sunseeker Legacy**

Sunseeker has built its reputation on creating yachts that perfectly blend British craftsmanship with cutting-edge technology. The 65 Sport continues this tradition, offering yacht enthusiasts a vessel that is as much about the journey as it is about the destination.

Whether you're planning an intimate gathering with friends or a luxurious family getaway, the Sunseeker 65 Sport yacht promises an unforgettable experience on the water, where every detail has been carefully considered to provide the ultimate in luxury marine living.
"""

async def add_sunseeker_yacht_article():
    """Add the Sunseeker yacht article to MongoDB"""
    
    # Connect to MongoDB - use just_urbane database
    mongo_url = 'mongodb://localhost:27017'
    client = AsyncIOMotorClient(mongo_url)
    db = client.just_urbane
    
    try:
        # Generate unique ID
        article_id = str(uuid.uuid4())
        
        # Image URLs from uploaded assets
        yacht_images = [
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/3kbp8opy_credit-sun-country-yachts-6-.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/hwmm4dx3_credit-sun-country-yachts-4-.jpg"
        ]
        
        # Create article document
        article_doc = {
            "_id": article_id,
            "title": "Sunseeker 65 Sport: The Ultimate Luxury Yacht Experience",
            "slug": "sunseeker-65-sport-luxury-yacht-review",
            "category": "luxury",
            "subcategory": "yachts",
            "author_name": "Harshit Srinivas",
            "published_at": datetime.now(),
            "is_premium": False,
            "is_featured": True,
            "is_trending": True,
            "is_sponsored": False,
            "view_count": 0,
            "reading_time": 5,
            "hero_image": yacht_images[0],  # First image as hero
            "dek": "Discover the Sunseeker 65 Sport yacht - where British craftsmanship meets cutting-edge technology. With bespoke bronze finish, dedicated Beach Club, and speeds up to 35 knots, this is luxury yachting redefined.",
            "body": ARTICLE_CONTENT,
            "tags": ["sunseeker", "luxury yacht", "65 sport", "yacht review", "marine luxury", "beach club", "yacht charter", "luxury lifestyle", "bespoke yacht", "luxury marine"],
            "gallery": [
                {
                    "url": yacht_images[1],
                    "caption": "The Sunseeker 65 Sport yacht showcasing its distinctive bespoke bronze finish and elegant design",
                    "alt": "Sunseeker 65 Sport luxury yacht aerial view with bronze finish"
                }
            ],
            "meta_description": "Experience the Sunseeker 65 Sport yacht - ultimate luxury marine living with bespoke bronze finish, Beach Club, and 35-knot performance. Discover yacht excellence.",
            "meta_keywords": "sunseeker yacht, luxury yacht, 65 sport, yacht review, marine luxury, yacht charter, bespoke yacht",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        # Insert the article
        result = await db.articles.insert_one(article_doc)
        print(f"✅ Article inserted successfully with ID: {result.inserted_id}")
        print(f"✅ Article UUID: {article_id}")
        print(f"✅ Slug: {article_doc['slug']}")
        print(f"✅ Category: {article_doc['category']}/{article_doc['subcategory']}")
        
        # Check/update luxury category to include yachts subcategory
        luxury_category = await db.categories.find_one({"name": "luxury"})
        if luxury_category:
            # Check if 'yachts' subcategory exists
            subcategories = luxury_category.get("subcategories", [])
            if "yachts" not in subcategories:
                await db.categories.update_one(
                    {"name": "luxury"},
                    {"$addToSet": {"subcategories": "yachts"}}
                )
                print("✅ Added 'yachts' subcategory to luxury category")
            else:
                print("✅ 'Yachts' subcategory already exists in luxury category")
        else:
            # Create luxury category with yachts subcategory
            luxury_doc = {
                "_id": str(uuid.uuid4()),
                "name": "luxury",
                "display_name": "Luxury",
                "description": "Exclusive luxury lifestyle content including yachts, private jets, high-end automobiles, and premium experiences",
                "subcategories": ["yachts", "automobiles", "private-jets", "real-estate"],
                "created_at": datetime.now()
            }
            await db.categories.insert_one(luxury_doc)
            print("✅ Created luxury category with yachts subcategory")
        
        print("\n🎉 Sunseeker Yacht Article Integration Complete!")
        print(f"📖 Title: {article_doc['title']}")
        print(f"👤 Author: {article_doc['author_name']}")
        print(f"📂 Category: Luxury > Yachts")
        print(f"🔗 Slug: {article_doc['slug']}")
        print(f"📸 Images: {len(yacht_images)} high-quality yacht images integrated")
        print(f"⏱️ Reading Time: {article_doc['reading_time']} minutes")
        
    except Exception as e:
        print(f"❌ Error inserting article: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_sunseeker_yacht_article())