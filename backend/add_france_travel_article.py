#!/usr/bin/env python3
"""
Add France Travel Article - "When In France"
Category: Travel, Subcategory: Adventure
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def add_france_travel_article():
    """Add the France travel article to the database"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # Article data based on RTF content
        article_data = {
            "id": str(uuid.uuid4()),
            "slug": "when-in-france-travel-destinations",
            "title": "When In France",
            "dek": "Summer in Paris! Sounds dreamy, right? Turns out that Eiffel Tower is not the only destination you can visit in the city of love. Keep reading to discover multiple tourist destinations in France.",
            "body": """Mesmerised by the beauty of the land, France is one of the most popular tourist destinations in the world. A country with fine wine, delicious food, and some of the most beautiful destinations on earth, there is only so much one can take in. From the world-class art and architecture, beautiful beaches, medieval urban centres to the dynamic cities, Renaissance châteaux, incredible gastronomy, expansive vineyards, spectacular landscapes, and the Pyrenees and The Alps, there are innumerable breath-taking scenes in L'Hexagone.

There is more than enough to keep interested travellers occupied, from rolling vineyards and tumbling valleys to towering sand dunes and magnificent villages. Choosing places to visit in France can be confusing because there is so much to see and do. You will definitely want to end up visiting every destination. So, to narrow down your options, here are our picks to add in your travel bucket list.

**The Island Of Corsica**

Corsica's spectacular coastal scenery, unspoiled woods, and snowy peaks all contribute to the island's rough and natural appeal. Beautiful beaches, calm bays, picturesque fishing towns, and busy seaside cities along the island's coastline, while the inland slopes are covered with old villages where time seems to have stopped.

It has a gorgeous yet wild appeal, with stylish seaside cities, steep granite peaks, and unspoiled forests. It is also a destination for snorkelling and scuba diving, with 1,000 kilometres of lovely blue shoreline to uncover. You might come across much free-roaming wildlife such as pigs, cows, and goats. But there is nothing to worry about as there are no harmful snakes to disrupt your vacation.

**Paris and Versailles**

It is impossible to not visit Paris when in France. Paris is on top of the to-visit list among other destinations. A perfect kiss, the perfect picture before the Eiffel Tower is a dream. Paris is a major European centre known for its splendour and joie de vivre, with architectural wonders such as the Eiffel Tower and Notre-Dame Cathedral.

Paris' evocative medieval neighbourhoods and beautiful boulevards are among the city's other attractions. The UNESCO-listed Château de Versailles is a short rail trip from Paris. This lavish 17th-century palace, built for Louis XIV (the "Sun King"), is a testimony to the French monarch's greatness and ultimate power.

**The Land of Lavender: Provence**

Provence enjoys beautiful Mediterranean sunshine for most part of the year. This rural location has a raw, earthy look, as though it has been unaffected by the modern world. It is one of the most beautiful and aromatic destinations to visit in France every summer, thanks to the nearly unending waves of lavender fields.

So basically, you get to visit, stand, or even run through fields that have a lavender scent. No wonder painters found inspiration for bright works of art in this dreamy environment. The monks of the abbey and the local honeybees tend to these lovely lavender fields. Visitors are welcome to stay with them for a peaceful spiritual retreat.

**Mont Saint-Michel**

The Normandy region's centrepiece, Mont Saint-Michel, is a peaceful environment of apple orchards, forests, and cow pastures. This must-see tourist site is at the top of a long list of Normandy travel attractions that includes spectacular views like medieval castles and picturesque towns.

The tiny, curving alleyways and charming wooden cottages that lead up to it add to the romance. In fact, the breathtaking landscape inspired Rapunzel's Tower and the Kingdom of Corona in Disney's Tangled. In the 8th century, the magnificent island village functioned as a major Christian pilgrimage centre. It is now a UNESCO World Heritage Site that receives over three million visitors each year.

**Loire Valley**

The Loire Valley, also known as the "Garden of France," was formerly the refuge of French monarchy and nobility. Today, however, it is one of France's most iconic tourist destinations, available to all. The Loire Valley spans for 175 miles along the Loire River, winding its way past some of France's most attractive communities, including Amboise, where Leonardo da Vinci spent his final years.

The valley is also famous for its widely popular wines. In fact, several local winemakers invite tourists for a tour through their cellar and wine-tasting. Due to the obvious richness of flower gardens, fruit orchards, and vineyards, the Loire Valley is called the "Garden of France". The Cher, Loiret, Eure and Loire rivers replenish the valley, making it lush and fruitful.

**Strasbourg**

Strasbourg is the meeting point between France and Germany. Strasbourg, the capital city of the Alsace region, is located on the border between the two countries. It is home to the European Parliament as well as a slew of other important European institutions, including the European Court of Human Rights and the Council of Europe.

Grande Ile, the city's historic centre, is a must-see. The centre offers many museums and striking attractions, such as the stunning Gothic cathedral, which features pink sandstone, intricate carvings, and a 300-year-old working astrological clock.""",
            "author_name": "Amisha Shirgave",
            "author_id": "amisha-shirgave",
            "category": "travel",
            "subcategory": "adventure",
            "tags": ["france", "travel", "paris", "corsica", "provence", "mont-saint-michel", "loire-valley", "strasbourg", "destinations", "adventure", "europe"],
            "hero_image": "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/asfm7icv_Paris%20%283%29.jpg",
            "gallery": [
                "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/flk6kpul_corsica.jpg",
                "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/97rlqsxn_Loire%20valley%202.jpg",
                "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/3emjw578_St.%20Micheal.jpg",
                "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/99v653zg_Strasbourg.jpg"
            ],
            "published_at": datetime.now(),
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "is_featured": True,
            "is_trending": True,
            "is_premium": False,
            "reading_time": 6,
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
            print("✅ France travel article updated successfully!")
        else:
            await db.articles.insert_one(article_data)
            print("✅ France travel article added successfully!")
        
        # Verify the addition
        article_count = await db.articles.count_documents({
            "category": article_data["category"], 
            "subcategory": article_data["subcategory"]
        })
        print(f"✅ Total articles in {article_data['category']}/{article_data['subcategory']}: {article_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error adding France travel article: {e}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    print("🇫🇷 ADDING FRANCE TRAVEL ARTICLE")
    print("=" * 50)
    asyncio.run(add_france_travel_article())