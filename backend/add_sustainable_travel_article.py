#!/usr/bin/env python3
"""
Add Sustainable Travel Article - "Travel With A Clear Conscious"
Category: Travel, Subcategory: Guides
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def add_sustainable_travel_article():
    """Add the sustainable travel article to the database"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # Article data based on RTF content
        article_data = {
            "id": str(uuid.uuid4()),
            "slug": "sustainable-travel-conscious-guide",
            "title": "Travel With A Clear Conscious",
            "dek": "You have been there and done that how about doing it a different way this time? I am not talking about making a bucket list, I am talking about travelling with a consciousness. Travelling sustainably so that your future generations can see the places you love.",
            "body": """Over the last few years there has been tremendous growth in the tourism sector. Overtourism is a term that best describes this scenario in which one tourist destination is being visited by a large number of tourists. A popular example of this is how the love lock bridge in Paris had to be taken down due to the over weight of the locks being put up by tourists visiting the monument. Many such instances have made the public adapt a more conscious way of traveling.

Sustainable travel focuses on reducing the negative impact of traveling by cutting down carbon footprints. Introducing sustainability into travel can make a lot of difference in the conservation of our natural habitat. But do you think traveling while being sustainable can be possible? Well, the answer to it, doubles up as a question in itself. And the question is, are you ready to take a sustainable trip? If your answer is yes, then be ready because it is going to be a little more difficult than you think.

Prince Harry, the Duke of Sussex recently launched an eco-travel campaign in New Zealand that was inspired by Maori Practices. Under his leadership, a non-profitable organisation, Travalyst that aims to promote sustainable travel. This website basically encourages travelers to choose sustainability for their upcoming travel journey. The first step when you visit the website will lead you to a questionnaire that asks you five steps about your plan. Also, if this isn't enough to boost your plan then regional tour operators are there to guide you for your trip.

Breaking away from your regular routine can be enjoyable, but it's crucial to consider how your plans will impact the environment. Although by no means exhaustive, we have gathered five suggestions to help you plan a trip that has a lower impact on the environment. So here's a guide that will help you plan a trip taking the conservation of your planet earth into consideration.

**Keep It Clean & Keep It Green**

Remember your responsibility towards nature and become a responsible guest. Do not litter and damage the properties. Try your best to recycle, conserve electricity and water, and engage in activities that don't significantly harm the environment and help in preserving the flora and fauna of the place you're visiting.

**Take A Sustainable Transport**

The next step comes to your plan is the method of transportation. How to get there is a crucial step to consider. Always try to opt for a bus or a train journey as they are responsible for less carbon emission. The invention of e-buses have contributed a lot into the preservation of our planet so you must go for an e-lift whenever you are traveling.

**Where To Stay?**

Searching for a sustainable stay is a task. Look for stays and hotels that recycle, have efficient waste management systems, and use renewable energy sources (solar, hydroelectric, etc). Extra points if the homestay boosts the local economy, especially if it's part of an eco-tour.

**A Return Gift**

Who doesn't love souvenirs? But buying something that is illegal or harmful such as animal hides, ivory or intoxicants isn't a great way of gifting. You wouldn't want to risk the biodiversity of the place by carrying anything that harms the environment in any way. Instead buy gifts that support the local economy such as traditional weaves, handicrafts and local delicacies.

**Where Are You Going?**

Deciding your destination is the most important step. A considerable point to keep in mind while selecting a destination is how far the place is and what mode of transportation you would require to reach there. To travel in a more environmentally friendly manner, consider participating in eco-tourism. These kinds of businesses provide vacations to locations all over the world, giving each one a high priority for sustainability.""",
            "author_name": "Komal Bhandekar",
            "author_id": "komal-bhandekar",
            "category": "travel",
            "subcategory": "culture",
            "tags": ["sustainable travel", "eco-tourism", "responsible travel", "environment", "green travel", "carbon footprint", "conservation", "prince harry", "travalyst", "eco-conscious"],
            "hero_image": "https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/uzjm9ne7_shutterstock_1982804408-_Converted_.jpg",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/4oo2ga6h_shutterstock_1352447456.jpg",
                "https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/j394uw8l_shutterstock_2093043016.jpg",
                "https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/gvn3ryam_shutterstock_644325913.jpg",
                "https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/va4trn0r_shutterstock_572611777.jpg"
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
        
        # Validate category and subcategory exist
        category = await db.categories.find_one({"slug": article_data["category"]})
        if not category:
            print(f"❌ Error: Category '{article_data['category']}' does not exist")
            return False
            
        if article_data["subcategory"] not in category.get("subcategories", []):
            print(f"❌ Error: Subcategory '{article_data['subcategory']}' not found in '{article_data['category']}'")
            print(f"Available subcategories: {', '.join(category.get('subcategories', []))}")
            return False
        
        # Check if article already exists
        existing_article = await db.articles.find_one({"slug": article_data["slug"]})
        if existing_article:
            print("Article with this slug already exists. Updating...")
            await db.articles.replace_one({"slug": article_data["slug"]}, article_data)
            print("✅ Sustainable travel article updated successfully!")
        else:
            await db.articles.insert_one(article_data)
            print("✅ Sustainable travel article added successfully!")
        
        # Verify the addition
        article_count = await db.articles.count_documents({
            "category": article_data["category"], 
            "subcategory": article_data["subcategory"]
        })
        print(f"✅ Total articles in {article_data['category']}/{article_data['subcategory']}: {article_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error adding sustainable travel article: {e}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    print("🌱 ADDING SUSTAINABLE TRAVEL ARTICLE")
    print("=" * 50)
    asyncio.run(add_sustainable_travel_article())