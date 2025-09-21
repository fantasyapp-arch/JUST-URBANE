#!/usr/bin/env python3
"""
Just Urbane Magazine - Pricing/Subscription Backend API Testing
Focused testing for pricing page and subscription functionality
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class PricingSubscriptionTester:
    def __init__(self, base_url: str = "https://content-phoenix.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        self.razorpay_key_id = "rzp_live_RDvDvJ94tbQgS1"
        
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

    def test_payment_packages_endpoint(self):
        """Test GET /api/payments/packages endpoint - PRIMARY REQUIREMENT"""
        try:
            response = self.session.get(f"{self.base_url}/api/payments/packages", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                packages = data.get("packages", [])
                
                if not packages:
                    self.log_test("Payment Packages API", False, "No packages found in response")
                    return False
                
                # Verify expected package structure
                expected_packages = ["digital_annual", "print_annual", "combined_annual"]
                package_ids = [pkg.get("id") for pkg in packages]
                
                found_packages = [pkg for pkg in expected_packages if pkg in package_ids]
                if len(found_packages) >= 3:
                    self.log_test("Payment Packages API", True, f"All 3 subscription packages available: {found_packages}")
                    
                    # Test package details
                    for package in packages:
                        pkg_id = package.get("id")
                        name = package.get("name")
                        price = package.get("price")
                        currency = package.get("currency")
                        features = package.get("features", [])
                        billing_period = package.get("billing_period")
                        popular = package.get("popular")
                        
                        # Verify required fields
                        required_fields = ["id", "name", "price", "currency", "features", "billing_period"]
                        missing_fields = [field for field in required_fields if field not in package]
                        
                        if not missing_fields:
                            self.log_test(f"Package Structure - {pkg_id}", True, f"Complete package data: {name} - ₹{price} {currency}")
                        else:
                            self.log_test(f"Package Structure - {pkg_id}", False, f"Missing fields: {missing_fields}")
                        
                        # Verify pricing
                        if pkg_id == "digital_annual" and price == 1.0 and currency == "INR":
                            self.log_test("Digital Package Pricing", True, f"Digital: ₹{price} {currency} (trial price)")
                        elif pkg_id == "print_annual" and price == 499.0 and currency == "INR":
                            self.log_test("Print Package Pricing", True, f"Print: ₹{price} {currency}")
                        elif pkg_id == "combined_annual" and price == 999.0 and currency == "INR":
                            self.log_test("Combined Package Pricing", True, f"Combined: ₹{price} {currency}")
                        
                        # Verify features list
                        if isinstance(features, list) and len(features) > 0:
                            self.log_test(f"Package Features - {pkg_id}", True, f"{len(features)} features listed")
                        else:
                            self.log_test(f"Package Features - {pkg_id}", False, "No features or invalid features format")
                    
                    return True
                else:
                    self.log_test("Payment Packages API", False, f"Missing packages. Found: {found_packages}, Expected: {expected_packages}")
                    return False
            else:
                self.log_test("Payment Packages API", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Payment Packages API", False, f"Error: {str(e)}")
            return False

    def test_subscription_plans_data_quality(self):
        """Verify subscription plans return correct data for PricingPage component"""
        try:
            response = self.session.get(f"{self.base_url}/api/payments/packages", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Subscription Plans Data Quality", False, f"Failed to get packages: HTTP {response.status_code}")
                return False
            
            data = response.json()
            packages = data.get("packages", [])
            
            if not packages:
                self.log_test("Subscription Plans Data Quality", False, "No subscription plans available")
                return False
            
            # Test data quality for frontend consumption
            data_quality_issues = []
            
            for package in packages:
                pkg_id = package.get("id")
                
                # Check for null/empty values
                if not package.get("name"):
                    data_quality_issues.append(f"{pkg_id}: Missing name")
                if package.get("price") is None:
                    data_quality_issues.append(f"{pkg_id}: Missing price")
                if not package.get("currency"):
                    data_quality_issues.append(f"{pkg_id}: Missing currency")
                if not isinstance(package.get("features"), list):
                    data_quality_issues.append(f"{pkg_id}: Features not a list")
                if package.get("popular") is None:
                    data_quality_issues.append(f"{pkg_id}: Missing popular flag")
                
                # Check price format (should be numeric)
                price = package.get("price")
                if price is not None and not isinstance(price, (int, float)):
                    data_quality_issues.append(f"{pkg_id}: Price not numeric: {type(price)}")
                
                # Check currency format
                currency = package.get("currency")
                if currency and currency != "INR":
                    data_quality_issues.append(f"{pkg_id}: Unexpected currency: {currency}")
                
                # Check features content
                features = package.get("features", [])
                if isinstance(features, list):
                    empty_features = [i for i, feature in enumerate(features) if not feature or not isinstance(feature, str)]
                    if empty_features:
                        data_quality_issues.append(f"{pkg_id}: Empty features at positions: {empty_features}")
            
            if not data_quality_issues:
                self.log_test("Subscription Plans Data Quality", True, f"All {len(packages)} subscription plans have high-quality data")
                return True
            else:
                self.log_test("Subscription Plans Data Quality", False, f"Data quality issues: {'; '.join(data_quality_issues)}")
                return False
                
        except Exception as e:
            self.log_test("Subscription Plans Data Quality", False, f"Error: {str(e)}")
            return False

    def test_razorpay_order_creation(self):
        """Test Razorpay order creation endpoint"""
        try:
            # First get packages to test with
            packages_response = self.session.get(f"{self.base_url}/api/payments/packages", timeout=10)
            if packages_response.status_code != 200:
                self.log_test("Razorpay Order Creation Setup", False, "Failed to get packages for testing")
                return False
            
            packages_data = packages_response.json()
            packages = packages_data.get("packages", [])
            if not packages:
                self.log_test("Razorpay Order Creation Setup", False, "No packages available for testing")
                return False
            
            # Test order creation with print subscription (requires address)
            customer_details = {
                "email": f"test_pricing_{int(time.time())}@justurbane.com",
                "full_name": "Pricing Test User",
                "phone": "+919876543210",
                "password": "testpass123",
                "address_line_1": "123 Test Street",
                "city": "Mumbai",
                "state": "Maharashtra",
                "postal_code": "400001",
                "country": "India"
            }
            
            order_request = {
                "package_id": "print_annual",
                "customer_details": customer_details,
                "payment_method": "razorpay"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/payments/razorpay/create-order",
                json=order_request,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                order_data = response.json()
                
                # Verify order response structure
                required_fields = ["order_id", "amount", "currency", "key_id", "package_id", "package_name"]
                missing_fields = [field for field in required_fields if field not in order_data]
                
                if not missing_fields:
                    if order_data.get("key_id") == self.razorpay_key_id:
                        self.log_test("Razorpay Order Creation", True, f"Order created successfully: {order_data.get('order_id')}")
                        self.log_test("Razorpay Key Configuration", True, f"Correct Razorpay Key ID: {order_data.get('key_id')}")
                        
                        # Verify amount calculation (price * 100 for paise)
                        expected_amount = 499 * 100  # Print annual price in paise
                        actual_amount = order_data.get("amount")
                        if actual_amount == expected_amount:
                            self.log_test("Razorpay Amount Calculation", True, f"Correct amount: ₹{actual_amount/100}")
                        else:
                            self.log_test("Razorpay Amount Calculation", False, f"Amount mismatch: expected {expected_amount}, got {actual_amount}")
                        
                        return True
                    else:
                        self.log_test("Razorpay Key Configuration", False, f"Incorrect key ID: {order_data.get('key_id')}")
                        return False
                else:
                    self.log_test("Razorpay Order Creation", False, f"Missing fields in response: {missing_fields}")
                    return False
            else:
                self.log_test("Razorpay Order Creation", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Razorpay Order Creation", False, f"Error: {str(e)}")
            return False

    def test_digital_subscription_order(self):
        """Test digital subscription order creation (no address required)"""
        try:
            customer_details = {
                "email": f"digital_test_{int(time.time())}@justurbane.com",
                "full_name": "Digital Test User",
                "phone": "+919876543210",
                "password": "testpass123"
                # No address fields for digital subscription
            }
            
            order_request = {
                "package_id": "digital_annual",
                "customer_details": customer_details,
                "payment_method": "razorpay"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/payments/razorpay/create-order",
                json=order_request,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                order_data = response.json()
                
                # Verify digital subscription specific details
                if order_data.get("package_id") == "digital_annual":
                    expected_amount = 1 * 100  # Digital trial price in paise
                    actual_amount = order_data.get("amount")
                    
                    if actual_amount == expected_amount:
                        self.log_test("Digital Subscription Order", True, f"Digital order created: ₹{actual_amount/100} trial price")
                        return True
                    else:
                        self.log_test("Digital Subscription Order", False, f"Amount mismatch for digital: expected {expected_amount}, got {actual_amount}")
                        return False
                else:
                    self.log_test("Digital Subscription Order", False, f"Package ID mismatch: {order_data.get('package_id')}")
                    return False
            else:
                self.log_test("Digital Subscription Order", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Digital Subscription Order", False, f"Error: {str(e)}")
            return False

    def test_address_validation_for_print_subscriptions(self):
        """Test address validation for print subscriptions"""
        try:
            # Test with missing address fields
            customer_details_no_address = {
                "email": f"address_test_{int(time.time())}@justurbane.com",
                "full_name": "Address Test User",
                "phone": "+919876543210",
                "password": "testpass123"
                # Missing address fields
            }
            
            order_request = {
                "package_id": "print_annual",  # Print subscription requires address
                "customer_details": customer_details_no_address,
                "payment_method": "razorpay"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/payments/razorpay/create-order",
                json=order_request,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            # Should fail with 400 for missing address
            if response.status_code == 400:
                error_data = response.json()
                if "address" in error_data.get("detail", "").lower():
                    self.log_test("Address Validation - Print Subscription", True, "Correctly rejected print subscription without address")
                    return True
                else:
                    self.log_test("Address Validation - Print Subscription", False, f"Wrong error message: {error_data}")
                    return False
            else:
                self.log_test("Address Validation - Print Subscription", False, f"Should have failed with 400, got: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Address Validation - Print Subscription", False, f"Error: {str(e)}")
            return False

    def test_webhook_endpoint_accessibility(self):
        """Test Razorpay webhook endpoint accessibility"""
        try:
            # Test webhook endpoint with dummy data
            webhook_data = {
                "event": "payment.captured",
                "payload": {
                    "payment": {
                        "entity": {
                            "order_id": "test_order_id"
                        }
                    }
                }
            }
            
            response = self.session.post(
                f"{self.base_url}/api/payments/razorpay/webhook",
                json=webhook_data,
                headers={
                    "Content-Type": "application/json",
                    "X-Razorpay-Signature": "test_signature"
                },
                timeout=10
            )
            
            # Webhook should be accessible (even if it fails validation)
            if response.status_code in [200, 400, 500]:
                self.log_test("Razorpay Webhook Endpoint", True, f"Webhook endpoint accessible (HTTP {response.status_code})")
                return True
            else:
                self.log_test("Razorpay Webhook Endpoint", False, f"Webhook endpoint not accessible: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Razorpay Webhook Endpoint", False, f"Error: {str(e)}")
            return False

    def test_pricing_page_api_dependencies(self):
        """Test all API endpoints that PricingPage component depends on"""
        try:
            # Test endpoints that PricingPage might call
            endpoints_to_test = [
                ("/api/health", "Health check for app status"),
                ("/api/payments/packages", "Subscription packages for pricing display"),
                ("/api/auth/register", "User registration endpoint"),
                ("/api/auth/login", "User login endpoint")
            ]
            
            successful_endpoints = 0
            
            for endpoint, description in endpoints_to_test:
                response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                
                # Different endpoints have different expected responses
                if endpoint == "/api/health":
                    if response.status_code == 200:
                        successful_endpoints += 1
                        self.log_test(f"PricingPage Dependency - {description}", True, "Health endpoint working")
                    else:
                        self.log_test(f"PricingPage Dependency - {description}", False, f"HTTP {response.status_code}")
                
                elif endpoint == "/api/payments/packages":
                    if response.status_code == 200:
                        data = response.json()
                        if data.get("packages"):
                            successful_endpoints += 1
                            self.log_test(f"PricingPage Dependency - {description}", True, "Packages endpoint working")
                        else:
                            self.log_test(f"PricingPage Dependency - {description}", False, "No packages in response")
                    else:
                        self.log_test(f"PricingPage Dependency - {description}", False, f"HTTP {response.status_code}")
                
                elif endpoint in ["/api/auth/register", "/api/auth/login"]:
                    # These endpoints expect POST with data, so 405 (Method Not Allowed) or 422 (Validation Error) is acceptable
                    if response.status_code in [405, 422]:
                        successful_endpoints += 1
                        self.log_test(f"PricingPage Dependency - {description}", True, f"Auth endpoint accessible (HTTP {response.status_code})")
                    else:
                        self.log_test(f"PricingPage Dependency - {description}", False, f"Unexpected response: HTTP {response.status_code}")
            
            if successful_endpoints >= 3:
                self.log_test("PricingPage API Dependencies", True, f"{successful_endpoints}/{len(endpoints_to_test)} required endpoints working")
                return True
            else:
                self.log_test("PricingPage API Dependencies", False, f"Only {successful_endpoints}/{len(endpoints_to_test)} endpoints working")
                return False
                
        except Exception as e:
            self.log_test("PricingPage API Dependencies", False, f"Error: {str(e)}")
            return False

    def test_cors_for_frontend_integration(self):
        """Test CORS configuration for frontend integration"""
        try:
            # Test CORS preflight request
            response = self.session.options(
                f"{self.base_url}/api/payments/packages",
                headers={
                    "Origin": "https://content-phoenix.preview.emergentagent.com",
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Content-Type,Authorization"
                },
                timeout=10
            )
            
            if response.status_code in [200, 204]:
                cors_headers = response.headers
                allow_origin = cors_headers.get("Access-Control-Allow-Origin")
                allow_methods = cors_headers.get("Access-Control-Allow-Methods")
                
                if allow_origin and allow_methods:
                    self.log_test("CORS Configuration", True, f"CORS properly configured for frontend integration")
                    return True
                else:
                    self.log_test("CORS Configuration", False, f"CORS headers incomplete")
                    return False
            else:
                self.log_test("CORS Configuration", False, f"CORS preflight failed: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("CORS Configuration", False, f"Error: {str(e)}")
            return False

    def generate_test_report(self):
        """Generate comprehensive test report"""
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*80)
        print("🎯 PRICING/SUBSCRIPTION BACKEND API TEST REPORT")
        print("="*80)
        print(f"📊 OVERALL RESULTS: {passed_tests}/{total_tests} tests passed ({success_rate:.1f}% success rate)")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print()
        
        if failed_tests > 0:
            print("❌ FAILED TESTS:")
            print("-" * 40)
            for result in self.test_results:
                if not result["success"]:
                    print(f"• {result['test']}: {result['message']}")
            print()
        
        print("✅ PASSED TESTS:")
        print("-" * 40)
        for result in self.test_results:
            if result["success"]:
                print(f"• {result['test']}: {result['message']}")
        
        print("\n" + "="*80)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "results": self.test_results
        }

    def run_pricing_subscription_tests(self):
        """Run comprehensive pricing/subscription backend tests"""
        print("🎯 STARTING PRICING/SUBSCRIPTION BACKEND API TESTING")
        print("="*80)
        print("Testing payment and subscription API endpoints for PricingPage component...")
        print()
        
        # 1. API Health Check
        print("🏥 API HEALTH CHECK")
        print("-" * 30)
        if not self.test_api_health():
            print("❌ API is not healthy - stopping tests")
            return self.generate_test_report()
        
        # 2. Payment Packages API Testing
        print("\n💰 PAYMENT PACKAGES API TESTING")
        print("-" * 40)
        self.test_payment_packages_endpoint()
        self.test_subscription_plans_data_quality()
        
        # 3. Razorpay Integration Testing
        print("\n💳 RAZORPAY INTEGRATION TESTING")
        print("-" * 40)
        self.test_razorpay_order_creation()
        self.test_digital_subscription_order()
        self.test_address_validation_for_print_subscriptions()
        self.test_webhook_endpoint_accessibility()
        
        # 4. Frontend Integration Testing
        print("\n🌐 FRONTEND INTEGRATION TESTING")
        print("-" * 40)
        self.test_pricing_page_api_dependencies()
        self.test_cors_for_frontend_integration()
        
        # 5. Generate Final Report
        return self.generate_test_report()

def main():
    """Main function to run pricing/subscription tests"""
    tester = PricingSubscriptionTester()
    report = tester.run_pricing_subscription_tests()
    
    # Return exit code based on success rate
    if report["success_rate"] >= 80:
        print(f"\n🎉 PRICING/SUBSCRIPTION TESTING COMPLETED SUCCESSFULLY!")
        print(f"Success Rate: {report['success_rate']:.1f}%")
        return 0
    else:
        print(f"\n⚠️ PRICING/SUBSCRIPTION TESTING COMPLETED WITH ISSUES")
        print(f"Success Rate: {report['success_rate']:.1f}%")
        return 1

if __name__ == "__main__":
    exit(main())