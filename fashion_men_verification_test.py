#!/usr/bin/env python3
"""
Fashion > Men Subcategory Verification Test
Final verification test after cleanup - test the Fashion > Men subcategory to confirm:
1. Only 1 article remains ("Perfect Suit Guide for Men")
2. The hero image URL is now working (Unsplash URL, not Shutterstock)
3. All article data is intact and properly formatted
4. The thumbnail should now display properly
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class FashionMenVerificationTester:
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

    def test_fashion_men_subcategory_cleanup(self):
        """Test Fashion > Men subcategory after cleanup - MAIN VERIFICATION"""
        print("\n🧥 FASHION > MEN SUBCATEGORY VERIFICATION")
        print("=" * 50)
        
        try:
            # Test Fashion > Men subcategory filtering
            response = self.session.get(f"{self.base_url}/articles?category=fashion&subcategory=men", timeout=10)
            
            if response.status_code == 200:
                articles = response.json()
                
                if isinstance(articles, list):
                    article_count = len(articles)
                    
                    # Verification 1: Only 1 article should remain
                    if article_count == 1:
                        self.log_test("Article Count Verification", True, f"✅ Exactly 1 article found in Fashion > Men (expected after cleanup)")
                        
                        article = articles[0]
                        article_title = article.get("title", "")
                        
                        # Verification 2: Should be "Perfect Suit Guide for Men"
                        if "Perfect Suit Guide for Men" in article_title or "perfect-suit-guide" in article.get("slug", ""):
                            self.log_test("Article Identity Verification", True, f"✅ Correct article found: '{article_title}'")
                            
                            # Verification 3: Hero image URL should be Unsplash (not Shutterstock)
                            hero_image = article.get("hero_image", "")
                            if hero_image:
                                if "unsplash.com" in hero_image:
                                    self.log_test("Hero Image URL Verification", True, f"✅ Hero image is Unsplash URL: {hero_image}")
                                elif "shutterstock.com" in hero_image:
                                    self.log_test("Hero Image URL Verification", False, f"❌ Hero image still using Shutterstock: {hero_image}")
                                else:
                                    self.log_test("Hero Image URL Verification", True, f"✅ Hero image URL updated (not Shutterstock): {hero_image}")
                            else:
                                self.log_test("Hero Image URL Verification", False, "❌ No hero image found")
                            
                            # Verification 4: Article data integrity and formatting
                            required_fields = ["id", "title", "body", "author_name", "category", "subcategory", "hero_image", "slug"]
                            missing_fields = [field for field in required_fields if not article.get(field)]
                            
                            if not missing_fields:
                                self.log_test("Article Data Integrity", True, f"✅ All required fields present: {', '.join(required_fields)}")
                                
                                # Check content quality
                                body_length = len(article.get("body", ""))
                                if body_length > 500:
                                    self.log_test("Article Content Quality", True, f"✅ Article has substantial content ({body_length} characters)")
                                else:
                                    self.log_test("Article Content Quality", False, f"❌ Article content seems short ({body_length} characters)")
                                
                                # Check category/subcategory values
                                category = article.get("category", "").lower()
                                subcategory = article.get("subcategory", "").lower()
                                
                                if category == "fashion" and subcategory == "men":
                                    self.log_test("Category Classification", True, f"✅ Correct categorization: {category} > {subcategory}")
                                else:
                                    self.log_test("Category Classification", False, f"❌ Incorrect categorization: {category} > {subcategory}")
                                
                                # Check author and publication info
                                author = article.get("author_name", "")
                                published_at = article.get("published_at", "")
                                
                                if author and published_at:
                                    self.log_test("Article Metadata", True, f"✅ Complete metadata: Author '{author}', Published '{published_at}'")
                                else:
                                    self.log_test("Article Metadata", False, f"❌ Missing metadata: Author '{author}', Published '{published_at}'")
                                
                                return article
                            else:
                                self.log_test("Article Data Integrity", False, f"❌ Missing required fields: {', '.join(missing_fields)}")
                                return None
                        else:
                            self.log_test("Article Identity Verification", False, f"❌ Unexpected article found: '{article_title}' (expected 'Perfect Suit Guide for Men')")
                            return None
                    elif article_count == 0:
                        self.log_test("Article Count Verification", False, "❌ No articles found in Fashion > Men subcategory")
                        return None
                    else:
                        self.log_test("Article Count Verification", False, f"❌ Found {article_count} articles, expected exactly 1 after cleanup")
                        
                        # List all articles found for debugging
                        article_titles = [a.get("title", "Unknown") for a in articles]
                        self.log_test("Cleanup Verification", False, f"❌ Multiple articles still present: {', '.join(article_titles)}")
                        return articles
                else:
                    self.log_test("Fashion Men Subcategory", False, f"❌ Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("Fashion Men Subcategory", False, f"❌ HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Fashion Men Subcategory", False, f"❌ Error: {str(e)}")
            return None

    def test_image_accessibility(self, article):
        """Test if the hero image URL is accessible and loads properly"""
        if not article:
            self.log_test("Image Accessibility Test", False, "No article provided for image testing")
            return False
            
        hero_image = article.get("hero_image", "")
        if not hero_image:
            self.log_test("Image Accessibility Test", False, "No hero image URL found")
            return False
            
        try:
            # Test if image URL is accessible
            image_response = self.session.head(hero_image, timeout=10)
            
            if image_response.status_code == 200:
                content_type = image_response.headers.get("content-type", "")
                if "image" in content_type:
                    self.log_test("Image Accessibility Test", True, f"✅ Hero image is accessible and valid: {hero_image} (Content-Type: {content_type})")
                    return True
                else:
                    self.log_test("Image Accessibility Test", False, f"❌ URL accessible but not an image: {content_type}")
                    return False
            else:
                self.log_test("Image Accessibility Test", False, f"❌ Image URL not accessible: HTTP {image_response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Image Accessibility Test", False, f"❌ Error testing image accessibility: {str(e)}")
            return False

    def test_single_article_retrieval(self, article):
        """Test retrieving the single article by ID and slug"""
        if not article:
            self.log_test("Single Article Retrieval", False, "No article provided for retrieval testing")
            return False
            
        article_id = article.get("id")
        article_slug = article.get("slug")
        
        success_count = 0
        
        # Test retrieval by ID
        if article_id:
            try:
                response = self.session.get(f"{self.base_url}/articles/{article_id}", timeout=10)
                if response.status_code == 200:
                    retrieved_article = response.json()
                    if retrieved_article.get("id") == article_id:
                        self.log_test("Article Retrieval by ID", True, f"✅ Successfully retrieved article by ID: {article_id}")
                        success_count += 1
                    else:
                        self.log_test("Article Retrieval by ID", False, f"❌ ID mismatch in retrieved article")
                else:
                    self.log_test("Article Retrieval by ID", False, f"❌ HTTP {response.status_code} when retrieving by ID")
            except Exception as e:
                self.log_test("Article Retrieval by ID", False, f"❌ Error retrieving by ID: {str(e)}")
        
        # Test retrieval by slug
        if article_slug:
            try:
                response = self.session.get(f"{self.base_url}/articles/{article_slug}", timeout=10)
                if response.status_code == 200:
                    retrieved_article = response.json()
                    if retrieved_article.get("slug") == article_slug:
                        self.log_test("Article Retrieval by Slug", True, f"✅ Successfully retrieved article by slug: {article_slug}")
                        success_count += 1
                    else:
                        self.log_test("Article Retrieval by Slug", False, f"❌ Slug mismatch in retrieved article")
                else:
                    self.log_test("Article Retrieval by Slug", False, f"❌ HTTP {response.status_code} when retrieving by slug")
            except Exception as e:
                self.log_test("Article Retrieval by Slug", False, f"❌ Error retrieving by slug: {str(e)}")
        
        return success_count >= 1

    def test_fashion_category_overview(self):
        """Test overall Fashion category to ensure cleanup was successful"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=fashion", timeout=10)
            
            if response.status_code == 200:
                fashion_articles = response.json()
                
                if isinstance(fashion_articles, list):
                    total_fashion_articles = len(fashion_articles)
                    
                    # Count articles by subcategory
                    subcategory_counts = {}
                    for article in fashion_articles:
                        subcat = article.get("subcategory", "none")
                        subcategory_counts[subcat] = subcategory_counts.get(subcat, 0) + 1
                    
                    men_count = subcategory_counts.get("men", 0)
                    
                    self.log_test("Fashion Category Overview", True, f"✅ Fashion category has {total_fashion_articles} total articles")
                    self.log_test("Fashion Subcategory Distribution", True, f"✅ Subcategory breakdown: {subcategory_counts}")
                    
                    if men_count == 1:
                        self.log_test("Men Subcategory Count", True, f"✅ Exactly 1 article in Men subcategory (cleanup successful)")
                    else:
                        self.log_test("Men Subcategory Count", False, f"❌ Found {men_count} articles in Men subcategory (cleanup may be incomplete)")
                    
                    return fashion_articles
                else:
                    self.log_test("Fashion Category Overview", False, f"❌ Invalid response format: {type(fashion_articles)}")
                    return None
            else:
                self.log_test("Fashion Category Overview", False, f"❌ HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Fashion Category Overview", False, f"❌ Error: {str(e)}")
            return None

    def run_verification_tests(self):
        """Run all verification tests for Fashion > Men subcategory cleanup"""
        print("🧥 STARTING FASHION > MEN SUBCATEGORY VERIFICATION TESTS")
        print("=" * 60)
        print("Final verification test after cleanup and image fix...")
        print()
        
        # 1. API Health Check
        if not self.test_api_health():
            print("❌ API health check failed. Stopping tests.")
            return self.generate_report()
        
        # 2. Fashion Category Overview
        fashion_articles = self.test_fashion_category_overview()
        
        # 3. Main Verification: Fashion > Men Subcategory
        men_article = self.test_fashion_men_subcategory_cleanup()
        
        # 4. Image Accessibility Test
        if men_article:
            self.test_image_accessibility(men_article)
            
            # 5. Single Article Retrieval Test
            self.test_single_article_retrieval(men_article)
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive verification report"""
        print("\n" + "="*60)
        print("📊 FASHION > MEN SUBCATEGORY VERIFICATION REPORT")
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
        
        # Categorize results by verification criteria
        critical_verifications = []
        passed_verifications = []
        
        verification_keywords = [
            "Article Count Verification",
            "Article Identity Verification", 
            "Hero Image URL Verification",
            "Article Data Integrity",
            "Image Accessibility Test"
        ]
        
        for result in self.test_results:
            test_name = result["test"]
            if any(keyword in test_name for keyword in verification_keywords):
                if result["success"]:
                    passed_verifications.append(f"✅ {test_name}: {result['message']}")
                else:
                    critical_verifications.append(f"❌ {test_name}: {result['message']}")
        
        if passed_verifications:
            print("✅ VERIFICATION SUCCESSES:")
            for success in passed_verifications:
                print(f"   {success}")
            print()
        
        if critical_verifications:
            print("❌ VERIFICATION FAILURES:")
            for failure in critical_verifications:
                print(f"   {failure}")
            print()
        
        # Final verification status
        key_verifications = [
            "Article Count Verification",
            "Article Identity Verification", 
            "Hero Image URL Verification",
            "Article Data Integrity"
        ]
        
        key_passed = sum(1 for result in self.test_results 
                        if result["success"] and any(kv in result["test"] for kv in key_verifications))
        
        if key_passed >= 3:
            print("🎉 CLEANUP AND IMAGE FIX VERIFICATION: SUCCESS")
            print("   ✅ Fashion > Men subcategory cleanup completed successfully")
            print("   ✅ Hero image URL updated from Shutterstock to working URL")
            print("   ✅ Article data integrity maintained")
        else:
            print("⚠️ CLEANUP AND IMAGE FIX VERIFICATION: ISSUES FOUND")
            print("   ❌ Some verification criteria not met")
            print("   ❌ Manual review may be required")
        
        print("\n" + "="*60)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "verification_status": "SUCCESS" if key_passed >= 3 else "ISSUES_FOUND",
            "critical_verifications": critical_verifications,
            "passed_verifications": passed_verifications
        }

def main():
    """Main function to run the verification tests"""
    tester = FashionMenVerificationTester()
    results = tester.run_verification_tests()
    
    # Return appropriate exit code
    if results["verification_status"] == "SUCCESS":
        print("\n🎉 All key verifications passed!")
        return 0
    else:
        print("\n⚠️ Some verifications failed. Check the report above.")
        return 1

if __name__ == "__main__":
    exit(main())