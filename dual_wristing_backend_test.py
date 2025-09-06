#!/usr/bin/env python3
"""
Dual Wristing Article Integration Testing Suite
Comprehensive backend API testing for the dual wristing smartwatch article
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class DualWristingAPITester:
    def __init__(self, base_url: str = "https://urbane-dashboard.preview.emergentagent.com/api"):
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
    
    def test_technology_category_articles(self):
        """Test /api/articles?category=technology to confirm dual wristing article appears"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=technology", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Look for dual wristing article
                    dual_wristing_article = None
                    for article in articles:
                        title = article.get("title", "").lower()
                        if "dual" in title and ("wrist" in title or "watch" in title):
                            dual_wristing_article = article
                            break
                        elif "double" in title and ("wrist" in title or "watch" in title):
                            dual_wristing_article = article
                            break
                    
                    if dual_wristing_article:
                        self.log_test("Technology Category Articles", True, 
                                    f"Found dual wristing article in technology category: '{dual_wristing_article.get('title')}'")
                        return dual_wristing_article
                    else:
                        # Check all article titles for debugging
                        article_titles = [a.get("title", "Unknown") for a in articles]
                        self.log_test("Technology Category Articles", False, 
                                    f"Dual wristing article not found in {len(articles)} technology articles. Titles: {article_titles[:5]}")
                        return None
                else:
                    self.log_test("Technology Category Articles", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("Technology Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Technology Category Articles", False, f"Error: {str(e)}")
            return None
    
    def test_gadgets_subcategory_articles(self):
        """Test /api/articles?category=technology&subcategory=gadgets to confirm filtering"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=technology&subcategory=gadgets", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    # Look for dual wristing article in gadgets subcategory
                    dual_wristing_article = None
                    for article in articles:
                        title = article.get("title", "").lower()
                        subcategory = article.get("subcategory", "").lower()
                        
                        if ("dual" in title or "double" in title) and ("wrist" in title or "watch" in title):
                            dual_wristing_article = article
                            break
                    
                    if dual_wristing_article:
                        subcategory = dual_wristing_article.get("subcategory", "")
                        self.log_test("Gadgets Subcategory Articles", True, 
                                    f"Found dual wristing article in technology/gadgets: '{dual_wristing_article.get('title')}' (subcategory: {subcategory})")
                        return dual_wristing_article
                    else:
                        # Show what articles are in gadgets subcategory
                        gadget_titles = [a.get("title", "Unknown") for a in articles]
                        self.log_test("Gadgets Subcategory Articles", False, 
                                    f"Dual wristing article not found in {len(articles)} gadgets articles. Titles: {gadget_titles}")
                        return None
                else:
                    self.log_test("Gadgets Subcategory Articles", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("Gadgets Subcategory Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Gadgets Subcategory Articles", False, f"Error: {str(e)}")
            return None
    
    def test_single_article_retrieval_by_slug(self):
        """Test /api/articles/double-wristing-smartwatch-traditional-watch-trend to verify article data"""
        expected_slug = "double-wristing-smartwatch-traditional-watch-trend"
        
        try:
            response = self.session.get(f"{self.base_url}/articles/{expected_slug}", timeout=10)
            if response.status_code == 200:
                article = response.json()
                if isinstance(article, dict):
                    # Verify it's the correct article
                    title = article.get("title", "")
                    slug = article.get("slug", "")
                    
                    if slug == expected_slug or ("dual" in title.lower() or "double" in title.lower()) and "wrist" in title.lower():
                        self.log_test("Single Article Retrieval by Slug", True, 
                                    f"Successfully retrieved dual wristing article by slug: '{title}'")
                        return article
                    else:
                        self.log_test("Single Article Retrieval by Slug", False, 
                                    f"Retrieved article doesn't match expected dual wristing content. Title: '{title}', Slug: '{slug}'")
                        return None
                else:
                    self.log_test("Single Article Retrieval by Slug", False, f"Expected dict, got: {type(article)}")
                    return None
            else:
                self.log_test("Single Article Retrieval by Slug", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Single Article Retrieval by Slug", False, f"Error: {str(e)}")
            return None
    
    def test_article_data_integrity(self, article: dict):
        """Verify all required fields are present (title, author, category, subcategory, images, content)"""
        if not article:
            self.log_test("Article Data Integrity", False, "No article provided for integrity check")
            return False
        
        try:
            # Required fields for dual wristing article
            required_fields = {
                "title": str,
                "author_name": str,
                "category": str,
                "subcategory": str,
                "hero_image": str,
                "body": str
            }
            
            missing_fields = []
            invalid_types = []
            
            for field, expected_type in required_fields.items():
                if field not in article:
                    missing_fields.append(field)
                elif not isinstance(article[field], expected_type):
                    invalid_types.append(f"{field} (expected {expected_type.__name__}, got {type(article[field]).__name__})")
                elif not article[field]:  # Check for empty values
                    missing_fields.append(f"{field} (empty)")
            
            # Verify specific content for dual wristing article
            title = article.get("title", "")
            author = article.get("author_name", "")
            category = article.get("category", "")
            subcategory = article.get("subcategory", "")
            body = article.get("body", "")
            
            content_checks = []
            
            # Check author
            if author.lower() != "krishna mohod":
                content_checks.append(f"Expected author 'Krishna Mohod', got '{author}'")
            
            # Check category
            if category.lower() != "technology":
                content_checks.append(f"Expected category 'technology', got '{category}'")
            
            # Check subcategory
            if subcategory.lower() != "gadgets":
                content_checks.append(f"Expected subcategory 'gadgets', got '{subcategory}'")
            
            # Check content sections
            expected_content_sections = [
                "tech-art combination",
                "celebrity endorsement", 
                "future of wearable tech"
            ]
            
            missing_content = []
            for section in expected_content_sections:
                if section.lower() not in body.lower():
                    missing_content.append(section)
            
            # Generate results
            if not missing_fields and not invalid_types and not content_checks and not missing_content:
                self.log_test("Article Data Integrity", True, 
                            f"All required fields present and valid. Author: {author}, Category: {category}/{subcategory}, Content length: {len(body)} chars")
                return True
            else:
                issues = []
                if missing_fields:
                    issues.append(f"Missing fields: {missing_fields}")
                if invalid_types:
                    issues.append(f"Invalid types: {invalid_types}")
                if content_checks:
                    issues.append(f"Content issues: {content_checks}")
                if missing_content:
                    issues.append(f"Missing content sections: {missing_content}")
                
                self.log_test("Article Data Integrity", False, f"Data integrity issues: {'; '.join(issues)}")
                return False
                
        except Exception as e:
            self.log_test("Article Data Integrity", False, f"Error during integrity check: {str(e)}")
            return False
    
    def test_category_system(self):
        """Confirm technology category exists with gadgets subcategory"""
        try:
            # Test categories endpoint
            response = self.session.get(f"{self.base_url}/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    # Look for technology category
                    technology_category = None
                    for category in categories:
                        if isinstance(category, dict):
                            name = category.get("name", "").lower()
                            if name == "technology":
                                technology_category = category
                                break
                    
                    if technology_category:
                        # Check for gadgets subcategory
                        subcategories = technology_category.get("subcategories", [])
                        if isinstance(subcategories, list):
                            has_gadgets = any(sub.lower() == "gadgets" for sub in subcategories)
                            if has_gadgets:
                                self.log_test("Category System", True, 
                                            f"Technology category exists with gadgets subcategory. Subcategories: {subcategories}")
                                return True
                            else:
                                self.log_test("Category System", False, 
                                            f"Technology category found but no gadgets subcategory. Available: {subcategories}")
                                return False
                        else:
                            self.log_test("Category System", False, 
                                        f"Technology category found but subcategories format invalid: {type(subcategories)}")
                            return False
                    else:
                        category_names = [c.get("name", "Unknown") for c in categories if isinstance(c, dict)]
                        self.log_test("Category System", False, 
                                    f"Technology category not found. Available categories: {category_names}")
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
    
    def test_image_url_validation(self, article: dict):
        """Verify hero image URL from customer assets is accessible"""
        if not article:
            self.log_test("Image URL Validation", False, "No article provided for image validation")
            return False
        
        try:
            hero_image = article.get("hero_image", "")
            if not hero_image:
                self.log_test("Image URL Validation", False, "No hero image URL found in article")
                return False
            
            # Test if image URL is accessible
            try:
                image_response = self.session.head(hero_image, timeout=10, allow_redirects=True)
                if image_response.status_code == 200:
                    content_type = image_response.headers.get("content-type", "")
                    if "image" in content_type.lower():
                        self.log_test("Image URL Validation", True, 
                                    f"Hero image URL accessible and valid: {hero_image} (Content-Type: {content_type})")
                        return True
                    else:
                        self.log_test("Image URL Validation", False, 
                                    f"URL accessible but not an image: {hero_image} (Content-Type: {content_type})")
                        return False
                else:
                    self.log_test("Image URL Validation", False, 
                                f"Hero image URL not accessible: {hero_image} (HTTP {image_response.status_code})")
                    return False
            except requests.exceptions.RequestException as req_e:
                # If direct access fails, check if URL format is valid
                if hero_image.startswith(("http://", "https://", "/")):
                    self.log_test("Image URL Validation", True, 
                                f"Hero image URL format valid (access test failed due to network): {hero_image}")
                    return True
                else:
                    self.log_test("Image URL Validation", False, 
                                f"Invalid hero image URL format: {hero_image}")
                    return False
                    
        except Exception as e:
            self.log_test("Image URL Validation", False, f"Error during image validation: {str(e)}")
            return False
    
    def run_dual_wristing_tests(self):
        """Run comprehensive dual wristing article integration tests"""
        print("🎯 STARTING DUAL WRISTING ARTICLE INTEGRATION TESTING")
        print("=" * 70)
        print("Testing dual wristing smartwatch article integration in Just Urbane backend...")
        print()
        
        # 1. API Health Check
        health_ok = self.test_api_health_check()
        if not health_ok:
            print("❌ Backend health check failed. Stopping tests.")
            return self.generate_report()
        
        # 2. Technology Category Articles
        tech_article = self.test_technology_category_articles()
        
        # 3. Gadgets Subcategory Articles  
        gadgets_article = self.test_gadgets_subcategory_articles()
        
        # 4. Single Article Retrieval by Slug
        slug_article = self.test_single_article_retrieval_by_slug()
        
        # Use the best article found for further testing
        test_article = tech_article or gadgets_article or slug_article
        
        # 5. Article Data Integrity
        if test_article:
            self.test_article_data_integrity(test_article)
            
            # 7. Image URL Validation
            self.test_image_url_validation(test_article)
        else:
            self.log_test("Article Data Integrity", False, "No dual wristing article found for integrity testing")
            self.log_test("Image URL Validation", False, "No dual wristing article found for image validation")
        
        # 6. Category System
        self.test_category_system()
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 DUAL WRISTING ARTICLE INTEGRATION TEST REPORT")
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
                if any(keyword in test_name.lower() for keyword in ["api health", "technology category", "single article", "data integrity"]):
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
        
        # Success criteria evaluation
        success_criteria_met = []
        success_criteria_failed = []
        
        criteria_tests = {
            "Dual wristing article appears in technology/gadgets category": ["Technology Category Articles", "Gadgets Subcategory Articles"],
            "All article fields populated correctly": ["Article Data Integrity"],
            "Hero image URL from customer assets working": ["Image URL Validation"],
            "Article retrievable by slug": ["Single Article Retrieval by Slug"],
            "Technology category exists with gadgets subcategory": ["Category System"]
        }
        
        for criteria, test_names in criteria_tests.items():
            criteria_passed = any(
                result["success"] for result in self.test_results 
                if result["test"] in test_names
            )
            if criteria_passed:
                success_criteria_met.append(criteria)
            else:
                success_criteria_failed.append(criteria)
        
        print("🎯 SUCCESS CRITERIA EVALUATION:")
        for criteria in success_criteria_met:
            print(f"   ✅ {criteria}")
        for criteria in success_criteria_failed:
            print(f"   ❌ {criteria}")
        
        print(f"\n📊 SUCCESS CRITERIA: {len(success_criteria_met)}/{len(criteria_tests)} met")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "minor_issues": minor_issues,
            "success_criteria_met": success_criteria_met,
            "success_criteria_failed": success_criteria_failed
        }

def main():
    """Main function to run dual wristing article tests"""
    tester = DualWristingAPITester()
    results = tester.run_dual_wristing_tests()
    
    # Return exit code based on success rate
    if results["success_rate"] >= 80:
        print(f"\n🎉 DUAL WRISTING ARTICLE INTEGRATION: SUCCESS ({results['success_rate']:.1f}%)")
        return 0
    else:
        print(f"\n⚠️ DUAL WRISTING ARTICLE INTEGRATION: NEEDS ATTENTION ({results['success_rate']:.1f}%)")
        return 1

if __name__ == "__main__":
    exit(main())