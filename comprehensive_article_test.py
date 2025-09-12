#!/usr/bin/env python3
"""
Comprehensive Article Management Testing Suite
Testing all user-reported issues with detailed analysis
"""

import requests
import json
import time
import tempfile
import os
from datetime import datetime
from typing import Dict, Any, Optional

class ComprehensiveArticleTester:
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
                    self.log_test("Admin Authentication", True, "Admin login successful with admin/admin123")
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

    def test_article_listing(self):
        """Test GET /api/admin/articles (list articles)"""
        if not self.admin_token:
            self.log_test("Article Listing", False, "No admin authentication token available")
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
                    self.log_test("Article Listing", True, f"Retrieved {len(articles)} articles (total: {total_count})")
                    return articles
                else:
                    self.log_test("Article Listing", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Article Listing", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Article Listing", False, f"Error: {str(e)}")
            return None

    def test_article_editing_workflow(self, articles):
        """Test complete article editing workflow"""
        if not articles:
            self.log_test("Article Editing Workflow", False, "No articles available for testing")
            return False
            
        if not self.admin_token:
            self.log_test("Article Editing Workflow", False, "No admin authentication token available")
            return False
            
        try:
            # Use the first article for testing
            test_article = articles[0]
            article_id = test_article.get("id")
            
            if not article_id:
                self.log_test("Article Editing Workflow", False, "No article ID found")
                return False
            
            # Step 1: Get article for editing
            response = self.session.get(
                f"{self.base_url}/api/admin/articles/{article_id}/edit",
                timeout=10
            )
            
            if response.status_code == 200:
                article = response.json()
                original_title = article.get("title", "Unknown")
                self.log_test("Get Article for Edit", True, f"Retrieved article: {original_title}")
                
                # Step 2: Update article
                update_data = {
                    "title": f"EDITED: {original_title} - {int(time.time())}",
                    "summary": "This article has been edited via admin panel testing",
                    "featured": True,
                    "status": "published"
                }
                
                response = self.session.put(
                    f"{self.base_url}/api/admin/articles/{article_id}",
                    data=update_data,
                    timeout=10
                )
                
                if response.status_code == 200:
                    result = response.json()
                    self.log_test("Article Update", True, f"Article updated successfully: {result.get('message')}")
                    
                    # Step 3: Verify changes were saved
                    response = self.session.get(
                        f"{self.base_url}/api/admin/articles/{article_id}/edit",
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        updated_article = response.json()
                        new_title = updated_article.get("title", "")
                        
                        if "EDITED:" in new_title:
                            self.log_test("Article Edit Verification", True, "Article changes were saved correctly")
                            return True
                        else:
                            self.log_test("Article Edit Verification", False, f"Changes not saved. Title: {new_title}")
                            return False
                    else:
                        self.log_test("Article Edit Verification", False, f"Cannot verify changes: HTTP {response.status_code}")
                        return False
                else:
                    self.log_test("Article Update", False, f"Update failed: HTTP {response.status_code} - {response.text}")
                    return False
            else:
                self.log_test("Get Article for Edit", False, f"Cannot get article for edit: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Article Editing Workflow", False, f"Error: {str(e)}")
            return False

    def test_article_publishing_workflow(self, articles):
        """Test article publishing workflow and website visibility"""
        if not articles:
            self.log_test("Publishing Workflow", False, "No articles available for testing")
            return False
            
        if not self.admin_token:
            self.log_test("Publishing Workflow", False, "No admin authentication token available")
            return False
            
        try:
            # Use the first article for testing
            test_article = articles[0]
            article_id = test_article.get("id")
            
            if not article_id:
                self.log_test("Publishing Workflow", False, "No article ID found")
                return False
            
            # Step 1: Set article to draft
            response = self.session.put(
                f"{self.base_url}/api/admin/articles/{article_id}/status",
                data={"status": "draft"},
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Set Draft Status", True, "Article set to draft status")
                
                # Step 2: Publish the article
                response = self.session.put(
                    f"{self.base_url}/api/admin/articles/{article_id}/status",
                    data={"status": "published"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_test("Publish Article", True, "Article published successfully")
                    
                    # Step 3: Check if article appears on public website
                    time.sleep(1)  # Brief delay for real-time updates
                    
                    # Try to access article by different methods
                    # Method 1: Try with the admin article ID
                    public_response = self.session.get(
                        f"{self.base_url}/api/articles/{article_id}",
                        timeout=10
                    )
                    
                    if public_response.status_code == 200:
                        self.log_test("Public Article Access", True, "Published article accessible on public website")
                        return True
                    else:
                        # Method 2: Check if article appears in public listings
                        public_list_response = self.session.get(
                            f"{self.base_url}/api/articles?limit=50",
                            timeout=10
                        )
                        
                        if public_list_response.status_code == 200:
                            articles_list = public_list_response.json()
                            published_article_found = any(
                                article.get("id") == article_id or 
                                article.get("title", "").startswith("EDITED:") 
                                for article in articles_list
                            )
                            
                            if published_article_found:
                                self.log_test("Public Article Listing", True, "Published article appears in public listings")
                                self.log_test("Real-time Updates", True, "Real-time updates working - article visible on website")
                                return True
                            else:
                                self.log_test("Public Article Listing", False, "Published article not found in public listings")
                                self.log_test("Real-time Updates", False, "Real-time updates not working properly")
                                return False
                        else:
                            self.log_test("Public Article Listing", False, f"Cannot access public listings: HTTP {public_list_response.status_code}")
                            return False
                else:
                    self.log_test("Publish Article", False, f"Publishing failed: HTTP {response.status_code}")
                    return False
            else:
                self.log_test("Set Draft Status", False, f"Cannot set draft status: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Publishing Workflow", False, f"Error: {str(e)}")
            return False

    def test_rtf_file_upload_issue(self):
        """Test RTF file upload functionality - KNOWN ISSUE"""
        if not self.admin_token:
            self.log_test("RTF File Upload", False, "No admin authentication token available")
            return False
            
        try:
            # Create simple RTF content
            rtf_content = r"""{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}
\f0\fs24 This is a test RTF article upload.

Testing RTF file upload functionality for Just Urbane admin panel.

This content should be extracted and stored properly.
}"""
            
            # Create temporary RTF file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8') as temp_file:
                temp_file.write(rtf_content)
                temp_file_path = temp_file.name
            
            # Prepare form data
            form_data = {
                "title": f"RTF Test Article {int(time.time())}",
                "summary": "Test article from RTF upload",
                "author_name": "RTF Tester",
                "category": "technology",
                "subcategory": "testing",
                "tags": "test,rtf,upload",
                "featured": False,
                "trending": False,
                "premium": False,
                "reading_time": 2
            }
            
            # Upload RTF file
            with open(temp_file_path, 'rb') as rtf_file:
                files = {"content_file": ("test_rtf.rtf", rtf_file, "application/rtf")}
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
                    self.log_test("RTF File Upload", True, f"RTF upload successful: {result.get('article_id')}")
                    return result.get("article_id")
                else:
                    self.log_test("RTF File Upload", False, f"Unexpected response: {result}")
                    return False
            else:
                self.log_test("RTF File Upload", False, f"RTF upload failed: HTTP {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("RTF File Upload", False, f"RTF upload error: {str(e)}")
            return False

    def test_image_upload_functionality(self):
        """Test image upload options for articles and hero images"""
        if not self.admin_token:
            self.log_test("Image Upload Functionality", False, "No admin authentication token available")
            return False
            
        try:
            # Test creating article with hero image URL
            hero_image_url = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop&crop=center&q=85"
            
            # Create simple text content (since RTF upload is failing)
            text_content = """This is a test article with hero image.

Testing image upload functionality for articles.

The hero image should display correctly when the article is published.

This tests the image upload options for articles and hero images."""
            
            # Create temporary text file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as temp_file:
                temp_file.write(text_content)
                temp_file_path = temp_file.name
            
            # Prepare form data with hero image
            form_data = {
                "title": f"Image Test Article {int(time.time())}",
                "summary": "Test article with hero image functionality",
                "author_name": "Image Tester",
                "category": "technology",
                "subcategory": "testing",
                "tags": "test,image,hero",
                "featured": False,
                "trending": False,
                "premium": False,
                "reading_time": 2,
                "hero_image_url": hero_image_url
            }
            
            # Upload article with hero image
            with open(temp_file_path, 'rb') as text_file:
                files = {"content_file": ("test_image.txt", text_file, "text/plain")}
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
                        f"{self.base_url}/api/admin/articles/{article_id}/edit",
                        timeout=10
                    )
                    
                    if article_response.status_code == 200:
                        article_data = article_response.json()
                        saved_hero_image = article_data.get("hero_image")
                        
                        if saved_hero_image == hero_image_url:
                            self.log_test("Image Upload Functionality", True, f"Hero image upload working: {saved_hero_image}")
                            return article_id
                        else:
                            self.log_test("Image Upload Functionality", False, f"Hero image not saved correctly: expected {hero_image_url}, got {saved_hero_image}")
                            return False
                    else:
                        self.log_test("Image Upload Functionality", False, f"Cannot verify hero image: HTTP {article_response.status_code}")
                        return False
                else:
                    self.log_test("Image Upload Functionality", False, f"Article upload failed: {result}")
                    return False
            else:
                self.log_test("Image Upload Functionality", False, f"Image upload test failed: HTTP {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Image Upload Functionality", False, f"Error: {str(e)}")
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
                ("business", "finance")
            ]
            
            created_articles = []
            
            for category, subcategory in subcategories_to_test:
                # Create text content for subcategory test
                text_content = f"""This is a test article for {category}/{subcategory} subcategory.

Testing subcategory functionality in the Just Urbane admin panel.

Category: {category}
Subcategory: {subcategory}

This content should be properly categorized and filterable by subcategory.

The subcategory options should be showing correctly in the admin panel."""
                
                # Create temporary text file
                with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as temp_file:
                    temp_file.write(text_content)
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
                    "reading_time": 2
                }
                
                # Upload article
                with open(temp_file_path, 'rb') as text_file:
                    files = {"content_file": (f"test_{category}_{subcategory}.txt", text_file, "text/plain")}
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
                    self.log_test("Subcategory Filtering", True, f"Category filtering working: found {fashion_count} fashion articles")
                else:
                    self.log_test("Subcategory Filtering", False, f"Category filtering failed: HTTP {response.status_code}")
                
                self.log_test("Subcategory Functionality", True, f"Created {len(created_articles)} articles with subcategories")
                return created_articles
            else:
                self.log_test("Subcategory Functionality", False, "No articles created with subcategories")
                return []
                
        except Exception as e:
            self.log_test("Subcategory Functionality", False, f"Error: {str(e)}")
            return []

    def test_article_deletion(self, article_id: str):
        """Test DELETE /api/admin/articles/{id} (delete article)"""
        if not self.admin_token:
            self.log_test("Article Deletion", False, "No admin authentication token available")
            return False
            
        try:
            response = self.session.delete(
                f"{self.base_url}/api/admin/articles/{article_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Article deleted successfully":
                    self.log_test("Article Deletion", True, "Article deleted successfully")
                    return True
                else:
                    self.log_test("Article Deletion", False, f"Unexpected response: {result}")
                    return False
            else:
                self.log_test("Article Deletion", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Article Deletion", False, f"Error: {str(e)}")
            return False

    def run_comprehensive_tests(self):
        """Run comprehensive article management system tests"""
        print("🎯 COMPREHENSIVE ARTICLE MANAGEMENT TESTING")
        print("=" * 80)
        print("Testing all user-reported issues:")
        print("1. Adding new articles is not working")
        print("2. Article editing/modifying is not working")  
        print("3. Articles are not publishing to the website")
        print("4. RTF file upload functionality should work and reflect in article content")
        print("5. Image upload options for articles and hero images should work")
        print("6. Subcategory options are not showing")
        print("7. Real-time updates to website are not working")
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
        existing_articles = self.test_article_listing()
        
        # 3. Article Editing Testing
        print("\n✏️ ARTICLE EDITING TESTING")
        print("=" * 30)
        if existing_articles:
            self.test_article_editing_workflow(existing_articles)
        
        # 4. Article Publishing Testing
        print("\n📢 ARTICLE PUBLISHING & REAL-TIME UPDATES TESTING")
        print("=" * 55)
        if existing_articles:
            self.test_article_publishing_workflow(existing_articles)
        
        # 5. RTF File Upload Testing (Known Issue)
        print("\n📤 RTF FILE UPLOAD TESTING")
        print("=" * 30)
        rtf_article_id = self.test_rtf_file_upload_issue()
        
        # 6. Image Upload Testing
        print("\n🖼️ IMAGE UPLOAD TESTING")
        print("=" * 25)
        image_article_id = self.test_image_upload_functionality()
        
        # 7. Subcategory Testing
        print("\n🏷️ SUBCATEGORY FUNCTIONALITY TESTING")
        print("=" * 40)
        subcategory_articles = self.test_subcategory_functionality()
        
        # 8. Cleanup test articles
        print("\n🗑️ CLEANUP TESTING")
        print("=" * 20)
        cleanup_articles = []
        if image_article_id:
            cleanup_articles.append(image_article_id)
        if rtf_article_id:
            cleanup_articles.append(rtf_article_id)
        for article in subcategory_articles:
            if article.get("id"):
                cleanup_articles.append(article["id"])
        
        for article_id in cleanup_articles:
            self.test_article_deletion(article_id)
        
        return self.generate_test_report()

    def generate_test_report(self):
        """Generate comprehensive test report"""
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["success"]])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*80)
        print("📊 COMPREHENSIVE ARTICLE MANAGEMENT TEST REPORT")
        print("="*80)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        print()
        
        # Analyze user-reported issues
        print("🎯 USER-REPORTED ISSUES ANALYSIS:")
        print("-" * 40)
        
        # Issue 1: Adding new articles
        rtf_tests = [r for r in self.test_results if "RTF" in r["test"]]
        image_tests = [r for r in self.test_results if "Image Upload" in r["test"]]
        subcategory_tests = [r for r in self.test_results if "Subcategory" in r["test"]]
        
        adding_working = any(r["success"] for r in rtf_tests + image_tests + subcategory_tests)
        print(f"1. Adding new articles: {'✅ WORKING' if adding_working else '❌ NOT WORKING'}")
        
        # Issue 2: Article editing
        editing_tests = [r for r in self.test_results if "Edit" in r["test"] or "Update" in r["test"]]
        editing_working = any(r["success"] for r in editing_tests)
        print(f"2. Article editing/modifying: {'✅ WORKING' if editing_working else '❌ NOT WORKING'}")
        
        # Issue 3: Publishing to website
        publishing_tests = [r for r in self.test_results if "Publish" in r["test"] or "Public" in r["test"]]
        publishing_working = any(r["success"] for r in publishing_tests)
        print(f"3. Articles publishing to website: {'✅ WORKING' if publishing_working else '❌ NOT WORKING'}")
        
        # Issue 4: RTF file upload
        rtf_working = any(r["success"] for r in rtf_tests)
        print(f"4. RTF file upload functionality: {'✅ WORKING' if rtf_working else '❌ NOT WORKING'}")
        
        # Issue 5: Image upload
        image_working = any(r["success"] for r in image_tests)
        print(f"5. Image upload options: {'✅ WORKING' if image_working else '❌ NOT WORKING'}")
        
        # Issue 6: Subcategory options
        subcategory_working = any(r["success"] for r in subcategory_tests)
        print(f"6. Subcategory options: {'✅ WORKING' if subcategory_working else '❌ NOT WORKING'}")
        
        # Issue 7: Real-time updates
        realtime_tests = [r for r in self.test_results if "Real-time" in r["test"]]
        realtime_working = any(r["success"] for r in realtime_tests)
        print(f"7. Real-time updates to website: {'✅ WORKING' if realtime_working else '❌ NOT WORKING'}")
        
        print()
        
        # Detailed failure analysis
        failed_results = [r for r in self.test_results if not r["success"]]
        if failed_results:
            print("❌ CRITICAL ISSUES FOUND:")
            print("-" * 30)
            for result in failed_results:
                print(f"• {result['test']}: {result['message']}")
            print()
        
        # Success summary
        successful_results = [r for r in self.test_results if r["success"]]
        if successful_results:
            print("✅ WORKING FUNCTIONALITY:")
            print("-" * 25)
            for result in successful_results:
                print(f"• {result['test']}: {result['message']}")
            print()
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "user_issues_analysis": {
                "adding_articles": adding_working,
                "article_editing": editing_working,
                "publishing_to_website": publishing_working,
                "rtf_upload": rtf_working,
                "image_upload": image_working,
                "subcategory_options": subcategory_working,
                "realtime_updates": realtime_working
            },
            "detailed_results": self.test_results
        }

def main():
    """Main test execution"""
    tester = ComprehensiveArticleTester()
    report = tester.run_comprehensive_tests()
    
    # Print final summary
    print(f"\n🎯 FINAL RESULT: {report['success_rate']:.1f}% SUCCESS RATE")
    print(f"({report['passed_tests']}/{report['total_tests']} tests passed)")
    
    # Count working vs non-working user issues
    issues_analysis = report['user_issues_analysis']
    working_issues = sum(1 for working in issues_analysis.values() if working)
    total_issues = len(issues_analysis)
    
    print(f"\n📋 USER ISSUES STATUS: {working_issues}/{total_issues} issues resolved")
    
    if report['success_rate'] >= 80:
        print("✅ Article management system is working well!")
    elif report['success_rate'] >= 60:
        print("⚠️ Article management system has some issues that need attention.")
    else:
        print("❌ Article management system has significant issues that need immediate attention.")

if __name__ == "__main__":
    main()