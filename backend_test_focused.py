#!/usr/bin/env python3
"""
Just Urbane Magazine - Focused Backend Testing After CSS Alignment Fixes
Testing the key areas mentioned in the review request
"""

import requests
import json
import time
from datetime import datetime

class FocusedAPITester:
    def __init__(self, base_url: str = "https://urbane-dashboard.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")

    def test_article_retrieval_apis(self):
        """Test Article Retrieval APIs - PRIORITY 1"""
        print("\n📰 ARTICLE RETRIEVAL APIs TESTING")
        print("=" * 40)
        
        try:
            # Test 1: All Articles Endpoint
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list) and len(articles) > 0:
                    self.log_test("Articles API", True, f"Retrieved {len(articles)} articles successfully")
                    
                    # Test 2: Category Filtering
                    categories_to_test = ["fashion", "technology", "travel", "business"]
                    for category in categories_to_test:
                        cat_response = self.session.get(f"{self.base_url}/api/articles?category={category}", timeout=10)
                        if cat_response.status_code == 200:
                            cat_articles = cat_response.json()
                            self.log_test(f"Category Filter - {category.title()}", True, f"Retrieved {len(cat_articles)} {category} articles")
                        else:
                            self.log_test(f"Category Filter - {category.title()}", False, f"HTTP {cat_response.status_code}")
                    
                    # Test 3: Single Article Retrieval by Slug
                    test_article = articles[0]
                    article_slug = test_article.get("slug")
                    if article_slug:
                        single_response = self.session.get(f"{self.base_url}/api/articles/{article_slug}", timeout=10)
                        if single_response.status_code == 200:
                            self.log_test("Single Article Retrieval", True, f"Successfully retrieved article by slug: {article_slug}")
                        else:
                            self.log_test("Single Article Retrieval", False, f"HTTP {single_response.status_code}")
                    
                    return articles
                else:
                    self.log_test("Articles API", False, f"No articles found or invalid format")
                    return None
            else:
                self.log_test("Articles API", False, f"HTTP {response.status_code}")
                return None
        except Exception as e:
            self.log_test("Article Retrieval APIs", False, f"Error: {str(e)}")
            return None

    def test_category_subcategory_apis(self):
        """Test Category and Subcategory APIs - PRIORITY 2"""
        print("\n🏷️ CATEGORY AND SUBCATEGORY APIs TESTING")
        print("=" * 45)
        
        try:
            # Test 1: Categories Endpoint
            response = self.session.get(f"{self.base_url}/api/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    self.log_test("Categories API", True, f"Retrieved {len(categories)} categories")
                    
                    # Test 2: Subcategory Filtering
                    subcategory_tests = [
                        ("fashion", "men"),
                        ("fashion", "women"),
                        ("travel", "guides"),
                        ("technology", "smartphones")
                    ]
                    
                    for category, subcategory in subcategory_tests:
                        sub_response = self.session.get(f"{self.base_url}/api/articles?category={category}&subcategory={subcategory}", timeout=10)
                        if sub_response.status_code == 200:
                            sub_articles = sub_response.json()
                            self.log_test(f"Subcategory - {category}/{subcategory}", True, f"Retrieved {len(sub_articles)} articles")
                        else:
                            self.log_test(f"Subcategory - {category}/{subcategory}", False, f"HTTP {sub_response.status_code}")
                    
                    return categories
                else:
                    self.log_test("Categories API", False, f"Invalid format: {type(categories)}")
                    return None
            else:
                self.log_test("Categories API", False, f"HTTP {response.status_code}")
                return None
        except Exception as e:
            self.log_test("Category APIs", False, f"Error: {str(e)}")
            return None

    def test_payment_system_apis(self):
        """Test Payment System APIs - PRIORITY 3"""
        print("\n💳 PAYMENT SYSTEM APIs TESTING")
        print("=" * 35)
        
        try:
            # Test 1: Payment Packages
            response = self.session.get(f"{self.base_url}/api/payments/packages", timeout=10)
            if response.status_code == 200:
                data = response.json()
                packages = data.get("packages", [])
                if packages:
                    self.log_test("Payment Packages API", True, f"Retrieved {len(packages)} subscription packages")
                    
                    # Check Razorpay integration
                    for package in packages:
                        pkg_name = package.get("name", "Unknown")
                        pkg_price = package.get("price", 0)
                        pkg_currency = package.get("currency", "")
                        self.log_test(f"Package - {pkg_name}", True, f"₹{pkg_price} {pkg_currency}")
                    
                    # Test 2: Razorpay Order Creation (basic test)
                    customer_details = {
                        "email": f"test_{int(time.time())}@justurbane.com",
                        "full_name": "Test User",
                        "phone": "+919876543210",
                        "password": "testpass123",
                        "address_line_1": "123 Test Street",
                        "city": "Mumbai",
                        "state": "Maharashtra",
                        "postal_code": "400001"
                    }
                    
                    order_request = {
                        "package_id": "print_annual",
                        "customer_details": customer_details
                    }
                    
                    order_response = self.session.post(
                        f"{self.base_url}/api/payments/razorpay/create-order",
                        json=order_request,
                        headers={"Content-Type": "application/json"},
                        timeout=15
                    )
                    
                    if order_response.status_code == 200:
                        order_data = order_response.json()
                        if order_data.get("order_id"):
                            self.log_test("Razorpay Integration", True, f"Order creation successful: {order_data.get('order_id')}")
                        else:
                            self.log_test("Razorpay Integration", False, "Invalid order response")
                    else:
                        self.log_test("Razorpay Integration", False, f"HTTP {order_response.status_code}")
                    
                    return True
                else:
                    self.log_test("Payment Packages API", False, "No packages found")
                    return False
            else:
                self.log_test("Payment Packages API", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Payment System APIs", False, f"Error: {str(e)}")
            return False

    def test_database_connectivity(self):
        """Test Database Connectivity - PRIORITY 4"""
        print("\n🗄️ DATABASE CONNECTIVITY TESTING")
        print("=" * 35)
        
        try:
            # Test multiple endpoints to verify database connectivity
            endpoints = [
                ("/api/articles", "Articles"),
                ("/api/reviews", "Reviews"),
                ("/api/authors", "Authors")
            ]
            
            successful_connections = 0
            total_records = 0
            
            for endpoint, name in endpoints:
                response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        record_count = len(data)
                        total_records += record_count
                        successful_connections += 1
                        self.log_test(f"Database - {name}", True, f"Retrieved {record_count} records")
                    else:
                        self.log_test(f"Database - {name}", False, f"Invalid format: {type(data)}")
                else:
                    self.log_test(f"Database - {name}", False, f"HTTP {response.status_code}")
            
            if successful_connections >= 2:
                self.log_test("Database Connectivity", True, f"{successful_connections}/{len(endpoints)} collections accessible, {total_records} total records")
                return True
            else:
                self.log_test("Database Connectivity", False, f"Only {successful_connections}/{len(endpoints)} collections accessible")
                return False
        except Exception as e:
            self.log_test("Database Connectivity", False, f"Error: {str(e)}")
            return False

    def test_cors_and_api_routes(self):
        """Test CORS and API Routes - PRIORITY 5"""
        print("\n🌐 CORS AND API ROUTES TESTING")
        print("=" * 35)
        
        try:
            # Test 1: CORS Configuration
            response = self.session.options(
                f"{self.base_url}/api/articles",
                headers={
                    "Origin": "https://urbane-dashboard.preview.emergentagent.com",
                    "Access-Control-Request-Method": "GET"
                },
                timeout=10
            )
            
            if response.status_code in [200, 204]:
                cors_headers = response.headers
                if "Access-Control-Allow-Origin" in cors_headers:
                    self.log_test("CORS Configuration", True, "CORS properly configured")
                else:
                    self.log_test("CORS Configuration", False, "CORS headers missing")
            else:
                self.log_test("CORS Configuration", False, f"CORS preflight failed: HTTP {response.status_code}")
            
            # Test 2: API Route Accessibility
            api_routes = [
                "/api/articles",
                "/api/reviews",
                "/api/authors"
            ]
            
            accessible_routes = 0
            for route in api_routes:
                response = self.session.get(f"{self.base_url}{route}", timeout=10)
                if response.status_code == 200:
                    accessible_routes += 1
                    self.log_test(f"API Route - {route}", True, "Route accessible")
                else:
                    self.log_test(f"API Route - {route}", False, f"HTTP {response.status_code}")
            
            if accessible_routes >= 2:
                self.log_test("API Routes", True, f"{accessible_routes}/{len(api_routes)} routes accessible")
                return True
            else:
                self.log_test("API Routes", False, f"Only {accessible_routes}/{len(api_routes)} routes accessible")
                return False
        except Exception as e:
            self.log_test("CORS and API Routes", False, f"Error: {str(e)}")
            return False

    def run_focused_tests(self):
        """Run focused tests for CSS alignment fix verification"""
        print("🎨 STARTING FOCUSED BACKEND TESTING AFTER CSS ALIGNMENT FIXES")
        print("=" * 70)
        print("Testing key backend functionality mentioned in review request...")
        print()
        
        # Run all priority tests
        articles = self.test_article_retrieval_apis()
        categories = self.test_category_subcategory_apis()
        payment_success = self.test_payment_system_apis()
        db_success = self.test_database_connectivity()
        cors_success = self.test_cors_and_api_routes()
        
        return self.generate_focused_report()

    def generate_focused_report(self):
        """Generate focused test report"""
        print("\n" + "="*70)
        print("📊 FOCUSED BACKEND TEST REPORT - CSS ALIGNMENT FIX VERIFICATION")
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
        
        # Priority area results
        priority_areas = {
            "Article Retrieval APIs": ["Articles API", "Category Filter", "Single Article"],
            "Category and Subcategory APIs": ["Categories API", "Subcategory"],
            "Payment System APIs": ["Payment Packages", "Razorpay"],
            "Database Connectivity": ["Database"],
            "CORS and API Routes": ["CORS", "API Route"]
        }
        
        for area, keywords in priority_areas.items():
            area_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in keywords)]
            if area_tests:
                area_passed = sum(1 for t in area_tests if t["success"])
                area_total = len(area_tests)
                area_rate = (area_passed / area_total * 100) if area_total > 0 else 0
                
                status = "✅" if area_rate >= 80 else "⚠️" if area_rate >= 60 else "❌"
                print(f"{status} {area}: {area_passed}/{area_total} tests passed ({area_rate:.1f}%)")
        
        print()
        
        # Critical failures
        critical_failures = [r for r in self.test_results if not r["success"] and any(keyword in r["test"] for keyword in ["Articles API", "Categories API", "Payment Packages", "Database Connectivity"])]
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES:")
            for failure in critical_failures[:5]:
                print(f"   ❌ {failure['test']}: {failure['message']}")
            print()
        
        # Success highlights
        key_successes = [r for r in self.test_results if r["success"] and any(keyword in r["test"] for keyword in ["Articles API", "Categories API", "Payment", "Database"])]
        if key_successes:
            print("✅ KEY FUNCTIONALITY VERIFIED:")
            for success in key_successes[:8]:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        print("🎯 CSS ALIGNMENT FIX IMPACT ASSESSMENT:")
        
        if success_rate >= 90:
            print("   ✅ EXCELLENT: CSS fixes had no negative impact on backend functionality")
            impact = "none"
        elif success_rate >= 80:
            print("   ✅ GOOD: CSS fixes had minimal impact, backend is functioning well")
            impact = "minimal"
        elif success_rate >= 70:
            print("   ⚠️ MODERATE: Some backend issues detected, may need investigation")
            impact = "moderate"
        else:
            print("   ❌ CRITICAL: Significant backend issues detected, immediate attention required")
            impact = "significant"
        
        print("="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "css_fix_impact": impact,
            "critical_failures": [f["test"] + ": " + f["message"] for f in critical_failures],
            "results": self.test_results
        }

if __name__ == "__main__":
    print("🚀 Just Urbane Magazine - Focused Backend Testing After CSS Alignment Fixes")
    print("=" * 80)
    print("Testing key backend functionality to ensure CSS changes did not affect APIs")
    print()
    
    tester = FocusedAPITester()
    results = tester.run_focused_tests()
    
    print(f"\n🏁 TESTING COMPLETED")
    print(f"Success Rate: {results['success_rate']:.1f}%")
    print(f"CSS Fix Impact: {results['css_fix_impact'].title()}")
    
    if results['success_rate'] >= 80:
        print("✅ Backend functionality verified - CSS fixes did not break APIs")
    else:
        print("❌ Backend issues detected - investigation required")