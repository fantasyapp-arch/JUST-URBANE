#!/usr/bin/env python3
"""
Just Urbane Magazine - Category Navigation Testing Suite
Testing backend API to ensure category navigation from mobile footer dropdown works correctly
Focus: Fashion, Technology, Travel, People, Luxury, Auto categories
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class CategoryNavigationTester:
    def __init__(self, base_url: str = "https://urbane-admin-fix-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
        # Footer categories to test (from review request)
        self.footer_categories = [
            "fashion",
            "technology", 
            "travel",
            "people",
            "luxury",
            "auto"
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
        
    def test_api_health_check(self):
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
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
    
    def test_categories_api_endpoint(self):
        """Test /api/categories endpoint to verify available categories"""
        try:
            response = self.session.get(f"{self.base_url}/api/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    category_names = [cat.get("name", "").lower() for cat in categories if cat.get("name")]
                    
                    # Check if footer categories exist in the system
                    found_categories = []
                    missing_categories = []
                    
                    for footer_cat in self.footer_categories:
                        if footer_cat.lower() in category_names:
                            found_categories.append(footer_cat)
                        else:
                            missing_categories.append(footer_cat)
                    
                    if len(found_categories) >= 4:  # At least 4 out of 6 categories should exist
                        self.log_test("Categories API Health", True, 
                                    f"Found {len(found_categories)}/{len(self.footer_categories)} footer categories: {found_categories}")
                    else:
                        self.log_test("Categories API Health", False, 
                                    f"Only {len(found_categories)}/{len(self.footer_categories)} footer categories found. Missing: {missing_categories}")
                    
                    self.log_test("Categories API Structure", True, 
                                f"Retrieved {len(categories)} total categories with proper structure")
                    return categories
                else:
                    self.log_test("Categories API Health", False, f"Invalid response format: {type(categories)}")
                    return None
            else:
                self.log_test("Categories API Health", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Categories API Health", False, f"Error: {str(e)}")
            return None
    
    def test_article_filtering_by_categories(self):
        """Test article endpoints for each footer category"""
        print("\n📱 TESTING MOBILE FOOTER CATEGORY FILTERING")
        print("=" * 50)
        
        category_results = {}
        
        for category in self.footer_categories:
            try:
                # Test category filtering endpoint
                response = self.session.get(f"{self.base_url}/api/articles?category={category}", timeout=10)
                
                if response.status_code == 200:
                    articles = response.json()
                    if isinstance(articles, list):
                        # Verify articles belong to the correct category
                        correct_category_count = 0
                        total_articles = len(articles)
                        
                        for article in articles:
                            article_category = article.get("category", "").lower()
                            if article_category == category.lower():
                                correct_category_count += 1
                        
                        # Check if articles have required fields for display
                        articles_with_required_fields = 0
                        for article in articles:
                            required_fields = ["id", "title", "category", "author_name"]
                            if all(field in article and article[field] for field in required_fields):
                                articles_with_required_fields += 1
                        
                        if total_articles > 0:
                            category_accuracy = (correct_category_count / total_articles) * 100
                            field_completeness = (articles_with_required_fields / total_articles) * 100
                            
                            if category_accuracy >= 90 and field_completeness >= 90:
                                self.log_test(f"Category Filter - {category.title()}", True, 
                                            f"Retrieved {total_articles} articles, {category_accuracy:.1f}% accuracy, {field_completeness:.1f}% complete")
                                category_results[category] = {"count": total_articles, "status": "working"}
                            else:
                                self.log_test(f"Category Filter - {category.title()}", False, 
                                            f"Quality issues: {category_accuracy:.1f}% accuracy, {field_completeness:.1f}% complete")
                                category_results[category] = {"count": total_articles, "status": "issues"}
                        else:
                            # Empty result is valid but should be noted
                            self.log_test(f"Category Filter - {category.title()}", True, 
                                        f"No articles found for {category} (empty category)")
                            category_results[category] = {"count": 0, "status": "empty"}
                    else:
                        self.log_test(f"Category Filter - {category.title()}", False, 
                                    f"Invalid response format: {type(articles)}")
                        category_results[category] = {"count": 0, "status": "error"}
                else:
                    self.log_test(f"Category Filter - {category.title()}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    category_results[category] = {"count": 0, "status": "error"}
                    
            except Exception as e:
                self.log_test(f"Category Filter - {category.title()}", False, f"Error: {str(e)}")
                category_results[category] = {"count": 0, "status": "error"}
        
        return category_results
    
    def test_database_category_verification(self):
        """Verify categories have actual articles and are not empty"""
        print("\n🗄️ DATABASE CATEGORY VERIFICATION")
        print("=" * 40)
        
        try:
            # Get all articles to analyze category distribution
            response = self.session.get(f"{self.base_url}/api/articles?limit=100", timeout=15)
            if response.status_code != 200:
                self.log_test("Database Category Verification", False, f"Failed to get articles: HTTP {response.status_code}")
                return False
            
            all_articles = response.json()
            if not isinstance(all_articles, list):
                self.log_test("Database Category Verification", False, f"Invalid articles response: {type(all_articles)}")
                return False
            
            # Analyze category distribution
            category_distribution = {}
            for article in all_articles:
                category = article.get("category", "unknown").lower()
                category_distribution[category] = category_distribution.get(category, 0) + 1
            
            # Check footer categories specifically
            footer_categories_with_content = 0
            total_footer_articles = 0
            
            for category in self.footer_categories:
                count = category_distribution.get(category.lower(), 0)
                total_footer_articles += count
                
                if count > 0:
                    footer_categories_with_content += 1
                    self.log_test(f"Database Content - {category.title()}", True, 
                                f"{count} articles available for {category} category")
                else:
                    self.log_test(f"Database Content - {category.title()}", False, 
                                f"No articles found in database for {category} category")
            
            # Overall assessment
            if footer_categories_with_content >= 4:
                self.log_test("Database Category Verification", True, 
                            f"{footer_categories_with_content}/{len(self.footer_categories)} footer categories have content ({total_footer_articles} total articles)")
                return True
            else:
                self.log_test("Database Category Verification", False, 
                            f"Only {footer_categories_with_content}/{len(self.footer_categories)} footer categories have content")
                return False
                
        except Exception as e:
            self.log_test("Database Category Verification", False, f"Error: {str(e)}")
            return False
    
    def test_api_response_structure(self):
        """Ensure proper JSON responses and data structure"""
        print("\n🔍 API RESPONSE STRUCTURE TESTING")
        print("=" * 40)
        
        try:
            # Test response structure for each category
            structure_issues = []
            valid_structures = 0
            
            for category in self.footer_categories:
                response = self.session.get(f"{self.base_url}/api/articles?category={category}&limit=5", timeout=10)
                
                if response.status_code == 200:
                    try:
                        articles = response.json()
                        
                        # Check if response is valid JSON array
                        if isinstance(articles, list):
                            # Check structure of articles
                            for i, article in enumerate(articles[:3]):  # Check first 3 articles
                                required_fields = ["id", "title", "category", "author_name", "published_at"]
                                optional_fields = ["hero_image", "body", "tags", "subcategory", "slug"]
                                
                                missing_required = [field for field in required_fields if field not in article]
                                if missing_required:
                                    structure_issues.append(f"{category} article {i+1} missing: {missing_required}")
                                
                                # Check data types
                                if "tags" in article and not isinstance(article["tags"], list):
                                    structure_issues.append(f"{category} article {i+1} has invalid tags type")
                                
                                if "id" in article and not isinstance(article["id"], str):
                                    structure_issues.append(f"{category} article {i+1} has invalid id type")
                            
                            if not structure_issues:
                                valid_structures += 1
                                self.log_test(f"Response Structure - {category.title()}", True, 
                                            f"Valid JSON structure with {len(articles)} articles")
                            else:
                                self.log_test(f"Response Structure - {category.title()}", False, 
                                            f"Structure issues found: {len(structure_issues)} problems")
                        else:
                            structure_issues.append(f"{category} returned non-array response")
                            self.log_test(f"Response Structure - {category.title()}", False, 
                                        f"Invalid response type: {type(articles)}")
                    except json.JSONDecodeError:
                        structure_issues.append(f"{category} returned invalid JSON")
                        self.log_test(f"Response Structure - {category.title()}", False, "Invalid JSON response")
                else:
                    structure_issues.append(f"{category} HTTP error: {response.status_code}")
                    self.log_test(f"Response Structure - {category.title()}", False, 
                                f"HTTP {response.status_code}")
            
            # Overall structure assessment
            if valid_structures >= 4:
                self.log_test("API Response Structure", True, 
                            f"{valid_structures}/{len(self.footer_categories)} categories have valid response structure")
                return True
            else:
                self.log_test("API Response Structure", False, 
                            f"Only {valid_structures}/{len(self.footer_categories)} categories have valid structure. Issues: {len(structure_issues)}")
                return False
                
        except Exception as e:
            self.log_test("API Response Structure", False, f"Error: {str(e)}")
            return False
    
    def test_category_route_endpoints(self):
        """Test the category filtering endpoints that footer dropdown links will call"""
        print("\n🔗 CATEGORY ROUTE TESTING")
        print("=" * 30)
        
        try:
            # Test various URL formats that might be used by frontend
            url_formats = [
                "/api/articles?category={category}",
                "/api/articles?category={category}&limit=10",
                "/api/articles?category={category}&featured=true",
            ]
            
            successful_routes = 0
            total_routes = len(url_formats) * len(self.footer_categories)
            
            for category in self.footer_categories:
                category_routes_working = 0
                
                for url_format in url_formats:
                    url = url_format.format(category=category)
                    
                    try:
                        response = self.session.get(f"{self.base_url}{url}", timeout=10)
                        
                        if response.status_code == 200:
                            data = response.json()
                            if isinstance(data, list):
                                category_routes_working += 1
                                successful_routes += 1
                            else:
                                self.log_test(f"Route Test - {category} ({url_format})", False, 
                                            f"Invalid response format: {type(data)}")
                        else:
                            self.log_test(f"Route Test - {category} ({url_format})", False, 
                                        f"HTTP {response.status_code}")
                    except Exception as e:
                        self.log_test(f"Route Test - {category} ({url_format})", False, f"Error: {str(e)}")
                
                if category_routes_working == len(url_formats):
                    self.log_test(f"Category Routes - {category.title()}", True, 
                                f"All {len(url_formats)} route formats working")
                else:
                    self.log_test(f"Category Routes - {category.title()}", False, 
                                f"Only {category_routes_working}/{len(url_formats)} route formats working")
            
            # Overall route assessment
            success_rate = (successful_routes / total_routes) * 100
            if success_rate >= 80:
                self.log_test("Category Route Testing", True, 
                            f"{successful_routes}/{total_routes} routes working ({success_rate:.1f}%)")
                return True
            else:
                self.log_test("Category Route Testing", False, 
                            f"Only {successful_routes}/{total_routes} routes working ({success_rate:.1f}%)")
                return False
                
        except Exception as e:
            self.log_test("Category Route Testing", False, f"Error: {str(e)}")
            return False
    
    def test_mobile_footer_integration(self):
        """Test specific scenarios for mobile footer dropdown integration"""
        print("\n📱 MOBILE FOOTER INTEGRATION TESTING")
        print("=" * 40)
        
        try:
            # Simulate mobile footer dropdown clicks
            mobile_scenarios = [
                ("Fashion articles for mobile users", "fashion", {"limit": 20}),
                ("Technology articles for mobile users", "technology", {"limit": 20}),
                ("Travel articles for mobile users", "travel", {"limit": 20}),
                ("People articles for mobile users", "people", {"limit": 20}),
                ("Luxury articles for mobile users", "luxury", {"limit": 20}),
                ("Auto articles for mobile users", "auto", {"limit": 20}),
            ]
            
            successful_scenarios = 0
            
            for scenario_name, category, params in mobile_scenarios:
                try:
                    # Build URL with parameters
                    param_string = "&".join([f"{k}={v}" for k, v in params.items()])
                    url = f"{self.base_url}/api/articles?category={category}&{param_string}"
                    
                    response = self.session.get(url, timeout=10)
                    
                    if response.status_code == 200:
                        articles = response.json()
                        if isinstance(articles, list):
                            # Check if articles are suitable for mobile display
                            mobile_ready_count = 0
                            for article in articles:
                                # Check for mobile-essential fields
                                mobile_fields = ["id", "title", "category", "author_name"]
                                if all(field in article and article[field] for field in mobile_fields):
                                    mobile_ready_count += 1
                            
                            if len(articles) == 0:
                                # Empty category is acceptable
                                self.log_test(f"Mobile Scenario - {scenario_name}", True, 
                                            f"Empty category handled correctly")
                                successful_scenarios += 1
                            elif mobile_ready_count >= len(articles) * 0.9:  # 90% of articles mobile-ready
                                self.log_test(f"Mobile Scenario - {scenario_name}", True, 
                                            f"{len(articles)} articles, {mobile_ready_count} mobile-ready")
                                successful_scenarios += 1
                            else:
                                self.log_test(f"Mobile Scenario - {scenario_name}", False, 
                                            f"Only {mobile_ready_count}/{len(articles)} articles mobile-ready")
                        else:
                            self.log_test(f"Mobile Scenario - {scenario_name}", False, 
                                        f"Invalid response format: {type(articles)}")
                    else:
                        self.log_test(f"Mobile Scenario - {scenario_name}", False, 
                                    f"HTTP {response.status_code}")
                        
                except Exception as e:
                    self.log_test(f"Mobile Scenario - {scenario_name}", False, f"Error: {str(e)}")
            
            # Overall mobile integration assessment
            if successful_scenarios >= 4:
                self.log_test("Mobile Footer Integration", True, 
                            f"{successful_scenarios}/{len(mobile_scenarios)} mobile scenarios working")
                return True
            else:
                self.log_test("Mobile Footer Integration", False, 
                            f"Only {successful_scenarios}/{len(mobile_scenarios)} mobile scenarios working")
                return False
                
        except Exception as e:
            self.log_test("Mobile Footer Integration", False, f"Error: {str(e)}")
            return False
    
    def run_category_navigation_tests(self):
        """Run comprehensive category navigation tests"""
        print("📱 STARTING CATEGORY NAVIGATION TESTING FOR MOBILE FOOTER DROPDOWN")
        print("=" * 70)
        print("Testing backend API to ensure category navigation works correctly...")
        print(f"Focus categories: {', '.join([cat.title() for cat in self.footer_categories])}")
        print()
        
        # 1. API Health Check
        api_healthy = self.test_api_health_check()
        if not api_healthy:
            print("❌ API is not healthy, stopping tests")
            return self.generate_report()
        
        # 2. Categories API Health Check
        categories = self.test_categories_api_endpoint()
        
        # 3. Article Filtering by Categories
        category_results = self.test_article_filtering_by_categories()
        
        # 4. Database Category Verification
        self.test_database_category_verification()
        
        # 5. API Response Structure
        self.test_api_response_structure()
        
        # 6. Category Route Testing
        self.test_category_route_endpoints()
        
        # 7. Mobile Footer Integration
        self.test_mobile_footer_integration()
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 CATEGORY NAVIGATION TEST REPORT")
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
        
        # Category-specific results
        print("📱 FOOTER CATEGORY RESULTS:")
        for category in self.footer_categories:
            category_tests = [r for r in self.test_results if category.lower() in r["test"].lower()]
            if category_tests:
                category_passed = sum(1 for t in category_tests if t["success"])
                category_total = len(category_tests)
                category_rate = (category_passed / category_total * 100) if category_total > 0 else 0
                
                status = "✅" if category_rate >= 80 else "⚠️" if category_rate >= 60 else "❌"
                print(f"   {status} {category.title()}: {category_passed}/{category_total} tests passed ({category_rate:.1f}%)")
        
        print()
        
        # Critical issues
        critical_failures = []
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["api health", "categories api", "database", "mobile"]):
                    critical_failures.append(f"❌ {test_name}: {result['message']}")
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES:")
            for failure in critical_failures[:5]:
                print(f"   {failure}")
            print()
        
        # Success highlights
        key_successes = [r for r in self.test_results if r["success"] and 
                        any(keyword in r["test"].lower() for keyword in ["api health", "category filter", "mobile", "database"])]
        if key_successes:
            print("✅ KEY SUCCESSES:")
            for success in key_successes[:8]:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        print("🎯 MOBILE FOOTER DROPDOWN ASSESSMENT:")
        
        if success_rate >= 90:
            print("   ✅ EXCELLENT: Mobile footer dropdown will work perfectly with backend")
        elif success_rate >= 80:
            print("   ✅ GOOD: Mobile footer dropdown should work with minor issues")
        elif success_rate >= 70:
            print("   ⚠️ MODERATE: Some issues may affect mobile footer functionality")
        else:
            print("   ❌ CRITICAL: Significant issues will prevent mobile footer from working properly")
        
        print("="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "footer_categories_tested": self.footer_categories,
            "mobile_ready": success_rate >= 80
        }

def main():
    """Main function to run category navigation tests"""
    tester = CategoryNavigationTester()
    results = tester.run_category_navigation_tests()
    
    print(f"\n🏁 TESTING COMPLETED")
    print(f"Success Rate: {results['success_rate']:.1f}%")
    print(f"Mobile Footer Ready: {'Yes' if results['mobile_ready'] else 'No'}")
    
    return results

if __name__ == "__main__":
    main()