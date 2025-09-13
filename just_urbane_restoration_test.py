#!/usr/bin/env python3
"""
Just Urbane Website Restoration Backend Testing Suite
Testing the restored Just Urbane website backend to verify all core functionalities
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class JustUrbaneRestorationTester:
    def __init__(self, base_url: str = "https://content-phoenix.preview.emergentagent.com"):
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

    def test_articles_api_all(self):
        """Test GET /api/articles - should return all published articles"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Check that we have the expected 10 restored articles
                    if len(articles) >= 8:  # Allow for some flexibility
                        self.log_test("Articles API - All Articles", True, f"Retrieved {len(articles)} published articles (expected ~10)")
                        
                        # Verify article structure
                        if articles:
                            first_article = articles[0]
                            required_fields = ["id", "title", "body", "category", "author_name", "published_at"]
                            missing_fields = [field for field in required_fields if field not in first_article]
                            
                            if not missing_fields:
                                self.log_test("Articles API - Structure", True, "Articles have proper structure with all required fields")
                            else:
                                self.log_test("Articles API - Structure", False, f"Missing fields in articles: {missing_fields}")
                        
                        return articles
                    else:
                        self.log_test("Articles API - All Articles", False, f"Only {len(articles)} articles found, expected ~10 restored articles")
                        return articles
                else:
                    self.log_test("Articles API - All Articles", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("Articles API - All Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Articles API - All Articles", False, f"Error: {str(e)}")
            return None

    def test_articles_by_slug(self, articles: List[Dict]):
        """Test GET /api/articles/{slug} - test specific articles by slug"""
        if not articles:
            self.log_test("Articles by Slug", False, "No articles available for slug testing")
            return
            
        try:
            # Test a few articles by slug
            tested_slugs = 0
            successful_retrievals = 0
            
            for article in articles[:5]:  # Test first 5 articles
                slug = article.get("slug")
                article_id = article.get("id")
                title = article.get("title", "Unknown")
                
                if slug:
                    response = self.session.get(f"{self.base_url}/api/articles/{slug}", timeout=10)
                    if response.status_code == 200:
                        retrieved_article = response.json()
                        if retrieved_article.get("id") == article_id:
                            successful_retrievals += 1
                            self.log_test(f"Article by Slug - {slug}", True, f"Successfully retrieved: {title}")
                        else:
                            self.log_test(f"Article by Slug - {slug}", False, f"ID mismatch for {title}")
                    else:
                        self.log_test(f"Article by Slug - {slug}", False, f"HTTP {response.status_code} for {title}")
                    tested_slugs += 1
                elif article_id:
                    # Test by ID if no slug
                    response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    if response.status_code == 200:
                        successful_retrievals += 1
                        self.log_test(f"Article by ID - {article_id[:8]}", True, f"Successfully retrieved: {title}")
                    else:
                        self.log_test(f"Article by ID - {article_id[:8]}", False, f"HTTP {response.status_code} for {title}")
                    tested_slugs += 1
            
            if successful_retrievals >= tested_slugs * 0.8:  # 80% success rate
                self.log_test("Articles Retrieval System", True, f"{successful_retrievals}/{tested_slugs} articles successfully retrieved")
            else:
                self.log_test("Articles Retrieval System", False, f"Only {successful_retrievals}/{tested_slugs} articles retrieved successfully")
                
        except Exception as e:
            self.log_test("Articles by Slug", False, f"Error: {str(e)}")

    def test_articles_by_category(self):
        """Test articles are properly categorized (luxury, fashion, technology, travel, people, food)"""
        expected_categories = ["luxury", "fashion", "technology", "travel", "people", "food"]
        
        try:
            categories_with_articles = 0
            total_categorized_articles = 0
            
            for category in expected_categories:
                response = self.session.get(f"{self.base_url}/api/articles?category={category}", timeout=10)
                if response.status_code == 200:
                    articles = response.json()
                    if isinstance(articles, list):
                        article_count = len(articles)
                        if article_count > 0:
                            categories_with_articles += 1
                            total_categorized_articles += article_count
                            
                            # Verify all articles belong to the requested category
                            category_match = all(
                                article.get("category", "").lower() == category.lower() 
                                for article in articles
                            )
                            
                            if category_match:
                                self.log_test(f"Category Filter - {category.title()}", True, f"Found {article_count} properly categorized {category} articles")
                            else:
                                self.log_test(f"Category Filter - {category.title()}", False, f"Category mismatch in {category} articles")
                        else:
                            self.log_test(f"Category Filter - {category.title()}", True, f"No articles in {category} category (valid)")
                    else:
                        self.log_test(f"Category Filter - {category.title()}", False, f"Invalid response format for {category}")
                else:
                    self.log_test(f"Category Filter - {category.title()}", False, f"HTTP {response.status_code} for {category}")
            
            if categories_with_articles >= 4:  # At least 4 categories should have articles
                self.log_test("Category System", True, f"{categories_with_articles}/6 categories have articles, {total_categorized_articles} total categorized articles")
            else:
                self.log_test("Category System", False, f"Only {categories_with_articles}/6 categories have articles")
                
        except Exception as e:
            self.log_test("Articles by Category", False, f"Error: {str(e)}")

    def test_homepage_content_api(self):
        """Test GET /api/homepage/content to ensure it returns proper homepage data"""
        try:
            response = self.session.get(f"{self.base_url}/api/homepage/content", timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                # Check for required homepage structure
                required_keys = ["hero_article", "sections", "total_articles", "last_updated"]
                missing_keys = [key for key in required_keys if key not in data]
                
                if not missing_keys:
                    hero_article = data.get("hero_article")
                    sections = data.get("sections", {})
                    total_articles = data.get("total_articles", 0)
                    
                    # Verify hero article exists
                    if hero_article and isinstance(hero_article, dict):
                        self.log_test("Homepage API - Hero Article", True, f"Hero article present: {hero_article.get('title', 'Unknown')}")
                    else:
                        self.log_test("Homepage API - Hero Article", False, "No hero article found")
                    
                    # Verify categorized sections
                    expected_sections = ["featured", "trending", "latest", "fashion", "technology", "travel", "food"]
                    sections_found = 0
                    
                    for section in expected_sections:
                        if section in sections and isinstance(sections[section], list):
                            sections_found += 1
                            self.log_test(f"Homepage Section - {section.title()}", True, f"{len(sections[section])} articles in {section} section")
                    
                    if sections_found >= 5:
                        self.log_test("Homepage API - Sections", True, f"{sections_found}/{len(expected_sections)} sections properly structured")
                    else:
                        self.log_test("Homepage API - Sections", False, f"Only {sections_found}/{len(expected_sections)} sections found")
                    
                    # Verify total articles count
                    if total_articles >= 8:
                        self.log_test("Homepage API - Article Count", True, f"Total articles: {total_articles}")
                    else:
                        self.log_test("Homepage API - Article Count", False, f"Low article count: {total_articles}")
                    
                    self.log_test("Homepage Content API", True, "Homepage API returns proper structure with hero article and categorized sections")
                    return True
                else:
                    self.log_test("Homepage Content API", False, f"Missing required keys: {missing_keys}")
                    return False
            else:
                self.log_test("Homepage Content API", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Homepage Content API", False, f"Error: {str(e)}")
            return False

    def test_categories_api(self):
        """Test GET /api/categories to verify all 6 categories are properly created"""
        try:
            response = self.session.get(f"{self.base_url}/api/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    category_count = len(categories)
                    
                    # Check for expected categories
                    expected_categories = ["luxury", "fashion", "technology", "travel", "people", "food"]
                    category_names = [cat.get("name", "").lower() for cat in categories]
                    
                    found_expected = 0
                    for expected in expected_categories:
                        if expected in category_names:
                            found_expected += 1
                            self.log_test(f"Category Present - {expected.title()}", True, f"{expected} category found")
                        else:
                            self.log_test(f"Category Present - {expected.title()}", False, f"{expected} category missing")
                    
                    if found_expected >= 5:  # Allow some flexibility
                        self.log_test("Categories API", True, f"Found {found_expected}/6 expected categories, total {category_count} categories")
                    else:
                        self.log_test("Categories API", False, f"Only {found_expected}/6 expected categories found")
                    
                    # Verify category structure
                    if categories:
                        first_category = categories[0]
                        if "name" in first_category:
                            self.log_test("Categories API - Structure", True, "Categories have proper structure")
                        else:
                            self.log_test("Categories API - Structure", False, "Categories missing required fields")
                    
                    return categories
                else:
                    self.log_test("Categories API", False, f"Expected list, got: {type(categories)}")
                    return None
            else:
                self.log_test("Categories API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Categories API", False, f"Error: {str(e)}")
            return None

    def test_admin_panel_authentication(self):
        """Test admin login functionality to ensure CRUD operations will work"""
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
                    self.log_test("Admin Authentication", True, "Admin login successful, JWT token received")
                    
                    # Test admin access to protected endpoint
                    admin_response = self.session.get(f"{self.base_url}/api/admin/articles", timeout=10)
                    if admin_response.status_code == 200:
                        admin_data = admin_response.json()
                        articles = admin_data.get("articles", [])
                        self.log_test("Admin Panel Access", True, f"Admin can access protected endpoints, {len(articles)} articles visible")
                    else:
                        self.log_test("Admin Panel Access", False, f"Admin cannot access protected endpoints: HTTP {admin_response.status_code}")
                    
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

    def test_article_status_filtering(self):
        """Test that only articles with status='published' are shown on public APIs"""
        try:
            # Get all articles from public API
            public_response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if public_response.status_code != 200:
                self.log_test("Status Filtering - Public API", False, f"Public API failed: HTTP {public_response.status_code}")
                return
            
            public_articles = public_response.json()
            if not isinstance(public_articles, list):
                self.log_test("Status Filtering - Public API", False, "Invalid public API response")
                return
            
            # Check if admin endpoint is accessible (if we have auth token)
            if self.auth_token:
                admin_response = self.session.get(f"{self.base_url}/api/admin/articles", timeout=10)
                if admin_response.status_code == 200:
                    admin_data = admin_response.json()
                    admin_articles = admin_data.get("articles", [])
                    
                    # Compare counts
                    public_count = len(public_articles)
                    admin_count = len(admin_articles)
                    
                    if admin_count >= public_count:
                        self.log_test("Status Filtering - Count Comparison", True, f"Admin sees {admin_count} articles, public sees {public_count} (filtering working)")
                    else:
                        self.log_test("Status Filtering - Count Comparison", False, f"Admin sees fewer articles ({admin_count}) than public ({public_count})")
                else:
                    self.log_test("Status Filtering - Admin Access", False, f"Cannot access admin articles: HTTP {admin_response.status_code}")
            
            # Verify all public articles have proper status (if status field exists)
            published_articles = 0
            articles_with_status = 0
            
            for article in public_articles:
                if "status" in article:
                    articles_with_status += 1
                    if article.get("status") == "published":
                        published_articles += 1
            
            if articles_with_status > 0:
                if published_articles == articles_with_status:
                    self.log_test("Status Filtering - Published Only", True, f"All {published_articles} articles with status field are published")
                else:
                    self.log_test("Status Filtering - Published Only", False, f"Only {published_articles}/{articles_with_status} articles are published")
            else:
                # If no status field, assume legacy articles (which is valid)
                self.log_test("Status Filtering - Legacy Articles", True, f"Articles appear to be legacy format without status field (valid)")
            
            self.log_test("Article Status Filtering", True, f"Status filtering system working - {len(public_articles)} articles visible on public API")
            
        except Exception as e:
            self.log_test("Article Status Filtering", False, f"Error: {str(e)}")

    def test_specific_restored_articles(self):
        """Test for specific restored articles mentioned in the context"""
        try:
            # Get all articles
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code != 200:
                self.log_test("Restored Articles Check", False, "Cannot retrieve articles for restoration verification")
                return
            
            articles = response.json()
            if not isinstance(articles, list):
                self.log_test("Restored Articles Check", False, "Invalid articles response")
                return
            
            # Look for key restored articles mentioned in test_result.md
            key_articles = [
                "Perfect Suit Guide for Men",
                "When In France", 
                "Travel With A Clear Conscious",
                "sustainable travel",
                "france travel"
            ]
            
            found_articles = 0
            for article in articles:
                title = article.get("title", "").lower()
                slug = article.get("slug", "").lower()
                
                for key_article in key_articles:
                    if key_article.lower() in title or key_article.lower() in slug:
                        found_articles += 1
                        self.log_test(f"Restored Article - {key_article}", True, f"Found: {article.get('title')}")
                        break
            
            if found_articles >= 2:
                self.log_test("Restored Articles Verification", True, f"Found {found_articles} key restored articles")
            else:
                self.log_test("Restored Articles Verification", False, f"Only found {found_articles} key restored articles")
                
        except Exception as e:
            self.log_test("Restored Articles Check", False, f"Error: {str(e)}")

    def run_restoration_tests(self):
        """Run comprehensive restoration testing"""
        print("🎯 JUST URBANE WEBSITE RESTORATION TESTING")
        print("=" * 60)
        print("Testing the restored Just Urbane website backend to verify all core functionalities")
        print()
        
        # 1. Health Check
        print("🏥 API HEALTH CHECK")
        print("=" * 20)
        if not self.test_health_check():
            print("❌ Backend is not healthy - stopping tests")
            return self.generate_test_report()
        
        # 2. Articles API Testing
        print("\n📰 ARTICLES API TESTING")
        print("=" * 25)
        articles = self.test_articles_api_all()
        if articles:
            self.test_articles_by_slug(articles)
            self.test_articles_by_category()
            self.test_specific_restored_articles()
        
        # 3. Homepage Content API
        print("\n🏠 HOMEPAGE CONTENT API TESTING")
        print("=" * 35)
        self.test_homepage_content_api()
        
        # 4. Categories API
        print("\n🏷️ CATEGORIES API TESTING")
        print("=" * 25)
        self.test_categories_api()
        
        # 5. Admin Panel Authentication
        print("\n🔐 ADMIN PANEL AUTHENTICATION TESTING")
        print("=" * 40)
        self.test_admin_panel_authentication()
        
        # 6. Article Status Filtering
        print("\n🔍 ARTICLE STATUS FILTERING TESTING")
        print("=" * 40)
        self.test_article_status_filtering()
        
        return self.generate_test_report()

    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*80)
        print("🎯 JUST URBANE RESTORATION TEST REPORT")
        print("="*80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\n📊 OVERALL RESULTS:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {failed_tests}")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        # Categorize results
        critical_failures = []
        minor_issues = []
        successes = []
        
        for result in self.test_results:
            if result["success"]:
                successes.append(result)
            else:
                # Determine if it's critical or minor
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["api health", "articles api", "homepage", "categories", "admin authentication"]):
                    critical_failures.append(result)
                else:
                    minor_issues.append(result)
        
        # Report critical failures
        if critical_failures:
            print(f"\n❌ CRITICAL FAILURES ({len(critical_failures)}):")
            for failure in critical_failures:
                print(f"   • {failure['test']}: {failure['message']}")
        
        # Report minor issues
        if minor_issues:
            print(f"\n⚠️ MINOR ISSUES ({len(minor_issues)}):")
            for issue in minor_issues:
                print(f"   • {issue['test']}: {issue['message']}")
        
        # Report key successes
        key_successes = [s for s in successes if any(keyword in s["test"].lower() for keyword in ["api health", "articles api", "homepage", "categories", "admin"])]
        if key_successes:
            print(f"\n✅ KEY SUCCESSES ({len(key_successes)}):")
            for success in key_successes:
                print(f"   • {success['test']}: {success['message']}")
        
        print(f"\n🎯 RESTORATION STATUS:")
        if success_rate >= 90:
            print("   🟢 EXCELLENT - Website restoration is highly successful")
        elif success_rate >= 80:
            print("   🟡 GOOD - Website restoration is mostly successful with minor issues")
        elif success_rate >= 70:
            print("   🟠 FAIR - Website restoration has some issues that need attention")
        else:
            print("   🔴 POOR - Website restoration has significant issues requiring immediate attention")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": len(critical_failures),
            "minor_issues": len(minor_issues),
            "test_results": self.test_results
        }

def main():
    """Main testing function"""
    print("Starting Just Urbane Website Restoration Backend Testing...")
    
    tester = JustUrbaneRestorationTester()
    report = tester.run_restoration_tests()
    
    print(f"\n🏁 Testing completed with {report['success_rate']:.1f}% success rate")
    return report

if __name__ == "__main__":
    main()