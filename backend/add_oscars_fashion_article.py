#!/usr/bin/env python3
"""
Add Oscars Best Dressed Fashion Article to MongoDB Database
Fashion Category / Women Subcategory
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

# Article content extracted and cleaned from RTF
ARTICLE_CONTENT = """
The 94th Academy Awards showcased some of the most spectacular fashion moments in recent Oscar history. From stunning gowns to bold fashion statements, celebrities brought their A-game to Hollywood's biggest night. Here's our curated selection of the best dressed stars who commanded attention on the red carpet.

**Blue Hues - Megan Thee Stallion**

The famed American rapper and "Sweetest Pie" singer Megan Thee Stallion walked the red carpet in a metallic blue strapless gown that was sculpted for her. The plunging neckline number hugged her hourglass figure and featured a single waist cut-out with an asymmetrical hem. The outfit bore a ruffled pattern from her hips that gave it a substantial touch and opened into a floor-sweeping train.

**Ethereal Beauty - Zendaya**

Rising star Zendaya owned the red carpet giving an ode to Sharon Stone's 1998 Oscar get-up. The Euphoria actor drew glances with her micro Valentino haute couture button-up and silver sequined skirt, designed by her storyteller stylist Law Roach. The look was a masterclass in modern elegance with a nostalgic twist.

**Darkness Reimagined - Billie Eilish**

Haunting, black and unmissable, Billie Eilish dramatized the event with designer Alessandro Michele's off-shoulder black ruffle Gucci gown which came with a floor-sweeping long train. Moreover, she matched her hair with the outfit, styling it into bangs curling outwards. The dramatic silhouette perfectly captured her unique aesthetic.

**Punk Princess - Kristen Stewart**

The best actor nominee for her role in "Spencer" about Princess Diana wore a custom Chanel black satin shorts suit that gave two manicured fingers to every traditional tulle dress at Hollywood's big night. Stewart paired her suit with Chanel Fine Jewelry ganse noir spinel necklace for its unique and sparkly spin on the tie.

**Suave Manliness - Timothée Chalamet**

Timothée's risqué fit proved that fashion and timeless design shouldn't be bound by gender. Chalamet's sequined black suit by Louis Vuitton felt particularly fresh given it was plucked from Nicolas Ghesquière's spring 2022 womenswear collection. The two-piece was accentuated by Cartier's layered necklaces and white gold rings.

**Spiderman Wonderboy - Andrew Garfield**

The Spiderman wonderboy and equally talented actor, Andrew Garfield was nominated as best actor for his role in "Tick, Tick... Boom!" Opting for Saint Laurent's burgundy velvet blazer, black silky shirt and black gabardine pants, accessorizing the look with an Omega watch, Garfield rocked the night.

**The Showstopper - Jason Momoa**

The well-adored and hulking Dune actor Jason Momoa walked the red carpet wearing a chic upcycled tuxedo from Savile Row, teamed with a bowtie. He styled his look with statement rings, wayfarer glasses and a blue and yellow pocket square in support of Ukraine. He also styled his hair into a French braid, binding it up with a pink scrunchie.

**Pearly Hues - Nikolaj Coster-Waldau**

The Game of Thrones actor Nikolaj Coster-Waldau and executive producer for Best Animated Feature Film nominee "Flee" was seen donning a cream-colored tuxedo at the 2022 Academy Awards, bringing sophisticated elegance to the red carpet.

The 94th Academy Awards proved once again that the red carpet is not just about fashion—it's about making statements, celebrating individuality, and showcasing the artistry that extends beyond the films themselves. Each look told a story, reflecting the personality and creative vision of both the wearer and their styling team.
"""

async def add_oscars_fashion_article():
    """Add the Oscars fashion article to MongoDB"""
    
    # Connect to MongoDB - use just_urbane database
    mongo_url = 'mongodb://localhost:27017'
    client = AsyncIOMotorClient(mongo_url)
    db = client.just_urbane  # This is the correct database
    
    try:
        # Generate unique ID
        article_id = str(uuid.uuid4())
        
        # Image URLs from uploaded assets
        uploaded_images = [
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/ld7p0j41_94_AR_0795%20-%20Copy.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/566l18wf_94_AR_0526.jpg", 
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/c0dpwc9i_94_AR_0377.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/w3vk01ug_94_AR_0903.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/psfl1dmc_94_AR_0615.jpg"
        ]
        
        # Create article document
        article_doc = {
            "_id": article_id,
            "title": "All Glam at the 94th Academy Awards: Best Dressed Celebrities",
            "slug": "oscars-2022-best-dressed-fashion-red-carpet",
            "category": "fashion",
            "subcategory": "women",
            "author_name": "Rugved Marathe",
            "published_at": datetime.now(),
            "is_premium": False,
            "is_featured": True,
            "is_trending": True,
            "is_sponsored": False,
            "view_count": 0,
            "reading_time": 7,
            "hero_image": uploaded_images[0],  # First image as hero
            "dek": "From Zendaya's ethereal elegance to Billie Eilish's dramatic Gucci gown, discover the most stunning fashion moments from the 94th Academy Awards red carpet.",
            "body": ARTICLE_CONTENT,
            "tags": ["oscars", "red carpet", "fashion", "celebrity style", "academy awards", "designer gowns", "hollywood fashion", "best dressed", "2022 oscars"],
            "gallery": [
                {
                    "url": uploaded_images[1],
                    "caption": "Red carpet glamour and designer fashion at the 94th Academy Awards",
                    "alt": "Celebrity fashion and red carpet looks at the Oscars"
                },
                {
                    "url": uploaded_images[2], 
                    "caption": "Stunning gowns and sophisticated styling from Hollywood's biggest night",
                    "alt": "Oscar fashion highlights and best dressed celebrities"
                },
                {
                    "url": uploaded_images[3],
                    "caption": "Designer fashion and couture gowns at the Academy Awards ceremony", 
                    "alt": "Academy Awards fashion and celebrity red carpet style"
                },
                {
                    "url": uploaded_images[4],
                    "caption": "Elite fashion moments and designer collaborations at the Oscars",
                    "alt": "High fashion and luxury designer outfits at the Academy Awards"
                }
            ],
            "meta_description": "Explore the most stunning fashion moments from the 94th Academy Awards. From Zendaya's Valentino masterpiece to Timothée Chalamet's gender-fluid Louis Vuitton look.",
            "meta_keywords": "oscars fashion, academy awards red carpet, celebrity style, designer gowns, hollywood fashion, 2022 oscars, best dressed",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        # Insert the article
        result = await db.articles.insert_one(article_doc)
        print(f"✅ Article inserted successfully with ID: {result.inserted_id}")
        print(f"✅ Article UUID: {article_id}")
        print(f"✅ Slug: {article_doc['slug']}")
        print(f"✅ Category: {article_doc['category']}/{article_doc['subcategory']}")
        
        # Check/update fashion category to include women subcategory
        fashion_category = await db.categories.find_one({"name": "fashion"})
        if fashion_category:
            # Check if 'women' subcategory exists
            subcategories = fashion_category.get("subcategories", [])
            if "women" not in subcategories:
                await db.categories.update_one(
                    {"name": "fashion"},
                    {"$addToSet": {"subcategories": "women"}}
                )
                print("✅ Added 'women' subcategory to fashion category")
            else:
                print("✅ 'Women' subcategory already exists in fashion category")
        else:
            # Create fashion category with both men and women subcategories
            fashion_doc = {
                "_id": str(uuid.uuid4()),
                "name": "fashion",
                "display_name": "Fashion",
                "description": "Latest fashion trends, style guides, and wardrobe essentials for men and women",
                "subcategories": ["men", "women", "accessories"],
                "created_at": datetime.now()
            }
            await db.categories.insert_one(fashion_doc)
            print("✅ Created fashion category with women subcategory")
        
        print("\n🎉 Oscars Fashion Article Integration Complete!")
        print(f"📖 Title: {article_doc['title']}")
        print(f"👤 Author: {article_doc['author_name']}")
        print(f"📂 Category: Fashion > Women")
        print(f"🔗 Slug: {article_doc['slug']}")
        print(f"📸 Images: {len(uploaded_images)} high-quality images integrated")
        print(f"⏱️ Reading Time: {article_doc['reading_time']} minutes")
        
    except Exception as e:
        print(f"❌ Error inserting article: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_oscars_fashion_article())