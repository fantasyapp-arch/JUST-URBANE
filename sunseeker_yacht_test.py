#!/usr/bin/env python3
"""
Sunseeker Yacht Article Integration Testing
Testing the new Sunseeker 65 Sport yacht article in Luxury > Yachts category
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class SunseekerYachtTester:
    def __init__(self, base_url: str = "https://just-urbane-ux.preview.emergentagent.com/api"):
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
        
    def test_api_health(self):
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, "API is healthy and responding")
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

    def test_luxury_category_exists(self):
        """Test if Luxury category exists in the system"""
        try:
            response = self.session.get(f"{self.base_url}/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    # Look for luxury category (case insensitive)
                    luxury_categories = [cat for cat in categories if 
                                       cat.get("name", "").lower() == "luxury" or 
                                       "luxury" in cat.get("name", "").lower()]
                    
                    if luxury_categories:
                        luxury_cat = luxury_categories[0]
                        subcategories = luxury_cat.get("subcategories", [])
                        
                        # Check if yachts subcategory exists
                        has_yachts = any("yacht" in str(sub).lower() for sub in subcategories)
                        
                        if has_yachts:
                            self.log_test("Luxury > Yachts Category", True, f"Found Luxury category with Yachts subcategory: {subcategories}")
                        else:
                            self.log_test("Luxury > Yachts Category", False, f"Luxury category found but no Yachts subcategory. Available: {subcategories}")
                        
                        return luxury_cat
                    else:
                        self.log_test("Luxury Category", False, f"Luxury category not found. Available categories: {[cat.get('name') for cat in categories]}")
                        return None
                else:
                    self.log_test("Categories API", False, f"Invalid response format: {type(categories)}")
                    return None
            else:
                self.log_test("Categories API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Luxury Category Test", False, f"Error: {str(e)}")
            return None

    def test_sunseeker_article_exists(self):
        """Test if the Sunseeker 65 Sport article exists"""
        try:
            # First, try to get articles from luxury/yachts category
            response = self.session.get(f"{self.base_url}/articles?category=luxury&subcategory=yachts", timeout=10)
            
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Look for Sunseeker article
                    sunseeker_articles = [article for article in articles if 
                                        "sunseeker" in article.get("title", "").lower() and
                                        "65 sport" in article.get("title", "").lower()]
                    
                    if sunseeker_articles:
                        sunseeker_article = sunseeker_articles[0]
                        self.log_test("Sunseeker Article Exists", True, f"Found Sunseeker 65 Sport article: '{sunseeker_article.get('title')}'")
                        return sunseeker_article
                    else:
                        # Try broader search in all luxury articles
                        response_luxury = self.session.get(f"{self.base_url}/articles?category=luxury", timeout=10)
                        if response_luxury.status_code == 200:
                            luxury_articles = response_luxury.json()
                            sunseeker_articles = [article for article in luxury_articles if 
                                                "sunseeker" in article.get("title", "").lower()]
                            
                            if sunseeker_articles:
                                sunseeker_article = sunseeker_articles[0]
                                self.log_test("Sunseeker Article Found", True, f"Found Sunseeker article in luxury category: '{sunseeker_article.get('title')}'")
                                return sunseeker_article
                        
                        self.log_test("Sunseeker Article", False, f"Sunseeker 65 Sport article not found in luxury/yachts. Available articles: {[a.get('title') for a in articles[:5]]}")
                        return None
                else:
                    self.log_test("Luxury Articles API", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Luxury Articles API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Sunseeker Article Test", False, f"Error: {str(e)}")
            return None

    def test_article_details(self, article: Dict[str, Any]):
        """Test article details and content quality"""
        if not article:
            self.log_test("Article Details", False, "No article provided for testing")
            return False
            
        try:
            # Test 1: Title verification
            title = article.get("title", "")
            expected_title = "Sunseeker 65 Sport: The Ultimate Luxury Yacht Experience"
            
            if "sunseeker" in title.lower() and "65 sport" in title.lower():
                self.log_test("Article Title", True, f"Correct title format: '{title}'")
            else:
                self.log_test("Article Title", False, f"Title doesn't match expected format. Got: '{title}', Expected: '{expected_title}'")
            
            # Test 2: Author verification
            author = article.get("author_name", "")
            expected_author = "Harshit Srinivas"
            
            if author == expected_author:
                self.log_test("Article Author", True, f"Correct author: {author}")
            else:
                self.log_test("Article Author", False, f"Author mismatch. Got: '{author}', Expected: '{expected_author}'")
            
            # Test 3: Category and subcategory verification
            category = article.get("category", "")
            subcategory = article.get("subcategory", "")
            
            if category.lower() == "luxury":
                self.log_test("Article Category", True, f"Correct category: {category}")
            else:
                self.log_test("Article Category", False, f"Category mismatch. Got: '{category}', Expected: 'luxury'")
            
            if subcategory and "yacht" in subcategory.lower():
                self.log_test("Article Subcategory", True, f"Correct subcategory: {subcategory}")
            else:
                self.log_test("Article Subcategory", False, f"Subcategory mismatch. Got: '{subcategory}', Expected: 'yachts'")
            
            # Test 4: Content quality
            body = article.get("body", "")
            if len(body) > 500:
                self.log_test("Article Content Quality", True, f"Substantial content: {len(body)} characters")
            else:
                self.log_test("Article Content Quality", False, f"Insufficient content: {len(body)} characters")
            
            # Test 5: Tags verification
            tags = article.get("tags", [])
            yacht_related_tags = ["yacht", "luxury", "sunseeker", "marine", "boat", "sailing"]
            has_yacht_tags = any(tag.lower() in [t.lower() for t in yacht_related_tags] for tag in tags)
            
            if has_yacht_tags:
                self.log_test("Article Tags", True, f"Relevant tags found: {tags}")
            else:
                self.log_test("Article Tags", False, f"No yacht-related tags found: {tags}")
            
            # Test 6: Hero image
            hero_image = article.get("hero_image", "")
            if hero_image and (hero_image.startswith("http") or hero_image.startswith("/")):
                self.log_test("Article Hero Image", True, f"Hero image URL present: {hero_image[:50]}...")
            else:
                self.log_test("Article Hero Image", False, f"No valid hero image URL: {hero_image}")
            
            return True
            
        except Exception as e:
            self.log_test("Article Details Test", False, f"Error: {str(e)}")
            return False

    def test_yacht_images_accessibility(self, article: Dict[str, Any]):
        """Test yacht image URLs for accessibility"""
        if not article:
            self.log_test("Image Accessibility", False, "No article provided for testing")
            return False
            
        try:
            images_to_test = []
            
            # Hero image
            hero_image = article.get("hero_image", "")
            if hero_image:
                images_to_test.append(("Hero Image", hero_image))
            
            # Look for additional images in body content
            body = article.get("body", "")
            if "http" in body:
                # Extract potential image URLs from body content
                import re
                url_pattern = r'https?://[^\s<>"]+\.(jpg|jpeg|png|gif|webp)'
                found_urls = re.findall(url_pattern, body, re.IGNORECASE)
                for i, (url, ext) in enumerate(found_urls):
                    images_to_test.append((f"Body Image {i+1}", url + "." + ext))
            
            if not images_to_test:
                self.log_test("Image URLs Found", False, "No image URLs found in article")
                return False
            
            accessible_images = 0
            total_images = len(images_to_test)
            
            for image_name, image_url in images_to_test:
                try:
                    # Test image accessibility with HEAD request
                    response = self.session.head(image_url, timeout=10, allow_redirects=True)
                    if response.status_code == 200:
                        content_type = response.headers.get("content-type", "")
                        if "image" in content_type.lower():
                            accessible_images += 1
                            self.log_test(f"Image Accessibility - {image_name}", True, f"Image accessible: {image_url[:50]}...")
                        else:
                            self.log_test(f"Image Accessibility - {image_name}", False, f"Not an image: {content_type}")
                    else:
                        self.log_test(f"Image Accessibility - {image_name}", False, f"HTTP {response.status_code}: {image_url[:50]}...")
                except Exception as e:
                    self.log_test(f"Image Accessibility - {image_name}", False, f"Error accessing image: {str(e)}")
            
            if accessible_images >= 2:
                self.log_test("Yacht Images Accessibility", True, f"{accessible_images}/{total_images} yacht images are accessible")
                return True
            else:
                self.log_test("Yacht Images Accessibility", False, f"Only {accessible_images}/{total_images} yacht images are accessible")
                return False
                
        except Exception as e:
            self.log_test("Image Accessibility Test", False, f"Error: {str(e)}")
            return False

    def test_article_retrieval_by_slug(self, article: Dict[str, Any]):
        """Test article retrieval by slug"""
        if not article:
            self.log_test("Article Slug Test", False, "No article provided for testing")
            return False
            
        try:
            article_id = article.get("id")
            slug = article.get("slug")
            
            if not article_id:
                self.log_test("Article ID", False, "No article ID found")
                return False
            
            # Test retrieval by ID
            response_id = self.session.get(f"{self.base_url}/articles/{article_id}", timeout=10)
            if response_id.status_code == 200:
                article_by_id = response_id.json()
                self.log_test("Article Retrieval by ID", True, f"Successfully retrieved by ID: {article_id}")
                
                # Test retrieval by slug if available
                if slug:
                    response_slug = self.session.get(f"{self.base_url}/articles/{slug}", timeout=10)
                    if response_slug.status_code == 200:
                        article_by_slug = response_slug.json()
                        if article_by_id.get("id") == article_by_slug.get("id"):
                            self.log_test("Article Retrieval by Slug", True, f"Successfully retrieved by slug: {slug}")
                        else:
                            self.log_test("Article Retrieval by Slug", False, "Slug and ID return different articles")
                    else:
                        self.log_test("Article Retrieval by Slug", False, f"HTTP {response_slug.status_code} for slug: {slug}")
                else:
                    self.log_test("Article Slug", False, "No slug found in article")
                
                return True
            else:
                self.log_test("Article Retrieval by ID", False, f"HTTP {response_id.status_code}: {response_id.text}")
                return False
                
        except Exception as e:
            self.log_test("Article Retrieval Test", False, f"Error: {str(e)}")
            return False

    def test_luxury_yachts_subcategory_content(self):
        """Test Luxury > Yachts subcategory has proper content"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=luxury&subcategory=yachts", timeout=10)
            
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    if len(articles) > 0:
                        self.log_test("Luxury > Yachts Content", True, f"Found {len(articles)} articles in Luxury > Yachts subcategory")
                        
                        # Check if Sunseeker article is among them
                        sunseeker_found = any("sunseeker" in article.get("title", "").lower() for article in articles)
                        if sunseeker_found:
                            self.log_test("Sunseeker in Yachts Category", True, "Sunseeker article properly categorized in Luxury > Yachts")
                        else:
                            self.log_test("Sunseeker in Yachts Category", False, "Sunseeker article not found in Luxury > Yachts category")
                        
                        return articles
                    else:
                        self.log_test("Luxury > Yachts Content", False, "No articles found in Luxury > Yachts subcategory")
                        return []
                else:
                    self.log_test("Luxury > Yachts API", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Luxury > Yachts API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Luxury > Yachts Test", False, f"Error: {str(e)}")
            return None

    def run_sunseeker_yacht_tests(self):
        """Run comprehensive Sunseeker yacht article integration tests"""
        print("🛥️ STARTING SUNSEEKER YACHT ARTICLE INTEGRATION TESTING")
        print("=" * 70)
        print("Testing Sunseeker 65 Sport yacht article in Luxury > Yachts category...")
        print()
        
        # 1. API Health Check
        if not self.test_api_health():
            print("❌ API is not healthy. Stopping tests.")
            return self.generate_report()
        
        # 2. Test Luxury category exists
        luxury_category = self.test_luxury_category_exists()
        
        # 3. Test Luxury > Yachts subcategory content
        yacht_articles = self.test_luxury_yachts_subcategory_content()
        
        # 4. Test Sunseeker article exists
        sunseeker_article = self.test_sunseeker_article_exists()
        
        if sunseeker_article:
            # 5. Test article details
            self.test_article_details(sunseeker_article)
            
            # 6. Test yacht images accessibility
            self.test_yacht_images_accessibility(sunseeker_article)
            
            # 7. Test article retrieval methods
            self.test_article_retrieval_by_slug(sunseeker_article)
        else:
            print("❌ Sunseeker article not found. Skipping detailed tests.")
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("🛥️ SUNSEEKER YACHT ARTICLE INTEGRATION TEST REPORT")
        print("="*70)
        
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
                if any(keyword in test_name.lower() for keyword in ["sunseeker article", "luxury", "yachts", "category"]):
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
        
        print("\n" + "="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "minor_issues": minor_issues
        }

def main():
    """Main function to run Sunseeker yacht article tests"""
    tester = SunseekerYachtTester()
    results = tester.run_sunseeker_yacht_tests()
    
    # Return exit code based on success rate
    if results["success_rate"] >= 80:
        print(f"\n🎉 SUNSEEKER YACHT ARTICLE INTEGRATION: SUCCESS ({results['success_rate']:.1f}%)")
        return 0
    else:
        print(f"\n❌ SUNSEEKER YACHT ARTICLE INTEGRATION: NEEDS ATTENTION ({results['success_rate']:.1f}%)")
        return 1

if __name__ == "__main__":
    exit(main())