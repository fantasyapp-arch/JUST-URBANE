#!/usr/bin/env python3
"""
Just Urbane Magazine API Testing Suite
Comprehensive backend API testing for the premium digital magazine platform
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class JustUrbaneAPITester:
    def __init__(self, base_url: str = "http://localhost:8001"):
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
        
    def test_health_check(self):
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, "API is healthy and responding")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected health status: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        test_user = {
            "name": "Premium Test User",
            "email": f"testuser_{int(time.time())}@justurbane.com",
            "password": "premium123"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json=test_user,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("email") == test_user["email"] and data.get("name") == test_user["name"]:
                    self.log_test("User Registration", True, "User registered successfully", data)
                    return test_user
                else:
                    self.log_test("User Registration", False, f"Invalid response data: {data}")
                    return None
            else:
                self.log_test("User Registration", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("User Registration", False, f"Registration error: {str(e)}")
            return None
    
    def test_user_login(self, user_credentials: Dict[str, str]):
        """Test user login endpoint"""
        if not user_credentials:
            self.log_test("User Login", False, "No user credentials provided")
            return False
            
        login_data = {
            "email": user_credentials["email"],
            "password": user_credentials["password"]
        }
        
        try:
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
                    self.log_test("User Login", True, "Login successful, JWT token received")
                    return True
                else:
                    self.log_test("User Login", False, f"Invalid login response: {data}")
                    return False
            else:
                self.log_test("User Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("User Login", False, f"Login error: {str(e)}")
            return False
    
    def test_articles_endpoint(self):
        """Test articles listing endpoint with various filters"""
        try:
            # Test basic articles listing
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    self.log_test("Articles Listing", True, f"Retrieved {len(articles)} articles")
                    
                    # Test with category filter
                    response = self.session.get(f"{self.base_url}/api/articles?category=style&limit=5", timeout=10)
                    if response.status_code == 200:
                        filtered_articles = response.json()
                        self.log_test("Articles Category Filter", True, f"Retrieved {len(filtered_articles)} style articles")
                    else:
                        self.log_test("Articles Category Filter", False, f"HTTP {response.status_code}")
                    
                    # Test featured articles
                    response = self.session.get(f"{self.base_url}/api/articles?featured=true", timeout=10)
                    if response.status_code == 200:
                        featured_articles = response.json()
                        self.log_test("Featured Articles", True, f"Retrieved {len(featured_articles)} featured articles")
                    else:
                        self.log_test("Featured Articles", False, f"HTTP {response.status_code}")
                    
                    # Test trending articles
                    response = self.session.get(f"{self.base_url}/api/articles?trending=true", timeout=10)
                    if response.status_code == 200:
                        trending_articles = response.json()
                        self.log_test("Trending Articles", True, f"Retrieved {len(trending_articles)} trending articles")
                    else:
                        self.log_test("Trending Articles", False, f"HTTP {response.status_code}")
                    
                    return articles
                else:
                    self.log_test("Articles Listing", False, f"Expected list, got: {type(articles)}")
                    return None
            else:
                self.log_test("Articles Listing", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Articles Listing", False, f"Articles error: {str(e)}")
            return None
    
    def test_single_article(self, articles: list):
        """Test single article retrieval"""
        if not articles:
            self.log_test("Single Article", False, "No articles available for testing")
            return
            
        try:
            article_id = articles[0].get("id")
            if not article_id:
                self.log_test("Single Article", False, "No article ID found")
                return
                
            response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
            if response.status_code == 200:
                article = response.json()
                if article.get("id") == article_id:
                    self.log_test("Single Article", True, f"Retrieved article: {article.get('title', 'Unknown')}")
                else:
                    self.log_test("Single Article", False, "Article ID mismatch")
            else:
                self.log_test("Single Article", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Single Article", False, f"Single article error: {str(e)}")
    
    def test_categories_endpoint(self):
        """Test categories listing endpoint - Updated for GQ-style 9 categories"""
        try:
            response = self.session.get(f"{self.base_url}/api/categories", timeout=10)
            if response.status_code == 200:
                categories = response.json()
                if isinstance(categories, list):
                    # Check for expected 9 GQ-style categories
                    expected_categories = ["Fashion", "Business", "Technology", "Finance", "Travel", "Health", "Culture", "Art", "Entertainment"]
                    category_names = [cat.get("name", "") for cat in categories]
                    
                    if len(categories) == 9:
                        self.log_test("Categories Count", True, f"Retrieved expected 9 categories")
                    else:
                        self.log_test("Categories Count", False, f"Expected 9 categories, got {len(categories)}")
                    
                    # Check if all expected categories are present
                    missing_categories = [cat for cat in expected_categories if cat not in category_names]
                    if not missing_categories:
                        self.log_test("GQ Categories Structure", True, "All 9 GQ-style categories present: " + ", ".join(category_names))
                    else:
                        self.log_test("GQ Categories Structure", False, f"Missing categories: {missing_categories}. Found: {category_names}")
                    
                    self.log_test("Categories Listing", True, f"Retrieved {len(categories)} categories")
                    return categories
                else:
                    self.log_test("Categories Listing", False, f"Expected list, got: {type(categories)}")
                    return None
            else:
                self.log_test("Categories Listing", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Categories Listing", False, f"Categories error: {str(e)}")
            return None
    
    def test_reviews_endpoint(self):
        """Test reviews listing endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/reviews", timeout=10)
            if response.status_code == 200:
                reviews = response.json()
                if isinstance(reviews, list):
                    self.log_test("Reviews Listing", True, f"Retrieved {len(reviews)} reviews")
                    return reviews
                else:
                    self.log_test("Reviews Listing", False, f"Expected list, got: {type(reviews)}")
                    return None
            else:
                self.log_test("Reviews Listing", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Reviews Listing", False, f"Reviews error: {str(e)}")
            return None
    
    def test_magazine_issues_endpoint(self):
        """Test magazine issues listing endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/issues", timeout=10)
            if response.status_code == 200:
                issues = response.json()
                if isinstance(issues, list):
                    self.log_test("Magazine Issues", True, f"Retrieved {len(issues)} magazine issues")
                    return issues
                else:
                    self.log_test("Magazine Issues", False, f"Expected list, got: {type(issues)}")
                    return None
            else:
                self.log_test("Magazine Issues", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Magazine Issues", False, f"Magazine issues error: {str(e)}")
            return None
    
    def test_destinations_endpoint(self):
        """Test travel destinations listing endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/destinations", timeout=10)
            if response.status_code == 200:
                destinations = response.json()
                if isinstance(destinations, list):
                    self.log_test("Travel Destinations", True, f"Retrieved {len(destinations)} destinations")
                    return destinations
                else:
                    self.log_test("Travel Destinations", False, f"Expected list, got: {type(destinations)}")
                    return None
            else:
                self.log_test("Travel Destinations", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Travel Destinations", False, f"Destinations error: {str(e)}")
            return None
    
    def test_protected_endpoint(self):
        """Test protected endpoint (article creation)"""
        if not self.auth_token:
            self.log_test("Protected Endpoint", False, "No authentication token available")
            return
            
        test_article = {
            "title": "Test Article for API Testing",
            "dek": "This is a test article created during API testing",
            "body": "This is the body content of the test article. It contains enough text to calculate reading time properly.",
            "category": "tech",
            "tags": ["test", "api", "backend"],
            "is_premium": False,
            "is_featured": False,
            "is_trending": False,
            "is_sponsored": False
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/articles",
                json=test_article,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                article = response.json()
                if article.get("title") == test_article["title"]:
                    self.log_test("Protected Endpoint", True, "Article created successfully with authentication")
                else:
                    self.log_test("Protected Endpoint", False, f"Article creation response invalid: {article}")
            else:
                self.log_test("Protected Endpoint", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Protected Endpoint", False, f"Protected endpoint error: {str(e)}")
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Test preflight request
            response = self.session.options(
                f"{self.base_url}/api/health",
                headers={
                    "Origin": "http://localhost:3000",
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Content-Type"
                },
                timeout=10
            )
            
            if response.status_code in [200, 204]:
                cors_headers = response.headers
                if "Access-Control-Allow-Origin" in cors_headers:
                    self.log_test("CORS Configuration", True, "CORS headers present and configured")
                else:
                    self.log_test("CORS Configuration", False, "CORS headers missing")
            else:
                self.log_test("CORS Configuration", False, f"CORS preflight failed: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("CORS Configuration", False, f"CORS test error: {str(e)}")
    
    def test_payment_packages(self):
        """Test Stripe payment packages endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/payments/packages", timeout=10)
            if response.status_code == 200:
                packages = response.json()
                if isinstance(packages, dict):
                    # Check for expected packages
                    expected_packages = ["premium_monthly", "premium_annual"]
                    missing_packages = [pkg for pkg in expected_packages if pkg not in packages]
                    
                    if not missing_packages:
                        # Check pricing
                        monthly = packages.get("premium_monthly", {})
                        annual = packages.get("premium_annual", {})
                        
                        monthly_price = monthly.get("amount")
                        annual_price = annual.get("amount")
                        
                        if monthly_price == 499.0 and annual_price == 4999.0:
                            self.log_test("Payment Packages", True, f"Correct INR pricing: Monthly ₹{monthly_price}, Annual ₹{annual_price}")
                        else:
                            self.log_test("Payment Packages", False, f"Incorrect pricing: Monthly ₹{monthly_price}, Annual ₹{annual_price}")
                        
                        # Check currency
                        if monthly.get("currency") == "inr" and annual.get("currency") == "inr":
                            self.log_test("Payment Currency", True, "Currency set to INR for both packages")
                        else:
                            self.log_test("Payment Currency", False, f"Currency issue: Monthly {monthly.get('currency')}, Annual {annual.get('currency')}")
                    else:
                        self.log_test("Payment Packages", False, f"Missing packages: {missing_packages}")
                    
                    return packages
                else:
                    self.log_test("Payment Packages", False, f"Expected dict, got: {type(packages)}")
                    return None
            else:
                self.log_test("Payment Packages", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Payment Packages", False, f"Payment packages error: {str(e)}")
            return None
    
    def test_payment_checkout_creation(self):
        """Test Stripe checkout session creation"""
        try:
            checkout_data = {
                "package_id": "premium_monthly",
                "origin_url": "https://urbane-nexus.preview.emergentagent.com"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/payments/create-checkout",
                json=checkout_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("checkout_url") and data.get("session_id"):
                    self.log_test("Payment Checkout Creation", True, f"Checkout session created with ID: {data.get('session_id')}")
                    return data
                else:
                    self.log_test("Payment Checkout Creation", False, f"Invalid checkout response: {data}")
                    return None
            else:
                self.log_test("Payment Checkout Creation", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Payment Checkout Creation", False, f"Checkout creation error: {str(e)}")
            return None
    
    def test_articles_with_new_categories(self):
        """Test articles endpoint with new GQ-style categories"""
        try:
            # Test with new category names
            new_categories = ["fashion", "business", "technology", "finance", "travel", "health", "culture", "art", "entertainment"]
            
            for category in new_categories:
                response = self.session.get(f"{self.base_url}/api/articles?category={category}&limit=5", timeout=10)
                if response.status_code == 200:
                    articles = response.json()
                    if isinstance(articles, list):
                        self.log_test(f"Articles - {category.title()} Category", True, f"Retrieved {len(articles)} {category} articles")
                    else:
                        self.log_test(f"Articles - {category.title()} Category", False, f"Invalid response type for {category}")
                else:
                    self.log_test(f"Articles - {category.title()} Category", False, f"HTTP {response.status_code} for {category}")
            
            return True
        except Exception as e:
            self.log_test("Articles New Categories", False, f"New categories test error: {str(e)}")
            return False
    
    def run_comprehensive_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Just Urbane API Comprehensive Testing")
        print("=" * 60)
        
        # 1. Health Check
        if not self.test_health_check():
            print("❌ API is not healthy. Stopping tests.")
            return self.generate_report()
        
        # 2. Authentication Tests
        user_credentials = self.test_user_registration()
        if user_credentials:
            self.test_user_login(user_credentials)
        
        # 3. Content API Tests
        articles = self.test_articles_endpoint()
        if articles:
            self.test_single_article(articles)
        
        categories = self.test_categories_endpoint()
        reviews = self.test_reviews_endpoint()
        issues = self.test_magazine_issues_endpoint()
        destinations = self.test_destinations_endpoint()
        
        # 4. Protected Endpoint Test
        self.test_protected_endpoint()
        
        # 5. CORS Configuration Test
        self.test_cors_configuration()
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
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
    # Use the backend URL from environment
    tester = JustUrbaneAPITester("http://localhost:8001")
    report = tester.run_comprehensive_tests()
    
    # Save detailed report
    with open("/app/backend_test_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: /app/backend_test_report.json")
    
    return report["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)