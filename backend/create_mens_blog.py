"""
AI-Generated Premium Men's Blog Article for Just Urbane
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

def create_mens_blog():
    """Create premium men's fashion and lifestyle blog"""
    
    # Get an author
    authors = list(db.authors.find())
    if not authors:
        print("No authors found")
        return
    
    author = random.choice(authors)
    
    # Premium men's images
    premium_mens_images = [
        "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1NjM4NjA4Mnww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1NjM4NjA4Mnww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1609195994377-dbffba3a4eb4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1NjM4NjA4Mnww&ixlib=rb-4.1.0&q=85",
        "https://images.unsplash.com/photo-1601925679410-490af76c7043?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxtZW4lMjBncm9vbWluZ3xlbnwwfHx8fDE3NTYzODYxMDd8MA&ixlib=rb-4.1.0&q=85"
    ]
    
    # AI-Generated Premium Blog Content
    mens_blog = {
        "_id": str(uuid.uuid4()),
        "title": "The Modern Gentleman's Guide to Effortless Luxury",
        "slug": "modern-gentleman-guide-effortless-luxury",
        "dek": "How today's successful men are redefining sophistication through thoughtful style choices and refined grooming habits",
        "body": """The modern gentleman understands that true luxury isn't about flaunting wealth—it's about cultivating an effortless sophistication that speaks volumes without saying a word. In 2025, the most successful men have mastered the art of understated elegance, combining timeless principles with contemporary sensibilities.

**The Foundation of Modern Masculinity**

Today's discerning man builds his wardrobe around quality fundamentals rather than flashy trends. A well-tailored navy suit remains the cornerstone of any sophisticated wardrobe, but the modern approach emphasizes fit, fabric, and finishing details over brand names or ostentatious displays.

The key is investing in pieces that work harder—a perfectly fitted blazer that transitions seamlessly from boardroom to dinner, premium cotton shirts that maintain their crispness throughout demanding days, and leather accessories that improve with age and use.

**Grooming as a Competitive Advantage**

The most successful executives understand that grooming is strategy, not vanity. A consistent skincare routine, precisely maintained facial hair, and a signature fragrance create a professional presence that commands respect and confidence.

Modern grooming extends beyond the basics to include details that distinguish leaders from followers: manicured nails, properly maintained eyebrows, and the kind of fresh, clean scent that lingers positively in memory after important meetings.

**The Art of Thoughtful Consumption**

Rather than accumulating possessions, today's gentleman curates experiences and relationships. He chooses quality over quantity, investing in fewer, better things that align with his values and lifestyle goals.

This philosophy extends to every aspect of life—from selecting restaurants that reflect his taste and values, to choosing timepieces that tell his story, to building relationships with craftspeople and service providers who understand and share his commitment to excellence.

**Building Your Personal Brand**

Every successful man is building a personal brand, whether consciously or not. The modern gentleman takes control of this narrative through consistent choices that reflect his values, ambitions, and understanding of what true luxury represents in contemporary culture.

The goal isn't perfection—it's authenticity combined with aspiration, creating a personal style that feels both effortless and intentional, approachable yet aspirational.""",
        "hero_image": premium_mens_images[0],  # Professional man in black suit
        "gallery": premium_mens_images[1:4],    # Additional premium images
        "category": "fashion",
        "subcategory": "men",
        "tags": ["men", "luxury", "style", "grooming", "modern", "gentleman", "sophisticated"],
        "author_id": author["_id"],
        "author_name": author["name"],
        "is_premium": False,  # Free content to showcase quality
        "is_featured": True,  # Make it featured
        "is_trending": True,  # Make it trending
        "is_sponsored": False,
        "reading_time": 6,  # 6 minute read
        "published_at": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "view_count": random.randint(1200, 3500)
    }
    
    # Insert the blog into database
    db.articles.insert_one(mens_blog)
    
    print(f"✅ Created premium men's blog: '{mens_blog['title']}'")
    print(f"📸 Hero image: {mens_blog['hero_image'][:80]}...")
    print(f"🏷️  Category: {mens_blog['category']} | Subcategory: {mens_blog['subcategory']}")
    print(f"📝 Content length: {len(mens_blog['body'])} characters")
    print(f"👤 Author: {mens_blog['author_name']}")
    print(f"⏱️  Reading time: {mens_blog['reading_time']} minutes")
    print(f"📊 Features: Featured={mens_blog['is_featured']}, Trending={mens_blog['is_trending']}, Premium={mens_blog['is_premium']}")

if __name__ == "__main__":
    create_mens_blog()