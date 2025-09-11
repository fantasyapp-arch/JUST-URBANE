# Just Urbane PHP Backend Deployment Guide

## Overview
This guide helps you deploy the Just Urbane PHP/CodeIgniter backend to replace the current Python/FastAPI backend while maintaining full admin panel functionality.

## Current Status
✅ **PHP Backend Structure**: Complete CodeIgniter 4 backend with all admin functionality
✅ **Database Models**: All required models (Articles, Users, Issues, Media, Admin Users, etc.)
✅ **API Controllers**: Complete admin API matching Python backend endpoints
✅ **Authentication**: JWT-based admin authentication system
✅ **File Uploads**: Media management system with file upload support
✅ **Database Migrations**: All required database tables and structures

## Prerequisites
1. PHP 8.1+ with extensions:
   - mysqli
   - json
   - mbstring
   - curl
   - gd (for image processing)
2. MySQL 8.0+ or MariaDB 10.4+
3. Composer (PHP package manager)
4. Web server (Apache/Nginx) with PHP-FPM

## Installation Steps

### 1. Set Up Database
```sql
CREATE DATABASE just_urbane_php CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'urbane_user'@'localhost' IDENTIFIED BY 'urbane_password';
GRANT ALL PRIVILEGES ON just_urbane_php.* TO 'urbane_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Install PHP Dependencies
```bash
cd /app/backend_php
composer install
```

### 3. Environment Configuration
Update `/app/backend_php/.env`:
```
# Database
database.default.hostname = localhost
database.default.database = just_urbane_php
database.default.username = urbane_user
database.default.password = urbane_password
database.default.DBDriver = MySQLi
database.default.port = 3306

# JWT Secret (change this!)
jwt.secret_key = your-unique-secret-key-here

# Razorpay Configuration
razorpay.key_id = your_razorpay_key_id
razorpay.key_secret = your_razorpay_key_secret
```

### 4. Run Database Migrations
```bash
cd /app/backend_php
php spark migrate
```

This will create all required tables:
- `users` - Customer users and subscriptions
- `admin_users` - Admin panel users  
- `articles` - Magazine articles and blog posts
- `issues` - Digital magazine issues
- `categories` - Content categories
- `media_files` - Uploaded media files
- `orders` - Payment orders
- `transactions` - Completed payments
- `homepage_config` - Homepage content configuration

### 5. Default Admin User
The migration automatically creates a default admin user:
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@justurbane.com`

**⚠️ IMPORTANT**: Change the admin password immediately after first login!

### 6. Web Server Configuration

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?/$1 [L]
```

#### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### 7. File Permissions
```bash
chmod -R 755 /app/backend_php/
chmod -R 777 /app/backend_php/writable/
```

### 8. Update Frontend Configuration
Update `/app/frontend/.env`:
```
REACT_APP_BACKEND_URL=https://your-php-backend-domain.com
```

## API Endpoints

### Admin Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin user

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics

### Article Management
- `GET /api/admin/articles` - List all articles
- `GET /api/admin/articles/{id}` - Get single article
- `POST /api/admin/articles` - Create new article
- `PUT /api/admin/articles/{id}` - Update article
- `DELETE /api/admin/articles/{id}` - Delete article

### Magazine Management
- `GET /api/admin/magazines` - List all magazines
- `GET /api/admin/magazines/{id}` - Get single magazine
- `POST /api/admin/magazines` - Create new magazine
- `PUT /api/admin/magazines/{id}` - Update magazine
- `DELETE /api/admin/magazines/{id}` - Delete magazine
- `POST /api/admin/magazines/upload-cover` - Upload cover image

### Media Management
- `GET /api/admin/media` - List all media files
- `GET /api/admin/media/{id}` - Get single media file
- `POST /api/admin/media/upload` - Upload media files
- `DELETE /api/admin/media/{id}` - Delete media file
- `GET /api/admin/media/stats/overview` - Media statistics

### Homepage Management
- `GET /api/admin/homepage/content` - Get homepage configuration
- `GET /api/admin/homepage/articles/available` - Get available articles
- `PUT /api/admin/homepage/hero` - Update hero article
- `PUT /api/admin/homepage/section/{section}` - Update homepage section
- `POST /api/admin/homepage/auto-populate` - Auto-populate homepage

## Data Migration

### From Python/MongoDB to PHP/MySQL
1. Export existing data from MongoDB
2. Import using the provided migration scripts
3. Run data transformation scripts

### Migration Scripts Available
- `/app/complete_export.py` - Export all MongoDB data to JSON
- `/app/final_export.py` - Export to MySQL-compatible SQL format
- `/app/database/complete_database.sql` - Ready-to-import SQL file

## Testing

### Backend API Testing
```bash
# Health check
curl -X GET http://your-domain.com/api/health

# Admin login
curl -X POST http://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get dashboard stats (requires auth token)
curl -X GET http://your-domain.com/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Testing
1. Update `REACT_APP_BACKEND_URL` in `/app/frontend/.env`
2. Build and deploy frontend: `npm run build`
3. Test admin panel access at `/admin/login`

## Production Deployment

### Security Checklist
- [ ] Change default admin password
- [ ] Update JWT secret key
- [ ] Configure proper CORS settings
- [ ] Set up SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set proper file permissions
- [ ] Enable PHP error logging
- [ ] Configure backup strategy

### Performance Optimization
- [ ] Enable PHP OPcache
- [ ] Configure MySQL query cache  
- [ ] Set up Redis for session storage
- [ ] Configure CDN for media files
- [ ] Enable gzip compression
- [ ] Optimize database indexes

## Troubleshooting

### Common Issues
1. **500 Internal Server Error**: Check PHP error logs
2. **Database Connection Failed**: Verify MySQL credentials
3. **JWT Token Invalid**: Check JWT secret key configuration
4. **File Upload Failed**: Check directory permissions
5. **CORS Issues**: Update CORS configuration in .env

### Debug Mode
Enable debug mode in `.env`:
```
CI_ENVIRONMENT = development
```

### Log Files
- PHP errors: `/var/log/php/error.log`
- CodeIgniter logs: `/app/backend_php/writable/logs/`
- Web server logs: `/var/log/apache2/` or `/var/log/nginx/`

## Support
For technical support, check:
1. CodeIgniter 4 documentation
2. PHP official documentation  
3. MySQL documentation
4. Application-specific logs

## Migration Completion Checklist
- [ ] PHP backend deployed and running
- [ ] Database tables created successfully
- [ ] Default admin user created
- [ ] All API endpoints responding correctly
- [ ] Frontend updated to use PHP backend
- [ ] Admin panel login working
- [ ] All admin functions operational
- [ ] Data successfully migrated from Python backend
- [ ] Production security measures implemented
- [ ] Backup and monitoring systems in place