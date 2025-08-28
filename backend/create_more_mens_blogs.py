"""
Create additional men's fashion blogs for the men's section
"""

import os
import sys
import uuid
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
import random

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

def create_mens_content():
    """Create premium men's fashion content"""
    
    # Get authors
    authors = list(db.authors.find())
    if not authors:
        print("No authors found")
        return
    
    # Premium men's images
    mens_images = [
        "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1NjM4NjA4Mnww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1NjM4NjA4Mnww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1609195994377-dbffba3a4eb4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1NjM4NjA4Mnww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1601925679410-490af76c7043?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxtZW4lMjBncm9vbWluZ3xlbnwwfHx8fDE3NTYzODYxMDd8MA&ixlib=rb-4.1.0&q=85",
        "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg",
        "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg"
    ]
    
    # Men's fashion articles
    mens_articles = [
        {
            "title": "The Ultimate Guide to Building a Capsule Wardrobe",
            "dek": "Essential pieces every stylish man needs for a versatile, sophisticated wardrobe",
            "body": """Building a capsule wardrobe is the secret to effortless style and confident dressing. The modern gentleman understands that having fewer, higher-quality pieces creates more outfit possibilities than a closet full of trend-driven purchases.

**The Foundation: Essential Suits**

Every man needs at least two well-tailored suits: a charcoal gray for business and formal occasions, and a navy blue for versatility. These should fit perfectly at the shoulders—the one alteration that can't be easily fixed. Invest in quality fabrics like Super 120s wool that drape beautifully and resist wrinkles.

**Smart Casual Mastery**

The modern workplace demands smart casual expertise. A collection of premium polo shirts, well-fitted chinos, and quality leather loafers creates endless combinations. Choose neutral colors—navy, gray, white, and cream—that mix and match effortlessly.

**Accessories That Elevate**

A quality leather belt, classic watch, and understated jewelry pieces transform basic outfits into sophisticated looks. Choose accessories in consistent metal tones and leather colors to create cohesion across your wardrobe.

**Investment Pieces Worth the Price**

Focus your budget on items you'll wear frequently: a perfect white dress shirt, quality leather shoes, and a versatile blazer. These pieces should be impeccable in fit and construction, as they'll form the backbone of countless outfits.

The capsule wardrobe philosophy isn't about restriction—it's about freedom. Freedom from decision fatigue, from expensive mistakes, and from the anxiety of having nothing to wear despite a full closet.""",
            "category": "fashion",
            "subcategory": "men",
            "tags": ["men", "wardrobe", "style", "capsule", "essentials"],
            "is_premium": False,
            "is_featured": True,
            "hero_image": mens_images[0]
        },
        {
            "title": "Grooming Essentials: The Modern Man's Daily Routine",
            "dek": "A comprehensive guide to building an effective grooming routine that commands respect",
            "body": """Professional success often depends on first impressions, and grooming plays a crucial role in how others perceive your competence and attention to detail.

**The Morning Foundation**

Start with a quality cleanser designed for your skin type, followed by a lightweight moisturizer with SPF. This two-step routine takes under two minutes but provides all-day protection and a fresh appearance.

**Strategic Shaving**

Whether you prefer clean-shaven or facial hair, consistency is key. Invest in quality tools—a good razor or trimmer, proper shaving cream, and aftershave balm. Your facial hair should always look intentional, never accidental.

**Hair That Works**

Find a hairstyle that suits your face shape and lifestyle, then maintain it religiously. A good haircut should look professional for at least three weeks. Use quality styling products sparingly—the goal is control, not obvious product buildup.

**The Power of Scent**

A signature fragrance becomes part of your personal brand. Choose something sophisticated but not overpowering—others should only notice it when they're close to you. Apply to pulse points: wrists, neck, and behind ears.

**Details That Matter**

Keep nails clean and trimmed, eyebrows groomed, and nose/ear hair under control. These details separate polished professionals from those who just "clean up okay."

Remember: grooming isn't vanity—it's strategy. In business and social situations, being well-groomed communicates that you pay attention to details and have high standards for yourself.""",
            "category": "fashion", 
            "subcategory": "men",
            "tags": ["men", "grooming", "routine", "style", "professional"],
            "is_premium": True,
            "is_trending": True,
            "hero_image": mens_images[3]
        },
        {
            "title": "Luxury Watches: Investment Pieces Every Man Should Consider",
            "dek": "How to choose timepieces that combine style, craftsmanship, and lasting value",
            "body": """A luxury watch is more than a timepiece—it's a statement of taste, an heirloom, and often a sound investment. The modern gentleman understands that the right watch communicates success without saying a word.

**Entry-Level Luxury: ₹50,000 - ₹2,00,000**

Brands like Tudor, Tissot, and Frederique Constant offer excellent entry points into luxury horology. Look for automatic movements, quality case materials, and classic designs that won't look dated in twenty years.

**Serious Investment: ₹2,00,000 - ₹10,00,000**

This range includes Omega, Breitling, and entry-level Rolex pieces. These watches hold their value well and offer the prestige of established Swiss manufacture. The Omega Speedmaster and Rolex Submariner are timeless choices.

**Heirloom Territory: ₹10,00,000+**

Patek Philippe, Vacheron Constantin, and Audemars Piguet represent the pinnacle of watchmaking. These pieces often appreciate in value and become family heirlooms passed down through generations.

**What to Look For**

Choose watches with clean, classic designs over trendy complications. A simple three-hand watch with date function serves most men better than complex chronographs they'll never use. Quality movements, case materials, and brand heritage matter more than flashy features.

**Building a Collection**

Start with a versatile dress watch, add a sports watch for casual wear, and consider a statement piece for special occasions. Each watch should serve a specific purpose in your lifestyle while maintaining your overall aesthetic.""",
            "category": "fashion",
            "subcategory": "men", 
            "tags": ["men", "watches", "luxury", "investment", "style"],
            "is_premium": False,
            "is_featured": False,
            "hero_image": mens_images[1]
        },
        {
            "title": "Men's Fragrance Guide: Finding Your Signature Scent",
            "dek": "Expert advice on choosing and wearing fragrances that enhance your personal style",
            "body": """Your fragrance is an invisible accessory that creates lasting impressions and triggers powerful memories. Choosing the right scent requires understanding fragrance families, occasions, and application techniques.

**Understanding Fragrance Categories**

Fresh scents (citrus, aquatic) work well for daytime and business settings. Woody fragrances offer sophistication and versatility. Oriental scents provide warmth and complexity for evening wear. Most men benefit from having 2-3 fragrances for different occasions.

**Application Mastery**

Apply fragrance to clean, moisturized skin at pulse points: wrists, neck, and behind ears. Never rub your wrists together—it breaks down the fragrance molecules. Two to three sprays are sufficient; your scent should be discovered, not announced.

**Seasonal Considerations**

Light, fresh fragrances work better in warm weather, while richer, spicier scents suit cooler months. Your signature scent can remain constant, but consider lighter application in summer and stronger projection in winter.

**Building Your Collection**

Start with one versatile fragrance that works for both business and social occasions. Add a fresh daytime scent and a sophisticated evening option as your collection develops. Quality over quantity—better to have three excellent fragrances than ten mediocre ones.""",
            "category": "fashion",
            "subcategory": "men",
            "tags": ["men", "fragrance", "grooming", "style", "scent"],
            "is_premium": True,
            "is_trending": False,
            "hero_image": mens_images[2]
        }
    ]
    
    # Create articles
    for i, template in enumerate(mens_articles):
        author = random.choice(authors)
        
        article = {
            "_id": str(uuid.uuid4()),
            "title": template["title"],
            "slug": template["title"].lower().replace(" ", "-").replace(":", "").replace(",", "")[:50],
            "dek": template["dek"],
            "body": template["body"],
            "hero_image": template["hero_image"],
            "gallery": [],
            "category": template["category"],
            "subcategory": template["subcategory"],
            "tags": template["tags"],
            "author_id": author["_id"],
            "author_name": author["name"],
            "is_premium": template.get("is_premium", False),
            "is_featured": template.get("is_featured", False),
            "is_trending": template.get("is_trending", False),
            "is_sponsored": False,
            "reading_time": len(template["body"].split()) // 200 + random.randint(3, 6),
            "published_at": datetime.utcnow() - timedelta(hours=random.randint(1, 48)),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "view_count": random.randint(1200, 5000)
        }
        
        db.articles.insert_one(article)
        print(f"✅ Created: {article['title']}")
    
    print(f"\n🎉 Created {len(mens_articles)} premium men's articles!")

if __name__ == "__main__":
    create_mens_content()