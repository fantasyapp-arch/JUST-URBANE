#!/usr/bin/env python3
"""
Fix Aastha Gill Article Schema
Update the article to match the expected FastAPI Article model schema
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

def fix_aastha_gill_article():
    """Fix the Aastha Gill article schema to match FastAPI Article model"""
    
    # Find the Aastha Gill article
    article = db.articles.find_one({"slug": "aastha-gill-buzz-queen-bollywood-singer-interview"})
    
    if not article:
        print("❌ Aastha Gill article not found")
        return False
    
    print(f"✅ Found Aastha Gill article: {article.get('title')}")
    
    # Prepare the update
    update_fields = {}
    
    # Fix author field (author -> author_name)
    if "author" in article and "author_name" not in article:
        update_fields["author_name"] = article["author"]
        print(f"📝 Adding author_name: {article['author']}")
    
    # Fix reading_time field (string -> integer)
    if "reading_time" in article:
        reading_time_str = article["reading_time"]
        if isinstance(reading_time_str, str):
            # Extract number from "6 min read" format
            import re
            match = re.search(r'(\d+)', reading_time_str)
            if match:
                reading_time_int = int(match.group(1))
                update_fields["reading_time"] = reading_time_int
                print(f"📝 Converting reading_time: '{reading_time_str}' -> {reading_time_int}")
    
    # Add any missing required fields
    if "views" not in article:
        update_fields["views"] = article.get("view_count", 0)
        print(f"📝 Adding views field: {update_fields['views']}")
    
    if "summary" not in article:
        update_fields["summary"] = article.get("excerpt", "")
        print(f"📝 Adding summary field from excerpt")
    
    # Ensure all required boolean fields exist
    boolean_fields = ["featured", "trending", "premium", "is_premium"]
    for field in boolean_fields:
        if field not in article:
            # Map from alternative field names
            if field == "featured" and "is_featured" in article:
                update_fields[field] = article["is_featured"]
            elif field == "trending" and "is_trending" in article:
                update_fields[field] = article["is_trending"]
            elif field == "premium" and "is_premium" in article:
                update_fields[field] = article["is_premium"]
            elif field == "is_premium" and "premium" in article:
                update_fields[field] = article["premium"]
            else:
                update_fields[field] = False
            print(f"📝 Adding {field}: {update_fields[field]}")
    
    # Ensure tags is a list
    if "tags" in article and not isinstance(article["tags"], list):
        if isinstance(article["tags"], str):
            update_fields["tags"] = [article["tags"]]
        else:
            update_fields["tags"] = []
        print(f"📝 Converting tags to list: {update_fields['tags']}")
    
    if update_fields:
        # Perform the update
        result = db.articles.update_one(
            {"slug": "aastha-gill-buzz-queen-bollywood-singer-interview"},
            {"$set": update_fields}
        )
        
        if result.modified_count > 0:
            print(f"✅ Successfully updated Aastha Gill article with {len(update_fields)} fields")
            
            # Verify the update
            updated_article = db.articles.find_one({"slug": "aastha-gill-buzz-queen-bollywood-singer-interview"})
            print(f"📋 Verification:")
            print(f"   - author_name: {updated_article.get('author_name')}")
            print(f"   - reading_time: {updated_article.get('reading_time')} (type: {type(updated_article.get('reading_time'))})")
            print(f"   - views: {updated_article.get('views')}")
            print(f"   - category: {updated_article.get('category')}")
            print(f"   - subcategory: {updated_article.get('subcategory')}")
            
            return True
        else:
            print("❌ No changes were made to the article")
            return False
    else:
        print("✅ Article schema is already correct")
        return True

def main():
    """Main function"""
    print("🔧 FIXING AASTHA GILL ARTICLE SCHEMA")
    print("=" * 50)
    
    success = fix_aastha_gill_article()
    
    if success:
        print("\n🎉 Aastha Gill article schema fix completed successfully!")
        print("The article should now work properly with category filtering.")
    else:
        print("\n❌ Failed to fix Aastha Gill article schema")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())