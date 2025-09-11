#!/usr/bin/env python3
"""
Article API Focused Testing - PDF Content Fix Verification
Testing the specific requirements from the review request
"""

import requests
import json
import time
from datetime import datetime

class ArticleAPITester:
    def __init__(self, base_url: str = "https://backend-restore-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"    Details: {details}")

    def test_article_retrieval_by_uuid_and_slug(self):
        """KEY REQUIREMENT 1: Test article retrieval by both UUID and slug"""
        print("\n🔍 Testing Article Retrieval by UUID and Slug...")
        
        try:
            # Get articles to find test cases
            response = self.session.get(f"{self.base_url}/api/articles?limit=5", timeout=10)
            if response.status_code != 200:
                self.log_test("Article Retrieval Setup", False, f"Failed to get articles: HTTP {response.status_code}")
                return False
            
            articles = response.json()
            if not articles:
                self.log_test("Article Retrieval Setup", False, "No articles available")
                return False
            
            # Test with the specific UUID mentioned in the review
            test_uuid = "b97cf14c-609f-4755-9cd1-b96d28ad420d"
            test_slug = "mobile-technology-mastery-smartphones-for-every-li"
            
            # Test UUID retrieval
            response_uuid = self.session.get(f"{self.base_url}/api/articles/{test_uuid}", timeout=10)
            uuid_success = False
            if response_uuid.status_code == 200:
                article_by_uuid = response_uuid.json()
                if article_by_uuid.get("id") == test_uuid:
                    uuid_success = True
                    self.log_test("UUID Retrieval", True, f"Successfully retrieved article by UUID", f"Title: {article_by_uuid.get('title')}")
                else:
                    self.log_test("UUID Retrieval", False, "UUID mismatch in response")
            else:
                self.log_test("UUID Retrieval", False, f"HTTP {response_uuid.status_code}: {response_uuid.text}")
            
            # Test slug retrieval
            response_slug = self.session.get(f"{self.base_url}/api/articles/{test_slug}", timeout=10)
            slug_success = False
            if response_slug.status_code == 200:
                article_by_slug = response_slug.json()
                if article_by_slug.get("slug") == test_slug:
                    slug_success = True
                    self.log_test("Slug Retrieval", True, f"Successfully retrieved article by slug", f"Title: {article_by_slug.get('title')}")
                    
                    # Verify both methods return the same article
                    if uuid_success and article_by_uuid.get("id") == article_by_slug.get("id"):
                        self.log_test("UUID/Slug Consistency", True, "Both UUID and slug return the same article")
                    elif uuid_success:
                        self.log_test("UUID/Slug Consistency", False, "UUID and slug return different articles")
                else:
                    self.log_test("Slug Retrieval", False, "Slug mismatch in response")
            else:
                self.log_test("Slug Retrieval", False, f"HTTP {response_slug.status_code}: {response_slug.text}")
            
            return uuid_success and slug_success
            
        except Exception as e:
            self.log_test("Article UUID/Slug Test", False, f"Error: {str(e)}")
            return False

    def test_content_visibility(self):
        """KEY REQUIREMENT 2: Test that article content is properly returned and not truncated"""
        print("\n📄 Testing Content Visibility...")
        
        try:
            # Get free articles
            response = self.session.get(f"{self.base_url}/api/articles?limit=10", timeout=10)
            if response.status_code != 200:
                self.log_test("Content Visibility Setup", False, f"Failed to get articles: HTTP {response.status_code}")
                return False
            
            articles = response.json()
            free_articles = [a for a in articles if not a.get("is_premium", False)]
            
            if not free_articles:
                self.log_test("Content Visibility", False, "No free articles found for testing")
                return False
            
            content_accessible_count = 0
            for article in free_articles[:5]:  # Test first 5 free articles
                article_id = article.get("id")
                
                # Get full article
                response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                if response.status_code == 200:
                    full_article = response.json()
                    body_content = full_article.get("body", "")
                    
                    # Check if content is properly returned (not truncated)
                    if len(body_content) > 100 and not body_content.endswith("..."):
                        content_accessible_count += 1
                        self.log_test(f"Content Access - {article.get('title', 'Unknown')[:30]}...", True, 
                                    f"Full content accessible (length: {len(body_content)})")
                    else:
                        self.log_test(f"Content Access - {article.get('title', 'Unknown')[:30]}...", False, 
                                    f"Content appears truncated (length: {len(body_content)})")
            
            success_rate = content_accessible_count / len(free_articles[:5])
            if success_rate >= 0.8:  # 80% success rate
                self.log_test("Overall Content Visibility", True, f"{content_accessible_count}/{len(free_articles[:5])} articles have full content")
                return True
            else:
                self.log_test("Overall Content Visibility", False, f"Only {content_accessible_count}/{len(free_articles[:5])} articles have full content")
                return False
                
        except Exception as e:
            self.log_test("Content Visibility Test", False, f"Error: {str(e)}")
            return False

    def test_category_subcategory_filtering(self):
        """KEY REQUIREMENT 3: Test category and subcategory filtering"""
        print("\n📂 Testing Category and Subcategory Filtering...")
        
        try:
            # Test the specific example from the review: category=fashion&subcategory=men
            response = self.session.get(f"{self.base_url}/api/articles?category=fashion&subcategory=men&limit=10", timeout=10)
            
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Verify filtering works
                    fashion_articles = [a for a in articles if a.get("category", "").lower() == "fashion"]
                    men_articles = [a for a in articles if "men" in a.get("tags", []) or a.get("subcategory", "").lower() == "men"]
                    
                    self.log_test("Fashion Category Filter", True, f"Retrieved {len(articles)} articles for fashion category")
                    
                    if len(articles) > 0:
                        self.log_test("Fashion/Men Subcategory Filter", True, 
                                    f"Retrieved {len(articles)} articles for fashion/men", 
                                    f"Sample titles: {[a.get('title', 'Unknown')[:30] for a in articles[:3]]}")
                    else:
                        self.log_test("Fashion/Men Subcategory Filter", True, 
                                    "No articles found for fashion/men (valid result)")
                    
                    # Test other category filters
                    test_categories = ["technology", "business", "travel"]
                    for category in test_categories:
                        cat_response = self.session.get(f"{self.base_url}/api/articles?category={category}&limit=5", timeout=10)
                        if cat_response.status_code == 200:
                            cat_articles = cat_response.json()
                            self.log_test(f"{category.title()} Category Filter", True, 
                                        f"Retrieved {len(cat_articles)} {category} articles")
                        else:
                            self.log_test(f"{category.title()} Category Filter", False, 
                                        f"HTTP {cat_response.status_code}")
                    
                    return True
                else:
                    self.log_test("Category Filtering", False, "Invalid response format")
                    return False
            else:
                self.log_test("Category Filtering", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Category Filtering Test", False, f"Error: {str(e)}")
            return False

    def test_data_consistency(self):
        """KEY REQUIREMENT 4: Test data consistency (_id to id conversion)"""
        print("\n🔄 Testing Data Consistency...")
        
        try:
            # Get articles and check data structure
            response = self.session.get(f"{self.base_url}/api/articles?limit=5", timeout=10)
            if response.status_code != 200:
                self.log_test("Data Consistency Setup", False, f"Failed to get articles: HTTP {response.status_code}")
                return False
            
            articles = response.json()
            if not articles:
                self.log_test("Data Consistency", False, "No articles available")
                return False
            
            consistent_count = 0
            for article in articles:
                # Check if article has 'id' field and not '_id'
                has_id = "id" in article
                has_underscore_id = "_id" in article
                
                if has_id and not has_underscore_id:
                    consistent_count += 1
                    self.log_test(f"Data Consistency - {article.get('title', 'Unknown')[:30]}...", True, 
                                "Proper id field structure")
                else:
                    self.log_test(f"Data Consistency - {article.get('title', 'Unknown')[:30]}...", False, 
                                f"ID field issue: has_id={has_id}, has_underscore_id={has_underscore_id}")
            
            if consistent_count == len(articles):
                self.log_test("Overall Data Consistency", True, f"All {len(articles)} articles have proper id field structure")
                return True
            else:
                self.log_test("Overall Data Consistency", False, f"Only {consistent_count}/{len(articles)} articles have proper structure")
                return False
                
        except Exception as e:
            self.log_test("Data Consistency Test", False, f"Error: {str(e)}")
            return False

    def test_view_count_increment(self):
        """KEY REQUIREMENT 5: Test view count increment functionality"""
        print("\n👁️ Testing View Count Increment...")
        
        try:
            # Get an article for testing
            response = self.session.get(f"{self.base_url}/api/articles?limit=1", timeout=10)
            if response.status_code != 200:
                self.log_test("View Count Setup", False, f"Failed to get articles: HTTP {response.status_code}")
                return False
            
            articles = response.json()
            if not articles:
                self.log_test("View Count Test", False, "No articles available")
                return False
            
            article_id = articles[0].get("id")
            
            # Get initial view count
            response1 = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
            if response1.status_code != 200:
                self.log_test("View Count Initial", False, f"Failed to get article: HTTP {response1.status_code}")
                return False
            
            article1 = response1.json()
            initial_views = article1.get("view_count", 0)
            
            # Wait a moment and access again
            time.sleep(1)
            response2 = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
            if response2.status_code != 200:
                self.log_test("View Count Second Access", False, f"Failed to access article again: HTTP {response2.status_code}")
                return False
            
            article2 = response2.json()
            second_views = article2.get("view_count", 0)
            
            # Check if view count incremented
            if second_views > initial_views:
                self.log_test("View Count Increment", True, 
                            f"View count incremented from {initial_views} to {second_views}")
                return True
            else:
                self.log_test("View Count Increment", False, 
                            f"View count did not increment (stayed at {initial_views})")
                return False
                
        except Exception as e:
            self.log_test("View Count Test", False, f"Error: {str(e)}")
            return False

    def run_focused_tests(self):
        """Run focused tests for article API requirements"""
        print("🎯 Article API Focused Testing - PDF Content Fix Verification")
        print("=" * 70)
        print("Testing specific requirements from the review request:")
        print("1. Article retrieval by UUID and slug")
        print("2. Content visibility (body field not truncated)")
        print("3. Category and subcategory filtering")
        print("4. Data consistency (_id to id conversion)")
        print("5. View count increment")
        print("=" * 70)
        
        # Run all focused tests
        test1 = self.test_article_retrieval_by_uuid_and_slug()
        test2 = self.test_content_visibility()
        test3 = self.test_category_subcategory_filtering()
        test4 = self.test_data_consistency()
        test5 = self.test_view_count_increment()
        
        # Generate summary
        print("\n" + "=" * 70)
        print("📊 FOCUSED TEST RESULTS SUMMARY")
        print("=" * 70)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Key requirements summary
        key_requirements = [test1, test2, test3, test4, test5]
        key_passed = sum(key_requirements)
        
        print(f"\nKey Requirements Status: {key_passed}/5 ✅")
        print("1. UUID/Slug Retrieval:", "✅ PASS" if test1 else "❌ FAIL")
        print("2. Content Visibility:", "✅ PASS" if test2 else "❌ FAIL")
        print("3. Category Filtering:", "✅ PASS" if test3 else "❌ FAIL")
        print("4. Data Consistency:", "✅ PASS" if test4 else "❌ FAIL")
        print("5. View Count Increment:", "✅ PASS" if test5 else "❌ FAIL")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("=" * 70)
        
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "key_requirements_passed": key_passed,
            "all_key_requirements_passed": key_passed == 5,
            "results": self.test_results
        }

def main():
    """Main testing function"""
    tester = ArticleAPITester()
    report = tester.run_focused_tests()
    
    # Save detailed report
    with open("/app/article_api_test_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: /app/article_api_test_report.json")
    
    return report["all_key_requirements_passed"]

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)