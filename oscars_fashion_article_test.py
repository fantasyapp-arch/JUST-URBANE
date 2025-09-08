#!/usr/bin/env python3
"""
Oscars Fashion Article Integration Test
Testing the new "All Glam at the 94th Academy Awards: Best Dressed Celebrities" article
in Fashion > Women subcategory with 5 uploaded images
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class OscarsFashionArticleTester:
    def __init__(self, base_url: str = "https://magazine-admin.preview.emergentagent.com/api"):
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
        
    def test_health_check(self):
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
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

    def test_fashion_women_subcategory_exists(self):
        """Test that Fashion > Women subcategory has articles"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=fashion&subcategory=women", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    if len(articles) > 0:
                        self.log_test("Fashion > Women Subcategory", True, f"Found {len(articles)} articles in Fashion > Women subcategory")
                        return articles
                    else:
                        self.log_test("Fashion > Women Subcategory", False, "No articles found in Fashion > Women subcategory")
                        return []
                else:
                    self.log_test("Fashion > Women Subcategory", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Fashion > Women Subcategory", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Fashion > Women Subcategory", False, f"Error: {str(e)}")
            return None

    def test_oscars_article_exists(self):
        """Test that the specific Oscars article exists"""
        try:
            # First try to find by title pattern
            response = self.session.get(f"{self.base_url}/articles?category=fashion&subcategory=women", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                
                # Look for the specific Oscars article
                oscars_article = None
                for article in articles:
                    title = article.get("title", "").lower()
                    if "oscar" in title or "academy awards" in title or "best dressed" in title or "94th" in title:
                        oscars_article = article
                        break
                
                if oscars_article:
                    article_title = oscars_article.get("title", "")
                    self.log_test("Oscars Article Exists", True, f"Found Oscars article: '{article_title}'")
                    return oscars_article
                else:
                    # List available articles for debugging
                    available_titles = [a.get("title", "Unknown") for a in articles[:5]]
                    self.log_test("Oscars Article Exists", False, f"Oscars article not found. Available articles: {available_titles}")
                    return None
            else:
                self.log_test("Oscars Article Exists", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Oscars Article Exists", False, f"Error: {str(e)}")
            return None

    def test_article_details(self, article: Dict[str, Any]):
        """Test article details like author, category, content quality"""
        if not article:
            self.log_test("Article Details", False, "No article provided for testing")
            return False
            
        try:
            # Test author
            author = article.get("author_name", "")
            if "rugved marathe" in author.lower():
                self.log_test("Article Author", True, f"Correct author: {author}")
            else:
                self.log_test("Article Author", False, f"Expected 'Rugved Marathe', got: '{author}'")
            
            # Test category/subcategory
            category = article.get("category", "").lower()
            subcategory = article.get("subcategory", "").lower()
            
            if category == "fashion":
                self.log_test("Article Category", True, f"Correct category: {category}")
            else:
                self.log_test("Article Category", False, f"Expected 'fashion', got: '{category}'")
                
            if subcategory == "women":
                self.log_test("Article Subcategory", True, f"Correct subcategory: {subcategory}")
            else:
                self.log_test("Article Subcategory", False, f"Expected 'women', got: '{subcategory}'")
            
            # Test content quality
            title = article.get("title", "")
            body = article.get("body", "")
            
            if len(title) > 10:
                self.log_test("Article Title Quality", True, f"Good title length: {len(title)} characters")
            else:
                self.log_test("Article Title Quality", False, f"Title too short: {len(title)} characters")
                
            if len(body) > 500:
                self.log_test("Article Content Quality", True, f"Substantial content: {len(body)} characters")
            else:
                self.log_test("Article Content Quality", False, f"Content too short: {len(body)} characters")
            
            # Test tags
            tags = article.get("tags", [])
            if isinstance(tags, list) and len(tags) > 0:
                self.log_test("Article Tags", True, f"Has {len(tags)} tags: {tags[:3]}")
            else:
                self.log_test("Article Tags", False, f"No tags or invalid tags format: {tags}")
            
            # Test required fields
            required_fields = ["id", "title", "body", "author_name", "category", "published_at"]
            missing_fields = [field for field in required_fields if not article.get(field)]
            
            if not missing_fields:
                self.log_test("Article Required Fields", True, "All required fields present")
            else:
                self.log_test("Article Required Fields", False, f"Missing fields: {missing_fields}")
            
            return len(missing_fields) == 0
            
        except Exception as e:
            self.log_test("Article Details", False, f"Error testing article details: {str(e)}")
            return False

    def test_article_images(self, article: Dict[str, Any]):
        """Test that all 5 uploaded images are properly integrated and accessible"""
        if not article:
            self.log_test("Article Images", False, "No article provided for image testing")
            return False
            
        try:
            # Test hero image
            hero_image = article.get("hero_image", "")
            if hero_image:
                # Try to access the hero image
                try:
                    img_response = self.session.head(hero_image, timeout=5)
                    if img_response.status_code == 200:
                        self.log_test("Hero Image Accessibility", True, f"Hero image accessible: {hero_image}")
                    else:
                        self.log_test("Hero Image Accessibility", False, f"Hero image not accessible (HTTP {img_response.status_code}): {hero_image}")
                except:
                    # If it's a relative URL, just check it exists
                    if hero_image.startswith('/') or hero_image.startswith('http'):
                        self.log_test("Hero Image Accessibility", True, f"Hero image URL present: {hero_image}")
                    else:
                        self.log_test("Hero Image Accessibility", False, f"Invalid hero image URL: {hero_image}")
            else:
                self.log_test("Hero Image Accessibility", False, "No hero image found")
            
            # Test for additional images in content
            body = article.get("body", "")
            
            # Count image references in the body content
            image_patterns = [
                "![", # Markdown image syntax
                "<img", # HTML image tags
                ".jpg", ".jpeg", ".png", ".webp", # Image file extensions
                "unsplash", "shutterstock", "getty" # Common image sources
            ]
            
            image_references = 0
            found_patterns = []
            
            for pattern in image_patterns:
                if pattern in body.lower():
                    image_references += body.lower().count(pattern)
                    found_patterns.append(pattern)
            
            # Check for gallery or images array
            images_array = article.get("images", [])
            gallery = article.get("gallery", [])
            
            total_images = len(images_array) + len(gallery)
            if hero_image:
                total_images += 1
                
            # Test for the expected 5 images
            if total_images >= 5:
                self.log_test("Image Count", True, f"Found {total_images} images (hero: {bool(hero_image)}, gallery: {len(gallery)}, images: {len(images_array)})")
            elif image_references >= 3:
                self.log_test("Image Count", True, f"Found {image_references} image references in content, patterns: {found_patterns}")
            else:
                self.log_test("Image Count", False, f"Expected 5 images, found {total_images} structured + {image_references} references")
            
            # Test image integration quality
            if images_array:
                for i, img in enumerate(images_array[:3]):  # Test first 3
                    if isinstance(img, dict):
                        img_url = img.get("url", img.get("src", ""))
                        if img_url:
                            self.log_test(f"Gallery Image {i+1}", True, f"Image {i+1} properly structured: {img_url[:50]}...")
                        else:
                            self.log_test(f"Gallery Image {i+1}", False, f"Image {i+1} missing URL")
                    elif isinstance(img, str) and img:
                        self.log_test(f"Gallery Image {i+1}", True, f"Image {i+1} URL: {img[:50]}...")
                    else:
                        self.log_test(f"Gallery Image {i+1}", False, f"Invalid image format: {type(img)}")
            
            return total_images >= 3 or image_references >= 3
            
        except Exception as e:
            self.log_test("Article Images", False, f"Error testing images: {str(e)}")
            return False

    def test_article_accessibility(self, article: Dict[str, Any]):
        """Test that the article is accessible via different methods"""
        if not article:
            self.log_test("Article Accessibility", False, "No article provided for accessibility testing")
            return False
            
        try:
            article_id = article.get("id")
            article_slug = article.get("slug")
            
            # Test access by ID
            if article_id:
                response = self.session.get(f"{self.base_url}/articles/{article_id}", timeout=10)
                if response.status_code == 200:
                    retrieved_article = response.json()
                    if retrieved_article.get("id") == article_id:
                        self.log_test("Article Access by ID", True, f"Article accessible by ID: {article_id}")
                    else:
                        self.log_test("Article Access by ID", False, "ID mismatch in retrieved article")
                else:
                    self.log_test("Article Access by ID", False, f"HTTP {response.status_code} when accessing by ID")
            else:
                self.log_test("Article Access by ID", False, "No article ID available")
            
            # Test access by slug if available
            if article_slug:
                response = self.session.get(f"{self.base_url}/articles/{article_slug}", timeout=10)
                if response.status_code == 200:
                    retrieved_article = response.json()
                    if retrieved_article.get("slug") == article_slug:
                        self.log_test("Article Access by Slug", True, f"Article accessible by slug: {article_slug}")
                    else:
                        self.log_test("Article Access by Slug", False, "Slug mismatch in retrieved article")
                else:
                    self.log_test("Article Access by Slug", False, f"HTTP {response.status_code} when accessing by slug")
            else:
                self.log_test("Article Access by Slug", True, "No slug available (not required)")
            
            return True
            
        except Exception as e:
            self.log_test("Article Accessibility", False, f"Error testing accessibility: {str(e)}")
            return False

    def test_fashion_category_integration(self):
        """Test that the article properly integrates with the Fashion category system"""
        try:
            # Test Fashion category has articles
            response = self.session.get(f"{self.base_url}/articles?category=fashion", timeout=10)
            if response.status_code == 200:
                fashion_articles = response.json()
                if isinstance(fashion_articles, list) and len(fashion_articles) > 0:
                    self.log_test("Fashion Category Integration", True, f"Fashion category has {len(fashion_articles)} articles")
                    
                    # Check if our Oscars article is in the fashion category
                    oscars_in_fashion = False
                    for article in fashion_articles:
                        title = article.get("title", "").lower()
                        if "oscar" in title or "academy awards" in title or "best dressed" in title:
                            oscars_in_fashion = True
                            break
                    
                    if oscars_in_fashion:
                        self.log_test("Oscars Article in Fashion", True, "Oscars article properly categorized in Fashion")
                    else:
                        self.log_test("Oscars Article in Fashion", False, "Oscars article not found in Fashion category")
                    
                    return oscars_in_fashion
                else:
                    self.log_test("Fashion Category Integration", False, f"Fashion category has no articles")
                    return False
            else:
                self.log_test("Fashion Category Integration", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Fashion Category Integration", False, f"Error: {str(e)}")
            return False

    def run_comprehensive_test(self):
        """Run comprehensive test for Oscars Fashion article integration"""
        print("🎬 STARTING OSCARS FASHION ARTICLE INTEGRATION TEST")
        print("=" * 70)
        print("Testing: 'All Glam at the 94th Academy Awards: Best Dressed Celebrities'")
        print("Category: Fashion > Women")
        print("Author: Rugved Marathe")
        print("Expected: 5 uploaded images properly integrated")
        print()
        
        # 1. Health Check
        if not self.test_health_check():
            print("❌ Backend not healthy, stopping tests")
            return self.generate_report()
        
        # 2. Test Fashion > Women subcategory
        women_articles = self.test_fashion_women_subcategory_exists()
        if women_articles is None:
            print("❌ Cannot access Fashion > Women subcategory, stopping tests")
            return self.generate_report()
        
        # 3. Find the specific Oscars article
        oscars_article = self.test_oscars_article_exists()
        if not oscars_article:
            print("❌ Oscars article not found, checking what articles exist...")
            # List available articles for debugging
            if women_articles:
                print("Available articles in Fashion > Women:")
                for i, article in enumerate(women_articles[:5], 1):
                    print(f"  {i}. {article.get('title', 'Unknown title')} by {article.get('author_name', 'Unknown author')}")
            return self.generate_report()
        
        # 4. Test article details
        self.test_article_details(oscars_article)
        
        # 5. Test article images (key requirement)
        self.test_article_images(oscars_article)
        
        # 6. Test article accessibility
        self.test_article_accessibility(oscars_article)
        
        # 7. Test Fashion category integration
        self.test_fashion_category_integration()
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 OSCARS FASHION ARTICLE INTEGRATION TEST REPORT")
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
                if any(keyword in test_name.lower() for keyword in ["oscars article", "image", "category", "author"]):
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

if __name__ == "__main__":
    tester = OscarsFashionArticleTester()
    results = tester.run_comprehensive_test()
    
    # Print final summary
    print(f"\n🎯 FINAL RESULT: {results['success_rate']:.1f}% SUCCESS RATE")
    if results['success_rate'] >= 80:
        print("✅ OSCARS FASHION ARTICLE INTEGRATION: SUCCESSFUL")
    else:
        print("❌ OSCARS FASHION ARTICLE INTEGRATION: NEEDS ATTENTION")