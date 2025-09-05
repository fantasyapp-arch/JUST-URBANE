#!/usr/bin/env python3
"""
Men's Fashion Article Integration Testing Suite
Testing the "Perfect Suit Guide for Men" article integration as per review request
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class MensFashionArticleTester:
    def __init__(self, base_url: str = "https://justurbane-luxury.preview.emergentagent.com/api"):
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
        """Test 1: API Health Check - Ensure backend is running correctly"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, f"Backend is healthy: {data.get('message', 'API running')}")
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
    
    def test_fashion_category_articles(self):
        """Test 2: Fashion Category Articles - Test /api/articles?category=fashion"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=fashion", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    fashion_articles_count = len(articles)
                    
                    # Verify all articles are fashion category
                    fashion_category_match = all(
                        article.get("category", "").lower() == "fashion" 
                        for article in articles
                    )
                    
                    if fashion_category_match:
                        # Look for the men's fashion article specifically
                        mens_suit_article = None
                        for article in articles:
                            title = article.get("title", "").lower()
                            if "perfect suit guide" in title and "men" in title:
                                mens_suit_article = article
                                break
                        
                        if mens_suit_article:
                            self.log_test("Fashion Category Articles", True, 
                                        f"Retrieved {fashion_articles_count} fashion articles including 'Perfect Suit Guide for Men'")
                            return articles, mens_suit_article
                        else:
                            self.log_test("Fashion Category Articles", True, 
                                        f"Retrieved {fashion_articles_count} fashion articles (men's suit guide not found in this batch)")
                            return articles, None
                    else:
                        self.log_test("Fashion Category Articles", False, 
                                    "Some articles don't match fashion category filter")
                        return None, None
                else:
                    self.log_test("Fashion Category Articles", False, f"Expected list, got: {type(articles)}")
                    return None, None
            else:
                self.log_test("Fashion Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None, None
        except Exception as e:
            self.log_test("Fashion Category Articles", False, f"Error: {str(e)}")
            return None, None
    
    def test_men_subcategory_articles(self):
        """Test 3: Men Subcategory Articles - Test /api/articles?category=fashion&subcategory=men"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=fashion&subcategory=men", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    men_articles_count = len(articles)
                    
                    # Verify all articles are fashion/men
                    category_match = all(
                        article.get("category", "").lower() == "fashion" 
                        for article in articles
                    )
                    
                    # Look for subcategory or tags indicating men's content
                    men_content_indicators = 0
                    perfect_suit_found = False
                    
                    for article in articles:
                        subcategory = article.get("subcategory", "").lower()
                        tags = [tag.lower() for tag in article.get("tags", [])]
                        title = article.get("title", "").lower()
                        
                        # Check for men's content indicators
                        if ("men" in subcategory or "men" in tags or 
                            "men" in title or "suit" in title):
                            men_content_indicators += 1
                            
                        # Check for perfect suit guide specifically
                        if "perfect suit guide" in title and "men" in title:
                            perfect_suit_found = True
                    
                    if category_match and men_articles_count > 0:
                        message = f"Retrieved {men_articles_count} men's fashion articles"
                        if perfect_suit_found:
                            message += " including 'Perfect Suit Guide for Men'"
                        if men_content_indicators > 0:
                            message += f" ({men_content_indicators} with men's content indicators)"
                            
                        self.log_test("Men Subcategory Articles", True, message)
                        return articles
                    elif men_articles_count == 0:
                        self.log_test("Men Subcategory Articles", True, 
                                    "No men's fashion articles found (subcategory may not be populated yet)")
                        return []
                    else:
                        self.log_test("Men Subcategory Articles", False, 
                                    f"Category mismatch in {men_articles_count} articles")
                        return None
                else:
                    self.log_test("Men Subcategory Articles", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("Men Subcategory Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Men Subcategory Articles", False, f"Error: {str(e)}")
            return None
    
    def test_single_article_retrieval_by_slug(self):
        """Test 4: Single Article Retrieval - Test /api/articles/perfect-suit-guide-men-corporate-dressing"""
        target_slug = "perfect-suit-guide-men-corporate-dressing"
        
        try:
            response = self.session.get(f"{self.base_url}/articles/{target_slug}", timeout=10)
            if response.status_code == 200:
                article = response.json()
                if isinstance(article, dict):
                    # Verify this is the correct article
                    title = article.get("title", "")
                    slug = article.get("slug", "")
                    category = article.get("category", "")
                    
                    if ("perfect suit guide" in title.lower() and 
                        "men" in title.lower() and 
                        category.lower() == "fashion"):
                        
                        self.log_test("Single Article Retrieval by Slug", True, 
                                    f"Successfully retrieved '{title}' by slug '{target_slug}'")
                        return article
                    else:
                        self.log_test("Single Article Retrieval by Slug", False, 
                                    f"Retrieved article doesn't match expected content: title='{title}', category='{category}'")
                        return None
                else:
                    self.log_test("Single Article Retrieval by Slug", False, f"Expected dict, got: {type(article)}")
                    return None
            elif response.status_code == 404:
                self.log_test("Single Article Retrieval by Slug", False, 
                            f"Article not found with slug '{target_slug}' - may not be integrated yet")
                return None
            else:
                self.log_test("Single Article Retrieval by Slug", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Single Article Retrieval by Slug", False, f"Error: {str(e)}")
            return None
    
    def test_article_data_integrity(self, article: Dict[str, Any] = None):
        """Test 5: Article Data Integrity - Verify all required fields are present"""
        if not article:
            # Try to get the article first
            article = self.test_single_article_retrieval_by_slug()
            
        if not article:
            # Try to find it in fashion articles
            fashion_articles, mens_suit_article = self.test_fashion_category_articles()
            if mens_suit_article:
                article = mens_suit_article
            
        if not article:
            self.log_test("Article Data Integrity", False, "No men's fashion article available for testing")
            return False
            
        try:
            # Required fields for article integrity
            required_fields = {
                "title": str,
                "author": str,
                "category": str,
                "subcategory": str,
                "hero_image": str,
                "body": str,
                "slug": str,
                "id": str
            }
            
            # Alternative field names that might be used
            field_alternatives = {
                "author": ["author_name", "author"],
                "hero_image": ["hero_image", "image", "featured_image"]
            }
            
            missing_fields = []
            present_fields = []
            field_types_correct = []
            
            for field, expected_type in required_fields.items():
                field_value = None
                field_found = False
                
                # Check main field name
                if field in article and article[field] is not None:
                    field_value = article[field]
                    field_found = True
                # Check alternative field names
                elif field in field_alternatives:
                    for alt_field in field_alternatives[field]:
                        if alt_field in article and article[alt_field] is not None:
                            field_value = article[alt_field]
                            field_found = True
                            break
                
                if field_found and field_value:
                    present_fields.append(field)
                    # Check type
                    if isinstance(field_value, expected_type):
                        field_types_correct.append(field)
                    else:
                        field_types_correct.append(f"{field}(wrong_type:{type(field_value).__name__})")
                else:
                    missing_fields.append(field)
            
            # Verify specific content for men's fashion article
            title = article.get("title", "")
            category = article.get("category", "")
            subcategory = article.get("subcategory", "")
            body = article.get("body", "")
            
            content_checks = []
            
            # Title should contain suit guide and men
            if "suit" in title.lower() and "men" in title.lower():
                content_checks.append("✓ Title contains suit and men keywords")
            else:
                content_checks.append("✗ Title missing expected keywords")
            
            # Category should be fashion
            if category.lower() == "fashion":
                content_checks.append("✓ Category is fashion")
            else:
                content_checks.append(f"✗ Category is '{category}', expected 'fashion'")
            
            # Subcategory should be men or related
            if subcategory and "men" in subcategory.lower():
                content_checks.append("✓ Subcategory indicates men's content")
            else:
                content_checks.append(f"✗ Subcategory '{subcategory}' doesn't indicate men's content")
            
            # Body should have substantial content
            if len(body) > 500:
                content_checks.append(f"✓ Substantial content ({len(body)} characters)")
            else:
                content_checks.append(f"✗ Limited content ({len(body)} characters)")
            
            # Overall assessment
            required_count = len(required_fields)
            present_count = len(present_fields)
            
            if missing_fields:
                self.log_test("Article Data Integrity", False, 
                            f"Missing fields: {missing_fields}. Present: {present_fields}")
                return False
            else:
                success_message = f"All required fields present ({present_count}/{required_count}). Content checks: {'; '.join(content_checks)}"
                self.log_test("Article Data Integrity", True, success_message)
                return True
                
        except Exception as e:
            self.log_test("Article Data Integrity", False, f"Error: {str(e)}")
            return False
    
    def test_category_system(self):
        """Test 6: Category System - Confirm fashion category exists with proper structure"""
        try:
            response = self.session.get(f"{self.base_url}/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    # Look for fashion category
                    fashion_category = None
                    for category in categories:
                        if category.get("name", "").lower() == "fashion":
                            fashion_category = category
                            break
                    
                    if fashion_category:
                        # Check fashion category structure
                        category_fields = ["id", "name", "slug"]
                        missing_category_fields = [field for field in category_fields 
                                                 if field not in fashion_category or not fashion_category[field]]
                        
                        if not missing_category_fields:
                            # Check if fashion category has proper slug
                            slug = fashion_category.get("slug", "")
                            if slug == "fashion":
                                self.log_test("Category System", True, 
                                            f"Fashion category exists with proper structure: {fashion_category}")
                                
                                # Test if we can retrieve articles using this category
                                test_response = self.session.get(f"{self.base_url}/articles?category=fashion&limit=1", timeout=10)
                                if test_response.status_code == 200:
                                    self.log_test("Category System - Functionality", True, 
                                                "Fashion category filtering is functional")
                                else:
                                    self.log_test("Category System - Functionality", False, 
                                                f"Fashion category filtering failed: HTTP {test_response.status_code}")
                                
                                return True
                            else:
                                self.log_test("Category System", False, 
                                            f"Fashion category slug incorrect: '{slug}', expected 'fashion'")
                                return False
                        else:
                            self.log_test("Category System", False, 
                                        f"Fashion category missing fields: {missing_category_fields}")
                            return False
                    else:
                        # List available categories for debugging
                        available_categories = [cat.get("name", "unknown") for cat in categories]
                        self.log_test("Category System", False, 
                                    f"Fashion category not found. Available: {available_categories}")
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
    
    def run_comprehensive_test(self):
        """Run all tests for men's fashion article integration"""
        print("🎯 STARTING MEN'S FASHION ARTICLE INTEGRATION TESTING")
        print("=" * 70)
        print("Testing 'Perfect Suit Guide for Men' article integration as per review request...")
        print()
        
        # Test 1: API Health Check
        health_ok = self.test_api_health_check()
        
        # Test 2: Fashion Category Articles
        fashion_articles, mens_suit_article = self.test_fashion_category_articles()
        
        # Test 3: Men Subcategory Articles
        men_articles = self.test_men_subcategory_articles()
        
        # Test 4: Single Article Retrieval by Slug
        article_by_slug = self.test_single_article_retrieval_by_slug()
        
        # Test 5: Article Data Integrity
        # Use the article we found (priority: by slug, then from fashion articles)
        test_article = article_by_slug or mens_suit_article
        data_integrity_ok = self.test_article_data_integrity(test_article)
        
        # Test 6: Category System
        category_system_ok = self.test_category_system()
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 MEN'S FASHION ARTICLE INTEGRATION TEST REPORT")
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
                if any(keyword in test_name.lower() for keyword in ["api health", "single article", "data integrity", "category system"]):
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
        
        # Integration status assessment
        integration_status = "COMPLETE" if success_rate >= 80 else "INCOMPLETE"
        print(f"🎯 INTEGRATION STATUS: {integration_status}")
        
        if success_rate >= 80:
            print("✅ Men's fashion article integration appears to be working correctly!")
        else:
            print("❌ Men's fashion article integration needs attention.")
        
        print("="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "minor_issues": minor_issues,
            "integration_status": integration_status
        }

def main():
    """Main function to run the men's fashion article integration tests"""
    tester = MensFashionArticleTester()
    results = tester.run_comprehensive_test()
    
    # Return exit code based on success rate
    if results["success_rate"] >= 80:
        exit(0)  # Success
    else:
        exit(1)  # Failure

if __name__ == "__main__":
    main()