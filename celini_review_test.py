#!/usr/bin/env python3
"""
Celini Food Review Backend Testing - Specific Review Request
Testing to ensure image updates haven't affected backend functionality
"""

import requests
import json
from datetime import datetime

class CeliniFoodReviewTester:
    def __init__(self, base_url: str = "https://content-phoenix.preview.emergentagent.com"):
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
        
    def test_api_health_check(self):
        """Test /api/health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, f"API is healthy: {data.get('message', 'No message')}")
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
    
    def test_food_category_articles(self):
        """Test /api/articles?category=food to ensure Celini article is present"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles?category=food", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    celini_found = False
                    celini_article = None
                    
                    for article in articles:
                        title = article.get("title", "").lower()
                        if "celini" in title:
                            celini_found = True
                            celini_article = article
                            break
                    
                    if celini_found:
                        self.log_test("Food Category Articles - Celini Present", True, 
                                    f"Celini article found in food category. Total food articles: {len(articles)}")
                        return celini_article
                    else:
                        food_titles = [a.get("title", "Unknown")[:50] for a in articles[:3]]
                        self.log_test("Food Category Articles - Celini Present", False, 
                                    f"Celini article not found. Available: {', '.join(food_titles)}")
                        return None
                else:
                    self.log_test("Food Category Articles", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Food Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Food Category Articles", False, f"Error: {str(e)}")
            return None
    
    def test_food_review_subcategory(self):
        """Test /api/articles?category=food&subcategory=food-review to verify Celini article appears"""
        try:
            # Test with hyphenated version (URL-style)
            response = self.session.get(f"{self.base_url}/api/articles?category=food&subcategory=food-review", timeout=10)
            hyphen_success = False
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list) and len(articles) > 0:
                    celini_found = any("celini" in a.get("title", "").lower() for a in articles)
                    if celini_found:
                        hyphen_success = True
                        self.log_test("Food Review Subcategory (hyphen)", True, 
                                    f"Celini found with 'food-review' parameter. Articles: {len(articles)}")
            
            # Test with space version (database format)
            response = self.session.get(f"{self.base_url}/api/articles?category=food&subcategory=food%20review", timeout=10)
            space_success = False
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list) and len(articles) > 0:
                    celini_found = any("celini" in a.get("title", "").lower() for a in articles)
                    if celini_found:
                        space_success = True
                        self.log_test("Food Review Subcategory (space)", True, 
                                    f"Celini found with 'food review' parameter. Articles: {len(articles)}")
            
            if hyphen_success or space_success:
                self.log_test("Food Review Subcategory", True, 
                            f"Celini article accessible via subcategory filtering (hyphen: {hyphen_success}, space: {space_success})")
                return True
            else:
                self.log_test("Food Review Subcategory", False, 
                            "Celini article not found in food-review subcategory with either parameter format")
                return False
                
        except Exception as e:
            self.log_test("Food Review Subcategory", False, f"Error: {str(e)}")
            return False
    
    def test_single_article_retrieval(self):
        """Test article access by slug /api/articles/celini-food-review-mumbai"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles/celini-food-review-mumbai", timeout=10)
            if response.status_code == 200:
                article = response.json()
                
                # Verify it's the correct article
                title = article.get("title", "")
                slug = article.get("slug", "")
                
                if "celini" in title.lower() and slug == "celini-food-review-mumbai":
                    self.log_test("Single Article Retrieval by Slug", True, 
                                f"Successfully retrieved Celini article: '{title}'")
                    return article
                else:
                    self.log_test("Single Article Retrieval by Slug", False, 
                                f"Article mismatch - Title: '{title}', Slug: '{slug}'")
                    return None
            elif response.status_code == 404:
                self.log_test("Single Article Retrieval by Slug", False, 
                            "Celini article not found at slug: celini-food-review-mumbai")
                return None
            else:
                self.log_test("Single Article Retrieval by Slug", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Single Article Retrieval by Slug", False, f"Error: {str(e)}")
            return None
    
    def test_article_content_structure(self, article):
        """Verify all required fields are present (title, category, subcategory, content, images)"""
        if not article:
            self.log_test("Article Content Structure", False, "No article provided for testing")
            return False
        
        try:
            # Required fields check
            required_fields = {
                "title": article.get("title"),
                "category": article.get("category"),
                "subcategory": article.get("subcategory"),
                "body": article.get("body"),  # content
                "hero_image": article.get("hero_image"),
                "gallery": article.get("gallery")
            }
            
            missing_fields = []
            field_details = []
            
            for field, value in required_fields.items():
                if value is None or (isinstance(value, str) and len(value.strip()) == 0):
                    missing_fields.append(field)
                else:
                    if field == "gallery":
                        field_details.append(f"{field}: {len(value)} images")
                    elif field == "body":
                        field_details.append(f"{field}: {len(value)} chars")
                    else:
                        field_details.append(f"{field}: {str(value)[:30]}...")
            
            # Specific content validation
            title_valid = "celini" in required_fields["title"].lower()
            category_valid = required_fields["category"] == "food"
            subcategory_valid = required_fields["subcategory"] in ["food-review", "food review"]
            content_valid = len(required_fields["body"]) > 500  # Substantial content
            hero_image_valid = required_fields["hero_image"] and len(required_fields["hero_image"]) > 10
            gallery_valid = isinstance(required_fields["gallery"], list) and len(required_fields["gallery"]) >= 2
            
            if not missing_fields and title_valid and category_valid and subcategory_valid and content_valid and hero_image_valid and gallery_valid:
                self.log_test("Article Content Structure", True, 
                            f"All required fields present and valid. Details: {'; '.join(field_details[:3])}")
                
                # Additional validation details
                self.log_test("Article Content - Title", True, f"Title contains 'Celini': {required_fields['title']}")
                self.log_test("Article Content - Category", True, f"Category is 'food': {required_fields['category']}")
                self.log_test("Article Content - Subcategory", True, f"Subcategory is food review: {required_fields['subcategory']}")
                self.log_test("Article Content - Body Length", True, f"Content length: {len(required_fields['body'])} characters")
                self.log_test("Article Content - Hero Image", True, f"Hero image URL present: {required_fields['hero_image'][:50]}...")
                self.log_test("Article Content - Gallery", True, f"Gallery has {len(required_fields['gallery'])} images")
                
                return True
            else:
                issues = []
                if missing_fields:
                    issues.append(f"Missing fields: {', '.join(missing_fields)}")
                if not title_valid:
                    issues.append("Title doesn't contain 'Celini'")
                if not category_valid:
                    issues.append(f"Category is '{required_fields['category']}', expected 'food'")
                if not subcategory_valid:
                    issues.append(f"Subcategory is '{required_fields['subcategory']}', expected 'food-review' or 'food review'")
                if not content_valid:
                    issues.append(f"Content too short: {len(required_fields['body'])} chars")
                if not hero_image_valid:
                    issues.append("Hero image missing or invalid")
                if not gallery_valid:
                    issues.append(f"Gallery insufficient: {len(required_fields['gallery']) if isinstance(required_fields['gallery'], list) else 'invalid'} images")
                
                self.log_test("Article Content Structure", False, f"Issues: {'; '.join(issues)}")
                return False
                
        except Exception as e:
            self.log_test("Article Content Structure", False, f"Error: {str(e)}")
            return False
    
    def run_celini_review_tests(self):
        """Run all Celini Food Review tests as per review request"""
        print("🍽️ CELINI FOOD REVIEW BACKEND TESTING")
        print("=" * 50)
        print("Testing to ensure image updates haven't affected backend functionality")
        print()
        
        # 1. API Health Check
        health_ok = self.test_api_health_check()
        
        # 2. Food Category Articles
        celini_article = self.test_food_category_articles()
        
        # 3. Food Review Subcategory
        subcategory_ok = self.test_food_review_subcategory()
        
        # 4. Single Article Retrieval
        retrieved_article = self.test_single_article_retrieval()
        
        # 5. Article Content Structure
        if retrieved_article:
            structure_ok = self.test_article_content_structure(retrieved_article)
        else:
            structure_ok = False
            self.log_test("Article Content Structure", False, "Could not retrieve article for structure testing")
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 60)
        print("📊 CELINI FOOD REVIEW TEST RESULTS")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Priority test results
        priority_tests = [
            "API Health Check",
            "Food Category Articles - Celini Present", 
            "Food Review Subcategory",
            "Single Article Retrieval by Slug",
            "Article Content Structure"
        ]
        
        print(f"\n🎯 PRIORITY TEST RESULTS:")
        for test_name in priority_tests:
            result = next((r for r in self.test_results if r["test"] == test_name), None)
            if result:
                status = "✅" if result["success"] else "❌"
                print(f"  {status} {test_name}")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print(f"\n🔍 CONCLUSION:")
        if failed_tests == 0:
            print("✅ All Celini Food Review backend functionality is working correctly.")
            print("✅ Image updates have NOT affected any backend functionality.")
        else:
            print(f"⚠️  {failed_tests} issues found that may need attention.")
            print("🔧 Backend functionality may need minor fixes.")
        
        print("=" * 60)
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

def main():
    """Main testing function"""
    tester = CeliniFoodReviewTester()
    report = tester.run_celini_review_tests()
    
    # Save detailed report
    with open("/app/celini_review_test_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: /app/celini_review_test_report.json")
    
    return report["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)