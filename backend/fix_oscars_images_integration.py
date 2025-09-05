#!/usr/bin/env python3
"""
Fix Oscars Fashion Article Images Integration
Properly integrate all 9 images (5 original + 4 new) into the article structure
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

async def fix_oscars_images_integration():
    """Fix the Oscars fashion article to properly include all 9 images"""
    
    # Connect to MongoDB - use just_urbane database
    mongo_url = 'mongodb://localhost:27017'
    client = AsyncIOMotorClient(mongo_url)
    db = client.just_urbane
    
    try:
        # All 9 image URLs (5 original + 4 new)
        all_images = [
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/ld7p0j41_94_AR_0795%20-%20Copy.jpg",  # Hero image
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/566l18wf_94_AR_0526.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/c0dpwc9i_94_AR_0377.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/w3vk01ug_94_AR_0903.jpg", 
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/psfl1dmc_94_AR_0615.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/geeqo4rh_94_AR_0848.jpg",  # New images start here
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/48qamudk_94_AR_0660.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/viltuaeq_94_AR_0892%20-%20Copy.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/wuo6l24b_94_AR_0665.jpg"
        ]
        
        # Updated article body with strategic image placement
        updated_body = '''The 94th Academy Awards showcased some of the most spectacular fashion moments in recent Oscar history. From stunning gowns to bold fashion statements, celebrities brought their A-game to Hollywood's biggest night. Here's our curated selection of the best dressed stars who commanded attention on the red carpet.

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

The 94th Academy Awards proved once again that the red carpet is not just about fashion—it's about making statements, celebrating individuality, and showcasing the artistry that extends beyond the films themselves. Each look told a story, reflecting the personality and creative vision of both the wearer and their styling team.'''
        
        # Find the Oscars article
        article = await db.articles.find_one({"slug": "oscars-2022-best-dressed-fashion-red-carpet"})
        
        if article:
            print(f"✅ Found Oscars article: {article.get('title')}")
            
            # Create comprehensive gallery with all images
            complete_gallery = [
                {
                    "url": all_images[1],
                    "caption": "Red carpet glamour and designer fashion at the 94th Academy Awards",
                    "alt": "Celebrity fashion and red carpet looks at the Oscars"
                },
                {
                    "url": all_images[2], 
                    "caption": "Stunning gowns and sophisticated styling from Hollywood's biggest night",
                    "alt": "Oscar fashion highlights and best dressed celebrities"
                },
                {
                    "url": all_images[3],
                    "caption": "Designer fashion and couture gowns at the Academy Awards ceremony", 
                    "alt": "Academy Awards fashion and celebrity red carpet style"
                },
                {
                    "url": all_images[4],
                    "caption": "Elite fashion moments and designer collaborations at the Oscars",
                    "alt": "High fashion and luxury designer outfits at the Academy Awards"
                },
                {
                    "url": all_images[5],
                    "caption": "Elegant red carpet fashion moments showcasing stunning designer gowns and sophisticated celebrity styling",
                    "alt": "Celebrity red carpet fashion with visible faces and designer outfits at the Academy Awards"
                },
                {
                    "url": all_images[6], 
                    "caption": "Academy Awards fashion excellence featuring luxury designer collaborations and statement accessories",
                    "alt": "Oscar fashion highlights with clear celebrity portraits and haute couture gowns"
                },
                {
                    "url": all_images[7],
                    "caption": "Hollywood glamour at its finest with impeccable styling and designer fashion statements",
                    "alt": "Red carpet elegance with visible celebrity faces and premium fashion choices"
                },
                {
                    "url": all_images[8],
                    "caption": "Sophisticated Oscar night fashion featuring bold design choices and luxury brand partnerships",
                    "alt": "Celebrity fashion portraits showcasing the best dressed looks from the Academy Awards"
                }
            ]
            
            # Also create images array for backward compatibility
            images_array = [
                {
                    "url": img_url,
                    "caption": f"Oscar red carpet fashion moment {i+1}",
                    "alt": f"Academy Awards celebrity fashion and style moment {i+1}"
                }
                for i, img_url in enumerate(all_images[1:])  # Skip hero image
            ]
            
            # Update the article with all images properly integrated
            result = await db.articles.update_one(
                {"_id": article.get("_id")},
                {
                    "$set": {
                        "hero_image": all_images[0],  # First image as hero
                        "gallery": complete_gallery,  # All 8 additional images
                        "images": images_array,       # Alternative images array
                        "body": updated_body,         # Updated content
                        "updated_at": datetime.now()
                    }
                }
            )
            
            if result.modified_count > 0:
                print(f"✅ Successfully updated article with all {len(all_images)} images")
                print(f"✅ Hero image: {all_images[0]}")
                print(f"✅ Gallery images: {len(complete_gallery)}")
                print(f"✅ Images array: {len(images_array)}")
                print(f"✅ Total image count: 1 hero + {len(complete_gallery)} gallery = {1 + len(complete_gallery)} images")
                
                # Verify the new images
                print("\n📸 New images integrated:")
                for i, img in enumerate(all_images[5:], 1):
                    print(f"   New Image {i}: {img}")
                
            else:
                print("❌ Failed to update article")
        else:
            print("❌ Oscars article not found!")
            
    except Exception as e:
        print(f"❌ Error updating article: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(fix_oscars_images_integration())