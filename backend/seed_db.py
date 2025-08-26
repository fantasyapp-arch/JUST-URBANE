"""
Database seeding script for Just Urbane magazine
Populates MongoDB with sample articles, categories, authors, etc.
"""

import os
import sys
import uuid
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
import random

# Add parent directory to path to import from server.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

def clear_database():
    """Clear existing data"""
    collections = ['articles', 'categories', 'authors', 'reviews', 'magazine_issues', 'travel_destinations']
    for collection in collections:
        db[collection].delete_many({})
    print("Database cleared.")

def seed_categories():
    """Create categories"""
    categories = [
        {
            "_id": str(uuid.uuid4()),
            "name": "Style",
            "slug": "style",
            "description": "Fashion trends, designer insights, and timeless style advice for the modern gentleman",
            "hero_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Grooming",
            "slug": "grooming",
            "description": "Personal care, skincare, and grooming essentials for refined living",
            "hero_image": "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Culture",
            "slug": "culture",
            "description": "Arts, music, literature, and cultural movements shaping our world",
            "hero_image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Watches",
            "slug": "watches",
            "description": "Horological excellence, timepiece reviews, and watchmaking craftsmanship",
            "hero_image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Tech",
            "slug": "tech",
            "description": "Latest gadgets, innovations, and technology trends for the luxury lifestyle",
            "hero_image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Fitness",
            "slug": "fitness",
            "description": "Health, wellness, and fitness for optimal performance and vitality",
            "hero_image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Travel",
            "slug": "travel",
            "description": "Luxury destinations, exclusive experiences, and travel insights",
            "hero_image": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Entertainment",
            "slug": "entertainment",
            "description": "Movies, music, celebrities, and entertainment industry insights",
            "hero_image": "https://images.unsplash.com/photo-1489599735225-8e6c9b2b8e6e?w=800",
            "created_at": datetime.utcnow()
        }
    ]
    
    db.categories.insert_many(categories)
    print(f"Seeded {len(categories)} categories.")
    return categories

def seed_authors():
    """Create authors"""
    authors = [
        {
            "_id": str(uuid.uuid4()),
            "name": "Rahul Sharma",
            "slug": "rahul-sharma",
            "bio": "Fashion editor and style consultant with over 10 years in luxury lifestyle journalism.",
            "headshot": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
            "social_links": {
                "instagram": "@rahulsharma_style",
                "twitter": "@rahulstyle"
            },
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Priya Nair",
            "slug": "priya-nair",
            "bio": "Culture and arts correspondent covering contemporary Indian art, music, and literature.",
            "headshot": "https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=300",
            "social_links": {
                "instagram": "@priyanair_culture",
                "twitter": "@priyanair"
            },
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Vikram Singh",
            "slug": "vikram-singh",
            "bio": "Technology journalist and gadget reviewer with expertise in luxury tech and innovation.",
            "headshot": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
            "social_links": {
                "instagram": "@vikramtech",
                "twitter": "@vikramsingh_tech"
            },
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Ananya Krishnan",
            "slug": "ananya-krishnan",
            "bio": "Travel writer and luxury lifestyle expert covering premium destinations worldwide.",
            "headshot": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
            "social_links": {
                "instagram": "@ananyatravels",
                "twitter": "@ananyak_travel"
            },
            "created_at": datetime.utcnow()
        }
    ]
    
    db.authors.insert_many(authors)
    print(f"Seeded {len(authors)} authors.")
    return authors

def seed_articles(categories, authors):
    """Create sample articles"""
    articles = []
    
    # Sample article templates
    article_templates = [
        {
            "title": "The Art of Sustainable Fashion: Luxury Brands Leading the Change",
            "dek": "How premium fashion houses are embracing sustainability without compromising on style",
            "body": """In an era where environmental consciousness meets luxury, leading fashion houses are redefining what it means to be both sustainable and stylish. From Stella McCartney's innovative vegan leather to Gucci's carbon-neutral initiatives, the luxury fashion industry is undergoing a revolutionary transformation.

The shift towards sustainability in luxury fashion isn't just about environmental responsibility—it's about creating timeless pieces that transcend seasonal trends. Brands like Brunello Cucinelli have long championed the philosophy of creating clothing that lasts decades, not just seasons.

This movement represents more than just a trend; it's a fundamental shift in how we perceive luxury. True luxury now lies in the knowledge that your investment piece is crafted with respect for both artisanal traditions and environmental stewardship.""",
            "category": "style",
            "tags": ["sustainability", "luxury", "fashion", "environment"],
            "is_premium": True,
            "is_featured": True,
            "hero_image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
        },
        {
            "title": "The Renaissance of Indian Classical Music in Contemporary Culture",
            "dek": "Young artists are bringing traditional ragas to modern audiences with innovative collaborations",
            "body": """Classical Indian music is experiencing an unprecedented renaissance, with young virtuosos bridging the gap between ancient traditions and contemporary sensibilities. Artists like Anoushka Shankar and Niladri Kumar are creating fusion masterpieces that honor the depth of classical ragas while appealing to global audiences.

This revival isn't confined to concert halls—streaming platforms report a 300% increase in classical Indian music consumption among millennials. The integration of traditional instruments like the sitar and tabla with electronic music has created entirely new genres.

The movement represents a cultural awakening, where the younger generation seeks authentic connections to their heritage while expressing themselves through modern mediums.""",
            "category": "culture",
            "tags": ["music", "tradition", "fusion", "india"],
            "is_trending": True,
            "hero_image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200"
        },
        {
            "title": "Swiss Watchmaking: The Timeless Art of Precision",
            "dek": "Inside the workshops where master craftsmen create horological masterpieces that define luxury",
            "body": """In the valleys of Switzerland, master watchmakers continue a tradition spanning centuries, crafting timepieces that represent the pinnacle of mechanical excellence. Each watch requires hundreds of components, assembled with precision that can only be achieved through years of dedicated training.

The philosophy of Swiss watchmaking extends beyond mere timekeeping—it's about creating mechanical poetry. Brands like Patek Philippe and Vacheron Constantin don't just make watches; they create heirlooms that pass through generations.

Understanding the intricacies of complications like minute repeaters, perpetual calendars, and tourbillons reveals why these timepieces command such reverence in the world of luxury.""",
            "category": "watches",
            "tags": ["swiss", "luxury", "craftsmanship", "heritage"],
            "is_premium": True,
            "hero_image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200"
        },
        {
            "title": "The Future of Luxury Tech: AI Meets Artisanal Craftsmanship",
            "dek": "How artificial intelligence is revolutionizing luxury goods without losing the human touch",
            "body": """The intersection of artificial intelligence and luxury craftsmanship is creating unprecedented possibilities in the luxury goods sector. From AI-assisted design in haute couture to smart materials in luxury automobiles, technology is enhancing rather than replacing human artistry.

Luxury brands are leveraging AI for personalization at an unprecedented scale. Rolls-Royce uses machine learning to predict maintenance needs, while Louis Vuitton employs AI to create bespoke leather goods tailored to individual preferences.

This technological revolution maintains the essence of luxury—exclusivity, quality, and personal connection—while adding layers of innovation that were unimaginable just a decade ago.""",
            "category": "tech",
            "tags": ["AI", "luxury", "innovation", "future"],
            "is_trending": True,
            "hero_image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200"
        },
        {
            "title": "Wellness Retreats: The New Status Symbol",
            "dek": "Why luxury wellness experiences have become the ultimate expression of modern living",
            "body": """In an age where wellness has become synonymous with wealth, luxury wellness retreats represent the new frontier of status symbols. From Ayurvedic treatments in Kerala to biohacking centers in Switzerland, affluent individuals are investing in experiences that promise transformation.

These retreats go beyond spa treatments—they offer comprehensive lifestyle redesign. Programs at destinations like SHA Wellness Clinic or The Ranch Malibu combine cutting-edge medical technology with ancient healing practices.

The shift represents a fundamental change in how we perceive luxury: from material accumulation to experiential enrichment and personal optimization.""",
            "category": "fitness",
            "tags": ["wellness", "luxury", "health", "lifestyle"],
            "is_premium": True,
            "hero_image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200"
        },
        {
            "title": "Hidden Gems: Luxury Destinations Off the Beaten Path",
            "dek": "Discover exclusive retreats and experiences that redefine luxury travel",
            "body": """Beyond the traditional luxury destinations lies a world of hidden gems that offer authentic experiences for the discerning traveler. From private islands in the Maldives to exclusive safari lodges in Kenya, these destinations provide unparalleled access to natural beauty and cultural authenticity.

The new luxury travel paradigm prioritizes transformation over mere relaxation. Destinations like Amanzoe in Greece or Amangiri in Utah offer immersive experiences that connect guests with local culture and pristine environments.

These properties understand that true luxury lies not in ostentatious displays but in thoughtful service, environmental stewardship, and genuine connection to place.""",
            "category": "travel",
            "tags": ["luxury", "destinations", "exclusive", "travel"],
            "is_featured": True,
            "hero_image": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200"
        }
    ]
    
    # Create articles with variety
    for i, template in enumerate(article_templates):
        author = random.choice(authors)
        category_name = template["category"]
        
        article = {
            "_id": str(uuid.uuid4()),
            "title": template["title"],
            "slug": template["title"].lower().replace(" ", "-").replace(":", "").replace(",", "")[:50],
            "dek": template["dek"],
            "body": template["body"],
            "hero_image": template["hero_image"],
            "gallery": [],
            "category": category_name,
            "tags": template["tags"],
            "author_id": author["_id"],
            "author_name": author["name"],
            "is_premium": template.get("is_premium", False),
            "is_featured": template.get("is_featured", False),
            "is_trending": template.get("is_trending", False),
            "is_sponsored": False,
            "reading_time": random.randint(3, 8),
            "published_at": datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "view_count": random.randint(100, 5000)
        }
        articles.append(article)
    
    # Add more articles to fill categories
    additional_titles = [
        "The Art of Minimalist Living",
        "Grooming Essentials for the Modern Gentleman",
        "Contemporary Art in Indian Galleries",
        "Investment Timepieces: A Collector's Guide",
        "Smart Homes for Luxury Living",
        "Mental Health and Executive Performance",
        "Boutique Hotels Around the World",
        "The Rise of Indian Cinema Globally"
    ]
    
    for i, title in enumerate(additional_titles):
        author = random.choice(authors)
        category = random.choice(categories)
        
        article = {
            "_id": str(uuid.uuid4()),
            "title": title,
            "slug": title.lower().replace(" ", "-").replace(":", ""),
            "dek": f"An insightful exploration of {title.lower()} and its impact on modern lifestyle.",
            "body": f"This article explores the nuances of {title.lower()}, providing readers with valuable insights and practical advice. The content delves deep into the subject matter, offering expert perspectives and contemporary relevance.",
            "hero_image": f"https://images.unsplash.com/photo-{1500000000000 + i * 1000000}?w=1200",
            "gallery": [],
            "category": category["slug"],
            "tags": ["lifestyle", "modern", "luxury"],
            "author_id": author["_id"],
            "author_name": author["name"],
            "is_premium": random.choice([True, False]),
            "is_featured": i < 3,  # First 3 are featured
            "is_trending": i < 2,   # First 2 are trending
            "is_sponsored": False,
            "reading_time": random.randint(2, 6),
            "published_at": datetime.utcnow() - timedelta(days=random.randint(0, 60)),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "view_count": random.randint(50, 2000)
        }
        articles.append(article)
    
    db.articles.insert_many(articles)
    print(f"Seeded {len(articles)} articles.")
    return articles

def seed_reviews():
    """Create sample product reviews"""
    reviews = [
        {
            "_id": str(uuid.uuid4()),
            "title": "Apple Watch Ultra 2: The Ultimate Luxury Smartwatch",
            "slug": "apple-watch-ultra-2-review",
            "product": "Apple Watch Ultra 2",
            "brand": "Apple",
            "score": 9.2,
            "pros": ["Premium titanium build", "Exceptional battery life", "Comprehensive health tracking", "Bright Always-On display"],
            "cons": ["High price point", "Limited customization", "Size may be too large for some"],
            "specs": {
                "Display": "49mm Always-On Retina",
                "Material": "Titanium",
                "Battery Life": "Up to 36 hours",
                "Water Resistance": "100m",
                "Price": "₹89,900"
            },
            "price_inr": 89900,
            "affiliate_links": {
                "Apple Store": "https://apple.com",
                "Amazon": "https://amazon.in"
            },
            "body": "The Apple Watch Ultra 2 represents the pinnacle of smartwatch engineering, combining luxury materials with cutting-edge technology.",
            "images": ["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800"],
            "category": "tech",
            "author_id": "temp",
            "author_name": "Vikram Singh",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    db.reviews.insert_many(reviews)
    print(f"Seeded {len(reviews)} reviews.")

def seed_magazine_issues():
    """Create sample magazine issues"""
    issues = [
        {
            "_id": str(uuid.uuid4()),
            "title": "The Future of Luxury - December 2024",
            "slug": "future-of-luxury-dec-2024",
            "cover_image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
            "release_date": datetime.utcnow() - timedelta(days=30),
            "is_digital_available": True,
            "pdf_url": None,
            "article_ids": [],
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "title": "Style Icons - November 2024",
            "slug": "style-icons-nov-2024",
            "cover_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
            "release_date": datetime.utcnow() - timedelta(days=60),
            "is_digital_available": True,
            "pdf_url": None,
            "article_ids": [],
            "created_at": datetime.utcnow()
        }
    ]
    
    db.magazine_issues.insert_many(issues)
    print(f"Seeded {len(issues)} magazine issues.")

def seed_travel_destinations():
    """Create sample travel destinations"""
    destinations = [
        {
            "_id": str(uuid.uuid4()),
            "name": "Rajasthan Palace Hotels",
            "slug": "rajasthan-palace-hotels",
            "region": "Rajasthan, India",
            "hero_image": "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200",
            "gallery": [
                "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "description": "Experience royal luxury in converted palace hotels across Rajasthan, where maharajas once lived.",
            "experiences": ["Royal dining", "Elephant rides", "Palace tours", "Cultural performances"],
            "best_time_to_visit": "October to March",
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "name": "Kerala Backwaters Luxury",
            "slug": "kerala-backwaters-luxury",
            "region": "Kerala, India",
            "hero_image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200",
            "gallery": [
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "description": "Serene luxury houseboats navigating the tranquil backwaters of God's Own Country.",
            "experiences": ["Houseboat cruises", "Ayurvedic treatments", "Local cuisine", "Village visits"],
            "best_time_to_visit": "December to February",
            "created_at": datetime.utcnow()
        }
    ]
    
    db.travel_destinations.insert_many(destinations)
    print(f"Seeded {len(destinations)} travel destinations.")

def main():
    """Main seeding function"""
    print("Starting database seeding...")
    
    # Clear existing data
    clear_database()
    
    # Seed data
    categories = seed_categories()
    authors = seed_authors()
    articles = seed_articles(categories, authors)
    seed_reviews()
    seed_magazine_issues()
    seed_travel_destinations()
    
    print("\nDatabase seeding completed successfully!")
    print(f"Database: {client.get_database().name}")
    print("Collections created:")
    for name in db.list_collection_names():
        count = db[name].count_documents({})
        print(f"  {name}: {count} documents")

if __name__ == "__main__":
    main()