#!/usr/bin/env python3
"""
Fashion > Men Articles Testing - Specific Review Request
Testing backend API to check articles in Fashion > Men subcategory
"""

import requests
import json
from datetime import datetime
from typing import Dict, Any, List

class FashionMenArticlesTester:
    def __init__(self, base_url: str = "https://luxmag-platform.preview.emergentagent.com/api"):
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
        if response_data and isinstance(response_data, list) and len(response_data) > 0:
            print(f"   📊 Data: {len(response_data)} items returned")
        
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

    def test_fashion_men_articles(self):
        """Test Fashion > Men subcategory articles - MAIN REQUEST"""
        print("\n👔 TESTING FASHION > MEN SUBCATEGORY ARTICLES")
        print("=" * 60)
        
        try:
            # Test the specific endpoint requested: /api/articles?category=fashion&subcategory=men
            response = self.session.get(f"{self.base_url}/articles?category=fashion&subcategory=men", timeout=10)
            
            if response.status_code == 200:
                articles = response.json()
                
                if isinstance(articles, list):
                    self.log_test("Fashion Men Articles API", True, f"Successfully retrieved {len(articles)} articles from Fashion > Men subcategory")
                    
                    if len(articles) > 0:
                        print(f"\n📋 FASHION > MEN ARTICLES FOUND ({len(articles)} total):")
                        print("-" * 50)
                        
                        for i, article in enumerate(articles, 1):
                            title = article.get("title", "No Title")
                            slug = article.get("slug", "No Slug")
                            hero_image = article.get("hero_image", "No Image")
                            author = article.get("author_name", "No Author")
                            category = article.get("category", "No Category")
                            subcategory = article.get("subcategory", "No Subcategory")
                            is_premium = article.get("is_premium", False)
                            published_at = article.get("published_at", "No Date")
                            
                            print(f"\n{i}. 📰 {title}")
                            print(f"   🔗 Slug: {slug}")
                            print(f"   🖼️  Hero Image: {hero_image}")
                            print(f"   ✍️  Author: {author}")
                            print(f"   📂 Category: {category} > {subcategory}")
                            print(f"   💎 Premium: {'Yes' if is_premium else 'No'}")
                            print(f"   📅 Published: {published_at}")
                            
                            # Check for "Perfect Suit Guide for Men" specifically
                            if "perfect suit guide" in title.lower() or "suit guide" in title.lower():
                                self.log_test("Perfect Suit Guide Found", True, f"Found the 'Perfect Suit Guide for Men' article: {title}")
                                
                                # Test detailed article retrieval
                                article_id = article.get("id")
                                if article_id:
                                    self.test_article_details(article_id, title)
                            
                            # Check for dummy articles that might need removal
                            if any(dummy_word in title.lower() for dummy_word in ["test", "dummy", "sample", "lorem", "placeholder"]):
                                self.log_test("Dummy Article Detection", False, f"Potential dummy article found: {title}")
                        
                        # Summary of findings
                        premium_count = sum(1 for a in articles if a.get("is_premium", False))
                        free_count = len(articles) - premium_count
                        
                        print(f"\n📊 SUMMARY:")
                        print(f"   Total Articles: {len(articles)}")
                        print(f"   Premium Articles: {premium_count}")
                        print(f"   Free Articles: {free_count}")
                        
                        # Check for image issues
                        articles_with_images = sum(1 for a in articles if a.get("hero_image") and a.get("hero_image") != "No Image")
                        articles_without_images = len(articles) - articles_with_images
                        
                        print(f"   Articles with Images: {articles_with_images}")
                        print(f"   Articles without Images: {articles_without_images}")
                        
                        if articles_without_images > 0:
                            self.log_test("Image Coverage", False, f"{articles_without_images} articles missing hero images - may affect thumbnail display")
                        else:
                            self.log_test("Image Coverage", True, "All articles have hero images")
                        
                        return articles
                    else:
                        self.log_test("Fashion Men Articles", False, "No articles found in Fashion > Men subcategory")
                        return []
                else:
                    self.log_test("Fashion Men Articles API", False, f"Invalid response format: expected list, got {type(articles)}")
                    return None
            else:
                self.log_test("Fashion Men Articles API", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Fashion Men Articles API", False, f"Error: {str(e)}")
            return None

    def test_article_details(self, article_id: str, title: str):
        """Test detailed article retrieval to check thumbnail/hero_image"""
        try:
            response = self.session.get(f"{self.base_url}/articles/{article_id}", timeout=10)
            
            if response.status_code == 200:
                article = response.json()
                
                hero_image = article.get("hero_image")
                body_length = len(article.get("body", ""))
                
                print(f"\n🔍 DETAILED ARTICLE ANALYSIS: {title}")
                print("-" * 40)
                print(f"   🖼️  Hero Image URL: {hero_image}")
                print(f"   📝 Content Length: {body_length} characters")
                print(f"   🏷️  Tags: {article.get('tags', [])}")
                print(f"   👀 Views: {article.get('views', 0)}")
                
                # Check if hero image is properly set
                if hero_image and hero_image.startswith(("http", "/")):
                    self.log_test(f"Article Details - {title[:30]}...", True, f"Hero image properly configured: {hero_image[:50]}...")
                    
                    # Test if image URL is accessible
                    try:
                        img_response = requests.head(hero_image, timeout=5)
                        if img_response.status_code == 200:
                            self.log_test(f"Image Accessibility - {title[:30]}...", True, "Hero image URL is accessible")
                        else:
                            self.log_test(f"Image Accessibility - {title[:30]}...", False, f"Hero image URL returns HTTP {img_response.status_code}")
                    except:
                        self.log_test(f"Image Accessibility - {title[:30]}...", False, "Hero image URL not accessible")
                else:
                    self.log_test(f"Article Details - {title[:30]}...", False, f"Hero image not properly set: {hero_image}")
                
                return article
            else:
                self.log_test(f"Article Details - {title[:30]}...", False, f"HTTP {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test(f"Article Details - {title[:30]}...", False, f"Error: {str(e)}")
            return None

    def test_all_fashion_articles(self):
        """Test all Fashion category articles for comparison"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=fashion", timeout=10)
            
            if response.status_code == 200:
                articles = response.json()
                
                if isinstance(articles, list):
                    self.log_test("All Fashion Articles", True, f"Retrieved {len(articles)} total fashion articles")
                    
                    # Group by subcategory
                    subcategories = {}
                    for article in articles:
                        subcat = article.get("subcategory", "no-subcategory")
                        if subcat not in subcategories:
                            subcategories[subcat] = []
                        subcategories[subcat].append(article)
                    
                    print(f"\n📊 FASHION CATEGORY BREAKDOWN:")
                    print("-" * 40)
                    for subcat, articles_list in subcategories.items():
                        print(f"   {subcat}: {len(articles_list)} articles")
                        
                        # Show article titles for each subcategory
                        for article in articles_list[:3]:  # Show first 3
                            print(f"     - {article.get('title', 'No Title')}")
                        if len(articles_list) > 3:
                            print(f"     ... and {len(articles_list) - 3} more")
                    
                    return subcategories
                else:
                    self.log_test("All Fashion Articles", False, f"Invalid response format: {type(articles)}")
                    return None
            else:
                self.log_test("All Fashion Articles", False, f"HTTP {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test("All Fashion Articles", False, f"Error: {str(e)}")
            return None

    def test_categories_api(self):
        """Test categories API to understand structure"""
        try:
            response = self.session.get(f"{self.base_url}/categories", timeout=10)
            
            if response.status_code == 200:
                categories = response.json()
                
                if isinstance(categories, list):
                    self.log_test("Categories API", True, f"Retrieved {len(categories)} categories")
                    
                    # Look for fashion category
                    fashion_category = None
                    for category in categories:
                        if category.get("name", "").lower() == "fashion":
                            fashion_category = category
                            break
                    
                    if fashion_category:
                        subcategories = fashion_category.get("subcategories", [])
                        print(f"\n📂 FASHION CATEGORY STRUCTURE:")
                        print(f"   Name: {fashion_category.get('name')}")
                        print(f"   Display Name: {fashion_category.get('display_name', 'N/A')}")
                        print(f"   Subcategories: {subcategories}")
                        
                        if "men" in [sub.lower() for sub in subcategories]:
                            self.log_test("Fashion Men Subcategory", True, "'Men' subcategory exists in Fashion category")
                        else:
                            self.log_test("Fashion Men Subcategory", False, "'Men' subcategory not found in Fashion category structure")
                    else:
                        self.log_test("Fashion Category", False, "Fashion category not found in categories API")
                    
                    return categories
                else:
                    self.log_test("Categories API", False, f"Invalid response format: {type(categories)}")
                    return None
            else:
                self.log_test("Categories API", False, f"HTTP {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test("Categories API", False, f"Error: {str(e)}")
            return None

    def run_complete_test(self):
        """Run complete Fashion > Men articles testing"""
        print("👔 STARTING FASHION > MEN ARTICLES TESTING")
        print("=" * 70)
        print("Testing backend API to check articles in Fashion > Men subcategory...")
        print("Looking for 'Perfect Suit Guide for Men' and identifying dummy articles...")
        print()
        
        # 1. Health Check
        if not self.test_health_check():
            print("❌ Backend API is not healthy. Stopping tests.")
            return self.generate_report()
        
        # 2. Categories API Check
        self.test_categories_api()
        
        # 3. All Fashion Articles Overview
        fashion_breakdown = self.test_all_fashion_articles()
        
        # 4. Specific Fashion > Men Articles Test (MAIN REQUEST)
        men_articles = self.test_fashion_men_articles()
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 FASHION > MEN ARTICLES TEST REPORT")
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
        
        # Key findings
        critical_issues = []
        successes = []
        
        for result in self.test_results:
            if not result["success"]:
                if any(keyword in result["test"].lower() for keyword in ["fashion men articles", "perfect suit guide", "image"]):
                    critical_issues.append(f"❌ {result['test']}: {result['message']}")
            else:
                if any(keyword in result["test"].lower() for keyword in ["fashion men articles", "perfect suit guide"]):
                    successes.append(f"✅ {result['test']}: {result['message']}")
        
        if successes:
            print("✅ KEY SUCCESSES:")
            for success in successes:
                print(f"   {success}")
            print()
        
        if critical_issues:
            print("🚨 CRITICAL ISSUES:")
            for issue in critical_issues:
                print(f"   {issue}")
            print()
        
        # Recommendations
        print("💡 RECOMMENDATIONS:")
        if failed_tests == 0:
            print("   ✅ All tests passed! Fashion > Men subcategory is working correctly.")
        else:
            print("   🔧 Review failed tests above and fix any image or content issues.")
            print("   🧹 Remove any dummy articles identified in the results.")
            print("   🖼️  Ensure all articles have proper hero_image URLs for thumbnails.")
        
        print("\n" + "="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_issues": critical_issues,
            "successes": successes
        }

if __name__ == "__main__":
    tester = FashionMenArticlesTester()
    results = tester.run_complete_test()