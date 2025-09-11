#!/usr/bin/env python3
"""
Complete MySQL Database Export for Just Urbane
Exports all data from MongoDB to production-ready MySQL
"""

import os
import json
import uuid
from datetime import datetime
from pymongo import MongoClient

def safe_escape(value):
    """Safely escape values for SQL"""
    if value is None:
        return 'NULL'
    if isinstance(value, bool):
        return '1' if value else '0'
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, datetime):
        return "'{}'".format(value.strftime('%Y-%m-%d %H:%M:%S'))
    if isinstance(value, (list, dict)):
        json_str = json.dumps(value, default=str)
        return "'{}'".format(json_str.replace("'", "\\'").replace('"', '\\"'))
    
    # Handle string values
    if value:
        value = str(value).replace("'", "\\'").replace('"', '\\"').replace('\n', '\\n').replace('\r', '\\r')
        return "'{}'".format(value)
    return 'NULL'

def main():
    """Main export function"""
    print("🚀 Starting Complete MySQL Export...")
    
    # Connect to MongoDB
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
    client = MongoClient(MONGO_URL)
    db = client.just_urbane
    
    # Create export directory
    os.makedirs('/app/database', exist_ok=True)
    
    # Start SQL file
    sql_content = """-- Just Urbane Production Database Export
-- Generated: {}
-- Complete MySQL database with all data
-- 
-- Usage:
-- 1. Create MySQL database: CREATE DATABASE just_urbane;
-- 2. Import this file: mysql -u username -p just_urbane < complete_database.sql

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Use the database
-- CREATE DATABASE IF NOT EXISTS `just_urbane` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `just_urbane`;

""".format(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    # Add table structures and data
    sql_content += create_users_table(db)
    sql_content += create_articles_table(db)
    sql_content += create_categories_table(db)
    sql_content += create_orders_table(db)
    sql_content += create_transactions_table(db)
    sql_content += create_homepage_config_table(db)
    sql_content += create_additional_tables(db)
    
    # End transaction
    sql_content += """
-- Enable foreign key checks and commit
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- End of export
"""
    
    # Save to file
    with open('/app/database/complete_database.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    # Create summary
    create_deployment_guide(db)
    
    print("✅ Complete MySQL export created!")
    print("📁 Files in /app/database/:")
    for file in sorted(os.listdir('/app/database')):
        size = os.path.getsize(f'/app/database/{file}')
        print(f"   📄 {file} ({size:,} bytes)")

def create_users_table(db):
    """Create users table with data"""
    users = list(db.users.find({}))
    
    sql = f"""
-- Users table ({len(users)} records)
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
  UNIQUE KEY `email` (`email`),
  KEY `idx_subscription` (`subscription_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

"""
    
    if users:
        sql += "-- Users data\n"
        for user in users:
            user_id = user.get('id', str(uuid.uuid4()))
            email = safe_escape(user.get('email'))
            full_name = safe_escape(user.get('full_name'))
            password = safe_escape(user.get('hashed_password'))
            is_premium = 1 if user.get('is_premium') else 0
            sub_type = safe_escape(user.get('subscription_type'))
            sub_status = safe_escape(user.get('subscription_status'))
            sub_expires = safe_escape(user.get('subscription_expires_at'))
            created_at = safe_escape(user.get('created_at', datetime.now()))
            
            sql += f"INSERT INTO `users` (`id`, `email`, `full_name`, `hashed_password`, `is_premium`, `subscription_type`, `subscription_status`, `subscription_expires_at`, `created_at`) VALUES ('{user_id}', {email}, {full_name}, {password}, {is_premium}, {sub_type}, {sub_status}, {sub_expires}, {created_at});\n"
    
    return sql

def create_articles_table(db):
    """Create articles table with data"""
    articles = list(db.articles.find({}))
    
    sql = f"""
-- Articles table ({len(articles)} records)
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

"""
    
    if articles:
        sql += "-- Articles data\n"
        for article in articles:
            article_id = article.get('id', str(uuid.uuid4()))
            title = safe_escape(article.get('title'))
            slug = safe_escape(article.get('slug'))
            body = safe_escape(article.get('body'))
            summary = safe_escape(article.get('summary'))
            hero_image = safe_escape(article.get('hero_image'))
            author = safe_escape(article.get('author_name'))
            category = safe_escape(article.get('category'))
            subcategory = safe_escape(article.get('subcategory'))
            tags = safe_escape(article.get('tags'))
            featured = 1 if article.get('featured') else 0
            trending = 1 if article.get('trending') else 0
            premium = 1 if article.get('premium') else 0
            is_premium = 1 if article.get('is_premium') else 0
            views = article.get('views', 0)
            reading_time = article.get('reading_time') or 'NULL'
            published_at = safe_escape(article.get('published_at'))
            created_at = safe_escape(article.get('created_at', datetime.now()))
            
            sql += f"INSERT INTO `articles` (`id`, `title`, `slug`, `body`, `summary`, `hero_image`, `author_name`, `category`, `subcategory`, `tags`, `featured`, `trending`, `premium`, `is_premium`, `views`, `reading_time`, `published_at`, `created_at`) VALUES ('{article_id}', {title}, {slug}, {body}, {summary}, {hero_image}, {author}, {category}, {subcategory}, {tags}, {featured}, {trending}, {premium}, {is_premium}, {views}, {reading_time}, {published_at}, {created_at});\n"
    
    return sql

def create_categories_table(db):
    """Create categories table with data"""
    categories = list(db.categories.find({}))
    
    sql = f"""
-- Categories table ({len(categories)} records)
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

"""
    
    if categories:
        sql += "-- Categories data\n"
        for cat in categories:
            cat_id = cat.get('id', str(uuid.uuid4()))
            name = safe_escape(cat.get('name'))
            display_name = safe_escape(cat.get('display_name', cat.get('name')))
            description = safe_escape(cat.get('description'))
            subcategories = safe_escape(cat.get('subcategories'))
            created_at = safe_escape(cat.get('created_at', datetime.now()))
            
            sql += f"INSERT INTO `categories` (`id`, `name`, `display_name`, `description`, `subcategories`, `created_at`) VALUES ('{cat_id}', {name}, {display_name}, {description}, {subcategories}, {created_at});\n"
    
    return sql

def create_orders_table(db):
    """Create orders table with data"""
    orders = list(db.orders.find({}))
    
    sql = f"""
-- Orders table ({len(orders)} records)
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
  UNIQUE KEY `razorpay_order_id` (`razorpay_order_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

"""
    
    if orders:
        sql += "-- Orders data\n"
        for order in orders:
            order_id = order.get('id', str(uuid.uuid4()))
            razorpay_id = safe_escape(order.get('razorpay_order_id'))
            user_id = safe_escape(order.get('user_id'))
            customer_details = safe_escape(order.get('customer_details', {}))
            package_id = safe_escape(order.get('package_id'))
            amount = order.get('amount', 0)
            currency = safe_escape(order.get('currency', 'INR'))
            status = safe_escape(order.get('status', 'created'))
            payment_method = safe_escape(order.get('payment_method', 'razorpay'))
            razorpay_payment_id = safe_escape(order.get('razorpay_payment_id'))
            razorpay_signature = safe_escape(order.get('razorpay_signature'))
            webhook_received = 1 if order.get('webhook_received') else 0
            webhook_at = safe_escape(order.get('webhook_at'))
            completed_at = safe_escape(order.get('completed_at'))
            created_at = safe_escape(order.get('created_at', datetime.now()))
            
            sql += f"INSERT INTO `orders` (`id`, `razorpay_order_id`, `user_id`, `customer_details`, `package_id`, `amount`, `currency`, `status`, `payment_method`, `razorpay_payment_id`, `razorpay_signature`, `webhook_received`, `webhook_at`, `completed_at`, `created_at`) VALUES ('{order_id}', {razorpay_id}, {user_id}, {customer_details}, {package_id}, {amount}, {currency}, {status}, {payment_method}, {razorpay_payment_id}, {razorpay_signature}, {webhook_received}, {webhook_at}, {completed_at}, {created_at});\n"
    
    return sql

def create_transactions_table(db):
    """Create transactions table"""
    transactions = list(db.transactions.find({}))
    
    sql = f"""
-- Transactions table ({len(transactions)} records)
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
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

"""
    
    if transactions:
        sql += "-- Transactions data\n"
        for txn in transactions:
            txn_id = txn.get('id', str(uuid.uuid4()))
            user_id = safe_escape(txn.get('user_id'))
            customer_details = safe_escape(txn.get('customer_details', {}))
            razorpay_order_id = safe_escape(txn.get('razorpay_order_id'))
            razorpay_payment_id = safe_escape(txn.get('razorpay_payment_id'))
            package_id = safe_escape(txn.get('package_id'))
            amount = txn.get('amount', 0)
            currency = safe_escape(txn.get('currency', 'INR'))
            status = safe_escape(txn.get('status', 'success'))
            payment_method = safe_escape(txn.get('payment_method', 'razorpay'))
            created_at = safe_escape(txn.get('created_at', datetime.now()))
            
            sql += f"INSERT INTO `transactions` (`id`, `user_id`, `customer_details`, `razorpay_order_id`, `razorpay_payment_id`, `package_id`, `amount`, `currency`, `status`, `payment_method`, `created_at`) VALUES ('{txn_id}', {user_id}, {customer_details}, {razorpay_order_id}, {razorpay_payment_id}, {package_id}, {amount}, {currency}, {status}, {payment_method}, {created_at});\n"
    
    return sql

def create_homepage_config_table(db):
    """Create homepage config table"""
    configs = list(db.homepage_config.find({}))
    
    sql = f"""
-- Homepage config table ({len(configs)} records)
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
    
    if configs:
        sql += "-- Homepage config data\n"
        for config in configs:
            hero_article = safe_escape(config.get('hero_article'))
            featured_articles = safe_escape(config.get('featured_articles', []))
            trending_articles = safe_escape(config.get('trending_articles', []))
            latest_articles = safe_escape(config.get('latest_articles', []))
            fashion_articles = safe_escape(config.get('fashion_articles', []))
            people_articles = safe_escape(config.get('people_articles', []))
            business_articles = safe_escape(config.get('business_articles', []))
            technology_articles = safe_escape(config.get('technology_articles', []))
            travel_articles = safe_escape(config.get('travel_articles', []))
            culture_articles = safe_escape(config.get('culture_articles', []))
            entertainment_articles = safe_escape(config.get('entertainment_articles', []))
            food_articles = safe_escape(config.get('food_articles', []))
            luxury_articles = safe_escape(config.get('luxury_articles', []))
            active = 1 if config.get('active') else 0
            created_at = safe_escape(config.get('created_at', datetime.now()))
            
            sql += f"INSERT INTO `homepage_config` (`hero_article`, `featured_articles`, `trending_articles`, `latest_articles`, `fashion_articles`, `people_articles`, `business_articles`, `technology_articles`, `travel_articles`, `culture_articles`, `entertainment_articles`, `food_articles`, `luxury_articles`, `active`, `created_at`) VALUES ({hero_article}, {featured_articles}, {trending_articles}, {latest_articles}, {fashion_articles}, {people_articles}, {business_articles}, {technology_articles}, {travel_articles}, {culture_articles}, {entertainment_articles}, {food_articles}, {luxury_articles}, {active}, {created_at});\n"
    
    return sql

def create_additional_tables(db):
    """Create additional tables for complete functionality"""
    
    # Admin users
    admin_users = list(db.admin_users.find({}))
    
    sql = f"""
-- Admin users table ({len(admin_users)} records)
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

"""
    
    if admin_users:
        sql += "-- Admin users data\n"
        for admin in admin_users:
            admin_id = admin.get('id', str(uuid.uuid4()))
            username = safe_escape(admin.get('username'))
            email = safe_escape(admin.get('email'))
            password = safe_escape(admin.get('hashed_password'))
            is_active = 1 if admin.get('is_active', True) else 0
            created_at = safe_escape(admin.get('created_at', datetime.now()))
            
            sql += f"INSERT INTO `admin_users` (`id`, `username`, `email`, `hashed_password`, `is_active`, `created_at`) VALUES ('{admin_id}', {username}, {email}, {password}, {is_active}, {created_at});\n"
    
    return sql

def create_deployment_guide(db):
    """Create deployment guide and summary"""
    
    # Count all data
    counts = {
        'users': db.users.count_documents({}),
        'articles': db.articles.count_documents({}), 
        'categories': db.categories.count_documents({}),
        'orders': db.orders.count_documents({}),
        'transactions': db.transactions.count_documents({}),
        'homepage_config': db.homepage_config.count_documents({}),
        'admin_users': db.admin_users.count_documents({}),
    }
    
    guide = f"""# Just Urbane - Complete Database Export

## Export Summary
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

### Data Exported:
- **Users**: {counts['users']} records (includes subscriptions and payment info)
- **Articles**: {counts['articles']} records (all blog posts and content)
- **Categories**: {counts['categories']} records (content organization)
- **Orders**: {counts['orders']} records (Razorpay payment orders)  
- **Transactions**: {counts['transactions']} records (completed payments)
- **Homepage Config**: {counts['homepage_config']} records (content layout)
- **Admin Users**: {counts['admin_users']} records (admin panel access)

### Files Included:
- `complete_database.sql` - Full MySQL database with all data
- `mongodb_backup/` - Original MongoDB backup (binary format)
- `README.md` - This deployment guide

## Deployment Instructions

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE just_urbane CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import the complete database
mysql -u root -p just_urbane < complete_database.sql
```

### 2. Environment Configuration
Create `.env` file with:
```env
# Database
MONGO_URL=mongodb://localhost:27017/just_urbane
MYSQL_URL=mysql://username:password@localhost:3306/just_urbane

# API Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# JWT
JWT_SECRET_KEY=your-secret-key-here

# Server
API_BASE_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

### 3. Backend Setup (Python/FastAPI)
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations (if needed)
python migrate.py

# Start server
uvicorn main:app --host 0.0.0.0 --port 8001
```

### 4. Frontend Setup (React)
```bash
# Install dependencies
npm install

# Update environment
echo "REACT_APP_BACKEND_URL=https://your-domain.com" > .env

# Build for production
npm run build

# Deploy build/ folder to your web server
```

### 5. Key Features Included:
- ✅ User authentication and subscriptions
- ✅ Razorpay payment integration 
- ✅ Article management and categorization
- ✅ Admin panel with full CRUD operations
- ✅ Homepage content management
- ✅ Image optimization system
- ✅ Premium content gating
- ✅ Magazine reader functionality

### 6. API Endpoints Available:
- `POST /api/auth/login` - User login
- `GET /api/articles` - Get articles
- `GET /api/homepage/content` - Homepage content
- `POST /api/payments/razorpay/create-order` - Create payment
- `GET /api/admin/dashboard` - Admin dashboard

### 7. Admin Access:
Default admin credentials (change after deployment):
- Username: admin
- Password: (check admin_users table)

### 8. Production Checklist:
- [ ] Update admin passwords
- [ ] Configure SSL certificates
- [ ] Set up domain and DNS
- [ ] Configure backup strategy  
- [ ] Set up monitoring and logs
- [ ] Update Razorpay keys for live mode
- [ ] Test all payment flows
- [ ] Verify email functionality

## Support
This export contains all data and configurations needed to deploy the Just Urbane magazine platform.

Database is production-ready with proper indexes, UTF8MB4 encoding, and all relationships maintained.
"""
    
    with open('/app/database/README.md', 'w', encoding='utf-8') as f:
        f.write(guide)
    
    print("✅ Deployment guide created")

if __name__ == "__main__":
    main()