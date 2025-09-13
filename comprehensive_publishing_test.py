#!/usr/bin/env python3
"""
Just Urbane Magazine - Comprehensive Publishing System Test
Testing article creation, RTF upload, and publishing workflow
"""

import requests
import json
import time
import tempfile
import os
from datetime import datetime
from typing import Dict, Any, Optional, List

class ComprehensivePublishingTester:
    def __init__(self, base_url: str = "https://admin-fix-urbane.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
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

    def test_admin_login(self):
        """Test admin login"""
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
                if data.get("access_token"):
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_test("Admin Login", True, "Admin authentication successful")
                    return True
                else:
                    self.log_test("Admin Login", False, f"No access token in response: {data}")
                    return False
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, f"Error: {str(e)}")
            return False

    def test_rtf_article_upload(self):
        """Test RTF article upload functionality"""
        if not self.auth_token:
            self.log_test("RTF Article Upload", False, "No admin authentication")
            return None
            
        try:
            # Create a test RTF file
            rtf_content = r"""{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}
\f0\fs24 This is a test article created via RTF upload to verify the publishing system.

The article contains multiple paragraphs to test content parsing.

This is the second paragraph with some formatting.

End of test article content.
}"""
            
            # Create temporary RTF file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False) as temp_file:
                temp_file.write(rtf_content)
                temp_file_path = temp_file.name
            
            # Prepare form data
            form_data = {
                "title": f"Test RTF Article {int(time.time())}",
                "summary": "Test article uploaded via RTF to verify publishing system",
                "author_name": "Test Author",
                "category": "technology",
                "subcategory": "testing",
                "tags": "test,rtf,upload",
                "featured": "false",
                "trending": "false", 
                "premium": "false",
                "reading_time": "3",
                "hero_image_url": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&q=80"
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
                article_id = result.get("article_id")
                if article_id:
                    self.log_test("RTF Article Upload", True, f"RTF article uploaded successfully: {article_id}")
                    return article_id
                else:
                    self.log_test("RTF Article Upload", False, f"No article ID in response: {result}")
                    return None
            else:
                self.log_test("RTF Article Upload", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("RTF Article Upload", False, f"Error: {str(e)}")
            return None

    def test_article_status_management(self, article_id: str):
        """Test article status management (draft/published)"""
        if not self.auth_token or not article_id:
            self.log_test("Article Status Management", False, "No admin token or article ID")
            return False
            
        try:
            # First check if article is in draft status
            response = self.session.get(f"{self.base_url}/api/admin/articles/{article_id}", timeout=10)
            if response.status_code == 200:
                article_data = response.json()
                current_status = article_data.get("status", "draft")
                self.log_test("Article Status Check", True, f"Article current status: {current_status}")
                
                # Update to published status
                update_data = {
                    "status": "published"
                }
                
                response = self.session.put(
                    f"{self.base_url}/api/admin/articles/{article_id}",
                    json=update_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_test("Article Status Update", True, "Article status updated to published")
                    return True
                else:
                    self.log_test("Article Status Update", False, f"HTTP {response.status_code}: {response.text}")
                    return False
            else:
                self.log_test("Article Status Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Article Status Management", False, f"Error: {str(e)}")
            return False

    def test_published_article_visibility(self, article_id: str):
        """Test that published articles appear on public website"""
        if not article_id:
            self.log_test("Published Article Visibility", False, "No article ID")
            return False
            
        try:
            # Wait a moment for database update
            time.sleep(2)
            
            # Check if article is visible on public API
            response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
            if response.status_code == 200:
                article_data = response.json()
                status = article_data.get("status")
                title = article_data.get("title", "")
                
                if status == "published":
                    self.log_test("Published Article Visibility", True, f"Published article visible: '{title}'")
                    return True
                else:
                    self.log_test("Published Article Visibility", False, f"Article status not published: {status}")
                    return False
            else:
                self.log_test("Published Article Visibility", False, f"Article not accessible: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Published Article Visibility", False, f"Error: {str(e)}")
            return False

    def test_article_in_listings(self, article_id: str):
        """Test that published articles appear in article listings"""
        if not article_id:
            self.log_test("Article in Listings", False, "No article ID")
            return False
            
        try:
            # Check general articles listing
            response = self.session.get(f"{self.base_url}/api/articles?limit=50", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    article_found = False
                    for article in articles:
                        if article.get("id") == article_id:
                            article_found = True
                            break
                    
                    if article_found:
                        self.log_test("Article in Listings", True, "Published article appears in general listings")
                        return True
                    else:
                        self.log_test("Article in Listings", False, "Published article not found in listings")
                        return False
                else:
                    self.log_test("Article in Listings", False, f"Invalid response format: {type(articles)}")
                    return False
            else:
                self.log_test("Article in Listings", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Article in Listings", False, f"Error: {str(e)}")
            return False

    def test_yacht_article_status(self):
        """Test that yacht article is properly featured and positioned"""
        try:
            # Get homepage content
            response = self.session.get(f"{self.base_url}/api/homepage/content", timeout=10)
            if response.status_code == 200:
                data = response.json()
                hero_article = data.get("hero_article")
                
                if hero_article:
                    title = hero_article.get("title", "")
                    featured = hero_article.get("featured", False)
                    
                    # Check if it's the yacht article
                    if "sunseeker" in title.lower() or "yacht" in title.lower():
                        if featured:
                            self.log_test("Yacht Article Status", True, f"Yacht article is hero and featured: '{title}'")
                            return True
                        else:
                            self.log_test("Yacht Article Status", False, f"Yacht article is hero but not featured: '{title}'")
                            return False
                    else:
                        self.log_test("Yacht Article Status", False, f"Hero article is not yacht article: '{title}'")
                        return False
                else:
                    self.log_test("Yacht Article Status", False, "No hero article found")
                    return False
            else:
                self.log_test("Yacht Article Status", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Yacht Article Status", False, f"Error: {str(e)}")
            return False

    def test_original_content_preservation(self):
        """Test that original content is preserved and accessible"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Look for key original articles
                    key_articles_found = {
                        "yacht": False,
                        "fashion": False,
                        "travel": False,
                        "technology": False
                    }
                    
                    total_articles = len(articles)
                    
                    for article in articles:
                        title = article.get("title", "").lower()
                        category = article.get("category", "").lower()
                        
                        if "sunseeker" in title or "yacht" in title:
                            key_articles_found["yacht"] = True
                        elif "fashion" in category or "dress" in title or "style" in title:
                            key_articles_found["fashion"] = True
                        elif "travel" in category or "france" in title or "destination" in title:
                            key_articles_found["travel"] = True
                        elif "technology" in category or "tech" in title:
                            key_articles_found["technology"] = True
                    
                    found_count = sum(key_articles_found.values())
                    
                    if total_articles >= 8 and found_count >= 3:
                        self.log_test("Original Content Preservation", True, f"Found {total_articles} articles with {found_count}/4 key categories represented")
                        return True
                    else:
                        self.log_test("Original Content Preservation", False, f"Only {total_articles} articles found with {found_count}/4 key categories")
                        return False
                else:
                    self.log_test("Original Content Preservation", False, f"Invalid response format: {type(articles)}")
                    return False
            else:
                self.log_test("Original Content Preservation", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Original Content Preservation", False, f"Error: {str(e)}")
            return False

    def cleanup_test_article(self, article_id: str):
        """Clean up test article"""
        if not self.auth_token or not article_id:
            return
            
        try:
            response = self.session.delete(f"{self.base_url}/api/admin/articles/{article_id}", timeout=10)
            if response.status_code == 200:
                self.log_test("Test Article Cleanup", True, f"Test article {article_id} deleted")
            else:
                self.log_test("Test Article Cleanup", False, f"Failed to delete: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Test Article Cleanup", False, f"Cleanup error: {str(e)}")

    def generate_test_report(self):
        """Generate comprehensive test report"""
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*80)
        print("📝 COMPREHENSIVE PUBLISHING SYSTEM TEST REPORT")
        print("="*80)
        print(f"📊 OVERALL RESULTS: {passed_tests}/{total_tests} tests passed ({success_rate:.1f}% success rate)")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print()
        
        # Categorize results
        categories = {
            "Authentication": [],
            "Article Creation": [],
            "Publishing Workflow": [],
            "Content Verification": [],
            "Cleanup": []
        }
        
        for result in self.test_results:
            test_name = result["test"]
            if "Login" in test_name:
                categories["Authentication"].append(result)
            elif any(keyword in test_name for keyword in ["Upload", "Creation"]):
                categories["Article Creation"].append(result)
            elif any(keyword in test_name for keyword in ["Status", "Visibility", "Listings"]):
                categories["Publishing Workflow"].append(result)
            elif any(keyword in test_name for keyword in ["Yacht", "Content", "Preservation"]):
                categories["Content Verification"].append(result)
            elif "Cleanup" in test_name:
                categories["Cleanup"].append(result)
        
        for category, results in categories.items():
            if results:
                passed = sum(1 for r in results if r["success"])
                total = len(results)
                print(f"📋 {category}: {passed}/{total} passed")
                for result in results:
                    status = "✅" if result["success"] else "❌"
                    print(f"   {status} {result['test']}: {result['message']}")
                print()
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "results": self.test_results
        }

    def run_comprehensive_tests(self):
        """Run comprehensive publishing system tests"""
        print("📝 STARTING COMPREHENSIVE PUBLISHING SYSTEM TESTS")
        print("="*60)
        print("Testing complete publishing workflow and content verification...")
        print()
        
        # 1. Admin Authentication
        print("🔐 ADMIN AUTHENTICATION")
        print("="*25)
        if not self.test_admin_login():
            print("❌ Admin authentication failed - cannot proceed with admin tests")
            return self.generate_test_report()
        
        # 2. Content Verification
        print("\n🌐 CONTENT VERIFICATION")
        print("="*25)
        self.test_yacht_article_status()
        self.test_original_content_preservation()
        
        # 3. Article Creation Testing
        print("\n📤 ARTICLE CREATION TESTING")
        print("="*35)
        test_article_id = self.test_rtf_article_upload()
        
        # 4. Publishing Workflow Testing
        if test_article_id:
            print("\n📊 PUBLISHING WORKFLOW TESTING")
            print("="*35)
            status_updated = self.test_article_status_management(test_article_id)
            if status_updated:
                self.test_published_article_visibility(test_article_id)
                self.test_article_in_listings(test_article_id)
        
        # 5. Cleanup
        print("\n🧹 CLEANUP")
        print("="*15)
        if test_article_id:
            self.cleanup_test_article(test_article_id)
        
        return self.generate_test_report()

def main():
    """Main function"""
    tester = ComprehensivePublishingTester()
    report = tester.run_comprehensive_tests()
    
    # Print final summary
    print("\n🎯 FINAL ASSESSMENT")
    print("="*25)
    if report["success_rate"] >= 90:
        print("🎉 EXCELLENT: Publishing system working perfectly!")
    elif report["success_rate"] >= 75:
        print("✅ GOOD: Publishing system mostly functional")
    elif report["success_rate"] >= 50:
        print("⚠️ MODERATE: Some issues detected")
    else:
        print("❌ CRITICAL: Major issues detected")
    
    print(f"📊 Success Rate: {report['success_rate']:.1f}%")

if __name__ == "__main__":
    main()