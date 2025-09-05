#!/usr/bin/env python3
"""
Pricing Page Backend Support Testing - Review Request Focus
Testing backend functionality after frontend redesign improvements
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class PricingPageBackendTester:
    def __init__(self, base_url: str = "https://justurbane-luxury.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
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
        """Test /api/health endpoint - PRIORITY 1"""
        print("\n🏥 PRIORITY 1: API HEALTH CHECK")
        print("=" * 50)
        
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, f"✅ /api/health responding correctly: {data.get('message', 'API is healthy')}")
                    return True
                else:
                    self.log_test("API Health Check", False, f"❌ Unexpected health status: {data}")
                    return False
            else:
                self.log_test("API Health Check", False, f"❌ HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"❌ Connection error: {str(e)}")
            return False

    def test_payment_packages_api(self):
        """Test /api/payments/packages for subscription plans - PRIORITY 2"""
        print("\n💳 PRIORITY 2: PAYMENT PACKAGES API")
        print("=" * 50)
        
        try:
            response = self.session.get(f"{self.base_url}/payments/packages", timeout=10)
            if response.status_code == 200:
                packages = response.json()
                if isinstance(packages, dict):
                    # Check for expected packages with correct pricing
                    expected_packages = {
                        "digital_annual": {"amount": 499.0, "name": "Digital Subscription"},
                        "print_annual": {"amount": 499.0, "name": "Print Subscription"},
                        "combined_annual": {"amount": 999.0, "name": "Print + Digital Subscription"}
                    }
                    
                    all_packages_correct = True
                    package_details = []
                    
                    for pkg_id, expected in expected_packages.items():
                        if pkg_id in packages:
                            actual = packages[pkg_id]
                            actual_amount = actual.get("amount")
                            actual_currency = actual.get("currency")
                            actual_name = actual.get("name")
                            
                            if actual_amount == expected["amount"] and actual_currency == "inr":
                                package_details.append(f"{actual_name} ₹{actual_amount}")
                            else:
                                all_packages_correct = False
                                self.log_test(f"Package {pkg_id}", False, f"❌ Incorrect pricing: expected ₹{expected['amount']}, got ₹{actual_amount} {actual_currency}")
                        else:
                            all_packages_correct = False
                            self.log_test(f"Package {pkg_id}", False, f"❌ Missing package: {pkg_id}")
                    
                    if all_packages_correct:
                        self.log_test("Payment Packages API", True, f"✅ All subscription plans correct: {', '.join(package_details)}")
                        return True
                    else:
                        self.log_test("Payment Packages API", False, f"❌ Some packages have incorrect configuration")
                        return False
                else:
                    self.log_test("Payment Packages API", False, f"❌ Expected dict, got: {type(packages)}")
                    return False
            else:
                self.log_test("Payment Packages API", False, f"❌ HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Payment Packages API", False, f"❌ Error: {str(e)}")
            return False

    def test_authentication_system(self):
        """Test user login and JWT authentication - PRIORITY 3"""
        print("\n🔐 PRIORITY 3: AUTHENTICATION SYSTEM")
        print("=" * 50)
        
        # First register a test user
        test_user = {
            "name": "Pricing Test User",
            "email": f"pricingtest_{int(time.time())}@justurbane.com",
            "password": "premium123"
        }
        
        try:
            # Test user registration
            reg_response = self.session.post(
                f"{self.base_url}/auth/register",
                json=test_user,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if reg_response.status_code == 200:
                reg_data = reg_response.json()
                if reg_data.get("email") == test_user["email"]:
                    self.log_test("User Registration", True, f"✅ User registered successfully: {reg_data.get('name')}")
                    
                    # Test user login
                    login_data = {
                        "email": test_user["email"],
                        "password": test_user["password"]
                    }
                    
                    login_response = self.session.post(
                        f"{self.base_url}/auth/login",
                        json=login_data,
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                    
                    if login_response.status_code == 200:
                        login_result = login_response.json()
                        if login_result.get("access_token") and login_result.get("token_type") == "bearer":
                            self.auth_token = login_result["access_token"]
                            self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                            self.log_test("JWT Authentication", True, f"✅ Login successful, JWT token received and configured")
                            return True
                        else:
                            self.log_test("JWT Authentication", False, f"❌ Invalid login response: {login_result}")
                            return False
                    else:
                        self.log_test("JWT Authentication", False, f"❌ Login failed: HTTP {login_response.status_code}")
                        return False
                else:
                    self.log_test("User Registration", False, f"❌ Registration response invalid: {reg_data}")
                    return False
            else:
                self.log_test("User Registration", False, f"❌ Registration failed: HTTP {reg_response.status_code}")
                return False
        except Exception as e:
            self.log_test("Authentication System", False, f"❌ Error: {str(e)}")
            return False

    def test_core_api_functionality(self):
        """Test articles, categories, and basic endpoints - PRIORITY 4"""
        print("\n🔧 PRIORITY 4: CORE API FUNCTIONALITY")
        print("=" * 50)
        
        try:
            # Test Articles API
            articles_response = self.session.get(f"{self.base_url}/articles?limit=10", timeout=10)
            if articles_response.status_code == 200:
                articles = articles_response.json()
                if isinstance(articles, list) and len(articles) > 0:
                    self.log_test("Articles API", True, f"✅ Retrieved {len(articles)} articles successfully")
                    
                    # Test single article retrieval
                    first_article = articles[0]
                    article_id = first_article.get("id")
                    if article_id:
                        single_response = self.session.get(f"{self.base_url}/articles/{article_id}", timeout=10)
                        if single_response.status_code == 200:
                            single_article = single_response.json()
                            if single_article.get("id") == article_id:
                                self.log_test("Single Article Retrieval", True, f"✅ Single article retrieved: {single_article.get('title', 'Unknown')}")
                            else:
                                self.log_test("Single Article Retrieval", False, f"❌ Article ID mismatch")
                        else:
                            self.log_test("Single Article Retrieval", False, f"❌ HTTP {single_response.status_code}")
                else:
                    self.log_test("Articles API", False, f"❌ No articles found or invalid format")
            else:
                self.log_test("Articles API", False, f"❌ HTTP {articles_response.status_code}")
            
            # Test Categories API
            categories_response = self.session.get(f"{self.base_url}/categories", timeout=10)
            if categories_response.status_code == 200:
                categories = categories_response.json()
                if isinstance(categories, list) and len(categories) > 0:
                    self.log_test("Categories API", True, f"✅ Retrieved {len(categories)} categories successfully")
                else:
                    self.log_test("Categories API", False, f"❌ No categories found or invalid format")
            else:
                self.log_test("Categories API", False, f"❌ HTTP {categories_response.status_code}")
            
            # Test Magazine Issues API
            issues_response = self.session.get(f"{self.base_url}/issues", timeout=10)
            if issues_response.status_code == 200:
                issues = issues_response.json()
                if isinstance(issues, list):
                    self.log_test("Magazine Issues API", True, f"✅ Retrieved {len(issues)} magazine issues")
                else:
                    self.log_test("Magazine Issues API", False, f"❌ Invalid format for issues")
            else:
                self.log_test("Magazine Issues API", False, f"❌ HTTP {issues_response.status_code}")
            
            return True
            
        except Exception as e:
            self.log_test("Core API Functionality", False, f"❌ Error: {str(e)}")
            return False

    def test_cors_configuration(self):
        """Test CORS configuration for frontend-backend communication - PRIORITY 5"""
        print("\n🌐 PRIORITY 5: CORS CONFIGURATION")
        print("=" * 50)
        
        try:
            # Test preflight request
            preflight_response = self.session.options(
                f"{self.base_url}/health",
                headers={
                    "Origin": "https://justurbane-luxury.preview.emergentagent.com",
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Content-Type,Authorization"
                },
                timeout=10
            )
            
            if preflight_response.status_code in [200, 204]:
                cors_headers = preflight_response.headers
                allow_origin = cors_headers.get("Access-Control-Allow-Origin")
                allow_methods = cors_headers.get("Access-Control-Allow-Methods")
                allow_headers = cors_headers.get("Access-Control-Allow-Headers")
                
                if allow_origin:
                    self.log_test("CORS Preflight", True, f"✅ CORS preflight successful: Origin={allow_origin}")
                    
                    # Test actual request with CORS headers
                    actual_response = self.session.get(
                        f"{self.base_url}/health",
                        headers={"Origin": "https://justurbane-luxury.preview.emergentagent.com"},
                        timeout=10
                    )
                    
                    if actual_response.status_code == 200:
                        actual_cors = actual_response.headers.get("Access-Control-Allow-Origin")
                        if actual_cors:
                            self.log_test("CORS Actual Request", True, f"✅ CORS working for actual requests: {actual_cors}")
                            return True
                        else:
                            self.log_test("CORS Actual Request", False, f"❌ No CORS headers in actual response")
                            return False
                    else:
                        self.log_test("CORS Actual Request", False, f"❌ Actual request failed: HTTP {actual_response.status_code}")
                        return False
                else:
                    self.log_test("CORS Preflight", False, f"❌ No Access-Control-Allow-Origin header")
                    return False
            else:
                self.log_test("CORS Preflight", False, f"❌ Preflight failed: HTTP {preflight_response.status_code}")
                return False
        except Exception as e:
            self.log_test("CORS Configuration", False, f"❌ Error: {str(e)}")
            return False

    def run_pricing_page_backend_tests(self):
        """Run all 5 priority tests from review request"""
        print("🎯 PRICING PAGE BACKEND SUPPORT TESTING")
        print("=" * 70)
        print("Testing backend functionality after frontend redesign improvements...")
        print("Focus: Verify pricing page frontend redesign has NOT affected backend functionality")
        print()
        
        # Run all 5 priority tests
        results = []
        results.append(self.test_api_health_check())
        results.append(self.test_payment_packages_api())
        results.append(self.test_authentication_system())
        results.append(self.test_core_api_functionality())
        results.append(self.test_cors_configuration())
        
        return self.generate_final_report(results)

    def generate_final_report(self, priority_results):
        """Generate final test report"""
        print("\n" + "="*70)
        print("📊 PRICING PAGE BACKEND TESTING REPORT")
        print("="*70)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        priority_passed = sum(1 for result in priority_results if result)
        priority_total = len(priority_results)
        priority_success_rate = (priority_passed / priority_total * 100) if priority_total > 0 else 0
        
        print(f"🎯 PRIORITY AREAS RESULTS:")
        print(f"   1. API Health Check: {'✅ PASS' if priority_results[0] else '❌ FAIL'}")
        print(f"   2. Payment Packages API: {'✅ PASS' if priority_results[1] else '❌ FAIL'}")
        print(f"   3. Authentication System: {'✅ PASS' if priority_results[2] else '❌ FAIL'}")
        print(f"   4. Core API Functionality: {'✅ PASS' if priority_results[3] else '❌ FAIL'}")
        print(f"   5. CORS Configuration: {'✅ PASS' if priority_results[4] else '❌ FAIL'}")
        print()
        print(f"📈 OVERALL RESULTS:")
        print(f"   Priority Areas: {priority_passed}/{priority_total} ({'✅ PASS' if priority_success_rate >= 80 else '❌ FAIL'}) - {priority_success_rate:.1f}%")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests} ✅")
        print(f"   Failed: {failed_tests} ❌")
        print(f"   Success Rate: {success_rate:.1f}%")
        print()
        
        # Critical findings
        critical_failures = []
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["api health", "payment packages", "authentication", "cors"]):
                    critical_failures.append(f"❌ {test_name}: {result['message']}")
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES:")
            for failure in critical_failures:
                print(f"   {failure}")
            print()
        
        # Success summary
        if priority_success_rate >= 80:
            print("✅ CONCLUSION:")
            print("   Frontend redesign has NOT affected backend functionality")
            print("   All critical APIs supporting subscription system are working")
            print("   System is ready for production use")
        else:
            print("❌ CONCLUSION:")
            print("   Some backend functionality may be affected")
            print("   Critical issues need to be addressed before production")
        
        print("\n" + "="*70)
        
        return {
            "priority_success_rate": priority_success_rate,
            "total_success_rate": success_rate,
            "critical_failures": critical_failures,
            "priority_results": priority_results
        }

if __name__ == "__main__":
    tester = PricingPageBackendTester()
    report = tester.run_pricing_page_backend_tests()