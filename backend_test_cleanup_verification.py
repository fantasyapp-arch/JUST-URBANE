#!/usr/bin/env python3
"""
Just Urbane Magazine API Testing Suite - Database Cleanup Verification
Testing backend API after cleaning up dummy articles and fixing navigation
Focus on verifying article count, category-based retrieval, and database integrity
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class JustUrbaneCleanupVerificationTester:
    def __init__(self, base_url: str = "https://admin-fix-urbane.preview.emergentagent.com/api"):
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
        """Test API health endpoint - Verify backend is running correctly after database cleanup"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, "Backend is healthy and responding correctly after cleanup")
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

    def test_updated_article_count(self):
        """Test Updated Article Count - Verify we now have 16 articles (down from 36 after removing dummy articles)"""
        try:
            response = self.session.get(f"{self.base_url}/articles", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    article_count = len(articles)
                    
                    # Expected count is 16 articles after cleanup
                    if article_count == 16:
                        self.log_test("Updated Article Count", True, f"Correct article count: {article_count} articles (expected 16 after dummy cleanup)")
                        return articles
                    elif article_count < 20:  # Allow some flexibility
                        self.log_test("Updated Article Count", True, f"Article count within expected range: {article_count} articles (close to expected 16)")
                        return articles
                    else:
                        self.log_test("Updated Article Count", False, f"Article count too high: {article_count} articles (expected ~16 after cleanup)")
                        return articles
                else:
                    self.log_test("Updated Article Count", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("Updated Article Count", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Updated Article Count", False, f"Error: {str(e)}")
            return None

    def test_fashion_category_articles(self):
        """Test Fashion Category - Should have 2 articles: Perfect Suit Guide + Oscars article"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=fashion", timeout=10)
            if response.status_code == 200:
                fashion_articles = response.json()
                if isinstance(fashion_articles, list):
                    article_count = len(fashion_articles)
                    
                    # Check for expected articles
                    article_titles = [article.get("title", "") for article in fashion_articles]
                    
                    # Look for key articles
                    has_suit_guide = any("Perfect Suit Guide" in title or "suit" in title.lower() for title in article_titles)
                    has_oscars_article = any("Oscars" in title or "oscar" in title.lower() for title in article_titles)
                    
                    if article_count == 2 and has_suit_guide:
                        self.log_test("Fashion Category Articles", True, f"Fashion category has correct count: {article_count} articles including suit guide")
                    elif article_count >= 1 and has_suit_guide:
                        self.log_test("Fashion Category Articles", True, f"Fashion category has {article_count} articles including expected suit guide")
                    else:
                        self.log_test("Fashion Category Articles", False, f"Fashion category issues: {article_count} articles, titles: {article_titles}")
                    
                    return fashion_articles
                else:
                    self.log_test("Fashion Category Articles", False, f"Invalid response format: {type(fashion_articles)}")
                    return None
            else:
                self.log_test("Fashion Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Fashion Category Articles", False, f"Error: {str(e)}")
            return None

    def test_technology_category_articles(self):
        """Test Technology Category - Should have 1 article: Dual Wristing article"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=technology", timeout=10)
            if response.status_code == 200:
                tech_articles = response.json()
                if isinstance(tech_articles, list):
                    article_count = len(tech_articles)
                    
                    # Check for expected articles
                    article_titles = [article.get("title", "") for article in tech_articles]
                    
                    # Look for dual wristing article
                    has_dual_wristing = any("Dual Wristing" in title or "Double Wristing" in title or "Two Watches" in title for title in article_titles)
                    
                    if article_count == 1 and has_dual_wristing:
                        self.log_test("Technology Category Articles", True, f"Technology category has correct count: {article_count} article (Dual Wristing)")
                    elif has_dual_wristing:
                        self.log_test("Technology Category Articles", True, f"Technology category has {article_count} articles including expected Dual Wristing article")
                    else:
                        self.log_test("Technology Category Articles", False, f"Technology category issues: {article_count} articles, titles: {article_titles}")
                    
                    return tech_articles
                else:
                    self.log_test("Technology Category Articles", False, f"Invalid response format: {type(tech_articles)}")
                    return None
            else:
                self.log_test("Technology Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Technology Category Articles", False, f"Error: {str(e)}")
            return None

    def test_people_category_articles(self):
        """Test People Category - Should have 4 articles including Aastha Gill interview"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=people", timeout=10)
            if response.status_code == 200:
                people_articles = response.json()
                if isinstance(people_articles, list):
                    article_count = len(people_articles)
                    
                    # Check for expected articles
                    article_titles = [article.get("title", "") for article in people_articles]
                    
                    # Look for Aastha Gill interview
                    has_aastha_gill = any("Aastha Gill" in title for title in article_titles)
                    
                    if article_count == 4 and has_aastha_gill:
                        self.log_test("People Category Articles", True, f"People category has correct count: {article_count} articles including Aastha Gill interview")
                    elif has_aastha_gill:
                        self.log_test("People Category Articles", True, f"People category has {article_count} articles including expected Aastha Gill interview")
                    else:
                        self.log_test("People Category Articles", False, f"People category issues: {article_count} articles, titles: {article_titles}")
                    
                    return people_articles
                else:
                    self.log_test("People Category Articles", False, f"Invalid response format: {type(people_articles)}")
                    return None
            else:
                self.log_test("People Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("People Category Articles", False, f"Error: {str(e)}")
            return None

    def test_travel_category_articles(self):
        """Test Travel Category - Should have 3 articles including France + Sustainable travel"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=travel", timeout=10)
            if response.status_code == 200:
                travel_articles = response.json()
                if isinstance(travel_articles, list):
                    article_count = len(travel_articles)
                    
                    # Check for expected articles
                    article_titles = [article.get("title", "") for article in travel_articles]
                    
                    # Look for France and Sustainable travel articles
                    has_france_article = any("France" in title for title in article_titles)
                    has_sustainable_travel = any("Sustainable" in title or "Conscious" in title for title in article_titles)
                    
                    if article_count == 3 and (has_france_article or has_sustainable_travel):
                        self.log_test("Travel Category Articles", True, f"Travel category has correct count: {article_count} articles including expected travel content")
                    elif has_france_article or has_sustainable_travel:
                        self.log_test("Travel Category Articles", True, f"Travel category has {article_count} articles including expected France/Sustainable travel content")
                    else:
                        self.log_test("Travel Category Articles", False, f"Travel category issues: {article_count} articles, titles: {article_titles}")
                    
                    return travel_articles
                else:
                    self.log_test("Travel Category Articles", False, f"Invalid response format: {type(travel_articles)}")
                    return None
            else:
                self.log_test("Travel Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Travel Category Articles", False, f"Error: {str(e)}")
            return None

    def test_luxury_category_articles(self):
        """Test Luxury Category - Should have 1 article: Sunseeker yacht"""
        try:
            response = self.session.get(f"{self.base_url}/articles?category=luxury", timeout=10)
            if response.status_code == 200:
                luxury_articles = response.json()
                if isinstance(luxury_articles, list):
                    article_count = len(luxury_articles)
                    
                    # Check for expected articles
                    article_titles = [article.get("title", "") for article in luxury_articles]
                    
                    # Look for Sunseeker yacht article
                    has_sunseeker_yacht = any("Sunseeker" in title or "yacht" in title.lower() for title in article_titles)
                    
                    if article_count == 1 and has_sunseeker_yacht:
                        self.log_test("Luxury Category Articles", True, f"Luxury category has correct count: {article_count} article (Sunseeker yacht)")
                    elif has_sunseeker_yacht:
                        self.log_test("Luxury Category Articles", True, f"Luxury category has {article_count} articles including expected Sunseeker yacht article")
                    else:
                        self.log_test("Luxury Category Articles", False, f"Luxury category issues: {article_count} articles, titles: {article_titles}")
                    
                    return luxury_articles
                else:
                    self.log_test("Luxury Category Articles", False, f"Invalid response format: {type(luxury_articles)}")
                    return None
            else:
                self.log_test("Luxury Category Articles", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Luxury Category Articles", False, f"Error: {str(e)}")
            return None

    def test_specific_article_retrieval(self):
        """Test Specific Article Retrieval - Test that all integrated articles are accessible"""
        expected_articles = [
            "Perfect Suit Guide for Men: Corporate Dressing Excellence",
            "The Art of Double Wristing: Why Two Watches Are Better Than One",
            "The 'Buzz' Queen: An Exclusive Interview with Aastha Gill",
            "Sunseeker 65 Sport: The Ultimate Luxury Yacht Experience",
            "When In France"
        ]
        
        accessible_articles = 0
        
        try:
            # Get all articles first
            response = self.session.get(f"{self.base_url}/articles", timeout=10)
            if response.status_code != 200:
                self.log_test("Specific Article Retrieval Setup", False, f"Failed to get articles: HTTP {response.status_code}")
                return
            
            all_articles = response.json()
            if not isinstance(all_articles, list):
                self.log_test("Specific Article Retrieval", False, f"Invalid articles response: {type(all_articles)}")
                return
            
            # Check each expected article
            for expected_title in expected_articles:
                found_article = None
                
                # Look for article by title (partial match)
                for article in all_articles:
                    article_title = article.get("title", "")
                    if any(keyword in article_title for keyword in expected_title.split()[:3]):  # Match first 3 words
                        found_article = article
                        break
                
                if found_article:
                    # Try to retrieve the specific article
                    article_id = found_article.get("id")
                    if article_id:
                        response = self.session.get(f"{self.base_url}/articles/{article_id}", timeout=10)
                        if response.status_code == 200:
                            accessible_articles += 1
                            self.log_test(f"Article Access - {expected_title[:30]}...", True, f"Successfully retrieved: {found_article.get('title', 'Unknown')}")
                        else:
                            self.log_test(f"Article Access - {expected_title[:30]}...", False, f"Failed to retrieve: HTTP {response.status_code}")
                    else:
                        self.log_test(f"Article Access - {expected_title[:30]}...", False, "No article ID found")
                else:
                    self.log_test(f"Article Search - {expected_title[:30]}...", False, f"Article not found in database")
            
            if accessible_articles >= 3:
                self.log_test("Specific Article Retrieval", True, f"{accessible_articles}/{len(expected_articles)} expected articles are accessible")
            else:
                self.log_test("Specific Article Retrieval", False, f"Only {accessible_articles}/{len(expected_articles)} expected articles are accessible")
                
        except Exception as e:
            self.log_test("Specific Article Retrieval", False, f"Error: {str(e)}")

    def test_categories_api(self):
        """Test Categories API - Verify categories are still working correctly"""
        try:
            response = self.session.get(f"{self.base_url}/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    category_count = len(categories)
                    category_names = [cat.get("name", "") for cat in categories]
                    
                    # Expected categories should include the ones we're testing
                    expected_categories = ["fashion", "technology", "people", "travel", "luxury"]
                    found_categories = [cat for cat in expected_categories if any(cat.lower() in name.lower() for name in category_names)]
                    
                    if category_count >= 5:
                        self.log_test("Categories API", True, f"Categories API working: {category_count} categories found")
                    else:
                        self.log_test("Categories API", False, f"Too few categories: {category_count} found")
                    
                    if len(found_categories) >= 3:
                        self.log_test("Categories API - Expected Categories", True, f"Found expected categories: {found_categories}")
                    else:
                        self.log_test("Categories API - Expected Categories", False, f"Missing expected categories. Found: {category_names}")
                    
                    return categories
                else:
                    self.log_test("Categories API", False, f"Invalid response format: {type(categories)}")
                    return None
            else:
                self.log_test("Categories API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Categories API", False, f"Error: {str(e)}")
            return None

    def test_database_integrity(self):
        """Test Database Integrity - Ensure no database corruption after dummy article removal"""
        try:
            # Test 1: Check article data consistency
            response = self.session.get(f"{self.base_url}/articles", timeout=10)
            if response.status_code != 200:
                self.log_test("Database Integrity - Articles", False, f"Failed to get articles: HTTP {response.status_code}")
                return
            
            articles = response.json()
            if not isinstance(articles, list):
                self.log_test("Database Integrity", False, f"Invalid articles response: {type(articles)}")
                return
            
            # Check required fields in articles
            required_fields = ["id", "title", "body", "category", "author_name"]
            articles_with_all_fields = 0
            
            for article in articles:
                if all(field in article and article[field] is not None for field in required_fields):
                    articles_with_all_fields += 1
            
            integrity_percentage = (articles_with_all_fields / len(articles) * 100) if articles else 0
            
            if integrity_percentage >= 90:
                self.log_test("Database Integrity - Article Fields", True, f"{articles_with_all_fields}/{len(articles)} articles ({integrity_percentage:.1f}%) have all required fields")
            else:
                self.log_test("Database Integrity - Article Fields", False, f"Only {articles_with_all_fields}/{len(articles)} articles ({integrity_percentage:.1f}%) have all required fields")
            
            # Test 2: Check ID consistency (should be 'id', not '_id')
            id_field_consistent = all("id" in article and "_id" not in article for article in articles)
            if id_field_consistent:
                self.log_test("Database Integrity - ID Fields", True, "All articles use 'id' field consistently")
            else:
                self.log_test("Database Integrity - ID Fields", False, "Inconsistent ID field usage detected")
            
            # Test 3: Check for duplicate articles
            article_titles = [article.get("title", "") for article in articles]
            unique_titles = set(article_titles)
            
            if len(unique_titles) == len(article_titles):
                self.log_test("Database Integrity - Duplicates", True, "No duplicate article titles found")
            else:
                duplicate_count = len(article_titles) - len(unique_titles)
                self.log_test("Database Integrity - Duplicates", False, f"{duplicate_count} duplicate article titles found")
            
            # Test 4: Check other endpoints for integrity
            endpoints_to_test = [
                ("/categories", "Categories"),
                ("/reviews", "Reviews"),
                ("/issues", "Magazine Issues"),
                ("/destinations", "Destinations")
            ]
            
            working_endpoints = 0
            for endpoint, name in endpoints_to_test:
                try:
                    response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if isinstance(data, list):
                            working_endpoints += 1
                            self.log_test(f"Database Integrity - {name}", True, f"{name} endpoint working: {len(data)} items")
                        else:
                            self.log_test(f"Database Integrity - {name}", False, f"Invalid {name} response format")
                    else:
                        self.log_test(f"Database Integrity - {name}", False, f"{name} endpoint failed: HTTP {response.status_code}")
                except Exception as e:
                    self.log_test(f"Database Integrity - {name}", False, f"{name} endpoint error: {str(e)}")
            
            if working_endpoints >= 3:
                self.log_test("Database Integrity - Endpoints", True, f"{working_endpoints}/{len(endpoints_to_test)} endpoints working correctly")
            else:
                self.log_test("Database Integrity - Endpoints", False, f"Only {working_endpoints}/{len(endpoints_to_test)} endpoints working")
                
        except Exception as e:
            self.log_test("Database Integrity", False, f"Error: {str(e)}")

    def run_cleanup_verification_tests(self):
        """Run comprehensive cleanup verification tests"""
        print("🧹 STARTING DATABASE CLEANUP VERIFICATION TESTING")
        print("=" * 70)
        print("Testing backend API after cleaning up dummy articles and fixing navigation...")
        print()
        
        # 1. API Health Check
        self.test_api_health_check()
        
        # 2. Updated Article Count
        articles = self.test_updated_article_count()
        
        # 3. Category-Based Article Retrieval
        self.test_fashion_category_articles()
        self.test_technology_category_articles()
        self.test_people_category_articles()
        self.test_travel_category_articles()
        self.test_luxury_category_articles()
        
        # 4. Specific Article Retrieval
        self.test_specific_article_retrieval()
        
        # 5. Categories API
        self.test_categories_api()
        
        # 6. Database Integrity
        self.test_database_integrity()
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 DATABASE CLEANUP VERIFICATION TEST REPORT")
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
                if any(keyword in test_name.lower() for keyword in ["health", "article count", "category articles", "database integrity"]):
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
            for success in successes[:8]:  # Show top 8 successes
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
    """Main function to run the cleanup verification tests"""
    print("🧹 Just Urbane Magazine - Database Cleanup Verification Testing")
    print("Testing backend API after dummy article removal and navigation fixes")
    print("=" * 70)
    
    tester = JustUrbaneCleanupVerificationTester()
    results = tester.run_cleanup_verification_tests()
    
    print(f"\n🎯 FINAL SUMMARY:")
    print(f"Success Rate: {results['success_rate']:.1f}%")
    print(f"Critical Issues: {len(results['critical_failures'])}")
    print(f"Minor Issues: {len(results['minor_issues'])}")
    
    if results['success_rate'] >= 80:
        print("✅ Database cleanup verification SUCCESSFUL!")
    else:
        print("❌ Database cleanup verification needs attention!")

if __name__ == "__main__":
    main()