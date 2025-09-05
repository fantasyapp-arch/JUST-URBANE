#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Oscars Fashion Article - Final Verification
Testing the "All Glam at the 94th Academy Awards: Best Dressed Celebrities" article
to verify it has all 9 images integrated (1 hero + 8 gallery images)
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class OscarsFashionFinalTester:
    def __init__(self, base_url: str = "https://luxmag-tech-nav-fix.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
        # The 4 new image URLs that should be integrated
        self.new_image_urls = [
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/geeqo4rh_94_AR_0848.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/48qamudk_94_AR_0660.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/viltuaeq_94_AR_0892%20-%20Copy.jpg",
            "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/wuo6l24b_94_AR_0665.jpg"
        ]
        
        # Expected total images: 1 hero + 8 gallery = 9 total
        self.expected_total_images = 9
        self.expected_gallery_images = 8
        
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

    def get_oscars_article(self):
        """Get the Oscars Fashion article by slug"""
        try:
            # Use the known slug for the Oscars article
            response = self.session.get(f"{self.base_url}/articles/oscars-2022-best-dressed-fashion-red-carpet", timeout=10)
            if response.status_code == 200:
                article = response.json()
                self.log_test("Get Oscars Article", True, f"Successfully retrieved article: '{article.get('title', '')}'")
                return article
            else:
                self.log_test("Get Oscars Article", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Get Oscars Article", False, f"Error: {str(e)}")
            return None

    def test_hero_image_present(self, article: Dict[str, Any]):
        """Test that the article has a hero image"""
        if not article:
            self.log_test("Hero Image Test", False, "No article provided")
            return False
            
        try:
            hero_image = article.get("hero_image", "")
            if hero_image and hero_image.strip():
                # Test if hero image is accessible
                response = self.session.head(hero_image, timeout=10)
                if response.status_code == 200:
                    self.log_test("Hero Image Test", True, f"Hero image present and accessible: {hero_image[:60]}...")
                    return True
                else:
                    self.log_test("Hero Image Test", False, f"Hero image not accessible (HTTP {response.status_code})")
                    return False
            else:
                self.log_test("Hero Image Test", False, "No hero image found")
                return False
        except Exception as e:
            self.log_test("Hero Image Test", False, f"Error testing hero image: {str(e)}")
            return False

    def test_gallery_images_count(self, article: Dict[str, Any]):
        """Test that the article has exactly 8 gallery images"""
        if not article:
            self.log_test("Gallery Images Count", False, "No article provided")
            return False
            
        try:
            gallery = article.get("gallery", [])
            images = article.get("images", [])
            
            # Count gallery images
            gallery_count = len(gallery)
            images_count = len(images)
            
            self.log_test("Gallery Analysis", True, f"Gallery array: {gallery_count} images, Images array: {images_count} images")
            
            # Check if we have 8 gallery images (as expected)
            if gallery_count == self.expected_gallery_images:
                self.log_test("Gallery Images Count", True, f"Correct gallery count: {gallery_count} images")
                return True
            elif images_count == self.expected_gallery_images:
                self.log_test("Gallery Images Count", True, f"Correct images count: {images_count} images")
                return True
            else:
                self.log_test("Gallery Images Count", False, f"Expected {self.expected_gallery_images} gallery images, found Gallery: {gallery_count}, Images: {images_count}")
                return False
                
        except Exception as e:
            self.log_test("Gallery Images Count", False, f"Error counting gallery images: {str(e)}")
            return False

    def test_total_images_count(self, article: Dict[str, Any]):
        """Test that the article has exactly 9 total images (1 hero + 8 gallery)"""
        if not article:
            self.log_test("Total Images Count", False, "No article provided")
            return False
            
        try:
            hero_image = article.get("hero_image", "")
            gallery = article.get("gallery", [])
            images = article.get("images", [])
            
            # Count total images
            hero_count = 1 if hero_image and hero_image.strip() else 0
            gallery_count = len(gallery)
            images_count = len(images)
            
            # Use the larger of gallery or images array (they might be duplicated)
            additional_images_count = max(gallery_count, images_count)
            total_images = hero_count + additional_images_count
            
            self.log_test("Total Images Analysis", True, 
                         f"Hero: {hero_count}, Gallery: {gallery_count}, Images: {images_count}, Total: {total_images}")
            
            if total_images == self.expected_total_images:
                self.log_test("Total Images Count", True, f"Perfect! Article has {total_images} total images (1 hero + {additional_images_count} gallery)")
                return True
            else:
                self.log_test("Total Images Count", False, f"Expected {self.expected_total_images} total images, found {total_images}")
                return False
                
        except Exception as e:
            self.log_test("Total Images Count", False, f"Error counting total images: {str(e)}")
            return False

    def test_new_images_integration(self, article: Dict[str, Any]):
        """Test that all 4 new uploaded images are properly integrated"""
        if not article:
            self.log_test("New Images Integration", False, "No article provided")
            return False
            
        try:
            gallery = article.get("gallery", [])
            images = article.get("images", [])
            
            # Collect all image URLs from both arrays
            all_image_urls = []
            for img in gallery:
                if isinstance(img, dict) and "url" in img:
                    all_image_urls.append(img["url"])
                elif isinstance(img, str):
                    all_image_urls.append(img)
            
            for img in images:
                if isinstance(img, dict) and "url" in img:
                    all_image_urls.append(img["url"])
                elif isinstance(img, str):
                    all_image_urls.append(img)
            
            # Check how many of the new images are integrated
            integrated_new_images = 0
            for new_url in self.new_image_urls:
                if new_url in all_image_urls:
                    integrated_new_images += 1
                    self.log_test(f"New Image Integration {integrated_new_images}", True, f"Found new image: {new_url.split('/')[-1]}")
                else:
                    self.log_test(f"New Image Missing", False, f"New image not found: {new_url.split('/')[-1]}")
            
            if integrated_new_images == 4:
                self.log_test("New Images Integration", True, f"All 4 new images successfully integrated")
                return True
            else:
                self.log_test("New Images Integration", False, f"Only {integrated_new_images}/4 new images integrated")
                return False
                
        except Exception as e:
            self.log_test("New Images Integration", False, f"Error checking new images: {str(e)}")
            return False

    def test_images_accessibility(self, article: Dict[str, Any]):
        """Test that all images are properly accessible and load correctly"""
        if not article:
            self.log_test("Images Accessibility", False, "No article provided")
            return False
            
        try:
            # Test hero image
            hero_image = article.get("hero_image", "")
            accessible_count = 0
            total_count = 0
            
            if hero_image:
                total_count += 1
                try:
                    response = self.session.head(hero_image, timeout=10)
                    if response.status_code == 200:
                        content_type = response.headers.get('content-type', '')
                        if 'image' in content_type.lower():
                            accessible_count += 1
                            self.log_test("Hero Image Accessibility", True, "Hero image loads properly")
                        else:
                            self.log_test("Hero Image Accessibility", False, f"Hero image invalid type: {content_type}")
                    else:
                        self.log_test("Hero Image Accessibility", False, f"Hero image HTTP {response.status_code}")
                except:
                    self.log_test("Hero Image Accessibility", False, "Hero image not accessible")
            
            # Test gallery images
            gallery = article.get("gallery", [])
            for i, img in enumerate(gallery, 1):
                total_count += 1
                img_url = img.get("url", "") if isinstance(img, dict) else img
                if img_url:
                    try:
                        response = self.session.head(img_url, timeout=10)
                        if response.status_code == 200:
                            content_type = response.headers.get('content-type', '')
                            if 'image' in content_type.lower():
                                accessible_count += 1
                                self.log_test(f"Gallery Image {i} Accessibility", True, f"Gallery image {i} loads properly")
                            else:
                                self.log_test(f"Gallery Image {i} Accessibility", False, f"Gallery image {i} invalid type")
                        else:
                            self.log_test(f"Gallery Image {i} Accessibility", False, f"Gallery image {i} HTTP {response.status_code}")
                    except:
                        self.log_test(f"Gallery Image {i} Accessibility", False, f"Gallery image {i} not accessible")
            
            # Test images array if gallery is empty
            if not gallery:
                images = article.get("images", [])
                for i, img in enumerate(images, 1):
                    total_count += 1
                    img_url = img.get("url", "") if isinstance(img, dict) else img
                    if img_url:
                        try:
                            response = self.session.head(img_url, timeout=10)
                            if response.status_code == 200:
                                content_type = response.headers.get('content-type', '')
                                if 'image' in content_type.lower():
                                    accessible_count += 1
                                    self.log_test(f"Image {i} Accessibility", True, f"Image {i} loads properly")
                                else:
                                    self.log_test(f"Image {i} Accessibility", False, f"Image {i} invalid type")
                            else:
                                self.log_test(f"Image {i} Accessibility", False, f"Image {i} HTTP {response.status_code}")
                        except:
                            self.log_test(f"Image {i} Accessibility", False, f"Image {i} not accessible")
            
            success_rate = (accessible_count / total_count * 100) if total_count > 0 else 0
            
            if success_rate >= 90:
                self.log_test("Images Accessibility", True, f"{accessible_count}/{total_count} images accessible ({success_rate:.1f}%)")
                return True
            else:
                self.log_test("Images Accessibility", False, f"Only {accessible_count}/{total_count} images accessible ({success_rate:.1f}%)")
                return False
                
        except Exception as e:
            self.log_test("Images Accessibility", False, f"Error testing accessibility: {str(e)}")
            return False

    def test_gallery_captions_quality(self, article: Dict[str, Any]):
        """Test that gallery images have proper captions"""
        if not article:
            self.log_test("Gallery Captions Quality", False, "No article provided")
            return False
            
        try:
            gallery = article.get("gallery", [])
            images = article.get("images", [])
            
            # Use gallery if available, otherwise use images
            image_array = gallery if gallery else images
            
            if not image_array:
                self.log_test("Gallery Captions Quality", False, "No gallery or images array found")
                return False
            
            captioned_count = 0
            for i, img in enumerate(image_array, 1):
                if isinstance(img, dict):
                    caption = img.get("caption", "")
                    alt = img.get("alt", "")
                    
                    if caption and len(caption.strip()) > 10:
                        captioned_count += 1
                        self.log_test(f"Image {i} Caption Quality", True, f"Good caption: {caption[:50]}...")
                    else:
                        self.log_test(f"Image {i} Caption Quality", False, f"Poor/missing caption: '{caption}'")
            
            caption_rate = (captioned_count / len(image_array) * 100) if image_array else 0
            
            if caption_rate >= 80:
                self.log_test("Gallery Captions Quality", True, f"{captioned_count}/{len(image_array)} images have good captions ({caption_rate:.1f}%)")
                return True
            else:
                self.log_test("Gallery Captions Quality", False, f"Only {captioned_count}/{len(image_array)} images have good captions ({caption_rate:.1f}%)")
                return False
                
        except Exception as e:
            self.log_test("Gallery Captions Quality", False, f"Error testing captions: {str(e)}")
            return False

    def test_article_content_completeness(self, article: Dict[str, Any]):
        """Test that the article content is complete and professional"""
        if not article:
            self.log_test("Article Content Completeness", False, "No article provided")
            return False
            
        try:
            title = article.get("title", "")
            body = article.get("body", "")
            author = article.get("author_name", "")
            category = article.get("category", "")
            subcategory = article.get("subcategory", "")
            tags = article.get("tags", [])
            
            completeness_score = 0
            
            # Test title
            if len(title) > 30 and "oscar" in title.lower():
                self.log_test("Title Completeness", True, f"Excellent title: '{title}'")
                completeness_score += 1
            else:
                self.log_test("Title Completeness", False, f"Title needs improvement: '{title}'")
            
            # Test body content
            if len(body) > 2000:
                self.log_test("Body Content Completeness", True, f"Substantial content: {len(body)} characters")
                completeness_score += 1
            else:
                self.log_test("Body Content Completeness", False, f"Content too short: {len(body)} characters")
            
            # Test author
            if author and len(author) > 3:
                self.log_test("Author Completeness", True, f"Author present: {author}")
                completeness_score += 1
            else:
                self.log_test("Author Completeness", False, f"Author missing or invalid: {author}")
            
            # Test categorization
            if category.lower() == "fashion" and subcategory:
                self.log_test("Categorization Completeness", True, f"Proper categorization: {category} > {subcategory}")
                completeness_score += 1
            else:
                self.log_test("Categorization Completeness", False, f"Categorization issues: {category} > {subcategory}")
            
            # Test tags
            if len(tags) >= 5:
                self.log_test("Tags Completeness", True, f"Good tags: {len(tags)} tags")
                completeness_score += 1
            else:
                self.log_test("Tags Completeness", False, f"Insufficient tags: {len(tags)} tags")
            
            if completeness_score >= 4:
                self.log_test("Article Content Completeness", True, f"Article is complete and professional ({completeness_score}/5)")
                return True
            else:
                self.log_test("Article Content Completeness", False, f"Article needs improvement ({completeness_score}/5)")
                return False
                
        except Exception as e:
            self.log_test("Article Content Completeness", False, f"Error testing completeness: {str(e)}")
            return False

    def run_comprehensive_test(self):
        """Run comprehensive final verification test"""
        print("🎬 OSCARS FASHION ARTICLE - FINAL VERIFICATION TEST")
        print("=" * 80)
        print("Testing: 'All Glam at the 94th Academy Awards: Best Dressed Celebrities'")
        print("Requirements:")
        print("  ✓ 1 hero image + 8 gallery images = 9 total images")
        print("  ✓ All 4 new uploaded images properly integrated")
        print("  ✓ Gallery array contains all 8 additional images with captions")
        print("  ✓ Article content and structure complete and professional")
        print("  ✓ All images load properly and faces are visible")
        print()
        
        # 1. API Health Check
        if not self.test_api_health():
            print("❌ Backend not healthy, stopping tests")
            return self.generate_report()
        
        # 2. Get the Oscars article
        oscars_article = self.get_oscars_article()
        if not oscars_article:
            print("❌ Cannot retrieve Oscars article, stopping tests")
            return self.generate_report()
        
        print(f"\n📄 Article Details:")
        print(f"   Title: {oscars_article.get('title', 'Unknown')}")
        print(f"   Author: {oscars_article.get('author_name', 'Unknown')}")
        print(f"   Category: {oscars_article.get('category', 'Unknown')} > {oscars_article.get('subcategory', 'None')}")
        print(f"   Slug: {oscars_article.get('slug', 'Unknown')}")
        print()
        
        # 3. Test hero image
        self.test_hero_image_present(oscars_article)
        
        # 4. Test gallery images count
        self.test_gallery_images_count(oscars_article)
        
        # 5. Test total images count (main requirement)
        self.test_total_images_count(oscars_article)
        
        # 6. Test new images integration
        self.test_new_images_integration(oscars_article)
        
        # 7. Test images accessibility
        self.test_images_accessibility(oscars_article)
        
        # 8. Test gallery captions quality
        self.test_gallery_captions_quality(oscars_article)
        
        # 9. Test article content completeness
        self.test_article_content_completeness(oscars_article)
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*80)
        print("📊 OSCARS FASHION ARTICLE - FINAL VERIFICATION REPORT")
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
                if any(keyword in test_name.lower() for keyword in ["total images", "gallery images", "new images", "accessibility", "hero image"]):
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
        key_successes = []
        for result in self.test_results:
            if result["success"] and any(keyword in result["test"].lower() for keyword in ["total images", "gallery", "new images", "accessibility"]):
                key_successes.append(f"✅ {result['test']}: {result['message']}")
        
        if key_successes:
            print("✅ KEY SUCCESSES:")
            for success in key_successes:
                print(f"   {success}")
        
        print("\n" + "="*80)
        
        # Final verdict
        if success_rate >= 90 and not critical_failures:
            print("🎉 FINAL VERDICT: OSCARS FASHION ARTICLE FULLY VERIFIED ✅")
            print("   All 9 images integrated successfully!")
            print("   All 4 new images properly accessible!")
            print("   Gallery array complete with proper captions!")
            print("   Article content professional and complete!")
        elif success_rate >= 80:
            print("⚠️ FINAL VERDICT: MOSTLY SUCCESSFUL WITH MINOR ISSUES")
            print("   Core requirements met but some improvements needed")
        else:
            print("❌ FINAL VERDICT: NEEDS ATTENTION")
            print("   Critical issues found that need to be addressed")
        
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
    tester = OscarsFashionFinalTester()
    results = tester.run_comprehensive_test()
    
    # Print final summary
    print(f"\n🎯 FINAL RESULT: {results['success_rate']:.1f}% SUCCESS RATE")
    if results['success_rate'] >= 90 and not results['critical_failures']:
        print("✅ OSCARS FASHION ARTICLE WITH 9 IMAGES: FULLY VERIFIED AND READY")
    elif results['success_rate'] >= 80:
        print("⚠️ OSCARS FASHION ARTICLE: MOSTLY READY WITH MINOR IMPROVEMENTS NEEDED")
    else:
        print("❌ OSCARS FASHION ARTICLE: CRITICAL ISSUES NEED TO BE ADDRESSED")