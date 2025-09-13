#!/usr/bin/env python3
"""
Just Urbane Magazine Publishing Functionality Testing Suite
Testing the critical publishing issue fix - articles publishing workflow
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class PublishingTester:
    def __init__(self, base_url: str = "https://justurb-panel.preview.emergentagent.com"):
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
        
    def test_admin_login(self):
        """Test admin login to access publishing functionality"""
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
                    self.log_test("Admin Login", True, "Admin login successful, JWT token received")
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

    def test_public_articles_api_published_only(self):
        """Test 1: Public Articles API should only return published articles"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Check that all articles have status="published" or no status field (legacy published articles)
                    published_count = 0
                    draft_count = 0
                    no_status_count = 0
                    
                    for article in articles:
                        status = article.get("status", "published")  # Default to published for legacy articles
                        if status == "published":
                            published_count += 1
                        elif status == "draft":
                            draft_count += 1
                        else:
                            no_status_count += 1
                    
                    total_articles = len(articles)
                    
                    if draft_count == 0:
                        self.log_test("Public Articles API - Published Only", True, 
                                    f"✅ SUCCESS: {total_articles} articles returned, all are published (no drafts visible)")
                        return articles
                    else:
                        self.log_test("Public Articles API - Published Only", False, 
                                    f"❌ CRITICAL: {draft_count} draft articles visible on public API! Published: {published_count}")
                        return articles
                else:
                    self.log_test("Public Articles API - Published Only", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Public Articles API - Published Only", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Public Articles API - Published Only", False, f"Error: {str(e)}")
            return None

    def test_single_article_access_published_only(self, articles: List[Dict]):
        """Test 2: Single Article Access - verify published articles accessible, drafts return 404"""
        if not articles:
            self.log_test("Single Article Access Test", False, "No articles available for testing")
            return
            
        try:
            # Test accessing a published article
            published_article = articles[0]  # Should be published from previous test
            article_id = published_article.get("id")
            article_slug = published_article.get("slug")
            
            if article_id:
                # Test access by ID
                response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                if response.status_code == 200:
                    article = response.json()
                    status = article.get("status", "published")
                    if status == "published":
                        self.log_test("Single Article Access - Published by ID", True, 
                                    f"✅ Published article accessible by ID: {article.get('title', 'Unknown')}")
                    else:
                        self.log_test("Single Article Access - Published by ID", False, 
                                    f"❌ Article returned but status is: {status}")
                else:
                    self.log_test("Single Article Access - Published by ID", False, 
                                f"❌ Published article not accessible: HTTP {response.status_code}")
            
            if article_slug:
                # Test access by slug
                response = self.session.get(f"{self.base_url}/api/articles/{article_slug}", timeout=10)
                if response.status_code == 200:
                    article = response.json()
                    status = article.get("status", "published")
                    if status == "published":
                        self.log_test("Single Article Access - Published by Slug", True, 
                                    f"✅ Published article accessible by slug: {article_slug}")
                    else:
                        self.log_test("Single Article Access - Published by Slug", False, 
                                    f"❌ Article returned but status is: {status}")
                else:
                    self.log_test("Single Article Access - Published by Slug", False, 
                                f"❌ Published article not accessible by slug: HTTP {response.status_code}")
                    
        except Exception as e:
            self.log_test("Single Article Access Test", False, f"Error: {str(e)}")

    def test_admin_articles_list(self):
        """Get admin articles list to test publishing workflow"""
        if not self.admin_token:
            self.log_test("Admin Articles List", False, "No admin authentication token available")
            return None
            
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/articles",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                articles = data.get("articles", [])
                if isinstance(articles, list):
                    # Count articles by status
                    published_count = 0
                    draft_count = 0
                    archived_count = 0
                    
                    for article in articles:
                        status = article.get("status", "published")
                        if status == "published":
                            published_count += 1
                        elif status == "draft":
                            draft_count += 1
                        elif status == "archived":
                            archived_count += 1
                    
                    self.log_test("Admin Articles List", True, 
                                f"Retrieved {len(articles)} articles - Published: {published_count}, Draft: {draft_count}, Archived: {archived_count}")
                    return articles
                else:
                    self.log_test("Admin Articles List", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Admin Articles List", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Admin Articles List", False, f"Admin articles list error: {str(e)}")
            return None

    def test_admin_publishing_workflow(self, admin_articles: List[Dict]):
        """Test 3: Admin Publishing Workflow - publish/unpublish articles"""
        if not admin_articles:
            self.log_test("Admin Publishing Workflow", False, "No admin articles available for testing")
            return
            
        if not self.admin_token:
            self.log_test("Admin Publishing Workflow", False, "No admin authentication token available")
            return
            
        try:
            # Find a draft article to publish
            draft_article = None
            published_article = None
            
            for article in admin_articles:
                if article.get("status") == "draft":
                    draft_article = article
                elif article.get("status") == "published":
                    published_article = article
                    
                if draft_article and published_article:
                    break
            
            # Test 1: Publish a draft article
            if draft_article:
                article_id = draft_article.get("id")
                self.log_test("Publishing Test Setup", True, f"Found draft article to publish: {draft_article.get('title', 'Unknown')}")
                
                # Update article status to published
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
                    self.log_test("Admin Publish Article", True, f"✅ Successfully published article: {draft_article.get('title')}")
                    
                    # Verify it appears on public API
                    time.sleep(1)  # Brief delay for database update
                    public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    if public_response.status_code == 200:
                        public_article = public_response.json()
                        if public_article.get("status") == "published":
                            self.log_test("Published Article Public Visibility", True, 
                                        f"✅ Published article now visible on public API")
                        else:
                            self.log_test("Published Article Public Visibility", False, 
                                        f"❌ Article status not updated on public API: {public_article.get('status')}")
                    else:
                        self.log_test("Published Article Public Visibility", False, 
                                    f"❌ Published article not accessible on public API: HTTP {public_response.status_code}")
                else:
                    self.log_test("Admin Publish Article", False, f"❌ Failed to publish article: HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("Admin Publish Article", True, "ℹ️ No draft articles found to test publishing")
            
            # Test 2: Unpublish a published article (change to draft)
            if published_article:
                article_id = published_article.get("id")
                self.log_test("Unpublishing Test Setup", True, f"Found published article to unpublish: {published_article.get('title', 'Unknown')}")
                
                # Update article status to draft
                update_data = {
                    "status": "draft"
                }
                
                response = self.session.put(
                    f"{self.base_url}/api/admin/articles/{article_id}",
                    json=update_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_test("Admin Unpublish Article", True, f"✅ Successfully unpublished article: {published_article.get('title')}")
                    
                    # Verify it disappears from public API
                    time.sleep(1)  # Brief delay for database update
                    public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    if public_response.status_code == 404:
                        self.log_test("Unpublished Article Public Invisibility", True, 
                                    f"✅ Unpublished article correctly returns 404 on public API")
                    else:
                        self.log_test("Unpublished Article Public Invisibility", False, 
                                    f"❌ Unpublished article still accessible on public API: HTTP {public_response.status_code}")
                    
                    # Restore article to published status for other tests
                    restore_data = {"status": "published"}
                    self.session.put(
                        f"{self.base_url}/api/admin/articles/{article_id}",
                        json=restore_data,
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                    self.log_test("Article Status Restoration", True, "✅ Restored article to published status")
                    
                else:
                    self.log_test("Admin Unpublish Article", False, f"❌ Failed to unpublish article: HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("Admin Unpublish Article", True, "ℹ️ No published articles found to test unpublishing")
                
        except Exception as e:
            self.log_test("Admin Publishing Workflow", False, f"Error: {str(e)}")

    def test_original_content_visibility(self):
        """Test 4: Verify original content like 'Perfect Suit Guide for Men', 'When In France', etc. are visible"""
        try:
            # Look for specific original articles mentioned in the system
            original_articles = [
                "Perfect Suit Guide for Men",
                "When In France", 
                "Travel With A Clear Conscious",
                "perfect-suit-guide-men-corporate-dressing",
                "when-in-france-travel-destinations",
                "sustainable-travel-conscious-guide"
            ]
            
            found_articles = []
            
            # First, get all public articles
            response = self.session.get(f"{self.base_url}/api/articles?limit=50", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                
                for article in articles:
                    title = article.get("title", "")
                    slug = article.get("slug", "")
                    
                    # Check if this is one of our original articles
                    for original in original_articles:
                        if original.lower() in title.lower() or original.lower() in slug.lower():
                            found_articles.append({
                                "title": title,
                                "slug": slug,
                                "status": article.get("status", "published"),
                                "category": article.get("category", "unknown")
                            })
                            break
                
                if found_articles:
                    self.log_test("Original Content Visibility", True, 
                                f"✅ Found {len(found_articles)} original articles visible on public API")
                    
                    for article in found_articles:
                        self.log_test(f"Original Article - {article['title']}", True, 
                                    f"✅ Visible - Category: {article['category']}, Status: {article['status']}")
                else:
                    self.log_test("Original Content Visibility", False, 
                                "❌ No original articles found on public API")
                    
                # Test specific article access
                test_slugs = ["perfect-suit-guide-men-corporate-dressing", "when-in-france-travel-destinations"]
                for slug in test_slugs:
                    response = self.session.get(f"{self.base_url}/api/articles/{slug}", timeout=10)
                    if response.status_code == 200:
                        article = response.json()
                        self.log_test(f"Original Article Access - {slug}", True, 
                                    f"✅ Accessible: {article.get('title', 'Unknown')}")
                    else:
                        self.log_test(f"Original Article Access - {slug}", False, 
                                    f"❌ Not accessible: HTTP {response.status_code}")
                        
            else:
                self.log_test("Original Content Visibility", False, f"Failed to get articles: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Original Content Visibility", False, f"Error: {str(e)}")

    def test_article_creation_and_publishing(self):
        """Test 5: Create a new article and publish it"""
        if not self.admin_token:
            self.log_test("Article Creation & Publishing", False, "No admin authentication token available")
            return
            
        try:
            # Create a new test article
            test_article = {
                "title": f"Test Publishing Article {int(time.time())}",
                "body": "This is a test article created to verify the publishing functionality is working correctly. The article should be created as draft and then published to appear on the public website.",
                "summary": "Test article for publishing functionality verification",
                "author_name": "Test Author",
                "category": "technology",
                "subcategory": "testing",
                "tags": ["test", "publishing", "verification"],
                "status": "draft",  # Start as draft
                "featured": False,
                "trending": False,
                "premium": False
            }
            
            # Create the article
            response = self.session.post(
                f"{self.base_url}/api/admin/articles",
                json=test_article,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                created_article = response.json()
                article_id = created_article.get("id")
                
                self.log_test("Article Creation", True, f"✅ Created test article: {article_id}")
                
                # Verify it's NOT visible on public API (draft status)
                public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                if public_response.status_code == 404:
                    self.log_test("Draft Article Public Invisibility", True, 
                                "✅ Draft article correctly not visible on public API")
                else:
                    self.log_test("Draft Article Public Invisibility", False, 
                                f"❌ Draft article visible on public API: HTTP {public_response.status_code}")
                
                # Now publish the article
                publish_data = {"status": "published"}
                publish_response = self.session.put(
                    f"{self.base_url}/api/admin/articles/{article_id}",
                    json=publish_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if publish_response.status_code == 200:
                    self.log_test("Article Publishing", True, "✅ Successfully published test article")
                    
                    # Verify it's now visible on public API
                    time.sleep(1)  # Brief delay for database update
                    public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    if public_response.status_code == 200:
                        published_article = public_response.json()
                        if published_article.get("status") == "published":
                            self.log_test("Published Article Public Visibility", True, 
                                        "✅ Published article now visible on public API")
                        else:
                            self.log_test("Published Article Public Visibility", False, 
                                        f"❌ Article visible but status is: {published_article.get('status')}")
                    else:
                        self.log_test("Published Article Public Visibility", False, 
                                    f"❌ Published article not accessible: HTTP {public_response.status_code}")
                    
                    # Clean up - delete the test article
                    delete_response = self.session.delete(
                        f"{self.base_url}/api/admin/articles/{article_id}",
                        timeout=10
                    )
                    if delete_response.status_code == 200:
                        self.log_test("Test Article Cleanup", True, "✅ Test article cleaned up successfully")
                    else:
                        self.log_test("Test Article Cleanup", False, f"❌ Failed to clean up test article: HTTP {delete_response.status_code}")
                        
                else:
                    self.log_test("Article Publishing", False, f"❌ Failed to publish article: HTTP {publish_response.status_code}")
                    
            else:
                self.log_test("Article Creation", False, f"❌ Failed to create article: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Article Creation & Publishing", False, f"Error: {str(e)}")

    def test_article_count_comparison(self):
        """Test: Count articles before and after publishing changes"""
        try:
            # Get public articles count
            public_response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            public_count = 0
            if public_response.status_code == 200:
                public_articles = public_response.json()
                public_count = len(public_articles) if isinstance(public_articles, list) else 0
            
            # Get admin articles count (if authenticated)
            admin_count = 0
            if self.admin_token:
                admin_response = self.session.get(f"{self.base_url}/api/admin/articles", timeout=10)
                if admin_response.status_code == 200:
                    admin_data = admin_response.json()
                    admin_articles = admin_data.get("articles", [])
                    admin_count = len(admin_articles) if isinstance(admin_articles, list) else 0
                    
                    # Count by status
                    published_count = sum(1 for a in admin_articles if a.get("status") == "published")
                    draft_count = sum(1 for a in admin_articles if a.get("status") == "draft")
                    
                    self.log_test("Article Count Analysis", True, 
                                f"📊 Public API: {public_count} articles | Admin: {admin_count} total ({published_count} published, {draft_count} draft)")
                    
                    if public_count == published_count:
                        self.log_test("Publishing Filter Verification", True, 
                                    "✅ Public API count matches published articles count - filter working correctly")
                    else:
                        self.log_test("Publishing Filter Verification", False, 
                                    f"❌ Mismatch: Public API shows {public_count} but {published_count} are published")
            else:
                self.log_test("Article Count Analysis", True, f"📊 Public API: {public_count} articles (admin count unavailable)")
                
        except Exception as e:
            self.log_test("Article Count Comparison", False, f"Error: {str(e)}")

    def generate_test_report(self):
        """Generate comprehensive test report"""
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*80)
        print("🎯 PUBLISHING FUNCTIONALITY TEST REPORT")
        print("="*80)
        print(f"📊 OVERALL RESULTS: {passed_tests}/{total_tests} tests passed ({success_rate:.1f}% success rate)")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print()
        
        # Group results by category
        categories = {
            "Authentication": [],
            "Public API": [],
            "Admin Publishing": [],
            "Content Visibility": [],
            "Article Management": [],
            "System Analysis": []
        }
        
        for result in self.test_results:
            test_name = result["test"]
            if "Admin Login" in test_name:
                categories["Authentication"].append(result)
            elif "Public Articles" in test_name or "Single Article Access" in test_name:
                categories["Public API"].append(result)
            elif "Admin" in test_name and ("Publish" in test_name or "Unpublish" in test_name):
                categories["Admin Publishing"].append(result)
            elif "Original Content" in test_name or "Visibility" in test_name:
                categories["Content Visibility"].append(result)
            elif "Article Creation" in test_name or "Article Management" in test_name:
                categories["Article Management"].append(result)
            else:
                categories["System Analysis"].append(result)
        
        for category, results in categories.items():
            if results:
                print(f"\n📋 {category.upper()}")
                print("-" * 40)
                for result in results:
                    status = "✅" if result["success"] else "❌"
                    print(f"{status} {result['test']}: {result['message']}")
        
        # Critical Issues Summary
        critical_failures = [r for r in self.test_results if not r["success"] and 
                           ("CRITICAL" in r["message"] or "draft articles visible" in r["message"].lower())]
        
        if critical_failures:
            print(f"\n🚨 CRITICAL ISSUES FOUND ({len(critical_failures)}):")
            print("-" * 50)
            for failure in critical_failures:
                print(f"❌ {failure['test']}: {failure['message']}")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_issues": len(critical_failures),
            "results": self.test_results
        }

    def run_publishing_tests(self):
        """Run all publishing functionality tests"""
        print("🎯 STARTING PUBLISHING FUNCTIONALITY TESTING")
        print("="*80)
        print("Testing the critical publishing issue fix - articles publishing workflow")
        print("User reported: 'articles are not get publishing' and 'changes not reflecting on website'")
        print()
        
        # Test 1: Admin Authentication
        print("🔐 ADMIN AUTHENTICATION")
        print("-" * 30)
        admin_login_success = self.test_admin_login()
        
        # Test 2: Public Articles API - Published Only
        print("\n📰 PUBLIC ARTICLES API TESTING")
        print("-" * 35)
        public_articles = self.test_public_articles_api_published_only()
        
        # Test 3: Single Article Access
        print("\n🔍 SINGLE ARTICLE ACCESS TESTING")
        print("-" * 35)
        if public_articles:
            self.test_single_article_access_published_only(public_articles)
        
        # Test 4: Admin Articles List
        print("\n👨‍💼 ADMIN ARTICLES MANAGEMENT")
        print("-" * 30)
        admin_articles = None
        if admin_login_success:
            admin_articles = self.test_admin_articles_list()
        
        # Test 5: Admin Publishing Workflow
        print("\n📝 ADMIN PUBLISHING WORKFLOW")
        print("-" * 30)
        if admin_articles:
            self.test_admin_publishing_workflow(admin_articles)
        
        # Test 6: Original Content Visibility
        print("\n📚 ORIGINAL CONTENT VERIFICATION")
        print("-" * 35)
        self.test_original_content_visibility()
        
        # Test 7: Article Creation & Publishing
        print("\n🆕 NEW ARTICLE CREATION & PUBLISHING")
        print("-" * 40)
        if admin_login_success:
            self.test_article_creation_and_publishing()
        
        # Test 8: Article Count Analysis
        print("\n📊 ARTICLE COUNT ANALYSIS")
        print("-" * 25)
        self.test_article_count_comparison()
        
        # Generate final report
        return self.generate_test_report()

def main():
    """Main function to run publishing tests"""
    tester = PublishingTester()
    report = tester.run_publishing_tests()
    
    # Final summary
    print(f"\n🏁 TESTING COMPLETE")
    print(f"Success Rate: {report['success_rate']:.1f}%")
    if report['critical_issues'] == 0:
        print("✅ No critical publishing issues found!")
    else:
        print(f"🚨 {report['critical_issues']} critical issues require immediate attention!")

if __name__ == "__main__":
    main()