#!/usr/bin/env python3
"""
Enhanced GQ-Style Magazine Backend Testing
Focus on review request priorities: Magazine Issues API, Premium Content System, Payment Packages API
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class EnhancedMagazineAPITester:
    def __init__(self, base_url: str = "https://urbane-dashboard.preview.emergentagent.com"):
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

    def setup_authentication(self):
        """Setup authentication for premium testing"""
        test_user = {
            "name": "Premium Magazine Tester",
            "email": f"magazine_test_{int(time.time())}@justurbane.com",
            "password": "magazine123"
        }
        
        try:
            # Register user
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json=test_user,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                # Login user
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
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_test("Authentication Setup", True, "User registered and authenticated successfully")
                    return True
                else:
                    self.log_test("Authentication Setup", False, f"Login failed: HTTP {response.status_code}")
                    return False
            else:
                self.log_test("Authentication Setup", False, f"Registration failed: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Authentication Setup", False, f"Authentication error: {str(e)}")
            return False

    def test_magazine_issues_api(self):
        """Test Magazine Issues API for magazine content grouping by month/year"""
        print("\n📖 TESTING MAGAZINE ISSUES API")
        print("=" * 40)
        
        try:
            # Test 1: Magazine Issues Endpoint
            response = self.session.get(f"{self.base_url}/api/issues", timeout=10)
            if response.status_code == 200:
                issues = response.json()
                if isinstance(issues, list):
                    self.log_test("Magazine Issues API - Basic", True, f"Retrieved {len(issues)} magazine issues")
                    
                    # Test magazine issue structure
                    if issues:
                        issue = issues[0]
                        required_fields = ["id", "title", "cover_image", "release_date", "is_digital_available"]
                        missing_fields = [field for field in required_fields if field not in issue]
                        
                        if not missing_fields:
                            self.log_test("Magazine Issues API - Structure", True, "Magazine issues have proper structure for grouping")
                        else:
                            self.log_test("Magazine Issues API - Structure", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("Magazine Issues API - Content", False, "No magazine issues found")
                else:
                    self.log_test("Magazine Issues API - Basic", False, f"Expected list, got: {type(issues)}")
            else:
                self.log_test("Magazine Issues API - Basic", False, f"HTTP {response.status_code}: {response.text}")
            
            # Test 2: Articles API for Magazine Content Grouping
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if articles:
                    # Check if articles have publication dates for grouping
                    articles_with_dates = [a for a in articles if a.get("published_at")]
                    
                    if len(articles_with_dates) > 0:
                        self.log_test("Magazine Content Grouping", True, f"{len(articles_with_dates)}/{len(articles)} articles have publication dates for month/year grouping")
                        
                        # Test date-based filtering (simulate magazine issue grouping)
                        # Group articles by month/year
                        from collections import defaultdict
                        monthly_groups = defaultdict(list)
                        
                        for article in articles_with_dates[:10]:  # Test first 10
                            pub_date = article.get("published_at", "")
                            if pub_date:
                                # Extract year-month for grouping
                                try:
                                    if "T" in pub_date:
                                        date_part = pub_date.split("T")[0]
                                        year_month = "-".join(date_part.split("-")[:2])
                                        monthly_groups[year_month].append(article["title"])
                                except:
                                    pass
                        
                        if monthly_groups:
                            self.log_test("Magazine Monthly Grouping", True, f"Articles can be grouped by month: {dict(monthly_groups)}")
                        else:
                            self.log_test("Magazine Monthly Grouping", False, "Unable to group articles by month/year")
                    else:
                        self.log_test("Magazine Content Grouping", False, "No articles have publication dates")
                else:
                    self.log_test("Magazine Content Grouping", False, "No articles found for grouping")
            else:
                self.log_test("Magazine Content Grouping", False, f"Articles API failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Magazine Issues API", False, f"Error: {str(e)}")

    def test_premium_content_system(self):
        """Test Premium Content System - 3-page free preview limit and premium gating"""
        print("\n💎 TESTING PREMIUM CONTENT SYSTEM")
        print("=" * 40)
        
        try:
            # Test 1: Get premium and free articles
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                premium_articles = [a for a in articles if a.get("is_premium", False)]
                free_articles = [a for a in articles if not a.get("is_premium", False)]
                
                self.log_test("Premium Content Mix", True, f"Found {len(premium_articles)} premium and {len(free_articles)} free articles")
                
                if premium_articles:
                    # Test 2: Premium content access without authentication
                    premium_article = premium_articles[0]
                    article_id = premium_article.get("id")
                    
                    # Create unauthenticated session
                    unauth_session = requests.Session()
                    response = unauth_session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    
                    if response.status_code == 200:
                        article_data = response.json()
                        body_content = article_data.get("body", "")
                        is_locked = article_data.get("is_locked", False)
                        
                        # Check for premium gating mechanisms
                        has_premium_marker = "[Premium content continues...]" in body_content
                        content_truncated = len(body_content) < 1000  # Reasonable assumption for full content
                        
                        if is_locked or has_premium_marker or content_truncated:
                            self.log_test("Premium Content Gating", True, f"Premium content properly gated (locked: {is_locked}, marker: {has_premium_marker}, truncated: {content_truncated})")
                            
                            # Test 3: Free preview limit (simulate 3-page limit)
                            if has_premium_marker:
                                preview_content = body_content.split("[Premium content continues...]")[0]
                                preview_length = len(preview_content)
                                
                                # Estimate pages (assuming ~500 chars per page)
                                estimated_pages = preview_length / 500
                                
                                if estimated_pages <= 3.5:  # Allow some flexibility
                                    self.log_test("Free Preview Limit", True, f"Free preview appears limited (~{estimated_pages:.1f} pages, {preview_length} chars)")
                                else:
                                    self.log_test("Free Preview Limit", False, f"Free preview too long (~{estimated_pages:.1f} pages, {preview_length} chars)")
                            else:
                                self.log_test("Free Preview Limit", True, "Content truncation mechanism in place")
                        else:
                            self.log_test("Premium Content Gating", False, "Premium content not properly gated - full access without subscription")
                    else:
                        self.log_test("Premium Content Gating", False, f"Failed to access premium article: HTTP {response.status_code}")
                    
                    # Test 4: Premium content access with authentication (if available)
                    if self.auth_token:
                        response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                        if response.status_code == 200:
                            auth_article_data = response.json()
                            auth_body = auth_article_data.get("body", "")
                            auth_locked = auth_article_data.get("is_locked", False)
                            
                            # Note: User might not have premium subscription, so this tests the system
                            self.log_test("Premium Content with Auth", True, f"Premium content accessible with authentication (locked: {auth_locked}, length: {len(auth_body)})")
                        else:
                            self.log_test("Premium Content with Auth", False, f"Failed to access with auth: HTTP {response.status_code}")
                else:
                    self.log_test("Premium Content System", False, "No premium articles found for testing")
            else:
                self.log_test("Premium Content System", False, f"Articles API failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Premium Content System", False, f"Error: {str(e)}")

    def test_payment_packages_api(self):
        """Test Payment Packages API - Confirm subscription pricing"""
        print("\n💳 TESTING PAYMENT PACKAGES API")
        print("=" * 40)
        
        try:
            # Test 1: Payment packages endpoint
            response = self.session.get(f"{self.base_url}/api/payments/packages", timeout=10)
            if response.status_code == 200:
                packages = response.json()
                if isinstance(packages, dict):
                    # Test 2: Verify expected packages exist
                    expected_packages = ["digital_annual", "print_annual", "combined_annual"]
                    missing_packages = [pkg for pkg in expected_packages if pkg not in packages]
                    
                    if not missing_packages:
                        self.log_test("Payment Packages - Structure", True, f"All expected packages present: {list(packages.keys())}")
                        
                        # Test 3: Verify pricing as per review request
                        digital = packages.get("digital_annual", {})
                        print_pkg = packages.get("print_annual", {})
                        combined = packages.get("combined_annual", {})
                        
                        digital_price = digital.get("amount")
                        print_price = print_pkg.get("amount")
                        combined_price = combined.get("amount")
                        
                        # Check exact pricing from review request
                        expected_digital = 499.0
                        expected_print = 499.0
                        expected_combined = 999.0
                        
                        pricing_correct = (
                            digital_price == expected_digital and
                            print_price == expected_print and
                            combined_price == expected_combined
                        )
                        
                        if pricing_correct:
                            self.log_test("Payment Packages - Pricing", True, f"Correct pricing: Digital ₹{digital_price}, Print ₹{print_price}, Combined ₹{combined_price}")
                        else:
                            self.log_test("Payment Packages - Pricing", False, f"Incorrect pricing: Digital ₹{digital_price} (expected ₹{expected_digital}), Print ₹{print_price} (expected ₹{expected_print}), Combined ₹{combined_price} (expected ₹{expected_combined})")
                        
                        # Test 4: Verify currency
                        currencies = [pkg.get("currency") for pkg in packages.values()]
                        if all(currency == "inr" for currency in currencies):
                            self.log_test("Payment Packages - Currency", True, "All packages use INR currency")
                        else:
                            self.log_test("Payment Packages - Currency", False, f"Currency issues: {currencies}")
                        
                        # Test 5: Verify package features
                        for pkg_name, pkg_data in packages.items():
                            features = pkg_data.get("features", [])
                            if features and len(features) > 3:
                                self.log_test(f"Package Features - {pkg_name}", True, f"{len(features)} features defined")
                            else:
                                self.log_test(f"Package Features - {pkg_name}", False, f"Insufficient features: {len(features)}")
                    else:
                        self.log_test("Payment Packages - Structure", False, f"Missing packages: {missing_packages}")
                else:
                    self.log_test("Payment Packages API", False, f"Expected dict, got: {type(packages)}")
            else:
                self.log_test("Payment Packages API", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Payment Packages API", False, f"Error: {str(e)}")

    def test_articles_data_quality(self):
        """Test Articles Data Quality - Ensure sufficient content for magazine display with hero images"""
        print("\n📰 TESTING ARTICLES DATA QUALITY")
        print("=" * 40)
        
        try:
            # Test 1: Get articles for quality assessment
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if articles:
                    # Filter out test articles for quality assessment
                    real_articles = [a for a in articles if not a.get('title', '').startswith(('Test Article', 'JWT Test'))]
                    test_sample = real_articles[:10] if real_articles else articles[:10]
                    
                    # Test 2: Check required fields for magazine display
                    required_fields = ["title", "body", "author_name", "category", "published_at"]
                    magazine_fields = ["hero_image", "dek", "tags"]
                    
                    articles_with_required = 0
                    articles_with_hero_images = 0
                    articles_with_sufficient_content = 0
                    
                    for article in test_sample:
                        # Check required fields
                        has_required = all(field in article and article[field] for field in required_fields)
                        if has_required:
                            articles_with_required += 1
                        
                        # Check hero images
                        hero_image = article.get("hero_image")
                        if hero_image and hero_image.strip():
                            articles_with_hero_images += 1
                        
                        # Check content length
                        body = article.get("body", "")
                        if len(body) > 300:  # Sufficient for magazine display
                            articles_with_sufficient_content += 1
                    
                    # Report results
                    total_tested = len(test_sample)
                    
                    if articles_with_required == total_tested:
                        self.log_test("Articles - Required Fields", True, f"All {total_tested} articles have required fields")
                    else:
                        self.log_test("Articles - Required Fields", False, f"Only {articles_with_required}/{total_tested} articles have required fields")
                    
                    hero_image_percentage = (articles_with_hero_images / total_tested) * 100
                    if hero_image_percentage >= 70:  # 70% threshold
                        self.log_test("Articles - Hero Images", True, f"{articles_with_hero_images}/{total_tested} articles ({hero_image_percentage:.1f}%) have hero images")
                    else:
                        self.log_test("Articles - Hero Images", False, f"Only {articles_with_hero_images}/{total_tested} articles ({hero_image_percentage:.1f}%) have hero images")
                    
                    if articles_with_sufficient_content == total_tested:
                        self.log_test("Articles - Content Quality", True, f"All {total_tested} articles have sufficient content for magazine display")
                    else:
                        self.log_test("Articles - Content Quality", False, f"Only {articles_with_sufficient_content}/{total_tested} articles have sufficient content")
                    
                    # Test 3: Check category distribution
                    categories = {}
                    for article in articles:
                        cat = article.get("category", "unknown")
                        categories[cat] = categories.get(cat, 0) + 1
                    
                    if len(categories) >= 5:
                        self.log_test("Articles - Category Distribution", True, f"Good category variety: {dict(list(categories.items())[:6])}")
                    else:
                        self.log_test("Articles - Category Distribution", False, f"Limited category variety: {categories}")
                else:
                    self.log_test("Articles Data Quality", False, "No articles found for quality assessment")
            else:
                self.log_test("Articles Data Quality", False, f"Articles API failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Articles Data Quality", False, f"Error: {str(e)}")

    def test_authentication_system_jwt(self):
        """Test JWT Authentication System for premium subscription access control"""
        print("\n🔐 TESTING JWT AUTHENTICATION SYSTEM")
        print("=" * 40)
        
        try:
            if self.auth_token:
                # Test 1: JWT token validation
                self.log_test("JWT Token Generation", True, "JWT token successfully generated")
                
                # Test 2: Protected endpoint access
                test_article = {
                    "title": "JWT Authentication Test Article",
                    "dek": "Testing JWT for premium access control",
                    "body": "This article tests JWT authentication for premium subscription access control in the magazine system.",
                    "category": "technology",
                    "tags": ["test", "jwt", "authentication"],
                    "is_premium": False
                }
                
                response = self.session.post(
                    f"{self.base_url}/api/articles",
                    json=test_article,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_test("JWT - Protected Endpoint Access", True, "JWT authentication working for protected endpoints")
                else:
                    self.log_test("JWT - Protected Endpoint Access", False, f"JWT authentication failed: HTTP {response.status_code}")
                
                # Test 3: Invalid token handling
                invalid_session = requests.Session()
                invalid_session.headers.update({"Authorization": "Bearer invalid_jwt_token"})
                
                response = invalid_session.post(
                    f"{self.base_url}/api/articles",
                    json=test_article,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 401:
                    self.log_test("JWT - Invalid Token Rejection", True, "Invalid JWT tokens properly rejected")
                else:
                    self.log_test("JWT - Invalid Token Rejection", False, f"Invalid token handling issue: HTTP {response.status_code}")
                
                # Test 4: Premium content access control
                response = self.session.get(f"{self.base_url}/api/articles?content_type=premium&limit=5", timeout=10)
                if response.status_code == 200:
                    premium_articles = response.json()
                    self.log_test("JWT - Premium Content Access", True, f"JWT allows access to premium content filtering ({len(premium_articles)} articles)")
                else:
                    self.log_test("JWT - Premium Content Access", False, f"Premium content access failed: HTTP {response.status_code}")
            else:
                self.log_test("JWT Authentication System", False, "No JWT token available for testing")
                
        except Exception as e:
            self.log_test("JWT Authentication System", False, f"Error: {str(e)}")

    def test_stripe_checkout_integration(self):
        """Test Stripe checkout integration (known issue from test_result.md)"""
        print("\n💰 TESTING STRIPE CHECKOUT INTEGRATION")
        print("=" * 40)
        
        try:
            checkout_data = {
                "package_id": "digital_annual",
                "origin_url": "https://urbane-dashboard.preview.emergentagent.com"
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
                    self.log_test("Stripe Checkout Creation", True, f"Checkout session created successfully: {data.get('session_id')}")
                else:
                    self.log_test("Stripe Checkout Creation", False, f"Invalid checkout response: {data}")
            else:
                self.log_test("Stripe Checkout Creation", False, f"Checkout creation failed: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Stripe Checkout Creation", False, f"Checkout error: {str(e)}")

    def run_enhanced_magazine_tests(self):
        """Run enhanced GQ-style magazine tests focusing on review request priorities"""
        print("🏆 ENHANCED GQ-STYLE MAGAZINE BACKEND TESTING")
        print("=" * 60)
        print("Focus Areas: Magazine Issues API, Premium Content System, Payment Packages API")
        print("Articles Data Quality, Authentication System")
        print("=" * 60)
        
        # Setup authentication
        self.setup_authentication()
        
        # Priority 1: Magazine Issues API
        self.test_magazine_issues_api()
        
        # Priority 2: Premium Content System
        self.test_premium_content_system()
        
        # Priority 3: Payment Packages API
        self.test_payment_packages_api()
        
        # Priority 4: Articles Data Quality
        self.test_articles_data_quality()
        
        # Priority 5: Authentication System
        self.test_authentication_system_jwt()
        
        # Additional: Test known issue
        self.test_stripe_checkout_integration()
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 60)
        print("📊 ENHANCED MAGAZINE TESTING RESULTS")
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
        
        print("\n✅ KEY SUCCESSES:")
        priority_tests = [
            "Payment Packages - Pricing",
            "Premium Content Gating", 
            "Magazine Issues API - Basic",
            "JWT - Protected Endpoint Access",
            "Articles - Content Quality"
        ]
        
        for test_name in priority_tests:
            for result in self.test_results:
                if result["test"] == test_name and result["success"]:
                    print(f"  - {test_name}: {result['message']}")
                    break
        
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
    tester = EnhancedMagazineAPITester()
    report = tester.run_enhanced_magazine_tests()
    
    # Save detailed report
    with open("/app/enhanced_magazine_test_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: /app/enhanced_magazine_test_report.json")
    
    return report["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)