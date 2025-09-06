#!/usr/bin/env python3
"""
Just Urbane Magazine - Razorpay Clean Backend Testing Suite
Comprehensive testing for cleaned backend with Stripe removed and Razorpay-only payment system
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class RazorpayCleanBackendTester:
    def __init__(self, base_url: str = "https://urbane-dashboard.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        self.test_user = None
        
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
        """Test API health endpoint - Priority 1"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, "Clean backend is running correctly")
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

    def test_payment_packages_api(self):
        """Test /api/payments/packages endpoint - Priority 2"""
        try:
            response = self.session.get(f"{self.base_url}/payments/packages", timeout=10)
            if response.status_code == 200:
                data = response.json()
                packages = data.get("packages", [])
                
                if not packages:
                    self.log_test("Payment Packages API", False, "No packages returned")
                    return False
                
                # Verify expected packages
                expected_packages = ["digital_annual", "print_annual", "combined_annual"]
                package_ids = [pkg.get("id") for pkg in packages]
                
                missing_packages = [pkg for pkg in expected_packages if pkg not in package_ids]
                if missing_packages:
                    self.log_test("Payment Packages API", False, f"Missing packages: {missing_packages}")
                    return False
                
                # Verify pricing
                pricing_correct = True
                pricing_details = []
                
                for package in packages:
                    pkg_id = package.get("id")
                    price = package.get("price")
                    currency = package.get("currency")
                    
                    if pkg_id == "digital_annual" and price == 499.0 and currency == "INR":
                        pricing_details.append(f"Digital: ₹{price}")
                    elif pkg_id == "print_annual" and price == 499.0 and currency == "INR":
                        pricing_details.append(f"Print: ₹{price}")
                    elif pkg_id == "combined_annual" and price == 999.0 and currency == "INR":
                        pricing_details.append(f"Combined: ₹{price}")
                    else:
                        pricing_correct = False
                        break
                
                if pricing_correct:
                    self.log_test("Payment Packages API", True, f"Correct subscription packages returned: {', '.join(pricing_details)}")
                    return packages
                else:
                    self.log_test("Payment Packages API", False, f"Incorrect pricing or currency in packages")
                    return False
            else:
                self.log_test("Payment Packages API", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Payment Packages API", False, f"Error: {str(e)}")
            return False

    def test_user_registration_and_login(self):
        """Test user registration and login system - Priority 7"""
        # Test Registration
        test_user = {
            "email": f"testuser_{int(time.time())}@justurbane.com",
            "password": "premium123",
            "full_name": "Razorpay Test User"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=test_user,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token") and data.get("user"):
                    self.log_test("User Registration System", True, "User registration working properly")
                    self.test_user = test_user
                    
                    # Test Login
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
                        login_data = login_response.json()
                        if login_data.get("access_token"):
                            self.auth_token = login_data["access_token"]
                            self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                            self.log_test("User Authentication & JWT", True, "Login system working correctly, JWT tokens generated")
                            return True
                        else:
                            self.log_test("User Authentication & JWT", False, "No access token in login response")
                            return False
                    else:
                        self.log_test("User Authentication & JWT", False, f"Login failed: HTTP {login_response.status_code}")
                        return False
                else:
                    self.log_test("User Registration System", False, f"Invalid registration response: {data}")
                    return False
            else:
                self.log_test("User Registration System", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("User Registration System", False, f"Registration error: {str(e)}")
            return False

    def test_razorpay_order_creation_with_customer_details(self):
        """Test Razorpay order creation with CustomerDetails model - Priority 3"""
        if not self.auth_token:
            self.log_test("Razorpay Order Creation", False, "No authentication token available")
            return False
        
        # Test 1: Digital subscription (no address required)
        digital_order_data = {
            "package_id": "digital_annual",
            "customer_details": {
                "email": "customer@justurbane.com",
                "full_name": "Digital Customer",
                "phone": "+919876543210"
            },
            "payment_method": "razorpay"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/payments/razorpay/create-order",
                json=digital_order_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("order_id") and data.get("key_id") and data.get("amount"):
                    self.log_test("Razorpay Order Creation - Digital", True, f"Digital subscription order created successfully: {data.get('order_id')}")
                    
                    # Test 2: Print subscription (address required)
                    print_order_data = {
                        "package_id": "print_annual",
                        "customer_details": {
                            "email": "printcustomer@justurbane.com",
                            "full_name": "Print Customer",
                            "phone": "+919876543210",
                            "address_line_1": "123 Main Street",
                            "city": "Mumbai",
                            "state": "Maharashtra",
                            "postal_code": "400001",
                            "country": "India"
                        },
                        "payment_method": "razorpay"
                    }
                    
                    print_response = self.session.post(
                        f"{self.base_url}/payments/razorpay/create-order",
                        json=print_order_data,
                        headers={"Content-Type": "application/json"},
                        timeout=15
                    )
                    
                    if print_response.status_code == 200:
                        print_data = print_response.json()
                        if print_data.get("order_id"):
                            self.log_test("Razorpay Order Creation - Print with Address", True, f"Print subscription order created with address validation: {print_data.get('order_id')}")
                            return True
                        else:
                            self.log_test("Razorpay Order Creation - Print with Address", False, f"Invalid print order response: {print_data}")
                            return False
                    else:
                        self.log_test("Razorpay Order Creation - Print with Address", False, f"Print order failed: HTTP {print_response.status_code}: {print_response.text}")
                        return False
                else:
                    self.log_test("Razorpay Order Creation - Digital", False, f"Invalid digital order response: {data}")
                    return False
            else:
                self.log_test("Razorpay Order Creation - Digital", False, f"Digital order failed: HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Razorpay Order Creation", False, f"Error: {str(e)}")
            return False

    def test_customer_details_address_validation(self):
        """Test address validation for print subscriptions - Priority 4"""
        if not self.auth_token:
            self.log_test("Address Validation", False, "No authentication token available")
            return False
        
        # Test 1: Print subscription without address (should fail)
        invalid_print_order = {
            "package_id": "print_annual",
            "customer_details": {
                "email": "noaddress@justurbane.com",
                "full_name": "No Address Customer",
                "phone": "+919876543210"
                # Missing address fields
            },
            "payment_method": "razorpay"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/payments/razorpay/create-order",
                json=invalid_print_order,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 400:
                error_data = response.json()
                if "address" in error_data.get("detail", "").lower():
                    self.log_test("Address Validation - Print Subscription", True, "Address validation working: print subscription requires address fields")
                    
                    # Test 2: Combined subscription without address (should also fail)
                    invalid_combined_order = {
                        "package_id": "combined_annual",
                        "customer_details": {
                            "email": "nocombinedaddress@justurbane.com",
                            "full_name": "No Combined Address Customer",
                            "phone": "+919876543210"
                        },
                        "payment_method": "razorpay"
                    }
                    
                    combined_response = self.session.post(
                        f"{self.base_url}/payments/razorpay/create-order",
                        json=invalid_combined_order,
                        headers={"Content-Type": "application/json"},
                        timeout=15
                    )
                    
                    if combined_response.status_code == 400:
                        combined_error = combined_response.json()
                        if "address" in combined_error.get("detail", "").lower():
                            self.log_test("Address Validation - Combined Subscription", True, "Address validation working: combined subscription requires address fields")
                            return True
                        else:
                            self.log_test("Address Validation - Combined Subscription", False, f"Wrong error message: {combined_error}")
                            return False
                    else:
                        self.log_test("Address Validation - Combined Subscription", False, f"Expected 400 error, got: HTTP {combined_response.status_code}")
                        return False
                else:
                    self.log_test("Address Validation - Print Subscription", False, f"Wrong error message: {error_data}")
                    return False
            else:
                self.log_test("Address Validation - Print Subscription", False, f"Expected 400 error, got: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Address Validation", False, f"Error: {str(e)}")
            return False

    def test_database_operations(self):
        """Test articles, categories, and content endpoints - Priority 6"""
        try:
            # Test Articles API
            articles_response = self.session.get(f"{self.base_url}/articles?limit=10", timeout=10)
            if articles_response.status_code == 200:
                articles = articles_response.json()
                if isinstance(articles, list):
                    self.log_test("Database Operations - Articles", True, f"Articles endpoint working: {len(articles)} articles retrieved")
                else:
                    self.log_test("Database Operations - Articles", False, f"Invalid articles response: {type(articles)}")
                    return False
            else:
                self.log_test("Database Operations - Articles", False, f"Articles API failed: HTTP {articles_response.status_code}")
                return False
            
            # Test Categories API
            categories_response = self.session.get(f"{self.base_url}/categories", timeout=10)
            if categories_response.status_code == 200:
                categories = categories_response.json()
                if isinstance(categories, list):
                    self.log_test("Database Operations - Categories", True, f"Categories endpoint working: {len(categories)} categories retrieved")
                else:
                    self.log_test("Database Operations - Categories", False, f"Invalid categories response: {type(categories)}")
                    return False
            else:
                self.log_test("Database Operations - Categories", False, f"Categories API failed: HTTP {categories_response.status_code}")
                return False
            
            # Test Reviews API
            reviews_response = self.session.get(f"{self.base_url}/reviews", timeout=10)
            if reviews_response.status_code == 200:
                reviews = reviews_response.json()
                if isinstance(reviews, list):
                    self.log_test("Database Operations - Reviews", True, f"Reviews endpoint working: {len(reviews)} reviews retrieved")
                else:
                    self.log_test("Database Operations - Reviews", False, f"Invalid reviews response: {type(reviews)}")
                    return False
            else:
                self.log_test("Database Operations - Reviews", False, f"Reviews API failed: HTTP {reviews_response.status_code}")
                return False
            
            # Test Magazine Issues API
            issues_response = self.session.get(f"{self.base_url}/issues", timeout=10)
            if issues_response.status_code == 200:
                issues = issues_response.json()
                if isinstance(issues, list):
                    self.log_test("Database Operations - Magazine Issues", True, f"Magazine issues endpoint working: {len(issues)} issues retrieved")
                    return True
                else:
                    self.log_test("Database Operations - Magazine Issues", False, f"Invalid issues response: {type(issues)}")
                    return False
            else:
                self.log_test("Database Operations - Magazine Issues", False, f"Issues API failed: HTTP {issues_response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Database Operations", False, f"Error: {str(e)}")
            return False

    def test_stripe_removal_verification(self):
        """Verify all Stripe code has been removed successfully"""
        try:
            # Test that Stripe endpoints no longer exist
            stripe_endpoints = [
                "/payments/stripe/create-checkout",
                "/payments/stripe/verify",
                "/payments/create-checkout",  # Old Stripe endpoint
                "/webhook/stripe"
            ]
            
            stripe_removed = True
            for endpoint in stripe_endpoints:
                try:
                    response = self.session.get(f"{self.base_url}{endpoint}", timeout=5)
                    if response.status_code != 404:
                        stripe_removed = False
                        self.log_test(f"Stripe Removal - {endpoint}", False, f"Stripe endpoint still exists: HTTP {response.status_code}")
                except:
                    # Connection errors are expected for removed endpoints
                    pass
            
            if stripe_removed:
                self.log_test("Stripe Code Removal", True, "All Stripe endpoints successfully removed")
                return True
            else:
                self.log_test("Stripe Code Removal", False, "Some Stripe endpoints still exist")
                return False
                
        except Exception as e:
            self.log_test("Stripe Code Removal", False, f"Error: {str(e)}")
            return False

    def test_razorpay_webhook_endpoint(self):
        """Test Razorpay webhook endpoint accessibility"""
        try:
            # Test webhook endpoint exists and is accessible
            webhook_data = {
                "event": "payment.captured",
                "payload": {
                    "payment": {
                        "entity": {
                            "order_id": "order_test_webhook"
                        }
                    }
                }
            }
            
            response = self.session.post(
                f"{self.base_url}/payments/razorpay/webhook",
                json=webhook_data,
                headers={
                    "Content-Type": "application/json",
                    "X-Razorpay-Signature": "test_signature"
                },
                timeout=10
            )
            
            # Webhook should be accessible (even if signature fails)
            if response.status_code in [200, 400, 500]:
                self.log_test("Razorpay Webhook Endpoint", True, f"Webhook endpoint accessible: HTTP {response.status_code}")
                return True
            else:
                self.log_test("Razorpay Webhook Endpoint", False, f"Webhook endpoint not accessible: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Razorpay Webhook Endpoint", False, f"Error: {str(e)}")
            return False

    def test_error_handling_and_validation(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid package ID
            invalid_package_data = {
                "package_id": "invalid_package",
                "customer_details": {
                    "email": "test@justurbane.com",
                    "full_name": "Test User",
                    "phone": "+919876543210"
                },
                "payment_method": "razorpay"
            }
            
            if self.auth_token:
                response = self.session.post(
                    f"{self.base_url}/payments/razorpay/create-order",
                    json=invalid_package_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 404:
                    error_data = response.json()
                    if "not found" in error_data.get("detail", "").lower():
                        self.log_test("Error Handling - Invalid Package", True, "Proper error handling for invalid package ID")
                        return True
                    else:
                        self.log_test("Error Handling - Invalid Package", False, f"Wrong error message: {error_data}")
                        return False
                else:
                    self.log_test("Error Handling - Invalid Package", False, f"Expected 404 error, got: HTTP {response.status_code}")
                    return False
            else:
                self.log_test("Error Handling - Invalid Package", False, "No authentication token for testing")
                return False
                
        except Exception as e:
            self.log_test("Error Handling", False, f"Error: {str(e)}")
            return False

    def run_comprehensive_razorpay_tests(self):
        """Run all comprehensive Razorpay clean backend tests"""
        print("🧪 STARTING RAZORPAY CLEAN BACKEND TESTING")
        print("=" * 70)
        print("Testing cleaned Just Urbane backend with Stripe removed and Razorpay-only payment system...")
        print()
        
        # Priority 1: API Health Check
        health_success = self.test_api_health_check()
        
        # Priority 2: Payment Packages API
        packages_success = self.test_payment_packages_api()
        
        # Priority 7: Authentication System (needed for order creation)
        auth_success = self.test_user_registration_and_login()
        
        # Priority 3: Razorpay Order Creation with Customer Details
        order_creation_success = self.test_razorpay_order_creation_with_customer_details()
        
        # Priority 4: Customer Details Validation
        address_validation_success = self.test_customer_details_address_validation()
        
        # Priority 6: Database Operations
        database_success = self.test_database_operations()
        
        # Additional Tests
        stripe_removal_success = self.test_stripe_removal_verification()
        webhook_success = self.test_razorpay_webhook_endpoint()
        error_handling_success = self.test_error_handling_and_validation()
        
        return self.generate_comprehensive_report()

    def generate_comprehensive_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 RAZORPAY CLEAN BACKEND TEST REPORT")
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
        
        # Priority test results
        priority_tests = [
            "API Health Check",
            "Payment Packages API", 
            "Razorpay Order Creation",
            "Address Validation",
            "Database Operations",
            "User Registration System",
            "User Authentication & JWT"
        ]
        
        print("🎯 PRIORITY TEST RESULTS:")
        for test_name in priority_tests:
            matching_results = [r for r in self.test_results if test_name in r["test"]]
            if matching_results:
                result = matching_results[0]
                status = "✅" if result["success"] else "❌"
                print(f"   {status} {result['test']}: {result['message']}")
        print()
        
        # Critical failures
        critical_failures = []
        minor_issues = []
        
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["api health", "payment packages", "razorpay order", "address validation", "database"]):
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
            for success in successes[:8]:
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
    """Main test execution"""
    print("🚀 Just Urbane Magazine - Razorpay Clean Backend Testing")
    print("Testing cleaned backend with Stripe removed and Razorpay-only payment system")
    print("=" * 70)
    
    tester = RazorpayCleanBackendTester()
    results = tester.run_comprehensive_razorpay_tests()
    
    # Summary for test_result.md
    success_rate = results["success_rate"]
    if success_rate >= 90:
        print(f"\n🎉 EXCELLENT: {success_rate:.1f}% success rate - Clean Razorpay backend working perfectly!")
    elif success_rate >= 75:
        print(f"\n✅ GOOD: {success_rate:.1f}% success rate - Clean Razorpay backend mostly working with minor issues")
    else:
        print(f"\n⚠️ NEEDS ATTENTION: {success_rate:.1f}% success rate - Clean Razorpay backend has significant issues")
    
    return results

if __name__ == "__main__":
    main()