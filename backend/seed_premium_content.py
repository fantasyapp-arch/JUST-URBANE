"""
Premium content seeding for URBANE magazine - Creates high-quality dummy content
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

def seed_premium_articles():
    """Create premium articles with professional images"""
    
    # Clear existing articles
    db.articles.delete_many({})
    print("Articles cleared.")
    
    # Get authors
    authors = list(db.authors.find())
    if not authors:
        print("No authors found")
        return
    
    # High-quality images from vision expert
    premium_images = {
        "luxury": [
            "https://images.unsplash.com/photo-1559385301-0187cb6eff46",  # luxury yacht
            "https://images.unsplash.com/photo-1559839049-2b350c4284cb",  # yellow sports car
            "https://images.unsplash.com/photo-1522255272218-7ac5249be344",  # black luxury car
            "https://images.unsplash.com/photo-1559385072-5adb2c4fc83f"   # car near Dior
        ],
        "fashion": [
            "https://images.unsplash.com/photo-1553544260-f87e671974ee",  # three women editorial
            "https://images.unsplash.com/photo-1645996830739-8fe3df27c33f", # professional portrait
            "https://images.unsplash.com/photo-1580478491436-fd6a937acc9e",  # woman in red blazer
            "https://images.unsplash.com/photo-1603189343302-e603f7add05a"   # man in black suit
        ],
        "business": [
            "https://images.unsplash.com/photo-1573164713988-8665fc963095",  # woman Surface laptop
            "https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg", # meeting
            "https://images.unsplash.com/photo-1573164713712-03790a178651",  # woman laptop
            "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d"    # man monitor
        ],
        "tech": [
            "https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg", # Apple workspace
            "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg", # tech workspace
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176",  # tech abstract
            "https://images.unsplash.com/photo-1551650975-87deedd944c3"   # tech devices
        ]
    }
    
    # Premium articles with great content (SUBSCRIPTION REQUIRED)
    premium_articles = [
        {
            "title": "The Future of Luxury: How Tech Billionaires Are Reshaping Premium Experiences",
            "dek": "AI-powered assistants to blockchain authenticity—technology is revolutionizing luxury living",
            "body": "Technology and luxury intersect in unprecedented ways as tech entrepreneurs redefine premium experiences. From AI concierges managing wine collections to blockchain-verified authenticity certificates, the luxury landscape is transforming. The ultimate status symbol has become 'time luxury'—investing in longevity research and life extension technologies. Silicon Valley elite now employ personalized AI systems that anticipate needs and orchestrate experiences money alone cannot buy. This comprehensive analysis explores how technology titans are reshaping what luxury means in the 21st century.",
            "category": "technology",
            "tags": ["AI", "luxury", "innovation", "billionaires"],
            "is_premium": True,  # PREMIUM CONTENT
            "is_featured": True,
            "hero_image": premium_images["business"][0]
        },
        {
            "title": "Inside the Wardrobes of India's Most Stylish Business Leaders",
            "dek": "How CEOs use fashion as strategic influence in boardrooms and beyond",
            "body": "India's business leaders understand that style is strategy. From Mukesh Ambani's understated elegance to Falguni Nayar's designer choices, successful executives leverage fashion for influence. The modern CEO wardrobe balances traditional craftsmanship with contemporary design, using clothes to communicate competence and cultural values. This exclusive investigation reveals the styling secrets, preferred designers, and strategic fashion choices of India's most powerful business personalities.",
            "category": "fashion",
            "tags": ["business", "style", "CEO", "india"],
            "is_premium": True,  # PREMIUM CONTENT
            "is_featured": True,
            "hero_image": premium_images["fashion"][3]
        },
        {
            "title": "Impact Investing: Where Profits Meet Purpose in 2025",
            "dek": "How wealthy investors generate returns while solving global challenges",
            "body": "Impact investing has evolved to dominate global finance with $1.5 trillion in assets. Indian impact investors tackle financial inclusion and renewable energy with 15-20% returns, proving profit and purpose are synergistic. ESG criteria are becoming mandatory, positioning impact investing as the ultimate wealth creation strategy. Our exclusive analysis reveals the top-performing impact funds and investment opportunities for 2025.",
            "category": "finance",
            "tags": ["investing", "ESG", "impact", "returns"],
            "is_premium": True,  # PREMIUM CONTENT
            "is_featured": True,
            "hero_image": premium_images["business"][1]
        }
    ]
    
    # FREE articles (accessible without subscription)
    free_articles = [
        {
            "title": "Electric Hypercars: The New Status Symbol",
            "dek": "Why tech entrepreneurs are choosing electric over traditional supercars",
            "body": "Electric hypercars are becoming the ultimate status symbol among tech billionaires. Performance, sustainability, and cutting-edge technology combine in vehicles that represent the future of luxury automotive. From Tesla's Roadster to Rimac's innovations, electric is now synonymous with premium performance.",
            "category": "auto",
            "tags": ["electric", "cars", "luxury", "performance"],
            "is_premium": False,  # FREE CONTENT
            "is_trending": True,
            "hero_image": premium_images["luxury"][1]
        },
        {
            "title": "Contemporary Indian Artists Breaking Auction Records",
            "dek": "Global recognition and million-dollar sales are transforming Indian art",
            "body": "Indian contemporary artists like Bharti Kher and Subodh Gupta are commanding seven-figure auction prices and museum acquisitions worldwide. The international art world recognizes Indian artists creating universal themes from subcontinental experiences. Digital platforms and blockchain are democratizing access to Indian art globally.",
            "category": "culture",
            "tags": ["art", "contemporary", "india", "investment"],
            "is_premium": False,  # FREE CONTENT
            "is_featured": True,
            "hero_image": premium_images["fashion"][0]
        },
        {
            "title": "Top 5 Smartphones Under ₹50,000 in 2025",
            "dek": "Best flagship phones offering premium features at accessible prices",
            "body": "The smartphone market in 2025 offers incredible flagship features at mid-range prices. From camera innovations to AI-powered performance, these devices deliver premium experiences without the flagship price tag. Our comprehensive review covers the top 5 smartphones that offer the best value for money.",
            "category": "technology",
            "tags": ["smartphones", "reviews", "budget", "flagship"],
            "is_premium": False,  # FREE CONTENT
            "is_trending": True,
            "hero_image": premium_images["tech"][0]
        },
        {
            "title": "Mumbai's Best Restaurants for Business Lunches",
            "dek": "Where India's business elite prefer to close deals over fine dining",
            "body": "Mumbai's restaurant scene offers perfect venues for business discussions and deal-making. From the elegant ambiance of Trishna to the private dining rooms at The Table, these establishments understand the art of business hospitality. Our guide covers the top restaurants where India's business leaders prefer to conduct their most important meetings.",
            "category": "food",
            "tags": ["restaurants", "business", "mumbai", "dining"],
            "is_premium": False,  # FREE CONTENT
            "is_featured": False,
            "hero_image": premium_images["luxury"][2]
        }
    ]
    
    # Combine premium and free articles for processing
    articles_data = premium_articles + free_articles
    
    # Create articles
    articles = []
    for i, template in enumerate(articles_data):
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
            "tags": template["tags"],
            "author_id": author["_id"],
            "author_name": author["name"],
            "is_premium": template.get("is_premium", False),
            "is_featured": template.get("is_featured", False),
            "is_trending": template.get("is_trending", False),
            "is_sponsored": False,
            "reading_time": random.randint(4, 8),
            "published_at": datetime.utcnow() - timedelta(hours=random.randint(1, 72)),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "view_count": random.randint(1500, 8000)
        }
        articles.append(article)
    
    # Add 10 more articles for each category
    categories = ["fashion", "business", "technology", "finance", "travel", "health", "culture", "art", "entertainment"]
    
    for category in categories:
        for i in range(3):  # 3 articles per category
            author = random.choice(authors)
            image_key = "luxury" if category in ["travel", "finance"] else "fashion" if category in ["fashion", "culture", "art"] else "business" if category in ["business", "health", "entertainment"] else "tech"
            if image_key == "tech":
                image_key = "technology"
            
            available_images = premium_images.get(image_key, premium_images["luxury"])
            
            article = {
                "_id": str(uuid.uuid4()),
                "title": f"Premium {category.title()}: Expert Insights for Luxury Lifestyle",
                "slug": f"premium-{category}-expert-insights-{i}",
                "dek": f"Exclusive coverage of {category} trends and luxury lifestyle developments",
                "body": f"This premium {category} article provides expert insights and exclusive coverage for discerning readers. Our in-depth analysis covers the latest trends, premium products, and luxury lifestyle developments in the {category} space. Expert commentary and exclusive interviews provide perspectives unavailable elsewhere.",
                "hero_image": random.choice(available_images),
                "gallery": [],
                "category": category,
                "tags": [category, "luxury", "premium", "lifestyle"],
                "author_id": author["_id"],
                "author_name": author["name"],
                "is_premium": random.choice([True, False]),
                "is_featured": i == 0,  # First article per category is featured
                "is_trending": random.choice([True, False]),
                "is_sponsored": False,
                "reading_time": random.randint(3, 6),
                "published_at": datetime.utcnow() - timedelta(days=random.randint(1, 15)),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "view_count": random.randint(500, 3000)
            }
            articles.append(article)
    
    db.articles.insert_many(articles)
    print(f"Seeded {len(articles)} premium articles with professional images.")

if __name__ == "__main__":
    seed_premium_articles()