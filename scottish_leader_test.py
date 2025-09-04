#!/usr/bin/env python3
"""
Scottish Leader Whiskey Review Backend Integration Test
Focused testing for the review request requirements
"""

import requests
import json
from datetime import datetime

class ScottishLeaderTester:
    def __init__(self, base_url: str = "https://magazine-ui-update.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, response_data: any = None):
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
        
    def test_drinks_category_api(self):
        """Test /api/articles?category=drinks returns the Scottish Leader article correctly"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles?category=drinks", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    scottish_leader_found = False
                    for article in articles:
                        title = article.get("title", "").lower()
                        if "scottish leader" in title:
                            scottish_leader_found = True
                            self.log_test("Drinks Category API - Scottish Leader Found", True, f"Found Scottish Leader article in drinks category (total: {len(articles)} articles)")
                            
                            # Verify article structure
                            required_fields = ["id", "title", "slug", "dek", "body", "category", "subcategory", "author_name", "author_id", "published_at", "created_at", "updated_at", "reading_time"]
                            missing_fields = [field for field in required_fields if field not in article]
                            
                            if not missing_fields:
                                self.log_test("Article Structure Validation", True, f"All required fields present: {', '.join(required_fields)}")
                            else:
                                self.log_test("Article Structure Validation", False, f"Missing fields: {', '.join(missing_fields)}")
                            
                            return article
                    
                    if not scottish_leader_found:
                        self.log_test("Drinks Category API - Scottish Leader Found", False, f"Scottish Leader article not found in {len(articles)} drinks articles")
                        # Show what articles are available
                        available_titles = [a.get("title", "Unknown")[:50] for a in articles[:3]]
                        self.log_test("Available Drinks Articles", True, f"Found: {', '.join(available_titles)}")
                else:
                    self.log_test("Drinks Category API", False, f"Invalid response format: {type(articles)}")
            else:
                self.log_test("Drinks Category API", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Drinks Category API", False, f"Error: {str(e)}")
        return None
    
    def test_whiskey_review_subcategory(self):
        """Test /api/articles?category=drinks&subcategory=whiskey-review returns the article"""
        try:
            # Test with hyphen
            response = self.session.get(f"{self.base_url}/api/articles?category=drinks&subcategory=whiskey-review", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    if len(articles) > 0:
                        scottish_leader_found = any("scottish leader" in a.get("title", "").lower() for a in articles)
                        if scottish_leader_found:
                            self.log_test("Whiskey Review Subcategory (hyphen)", True, f"Scottish Leader found in whiskey-review subcategory ({len(articles)} articles)")
                        else:
                            self.log_test("Whiskey Review Subcategory (hyphen)", False, f"Scottish Leader not found in {len(articles)} whiskey-review articles")
                    else:
                        self.log_test("Whiskey Review Subcategory (hyphen)", False, "No articles found in whiskey-review subcategory")
                else:
                    self.log_test("Whiskey Review Subcategory (hyphen)", False, f"Invalid response: {type(articles)}")
            else:
                self.log_test("Whiskey Review Subcategory (hyphen)", False, f"HTTP {response.status_code}")
            
            # Test with URL encoded space
            response = self.session.get(f"{self.base_url}/api/articles?category=drinks&subcategory=whiskey+review", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    if len(articles) > 0:
                        scottish_leader_found = any("scottish leader" in a.get("title", "").lower() for a in articles)
                        if scottish_leader_found:
                            self.log_test("Whiskey Review Subcategory (URL encoded)", True, f"Scottish Leader found in 'whiskey+review' subcategory ({len(articles)} articles)")
                        else:
                            self.log_test("Whiskey Review Subcategory (URL encoded)", False, f"Scottish Leader not found in {len(articles)} 'whiskey+review' articles")
                    else:
                        self.log_test("Whiskey Review Subcategory (URL encoded)", False, "No articles found in 'whiskey+review' subcategory")
                else:
                    self.log_test("Whiskey Review Subcategory (URL encoded)", False, f"Invalid response: {type(articles)}")
            else:
                self.log_test("Whiskey Review Subcategory (URL encoded)", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Whiskey Review Subcategory", False, f"Error: {str(e)}")
    
    def test_single_article_retrieval(self):
        """Test /api/articles/scottish-leader-whiskey-review returns complete article data"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles/scottish-leader-whiskey-review", timeout=10)
            if response.status_code == 200:
                article = response.json()
                
                # Verify all required fields
                required_fields = ["id", "title", "slug", "dek", "body", "category", "subcategory", "author_name", "author_id", "published_at", "created_at", "updated_at", "reading_time"]
                missing_fields = [field for field in required_fields if field not in article or article[field] is None]
                
                if not missing_fields:
                    self.log_test("Single Article Retrieval - Complete Data", True, f"All required fields present in article: {article.get('title')}")
                else:
                    self.log_test("Single Article Retrieval - Complete Data", False, f"Missing fields: {', '.join(missing_fields)}")
                
                # Verify specific content
                title = article.get("title", "")
                category = article.get("category", "")
                subcategory = article.get("subcategory", "")
                
                if "scottish leader" in title.lower():
                    self.log_test("Article Title Verification", True, f"Title contains 'Scottish Leader': {title}")
                else:
                    self.log_test("Article Title Verification", False, f"Title doesn't contain 'Scottish Leader': {title}")
                
                if category.lower() == "drinks":
                    self.log_test("Article Category Verification", True, f"Category is 'drinks': {category}")
                else:
                    self.log_test("Article Category Verification", False, f"Category is not 'drinks': {category}")
                
                if subcategory and "whiskey" in subcategory.lower():
                    self.log_test("Article Subcategory Verification", True, f"Subcategory contains 'whiskey': {subcategory}")
                else:
                    self.log_test("Article Subcategory Verification", False, f"Subcategory doesn't contain 'whiskey': {subcategory}")
                
                return article
            else:
                self.log_test("Single Article Retrieval", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Single Article Retrieval", False, f"Error: {str(e)}")
        return None
    
    def test_categories_api(self):
        """Test /api/categories includes the 'drinks' category"""
        try:
            response = self.session.get(f"{self.base_url}/api/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    drinks_category_found = False
                    category_names = []
                    
                    for category in categories:
                        name = category.get("name", "")
                        category_names.append(name)
                        if name.lower() == "drinks":
                            drinks_category_found = True
                    
                    if drinks_category_found:
                        self.log_test("Categories API - Drinks Category", True, f"Drinks category found among {len(categories)} categories")
                    else:
                        self.log_test("Categories API - Drinks Category", False, f"Drinks category not found. Available: {', '.join(category_names)}")
                    
                    # Check for whiskey review as subcategory (if subcategories are supported)
                    self.log_test("Categories API Response", True, f"Retrieved {len(categories)} categories: {', '.join(category_names)}")
                else:
                    self.log_test("Categories API", False, f"Invalid response format: {type(categories)}")
            else:
                self.log_test("Categories API", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Categories API", False, f"Error: {str(e)}")
    
    def test_database_consistency(self):
        """Verify article data structure matches FastAPI Pydantic model requirements"""
        try:
            # Get the Scottish Leader article specifically
            response = self.session.get(f"{self.base_url}/api/articles/scottish-leader-whiskey-review", timeout=10)
            if response.status_code == 200:
                article = response.json()
                
                # Test data types and structure
                checks = {
                    "id_is_string": isinstance(article.get("id"), str),
                    "title_is_string": isinstance(article.get("title"), str),
                    "slug_is_string": isinstance(article.get("slug"), str),
                    "body_is_string": isinstance(article.get("body"), str),
                    "category_is_string": isinstance(article.get("category"), str),
                    "subcategory_is_string_or_none": article.get("subcategory") is None or isinstance(article.get("subcategory"), str),
                    "reading_time_is_int": isinstance(article.get("reading_time"), int),
                    "published_at_exists": article.get("published_at") is not None,
                    "created_at_exists": article.get("created_at") is not None,
                    "updated_at_exists": article.get("updated_at") is not None
                }
                
                passed_checks = sum(1 for check in checks.values() if check)
                total_checks = len(checks)
                
                if passed_checks == total_checks:
                    self.log_test("Database Consistency - Data Types", True, f"All {total_checks} data type checks passed")
                else:
                    failed_checks = [name for name, result in checks.items() if not result]
                    self.log_test("Database Consistency - Data Types", False, f"Failed checks: {', '.join(failed_checks)}")
                
                # Test subcategory normalization
                subcategory = article.get("subcategory", "")
                if subcategory:
                    if " " in subcategory and "-" not in subcategory:
                        self.log_test("Subcategory Normalization", True, f"Subcategory uses spaces: '{subcategory}'")
                    else:
                        self.log_test("Subcategory Normalization", False, f"Subcategory format unexpected: '{subcategory}'")
                
            else:
                self.log_test("Database Consistency", False, f"Could not retrieve article for consistency check: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Database Consistency", False, f"Error: {str(e)}")
    
    def test_image_urls_accessibility(self):
        """Test that image URLs are accessible"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles/scottish-leader-whiskey-review", timeout=10)
            if response.status_code == 200:
                article = response.json()
                
                hero_image = article.get("hero_image")
                gallery = article.get("gallery", [])
                
                if hero_image:
                    # Test if hero image URL is accessible
                    try:
                        img_response = self.session.head(hero_image, timeout=5)
                        if img_response.status_code == 200:
                            self.log_test("Hero Image Accessibility", True, f"Hero image accessible: {hero_image[:50]}...")
                        else:
                            self.log_test("Hero Image Accessibility", False, f"Hero image not accessible (HTTP {img_response.status_code}): {hero_image[:50]}...")
                    except:
                        self.log_test("Hero Image Accessibility", False, f"Hero image URL test failed: {hero_image[:50]}...")
                else:
                    self.log_test("Hero Image Accessibility", False, "No hero image found")
                
                if gallery and len(gallery) > 0:
                    accessible_images = 0
                    for img_url in gallery[:3]:  # Test first 3 images
                        try:
                            img_response = self.session.head(img_url, timeout=5)
                            if img_response.status_code == 200:
                                accessible_images += 1
                        except:
                            pass
                    
                    if accessible_images > 0:
                        self.log_test("Gallery Images Accessibility", True, f"{accessible_images}/{min(len(gallery), 3)} gallery images accessible")
                    else:
                        self.log_test("Gallery Images Accessibility", False, "No gallery images accessible")
                else:
                    self.log_test("Gallery Images Accessibility", True, "No gallery images to test")
                    
        except Exception as e:
            self.log_test("Image URLs Accessibility", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all Scottish Leader whiskey review tests"""
        print("🥃 SCOTTISH LEADER WHISKEY REVIEW BACKEND INTEGRATION TESTING")
        print("=" * 70)
        print("Testing the fix for the previously reported '0 articles found' issue")
        print("=" * 70)
        
        # Test 1: Drinks Category API
        print("\n1. Testing Drinks Category API...")
        article = self.test_drinks_category_api()
        
        # Test 2: Whiskey Review Subcategory
        print("\n2. Testing Whiskey Review Subcategory...")
        self.test_whiskey_review_subcategory()
        
        # Test 3: Single Article Retrieval
        print("\n3. Testing Single Article Retrieval...")
        single_article = self.test_single_article_retrieval()
        
        # Test 4: Categories API
        print("\n4. Testing Categories API...")
        self.test_categories_api()
        
        # Test 5: Database Consistency
        print("\n5. Testing Database Consistency...")
        self.test_database_consistency()
        
        # Test 6: Image URLs Accessibility
        print("\n6. Testing Image URLs Accessibility...")
        self.test_image_urls_accessibility()
        
        # Generate report
        self.generate_report()
        
    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 70)
        print("📊 SCOTTISH LEADER WHISKEY REVIEW TEST RESULTS")
        print("=" * 70)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "=" * 70)
        
        # Save detailed report
        with open("/app/scottish_leader_test_report.json", "w") as f:
            json.dump({
                "total": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "success_rate": (passed_tests/total_tests)*100,
                "results": self.test_results
            }, f, indent=2, default=str)
        
        print(f"📄 Detailed report saved to: /app/scottish_leader_test_report.json")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = ScottishLeaderTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)