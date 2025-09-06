#!/usr/bin/env python3
"""
Review Request Backend Testing - Digital Magazine Support
Testing the 6 priority areas from the review request
"""

import requests
import json
import time
from datetime import datetime

class ReviewRequestTester:
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
        
    def test_api_health_check(self):
        """1. API Health Check - Verify /api/health endpoint is responding"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, f"API responding correctly with status '{data.get('status')}' and message '{data.get('message', '')}'")
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
    
    def test_magazine_issues_api(self):
        """2. Magazine Issues API - Test /api/issues for magazine content"""
        try:
            response = self.session.get(f"{self.base_url}/api/issues", timeout=10)
            if response.status_code == 200:
                issues = response.json()
                if isinstance(issues, list):
                    if len(issues) > 0:
                        # Check structure of magazine issues
                        sample_issue = issues[0]
                        required_fields = ["id", "title", "cover_image", "release_date", "is_digital_available"]
                        missing_fields = [field for field in required_fields if field not in sample_issue]
                        
                        if not missing_fields:
                            self.log_test("Magazine Issues API", True, f"Retrieved {len(issues)} magazine issues with proper structure (id, title, cover_image, release_date, is_digital_available)")
                            return True
                        else:
                            self.log_test("Magazine Issues API", False, f"Magazine issues missing required fields: {missing_fields}")
                            return False
                    else:
                        self.log_test("Magazine Issues API", True, "Magazine issues endpoint working (empty result is acceptable)")
                        return True
                else:
                    self.log_test("Magazine Issues API", False, f"Expected list, got: {type(issues)}")
                    return False
            else:
                self.log_test("Magazine Issues API", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Magazine Issues API", False, f"Error: {str(e)}")
            return False
    
    def test_articles_api(self):
        """3. Articles API - Test /api/articles for magazine content with proper structure"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    if len(articles) > 0:
                        # Check structure for magazine content
                        sample_article = articles[0]
                        required_fields = ["id", "title", "body", "category", "author_name", "published_at", "is_premium"]
                        missing_fields = [field for field in required_fields if field not in sample_article]
                        
                        if not missing_fields:
                            # Test category filtering
                            response_filtered = self.session.get(f"{self.base_url}/api/articles?category=fashion&limit=10", timeout=10)
                            if response_filtered.status_code == 200:
                                filtered_articles = response_filtered.json()
                                self.log_test("Articles API", True, f"Retrieved {len(articles)} articles with proper magazine content structure, category filtering working ({len(filtered_articles)} fashion articles)")
                                return True
                            else:
                                self.log_test("Articles API", False, f"Category filtering failed: HTTP {response_filtered.status_code}")
                                return False
                        else:
                            self.log_test("Articles API", False, f"Articles missing required fields: {missing_fields}")
                            return False
                    else:
                        self.log_test("Articles API", False, "No articles found")
                        return False
                else:
                    self.log_test("Articles API", False, f"Expected list, got: {type(articles)}")
                    return False
            else:
                self.log_test("Articles API", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Articles API", False, f"Error: {str(e)}")
            return False
    
    def test_authentication_system(self):
        """4. Authentication System - Test user login/registration for premium access"""
        try:
            # Test user registration
            test_user = {
                "name": "Review Test User",
                "email": f"reviewtest_{int(time.time())}@justurbane.com",
                "password": "reviewtest123"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json=test_user,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                # Test user login
                login_data = {
                    "email": test_user["email"],
                    "password": test_user["password"]
                }
                
                response = self.session.post(
                    f"{self.base_url}/api/auth/login",
                    json=login_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("access_token") and data.get("token_type") == "bearer":
                        self.log_test("Authentication System", True, "User registration and login working correctly for premium access (JWT token generated)")
                        return True
                    else:
                        self.log_test("Authentication System", False, f"Invalid login response: {data}")
                        return False
                else:
                    self.log_test("Authentication System", False, f"Login failed: HTTP {response.status_code}: {response.text}")
                    return False
            else:
                self.log_test("Authentication System", False, f"Registration failed: HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Authentication System", False, f"Error: {str(e)}")
            return False
    
    def test_payment_packages_api(self):
        """5. Payment Packages API - Test /api/payments/packages for subscription plans"""
        try:
            response = self.session.get(f"{self.base_url}/api/payments/packages", timeout=10)
            if response.status_code == 200:
                packages = response.json()
                if isinstance(packages, dict):
                    # Check for expected subscription packages
                    expected_packages = ["digital_annual", "print_annual", "combined_annual"]
                    missing_packages = [pkg for pkg in expected_packages if pkg not in packages]
                    
                    if not missing_packages:
                        # Verify pricing and currency
                        digital = packages.get("digital_annual", {})
                        print_pkg = packages.get("print_annual", {})
                        combined = packages.get("combined_annual", {})
                        
                        pricing_correct = (
                            digital.get("amount") == 499.0 and
                            print_pkg.get("amount") == 499.0 and
                            combined.get("amount") == 999.0 and
                            digital.get("currency") == "inr" and
                            print_pkg.get("currency") == "inr" and
                            combined.get("currency") == "inr"
                        )
                        
                        if pricing_correct:
                            self.log_test("Payment Packages API", True, f"All 3 subscription packages available with correct INR pricing (Digital ₹{digital.get('amount')}, Print ₹{print_pkg.get('amount')}, Combined ₹{combined.get('amount')})")
                            return True
                        else:
                            self.log_test("Payment Packages API", False, f"Incorrect pricing or currency settings")
                            return False
                    else:
                        self.log_test("Payment Packages API", False, f"Missing subscription packages: {missing_packages}")
                        return False
                else:
                    self.log_test("Payment Packages API", False, f"Expected dict, got: {type(packages)}")
                    return False
            else:
                self.log_test("Payment Packages API", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Payment Packages API", False, f"Error: {str(e)}")
            return False
    
    def test_database_connection(self):
        """6. Database Connection - Verify MongoDB connectivity and data availability"""
        try:
            # Test multiple endpoints to verify database connectivity
            endpoints_to_test = [
                ("/api/articles", "Articles"),
                ("/api/categories", "Categories"),
                ("/api/issues", "Magazine Issues"),
                ("/api/payments/packages", "Payment Packages")
            ]
            
            successful_connections = 0
            total_data_count = 0
            
            for endpoint, name in endpoints_to_test:
                try:
                    response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if isinstance(data, list):
                            data_count = len(data)
                            total_data_count += data_count
                        elif isinstance(data, dict):
                            data_count = len(data.keys())
                            total_data_count += data_count
                        else:
                            data_count = 1 if data else 0
                            
                        successful_connections += 1
                        print(f"  ✅ {name}: {data_count} records")
                    else:
                        print(f"  ❌ {name}: HTTP {response.status_code}")
                except Exception as e:
                    print(f"  ❌ {name}: {str(e)}")
            
            if successful_connections == len(endpoints_to_test) and total_data_count > 0:
                self.log_test("Database Connection", True, f"MongoDB connectivity verified - all {len(endpoints_to_test)} endpoints responsive with {total_data_count} total data records")
                return True
            elif successful_connections == len(endpoints_to_test):
                self.log_test("Database Connection", True, f"MongoDB connectivity verified - all endpoints responsive (some may have empty data)")
                return True
            else:
                self.log_test("Database Connection", False, f"Database connectivity issues - only {successful_connections}/{len(endpoints_to_test)} endpoints responsive")
                return False
        except Exception as e:
            self.log_test("Database Connection", False, f"Error: {str(e)}")
            return False
    
    def test_cors_configuration(self):
        """Bonus: Test CORS configuration for frontend communication"""
        try:
            response = self.session.options(
                f"{self.base_url}/api/health",
                headers={
                    "Origin": "https://urbane-dashboard.preview.emergentagent.com",
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Content-Type"
                },
                timeout=10
            )
            
            if response.status_code in [200, 204]:
                cors_headers = response.headers
                if "Access-Control-Allow-Origin" in cors_headers:
                    self.log_test("CORS Configuration", True, "CORS properly configured for frontend communication")
                    return True
                else:
                    self.log_test("CORS Configuration", False, "CORS headers missing")
                    return False
            else:
                self.log_test("CORS Configuration", False, f"CORS preflight failed: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("CORS Configuration", False, f"Error: {str(e)}")
            return False
    
    def run_review_request_tests(self):
        """Run all review request tests"""
        print("🎯 REVIEW REQUEST BACKEND TESTING - DIGITAL MAGAZINE SUPPORT")
        print("=" * 70)
        print("Testing 6 priority areas before investigating frontend issues with FullScreenMagazineReader")
        print()
        
        # Run all 6 priority tests
        test_results = []
        
        print("1. API Health Check...")
        test_results.append(self.test_api_health_check())
        
        print("\n2. Magazine Issues API...")
        test_results.append(self.test_magazine_issues_api())
        
        print("\n3. Articles API...")
        test_results.append(self.test_articles_api())
        
        print("\n4. Authentication System...")
        test_results.append(self.test_authentication_system())
        
        print("\n5. Payment Packages API...")
        test_results.append(self.test_payment_packages_api())
        
        print("\n6. Database Connection...")
        test_results.append(self.test_database_connection())
        
        print("\nBonus: CORS Configuration...")
        test_results.append(self.test_cors_configuration())
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 70)
        print("📊 REVIEW REQUEST TEST RESULTS")
        print("=" * 70)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        else:
            print("\n🎉 ALL TESTS PASSED! Backend is ready for FullScreenMagazineReader functionality.")
        
        print("\n" + "=" * 70)
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

def main():
    """Main testing function"""
    tester = ReviewRequestTester()
    report = tester.run_review_request_tests()
    
    # Save report
    with open("/app/review_request_test_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: /app/review_request_test_report.json")
    
    return report["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
"""
Review Request Focused Testing
Testing the specific priorities mentioned in the review request
"""

import requests
import json
import time
from datetime import datetime

class ReviewRequestTester:
    def __init__(self, base_url: str = "https://urbane-dashboard.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, response_data: any = None):
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
        
    def test_api_health_endpoint(self):
        """1. API Health Check - Verify /api/health endpoint is responding correctly"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, f"Health endpoint responding correctly: {data}")
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

    def test_magazine_issues_api(self):
        """2. Magazine Issues API - Test /api/magazine-issues endpoint for magazine content"""
        try:
            # The actual endpoint is /api/issues based on the server code
            response = self.session.get(f"{self.base_url}/api/issues", timeout=10)
            if response.status_code == 200:
                issues = response.json()
                if isinstance(issues, list):
                    self.log_test("Magazine Issues API", True, f"Retrieved {len(issues)} magazine issues successfully")
                    
                    # Check structure of issues
                    if issues:
                        issue = issues[0]
                        required_fields = ["id", "title", "cover_image", "release_date", "is_digital_available"]
                        missing_fields = [field for field in required_fields if field not in issue]
                        
                        if not missing_fields:
                            self.log_test("Magazine Issues Structure", True, f"Issues have proper structure with fields: {required_fields}")
                        else:
                            self.log_test("Magazine Issues Structure", False, f"Missing fields in issues: {missing_fields}")
                    
                    return issues
                else:
                    self.log_test("Magazine Issues API", False, f"Expected list, got: {type(issues)}")
                    return None
            else:
                self.log_test("Magazine Issues API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Magazine Issues API", False, f"Error: {str(e)}")
            return None

    def test_articles_api(self):
        """3. Articles API - Test /api/articles endpoint for magazine article content"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    self.log_test("Articles API", True, f"Retrieved {len(articles)} articles successfully")
                    
                    # Test article structure for magazine content
                    if articles:
                        article = articles[0]
                        required_fields = ["id", "title", "body", "category", "author_name", "published_at", "is_premium"]
                        missing_fields = [field for field in required_fields if field not in article]
                        
                        if not missing_fields:
                            self.log_test("Articles Structure", True, f"Articles have proper structure for magazine content")
                        else:
                            self.log_test("Articles Structure", False, f"Missing fields in articles: {missing_fields}")
                    
                    # Test category filtering
                    response = self.session.get(f"{self.base_url}/api/articles?category=fashion&limit=5", timeout=10)
                    if response.status_code == 200:
                        fashion_articles = response.json()
                        self.log_test("Articles Category Filtering", True, f"Category filtering working - retrieved {len(fashion_articles)} fashion articles")
                    else:
                        self.log_test("Articles Category Filtering", False, f"Category filtering failed: HTTP {response.status_code}")
                    
                    return articles
                else:
                    self.log_test("Articles API", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("Articles API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Articles API", False, f"Error: {str(e)}")
            return None

    def test_payment_packages_api(self):
        """4. Payment Packages API - Test /api/payments/packages for digital subscription plans"""
        try:
            response = self.session.get(f"{self.base_url}/api/payments/packages", timeout=10)
            if response.status_code == 200:
                packages = response.json()
                if isinstance(packages, dict):
                    self.log_test("Payment Packages API", True, f"Retrieved {len(packages)} subscription packages successfully")
                    
                    # Check for expected packages
                    expected_packages = ["digital_annual", "print_annual", "combined_annual"]
                    missing_packages = [pkg for pkg in expected_packages if pkg not in packages]
                    
                    if not missing_packages:
                        self.log_test("Payment Packages Structure", True, f"All expected packages present: {list(packages.keys())}")
                        
                        # Check pricing and currency
                        digital = packages.get("digital_annual", {})
                        print_pkg = packages.get("print_annual", {})
                        combined = packages.get("combined_annual", {})
                        
                        pricing_correct = (
                            digital.get("amount") == 499.0 and
                            print_pkg.get("amount") == 499.0 and
                            combined.get("amount") == 999.0
                        )
                        
                        currency_correct = (
                            digital.get("currency") == "inr" and
                            print_pkg.get("currency") == "inr" and
                            combined.get("currency") == "inr"
                        )
                        
                        if pricing_correct:
                            self.log_test("Payment Packages Pricing", True, f"Correct INR pricing: Digital ₹{digital.get('amount')}, Print ₹{print_pkg.get('amount')}, Combined ₹{combined.get('amount')}")
                        else:
                            self.log_test("Payment Packages Pricing", False, f"Incorrect pricing detected")
                        
                        if currency_correct:
                            self.log_test("Payment Packages Currency", True, "All packages correctly set to INR currency")
                        else:
                            self.log_test("Payment Packages Currency", False, "Currency configuration issues detected")
                    else:
                        self.log_test("Payment Packages Structure", False, f"Missing packages: {missing_packages}")
                    
                    return packages
                else:
                    self.log_test("Payment Packages API", False, f"Expected dict, got: {type(packages)}")
                    return None
            else:
                self.log_test("Payment Packages API", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Payment Packages API", False, f"Error: {str(e)}")
            return None

    def test_authentication_system(self):
        """5. Authentication System - Test JWT authentication for premium content access"""
        try:
            # Test user registration
            test_user = {
                "name": "Review Test User",
                "email": f"reviewtest_{int(time.time())}@justurbane.com",
                "password": "reviewtest123"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json=test_user,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Authentication - Registration", True, "User registration working correctly")
                
                # Test login
                login_data = {
                    "email": test_user["email"],
                    "password": test_user["password"]
                }
                
                response = self.session.post(
                    f"{self.base_url}/api/auth/login",
                    json=login_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("access_token") and data.get("token_type") == "bearer":
                        self.auth_token = data["access_token"]
                        self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                        self.log_test("Authentication - Login", True, "JWT authentication working correctly")
                        
                        # Test protected endpoint
                        test_article = {
                            "title": "Review Test Article",
                            "dek": "Testing authentication",
                            "body": "This is a test article for authentication testing.",
                            "category": "tech",
                            "tags": ["test"],
                            "is_premium": False
                        }
                        
                        response = self.session.post(
                            f"{self.base_url}/api/articles",
                            json=test_article,
                            headers={"Content-Type": "application/json"},
                            timeout=10
                        )
                        
                        if response.status_code == 200:
                            self.log_test("Authentication - Protected Endpoint", True, "JWT authentication working for premium content access")
                        else:
                            self.log_test("Authentication - Protected Endpoint", False, f"Protected endpoint access failed: HTTP {response.status_code}")
                    else:
                        self.log_test("Authentication - Login", False, f"Invalid login response: {data}")
                else:
                    self.log_test("Authentication - Login", False, f"Login failed: HTTP {response.status_code}")
            else:
                self.log_test("Authentication - Registration", False, f"Registration failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Authentication System", False, f"Error: {str(e)}")

    def test_cors_configuration(self):
        """6. CORS Configuration - Verify frontend can communicate with backend properly"""
        try:
            # Test preflight request
            response = self.session.options(
                f"{self.base_url}/api/health",
                headers={
                    "Origin": "https://urbane-dashboard.preview.emergentagent.com",
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Content-Type"
                },
                timeout=10
            )
            
            if response.status_code in [200, 204]:
                cors_headers = response.headers
                if "Access-Control-Allow-Origin" in cors_headers:
                    self.log_test("CORS Configuration", True, f"CORS properly configured for frontend communication")
                    
                    # Test actual CORS request
                    response = self.session.get(
                        f"{self.base_url}/api/health",
                        headers={"Origin": "https://urbane-dashboard.preview.emergentagent.com"},
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        self.log_test("CORS Actual Request", True, "Frontend can successfully communicate with backend")
                    else:
                        self.log_test("CORS Actual Request", False, f"CORS request failed: HTTP {response.status_code}")
                else:
                    self.log_test("CORS Configuration", False, "CORS headers missing in preflight response")
            else:
                self.log_test("CORS Configuration", False, f"CORS preflight failed: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("CORS Configuration", False, f"Error: {str(e)}")

    def test_3d_magazine_functionality(self):
        """Test backend support for 3D magazine reader functionality"""
        try:
            # Test magazine issues for 3D reader
            issues_response = self.session.get(f"{self.base_url}/api/issues", timeout=10)
            if issues_response.status_code == 200:
                issues = issues_response.json()
                if issues:
                    self.log_test("3D Magazine - Issues Support", True, f"Magazine issues available for 3D reader: {len(issues)} issues")
                else:
                    self.log_test("3D Magazine - Issues Support", False, "No magazine issues available for 3D reader")
            else:
                self.log_test("3D Magazine - Issues Support", False, f"Issues API failed: HTTP {issues_response.status_code}")
            
            # Test articles with proper structure for 3D display
            articles_response = self.session.get(f"{self.base_url}/api/articles?limit=10", timeout=10)
            if articles_response.status_code == 200:
                articles = articles_response.json()
                if articles:
                    # Check for 3D reader requirements
                    article = articles[0]
                    required_3d_fields = ["id", "title", "body", "author_name", "category", "published_at"]
                    has_required_fields = all(field in article for field in required_3d_fields)
                    
                    if has_required_fields:
                        self.log_test("3D Magazine - Article Structure", True, "Articles have proper structure for 3D magazine reader")
                    else:
                        missing = [field for field in required_3d_fields if field not in article]
                        self.log_test("3D Magazine - Article Structure", False, f"Articles missing 3D reader fields: {missing}")
                else:
                    self.log_test("3D Magazine - Article Structure", False, "No articles available for 3D reader")
            else:
                self.log_test("3D Magazine - Article Structure", False, f"Articles API failed: HTTP {articles_response.status_code}")
                
        except Exception as e:
            self.log_test("3D Magazine Functionality", False, f"Error: {str(e)}")

    def run_review_request_tests(self):
        """Run all tests specified in the review request"""
        print("🎯 REVIEW REQUEST FOCUSED TESTING")
        print("=" * 50)
        print("Testing the redesigned digital magazine page backend support")
        print()
        
        # 1. API Health Check
        print("1. Testing API Health Check...")
        self.test_api_health_endpoint()
        print()
        
        # 2. Magazine Issues API
        print("2. Testing Magazine Issues API...")
        self.test_magazine_issues_api()
        print()
        
        # 3. Articles API
        print("3. Testing Articles API...")
        self.test_articles_api()
        print()
        
        # 4. Payment Packages API
        print("4. Testing Payment Packages API...")
        self.test_payment_packages_api()
        print()
        
        # 5. Authentication System
        print("5. Testing Authentication System...")
        self.test_authentication_system()
        print()
        
        # 6. CORS Configuration
        print("6. Testing CORS Configuration...")
        self.test_cors_configuration()
        print()
        
        # 7. 3D Magazine Functionality
        print("7. Testing 3D Magazine Functionality...")
        self.test_3d_magazine_functionality()
        print()
        
        return self.generate_report()

    def generate_report(self):
        """Generate test report"""
        print("=" * 60)
        print("📊 REVIEW REQUEST TEST RESULTS")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n✅ PASSED TESTS:")
        for result in self.test_results:
            if result["success"]:
                print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

def main():
    """Main testing function"""
    tester = ReviewRequestTester()
    report = tester.run_review_request_tests()
    
    # Save report
    with open("/app/review_request_test_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: /app/review_request_test_report.json")
    
    return report["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)