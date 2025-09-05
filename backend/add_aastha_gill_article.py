#!/usr/bin/env python3

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/just_urbane')

async def add_aastha_gill_article():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.get_database()
    
    # Article data for Aastha Gill interview
    article_data = {
        "id": str(uuid.uuid4()),
        "title": "The 'Buzz' Queen: An Exclusive Interview with Aastha Gill",
        "slug": "aastha-gill-buzz-queen-bollywood-singer-interview",
        "author": "Amisha Shirgave",
        "category": "people",
        "subcategory": "celebrities",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "hero_image": "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/dsluk0el_DSC04677.jpg",
        "reading_time": "6 min read",
        "excerpt": "Debuting her music career with Fugly, Aastha Gill sure has come a long way. In conversation with Just Urbane, she talks about her childhood, working with Badshah, Khatron ke Khiladi season 11, and much more.",
        "body": """From Dolce and Gabbana's gem studded Spring Summer'22 collection to the 'Buzz' queen of the industry, Aastha Gill has made her mark in Bollywood music. Debuting her music career with Fugly, she sure has come a long way. In this exclusive conversation with Just Urbane, she opens up about her journey, collaborations, and aspirations.

## The Musical Foundation

**What was your childhood like? How were you as a student and did you always aspire to become a singer?**

I grew up in a very happy household sharing a very close bond with my family and especially my sister. I had a normal upbringing just like every other child in Delhi. I was always inclined towards music and dance from a very young age. Being a music director, my dad would practice music in the house and always insisted that I learn music and taught me a lot along the way. 

I was always passionate about dancing, singing, and performing. Basically, taking over the stage. I would always participate in school and college fests. Having graduated in mass communication, I was working in an ad agency where I got my first break from a college fest and that's how my journey towards career in music started.

## The Bollywood Debut

**As we all know that your Bollywood singing debut was through Fugly, how would you like to share that experience and the efforts behind it?**

When I got my first break for Fugly, I was actually still working with an Ad Agency, and I was super excited to get such a great opportunity. I loved the thrill of recording for the first time for a movie and the whole experience was so new and fresh for me.

## Mentorship and Growth

**How has the music industry been to you to date? Who has been a mentor to you in your journey all these years?**

My dad would always play music at home and we use to jam together, he taught me a lot about music theory. He has been my first mentor as a kid. Also, I would like to add that Badshah Bhai has been my mentor too and he has always supported me and guided me through.

## Fashion and Style Philosophy

**What's your definition of fashion and how do you prefer making statements just through your style?**

I love making statements through my style and that's how I would define my style. I'm a digger for sneakers, shades, bags, and caps. Recently, I have discovered my love for Indian attires and totally enjoying it this wedding season. As I mentioned, Badshah bhai is a great inspiration for doing this. 

I believe everyone has their unique style and one should nurture it and bring forward what suits them most, irrespective of time and age. But honestly, I haven't completely explored this road of fashion but totally looking forward to it in the upcoming years.

## The Badshah Connection

**You've had major hit songs with Badshah and the audience just can't stop grooving to your music. What would you like to tell us about working with Badshah? Are we going to see any more songs in the near future?**

My experience with Badshah bhai has always been incredibly great. He is family to me and when we work on a project it is more like a family working together. He is a big brother, who has always guided me towards the best and has been very kind to me since the beginning. 

It is such a homely and chill vibe working with him and the space he creates for two artists to collaborate is incredible. Whoever has worked with Badshah would say he is the most easiest to work with. Yes, you'll be hearing a lot more from us.

## Favorite Tracks and Musical Preferences

**It will go unsaid that you love all the songs that you've sung. But we would like to know which one of them holds a special place in your heart and why?**

As you said, I love them all but I think I enjoy Buzz, Paani Paani, and most recent Saawariya the most.

**What kind of music do you prefer listening to and what inspires you to take on a new project?**

As a listener, I enjoy a variety of music from Punjabi to Bollywood to Pop to world music, etc. I personally am a party person, so I end up listening to a lot of party songs and singing them as well. But in near future, I'll be trying more genres and exploring new soundscapes with my music.

## Industry Insights and Challenges

**You've been in the Bollywood music industry for quite some time now. How healthy is the competition among singers in the industry?**

Honestly, I don't really think about it in such a way. I believe one gets what they are destined for and we have to just keep working hard each day. Nothing else defines the path of our success besides our hard work and everyone is on their individual journey so it won't be fair to compete.

**I'm sure you've had quite a journey paving your way to where you are today. Was there ever a rough patch on the way and would you like to share how you overcame it?**

The struggle is always there and everyone faces their share of struggles and I guess that's what really pushes us to overcome them. But today, even after delivering so many hit songs people sometimes don't know you well due to the general image of a singer in Bollywood is that of a playback artist. A lot of people have asked me if I was the model in the Buzz song, but no I have sung that song as well. I think it is getting better now and it will get better in times to come.

## Khatron Ke Khiladi Experience

**You've been in the buzz for your actions in KKK11. Would you say that your journey there has been a bit life changing?**

Yes, indeed it has been. When you try something for the first time, the experience is always life-changing and a memorable one. In fact, there were several factors that made me take this project up. When I got a call for KKK, I was a little unsure initially but then I was like bring it on as I have not done any reality show in the past and this will be my debut on television and what better way than to start it with my favourite show, KKK. 

I always wanted to be a part of a reality tv show that showcases my inner personality which is not completely possible through a song or a social media post for the audience/fans to see who Aastha Gill really is. Secondly, it was time to face my fears and through this show, I was able to overcome a lot of them.

## Words of Inspiration

**What inspiration would you like to give our readers?**

I would like to tell all the readers to always follow their passion and never leave the path under any pressure or situation. Have trust in the process. And lastly, always love what you do and do what you love.

*"As a child, I was passionate about dancing, singing, and performing. Basically, taking over the stage. I never gave up on that."* - Aastha Gill""",
        "tags": ["aastha gill", "bollywood", "singer", "badshah", "buzz", "paani paani", "khatron ke khiladi", "celebrities", "music industry", "interview"],
        "is_premium": False,
        "is_featured": True,
        "is_trending": True,
        "view_count": 0,
        "images": [
            "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/dsluk0el_DSC04677.jpg",
            "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/tbyel69s_DSC04682.jpg",
            "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/mfwqytuc_DSC04702%20-%20Copy%20%282%29.jpg",
            "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/sesnkybp_DSC04716.jpg"
        ]
    }
    
    try:
        # Insert the article
        result = await db.articles.insert_one(article_data)
        print(f"✅ Successfully inserted Aastha Gill article with ID: {result.inserted_id}")
        print(f"Article slug: {article_data['slug']}")
        print(f"Category: {article_data['category']} > {article_data['subcategory']}")
        
        # Verify the insertion
        inserted_article = await db.articles.find_one({"id": article_data["id"]})
        if inserted_article:
            print(f"✅ Article verification successful")
            print(f"Title: {inserted_article['title']}")
            print(f"Author: {inserted_article['author']}")
            print(f"Hero Image: {inserted_article['hero_image']}")
            print(f"Images count: {len(inserted_article['images'])}")
        else:
            print("❌ Article verification failed")
            
        # Check if people category exists, create it if needed
        people_category = await db.categories.find_one({"name": "people"})
        if not people_category:
            category_data = {
                "id": str(uuid.uuid4()),
                "name": "people",
                "display_name": "People",
                "subcategories": ["celebrities", "entrepreneurs", "icons", "leaders", "culture"]
            }
            await db.categories.insert_one(category_data)
            print("✅ Created People category with celebrities subcategory")
        else:
            # Update to ensure celebrities subcategory exists
            if "celebrities" not in people_category.get("subcategories", []):
                await db.categories.update_one(
                    {"name": "people"},
                    {"$addToSet": {"subcategories": "celebrities"}}
                )
                print("✅ Added celebrities subcategory to People category")
            
    except Exception as e:
        print(f"❌ Error inserting article: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_aastha_gill_article())