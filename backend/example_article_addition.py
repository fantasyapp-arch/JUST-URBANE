#!/usr/bin/env python3
"""
EXAMPLE: Adding a new article using the standardized template
This shows how easy it will be to add articles when you provide content
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def add_example_article():
    """Example of adding a new article - Technology/AI category"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.just_urbane
    
    try:
        # EXAMPLE ARTICLE - Replace with your provided content
        article_data = {
            "id": str(uuid.uuid4()),
            "slug": "future-of-artificial-intelligence-2025",
            "title": "The Future of Artificial Intelligence in 2025",
            "dek": "Exploring the cutting-edge developments in AI technology that are reshaping industries and transforming our daily lives.",
            "body": """The landscape of artificial intelligence continues to evolve at an unprecedented pace in 2025. From generative AI revolutionizing creative industries to autonomous systems transforming transportation, we're witnessing a technological renaissance that promises to redefine human capability.

Machine learning algorithms have become more sophisticated, with large language models now capable of understanding nuanced context and producing remarkably human-like responses. The integration of AI into healthcare has accelerated drug discovery timelines and improved diagnostic accuracy.

In the automotive sector, Level 4 autonomous vehicles are becoming commonplace in major metropolitan areas, while smart city initiatives leverage AI-powered traffic management systems to reduce congestion and emissions.

The creative industries have embraced AI as a collaborative tool rather than a replacement, with artists, writers, and designers using AI to augment their creative processes and explore new forms of expression.

However, this rapid advancement brings challenges. Data privacy, algorithmic bias, and the ethical implications of AI decision-making remain critical considerations for developers and policymakers alike.

As we look ahead, the convergence of AI with quantum computing and edge computing promises even more transformative applications. The future isn't just artificial—it's intelligently designed.""",
            "author_name": "Dr. Sarah Chen",
            "author_id": "sarah-chen", 
            "category": "technology",
            "subcategory": "ai",
            "tags": ["artificial intelligence", "machine learning", "technology", "innovation", "future", "ai"],
            "hero_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
            "gallery": [
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
                "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800"
            ],
            "published_at": datetime.now(),
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "is_featured": True,
            "is_trending": False,
            "is_premium": False,
            "reading_time": 6,
            "view_count": 0,
            "like_count": 0,
            "share_count": 0
        }
        
        # Validate category exists
        category = await db.categories.find_one({"slug": article_data["category"]})
        if not category:
            print(f"❌ Error: Category '{article_data['category']}' does not exist")
            return False
            
        if article_data["subcategory"] not in category.get("subcategories", []):
            print(f"❌ Error: Subcategory '{article_data['subcategory']}' not found in '{article_data['category']}'")
            return False
        
        # Add article
        await db.articles.insert_one(article_data)
        print("✅ Example AI article added successfully!")
        
        # Verify
        article_count = await db.articles.count_documents({
            "category": "technology", 
            "subcategory": "ai"
        })
        print(f"✅ Total articles in technology/ai: {article_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error adding example article: {e}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    print("📝 EXAMPLE ARTICLE ADDITION")
    print("This demonstrates how easy it will be to add your articles!")
    print()
    
    # Uncomment to run the example
    # asyncio.run(add_example_article())