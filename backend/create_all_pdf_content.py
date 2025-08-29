"""
Complete PDF Content Implementation - All Categories and Subcategories
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

def create_comprehensive_content():
    """Create all content from PDF"""
    
    # Get authors
    authors = list(db.authors.find())
    if not authors:
        print("❌ No authors found")
        return
    
    # Premium images by category
    images = {
        'fashion': [
            "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1553544260-f87e671974ee?w=800&h=600&fit=crop"
        ],
        'tech': [
            "https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop"
        ],
        'auto': [
            "https://images.unsplash.com/photo-1559839049-2b350c4284cb?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1522255272218-7ac5249be344?w=800&h=600&fit=crop"
        ],
        'travel': [
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
        ],
        'grooming': [
            "https://images.unsplash.com/photo-1601925679410-490af76c7043?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1646376235675-e74224635744?w=800&h=600&fit=crop"
        ]
    }
    
    # Comprehensive content structure from PDF
    content_data = [
        # FASHION
        ("fashion", "accessories", "Luxury Accessories: Craftsmanship and Elegance", "Indulge in the world of exquisite luxury accessories, where every detail tells a story of craftsmanship and elegance. Our magazine celebrates the art of adornment, offering inspiration and insight into pieces that transform style into a statement of individuality and prestige."),
        ("fashion", "trends", "Fashion Trends: Stay Ahead of the Curve", "Stay ahead of the curve with the latest trends shaping fashion, lifestyle. From seasonal style updates to emerging industry movements, our Trends section delivers fresh insights, expert analysis, and curated inspiration—keeping you informed, inspired, and always one step ahead."),
        
        # TECH  
        ("tech", "smart", "Smart Technology: Innovation for Daily Life", "World of smart gadgets designed to simplify your daily life through innovation and connectivity. From intelligent home solutions to advanced personal devices, our collection showcases the latest in smart technology—bringing convenience, efficiency, and a touch of modern luxury to every aspect of your lifestyle."),
        ("tech", "innovations", "Tech Innovations: Shaping the Future", "The forefront of progress with innovations transforming technology, design, and modern living. From breakthrough developments to forward-thinking solutions, our curated insights highlight the ideas shaping the future. Stay informed and inspired by the advancements redefining industries and setting new standards for excellence."),
        ("tech", "reviews", "Technology Reviews: Expert Product Analysis", "Gain trusted insights through in-depth reviews of the latest products, technologies, and trends. Our expert evaluations cover performance, design, value, and innovation—helping you make informed decisions with confidence. From gadgets to lifestyle essentials, our Reviews section delivers clarity and credibility."),
        
        # GROOMING
        ("grooming", "skin", "Skincare Mastery: Advanced Grooming Solutions", "Self-care routine with expert insights on grooming and skincare. From advanced shaving techniques and hair care to effective skincare solutions, we offer trusted advice and premium product recommendations. Discover how to achieve a polished, healthy appearance through timeless practices and modern innovations."),
        ("grooming", "hair", "Hair Care Excellence: Styling and Maintenance", "Personal care with guidance on hair and grooming. From styling tips and hair health to shaving and beard maintenance, our content provides trusted advice and premium product recommendations to help you look polished, confident, and effortlessly well-groomed every day."),
        ("grooming", "fragrance", "Fragrance Mastery: The Art of Scent", "Art of scent with expertly curated content on fragrances for every occasion. From classic perfumes and colognes to modern blends, our Fragrance section offers insights, reviews, and tips to help you find your signature scent and leave a lasting impression."),
        
        # AUTO
        ("auto", "bikes", "Motorcycle Excellence: Performance and Style", "World of motorcycles and bicycles with expert reviews, latest models, and riding tips. Our Bikes section covers everything from performance machines and urban commuters to safety gear and maintenance—empowering enthusiasts to ride smarter, safer, and in style."),
        ("auto", "concept", "Automotive Concepts: Visionary Design", "Visionary designs and forward-thinking concepts shaping the future of technology, automotive, and lifestyle. Our Concept section highlights groundbreaking prototypes, innovative ideas, and creative visions that push boundaries and inspire the next generation of products and experiences."),
        ("auto", "classics", "Classic Automobiles: Timeless Elegance", "Celebrate timeless elegance and enduring style with our Classics section. Featuring iconic cars, vintage fashion, and heritage designs, we honor the craftsmanship and stories behind legendary pieces that continue to inspire and captivate across generations."),
        
        # TRAVEL
        ("travel", "destinations", "Travel Destinations: Global Adventures", "Captivating destinations around the globe with expert guides, travel tips, and insider insights. Whether you seek cultural experiences, natural beauty, or urban sophistication, our Destinations section inspires your next journey with curated content that brings the world closer to you."),
        ("travel", "resorts", "Luxury Resorts: Unparalleled Comfort", "World's finest resorts offering unparalleled luxury, comfort, and breathtaking settings. Our Resorts section features expert reviews, insider tips, and curated recommendations to help you find the perfect getaway—whether for relaxation, adventure, or indulgence."),
        ("travel", "adventure", "Adventure Travel: Thrilling Exploration", "Embrace the thrill of exploration with our Adventure section, featuring exhilarating destinations, activities, and expert tips. From rugged landscapes to extreme sports, we inspire and guide passionate travelers seeking unforgettable experiences that push boundaries and ignite the spirit of discovery."),
        
        # FOOD
        ("food", "dining", "Fine Dining Excellence: Culinary Experiences", "Savor the finest culinary experiences with our Food & Dining section. Discover expert reviews, gourmet recipes, restaurant guides, and trends that celebrate flavor, creativity, and culture—helping you enjoy exceptional dining moments, whether at home or in the world's best eateries."),
        ("food", "chefs", "Master Chefs: Culinary Visionaries", "Meet the visionary chefs shaping the culinary world with innovation, passion, and expertise. Our Chefs section offers exclusive interviews, behind-the-scenes stories, and insights into their signature techniques and philosophies—celebrating the artistry and craftsmanship behind exceptional cuisine."),
        ("food", "drinks", "Fine Beverages: World of Premium Drinks", "World of fine beverages with our Drinks section, featuring expert reviews, cocktail recipes, and insights into wine, spirits, coffee, and more. Whether you're a connoisseur or casual enthusiast, discover ways to elevate your drinking experience with quality and style."),
        
        # PEOPLE
        ("people", "celebrities", "Celebrity Spotlight: Lives and Achievements", "Stay updated on the lives, styles, and achievements of leading celebrities. Our Celebrities section offers exclusive interviews, red carpet highlights, and lifestyle insights, celebrating the personalities who captivate global audiences."),
        ("people", "entrepreneurs", "Business Entrepreneurs: Innovation and Growth", "Stories, strategies, and insights of visionary entrepreneurs driving innovation and growth across industries. Our Entrepreneurs section offers expert advice, inspiring profiles, and practical tips to empower current and aspiring business leaders on their path to success."),
        ("people", "leaders", "Industry Leaders: Minds Shaping the Future", "Explore the minds and impact of influential leaders shaping business, culture, innovation, and society. Our Leaders section features in-depth profiles, thought leadership, and strategic insights from individuals driving change and setting new standards across industries.")
    ]
    
    # Create articles from content data
    for category, subcategory, title, description in content_data:
        author = random.choice(authors)
        
        # Select images based on category
        category_imgs = images.get(category, images['tech'])
        
        article = {
            "_id": str(uuid.uuid4()),
            "title": title,
            "slug": title.lower().replace(" ", "-").replace(":", "").replace("'", "")[:50],
            "dek": f"Expert insights and authoritative content for {subcategory} {category}",
            "body": description + f"\n\nOur comprehensive coverage includes expert analysis, latest trends, and professional insights that matter to discerning readers. From foundational knowledge to advanced techniques, we provide the depth and quality you expect from premium lifestyle journalism.",
            "hero_image": random.choice(category_imgs),
            "gallery": [],
            "category": category,
            "subcategory": subcategory,
            "tags": [subcategory, category, "luxury", "expert", "premium"],
            "author_id": author["_id"],
            "author_name": author["name"],
            "is_premium": random.choice([True, False]),
            "is_featured": random.choice([True, False]),
            "is_trending": random.choice([True, False]),
            "is_sponsored": False,
            "reading_time": random.randint(4, 7),
            "published_at": datetime.utcnow() - timedelta(hours=random.randint(1, 120)),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "view_count": random.randint(800, 4000)
        }
        
        db.articles.insert_one(article)
        print(f"✅ Added: {title} [{category}/{subcategory}]")
    
    print(f"\n🎉 TOTAL: {len(content_data)} comprehensive articles created!")
    
    # Show final statistics
    total_articles = db.articles.count_documents({})
    print(f"📊 Database now has {total_articles} total articles")
    
    # Show category breakdown
    categories = db.articles.distinct("category")
    for cat in categories:
        count = db.articles.count_documents({"category": cat})
        print(f"   {cat.title()}: {count} articles")

if __name__ == "__main__":
    create_comprehensive_content()