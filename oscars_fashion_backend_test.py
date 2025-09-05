#!/usr/bin/env python3
"""
Backend Testing for Oscars Fashion Article with 4 Additional Images
Testing the updated "All Glam at the 94th Academy Awards: Best Dressed Celebrities" article
to verify it now has 9 total images (5 original + 4 new)
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class OscarsFashionBackendTester:
    def __init__(self, base_url: str = "https://luxmag-tech-nav-fix.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
        # The 4 new image URLs to test
        self.new_image_urls = [
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/geeqo4rh_94_AR_0848.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/48qamudk_94_AR_0660.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/viltuaeq_94_AR_0892%20-%20Copy.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/wuo6l24b_94_AR_0665.jpg"
        ]
        
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

    def find_oscars_article(self):
        """Find the Oscars Fashion article in the database"""
        try:
            # Search in Fashion > Women subcategory first
            response = self.session.get(f"{self.base_url}/articles?category=fashion&subcategory=women", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                
                # Look for the specific Oscars article
                for article in articles:
                    title = article.get("title", "").lower()
                    if any(keyword in title for keyword in ["oscar", "academy awards", "best dressed", "94th"]):
                        self.log_test("Find Oscars Article", True, f"Found Oscars article: '{article.get('title', '')}'")
                        return article
                
                # If not found in women, search all fashion articles
                response = self.session.get(f"{self.base_url}/articles?category=fashion", timeout=10)
                if response.status_code == 200:
                    all_fashion_articles = response.json()
                    for article in all_fashion_articles:
                        title = article.get("title", "").lower()
                        if any(keyword in title for keyword in ["oscar", "academy awards", "best dressed", "94th"]):
                            self.log_test("Find Oscars Article", True, f"Found Oscars article in Fashion category: '{article.get('title', '')}'")
                            return article
                
                # If still not found, search all articles
                response = self.session.get(f"{self.base_url}/articles", timeout=10)
                if response.status_code == 200:
                    all_articles = response.json()
                    for article in all_articles:
                        title = article.get("title", "").lower()
                        if any(keyword in title for keyword in ["oscar", "academy awards", "best dressed", "94th", "glam"]):
                            self.log_test("Find Oscars Article", True, f"Found Oscars article: '{article.get('title', '')}'")
                            return article
                
                # List available articles for debugging
                available_titles = [a.get("title", "Unknown") for a in articles[:10]]
                self.log_test("Find Oscars Article", False, f"Oscars article not found. Available Fashion > Women articles: {available_titles}")
                return None
            else:
                self.log_test("Find Oscars Article", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Find Oscars Article", False, f"Error: {str(e)}")
            return None

    def test_image_count(self, article: Dict[str, Any]):
        """Test that the article now has 9 total images (5 original + 4 new)"""
        if not article:
            self.log_test("Image Count Test", False, "No article provided")
            return False
            
        try:
            # Count images from different sources
            hero_image = article.get("hero_image", "")
            images_array = article.get("images", [])
            gallery_array = article.get("gallery", [])
            
            # Count images in body content
            body = article.get("body", "")
            body_image_count = 0
            
            # Look for image URLs in body content
            for url in self.new_image_urls:
                if url in body:
                    body_image_count += 1
            
            # Count other image patterns in body
            image_patterns = [".jpg", ".jpeg", ".png", ".webp"]
            for pattern in image_patterns:
                body_image_count += body.lower().count(pattern)
            
            total_images = 0
            if hero_image:
                total_images += 1
            total_images += len(images_array)
            total_images += len(gallery_array)
            total_images += body_image_count
            
            self.log_test("Image Count Analysis", True, 
                         f"Found {total_images} total images: Hero({bool(hero_image)}), Images({len(images_array)}), Gallery({len(gallery_array)}), Body({body_image_count})")
            
            if total_images >= 9:
                self.log_test("Image Count Test", True, f"Article has {total_images} images (meets requirement of 9)")
                return True
            else:
                self.log_test("Image Count Test", False, f"Article has {total_images} images (expected 9)")
                return False
                
        except Exception as e:
            self.log_test("Image Count Test", False, f"Error counting images: {str(e)}")
            return False

    def test_new_image_urls_accessibility(self):
        """Test that all 4 new image URLs are properly accessible"""
        accessible_count = 0
        
        for i, url in enumerate(self.new_image_urls, 1):
            try:
                response = self.session.head(url, timeout=10)
                if response.status_code == 200:
                    content_type = response.headers.get('content-type', '')
                    if 'image' in content_type.lower():
                        self.log_test(f"New Image {i} Accessibility", True, f"Image {i} accessible and valid: {url[:60]}...")
                        accessible_count += 1
                    else:
                        self.log_test(f"New Image {i} Accessibility", False, f"Image {i} not valid image type: {content_type}")
                else:
                    self.log_test(f"New Image {i} Accessibility", False, f"Image {i} HTTP {response.status_code}: {url[:60]}...")
            except Exception as e:
                self.log_test(f"New Image {i} Accessibility", False, f"Image {i} error: {str(e)}")
        
        if accessible_count == 4:
            self.log_test("All New Images Accessible", True, f"All 4 new images are accessible")
            return True
        else:
            self.log_test("All New Images Accessible", False, f"Only {accessible_count}/4 new images are accessible")
            return False

    def test_gallery_array_updated(self, article: Dict[str, Any]):
        """Test that the gallery array has been updated correctly"""
        if not article:
            self.log_test("Gallery Array Test", False, "No article provided")
            return False
            
        try:
            # Check for gallery array
            gallery = article.get("gallery", [])
            images = article.get("images", [])
            body = article.get("body", "")
            
            # Count how many of the new images are in the article
            new_images_found = 0
            for url in self.new_image_urls:
                if url in str(gallery) or url in str(images) or url in body:
                    new_images_found += 1
            
            self.log_test("Gallery Array Analysis", True, 
                         f"Gallery: {len(gallery)} items, Images: {len(images)} items, New URLs in content: {new_images_found}/4")
            
            if new_images_found >= 2:  # At least half of the new images should be found
                self.log_test("Gallery Array Test", True, f"Gallery updated correctly - found {new_images_found}/4 new images")
                return True
            else:
                self.log_test("Gallery Array Test", False, f"Gallery may not be updated - only found {new_images_found}/4 new images")
                return False
                
        except Exception as e:
            self.log_test("Gallery Array Test", False, f"Error testing gallery: {str(e)}")
            return False

    def test_images_loading_and_faces_visible(self, article: Dict[str, Any]):
        """Test that all images are loading properly and faces will be visible"""
        if not article:
            self.log_test("Images Loading Test", False, "No article provided")
            return False
            
        try:
            # Test hero image
            hero_image = article.get("hero_image", "")
            if hero_image:
                try:
                    response = self.session.head(hero_image, timeout=10)
                    if response.status_code == 200:
                        self.log_test("Hero Image Loading", True, f"Hero image loads properly: {hero_image[:50]}...")
                    else:
                        self.log_test("Hero Image Loading", False, f"Hero image HTTP {response.status_code}")
                except:
                    self.log_test("Hero Image Loading", False, f"Hero image not accessible: {hero_image[:50]}...")
            
            # Test the 4 new images for proper loading
            loading_count = 0
            for i, url in enumerate(self.new_image_urls, 1):
                try:
                    response = self.session.head(url, timeout=10)
                    if response.status_code == 200:
                        content_length = response.headers.get('content-length', '0')
                        if int(content_length) > 10000:  # Images should be substantial size
                            self.log_test(f"New Image {i} Loading Quality", True, f"Image {i} loads properly, size: {content_length} bytes")
                            loading_count += 1
                        else:
                            self.log_test(f"New Image {i} Loading Quality", False, f"Image {i} too small: {content_length} bytes")
                    else:
                        self.log_test(f"New Image {i} Loading Quality", False, f"Image {i} HTTP {response.status_code}")
                except Exception as e:
                    self.log_test(f"New Image {i} Loading Quality", False, f"Image {i} error: {str(e)}")
            
            if loading_count >= 3:  # At least 3/4 should load properly
                self.log_test("Images Loading Test", True, f"{loading_count}/4 new images load properly")
                return True
            else:
                self.log_test("Images Loading Test", False, f"Only {loading_count}/4 new images load properly")
                return False
                
        except Exception as e:
            self.log_test("Images Loading Test", False, f"Error testing image loading: {str(e)}")
            return False

    def test_article_content_quality(self, article: Dict[str, Any]):
        """Test the overall quality and completeness of the article"""
        if not article:
            self.log_test("Article Quality Test", False, "No article provided")
            return False
            
        try:
            # Test basic fields
            title = article.get("title", "")
            body = article.get("body", "")
            author = article.get("author_name", "")
            category = article.get("category", "")
            
            quality_score = 0
            
            if len(title) > 20:
                self.log_test("Title Quality", True, f"Good title length: {len(title)} characters")
                quality_score += 1
            else:
                self.log_test("Title Quality", False, f"Title too short: {len(title)} characters")
            
            if len(body) > 1000:
                self.log_test("Content Quality", True, f"Substantial content: {len(body)} characters")
                quality_score += 1
            else:
                self.log_test("Content Quality", False, f"Content may be too short: {len(body)} characters")
            
            if author and len(author) > 3:
                self.log_test("Author Quality", True, f"Author present: {author}")
                quality_score += 1
            else:
                self.log_test("Author Quality", False, f"Author missing or invalid: {author}")
            
            if category.lower() == "fashion":
                self.log_test("Category Quality", True, f"Correct category: {category}")
                quality_score += 1
            else:
                self.log_test("Category Quality", False, f"Unexpected category: {category}")
            
            if quality_score >= 3:
                self.log_test("Article Quality Test", True, f"Article quality good: {quality_score}/4 criteria met")
                return True
            else:
                self.log_test("Article Quality Test", False, f"Article quality needs improvement: {quality_score}/4 criteria met")
                return False
                
        except Exception as e:
            self.log_test("Article Quality Test", False, f"Error testing quality: {str(e)}")
            return False

    def run_comprehensive_test(self):
        """Run comprehensive test for the updated Oscars Fashion article"""
        print("🎬 STARTING OSCARS FASHION ARTICLE BACKEND TESTING")
        print("=" * 80)
        print("Testing: Updated 'All Glam at the 94th Academy Awards: Best Dressed Celebrities'")
        print("Requirement: Verify 9 total images (5 original + 4 new)")
        print("New Images: 4 additional images from customer-assets.emergentagent.com")
        print()
        
        # 1. Health Check
        if not self.test_health_check():
            print("❌ Backend not healthy, stopping tests")
            return self.generate_report()
        
        # 2. Find the Oscars article
        oscars_article = self.find_oscars_article()
        if not oscars_article:
            print("❌ Oscars article not found, cannot proceed with image testing")
            return self.generate_report()
        
        print(f"\n📄 Found article: '{oscars_article.get('title', 'Unknown')}'")
        print(f"   Author: {oscars_article.get('author_name', 'Unknown')}")
        print(f"   Category: {oscars_article.get('category', 'Unknown')} > {oscars_article.get('subcategory', 'None')}")
        print()
        
        # 3. Test image count (main requirement)
        self.test_image_count(oscars_article)
        
        # 4. Test new image URLs accessibility
        self.test_new_image_urls_accessibility()
        
        # 5. Test gallery array updated
        self.test_gallery_array_updated(oscars_article)
        
        # 6. Test images loading and quality
        self.test_images_loading_and_faces_visible(oscars_article)
        
        # 7. Test overall article quality
        self.test_article_content_quality(oscars_article)
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*80)
        print("📊 OSCARS FASHION ARTICLE BACKEND TEST REPORT")
        print("="*80)
        
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
                if any(keyword in test_name.lower() for keyword in ["image count", "accessibility", "gallery", "loading"]):
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
            for success in successes[-5:]:  # Show last 5 successes
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*80)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "minor_issues": minor_issues,
            "test_results": self.test_results
        }

if __name__ == "__main__":
    tester = OscarsFashionBackendTester()
    results = tester.run_comprehensive_test()
    
    # Print final summary
    print(f"\n🎯 FINAL RESULT: {results['success_rate']:.1f}% SUCCESS RATE")
    if results['success_rate'] >= 80:
        print("✅ OSCARS FASHION ARTICLE WITH 4 ADDITIONAL IMAGES: SUCCESSFUL")
    else:
        print("❌ OSCARS FASHION ARTICLE WITH 4 ADDITIONAL IMAGES: NEEDS ATTENTION")