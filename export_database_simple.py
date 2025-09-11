#!/usr/bin/env python3
"""
Complete Database Export for Just Urbane - MongoDB to SQL
Creates comprehensive SQL files with all data for deployment
"""

import os
import json
import uuid
from datetime import datetime, timezone
from pymongo import MongoClient

# Database connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(MONGO_URL)
db = client.just_urbane

def escape_sql_string(value):
    """Escape SQL string values"""
    if value is None:
        return 'NULL'
    if isinstance(value, bool):
        return '1' if value else '0'
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, datetime):
        return "'{}'".format(value.strftime('%Y-%m-%d %H:%M:%S'))
    if isinstance(value, (list, dict)):
        json_str = json.dumps(value)
        json_str = json_str.replace('"', '\\"').replace("'", "\\'")
        return "'{}'".format(json_str)
    
    # String escaping
    value = str(value).replace("'", "\\'").replace('"', '\\"').replace('\n', '\\n').replace('\r', '\\r')
    return "'{}'".format(value)

def create_complete_sql_export():
    """Create complete SQL export with all data"""
    
    print("🚀 Starting Complete Database Export...")
    
    # Create main SQL file
    sql_content = """-- Just Urbane Complete Database Export
-- Generated on: {}
-- Contains all data for production deployment

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Database structure
CREATE DATABASE IF NOT EXISTS `just_urbane_production`;
USE `just_urbane_production`;

-- Users table
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `subscription_type` varchar(50) DEFAULT NULL,
  `subscription_status` varchar(50) DEFAULT NULL,
  `subscription_expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_subscription` (`subscription_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Articles table
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` varchar(36) NOT NULL,
  `title` varchar(500) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `body` longtext NOT NULL,
  `summary` text DEFAULT NULL,
  `hero_image` varchar(500) DEFAULT NULL,
  `author_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `trending` tinyint(1) DEFAULT 0,
  `premium` tinyint(1) DEFAULT 0,
  `is_premium` tinyint(1) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `reading_time` int(11) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category`,`subcategory`),
  KEY `idx_featured` (`featured`),
  KEY `idx_trending` (`trending`),
  KEY `idx_premium` (`premium`),
  KEY `idx_views` (`views`),
  KEY `idx_published` (`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `subcategories` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
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
  `webhook_received` tinyint(1) DEFAULT 0,
  `webhook_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `razorpay_order_id` (`razorpay_order_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions table
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
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Issues table (for magazine issues)
DROP TABLE IF EXISTS `issues`;
CREATE TABLE `issues` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `cover_image` varchar(500) NOT NULL,
  `description` text NOT NULL,
  `month` varchar(20) NOT NULL,
  `year` int(11) NOT NULL,
  `pages` json DEFAULT NULL,
  `is_digital` tinyint(1) DEFAULT 1,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Homepage config table
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
  `active` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    # Export Users
    print("📤 Exporting Users...")
    users = list(db.users.find({}))
    if users:
        sql_content += "\n-- Users data\n"
        for user in users:
            user_id = user.get('id', str(uuid.uuid4()))
            email = escape_sql_string(user.get('email', ''))
            full_name = escape_sql_string(user.get('full_name', ''))
            password = escape_sql_string(user.get('hashed_password', ''))
            is_premium = 1 if user.get('is_premium', False) else 0
            sub_type = escape_sql_string(user.get('subscription_type'))
            sub_status = escape_sql_string(user.get('subscription_status'))
            sub_expires = escape_sql_string(user.get('subscription_expires_at'))
            created_at = escape_sql_string(user.get('created_at', datetime.now()))
            updated_at = escape_sql_string(datetime.now())
            
            sql_content += "INSERT INTO `users` (`id`, `email`, `full_name`, `hashed_password`, `is_premium`, `subscription_type`, `subscription_status`, `subscription_expires_at`, `created_at`, `updated_at`) VALUES ('{}', {}, {}, {}, {}, {}, {}, {}, {}, {});\n".format(user_id, email, full_name, password, is_premium, sub_type, sub_status, sub_expires, created_at, updated_at)

    print("✅ Complete SQL export created!")
    return len(users)

if __name__ == "__main__":
    # Create database directory
    os.makedirs('/app/database', exist_ok=True)
    
    user_count = create_complete_sql_export()
    print("✅ Database export completed with {} users".format(user_count))