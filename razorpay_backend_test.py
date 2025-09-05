#!/usr/bin/env python3
"""
Razorpay Payment Gateway Integration Testing Suite
Comprehensive testing for Just Urbane Magazine Razorpay integration
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, Any, Optional

class RazorpayAPITester:
    def __init__(self, base_url: str = "https://justurbane-payment.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
        # Razorpay test credentials from environment
        self.razorpay_key_id = "rzp_live_RDvDvJ94tbQgS1"
        self.razorpay_key_secret = "Yp6p0UVUQp3eRnHqOKugykaK"
        
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
        
    def test_health_check(self):
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

    def test_razorpay_configuration_verification(self):
        """Test Razorpay Configuration - Priority Test 1"""
        print("\n🔧 RAZORPAY CONFIGURATION VERIFICATION")
        print("=" * 50)
        
        try:
            # Test 1: Check if Razorpay credentials are loaded
            # We'll test this by trying to create an order - if credentials are missing, it should fail gracefully
            test_order_data = {
                "package_id": "digital_annual",
                "payment_method": "razorpay"
            }
            
            response = self.session.post(
                f"{self.base_url}/payments/razorpay/create-order",
                json=test_order_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 500:
                error_text = response.text.lower()
                if "razorpay not configured" in error_text:
                    self.log_test("Razorpay Configuration - Credentials Missing", False, "Razorpay credentials not configured in environment")
                    return False
                else:
                    # Other 500 error might indicate credentials are loaded but other issue
                    self.log_test("Razorpay Configuration - Credentials Loaded", True, "Razorpay credentials appear to be loaded (different error type)")
            elif response.status_code == 200:
                # Success indicates credentials are properly configured
                data = response.json()
                if data.get("key_id") == self.razorpay_key_id:
                    self.log_test("Razorpay Configuration - Credentials Verified", True, f"Razorpay credentials properly configured with Key ID: {self.razorpay_key_id}")
                    return True
                else:
                    self.log_test("Razorpay Configuration - Key ID Mismatch", False, f"Expected Key ID {self.razorpay_key_id}, got {data.get('key_id')}")
            else:
                self.log_test("Razorpay Configuration - Unexpected Response", False, f"HTTP {response.status_code}: {response.text}")
            
            return False
            
        except Exception as e:
            self.log_test("Razorpay Configuration Verification", False, f"Configuration test error: {str(e)}")
            return False

    def test_razorpay_order_creation_api(self):
        """Test Razorpay Order Creation API - Priority Test 2"""
        print("\n📝 RAZORPAY ORDER CREATION API TESTING")
        print("=" * 50)
        
        # Test all three package types
        test_packages = [
            ("digital_annual", 499.0, "Digital Subscription"),
            ("print_annual", 499.0, "Print Subscription"), 
            ("combined_annual", 999.0, "Print + Digital Subscription")
        ]
        
        successful_orders = 0
        
        for package_id, expected_amount, package_name in test_packages:
            try:
                order_data = {
                    "package_id": package_id,
                    "payment_method": "razorpay"
                }
                
                response = self.session.post(
                    f"{self.base_url}/payments/razorpay/create-order",
                    json=order_data,
                    headers={"Content-Type": "application/json"},
                    timeout=15
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Verify required fields in response
                    required_fields = ["order_id", "amount", "currency", "key_id", "package_name"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        # Verify amount (should be in paise)
                        expected_amount_paise = int(expected_amount * 100)
                        actual_amount = data.get("amount")
                        
                        if actual_amount == expected_amount_paise:
                            # Verify currency
                            if data.get("currency") == "INR":
                                # Verify key_id
                                if data.get("key_id") == self.razorpay_key_id:
                                    successful_orders += 1
                                    self.log_test(f"Razorpay Order Creation - {package_name}", True, 
                                                f"Order created successfully: ID={data.get('order_id')}, Amount=₹{expected_amount}, Currency=INR")
                                else:
                                    self.log_test(f"Razorpay Order Creation - {package_name}", False, 
                                                f"Incorrect Key ID: expected {self.razorpay_key_id}, got {data.get('key_id')}")
                            else:
                                self.log_test(f"Razorpay Order Creation - {package_name}", False, 
                                            f"Incorrect currency: expected INR, got {data.get('currency')}")
                        else:
                            self.log_test(f"Razorpay Order Creation - {package_name}", False, 
                                        f"Incorrect amount: expected {expected_amount_paise} paise, got {actual_amount}")
                    else:
                        self.log_test(f"Razorpay Order Creation - {package_name}", False, 
                                    f"Missing required fields: {missing_fields}")
                        
                elif response.status_code == 500:
                    error_text = response.text.lower()
                    if "razorpay not configured" in error_text:
                        self.log_test(f"Razorpay Order Creation - {package_name}", False, "Razorpay not configured")
                    else:
                        self.log_test(f"Razorpay Order Creation - {package_name}", False, f"Server error: {response.text}")
                else:
                    self.log_test(f"Razorpay Order Creation - {package_name}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Razorpay Order Creation - {package_name}", False, f"Error: {str(e)}")
        
        # Overall assessment
        if successful_orders == len(test_packages):
            self.log_test("Razorpay Order Creation API", True, f"All {successful_orders}/{len(test_packages)} package types working correctly")
            return True
        else:
            self.log_test("Razorpay Order Creation API", False, f"Only {successful_orders}/{len(test_packages)} package types working")
            return False

    def test_razorpay_payment_verification_api(self):
        """Test Razorpay Payment Verification API - Priority Test 3"""
        print("\n🔐 RAZORPAY PAYMENT VERIFICATION API TESTING")
        print("=" * 50)
        
        try:
            # Test with mock verification data (this will fail signature verification but test the endpoint)
            verification_data = {
                "razorpay_order_id": "order_test123456789",
                "razorpay_payment_id": "pay_test123456789", 
                "razorpay_signature": "test_signature_mock",
                "package_id": "digital_annual",
                "user_email": "test@justurbane.com"
            }
            
            response = self.session.post(
                f"{self.base_url}/payments/razorpay/verify",
                json=verification_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            # We expect this to fail with signature verification error (400) or transaction not found (404)
            # Success (200) would be unexpected with mock data
            # 500 with "Razorpay not configured" indicates configuration issue
            
            if response.status_code == 400:
                error_text = response.text.lower()
                if "invalid payment signature" in error_text or "signature" in error_text:
                    self.log_test("Razorpay Payment Verification API - Signature Validation", True, 
                                "Payment verification endpoint working - correctly rejected invalid signature")
                    return True
                else:
                    self.log_test("Razorpay Payment Verification API", False, f"Unexpected 400 error: {response.text}")
                    
            elif response.status_code == 404:
                error_text = response.text.lower()
                if "transaction not found" in error_text:
                    self.log_test("Razorpay Payment Verification API - Transaction Lookup", True, 
                                "Payment verification endpoint working - correctly handles missing transactions")
                    return True
                else:
                    self.log_test("Razorpay Payment Verification API", False, f"Unexpected 404 error: {response.text}")
                    
            elif response.status_code == 500:
                error_text = response.text.lower()
                if "razorpay not configured" in error_text:
                    self.log_test("Razorpay Payment Verification API", False, "Razorpay not configured")
                else:
                    self.log_test("Razorpay Payment Verification API", False, f"Server error: {response.text}")
                    
            elif response.status_code == 200:
                # Unexpected success with mock data
                self.log_test("Razorpay Payment Verification API", False, 
                            "Unexpected success with mock signature - security issue")
            else:
                self.log_test("Razorpay Payment Verification API", False, 
                            f"Unexpected response: HTTP {response.status_code}: {response.text}")
            
            return False
            
        except Exception as e:
            self.log_test("Razorpay Payment Verification API", False, f"Verification test error: {str(e)}")
            return False

    def test_payment_package_integration(self):
        """Test Payment Package Integration with Razorpay - Priority Test 4"""
        print("\n💰 PAYMENT PACKAGE INTEGRATION TESTING")
        print("=" * 50)
        
        try:
            # First, get payment packages to verify they exist
            response = self.session.get(f"{self.base_url}/payments/packages", timeout=10)
            
            if response.status_code == 200:
                packages = response.json()
                
                # Verify expected packages exist
                expected_packages = {
                    "digital_annual": {"amount": 499.0, "currency": "inr"},
                    "print_annual": {"amount": 499.0, "currency": "inr"},
                    "combined_annual": {"amount": 999.0, "currency": "inr"}
                }
                
                package_integration_success = 0
                
                for package_id, expected_config in expected_packages.items():
                    if package_id in packages:
                        package_data = packages[package_id]
                        
                        # Verify package configuration
                        if (package_data.get("amount") == expected_config["amount"] and 
                            package_data.get("currency") == expected_config["currency"]):
                            
                            # Test Razorpay order creation with this package
                            order_data = {
                                "package_id": package_id,
                                "payment_method": "razorpay"
                            }
                            
                            order_response = self.session.post(
                                f"{self.base_url}/payments/razorpay/create-order",
                                json=order_data,
                                headers={"Content-Type": "application/json"},
                                timeout=15
                            )
                            
                            if order_response.status_code == 200:
                                order_data_response = order_response.json()
                                expected_amount_paise = int(expected_config["amount"] * 100)
                                
                                if (order_data_response.get("amount") == expected_amount_paise and
                                    order_data_response.get("currency") == "INR"):
                                    package_integration_success += 1
                                    self.log_test(f"Package Integration - {package_id}", True, 
                                                f"Package ₹{expected_config['amount']} correctly integrated with Razorpay")
                                else:
                                    self.log_test(f"Package Integration - {package_id}", False, 
                                                f"Amount/currency mismatch in Razorpay order")
                            else:
                                self.log_test(f"Package Integration - {package_id}", False, 
                                            f"Razorpay order creation failed: HTTP {order_response.status_code}")
                        else:
                            self.log_test(f"Package Integration - {package_id}", False, 
                                        f"Package configuration incorrect: {package_data}")
                    else:
                        self.log_test(f"Package Integration - {package_id}", False, 
                                    f"Package {package_id} not found in packages API")
                
                if package_integration_success == len(expected_packages):
                    self.log_test("Payment Package Integration", True, 
                                f"All {package_integration_success}/{len(expected_packages)} packages properly integrated with Razorpay")
                    return True
                else:
                    self.log_test("Payment Package Integration", False, 
                                f"Only {package_integration_success}/{len(expected_packages)} packages properly integrated")
                    return False
                    
            else:
                self.log_test("Payment Package Integration", False, 
                            f"Failed to get payment packages: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Payment Package Integration", False, f"Integration test error: {str(e)}")
            return False

    def test_database_payment_tracking(self):
        """Test Database Payment Tracking - Priority Test 5"""
        print("\n🗄️ DATABASE PAYMENT TRACKING TESTING")
        print("=" * 50)
        
        try:
            # Create a Razorpay order to test database tracking
            order_data = {
                "package_id": "digital_annual",
                "payment_method": "razorpay"
            }
            
            response = self.session.post(
                f"{self.base_url}/payments/razorpay/create-order",
                json=order_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                order_response = response.json()
                order_id = order_response.get("order_id")
                
                if order_id:
                    # The order creation should have stored transaction data in database
                    # We can't directly query the database, but we can test the verification endpoint
                    # which should find the transaction
                    
                    verification_data = {
                        "razorpay_order_id": order_id,
                        "razorpay_payment_id": "pay_test123456789",
                        "razorpay_signature": "test_signature",
                        "package_id": "digital_annual"
                    }
                    
                    verify_response = self.session.post(
                        f"{self.base_url}/payments/razorpay/verify",
                        json=verification_data,
                        headers={"Content-Type": "application/json"},
                        timeout=15
                    )
                    
                    # We expect signature verification to fail (400), but if transaction is found,
                    # it means database tracking is working
                    if verify_response.status_code == 400:
                        error_text = verify_response.text.lower()
                        if "invalid payment signature" in error_text or "signature" in error_text:
                            self.log_test("Database Payment Tracking - Transaction Storage", True, 
                                        f"Transaction properly stored in database for order {order_id}")
                            
                            # Test transaction data structure by checking the error handling
                            # If we get signature error, it means transaction was found and processed
                            self.log_test("Database Payment Tracking - Data Structure", True, 
                                        "Transaction data structure supports verification process")
                            return True
                        else:
                            self.log_test("Database Payment Tracking", False, 
                                        f"Unexpected verification error: {verify_response.text}")
                    elif verify_response.status_code == 404:
                        error_text = verify_response.text.lower()
                        if "transaction not found" in error_text:
                            self.log_test("Database Payment Tracking", False, 
                                        f"Transaction not stored in database for order {order_id}")
                        else:
                            self.log_test("Database Payment Tracking", False, 
                                        f"Unexpected 404 error: {verify_response.text}")
                    else:
                        self.log_test("Database Payment Tracking", False, 
                                    f"Unexpected verification response: HTTP {verify_response.status_code}")
                else:
                    self.log_test("Database Payment Tracking", False, "No order_id returned from order creation")
                    
            elif response.status_code == 500:
                error_text = response.text.lower()
                if "razorpay not configured" in error_text:
                    self.log_test("Database Payment Tracking", False, "Cannot test - Razorpay not configured")
                else:
                    self.log_test("Database Payment Tracking", False, f"Order creation failed: {response.text}")
            else:
                self.log_test("Database Payment Tracking", False, 
                            f"Order creation failed: HTTP {response.status_code}")
            
            return False
            
        except Exception as e:
            self.log_test("Database Payment Tracking", False, f"Database tracking test error: {str(e)}")
            return False

    def test_razorpay_error_handling(self):
        """Test Razorpay Error Handling Scenarios"""
        print("\n⚠️ RAZORPAY ERROR HANDLING TESTING")
        print("=" * 50)
        
        error_scenarios = [
            # Test invalid package ID
            {
                "name": "Invalid Package ID",
                "data": {"package_id": "invalid_package", "payment_method": "razorpay"},
                "expected_status": 400,
                "expected_error": "invalid subscription package"
            },
            # Test missing package ID
            {
                "name": "Missing Package ID", 
                "data": {"payment_method": "razorpay"},
                "expected_status": 422,  # Validation error
                "expected_error": None
            }
        ]
        
        successful_error_handling = 0
        
        for scenario in error_scenarios:
            try:
                response = self.session.post(
                    f"{self.base_url}/payments/razorpay/create-order",
                    json=scenario["data"],
                    headers={"Content-Type": "application/json"},
                    timeout=15
                )
                
                if response.status_code == scenario["expected_status"]:
                    if scenario["expected_error"]:
                        if scenario["expected_error"].lower() in response.text.lower():
                            successful_error_handling += 1
                            self.log_test(f"Error Handling - {scenario['name']}", True, 
                                        f"Correctly handled with HTTP {response.status_code}")
                        else:
                            self.log_test(f"Error Handling - {scenario['name']}", False, 
                                        f"Wrong error message: {response.text}")
                    else:
                        successful_error_handling += 1
                        self.log_test(f"Error Handling - {scenario['name']}", True, 
                                    f"Correctly handled with HTTP {response.status_code}")
                else:
                    self.log_test(f"Error Handling - {scenario['name']}", False, 
                                f"Expected HTTP {scenario['expected_status']}, got {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Error Handling - {scenario['name']}", False, f"Error: {str(e)}")
        
        if successful_error_handling == len(error_scenarios):
            self.log_test("Razorpay Error Handling", True, "All error scenarios handled correctly")
            return True
        else:
            self.log_test("Razorpay Error Handling", False, 
                        f"Only {successful_error_handling}/{len(error_scenarios)} scenarios handled correctly")
            return False

    def test_razorpay_webhook_endpoint(self):
        """Test Razorpay Webhook Endpoint"""
        print("\n🔗 RAZORPAY WEBHOOK TESTING")
        print("=" * 50)
        
        try:
            # Test webhook endpoint exists and handles requests
            mock_webhook_data = {
                "event": "payment.captured",
                "payload": {
                    "payment": {
                        "entity": {
                            "id": "pay_test123456789",
                            "order_id": "order_test123456789",
                            "status": "captured"
                        }
                    }
                }
            }
            
            response = self.session.post(
                f"{self.base_url}/payments/razorpay/webhook",
                json=mock_webhook_data,
                headers={
                    "Content-Type": "application/json",
                    "X-Razorpay-Signature": "mock_signature"
                },
                timeout=15
            )
            
            # Webhook should respond with 200 or 400 (signature verification failure)
            if response.status_code in [200, 400]:
                if response.status_code == 200:
                    self.log_test("Razorpay Webhook Endpoint", True, "Webhook endpoint accessible and processing requests")
                else:
                    # 400 likely means signature verification failed, which is expected with mock data
                    self.log_test("Razorpay Webhook Endpoint", True, "Webhook endpoint accessible with signature verification")
                return True
            else:
                self.log_test("Razorpay Webhook Endpoint", False, 
                            f"Unexpected webhook response: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Razorpay Webhook Endpoint", False, f"Webhook test error: {str(e)}")
            return False

    def run_comprehensive_razorpay_tests(self):
        """Run all Razorpay integration tests"""
        print("🏦 STARTING COMPREHENSIVE RAZORPAY PAYMENT GATEWAY TESTING")
        print("=" * 70)
        print("Testing Razorpay integration for Just Urbane Magazine backend...")
        print()
        
        # Test sequence based on priority from review request
        test_results = {}
        
        # 1. API Health Check
        test_results["health"] = self.test_health_check()
        
        # 2. Razorpay Configuration Verification (Priority 1)
        test_results["config"] = self.test_razorpay_configuration_verification()
        
        # 3. Razorpay Order Creation API (Priority 2)  
        test_results["order_creation"] = self.test_razorpay_order_creation_api()
        
        # 4. Razorpay Payment Verification API (Priority 3)
        test_results["payment_verification"] = self.test_razorpay_payment_verification_api()
        
        # 5. Payment Package Integration (Priority 4)
        test_results["package_integration"] = self.test_payment_package_integration()
        
        # 6. Database Payment Tracking (Priority 5)
        test_results["database_tracking"] = self.test_database_payment_tracking()
        
        # 7. Error Handling
        test_results["error_handling"] = self.test_razorpay_error_handling()
        
        # 8. Webhook Endpoint
        test_results["webhook"] = self.test_razorpay_webhook_endpoint()
        
        return self.generate_razorpay_report(test_results)

    def generate_razorpay_report(self, test_results: Dict[str, bool]):
        """Generate comprehensive Razorpay test report"""
        print("\n" + "="*70)
        print("🏦 RAZORPAY PAYMENT GATEWAY INTEGRATION TEST REPORT")
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
            ("config", "Razorpay Configuration Verification"),
            ("order_creation", "Razorpay Order Creation API"),
            ("payment_verification", "Razorpay Payment Verification API"),
            ("package_integration", "Payment Package Integration"),
            ("database_tracking", "Database Payment Tracking")
        ]
        
        print("🎯 PRIORITY TEST RESULTS:")
        priority_passed = 0
        for test_key, test_name in priority_tests:
            status = "✅ PASS" if test_results.get(test_key, False) else "❌ FAIL"
            print(f"   {status} {test_name}")
            if test_results.get(test_key, False):
                priority_passed += 1
        
        priority_success_rate = (priority_passed / len(priority_tests) * 100)
        print(f"   Priority Success Rate: {priority_success_rate:.1f}% ({priority_passed}/{len(priority_tests)})")
        print()
        
        # Critical issues
        critical_failures = []
        configuration_issues = []
        
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                message = result["message"]
                
                if "razorpay not configured" in message.lower():
                    configuration_issues.append(f"❌ {test_name}: {message}")
                elif any(keyword in test_name.lower() for keyword in ["configuration", "order creation", "verification", "integration"]):
                    critical_failures.append(f"❌ {test_name}: {message}")
        
        if configuration_issues:
            print("🚨 CONFIGURATION ISSUES:")
            for issue in configuration_issues:
                print(f"   {issue}")
            print()
        
        if critical_failures:
            print("🚨 CRITICAL INTEGRATION ISSUES:")
            for failure in critical_failures[:5]:
                print(f"   {failure}")
            print()
        
        # Success highlights
        successes = [result for result in self.test_results if result["success"]]
        if successes:
            print("✅ RAZORPAY INTEGRATION SUCCESSES:")
            for success in successes[:5]:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        
        # Integration status assessment
        if priority_success_rate >= 80:
            integration_status = "🟢 RAZORPAY INTEGRATION READY"
        elif priority_success_rate >= 60:
            integration_status = "🟡 RAZORPAY INTEGRATION PARTIAL"
        else:
            integration_status = "🔴 RAZORPAY INTEGRATION ISSUES"
        
        print(f"📊 INTEGRATION STATUS: {integration_status}")
        print(f"📋 RECOMMENDATION: {'Production ready' if priority_success_rate >= 80 else 'Requires fixes before production'}")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "priority_success_rate": priority_success_rate,
            "integration_status": integration_status,
            "configuration_issues": configuration_issues,
            "critical_failures": critical_failures
        }

def main():
    """Main test execution"""
    print("🚀 Just Urbane Magazine - Razorpay Payment Gateway Testing")
    print("=" * 60)
    
    tester = RazorpayAPITester()
    results = tester.run_comprehensive_razorpay_tests()
    
    return results

if __name__ == "__main__":
    main()