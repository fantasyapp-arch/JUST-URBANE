#!/usr/bin/env python3
"""
Complete Database Export Script - All Data from MongoDB to MySQL
"""

import os
import json
from datetime import datetime
from pymongo import MongoClient

# Database connection  
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(MONGO_URL)
db = client.just_urbane

def main():
    """Export complete database to SQL"""
    print("🚀 Starting Complete Just Urbane Database Export...")
    
    # Create database directory
    os.makedirs('/app/database', exist_ok=True)
    
    # Export all collections to JSON first (for backup)
    collections = ['users', 'articles', 'categories', 'orders', 'transactions', 'homepage_config']
    
    for collection_name in collections:
        print(f"📤 Exporting {collection_name}...")
        collection = db[collection_name]
        data = list(collection.find({}))
        
        # Convert ObjectId to string for JSON serialization
        for item in data:
            if '_id' in item:
                item['_id'] = str(item['_id'])
        
        # Save as JSON
        with open(f'/app/database/{collection_name}.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, default=str)
        
        print(f"✅ {collection_name}: {len(data)} records exported")
    
    # Create comprehensive SQL file
    create_complete_sql()
    
    print("\n🎉 DATABASE EXPORT COMPLETED!")
    print("📁 Files created in /app/database/:")
    for file in os.listdir('/app/database'):
        print(f"   - {file}")

def create_complete_sql():
    """Create complete SQL file with all data"""
    print("📝 Creating complete SQL file...")
    
    sql_content = """-- Just Urbane Complete Database Export
-- Generated: {}
-- Production ready MySQL database

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Create database
CREATE DATABASE IF NOT EXISTS `just_urbane` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `just_urbane`;

""".format(datetime.now())

    # Add table structures
    sql_content += """
-- Table structure for users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `is_premium` tinyint(1) DEFAULT '0',
  `subscription_type` varchar(50) DEFAULT NULL,
  `subscription_status` varchar(50) DEFAULT NULL,
  `subscription_expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for articles
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` varchar(36) NOT NULL,
  `title` varchar(500) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `body` longtext NOT NULL,
  `summary` text,
  `hero_image` varchar(500) DEFAULT NULL,
  `author_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `trending` tinyint(1) DEFAULT '0',
  `premium` tinyint(1) DEFAULT '0',
  `is_premium` tinyint(1) DEFAULT '0',
  `views` int(11) DEFAULT '0',
  `reading_time` int(11) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category`),
  KEY `idx_featured` (`featured`),
  KEY `idx_premium` (`premium`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `description` text,
  `subcategories` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` varchar(36) NOT NULL,
  `razorpay_order_id` varchar(100) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `customer_details` json NOT NULL,
  `package_id` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `status` varchar(20) DEFAULT 'created',
  `payment_method` varchar(20) DEFAULT 'razorpay',
  `razorpay_payment_id` varchar(100) DEFAULT NULL,
  `razorpay_signature` varchar(255) DEFAULT NULL,
  `webhook_received` tinyint(1) DEFAULT '0',
  `webhook_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `razorpay_order_id` (`razorpay_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for transactions
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `customer_details` json NOT NULL,
  `razorpay_order_id` varchar(100) NOT NULL,
  `razorpay_payment_id` varchar(100) NOT NULL,
  `package_id` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `status` varchar(20) DEFAULT 'success',
  `payment_method` varchar(20) DEFAULT 'razorpay',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for homepage_config
DROP TABLE IF EXISTS `homepage_config`;
CREATE TABLE `homepage_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hero_article` varchar(36) DEFAULT NULL,
  `featured_articles` json DEFAULT NULL,
  `trending_articles` json DEFAULT NULL,
  `latest_articles` json DEFAULT NULL,
  `fashion_articles` json DEFAULT NULL,
  `people_articles` json DEFAULT NULL,
  `business_articles` json DEFAULT NULL,
  `technology_articles` json DEFAULT NULL,
  `travel_articles` json DEFAULT NULL,
  `culture_articles` json DEFAULT NULL,
  `entertainment_articles` json DEFAULT NULL,
  `food_articles` json DEFAULT NULL,
  `luxury_articles` json DEFAULT NULL,
  `active` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

"""

    # Add data for each table
    sql_content += add_data_inserts()
    
    # Add final SQL
    sql_content += """
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
"""
    
    # Save SQL file
    with open('/app/database/complete_database.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print("✅ Complete SQL file created: complete_database.sql")

def add_data_inserts():
    """Generate INSERT statements for all data"""
    inserts = ""
    
    # Users data
    users = list(db.users.find({}))
    if users:
        inserts += "\n-- Users data\n"
        for user in users:
            user_id = user.get('id', '')
            email = user.get('email', '').replace("'", "\\'")
            full_name = user.get('full_name', '').replace("'", "\\'")
            password = user.get('hashed_password', '').replace("'", "\\'")
            is_premium = 1 if user.get('is_premium') else 0
            sub_type = user.get('subscription_type', '')
            if sub_type:
                sub_type = f"'{sub_type}'"
            else:
                sub_type = 'NULL'
            sub_status = user.get('subscription_status', '')
            if sub_status:
                sub_status = f"'{sub_status}'"
            else:
                sub_status = 'NULL'
            
            created_at = user.get('created_at', datetime.now())
            if isinstance(created_at, datetime):
                created_at = created_at.strftime('%Y-%m-%d %H:%M:%S')
            else:
                created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            inserts += f"INSERT INTO `users` (`id`, `email`, `full_name`, `hashed_password`, `is_premium`, `subscription_type`, `subscription_status`, `created_at`) VALUES ('{user_id}', '{email}', '{full_name}', '{password}', {is_premium}, {sub_type}, {sub_status}, '{created_at}');\n"
    
    # Articles data  
    articles = list(db.articles.find({}))
    if articles:
        inserts += "\n-- Articles data\n"
        for article in articles:
            article_id = article.get('id', '')
            title = article.get('title', '').replace("'", "\\'")
            slug = article.get('slug', '') or 'NULL'
            if slug != 'NULL':
                slug = f"'{slug.replace(chr(39), chr(92)+chr(39))}'"
            body = article.get('body', '').replace("'", "\\'").replace('\n', '\\n').replace('\r', '\\r')
            summary = article.get('summary', '') or 'NULL'
            if summary != 'NULL':
                summary = f"'{summary.replace(chr(39), chr(92)+chr(39))}'"
            hero_image = article.get('hero_image', '') or 'NULL'
            if hero_image != 'NULL':
                hero_image = f"'{hero_image}'"
            author = article.get('author_name', '').replace("'", "\\'")
            category = article.get('category', '').replace("'", "\\'")
            subcategory = article.get('subcategory', '') or 'NULL'
            if subcategory != 'NULL':
                subcategory = f"'{subcategory}'"
            
            tags = article.get('tags', [])
            if tags:
                tags_json = json.dumps(tags).replace("'", "\\'")
                tags = f"'{tags_json}'"
            else:
                tags = 'NULL'
            
            featured = 1 if article.get('featured') else 0
            trending = 1 if article.get('trending') else 0
            premium = 1 if article.get('premium') else 0
            is_premium = 1 if article.get('is_premium') else 0
            views = article.get('views', 0)
            reading_time = article.get('reading_time') or 'NULL'
            
            published_at = article.get('published_at', datetime.now())
            if isinstance(published_at, datetime):
                published_at = published_at.strftime('%Y-%m-%d %H:%M:%S')
            else:
                published_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            created_at = article.get('created_at', datetime.now())
            if isinstance(created_at, datetime):
                created_at = created_at.strftime('%Y-%m-%d %H:%M:%S')
            else:
                created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            inserts += f"INSERT INTO `articles` (`id`, `title`, `slug`, `body`, `summary`, `hero_image`, `author_name`, `category`, `subcategory`, `tags`, `featured`, `trending`, `premium`, `is_premium`, `views`, `reading_time`, `published_at`, `created_at`) VALUES ('{article_id}', '{title}', {slug}, '{body}', {summary}, {hero_image}, '{author}', '{category}', {subcategory}, {tags}, {featured}, {trending}, {premium}, {is_premium}, {views}, {reading_time}, '{published_at}', '{created_at}');\n"
    
    return inserts

if __name__ == "__main__":
    main()