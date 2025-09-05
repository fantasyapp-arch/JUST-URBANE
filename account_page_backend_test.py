#!/usr/bin/env python3
"""
Account Page Backend Integration Testing Suite
Testing user authentication, data retrieval, and subscription integration for the Account Page
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class AccountPageBackendTester:
    def __init__(self, base_url: str = "https://urbane-refresh.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.test_user = None
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

    def create_test_user_with_subscription(self):
        """Create a test user with subscription for account page testing"""
        timestamp = int(time.time())
        test_user_data = {
            "email": f"accounttest_{timestamp}@justurbane.com",
            "full_name": "Premium Account User",
            "password": "accounttest123"
        }
        
        try:
            # Register user
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=test_user_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.test_user = data.get("user", {})
                    self.log_test("Test User Creation", True, f"Created test user: {test_user_data['email']}")
                    return test_user_data
                else:
                    self.log_test("Test User Creation", False, f"No access token in response: {data}")
                    return None
            else:
                self.log_test("Test User Creation", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Test User Creation", False, f"User creation error: {str(e)}")
            return None

    def test_user_authentication_me_endpoint(self):
        """Test /api/auth/me endpoint - PRIORITY TEST"""
        if not self.auth_token:
            self.log_test("Auth Me Endpoint", False, "No authentication token available")
            return None
            
        try:
            response = self.session.get(f"{self.base_url}/auth/me", timeout=10)
            
            if response.status_code == 200:
                user_data = response.json()
                
                # Check required fields for account page
                required_fields = ["id", "email", "full_name", "created_at"]
                subscription_fields = ["is_premium", "subscription_type", "subscription_status", "subscription_expires_at"]
                
                missing_required = [field for field in required_fields if field not in user_data]
                missing_subscription = [field for field in subscription_fields if field not in user_data]
                
                if not missing_required:
                    self.log_test("Auth Me - Required Fields", True, f"All required fields present: {', '.join(required_fields)}")
                else:
                    self.log_test("Auth Me - Required Fields", False, f"Missing required fields: {', '.join(missing_required)}")
                
                if not missing_subscription:
                    self.log_test("Auth Me - Subscription Fields", True, f"All subscription fields present: {', '.join(subscription_fields)}")
                else:
                    self.log_test("Auth Me - Subscription Fields", False, f"Missing subscription fields: {', '.join(missing_subscription)}")
                
                # Verify data types and values
                if isinstance(user_data.get("is_premium"), bool):
                    self.log_test("Auth Me - Data Types", True, "is_premium field is boolean type")
                else:
                    self.log_test("Auth Me - Data Types", False, f"is_premium should be boolean, got: {type(user_data.get('is_premium'))}")
                
                # Check for real vs fake data
                email = user_data.get("email", "")
                full_name = user_data.get("full_name", "")
                
                if email and "@" in email and not email.startswith("fake") and not email.startswith("test@example"):
                    self.log_test("Auth Me - Real Email Data", True, f"Real email data: {email}")
                else:
                    self.log_test("Auth Me - Real Email Data", False, f"Suspicious email data: {email}")
                
                if full_name and len(full_name) > 2 and not full_name.lower().startswith(("fake", "test", "placeholder")):
                    self.log_test("Auth Me - Real Name Data", True, f"Real name data: {full_name}")
                else:
                    self.log_test("Auth Me - Real Name Data", False, f"Suspicious name data: {full_name}")
                
                self.log_test("User Authentication API", True, "Successfully retrieved complete user data from /api/auth/me")
                return user_data
                
            else:
                self.log_test("User Authentication API", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("User Authentication API", False, f"Auth me endpoint error: {str(e)}")
            return None

    def test_user_data_structure_completeness(self, user_data: dict):
        """Test user data structure for account page requirements"""
        if not user_data:
            self.log_test("User Data Structure", False, "No user data provided for testing")
            return False
            
        try:
            # Account page essential fields
            account_page_fields = {
                "id": "User ID",
                "email": "Email Address", 
                "full_name": "Full Name",
                "created_at": "Account Creation Date",
                "is_premium": "Premium Status",
                "subscription_type": "Subscription Type",
                "subscription_status": "Subscription Status",
                "subscription_expires_at": "Subscription Expiry"
            }
            
            field_analysis = {}
            for field, description in account_page_fields.items():
                value = user_data.get(field)
                field_analysis[field] = {
                    "present": field in user_data,
                    "has_value": value is not None and value != "",
                    "value": value,
                    "description": description
                }
            
            # Check completeness (subscription fields can be None for free users)
            complete_fields = 0
            for field, analysis in field_analysis.items():
                if analysis["present"]:
                    # For subscription fields, None is a valid value for free users
                    if field in ["subscription_type", "subscription_status", "subscription_expires_at"]:
                        complete_fields += 1
                    elif analysis["has_value"]:
                        complete_fields += 1
            
            total_fields = len(account_page_fields)
            completeness_percentage = (complete_fields / total_fields) * 100
            
            if completeness_percentage >= 80:
                self.log_test("User Data Completeness", True, f"Account data {completeness_percentage:.1f}% complete ({complete_fields}/{total_fields} fields)")
            else:
                self.log_test("User Data Completeness", False, f"Account data only {completeness_percentage:.1f}% complete ({complete_fields}/{total_fields} fields)")
            
            # Check data quality
            quality_issues = []
            
            # Email validation
            email = user_data.get("email", "")
            if not email or "@" not in email:
                quality_issues.append("Invalid email format")
            
            # Name validation
            full_name = user_data.get("full_name", "")
            if not full_name or len(full_name.strip()) < 2:
                quality_issues.append("Invalid full name")
            
            # Date validation
            created_at = user_data.get("created_at")
            if created_at:
                try:
                    if isinstance(created_at, str):
                        datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                except:
                    quality_issues.append("Invalid created_at date format")
            
            if not quality_issues:
                self.log_test("User Data Quality", True, "All user data fields have valid formats")
            else:
                self.log_test("User Data Quality", False, f"Data quality issues: {', '.join(quality_issues)}")
            
            return completeness_percentage >= 80 and not quality_issues
            
        except Exception as e:
            self.log_test("User Data Structure", False, f"Data structure test error: {str(e)}")
            return False

    def test_subscription_data_integration(self):
        """Test subscription data integration with user account"""
        if not self.auth_token:
            self.log_test("Subscription Integration", False, "No authentication token available")
            return False
            
        try:
            # Get current user data
            response = self.session.get(f"{self.base_url}/auth/me", timeout=10)
            if response.status_code != 200:
                self.log_test("Subscription Integration Setup", False, f"Failed to get user data: HTTP {response.status_code}")
                return False
            
            user_data = response.json()
            
            # Check subscription fields
            subscription_fields = {
                "is_premium": user_data.get("is_premium"),
                "subscription_type": user_data.get("subscription_type"),
                "subscription_status": user_data.get("subscription_status"),
                "subscription_expires_at": user_data.get("subscription_expires_at")
            }
            
            # Analyze subscription data
            has_subscription_data = any(value is not None for value in subscription_fields.values())
            
            if has_subscription_data:
                self.log_test("Subscription Data Present", True, f"User has subscription data: {subscription_fields}")
                
                # Check data consistency
                is_premium = subscription_fields["is_premium"]
                subscription_type = subscription_fields["subscription_type"]
                subscription_status = subscription_fields["subscription_status"]
                
                consistency_issues = []
                
                # If user is premium, should have subscription type
                if is_premium and not subscription_type:
                    consistency_issues.append("Premium user missing subscription_type")
                
                # If has subscription type, should have status
                if subscription_type and not subscription_status:
                    consistency_issues.append("Subscription type present but missing status")
                
                if not consistency_issues:
                    self.log_test("Subscription Data Consistency", True, "Subscription data is consistent")
                else:
                    self.log_test("Subscription Data Consistency", False, f"Consistency issues: {', '.join(consistency_issues)}")
                
                return not consistency_issues
            else:
                self.log_test("Subscription Data Present", True, "User has no subscription (free account) - this is valid")
                return True
                
        except Exception as e:
            self.log_test("Subscription Integration", False, f"Subscription test error: {str(e)}")
            return False

    def test_payment_integration_with_account(self):
        """Test payment integration affects user account data"""
        try:
            # Test payment packages endpoint
            response = self.session.get(f"{self.base_url}/payments/packages", timeout=10)
            if response.status_code == 200:
                packages_data = response.json()
                packages = packages_data.get("packages", [])
                
                if packages:
                    self.log_test("Payment Packages Available", True, f"Found {len(packages)} subscription packages")
                    
                    # Check package structure for account integration
                    for package in packages:
                        required_package_fields = ["id", "name", "price", "currency"]
                        missing_fields = [field for field in required_package_fields if field not in package]
                        
                        if not missing_fields:
                            self.log_test(f"Package Structure - {package.get('name', 'Unknown')}", True, f"Complete package data: ₹{package.get('price')} {package.get('currency', 'INR')}")
                        else:
                            self.log_test(f"Package Structure - {package.get('name', 'Unknown')}", False, f"Missing fields: {', '.join(missing_fields)}")
                    
                    # Test Razorpay order creation (simulated)
                    if packages:
                        test_package = packages[0]
                        customer_details = {
                            "email": self.test_user.get("email") if self.test_user else "test@example.com",
                            "full_name": self.test_user.get("full_name") if self.test_user else "Test User",
                            "phone": "+919876543210",
                            "password": "testpass123"
                        }
                        
                        order_request = {
                            "package_id": test_package["id"],
                            "customer_details": customer_details
                        }
                        
                        response = self.session.post(
                            f"{self.base_url}/payments/razorpay/create-order",
                            json=order_request,
                            headers={"Content-Type": "application/json"},
                            timeout=15
                        )
                        
                        if response.status_code == 200:
                            order_data = response.json()
                            if order_data.get("order_id") and order_data.get("key_id"):
                                self.log_test("Payment Order Creation", True, f"Successfully created payment order for {test_package['name']}")
                            else:
                                self.log_test("Payment Order Creation", False, f"Invalid order response: {order_data}")
                        else:
                            self.log_test("Payment Order Creation", False, f"HTTP {response.status_code}: {response.text}")
                    
                    return True
                else:
                    self.log_test("Payment Packages Available", False, "No subscription packages found")
                    return False
            else:
                self.log_test("Payment Packages Available", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Payment Integration", False, f"Payment integration test error: {str(e)}")
            return False

    def test_real_vs_fake_data_verification(self):
        """Test that API returns real user data instead of placeholder/mock data"""
        if not self.auth_token:
            self.log_test("Real Data Verification", False, "No authentication token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/auth/me", timeout=10)
            if response.status_code != 200:
                self.log_test("Real Data Verification Setup", False, f"Failed to get user data: HTTP {response.status_code}")
                return False
            
            user_data = response.json()
            
            # Check for fake/placeholder data patterns
            fake_data_indicators = []
            
            # Email checks
            email = user_data.get("email", "").lower()
            fake_email_patterns = ["fake", "test@example", "placeholder", "mock", "dummy", "sample"]
            if any(pattern in email for pattern in fake_email_patterns):
                fake_data_indicators.append(f"Fake email pattern: {email}")
            
            # Name checks
            full_name = user_data.get("full_name", "").lower()
            fake_name_patterns = ["fake", "test user", "placeholder", "mock", "dummy", "sample", "john doe", "jane doe"]
            if any(pattern in full_name for pattern in fake_name_patterns):
                fake_data_indicators.append(f"Fake name pattern: {full_name}")
            
            # ID checks (should be UUID format, not sequential)
            user_id = user_data.get("id", "")
            if user_id.isdigit() or user_id in ["1", "2", "3", "test", "fake"]:
                fake_data_indicators.append(f"Suspicious ID format: {user_id}")
            
            # Date checks (should be recent and realistic)
            created_at = user_data.get("created_at")
            if created_at:
                try:
                    if isinstance(created_at, str):
                        created_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        # Check if date is too old (before 2020) or in future
                        if created_date.year < 2020 or created_date > datetime.now():
                            fake_data_indicators.append(f"Suspicious creation date: {created_at}")
                except:
                    fake_data_indicators.append(f"Invalid date format: {created_at}")
            
            if not fake_data_indicators:
                self.log_test("Real Data Verification", True, "User data appears to be real, not placeholder/mock data")
                return True
            else:
                self.log_test("Real Data Verification", False, f"Potential fake data detected: {'; '.join(fake_data_indicators)}")
                return False
                
        except Exception as e:
            self.log_test("Real Data Verification", False, f"Real data verification error: {str(e)}")
            return False

    def test_account_page_data_completeness(self):
        """Test complete data flow for account page display"""
        if not self.auth_token:
            self.log_test("Account Page Data Flow", False, "No authentication token available")
            return False
            
        try:
            # Simulate account page data requirements
            response = self.session.get(f"{self.base_url}/auth/me", timeout=10)
            if response.status_code != 200:
                self.log_test("Account Page Data Flow", False, f"Failed to get user data: HTTP {response.status_code}")
                return False
            
            user_data = response.json()
            
            # Account page sections and their required data
            account_sections = {
                "Profile Information": {
                    "fields": ["full_name", "email", "created_at"],
                    "display_ready": True
                },
                "Subscription Status": {
                    "fields": ["is_premium", "subscription_type", "subscription_status"],
                    "display_ready": True
                },
                "Subscription Details": {
                    "fields": ["subscription_expires_at"],
                    "display_ready": True
                }
            }
            
            sections_ready = 0
            
            for section_name, section_info in account_sections.items():
                required_fields = section_info["fields"]
                missing_fields = []
                
                for field in required_fields:
                    if field not in user_data:
                        missing_fields.append(field)
                    elif field in ["subscription_type", "subscription_status", "subscription_expires_at"]:
                        # These fields can be None for free users - that's valid
                        continue
                    elif user_data[field] is None:
                        missing_fields.append(field)
                
                if not missing_fields:
                    sections_ready += 1
                    self.log_test(f"Account Section - {section_name}", True, f"All required data present: {', '.join(required_fields)}")
                else:
                    self.log_test(f"Account Section - {section_name}", False, f"Missing data: {', '.join(missing_fields)}")
            
            # Overall account page readiness
            total_sections = len(account_sections)
            readiness_percentage = (sections_ready / total_sections) * 100
            
            if readiness_percentage >= 80:
                self.log_test("Account Page Readiness", True, f"Account page {readiness_percentage:.1f}% ready ({sections_ready}/{total_sections} sections complete)")
                return True
            else:
                self.log_test("Account Page Readiness", False, f"Account page only {readiness_percentage:.1f}% ready ({sections_ready}/{total_sections} sections complete)")
                return False
                
        except Exception as e:
            self.log_test("Account Page Data Flow", False, f"Account page test error: {str(e)}")
            return False

    def run_account_page_tests(self):
        """Run comprehensive account page backend integration tests"""
        print("🔐 STARTING ACCOUNT PAGE BACKEND INTEGRATION TESTING")
        print("=" * 70)
        print("Testing user authentication, data retrieval, and subscription integration...")
        print()
        
        # 1. API Health Check
        if not self.test_health_check():
            print("❌ Backend API is not healthy. Stopping tests.")
            return self.generate_report()
        
        # 2. Create Test User
        test_user_data = self.create_test_user_with_subscription()
        if not test_user_data:
            print("❌ Failed to create test user. Stopping tests.")
            return self.generate_report()
        
        # 3. Test User Authentication API (/api/auth/me)
        user_data = self.test_user_authentication_me_endpoint()
        
        # 4. Test User Data Structure
        if user_data:
            self.test_user_data_structure_completeness(user_data)
        
        # 5. Test Subscription Data Integration
        self.test_subscription_data_integration()
        
        # 6. Test Payment Integration with Account
        self.test_payment_integration_with_account()
        
        # 7. Test Real vs Fake Data
        self.test_real_vs_fake_data_verification()
        
        # 8. Test Account Page Data Completeness
        self.test_account_page_data_completeness()
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 ACCOUNT PAGE BACKEND INTEGRATION TEST REPORT")
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
                if any(keyword in test_name.lower() for keyword in ["auth me", "user data", "subscription", "account page"]):
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
            priority_successes = [s for s in successes if any(keyword in s["test"].lower() for keyword in ["auth me", "user data", "subscription", "real data"])]
            for success in priority_successes:
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
    """Main function to run account page backend tests"""
    tester = AccountPageBackendTester()
    results = tester.run_account_page_tests()
    
    # Summary for main agent
    print("\n🎯 SUMMARY FOR MAIN AGENT:")
    if results["success_rate"] >= 80:
        print("✅ Account page backend integration is working well")
    else:
        print("❌ Account page backend integration has issues")
    
    if results["critical_failures"]:
        print("🚨 Critical issues need attention:")
        for failure in results["critical_failures"][:3]:
            print(f"   {failure}")
    
    return results

if __name__ == "__main__":
    main()