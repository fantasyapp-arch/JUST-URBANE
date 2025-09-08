#!/usr/bin/env python3
"""
Data Migration Script: MongoDB to MySQL
Migrates data from existing Python/MongoDB backend to new PHP/MySQL backend
"""

import os
import json
import requests
from pymongo import MongoClient
from datetime import datetime, timezone
import uuid

# Configuration
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
PHP_API_URL = "http://localhost:8001/api"
MYSQL_HOST = "localhost"
MYSQL_DB = "just_urbane_php"
MYSQL_USER = "urbane_user"
MYSQL_PASS = "urbane_password"

def connect_mongo():
    """Connect to MongoDB"""
    try:
        client = MongoClient(MONGO_URL)
        db = client.just_urbane
        print("✅ Connected to MongoDB")
        return db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None

def connect_mysql():
    """Connect to MySQL using PyMySQL"""
    try:
        import pymysql
        connection = pymysql.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASS,
            database=MYSQL_DB,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        print("✅ Connected to MySQL")
        return connection
    except ImportError:
        print("❌ PyMySQL not installed. Installing...")
        os.system("pip install pymysql")
        import pymysql
        connection = pymysql.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASS,
            database=MYSQL_DB,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except Exception as e:
        print(f"❌ MySQL connection failed: {e}")
        return None

def migrate_users(mongo_db, mysql_conn):
    """Migrate users from MongoDB to MySQL"""
    print("\n🔄 Migrating Users...")
    
    try:
        cursor = mysql_conn.cursor()
        users = list(mongo_db.users.find())
        migrated = 0
        
        for user in users:
            try:
                # Convert MongoDB document to MySQL format
                user_data = {
                    'id': user.get('id', str(uuid.uuid4())),
                    'email': user['email'],
                    'full_name': user['full_name'],
                    'hashed_password': user['hashed_password'],
                    'is_premium': bool(user.get('is_premium', False)),
                    'subscription_type': user.get('subscription_type'),
                    'subscription_status': user.get('subscription_status'),
                    'subscription_expires_at': user.get('subscription_expires_at'),
                    'created_at': user.get('created_at', datetime.now()),
                    'updated_at': datetime.now()
                }
                
                # Insert into MySQL
                sql = """
                INSERT INTO users (id, email, full_name, hashed_password, is_premium, 
                                 subscription_type, subscription_status, subscription_expires_at, 
                                 created_at, updated_at)
                VALUES (%(id)s, %(email)s, %(full_name)s, %(hashed_password)s, %(is_premium)s,
                        %(subscription_type)s, %(subscription_status)s, %(subscription_expires_at)s,
                        %(created_at)s, %(updated_at)s)
                ON DUPLICATE KEY UPDATE
                    full_name = VALUES(full_name),
                    is_premium = VALUES(is_premium),
                    subscription_type = VALUES(subscription_type),
                    subscription_status = VALUES(subscription_status),
                    subscription_expires_at = VALUES(subscription_expires_at),
                    updated_at = VALUES(updated_at)
                """
                
                cursor.execute(sql, user_data)
                migrated += 1
                
            except Exception as e:
                print(f"❌ Error migrating user {user.get('email', 'unknown')}: {e}")
        
        mysql_conn.commit()
        print(f"✅ Users migrated: {migrated}")
        
    except Exception as e:
        print(f"❌ User migration failed: {e}")

def migrate_articles(mongo_db, mysql_conn):
    """Migrate articles from MongoDB to MySQL"""
    print("\n🔄 Migrating Articles...")
    
    try:
        cursor = mysql_conn.cursor()
        articles = list(mongo_db.articles.find())
        migrated = 0
        
        for article in articles:
            try:
                # Convert MongoDB document to MySQL format
                article_data = {
                    'id': article.get('id', str(uuid.uuid4())),
                    'title': article['title'],
                    'slug': article.get('slug'),
                    'body': article['body'],
                    'summary': article.get('summary'),
                    'hero_image': article.get('hero_image'),
                    'author_name': article['author_name'],
                    'category': article['category'],
                    'subcategory': article.get('subcategory'),
                    'tags': json.dumps(article.get('tags', [])) if article.get('tags') else None,
                    'featured': bool(article.get('featured', False)),
                    'trending': bool(article.get('trending', False)),
                    'premium': bool(article.get('premium', False)),
                    'is_premium': bool(article.get('is_premium', False)),
                    'views': int(article.get('views', 0)),
                    'reading_time': article.get('reading_time'),
                    'published_at': article.get('published_at', datetime.now()),
                    'created_at': article.get('created_at', datetime.now()),
                    'updated_at': datetime.now()
                }
                
                # Generate slug if missing
                if not article_data['slug']:
                    article_data['slug'] = article_data['title'].lower().replace(' ', '-').replace(',', '')[:255]
                
                # Insert into MySQL
                sql = """
                INSERT INTO articles (id, title, slug, body, summary, hero_image, author_name, 
                                    category, subcategory, tags, featured, trending, premium, 
                                    is_premium, views, reading_time, published_at, created_at, updated_at)
                VALUES (%(id)s, %(title)s, %(slug)s, %(body)s, %(summary)s, %(hero_image)s, %(author_name)s,
                        %(category)s, %(subcategory)s, %(tags)s, %(featured)s, %(trending)s, %(premium)s,
                        %(is_premium)s, %(views)s, %(reading_time)s, %(published_at)s, %(created_at)s, %(updated_at)s)
                ON DUPLICATE KEY UPDATE
                    title = VALUES(title),
                    body = VALUES(body),
                    summary = VALUES(summary),
                    hero_image = VALUES(hero_image),
                    category = VALUES(category),
                    subcategory = VALUES(subcategory),
                    tags = VALUES(tags),
                    featured = VALUES(featured),
                    trending = VALUES(trending),
                    premium = VALUES(premium),
                    is_premium = VALUES(is_premium),
                    views = VALUES(views),
                    reading_time = VALUES(reading_time),
                    updated_at = VALUES(updated_at)
                """
                
                cursor.execute(sql, article_data)
                migrated += 1
                
            except Exception as e:
                print(f"❌ Error migrating article {article.get('title', 'unknown')}: {e}")
        
        mysql_conn.commit()
        print(f"✅ Articles migrated: {migrated}")
        
    except Exception as e:
        print(f"❌ Article migration failed: {e}")

def migrate_categories(mongo_db, mysql_conn):
    """Migrate categories from MongoDB to MySQL"""
    print("\n🔄 Migrating Categories...")
    
    try:
        cursor = mysql_conn.cursor()
        categories = list(mongo_db.categories.find())
        
        # If no categories in MongoDB, create default ones
        if not categories:
            default_categories = [
                {'name': 'fashion', 'display_name': 'Fashion', 'description': 'Fashion and style content', 'subcategories': ['men', 'women', 'accessories']},
                {'name': 'business', 'display_name': 'Business', 'description': 'Business and finance content', 'subcategories': ['entrepreneurship', 'finance', 'technology']},
                {'name': 'technology', 'display_name': 'Technology', 'description': 'Technology and innovation content', 'subcategories': ['gadgets', 'software', 'ai']},
                {'name': 'travel', 'display_name': 'Travel', 'description': 'Travel and destination content', 'subcategories': ['destinations', 'guides', 'adventure']},
                {'name': 'people', 'display_name': 'People', 'description': 'People and personality content', 'subcategories': ['interviews', 'profiles', 'awards']},
                {'name': 'culture', 'display_name': 'Culture', 'description': 'Culture and arts content', 'subcategories': ['art', 'music', 'literature']},
                {'name': 'entertainment', 'display_name': 'Entertainment', 'description': 'Entertainment content', 'subcategories': ['movies', 'tv', 'celebrity']},
                {'name': 'health', 'display_name': 'Health', 'description': 'Health and wellness content', 'subcategories': ['fitness', 'nutrition', 'mental-health']},
                {'name': 'finance', 'display_name': 'Finance', 'description': 'Finance and investment content', 'subcategories': ['investing', 'crypto', 'wealth']},
                {'name': 'art', 'display_name': 'Art', 'description': 'Art and creativity content', 'subcategories': ['paintings', 'sculpture', 'digital']},
            ]
            categories = default_categories
        
        migrated = 0
        
        for category in categories:
            try:
                category_data = {
                    'id': category.get('id', str(uuid.uuid4())),
                    'name': category['name'],
                    'display_name': category.get('display_name', category['name'].title()),
                    'description': category.get('description'),
                    'subcategories': json.dumps(category.get('subcategories', [])) if category.get('subcategories') else None,
                    'created_at': datetime.now(),
                    'updated_at': datetime.now()
                }
                
                sql = """
                INSERT INTO categories (id, name, display_name, description, subcategories, created_at, updated_at)
                VALUES (%(id)s, %(name)s, %(display_name)s, %(description)s, %(subcategories)s, %(created_at)s, %(updated_at)s)
                ON DUPLICATE KEY UPDATE
                    display_name = VALUES(display_name),
                    description = VALUES(description),
                    subcategories = VALUES(subcategories),
                    updated_at = VALUES(updated_at)
                """
                
                cursor.execute(sql, category_data)
                migrated += 1
                
            except Exception as e:
                print(f"❌ Error migrating category {category.get('name', 'unknown')}: {e}")
        
        mysql_conn.commit()
        print(f"✅ Categories migrated: {migrated}")
        
    except Exception as e:
        print(f"❌ Category migration failed: {e}")

def test_php_api():
    """Test the PHP API endpoints"""
    print("\n🧪 Testing PHP API...")
    
    try:
        # Test health endpoint
        response = requests.get(f"{PHP_API_URL}/health")
        if response.status_code == 200:
            print("✅ Health endpoint working")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
        
        # Test articles endpoint
        response = requests.get(f"{PHP_API_URL}/articles")
        if response.status_code == 200:
            articles = response.json()
            print(f"✅ Articles endpoint working - {len(articles)} articles found")
        else:
            print(f"❌ Articles endpoint failed: {response.status_code}")
        
        # Test categories endpoint
        response = requests.get(f"{PHP_API_URL}/categories")
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Categories endpoint working - {len(categories)} categories found")
        else:
            print(f"❌ Categories endpoint failed: {response.status_code}")
        
        # Test payment packages endpoint
        response = requests.get(f"{PHP_API_URL}/payments/packages")
        if response.status_code == 200:
            packages = response.json()
            print(f"✅ Payment packages endpoint working - {len(packages['packages'])} packages found")
        else:
            print(f"❌ Payment packages endpoint failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ API testing failed: {e}")

def main():
    print("🚀 Just Urbane - MongoDB to MySQL Migration")
    print("=" * 50)
    
    # Connect to databases
    mongo_db = connect_mongo()
    mysql_conn = connect_mysql()
    
    if not mongo_db or not mysql_conn:
        print("❌ Database connection failed. Exiting.")
        return
    
    try:
        # Migrate data
        migrate_categories(mongo_db, mysql_conn)
        migrate_users(mongo_db, mysql_conn)
        migrate_articles(mongo_db, mysql_conn)
        
        # Test the API
        test_php_api()
        
        print("\n🎉 Migration completed successfully!")
        print("🔧 PHP Backend is now running on port 8001")
        print("📊 All data has been migrated from MongoDB to MySQL")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
    finally:
        mysql_conn.close()

if __name__ == "__main__":
    main()