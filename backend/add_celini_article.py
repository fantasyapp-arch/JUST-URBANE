#!/usr/bin/env python3

import os
import sys
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

def add_celini_article():
    """Add the Celini Food Review article to the database"""
    
    # Check if article already exists
    existing_article = db.articles.find_one({"slug": "celini-food-review-mumbai"})
    if existing_article:
        print("Celini article already exists in database!")
        return
    
    # Article data
    article_data = {
        "_id": str(uuid.uuid4()),
        "title": "A bit of Italiano at the newly re-launched Celini",
        "slug": "celini-food-review-mumbai",
        "dek": "Celini feels like Mumbai's answer to the marvelous chef Franco's welcome note that is one which punches well above its weight. It's all things Italian at Celini!",
        "body": """\"Nowness in a little over a dozen dishes\". Somewhere I had read these words, describing a new restaurant entrant in some part of the world, for its menu. And I could co-relate it to this restaurant's menu when I skimmed through it.

Menus can do it. Capture a moment in time. Celini, Mumbai's classic fine dining Italian relaunched in time when the economy resurrects and ups its pace. It's all very 2022! Smart, keenly priced, ingredient led, it's a menu that understands our palate before even serving it to us at the table.

It's an amalgamation of food and a crisp conceptual proposition. Helmed by Chef Gianfranco Tuttolani, hailing from the provincial capital of Chieti, flavours of the Abruzzi province is brought to the fore through his masterful culinary expertise. With accolades from the Italian Chef Federation, A.C.V.S. (Villa Santa Maria Chef Association) and ambassadorship across various fronts, his culinary prowess extended multifield when he represented Italian cuisine at the 5th Italian Cuisine in the World Forum in Greece.

As Chef Gianfranco takes on his next assignment as Head Chef of Grand Hyatt Mumbai's Italian Signature restaurant Celini, he states, \"It is a great pleasure to take up my new role as head Chef of Celini at Grand Hyatt Mumbai Hotel and Residences. It will be exciting to implement my skills and knowledge, and bring to the people of Mumbai, authentic and traditional flavours from my home country-Italy.\"

And it's not just the food; it's also the befitting setting we are ambiently marked with. There's the pared-back art inspired décor, slate grey ceiling and white walls adorned by masterpieces of installations. And of course, the end to end open kitchen. Not to miss are its artefacts, one such being Yogadakshinamurti, an installation that symbolises the movements within our bodies, the sun and the constellations, thus personifying immeasurable celestial bodies!

All these also resonate with the Italian fare that conjured before our eyes at the table with a melange of flavours of the Millefeuille, Spaghetti Aglio Olio e Peperoncino, Mushroom Ravioli, Caprese and Prosciutto, Ossobuco, Seabass Livornese and Panna Cotta to name a few.

It's also the house for Celini's all-time favourite wood-fired pizzas, pastas and risotto, and that have been a key highlight of the restaurant since inception paired with an exhaustive list of distinctively refreshing Italian red and white wines.

Celini feels like Mumbai's answer to the marvelous chef Franco's welcome note that is one which punches well above its weight. With it being a definite must-visit, we endorse it for its authenticity and all things Italian!""",
        "hero_image": "https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/oaskh2yo_Celini.JPG",
        "gallery": [
            "https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/atuk7005_Spaghetti%20Aglio%2C%20Olio%20e%20Peperoncino.jpg",
            "https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/n51l3mul_Caprese%20and%20Prosciutto.jpg"
        ],
        "category": "food",
        "subcategory": "food-review",
        "tags": ["Italian Cuisine", "Mumbai Restaurants", "Grand Hyatt", "Fine Dining", "Chef Gianfranco", "Restaurant Review", "Celini"],
        "author_id": "team-urbane-001",
        "author_name": "Team Urbane",
        "is_premium": False,  # FREE CONTENT
        "is_featured": True,
        "is_trending": False,
        "is_sponsored": False,
        "reading_time": 6,
        "published_at": datetime(2022, 6, 15),  # June 2022
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "view_count": 0
    }
    
    # Insert article
    db.articles.insert_one(article_data)
    print(f"✅ Added Celini Food Review article: {article_data['title']}")
    print(f"   - Category: {article_data['category']}")
    print(f"   - Subcategory: {article_data['subcategory']}")
    print(f"   - Author: {article_data['author_name']}")
    print(f"   - Slug: {article_data['slug']}")

def add_food_review_subcategory():
    """Add Food Review subcategory if it doesn't exist"""
    
    # Check if food category exists
    food_category = db.categories.find_one({"slug": "food"})
    if not food_category:
        # Create food category
        food_category_data = {
            "_id": str(uuid.uuid4()),
            "name": "Food",
            "slug": "food",
            "description": "Discover culinary excellence with expert restaurant reviews, chef profiles, recipe guides, and food trends that celebrate flavor, creativity, and culture.",
            "hero_image": "https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/oaskh2yo_Celini.JPG",
            "created_at": datetime.utcnow()
        }
        db.categories.insert_one(food_category_data)
        print(f"✅ Added Food category")
    else:
        print(f"✅ Food category already exists")

def verify_data():
    """Verify the added data"""
    print("\n--- Verification ---")
    
    # Check article
    celini_article = db.articles.find_one({"slug": "celini-food-review-mumbai"})
    if celini_article:
        print(f"✅ Article found: {celini_article['title']}")
        print(f"   - ID: {celini_article['_id']}")
        print(f"   - Category: {celini_article['category']}")
        print(f"   - Subcategory: {celini_article['subcategory']}")
    else:
        print("❌ Article not found!")
    
    # Check category
    food_category = db.categories.find_one({"slug": "food"})
    if food_category:
        print(f"✅ Food category found: {food_category['name']}")
    else:
        print("❌ Food category not found!")
    
    # Count total articles in food category
    food_articles_count = db.articles.count_documents({"category": "food"})
    print(f"✅ Total articles in Food category: {food_articles_count}")

if __name__ == "__main__":
    try:
        print("🍽️  Adding Celini Food Review Article...")
        add_food_review_subcategory()
        add_celini_article()
        verify_data()
        print("\n🎉 Successfully added Celini food review article!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        client.close()