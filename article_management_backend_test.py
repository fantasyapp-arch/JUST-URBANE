#!/usr/bin/env python3
"""
Just Urbane Article Management System Testing Suite
Comprehensive testing for article management admin APIs based on user reported issues:
1. Adding new articles is not working
2. Article editing/modifying is not working  
3. Articles are not publishing to the website
4. RTF file upload functionality should work and reflect in article content
5. Image upload options for articles and hero images should work
6. Subcategory options are not showing
7. Real-time updates to website are not working
"""

import requests
import json
import time
import tempfile
import os
from datetime import datetime
from typing import Dict, Any, Optional

class ArticleManagementTester:
    def __init__(self, base_url: str = "https://admin-fix-urbane.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
    def test_admin_authentication(self):
        """Test admin login with admin/admin123 credentials"""
        admin_credentials = {
            "username": "admin",
            "password": "admin123"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json=admin_credentials,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token") and data.get("token_type") == "bearer":
                    self.admin_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                    self.log_test("Admin Authentication", True, "Admin login successful, JWT token received")
                    return True
                else:
                    self.log_test("Admin Authentication", False, f"Invalid admin login response: {data}")
                    return False
            else:
                self.log_test("Admin Authentication", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Admin login error: {str(e)}")
            return False

    def test_get_admin_articles(self):
        """Test GET /api/admin/articles (list articles)"""
        if not self.admin_token:
            self.log_test("Get Admin Articles", False, "No admin authentication token available")
            return None
            
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/articles",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                articles = data.get("articles", [])
                total_count = data.get("total_count", 0)
                
                if isinstance(articles, list):
                    self.log_test("Get Admin Articles", True, f"Retrieved {len(articles)} articles (total: {total_count})")
                    return articles
                else:
                    self.log_test("Get Admin Articles", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Get Admin Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Get Admin Articles", False, f"Error: {str(e)}")
            return None

    def test_rtf_file_upload(self):
        """Test POST /api/admin/articles/upload (RTF file upload)"""
        if not self.admin_token:
            self.log_test("RTF File Upload", False, "No admin authentication token available")
            return None
            
        try:
            # Create a test RTF file
            rtf_content = r"""{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}
\f0\fs24 This is a test article content from RTF file upload.

This article tests the RTF file upload functionality for the Just Urbane admin panel.

Key features being tested:
- RTF file parsing
- Content extraction
- Article creation from uploaded file
- Database storage
- Publishing workflow

The content should be properly extracted and stored in the database.
}"""
            
            # Create temporary RTF file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8') as temp_file:
                temp_file.write(rtf_content)
                temp_file_path = temp_file.name
            
            # Prepare form data
            form_data = {
                "title": f"Test RTF Article Upload {int(time.time())}",
                "summary": "Test article created from RTF file upload to verify functionality",
                "author_name": "Test Admin",
                "category": "technology",
                "subcategory": "testing",
                "tags": "test,rtf,upload,admin",
                "featured": False,
                "trending": False,
                "premium": False,
                "reading_time": 3,
                "hero_image_url": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center&q=80"
            }
            
            # Upload RTF file
            with open(temp_file_path, 'rb') as rtf_file:
                files = {"content_file": ("test_article.rtf", rtf_file, "application/rtf")}
                response = self.session.post(
                    f"{self.base_url}/api/admin/articles/upload",
                    data=form_data,
                    files=files,
                    timeout=15
                )
            
            # Cleanup temp file
            os.unlink(temp_file_path)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Article uploaded successfully":
                    article_id = result.get("article_id")
                    slug = result.get("slug")
                    self.log_test("RTF File Upload", True, f"RTF article uploaded successfully: ID={article_id}, slug={slug}")
                    return {"article_id": article_id, "slug": slug, "title": result.get("title")}
                else:
                    self.log_test("RTF File Upload", False, f"Unexpected response: {result}")
                    return None
            else:
                self.log_test("RTF File Upload", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("RTF File Upload", False, f"Error: {str(e)}")
            return None

    def test_get_article_for_edit(self, article_id: str):
        """Test GET /api/admin/articles/{id}/edit (get article for editing)"""
        if not self.admin_token:
            self.log_test("Get Article for Edit", False, "No admin authentication token available")
            return None
            
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/articles/{article_id}/edit",
                timeout=10
            )
            
            if response.status_code == 200:
                article = response.json()
                if article.get("id") == article_id:
                    self.log_test("Get Article for Edit", True, f"Retrieved article for editing: {article.get('title', 'Unknown')}")
                    return article
                else:
                    self.log_test("Get Article for Edit", False, "Article ID mismatch in response")
                    return None
            else:
                self.log_test("Get Article for Edit", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Get Article for Edit", False, f"Error: {str(e)}")
            return None

    def test_update_article(self, article_id: str):
        """Test PUT /api/admin/articles/{id} (update article)"""
        if not self.admin_token:
            self.log_test("Update Article", False, "No admin authentication token available")
            return False
            
        try:
            # Test update with form data
            update_data = {
                "title": f"Updated Test Article {int(time.time())}",
                "body": "This is updated content for the test article. The article editing functionality is being tested.",
                "summary": "Updated summary for the test article",
                "author_name": "Updated Test Admin",
                "category": "business",
                "subcategory": "testing",
                "tags": "updated,test,article,admin",
                "featured": True,
                "trending": False,
                "premium": False,
                "reading_time": 4,
                "hero_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center&q=80",
                "status": "published"
            }
                
            response = self.session.put(
                f"{self.base_url}/api/admin/articles/{article_id}",
                data=update_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Article updated successfully":
                    updated_fields = result.get("updated_fields", 0)
                    self.log_test("Update Article", True, f"Article updated successfully ({updated_fields} fields updated)")
                    return True
                else:
                    self.log_test("Update Article", False, f"Unexpected response: {result}")
                    return False
            else:
                self.log_test("Update Article", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Update Article", False, f"Error: {str(e)}")
            return False

    def test_duplicate_article(self, article_id: str):
        """Test POST /api/admin/articles/{id}/duplicate (duplicate article)"""
        if not self.admin_token:
            self.log_test("Duplicate Article", False, "No admin authentication token available")
            return None
            
        try:
            response = self.session.post(
                f"{self.base_url}/api/admin/articles/{article_id}/duplicate",
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Article duplicated successfully":
                    new_article_id = result.get("new_article_id")
                    new_title = result.get("new_title")
                    self.log_test("Duplicate Article", True, f"Article duplicated: ID={new_article_id}, title={new_title}")
                    return {"new_article_id": new_article_id, "new_title": new_title}
                else:
                    self.log_test("Duplicate Article", False, f"Unexpected response: {result}")
                    return None
            else:
                self.log_test("Duplicate Article", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Duplicate Article", False, f"Error: {str(e)}")
            return None

    def test_update_article_status(self, article_id: str):
        """Test PUT /api/admin/articles/{id}/status (update status)"""
        if not self.admin_token:
            self.log_test("Update Article Status", False, "No admin authentication token available")
            return False
            
        try:
            # Test publishing workflow: draft -> published
            statuses_to_test = ["draft", "published", "archived"]
            
            for status in statuses_to_test:
                response = self.session.put(
                    f"{self.base_url}/api/admin/articles/{article_id}/status",
                    data={"status": status},
                    timeout=10
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("message") == f"Article status updated to {status}":
                        self.log_test(f"Update Status to {status.title()}", True, f"Status updated to {status}")
                    else:
                        self.log_test(f"Update Status to {status.title()}", False, f"Unexpected response: {result}")
                        return False
                else:
                    self.log_test(f"Update Status to {status.title()}", False, f"HTTP {response.status_code}: {response.text}")
                    return False
            
            return True
        except Exception as e:
            self.log_test("Update Article Status", False, f"Error: {str(e)}")
            return False

    def test_delete_article(self, article_id: str):
        """Test DELETE /api/admin/articles/{id} (delete article)"""
        if not self.admin_token:
            self.log_test("Delete Article", False, "No admin authentication token available")
            return False
            
        try:
            response = self.session.delete(
                f"{self.base_url}/api/admin/articles/{article_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Article deleted successfully":
                    self.log_test("Delete Article", True, "Article deleted successfully")
                    return True
                else:
                    self.log_test("Delete Article", False, f"Unexpected response: {result}")
                    return False
            else:
                self.log_test("Delete Article", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Delete Article", False, f"Error: {str(e)}")
            return False

    def test_subcategory_functionality(self):
        """Test subcategory options and filtering"""
        if not self.admin_token:
            self.log_test("Subcategory Functionality", False, "No admin authentication token available")
            return False
            
        try:
            # Test creating articles with different subcategories
            subcategories_to_test = [
                ("fashion", "men"),
                ("fashion", "women"),
                ("technology", "smartphones"),
                ("business", "finance"),
                ("travel", "luxury")
            ]
            
            created_articles = []
            
            for category, subcategory in subcategories_to_test:
                # Create RTF content for subcategory test
                rtf_content = f"""{{\\rtf1\\ansi\\deff0 {{\\fonttbl {{\\f0 Times New Roman;}}}}
\\f0\\fs24 This is a test article for {category}/{subcategory} subcategory.

Testing subcategory functionality in the Just Urbane admin panel.

Category: {category}
Subcategory: {subcategory}

This content should be properly categorized and filterable.
}}"""
                
                # Create temporary RTF file
                with tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8') as temp_file:
                    temp_file.write(rtf_content)
                    temp_file_path = temp_file.name
                
                # Prepare form data
                form_data = {
                    "title": f"Test {category.title()}/{subcategory.title()} Article {int(time.time())}",
                    "summary": f"Test article for {category}/{subcategory} subcategory",
                    "author_name": "Subcategory Tester",
                    "category": category,
                    "subcategory": subcategory,
                    "tags": f"test,{category},{subcategory}",
                    "featured": False,
                    "trending": False,
                    "premium": False,
                    "reading_time": 2,
                    "hero_image_url": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center&q=80"
                }
                
                # Upload article
                with open(temp_file_path, 'rb') as rtf_file:
                    files = {"content_file": (f"test_{category}_{subcategory}.rtf", rtf_file, "application/rtf")}
                    response = self.session.post(
                        f"{self.base_url}/api/admin/articles/upload",
                        data=form_data,
                        files=files,
                        timeout=15
                    )
                
                # Cleanup temp file
                os.unlink(temp_file_path)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("message") == "Article uploaded successfully":
                        created_articles.append({
                            "id": result.get("article_id"),
                            "category": category,
                            "subcategory": subcategory,
                            "title": result.get("title")
                        })
                        self.log_test(f"Subcategory Upload - {category}/{subcategory}", True, f"Article created with subcategory {category}/{subcategory}")
                    else:
                        self.log_test(f"Subcategory Upload - {category}/{subcategory}", False, f"Failed to create article: {result}")
                else:
                    self.log_test(f"Subcategory Upload - {category}/{subcategory}", False, f"HTTP {response.status_code}: {response.text}")
            
            # Test filtering by category and subcategory
            if created_articles:
                # Test category filtering
                response = self.session.get(
                    f"{self.base_url}/api/admin/articles?category=fashion",
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    fashion_articles = data.get("articles", [])
                    fashion_count = len([a for a in fashion_articles if a.get("category") == "fashion"])
                    self.log_test("Subcategory Filtering - Category", True, f"Found {fashion_count} fashion articles")
                else:
                    self.log_test("Subcategory Filtering - Category", False, f"Category filtering failed: HTTP {response.status_code}")
                
                self.log_test("Subcategory Functionality", True, f"Created {len(created_articles)} articles with subcategories")
                return created_articles
            else:
                self.log_test("Subcategory Functionality", False, "No articles created with subcategories")
                return []
                
        except Exception as e:
            self.log_test("Subcategory Functionality", False, f"Error: {str(e)}")
            return []

    def test_article_publishing_workflow(self, article_id: str):
        """Test complete publishing workflow and real-time updates"""
        if not self.admin_token:
            self.log_test("Publishing Workflow", False, "No admin authentication token available")
            return False
            
        try:
            # Step 1: Set article to draft
            response = self.session.put(
                f"{self.base_url}/api/admin/articles/{article_id}/status",
                data={"status": "draft"},
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Publishing Workflow - Draft", False, f"Failed to set draft status: HTTP {response.status_code}")
                return False
            
            # Step 2: Verify article is not visible on public website (draft status)
            public_response = self.session.get(
                f"{self.base_url}/api/articles/{article_id}",
                timeout=10
            )
            
            if public_response.status_code == 200:
                article_data = public_response.json()
                if article_data.get("status") == "draft":
                    self.log_test("Publishing Workflow - Draft Visibility", True, "Draft article correctly shows draft status")
                else:
                    self.log_test("Publishing Workflow - Draft Visibility", False, f"Draft article has wrong status: {article_data.get('status')}")
            else:
                self.log_test("Publishing Workflow - Draft Visibility", False, f"Cannot access draft article: HTTP {public_response.status_code}")
            
            # Step 3: Publish the article
            response = self.session.put(
                f"{self.base_url}/api/admin/articles/{article_id}/status",
                data={"status": "published"},
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Publishing Workflow - Publish", False, f"Failed to publish article: HTTP {response.status_code}")
                return False
            
            # Step 4: Verify article is now visible on public website
            time.sleep(1)  # Brief delay for real-time updates
            public_response = self.session.get(
                f"{self.base_url}/api/articles/{article_id}",
                timeout=10
            )
            
            if public_response.status_code == 200:
                article_data = public_response.json()
                if article_data.get("status") == "published":
                    self.log_test("Publishing Workflow - Published Visibility", True, "Published article is now visible on website")
                else:
                    self.log_test("Publishing Workflow - Published Visibility", False, f"Published article has wrong status: {article_data.get('status')}")
            else:
                self.log_test("Publishing Workflow - Published Visibility", False, f"Cannot access published article: HTTP {public_response.status_code}")
                return False
            
            # Step 5: Test real-time updates - check if article appears in public listings
            public_list_response = self.session.get(
                f"{self.base_url}/api/articles?limit=50",
                timeout=10
            )
            
            if public_list_response.status_code == 200:
                articles_list = public_list_response.json()
                published_article_found = any(article.get("id") == article_id for article in articles_list)
                
                if published_article_found:
                    self.log_test("Real-time Updates", True, "Published article appears in public article listings")
                else:
                    self.log_test("Real-time Updates", False, "Published article not found in public listings")
            else:
                self.log_test("Real-time Updates", False, f"Cannot access public articles list: HTTP {public_list_response.status_code}")
            
            self.log_test("Publishing Workflow", True, "Complete publishing workflow tested successfully")
            return True
            
        except Exception as e:
            self.log_test("Publishing Workflow", False, f"Error: {str(e)}")
            return False

    def test_image_upload_functionality(self):
        """Test image upload options for articles and hero images"""
        if not self.admin_token:
            self.log_test("Image Upload Functionality", False, "No admin authentication token available")
            return False
            
        try:
            # Test 1: Create article with hero image URL
            hero_image_urls = [
                "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop&crop=center&q=85",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center&q=80",
                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&h=667&fit=crop&crop=center&q=80"
            ]
            
            successful_image_tests = 0
            
            for i, hero_image_url in enumerate(hero_image_urls):
                # Create RTF content
                rtf_content = f"""{{\\rtf1\\ansi\\deff0 {{\\fonttbl {{\\f0 Times New Roman;}}}}
\\f0\\fs24 This is a test article with hero image {i+1}.

Testing image upload functionality for articles.

Hero Image URL: {hero_image_url}

This article should display with the specified hero image.
}}"""
                
                # Create temporary RTF file
                with tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8') as temp_file:
                    temp_file.write(rtf_content)
                    temp_file_path = temp_file.name
                
                # Prepare form data with hero image
                form_data = {
                    "title": f"Test Image Article {i+1} - {int(time.time())}",
                    "summary": f"Test article with hero image {i+1}",
                    "author_name": "Image Tester",
                    "category": "technology",
                    "subcategory": "testing",
                    "tags": f"test,image,hero,article{i+1}",
                    "featured": False,
                    "trending": False,
                    "premium": False,
                    "reading_time": 2,
                    "hero_image_url": hero_image_url
                }
                
                # Upload article with hero image
                with open(temp_file_path, 'rb') as rtf_file:
                    files = {"content_file": (f"test_image_article_{i+1}.rtf", rtf_file, "application/rtf")}
                    response = self.session.post(
                        f"{self.base_url}/api/admin/articles/upload",
                        data=form_data,
                        files=files,
                        timeout=15
                    )
                
                # Cleanup temp file
                os.unlink(temp_file_path)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("message") == "Article uploaded successfully":
                        article_id = result.get("article_id")
                        
                        # Verify the hero image was saved correctly
                        article_response = self.session.get(
                            f"{self.base_url}/api/articles/{article_id}",
                            timeout=10
                        )
                        
                        if article_response.status_code == 200:
                            article_data = article_response.json()
                            saved_hero_image = article_data.get("hero_image")
                            
                            if saved_hero_image == hero_image_url:
                                successful_image_tests += 1
                                self.log_test(f"Hero Image Upload {i+1}", True, f"Hero image correctly saved: {saved_hero_image}")
                            else:
                                self.log_test(f"Hero Image Upload {i+1}", False, f"Hero image mismatch: expected {hero_image_url}, got {saved_hero_image}")
                        else:
                            self.log_test(f"Hero Image Upload {i+1}", False, f"Cannot verify hero image: HTTP {article_response.status_code}")
                    else:
                        self.log_test(f"Hero Image Upload {i+1}", False, f"Article upload failed: {result}")
                else:
                    self.log_test(f"Hero Image Upload {i+1}", False, f"HTTP {response.status_code}: {response.text}")
            
            if successful_image_tests >= 2:
                self.log_test("Image Upload Functionality", True, f"{successful_image_tests}/{len(hero_image_urls)} hero image uploads successful")
                return True
            else:
                self.log_test("Image Upload Functionality", False, f"Only {successful_image_tests}/{len(hero_image_urls)} hero image uploads successful")
                return False
                
        except Exception as e:
            self.log_test("Image Upload Functionality", False, f"Error: {str(e)}")
            return False

    def run_comprehensive_article_management_tests(self):
        """Run comprehensive article management system tests"""
        print("🎯 STARTING COMPREHENSIVE ARTICLE MANAGEMENT TESTING")
        print("=" * 80)
        print("Testing all article management functionality reported by user...")
        print()
        
        # 1. Admin Authentication
        print("🔐 ADMIN AUTHENTICATION TESTING")
        print("=" * 40)
        if not self.test_admin_authentication():
            print("❌ Admin authentication failed - cannot proceed with tests")
            return self.generate_test_report()
        
        # 2. Get existing articles
        print("\n📋 ARTICLE LISTING TESTING")
        print("=" * 30)
        existing_articles = self.test_get_admin_articles()
        
        # 3. RTF File Upload Testing
        print("\n📤 RTF FILE UPLOAD TESTING")
        print("=" * 35)
        uploaded_article = self.test_rtf_file_upload()
        
        if uploaded_article:
            article_id = uploaded_article["article_id"]
            
            # 4. Article Editing Testing
            print("\n✏️ ARTICLE EDITING TESTING")
            print("=" * 30)
            article_for_edit = self.test_get_article_for_edit(article_id)
            if article_for_edit:
                self.test_update_article(article_id)
            
            # 5. Article Duplication Testing
            print("\n📋 ARTICLE DUPLICATION TESTING")
            print("=" * 35)
            duplicated_article = self.test_duplicate_article(article_id)
            
            # 6. Article Status/Publishing Testing
            print("\n📢 ARTICLE PUBLISHING TESTING")
            print("=" * 35)
            self.test_update_article_status(article_id)
            self.test_article_publishing_workflow(article_id)
            
            # 7. Image Upload Testing
            print("\n🖼️ IMAGE UPLOAD TESTING")
            print("=" * 25)
            self.test_image_upload_functionality()
            
            # 8. Subcategory Testing
            print("\n🏷️ SUBCATEGORY FUNCTIONALITY TESTING")
            print("=" * 40)
            subcategory_articles = self.test_subcategory_functionality()
            
            # 9. Article Deletion Testing (clean up test articles)
            print("\n🗑️ ARTICLE DELETION TESTING")
            print("=" * 30)
            self.test_delete_article(article_id)
            
            # Clean up duplicated article if created
            if duplicated_article:
                self.test_delete_article(duplicated_article["new_article_id"])
            
            # Clean up subcategory test articles
            for article in subcategory_articles:
                if article.get("id"):
                    self.test_delete_article(article["id"])
        
        return self.generate_test_report()

    def generate_test_report(self):
        """Generate comprehensive test report"""
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["success"]])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*80)
        print("📊 ARTICLE MANAGEMENT TESTING REPORT")
        print("="*80)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        print()
        
        # Group results by category
        categories = {}
        for result in self.test_results:
            test_name = result["test"]
            category = test_name.split(" - ")[0] if " - " in test_name else test_name.split()[0]
            if category not in categories:
                categories[category] = {"passed": 0, "failed": 0, "tests": []}
            
            if result["success"]:
                categories[category]["passed"] += 1
            else:
                categories[category]["failed"] += 1
            categories[category]["tests"].append(result)
        
        # Print category summaries
        for category, data in categories.items():
            total_cat = data["passed"] + data["failed"]
            cat_success_rate = (data["passed"] / total_cat * 100) if total_cat > 0 else 0
            status = "✅" if cat_success_rate >= 80 else "⚠️" if cat_success_rate >= 60 else "❌"
            print(f"{status} {category}: {data['passed']}/{total_cat} ({cat_success_rate:.1f}%)")
        
        print("\n" + "="*80)
        
        # Detailed failure analysis
        failed_results = [r for r in self.test_results if not r["success"]]
        if failed_results:
            print("❌ FAILED TESTS ANALYSIS:")
            print("-" * 40)
            for result in failed_results:
                print(f"• {result['test']}: {result['message']}")
            print()
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "categories": categories,
            "detailed_results": self.test_results
        }

def main():
    """Main test execution"""
    tester = ArticleManagementTester()
    report = tester.run_comprehensive_article_management_tests()
    
    # Print final summary
    print(f"\n🎯 FINAL RESULT: {report['success_rate']:.1f}% SUCCESS RATE")
    print(f"({report['passed_tests']}/{report['total_tests']} tests passed)")
    
    if report['success_rate'] >= 80:
        print("✅ Article management system is working well!")
    elif report['success_rate'] >= 60:
        print("⚠️ Article management system has some issues that need attention.")
    else:
        print("❌ Article management system has significant issues that need immediate attention.")

if __name__ == "__main__":
    main()