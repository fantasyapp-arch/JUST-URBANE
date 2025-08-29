"""
Insert all PDF data into website categories and subcategories
Creates professional content as per PDF specifications
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

# Premium images for different categories
category_images = {
    'fashion_men': [
        "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1609195994377-dbffba3a4eb4?w=800&h=600&fit=crop"
    ],
    'fashion_women': [
        "https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1553544260-f87e671974ee?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1645996830739-8fe3df27c33f?w=800&h=600&fit=crop"
    ],
    'tech': [
        "https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop"
    ],
    'auto': [
        "https://images.unsplash.com/photo-1559839049-2b350c4284cb?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522255272218-7ac5249be344?w=800&h=600&fit=crop", 
        "https://images.unsplash.com/photo-1559385301-0187cb6eff46?w=800&h=600&fit=crop"
    ],
    'travel': [
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop"
    ]
}

def clear_and_insert_pdf_content():
    """Clear existing articles and insert PDF content"""
    
    # Clear articles
    db.articles.delete_many({})
    print("✅ Cleared existing articles")
    
    # Get authors
    authors = list(db.authors.find())
    if not authors:
        print("❌ No authors found")
        return
    
    # PDF Category Content Structure
    pdf_content = {
        'fashion': {
            'men': {
                'description': "Forefront of men's fashion with our magazine, featuring expert insights on timeless tailoring, refined style, grooming, and lifestyle. We deliver authoritative content that inspires and guides the modern man to dress with confidence, sophistication, and purpose.",
                'articles': [
                    {
                        'title': 'The Art of Timeless Tailoring: A Modern Man\'s Guide',
                        'dek': 'Expert insights on refined style and sophisticated grooming for the contemporary gentleman',
                        'body': "Forefront of men's fashion with our magazine, featuring expert insights on timeless tailoring, refined style, grooming, and lifestyle. We deliver authoritative content that inspires and guides the modern man to dress with confidence, sophistication, and purpose. From classic suits to contemporary casual wear, understanding the fundamentals of tailoring transforms how you present yourself to the world."
                    },
                    {
                        'title': 'Modern Gentleman\'s Grooming Essentials',
                        'dek': 'Complete guide to sophisticated grooming and personal care for men',
                        'body': "Personal care excellence begins with understanding the fundamentals of modern grooming. From precision shaving techniques to sophisticated skincare routines, today's successful men invest in their appearance as a form of professional strategy. This comprehensive guide covers everything from daily skincare to signature fragrances."
                    }
                ]
            },
            'women': {
                'description': "Latest in women's fashion through expert insights on timeless elegance, contemporary style, and lifestyle. Our magazine offers authoritative content designed to inspire and empower women to dress with confidence, grace, and individuality.",
                'articles': [
                    {
                        'title': 'Timeless Elegance: Women\'s Fashion Fundamentals',
                        'dek': 'Expert insights on contemporary style and sophisticated fashion choices',
                        'body': "Latest in women's fashion through expert insights on timeless elegance, contemporary style, and lifestyle. Our magazine offers authoritative content designed to inspire and empower women to dress with confidence, grace, and individuality. From boardroom power dressing to elegant evening wear, master the art of sophisticated style."
                    }
                ]
            },
            'luxury': {
                'description': "The world of luxury fashion with exclusive insights on timeless elegance, impeccable craftsmanship, and sophisticated style. Our magazine delivers curated content for discerning readers who appreciate refinement, exclusivity, and the art of dressing with confidence and grace.",
                'articles': [
                    {
                        'title': 'Luxury Fashion: The Art of Impeccable Craftsmanship',
                        'dek': 'Exclusive insights into luxury fashion and sophisticated style',
                        'body': "The world of luxury fashion with exclusive insights on timeless elegance, impeccable craftsmanship, and sophisticated style. Our magazine delivers curated content for discerning readers who appreciate refinement, exclusivity, and the art of dressing with confidence and grace. Discover the heritage brands and emerging designers defining luxury fashion today."
                    }
                ]
            }
        },
        'tech': {
            'gadgets': {
                'description': "Latest and most innovative gadgets designed to make your life smarter, easier, and more connected. From smart home devices and wearable tech to cutting-edge accessories and cool everyday tools, our gadgets category brings you the best in modern technology.",
                'articles': [
                    {
                        'title': 'Smart Gadgets Revolution: Technology for Modern Living',
                        'dek': 'Latest innovations designed to make your life smarter and more connected',
                        'body': "Latest and most innovative gadgets designed to make your life smarter, easier, and more connected. From smart home devices and wearable tech to cutting-edge accessories and cool everyday tools, our gadgets category brings you the best in modern technology. Whether you're a tech enthusiast or just looking for practical solutions, there's something here for everyone."
                    }
                ]
            },
            'mobile': {
                'description': "Newest advancements in mobile technology, featuring smartphones, tablets, and essential accessories that keep you connected and productive on the go. Our mobile category offers expert insights and the latest releases designed to suit every lifestyle.",
                'articles': [
                    {
                        'title': 'Mobile Technology Mastery: Smartphones for Every Lifestyle',
                        'dek': 'Expert insights on the latest mobile technology and smartphone innovations',
                        'body': "Newest advancements in mobile technology, featuring smartphones, tablets, and essential accessories that keep you connected and productive on the go. Our mobile category offers expert insights and the latest releases designed to suit every lifestyle—from power users to everyday communicators."
                    }
                ]
            }
        },
        'auto': {
            'cars': {
                'description': "Latest news, reviews, and insights on automobiles and automotive technology. Our Auto section covers everything from luxury vehicles and performance cars to innovative features and industry trends.",
                'articles': [
                    {
                        'title': 'Luxury Automobiles: Performance Meets Sophistication',
                        'dek': 'Latest insights on luxury vehicles and automotive technology',
                        'body': "Latest news, reviews, and insights on automobiles and automotive technology. Our Auto section covers everything from luxury vehicles and performance cars to innovative features and industry trends—helping enthusiasts and buyers make confident, well-informed decisions on the road ahead."
                    }
                ]
            },
            'evs': {
                'description': "The future of transportation with the latest innovations in electric vehicles. Our EV section offers in-depth reviews, industry news, and expert insights on sustainability, performance, and technology.",
                'articles': [
                    {
                        'title': 'Electric Vehicle Revolution: The Future of Mobility',
                        'dek': 'Expert insights on electric vehicles and sustainable transportation',
                        'body': "The future of transportation with the latest innovations in electric vehicles. Our EV section offers in-depth reviews, industry news, and expert insights on sustainability, performance, and technology—helping you navigate the shift towards cleaner, smarter, and more efficient mobility solutions."
                    }
                ]
            }
        },
        'travel': {
            'luxury': {
                'description': "World's most exquisite destinations and exclusive experiences with our Luxury Travel section. From lavish resorts and private escapes to curated journeys and insider tips, we guide discerning travelers toward unforgettable adventures defined by elegance, comfort, and impeccable service.",
                'articles': [
                    {
                        'title': 'Luxury Travel: Exquisite Destinations and Exclusive Experiences',
                        'dek': 'Guide to the world\'s most luxurious travel destinations',
                        'body': "World's most exquisite destinations and exclusive experiences with our Luxury Travel section. From lavish resorts and private escapes to curated journeys and insider tips, we guide discerning travelers toward unforgettable adventures defined by elegance, comfort, and impeccable service."
                    }
                ]
            }
        }
    }
    
    # Create articles from PDF content
    articles_created = 0
    
    for category, subcategories in pdf_content.items():
        for subcategory, data in subcategories.items():
            
            # Select appropriate images
            image_key = f"{category}_{subcategory}" if f"{category}_{subcategory}" in category_images else category
            images = category_images.get(image_key, category_images.get(category, category_images['tech']))
            
            for i, article_data in enumerate(data['articles']):
                author = random.choice(authors)
                
                article = {
                    "_id": str(uuid.uuid4()),
                    "title": article_data['title'],
                    "slug": article_data['title'].lower().replace(" ", "-").replace(":", "").replace("'", "")[:50],
                    "dek": article_data['dek'],
                    "body": article_data['body'],
                    "hero_image": random.choice(images),
                    "gallery": [],
                    "category": category,
                    "subcategory": subcategory,
                    "tags": [subcategory, category, "luxury", "premium"],
                    "author_id": author["_id"],
                    "author_name": author["name"],
                    "is_premium": random.choice([True, False]),
                    "is_featured": i == 0,  # First article featured
                    "is_trending": random.choice([True, False]),
                    "is_sponsored": False,
                    "reading_time": random.randint(4, 8),
                    "published_at": datetime.utcnow() - timedelta(hours=random.randint(1, 72)),
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                    "view_count": random.randint(500, 3000)
                }
                
                db.articles.insert_one(article)
                articles_created += 1
                print(f"✅ Created: {article['title']} [{category}/{subcategory}]")
    
    # Add more category descriptions to database
    pdf_categories = [
        {
            "name": "Fashion",
            "slug": "fashion", 
            "description": "Expert insights on style, elegance, and luxury fashion for modern living",
            "subcategories": {
                "men": "Forefront of men's fashion with expert insights on timeless tailoring, refined style, grooming, and lifestyle",
                "women": "Latest in women's fashion through expert insights on timeless elegance, contemporary style, and lifestyle",
                "luxury": "World of luxury fashion with exclusive insights on timeless elegance and sophisticated style",
                "accessories": "Exquisite luxury accessories, where every detail tells a story of craftsmanship and elegance",
                "trends": "Stay ahead with latest trends shaping fashion and lifestyle"
            }
        },
        {
            "name": "Tech",
            "slug": "tech",
            "description": "Latest technology innovations, gadgets, and smart solutions for modern living",
            "subcategories": {
                "gadgets": "Latest and most innovative gadgets designed to make your life smarter, easier, and more connected",
                "mobile": "Newest advancements in mobile technology, featuring smartphones, tablets, and accessories",
                "smart": "World of smart gadgets designed to simplify your daily life through innovation",
                "innovations": "Forefront of progress with innovations transforming technology and modern living",
                "reviews": "Trusted insights through in-depth reviews of latest products and technologies"
            }
        }
    ]
    
    # Update categories in database
    for cat_data in pdf_categories:
        db.categories.update_one(
            {"slug": cat_data["slug"]},
            {"$set": {
                "description": cat_data["description"],
                "subcategories": cat_data["subcategories"],
                "updated_at": datetime.utcnow()
            }},
            upsert=False
        )
        print(f"✅ Updated category: {cat_data['name']}")
    
    print(f"\n🎉 Successfully inserted {articles_created} articles from PDF!")
    print("📊 Content organized by categories and subcategories as specified")

if __name__ == "__main__":
    clear_and_insert_pdf_content()