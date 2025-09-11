#!/usr/bin/env python3
"""
Aastha Gill Article Integration Testing Suite
Testing the integration of Aastha Gill article in Just Urbane backend
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class AasthaGillAPITester:
    def __init__(self, base_url: str = "https://urbane-admin-fix.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
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
        
    def test_api_health_check(self):
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, "Backend is healthy and responding correctly")
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
    
    def test_people_category_articles(self):
        """Test /api/articles?category=people to confirm Aastha Gill article appears"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=people", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Look for Aastha Gill article
                    aastha_articles = [a for a in articles if "aastha gill" in a.get("title", "").lower()]
                    
                    if aastha_articles:
                        aastha_article = aastha_articles[0]
                        self.log_test("People Category Articles", True, 
                                    f"Found Aastha Gill article in people category: '{aastha_article.get('title')}' (Total people articles: {len(articles)})")
                        return aastha_article
                    else:
                        # Check all article titles for debugging
                        article_titles = [a.get("title", "Unknown") for a in articles]
                        self.log_test("People Category Articles", False, 
                                    f"Aastha Gill article not found in people category. Found {len(articles)} articles: {article_titles[:5]}")
                        return None
                else:
                    self.log_test("People Category Articles", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("People Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("People Category Articles", False, f"Error: {str(e)}")
            return None
    
    def test_celebrities_subcategory_articles(self):
        """Test /api/articles?category=people&subcategory=celebrities to confirm filtering"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=people&subcategory=celebrities", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Look for Aastha Gill article in celebrities subcategory
                    aastha_articles = [a for a in articles if "aastha gill" in a.get("title", "").lower()]
                    
                    if aastha_articles:
                        aastha_article = aastha_articles[0]
                        # Verify it's properly categorized
                        category = aastha_article.get("category", "").lower()
                        subcategory = aastha_article.get("subcategory", "").lower()
                        
                        if category == "people" and subcategory == "celebrities":
                            self.log_test("Celebrities Subcategory Articles", True, 
                                        f"Aastha Gill article properly filtered in people/celebrities: '{aastha_article.get('title')}' (Total celebrities: {len(articles)})")
                            return aastha_article
                        else:
                            self.log_test("Celebrities Subcategory Articles", False, 
                                        f"Aastha Gill article found but wrong categorization: category='{category}', subcategory='{subcategory}'")
                            return None
                    else:
                        # Check all article titles for debugging
                        article_titles = [a.get("title", "Unknown") for a in articles]
                        self.log_test("Celebrities Subcategory Articles", False, 
                                    f"Aastha Gill article not found in people/celebrities. Found {len(articles)} articles: {article_titles}")
                        return None
                else:
                    self.log_test("Celebrities Subcategory Articles", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("Celebrities Subcategory Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Celebrities Subcategory Articles", False, f"Error: {str(e)}")
            return None
    
    def test_single_article_retrieval(self):
        """Test /api/articles/aastha-gill-buzz-queen-bollywood-singer-interview to verify article data"""
        slug = "aastha-gill-buzz-queen-bollywood-singer-interview"
        try:
            response = self.session.get(f"{self.base_url}/articles/{slug}", timeout=10)
            if response.status_code == 200:
                article = response.json()
                if isinstance(article, dict):
                    title = article.get("title", "")
                    if "aastha gill" in title.lower():
                        self.log_test("Single Article Retrieval", True, 
                                    f"Successfully retrieved Aastha Gill article by slug: '{title}'")
                        return article
                    else:
                        self.log_test("Single Article Retrieval", False, 
                                    f"Retrieved article but title doesn't match Aastha Gill: '{title}'")
                        return None
                else:
                    self.log_test("Single Article Retrieval", False, f"Expected dict, got: {type(article)}")
                    return None
            else:
                self.log_test("Single Article Retrieval", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Single Article Retrieval", False, f"Error: {str(e)}")
            return None
    
    def test_article_data_integrity(self, article: dict):
        """Verify all required fields are present (title, author, category, subcategory, 4 images, content)"""
        if not article:
            self.log_test("Article Data Integrity", False, "No article provided for integrity check")
            return False
        
        try:
            # Required fields check
            required_fields = {
                "title": "Article title",
                "author_name": "Author name", 
                "category": "Category",
                "subcategory": "Subcategory",
                "body": "Content/body",
                "hero_image": "Hero image"
            }
            
            missing_fields = []
            field_values = {}
            
            for field, description in required_fields.items():
                value = article.get(field)
                if not value:
                    missing_fields.append(description)
                else:
                    field_values[field] = value
            
            if missing_fields:
                self.log_test("Article Data Integrity - Required Fields", False, 
                            f"Missing required fields: {', '.join(missing_fields)}")
                return False
            else:
                self.log_test("Article Data Integrity - Required Fields", True, 
                            f"All required fields present: title, author ({field_values.get('author_name')}), category ({field_values.get('category')}), subcategory ({field_values.get('subcategory')})")
            
            # Verify specific expected values
            author = field_values.get("author_name", "").lower()
            category = field_values.get("category", "").lower()
            subcategory = field_values.get("subcategory", "").lower()
            
            if "amisha shirgave" in author:
                self.log_test("Article Data Integrity - Author", True, f"Correct author: {field_values.get('author_name')}")
            else:
                self.log_test("Article Data Integrity - Author", False, f"Unexpected author: {field_values.get('author_name')} (expected: Amisha Shirgave)")
            
            if category == "people":
                self.log_test("Article Data Integrity - Category", True, f"Correct category: {field_values.get('category')}")
            else:
                self.log_test("Article Data Integrity - Category", False, f"Unexpected category: {field_values.get('category')} (expected: people)")
            
            if subcategory == "celebrities":
                self.log_test("Article Data Integrity - Subcategory", True, f"Correct subcategory: {field_values.get('subcategory')}")
            else:
                self.log_test("Article Data Integrity - Subcategory", False, f"Unexpected subcategory: {field_values.get('subcategory')} (expected: celebrities)")
            
            # Check content sections
            content = field_values.get("body", "")
            expected_sections = ["childhood", "bollywood debut", "badshah", "kkk"]
            found_sections = []
            
            for section in expected_sections:
                if section.lower() in content.lower():
                    found_sections.append(section)
            
            if len(found_sections) >= 3:
                self.log_test("Article Data Integrity - Content Sections", True, 
                            f"Found expected interview sections: {', '.join(found_sections)} (Content length: {len(content)} chars)")
            else:
                self.log_test("Article Data Integrity - Content Sections", False, 
                            f"Missing expected interview sections. Found: {', '.join(found_sections)}, Expected: {', '.join(expected_sections)}")
            
            return True
            
        except Exception as e:
            self.log_test("Article Data Integrity", False, f"Error checking data integrity: {str(e)}")
            return False
    
    def test_image_urls_validation(self, article: dict):
        """Verify all 4 image URLs from customer assets are accessible"""
        if not article:
            self.log_test("Image URLs Validation", False, "No article provided for image validation")
            return False
        
        try:
            # Get hero image
            hero_image = article.get("hero_image")
            images_to_test = []
            
            if hero_image:
                images_to_test.append(("Hero Image", hero_image))
            
            # Look for additional images in content or other fields
            content = article.get("body", "")
            
            # Check for image references in content (common patterns)
            import re
            image_patterns = [
                r'https?://[^\s]+\.(?:jpg|jpeg|png|gif|webp)',
                r'src="([^"]+)"',
                r'!\[.*?\]\(([^)]+)\)'
            ]
            
            additional_images = []
            for pattern in image_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                additional_images.extend(matches)
            
            # Add unique additional images
            for i, img_url in enumerate(set(additional_images)):
                if img_url and img_url != hero_image:
                    images_to_test.append((f"Content Image {i+1}", img_url))
            
            if len(images_to_test) == 0:
                self.log_test("Image URLs Validation", False, "No image URLs found in article")
                return False
            
            # Test accessibility of each image
            accessible_images = 0
            total_images = len(images_to_test)
            
            for img_name, img_url in images_to_test:
                try:
                    # Test image URL accessibility
                    img_response = self.session.head(img_url, timeout=5)
                    if img_response.status_code == 200:
                        accessible_images += 1
                        self.log_test(f"Image Accessibility - {img_name}", True, f"Image accessible: {img_url[:60]}...")
                    else:
                        self.log_test(f"Image Accessibility - {img_name}", False, f"Image not accessible (HTTP {img_response.status_code}): {img_url[:60]}...")
                except Exception as e:
                    self.log_test(f"Image Accessibility - {img_name}", False, f"Image test failed: {str(e)}")
            
            # Overall image validation result
            if accessible_images == total_images and total_images >= 1:
                self.log_test("Image URLs Validation", True, f"All {accessible_images}/{total_images} image URLs are accessible")
                return True
            elif accessible_images > 0:
                self.log_test("Image URLs Validation", False, f"Only {accessible_images}/{total_images} image URLs are accessible")
                return False
            else:
                self.log_test("Image URLs Validation", False, f"No image URLs are accessible ({total_images} tested)")
                return False
                
        except Exception as e:
            self.log_test("Image URLs Validation", False, f"Error validating image URLs: {str(e)}")
            return False
    
    def test_category_system(self):
        """Confirm people category exists with celebrities subcategory"""
        try:
            # Test categories endpoint
            response = self.session.get(f"{self.base_url}/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    # Look for people category
                    people_category = None
                    for category in categories:
                        if isinstance(category, dict):
                            cat_name = category.get("name", "").lower()
                            if cat_name == "people":
                                people_category = category
                                break
                    
                    if people_category:
                        self.log_test("Category System - People Category", True, 
                                    f"People category exists: {people_category.get('name')}")
                        
                        # Check for celebrities subcategory
                        subcategories = people_category.get("subcategories", [])
                        if isinstance(subcategories, list):
                            celebrities_found = any("celebrities" in str(sub).lower() for sub in subcategories)
                            if celebrities_found:
                                self.log_test("Category System - Celebrities Subcategory", True, 
                                            f"Celebrities subcategory found in people category: {subcategories}")
                                return True
                            else:
                                self.log_test("Category System - Celebrities Subcategory", False, 
                                            f"Celebrities subcategory not found. Available subcategories: {subcategories}")
                                return False
                        else:
                            # Try alternative approach - test with actual articles
                            test_response = self.session.get(f"{self.base_url}/articles?category=people&subcategory=celebrities", timeout=10)
                            if test_response.status_code == 200:
                                test_articles = test_response.json()
                                if isinstance(test_articles, list):
                                    self.log_test("Category System - Celebrities Subcategory", True, 
                                                f"Celebrities subcategory functional (found {len(test_articles)} articles)")
                                    return True
                            
                            self.log_test("Category System - Celebrities Subcategory", False, 
                                        "Celebrities subcategory not accessible")
                            return False
                    else:
                        # Check all category names for debugging
                        category_names = [cat.get("name", "Unknown") if isinstance(cat, dict) else str(cat) for cat in categories]
                        self.log_test("Category System - People Category", False, 
                                    f"People category not found. Available categories: {category_names}")
                        return False
                else:
                    self.log_test("Category System", False, f"Expected list, got: {type(categories)}")
                    return False
            else:
                self.log_test("Category System", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Category System", False, f"Error: {str(e)}")
            return False
    
    def run_aastha_gill_tests(self):
        """Run comprehensive Aastha Gill article integration tests"""
        print("🎤 STARTING AASTHA GILL ARTICLE INTEGRATION TESTING")
        print("=" * 60)
        print("Testing Aastha Gill 'Buzz Queen' article integration in Just Urbane backend...")
        print()
        
        # 1. API Health Check
        health_ok = self.test_api_health_check()
        if not health_ok:
            print("❌ Backend health check failed. Stopping tests.")
            return self.generate_report()
        
        # 2. People Category Articles
        people_article = self.test_people_category_articles()
        
        # 3. Celebrities Subcategory Articles  
        celebrities_article = self.test_celebrities_subcategory_articles()
        
        # 4. Single Article Retrieval
        single_article = self.test_single_article_retrieval()
        
        # Use the best available article for detailed testing
        test_article = single_article or celebrities_article or people_article
        
        if test_article:
            # 5. Article Data Integrity
            self.test_article_data_integrity(test_article)
            
            # 6. Image URLs Validation
            self.test_image_urls_validation(test_article)
        else:
            self.log_test("Article Data Integrity", False, "No Aastha Gill article found for detailed testing")
            self.log_test("Image URLs Validation", False, "No Aastha Gill article found for image testing")
        
        # 7. Category System
        self.test_category_system()
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*60)
        print("📊 AASTHA GILL ARTICLE INTEGRATION TEST REPORT")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"📈 OVERALL RESULTS:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests} ✅")
        print(f"   Failed: {failed_tests} ❌")
        print(f"   Success Rate: {success_rate:.1f}%")
        print()
        
        # Categorize results by priority
        critical_failures = []
        minor_issues = []
        
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["api health", "people category", "celebrities subcategory", "single article", "category system"]):
                    critical_failures.append(f"❌ {test_name}: {result['message']}")
                else:
                    minor_issues.append(f"⚠️ {test_name}: {result['message']}")
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES:")
            for failure in critical_failures:
                print(f"   {failure}")
            print()
        
        if minor_issues:
            print("⚠️ MINOR ISSUES:")
            for issue in minor_issues:
                print(f"   {issue}")
            print()
        
        # Success highlights
        successes = [result for result in self.test_results if result["success"]]
        if successes:
            print("✅ KEY SUCCESSES:")
            for success in successes:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*60)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "minor_issues": minor_issues
        }

def main():
    """Main function to run Aastha Gill article tests"""
    tester = AasthaGillAPITester()
    results = tester.run_aastha_gill_tests()
    
    # Return exit code based on success rate
    if results["success_rate"] >= 80:
        print(f"\n🎉 AASTHA GILL INTEGRATION TESTING COMPLETED SUCCESSFULLY!")
        print(f"Success Rate: {results['success_rate']:.1f}% - Aastha Gill article integration is working properly.")
        return 0
    else:
        print(f"\n⚠️ AASTHA GILL INTEGRATION TESTING COMPLETED WITH ISSUES")
        print(f"Success Rate: {results['success_rate']:.1f}% - Some issues need to be addressed.")
        return 1

if __name__ == "__main__":
    exit(main())