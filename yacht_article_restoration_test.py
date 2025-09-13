#!/usr/bin/env python3
"""
Just Urbane Magazine - Yacht Article Restoration Verification Test
Testing the restoration of the Sunseeker yacht article and publishing system functionality
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class YachtArticleRestorationTester:
    def __init__(self, base_url: str = "https://justurb-panel.preview.emergentagent.com"):
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
        
    def test_health_check(self):
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, "Backend API is healthy and responding")
                    return True
                else:
                    self.log_test("API Health Check", False, f"Unexpected health status: {data}")
                    return False
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_admin_login(self):
        """Test admin login with credentials admin/admin123"""
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
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_test("Admin Login", True, "Admin login successful with admin/admin123 credentials")
                    return True
                else:
                    self.log_test("Admin Login", False, f"Invalid admin login response: {data}")
                    return False
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, f"Admin login error: {str(e)}")
            return False

    def test_homepage_content_structure(self):
        """Test homepage content API to verify article ordering"""
        try:
            response = self.session.get(f"{self.base_url}/api/homepage/content", timeout=10)
            if response.status_code == 200:
                data = response.json()
                hero_article = data.get("hero_article")
                sections = data.get("sections", {})
                total_articles = data.get("total_articles", 0)
                
                if hero_article:
                    hero_title = hero_article.get("title", "")
                    hero_featured = hero_article.get("featured", False)
                    
                    # Check if yacht article is the hero article
                    if "sunseeker" in hero_title.lower() or "yacht" in hero_title.lower():
                        self.log_test("Yacht Article as Hero", True, f"Yacht article is hero: '{hero_title}' (featured: {hero_featured})")
                    else:
                        self.log_test("Yacht Article as Hero", False, f"Hero article is not yacht article: '{hero_title}'")
                    
                    # Check featured status
                    if hero_featured:
                        self.log_test("Hero Article Featured Status", True, "Hero article has featured status")
                    else:
                        self.log_test("Hero Article Featured Status", False, "Hero article is not marked as featured")
                    
                    self.log_test("Homepage Content API", True, f"Retrieved homepage with {total_articles} total articles")
                    return data
                else:
                    self.log_test("Homepage Content API", False, "No hero article found in homepage content")
                    return None
            else:
                self.log_test("Homepage Content API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Homepage Content API", False, f"Error: {str(e)}")
            return None

    def test_published_articles_visibility(self):
        """Test that only published articles are visible on public API"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=50", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    published_count = 0
                    draft_count = 0
                    yacht_article_found = False
                    yacht_article_details = None
                    
                    for article in articles:
                        status = article.get("status", "published")  # Legacy articles have no status field
                        title = article.get("title", "")
                        
                        # Check for yacht article
                        if "sunseeker" in title.lower() or "yacht" in title.lower():
                            yacht_article_found = True
                            yacht_article_details = {
                                "title": title,
                                "status": status,
                                "featured": article.get("featured", False),
                                "id": article.get("id"),
                                "published_at": article.get("published_at")
                            }
                        
                        if status == "published" or status is None:  # Legacy articles
                            published_count += 1
                        elif status == "draft":
                            draft_count += 1
                    
                    # Verify only published articles are visible
                    if draft_count == 0:
                        self.log_test("Published Articles Only", True, f"Only published articles visible: {published_count} articles, 0 drafts")
                    else:
                        self.log_test("Published Articles Only", False, f"Draft articles visible in public API: {draft_count} drafts found")
                    
                    # Check yacht article presence
                    if yacht_article_found:
                        self.log_test("Yacht Article Visibility", True, f"Yacht article found: '{yacht_article_details['title']}'")
                        return yacht_article_details
                    else:
                        self.log_test("Yacht Article Visibility", False, "Yacht article not found in published articles")
                        return None
                        
                else:
                    self.log_test("Published Articles Visibility", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Published Articles Visibility", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Published Articles Visibility", False, f"Error: {str(e)}")
            return None

    def test_article_count_verification(self):
        """Test that original 8 articles plus yacht article are accessible"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=100", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    total_count = len(articles)
                    
                    # Look for key articles mentioned in test_result.md
                    key_articles = {
                        "yacht": False,
                        "perfect_suit": False,
                        "france_travel": False,
                        "sustainable_travel": False
                    }
                    
                    for article in articles:
                        title = article.get("title", "").lower()
                        if "sunseeker" in title or "yacht" in title:
                            key_articles["yacht"] = True
                        elif "perfect suit" in title or "suit guide" in title:
                            key_articles["perfect_suit"] = True
                        elif "france" in title and "travel" in title:
                            key_articles["france_travel"] = True
                        elif "sustainable" in title and "travel" in title:
                            key_articles["sustainable_travel"] = True
                    
                    found_key_articles = sum(key_articles.values())
                    
                    if total_count >= 8:
                        self.log_test("Article Count Verification", True, f"Found {total_count} articles (expected 8+)")
                    else:
                        self.log_test("Article Count Verification", False, f"Only {total_count} articles found (expected 8+)")
                    
                    if found_key_articles >= 3:
                        self.log_test("Key Articles Present", True, f"Found {found_key_articles}/4 key articles: {key_articles}")
                    else:
                        self.log_test("Key Articles Present", False, f"Only {found_key_articles}/4 key articles found: {key_articles}")
                    
                    return total_count, key_articles
                else:
                    self.log_test("Article Count Verification", False, f"Invalid response format: {type(articles)}")
                    return 0, {}
            else:
                self.log_test("Article Count Verification", False, f"HTTP {response.status_code}: {response.text}")
                return 0, {}
        except Exception as e:
            self.log_test("Article Count Verification", False, f"Error: {str(e)}")
            return 0, {}

    def test_featured_articles_ordering(self):
        """Test that featured articles appear first in listings"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list) and articles:
                    featured_articles = []
                    non_featured_articles = []
                    
                    for i, article in enumerate(articles):
                        title = article.get("title", "")
                        featured = article.get("featured", False)
                        
                        if featured:
                            featured_articles.append((i, title))
                        else:
                            non_featured_articles.append((i, title))
                    
                    # Check if featured articles come first
                    if featured_articles:
                        first_featured_position = featured_articles[0][0]
                        first_non_featured_position = non_featured_articles[0][0] if non_featured_articles else len(articles)
                        
                        if first_featured_position < first_non_featured_position:
                            self.log_test("Featured Articles First", True, f"Featured articles appear first: {len(featured_articles)} featured, first at position {first_featured_position}")
                        else:
                            self.log_test("Featured Articles First", False, f"Featured articles not first: featured at {first_featured_position}, non-featured at {first_non_featured_position}")
                        
                        # Check if yacht article is featured and first
                        first_article = articles[0]
                        first_title = first_article.get("title", "")
                        first_featured = first_article.get("featured", False)
                        
                        if ("sunseeker" in first_title.lower() or "yacht" in first_title.lower()) and first_featured:
                            self.log_test("Yacht Article Featured First", True, f"Yacht article is featured and first: '{first_title}'")
                        else:
                            self.log_test("Yacht Article Featured First", False, f"First article is not featured yacht article: '{first_title}' (featured: {first_featured})")
                    else:
                        self.log_test("Featured Articles First", False, "No featured articles found")
                    
                    return featured_articles, non_featured_articles
                else:
                    self.log_test("Featured Articles Ordering", False, "No articles found for ordering test")
                    return [], []
            else:
                self.log_test("Featured Articles Ordering", False, f"HTTP {response.status_code}: {response.text}")
                return [], []
        except Exception as e:
            self.log_test("Featured Articles Ordering", False, f"Error: {str(e)}")
            return [], []

    def test_admin_article_creation(self):
        """Test admin can create new articles"""
        if not self.auth_token:
            self.log_test("Admin Article Creation", False, "No admin authentication token available")
            return None
            
        try:
            # Create a test article
            test_article = {
                "title": f"Test Article {int(time.time())}",
                "body": "This is a test article created to verify the publishing system is working correctly.",
                "summary": "Test article summary",
                "author_name": "Test Author",
                "category": "technology",
                "subcategory": "testing",
                "tags": ["test", "verification"],
                "featured": False,
                "trending": False,
                "premium": False,
                "status": "draft"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/articles",
                json=test_article,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                article_id = data.get("id")
                if article_id:
                    self.log_test("Admin Article Creation", True, f"Test article created successfully: ID {article_id}")
                    return article_id
                else:
                    self.log_test("Admin Article Creation", False, f"No article ID in response: {data}")
                    return None
            else:
                self.log_test("Admin Article Creation", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Admin Article Creation", False, f"Error: {str(e)}")
            return None

    def test_draft_to_published_workflow(self, article_id: str):
        """Test publishing workflow from draft to published"""
        if not self.auth_token or not article_id:
            self.log_test("Draft to Published Workflow", False, "No admin token or article ID available")
            return False
            
        try:
            # First verify article is in draft status and not visible publicly
            public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
            if public_response.status_code == 404:
                self.log_test("Draft Article Not Public", True, "Draft article correctly hidden from public API")
            else:
                self.log_test("Draft Article Not Public", False, f"Draft article visible publicly: HTTP {public_response.status_code}")
            
            # Update article to published status
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
                
                # Wait a moment for database update
                time.sleep(1)
                
                # Verify article is now visible publicly
                public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                if public_response.status_code == 200:
                    article_data = public_response.json()
                    if article_data.get("status") == "published":
                        self.log_test("Published Article Visibility", True, "Published article now visible on public API")
                        return True
                    else:
                        self.log_test("Published Article Visibility", False, f"Article status not updated: {article_data.get('status')}")
                        return False
                else:
                    self.log_test("Published Article Visibility", False, f"Published article not accessible: HTTP {public_response.status_code}")
                    return False
            else:
                self.log_test("Article Status Update", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Draft to Published Workflow", False, f"Error: {str(e)}")
            return False

    def test_immediate_article_visibility(self, article_id: str):
        """Test that published articles appear on website immediately"""
        if not article_id:
            self.log_test("Immediate Article Visibility", False, "No article ID available")
            return False
            
        try:
            # Check if article appears in general articles listing
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
                        self.log_test("Immediate Article Visibility", True, "Published article immediately visible in articles listing")
                        return True
                    else:
                        self.log_test("Immediate Article Visibility", False, "Published article not found in articles listing")
                        return False
                else:
                    self.log_test("Immediate Article Visibility", False, f"Invalid articles response: {type(articles)}")
                    return False
            else:
                self.log_test("Immediate Article Visibility", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Immediate Article Visibility", False, f"Error: {str(e)}")
            return False

    def cleanup_test_article(self, article_id: str):
        """Clean up test article after testing"""
        if not self.auth_token or not article_id:
            return
            
        try:
            response = self.session.delete(
                f"{self.base_url}/api/admin/articles/{article_id}",
                timeout=10
            )
            if response.status_code == 200:
                self.log_test("Test Article Cleanup", True, f"Test article {article_id} deleted successfully")
            else:
                self.log_test("Test Article Cleanup", False, f"Failed to delete test article: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Test Article Cleanup", False, f"Cleanup error: {str(e)}")

    def generate_test_report(self):
        """Generate comprehensive test report"""
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*80)
        print("🎯 YACHT ARTICLE RESTORATION & PUBLISHING SYSTEM TEST REPORT")
        print("="*80)
        print(f"📊 OVERALL RESULTS: {passed_tests}/{total_tests} tests passed ({success_rate:.1f}% success rate)")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print()
        
        # Group results by category
        categories = {
            "System Health": [],
            "Authentication": [],
            "Website State": [],
            "Publishing System": [],
            "Article Order": [],
            "Cleanup": []
        }
        
        for result in self.test_results:
            test_name = result["test"]
            if "Health" in test_name:
                categories["System Health"].append(result)
            elif "Login" in test_name or "Auth" in test_name:
                categories["Authentication"].append(result)
            elif any(keyword in test_name for keyword in ["Homepage", "Visibility", "Count", "Yacht Article"]):
                categories["Website State"].append(result)
            elif any(keyword in test_name for keyword in ["Creation", "Workflow", "Published", "Immediate"]):
                categories["Publishing System"].append(result)
            elif any(keyword in test_name for keyword in ["Featured", "Ordering", "First"]):
                categories["Article Order"].append(result)
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

    def run_yacht_restoration_tests(self):
        """Run comprehensive yacht article restoration and publishing system tests"""
        print("🚢 STARTING YACHT ARTICLE RESTORATION & PUBLISHING SYSTEM TESTS")
        print("="*80)
        print("Testing yacht article restoration and publishing workflow functionality...")
        print()
        
        # 1. System Health Check
        print("🏥 SYSTEM HEALTH CHECK")
        print("="*25)
        if not self.test_health_check():
            print("❌ System health check failed - cannot proceed")
            return self.generate_test_report()
        
        # 2. Admin Authentication
        print("\n🔐 ADMIN AUTHENTICATION")
        print("="*25)
        if not self.test_admin_login():
            print("❌ Admin authentication failed - limited testing possible")
        
        # 3. Website State Verification
        print("\n🌐 WEBSITE STATE VERIFICATION")
        print("="*35)
        homepage_data = self.test_homepage_content_structure()
        yacht_article = self.test_published_articles_visibility()
        article_count, key_articles = self.test_article_count_verification()
        
        # 4. Article Order Verification
        print("\n📊 ARTICLE ORDER VERIFICATION")
        print("="*35)
        featured_articles, non_featured = self.test_featured_articles_ordering()
        
        # 5. Publishing System Testing
        print("\n📝 PUBLISHING SYSTEM TESTING")
        print("="*35)
        test_article_id = None
        if self.auth_token:
            test_article_id = self.test_admin_article_creation()
            if test_article_id:
                workflow_success = self.test_draft_to_published_workflow(test_article_id)
                if workflow_success:
                    self.test_immediate_article_visibility(test_article_id)
        
        # 6. Cleanup
        print("\n🧹 CLEANUP")
        print("="*15)
        if test_article_id:
            self.cleanup_test_article(test_article_id)
        
        # Generate final report
        return self.generate_test_report()

def main():
    """Main function to run yacht article restoration tests"""
    tester = YachtArticleRestorationTester()
    report = tester.run_yacht_restoration_tests()
    
    # Print summary
    print("\n🎯 FINAL SUMMARY")
    print("="*20)
    if report["success_rate"] >= 90:
        print("🎉 EXCELLENT: Yacht article restoration and publishing system working perfectly!")
    elif report["success_rate"] >= 75:
        print("✅ GOOD: Most functionality working, minor issues detected")
    elif report["success_rate"] >= 50:
        print("⚠️ MODERATE: Some issues detected, needs attention")
    else:
        print("❌ CRITICAL: Major issues detected, requires immediate fixes")
    
    print(f"📊 Overall Success Rate: {report['success_rate']:.1f}%")
    print(f"✅ Tests Passed: {report['passed_tests']}")
    print(f"❌ Tests Failed: {report['failed_tests']}")

if __name__ == "__main__":
    main()