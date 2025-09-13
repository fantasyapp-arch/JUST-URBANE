#!/usr/bin/env python3
"""
Restore Original Just Urbane Website Content
Based on analysis of live website at https://justurbane.in
"""

import os
import uuid
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

def clear_database():
    """Clear existing content to start fresh"""
    print("Clearing existing database content...")
    db.articles.delete_many({})
    db.categories.delete_many({})
    print("Database cleared!")

def create_categories():
    """Create the main categories"""
    categories = [
        {
            "id": str(uuid.uuid4()),
            "name": "luxury",
            "display_name": "Luxury",
            "description": "Luxury lifestyle and premium experiences",
            "subcategories": ["yachts", "watches", "cars"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "fashion",
            "display_name": "Fashion", 
            "description": "Style, trends, and designer insights",
            "subcategories": ["women", "men", "red-carpet"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "technology",
            "display_name": "Technology",
            "description": "Innovation, gadgets, and the future of luxury tech",
            "subcategories": ["gadgets", "ai", "future-tech"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "travel",
            "display_name": "Travel",
            "description": "Premium destinations and luxury experiences",
            "subcategories": ["guides", "adventure", "destinations"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "people",
            "display_name": "People",
            "description": "Exclusive interviews and celebrity profiles",
            "subcategories": ["celebrities", "interviews", "profiles"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "food",
            "display_name": "Food & Lifestyle",
            "description": "Culinary experiences and luxury dining",
            "subcategories": ["food review", "drinks", "restaurants"]
        }
    ]
    
    for category in categories:
        db.categories.insert_one(category)
    print(f"Created {len(categories)} categories")

def restore_articles():
    """Restore all original articles from the live website"""
    
    articles = [
        # HERO ARTICLE - Sunseeker Yacht
        {
            "id": str(uuid.uuid4()),
            "title": "Sunseeker 65 Sport: The Ultimate Luxury Yacht Experience",
            "slug": "sunseeker-65-sport-luxury-yacht-review",
            "body": """Say hello to the Sunseeker 65 Sport yacht. Finished in bespoke bronze, the yacht prioritises its unique emphasis on delivering yachts to the sailor in you with personal and bespoke finishes. The yacht stands as a testament to British craftsmanship and luxury maritime engineering.

The Sunseeker 65 Sport combines performance with elegance, offering an unprecedented yachting experience. With its sleek bronze finish and meticulously crafted interior, this yacht represents the pinnacle of luxury marine vessels.

Key Features:
- Length: 65 feet of pure luxury
- Bespoke bronze finish
- Premium British craftsmanship
- High-performance engines
- Luxury interior accommodations
- State-of-the-art navigation systems

The attention to detail in every aspect of the Sunseeker 65 Sport is remarkable. From the hand-stitched leather seats to the precision-engineered controls, every element has been designed to provide the ultimate yachting experience.

For the discerning yacht enthusiast, the Sunseeker 65 Sport offers not just transportation, but a lifestyle statement that speaks to luxury, performance, and uncompromising quality.""",
            "summary": "Discover the Sunseeker 65 Sport yacht, finished in bespoke bronze and designed for the ultimate luxury yachting experience.",
            "hero_image": "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/3kbp8opy_credit-sun-country-yachts-6-.jpg",
            "author_name": "Harshit Srinivas",
            "category": "luxury",
            "subcategory": "yachts",
            "tags": ["yachts", "luxury", "sunseeker", "marine", "british craftsmanship"],
            "featured": True,
            "trending": True,
            "premium": False,
            "views": 1250,
            "reading_time": 5,
            "published_at": datetime(2025, 9, 5),
            "created_at": datetime(2025, 9, 5),
            "status": "published"
        },
        
        # FASHION ARTICLES
        {
            "id": str(uuid.uuid4()),
            "title": "All Glam at the 94th Academy Awards: Best Dressed Celebrities",
            "slug": "oscars-2022-best-dressed-fashion-red-carpet",
            "body": """The 94th Academy Awards showcased some of the most spectacular fashion moments in recent Oscar history. From stunning gowns to sharp tuxedos, celebrities brought their A-game to the red carpet.

This year's ceremony was particularly notable for its bold fashion choices and stunning designer pieces. The red carpet became a runway for some of the most talked-about looks of the year.

Standout Looks:
- Zendaya's show-stopping silver gown by Valentino
- Timothée Chalamet's Louis Vuitton sequined jacket
- Nicole Kidman's elegant Armani creation
- Lady Gaga's dramatic Gucci ensemble

The evening celebrated not just cinematic excellence but also the artistry of fashion design. Each look told a story, from classic Hollywood glamour to modern avant-garde statements.

The awards ceremony proved once again that the Oscars red carpet remains the ultimate fashion showcase, where designers and celebrities collaborate to create unforgettable moments that will be remembered for years to come.""",
            "summary": "A comprehensive look at the most stunning fashion moments from the 94th Academy Awards red carpet.",
            "hero_image": "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/ld7p0j41_94_AR_0795%20-%20Copy.jpg",
            "author_name": "Rugved Marathe",
            "category": "fashion",
            "subcategory": "women",
            "tags": ["oscars", "red carpet", "fashion", "celebrities", "awards"],
            "featured": True,
            "trending": True,
            "premium": False,
            "views": 2150,
            "reading_time": 7,
            "published_at": datetime(2025, 9, 5),
            "created_at": datetime(2025, 9, 5),
            "status": "published"
        },
        
        {
            "id": str(uuid.uuid4()),
            "title": "Perfect Suit Guide for Men: Corporate Dressing Excellence",
            "slug": "perfect-suit-guide-men-corporate-dressing",
            "body": """The perfect suit is more than just clothing—it's a statement of professionalism, confidence, and attention to detail. In the world of corporate dressing, understanding the nuances of suit selection and styling can make the difference between looking good and looking exceptional.

Steve Harvey's famous formula suggests that with just 5 suits, 5 pairs of pants, and 3 shirts, a man can create 75 different combinations. This mathematical approach to wardrobe building ensures maximum versatility with minimal investment.

Essential Suit Colors:
- Navy Blue: The ultimate versatile choice
- Charcoal Grey: Perfect for formal occasions
- Light Grey: Ideal for daytime meetings
- Black: Reserved for evening events
- Brown: A sophisticated alternative

Fit is paramount in suit selection. A well-tailored suit that fits properly will always look better than an expensive suit that doesn't fit well. The jacket should hug your shoulders without pulling, and the trousers should have a clean line without bunching.

Corporate dressing is about creating a professional image that commands respect and confidence. The right suit, properly fitted and styled, becomes your armor in the business world.""",
            "summary": "Master the art of corporate dressing with this comprehensive guide to selecting and styling the perfect suit.",  
            "hero_image": "https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80",
            "author_name": "Harshit Srinivas",
            "category": "fashion",
            "subcategory": "men",
            "tags": ["suits", "men's fashion", "corporate", "style", "professional"],
            "featured": True,
            "trending": False,
            "premium": False,
            "views": 1850,
            "reading_time": 6,
            "published_at": datetime(2025, 9, 5),
            "created_at": datetime(2025, 9, 5),
            "status": "published"
        },
        
        # TECHNOLOGY ARTICLES
        {
            "id": str(uuid.uuid4()),
            "title": "Testing the Future of Technology: Gadgets That Are Shaping Tomorrow",
            "slug": "testing-the-future-of-technology-test",
            "body": """Testing the Future of Technology: Gadgets That Are Shaping Tomorrow 🌐

Technology is no longer a silent background player in our lives — it's the director of our daily symphony. From the moment we wake up to when we drift off to sleep, cutting-edge gadgets seamlessly integrate into our routines, making life more efficient, connected, and exciting.

Revolutionary Gadgets Changing Our World:

1. AI-Powered Smart Assistants
The latest generation of smart assistants goes beyond simple voice commands. They learn your preferences, anticipate your needs, and proactively suggest solutions before you even realize you need them.

2. Augmented Reality Wearables
AR glasses are transforming how we interact with the digital world, overlaying useful information onto our physical environment in ways that were once purely science fiction.

3. Advanced Health Monitoring
Wearable technology now monitors everything from blood oxygen levels to stress patterns, providing real-time health insights that were once only available in medical facilities.

4. Sustainable Energy Solutions
Solar panels, battery storage systems, and energy-efficient appliances are making sustainable living more accessible and practical for everyday consumers.

The future of technology isn't just about having the latest gadgets—it's about creating an ecosystem of devices that work together to enhance human potential and improve quality of life.""",
            "summary": "Explore the cutting-edge gadgets and technologies that are revolutionizing how we live, work, and interact with the world.",
            "hero_image": "https://justurbane.in/uploads/1757680245_360_F_170805293_mP8dwQvg7ip4tFRyXNs7xhIs470dBArn.jpg",
            "author_name": "Rajesh Verma",
            "category": "technology",
            "subcategory": "gadgets",
            "tags": ["technology", "gadgets", "future", "AI", "innovation"],
            "featured": True,
            "trending": True,
            "premium": False,
            "views": 1650,
            "reading_time": 90,
            "published_at": datetime(2025, 9, 12),
            "created_at": datetime(2025, 9, 12),
            "status": "published"
        },
        
        {
            "id": str(uuid.uuid4()),
            "title": "How Artificial Intelligence is Transforming Everyday Life",
            "slug": "ai-transforming-life",
            "body": """AI in Everyday Life

Artificial Intelligence (AI) is no longer just a buzzword—it's a reality shaping the way we live, work, and interact. From virtual assistants that schedule our meetings to recommendation algorithms that curate our entertainment, AI has seamlessly integrated into our daily routines.

The Impact of AI Across Industries:

Healthcare Revolution
AI-powered diagnostic tools are helping doctors identify diseases earlier and more accurately. Machine learning algorithms analyze medical images, predict health risks, and even assist in drug discovery, making healthcare more precise and personalized.

Transportation Innovation
Self-driving cars, traffic optimization systems, and predictive maintenance in public transportation are making our commutes safer and more efficient. AI is literally driving the future of mobility.

Education Enhancement
Personalized learning platforms adapt to individual learning styles, while AI tutors provide 24/7 support to students. Educational technology is becoming more intelligent and responsive to student needs.

Entertainment Evolution
Streaming services use AI to recommend content, video games employ AI for realistic NPCs, and AI-generated music and art are pushing creative boundaries.

The key to embracing AI is understanding that it's not about replacing human intelligence—it's about augmenting it. AI handles routine tasks, processes vast amounts of data, and provides insights that help us make better decisions.""",
            "summary": "Discover how Artificial Intelligence is revolutionizing various aspects of our daily lives across healthcare, transportation, education, and entertainment.",
            "hero_image": "https://justurbane.in/uploads/1757617207_ChatGPT%20Image%20Sep%2012,%202025,%2012_27_23%20AM.png", 
            "author_name": "Tech Insights Team",
            "category": "technology",
            "subcategory": "ai",
            "tags": ["artificial intelligence", "AI", "technology", "innovation", "digital transformation"],
            "featured": True,
            "trending": True,
            "premium": False,
            "views": 2240,
            "reading_time": 4,
            "published_at": datetime(2025, 9, 12),
            "created_at": datetime(2025, 9, 12),
            "status": "published"
        },
        
        # TRAVEL ARTICLES
        {
            "id": str(uuid.uuid4()),
            "title": "Travel With A Clear Conscious",
            "slug": "sustainable-travel-conscious-guide",
            "body": """Over the last few years there has been tremendous growth in the tourism sector. Overtourism is a term that best describes this scenario in which one tourist destination experiences an overwhelming influx of visitors, leading to environmental degradation, cultural disruption, and strain on local resources.

The Need for Sustainable Travel

As conscious travelers, we have a responsibility to minimize our impact on the destinations we visit. Sustainable travel isn't just a trend—it's a necessity for preserving the world's most beautiful places for future generations.

5 Essential Sustainable Travel Practices:

1. Choose Eco-Friendly Accommodations
Look for hotels and lodges that have implemented green practices such as renewable energy, water conservation, and waste reduction programs. Many establishments now hold certifications from organizations like Green Key or LEED.

2. Support Local Communities
Eat at locally-owned restaurants, shop at local markets, and choose tour operators that employ local guides. This ensures that your tourism dollars directly benefit the communities you visit.

3. Minimize Your Carbon Footprint
Consider train or bus travel for shorter distances, pack light to reduce fuel consumption, and offset unavoidable flights through verified carbon offset programs.

4. Respect Local Cultures and Environments
Research local customs and traditions before you travel. Follow Leave No Trace principles in natural areas and be mindful of photography etiquette in sacred or sensitive locations.

5. Choose Quality Over Quantity
Instead of rushing through multiple destinations, spend more time in fewer places. This allows for deeper cultural immersion while reducing transportation-related emissions.

Sustainable travel requires conscious effort, but the rewards—for both travelers and destinations—are immeasurable.""",
            "summary": "Learn how to travel responsibly with our comprehensive guide to sustainable tourism practices.",
            "hero_image": "https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/uzjm9ne7_shutterstock_1982804408-_Converted_.jpg",
            "author_name": "Komal Bhandekar",
            "category": "travel",
            "subcategory": "guides",
            "tags": ["sustainable travel", "eco-tourism", "responsible tourism", "environment", "conscious travel"],
            "featured": True,
            "trending": False,
            "premium": False,
            "views": 1420,
            "reading_time": 5,
            "published_at": datetime(2025, 9, 4),
            "created_at": datetime(2025, 9, 4),
            "status": "published"
        },
        
        {
            "id": str(uuid.uuid4()),
            "title": "When In France",
            "slug": "when-in-france-travel-destinations",
            "body": """Mesmerised by the beauty of the land, France is one of the most popular tourist destinations in the world. A country with fine wine, delicious food, and stunning architecture, France offers an unparalleled travel experience that captivates visitors from around the globe.

From the romantic streets of Paris to the sun-soaked beaches of the French Riviera, France presents a diverse tapestry of experiences that cater to every type of traveler.

Must-Visit French Destinations:

Paris - The City of Light
No trip to France is complete without experiencing the magic of Paris. From the iconic Eiffel Tower to the artistic treasures of the Louvre, Paris offers world-class culture, cuisine, and romance at every corner.

Provence - Lavender Fields and Village Charm
The rolling hills of Provence, dotted with lavender fields and medieval villages, provide a peaceful escape from city life. The region is perfect for wine tasting, exploring local markets, and enjoying the Mediterranean lifestyle.

Loire Valley - Château Country
Known as the "Garden of France," the Loire Valley is home to over 300 châteaux, each telling stories of French nobility and architectural excellence.

French Riviera - Glamour and Sun
The Côte d'Azur offers glamorous beach resorts, luxury shopping, and the famous Cannes Film Festival atmosphere year-round.

Normandy - History and Natural Beauty
From the D-Day beaches to the stunning Mont-Saint-Michel, Normandy combines historical significance with breathtaking coastal scenery.

France is a country that rewards slow travel—take time to savor the local cuisine, engage with friendly locals, and immerse yourself in the rich cultural heritage that makes France truly magnifique.""",
            "summary": "Discover the diverse beauty of France, from Paris's urban sophistication to Provence's rural charm.",
            "hero_image": "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/asfm7icv_Paris%20%283%29.jpg",
            "author_name": "Amisha Shirgave",
            "category": "travel",
            "subcategory": "adventure",
            "tags": ["France", "Paris", "travel guide", "Europe", "culture"],
            "featured": True,
            "trending": False,
            "premium": False,
            "views": 1890,
            "reading_time": 6,
            "published_at": datetime(2025, 9, 4),
            "created_at": datetime(2025, 9, 4),
            "status": "published"
        },
        
        # PEOPLE ARTICLES
        {
            "id": str(uuid.uuid4()),
            "title": "The 'Buzz' Queen: An Exclusive Interview with Aastha Gill",
            "slug": "aastha-gill-buzz-queen-bollywood-singer-interview",
            "body": """From Dolce and Gabbana's gem studded Spring Summer'22 collection to the 'Buzz' queen of the industry, Aastha Gill has made her mark in Bollywood music with her distinctive voice and vibrant personality.

Known for her hit songs and collaborations with top artists, Aastha has become synonymous with party anthems and dance floor favorites. Her journey from a newcomer to one of the most sought-after voices in Indian music is nothing short of inspiring.

Career Highlights:

Musical Breakthrough
Aastha's entry into Bollywood was marked by her unique vocal style that perfectly complemented contemporary music trends. Her ability to adapt to different genres while maintaining her signature sound has made her a favorite among music directors.

Fashion Icon Status
Beyond music, Aastha has established herself as a fashion icon. Her bold style choices and designer collaborations have made her a regular feature in fashion magazines and red carpet events.

Chart-Topping Hits
From dance numbers to romantic ballads, Aastha's versatility as a singer is evident in her diverse discography. Her songs consistently top music charts and become viral sensations on social media platforms.

Future Projects
With several exciting collaborations in the pipeline, Aastha continues to push creative boundaries and explore new musical territories.

In our exclusive interview, Aastha shares insights into her creative process, her fashion inspirations, and her vision for the future of Indian music. Her infectious energy and passion for her craft make her not just a talented artist, but a true entertainer who connects with audiences across generations.""",
            "summary": "Get an exclusive look into the life and career of Bollywood's 'Buzz' queen, Aastha Gill, discussing her music, fashion, and future projects.",
            "hero_image": "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/dsluk0el_DSC04677.jpg",
            "author_name": "Amisha Shirgave", 
            "category": "people",
            "subcategory": "celebrities",
            "tags": ["Aastha Gill", "Bollywood", "singer", "music", "interview"],
            "featured": True,
            "trending": True,
            "premium": False,
            "views": 2650,
            "reading_time": 8,
            "published_at": datetime(2025, 9, 6),
            "created_at": datetime(2025, 9, 6),
            "status": "published"
        },
        
        # FOOD & LIFESTYLE ARTICLES
        {
            "id": str(uuid.uuid4()),
            "title": "Scottish Leader Original Whiskey",
            "slug": "scottish-leader-whiskey-review",
            "body": """2022 couldn't have started better for whiskey lovers in India! After 45 years of splendid history, Distell International has reintroduced Scottish Leader Original Whiskey to the Indian market, bringing with it decades of Scottish whiskey-making tradition.

The return of Scottish Leader marks a significant moment for whiskey enthusiasts who appreciate authentic Scottish craftsmanship. This blend represents the perfect marriage of tradition and innovation, offering a taste experience that has been refined over nearly half a century.

Tasting Notes:

Appearance
Scottish Leader presents a beautiful amber color with golden highlights, indicating its careful aging process and quality craftsmanship.

Aroma
The nose reveals layers of complexity - sweet honey notes blend with subtle spice, complemented by hints of oak and a touch of smoke that speaks to its Scottish heritage.

Taste Profile
On the palate, Scottish Leader delivers a smooth, well-balanced experience. The initial sweetness gives way to warm spices, with notes of vanilla and caramel providing depth and richness.

Finish
The finish is pleasantly long and warming, with subtle smoky undertones that linger, inviting another sip.

Perfect Serving Suggestions
- Neat: To fully appreciate the complex flavor profile
- On the rocks: With a single large ice cube to slightly open up the flavors
- Classic cocktails: Excellent in whiskey-based cocktails like Old Fashioned or Whiskey Sour

Scottish Leader Original represents exceptional value for money, offering premium Scottish whiskey experience at an accessible price point. It's an excellent choice for both newcomers to whiskey and seasoned enthusiasts looking for a reliable, flavorful dram.""",
            "summary": "Discover the return of Scottish Leader Original Whiskey to India after 45 years, with detailed tasting notes and serving suggestions.",
            "hero_image": "https://customer-assets.emergentagent.com/job_premium-articles/artifacts/yfjyheh0_Scottish%20Leader_2.jpg",
            "author_name": "Harshit Srinivas",
            "category": "food",
            "subcategory": "drinks",
            "tags": ["whiskey", "Scottish Leader", "spirits", "review", "tasting"],
            "featured": True,
            "trending": False,
            "premium": False,
            "views": 1320,
            "reading_time": 5,
            "published_at": datetime(2025, 9, 4),
            "created_at": datetime(2025, 9, 4),
            "status": "published"
        },
        
        {
            "id": str(uuid.uuid4()),
            "title": "A bit of Italiano at the newly re-launched Celini",
            "slug": "celini-food-review-mumbai",
            "body": """"Nowness in a little over a dozen dishes". Somewhere I had read these words, describing a new restaurant entrant in some far-off city. Today, as I sit at the newly re-launched Celini in Mumbai, these words ring true for this elegant Italian dining establishment.

Located in the heart of Mumbai, Celini has undergone a complete transformation, emerging as a sophisticated destination for authentic Italian cuisine. The restaurant successfully captures the essence of Italian dining culture while adapting to contemporary tastes and expectations.

Culinary Journey:

Appetizers
The antipasti selection showcases traditional Italian flavors with a modern presentation. The burrata with heirloom tomatoes is a standout - creamy, fresh, and perfectly seasoned.

Pasta Perfection
Hand-made pastas are clearly the star of the menu. The carbonara is executed flawlessly with silky sauce and perfectly al dente pasta. The truffle risotto is rich and aromatic, showcasing premium ingredients.

Main Courses
The osso buco is tender and flavorful, falling off the bone and paired with creamy polenta. The seafood dishes feature fresh catch prepared with Italian techniques that enhance rather than mask natural flavors.

Desserts
The tiramisu is authentically prepared with the perfect balance of coffee, mascarpone, and cocoa. It's a fitting end to an exceptional meal.

Ambiance and Service
The newly redesigned interior strikes the perfect balance between elegance and warmth. The service is attentive without being intrusive, with staff demonstrating genuine knowledge of the menu and wine pairings.

Celini's re-launch represents a successful evolution of Italian dining in Mumbai, offering an authentic experience that honors tradition while embracing innovation.""",
            "summary": "Experience the newly re-launched Celini restaurant in Mumbai, offering authentic Italian cuisine in an elegant atmosphere.",
            "hero_image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80",
            "author_name": "Team Urbane",
            "category": "food",
            "subcategory": "food review",
            "tags": ["restaurant review", "Italian cuisine", "Mumbai", "dining", "Celini"],
            "featured": True,
            "trending": False,
            "premium": False,
            "views": 980,
            "reading_time": 6,
            "published_at": datetime(2022, 6, 15),
            "created_at": datetime(2022, 6, 15),
            "status": "published"
        }
    ]
    
    # Insert all articles
    for article in articles:
        db.articles.insert_one(article)
    
    print(f"Restored {len(articles)} original articles!")
    
def main():
    """Main restoration function"""
    print("🚀 Starting Just Urbane Content Restoration...")
    print("Based on live website analysis: https://justurbane.in")
    print()
    
    # Clear and restore
    clear_database()
    create_categories()
    restore_articles()
    
    # Verify restoration
    total_articles = db.articles.count_documents({})
    total_categories = db.categories.count_documents({})
    
    print()
    print("✅ RESTORATION COMPLETE!")
    print(f"📊 Articles restored: {total_articles}")
    print(f"📊 Categories created: {total_categories}")
    print()
    print("🌟 Your Just Urbane website has been restored to its original glory!")
    print("🌟 All content from https://justurbane.in is now available in your local application!")

if __name__ == "__main__":
    main()