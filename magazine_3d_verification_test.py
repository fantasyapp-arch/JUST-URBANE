#!/usr/bin/env python3
"""
3D Magazine Functionality Verification Test
Quick verification test for enhanced 3D magazine functionality as requested in review
"""

import requests
import json
import time
from datetime import datetime

class Magazine3DVerificationTester:
    def __init__(self, base_url: str = "https://urbane-admin-fix-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
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
        
    def test_magazine_reader_backend_apis(self):
        """Test 1: Magazine Reader Backend - Verify APIs support 3D flip book reader"""
        print("\n📖 Testing Magazine Reader Backend APIs")
        print("-" * 50)
        
        try:
            # Test Articles API with magazine-specific requirements
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=10)
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                articles = response.json()
                if articles:
                    # Check for 3D magazine reader required fields
                    required_fields = ["id", "title", "body", "hero_image", "author_name", "category", "published_at", "is_premium"]
                    
                    field_coverage = {}
                    for field in required_fields:
                        field_coverage[field] = sum(1 for article in articles if field in article and article[field] is not None)
                    
                    # Check if most articles have required fields (allowing for some missing hero_images)
                    critical_fields = ["id", "title", "body", "author_name", "category", "published_at", "is_premium"]
                    critical_coverage = all(field_coverage.get(field, 0) >= len(articles) * 0.9 for field in critical_fields)
                    
                    if critical_coverage:
                        self.log_test("Magazine Reader API Support", True, f"APIs support 3D flip book reader - {len(articles)} articles with required fields (response time: {response_time:.2f}s)")
                    else:
                        missing_info = [f"{field}: {field_coverage.get(field, 0)}/{len(articles)}" for field in critical_fields if field_coverage.get(field, 0) < len(articles) * 0.9]
                        self.log_test("Magazine Reader API Support", False, f"Missing critical field coverage: {', '.join(missing_info)}")
                    
                    return articles, response_time
                else:
                    self.log_test("Magazine Reader API Support", False, "No articles found")
                    return None, response_time
            else:
                self.log_test("Magazine Reader API Support", False, f"API failed: HTTP {response.status_code}")
                return None, 0
        except Exception as e:
            self.log_test("Magazine Reader API Support", False, f"Error: {str(e)}")
            return None, 0
    
    def test_content_delivery_structure(self, articles):
        """Test 2: Content Delivery - Ensure magazine content is properly structured for 3D display"""
        print("\n📄 Testing Content Delivery Structure")
        print("-" * 50)
        
        try:
            if not articles:
                self.log_test("Content Delivery Structure", False, "No articles to test")
                return
            
            # Test content structure for 3D magazine display
            properly_structured = 0
            total_tested = min(10, len(articles))
            
            for i, article in enumerate(articles[:total_tested]):
                title = article.get("title", "")
                body = article.get("body", "")
                author = article.get("author_name", "")
                category = article.get("category", "")
                published_at = article.get("published_at", "")
                
                # Check if content is properly structured for magazine display
                has_title = len(title) > 0
                has_content = len(body) > 100  # Minimum content for magazine page
                has_author = len(author) > 0
                has_category = len(category) > 0
                has_date = len(published_at) > 0
                
                if has_title and has_content and has_author and has_category and has_date:
                    properly_structured += 1
            
            structure_percentage = (properly_structured / total_tested) * 100
            
            if structure_percentage >= 80:
                self.log_test("Content Delivery Structure", True, f"{properly_structured}/{total_tested} articles properly structured for 3D display ({structure_percentage:.1f}%)")
            else:
                self.log_test("Content Delivery Structure", False, f"Only {properly_structured}/{total_tested} articles properly structured ({structure_percentage:.1f}%)")
                
        except Exception as e:
            self.log_test("Content Delivery Structure", False, f"Error: {str(e)}")
    
    def test_premium_gating_3_page_limit(self):
        """Test 3: Premium Gating - Confirm 3-page free preview limit is enforced"""
        print("\n🔒 Testing Premium Gating (3-Page Free Preview)")
        print("-" * 50)
        
        try:
            # Get premium articles
            response = self.session.get(f"{self.base_url}/api/articles?content_type=premium&limit=5", timeout=10)
            if response.status_code == 200:
                premium_articles = response.json()
                if premium_articles:
                    # Test premium article access without authentication
                    test_article = premium_articles[0]
                    article_id = test_article.get("id")
                    
                    # Create unauthenticated session
                    unauth_session = requests.Session()
                    response = unauth_session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    
                    if response.status_code == 200:
                        article_data = response.json()
                        body_content = article_data.get("body", "")
                        is_locked = article_data.get("is_locked", False)
                        
                        # Check if content is limited (approximately 3 pages worth)
                        # Assuming ~500 characters per page, 3 pages = ~1500 characters max
                        content_limited = len(body_content) <= 1500
                        has_premium_marker = "[Premium content continues...]" in body_content
                        
                        if content_limited or has_premium_marker or is_locked:
                            preview_pages = len(body_content) / 500  # Estimate pages
                            self.log_test("3-Page Free Preview Limit", True, f"Premium gating enforced - preview limited to ~{preview_pages:.1f} pages ({len(body_content)} chars, locked: {is_locked})")
                        else:
                            self.log_test("3-Page Free Preview Limit", False, f"Premium content not properly gated - full access without subscription ({len(body_content)} chars)")
                    else:
                        self.log_test("3-Page Free Preview Limit", False, f"Failed to test premium article: HTTP {response.status_code}")
                else:
                    self.log_test("3-Page Free Preview Limit", False, "No premium articles found for testing")
            else:
                self.log_test("3-Page Free Preview Limit", False, f"Failed to get premium articles: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("3-Page Free Preview Limit", False, f"Error: {str(e)}")
    
    def test_user_authentication_jwt(self):
        """Test 4: User Authentication - Test JWT system for subscription access"""
        print("\n🔐 Testing User Authentication (JWT System)")
        print("-" * 50)
        
        try:
            # Test user registration
            test_user = {
                "name": "3D Magazine Test User",
                "email": f"magazine3d_{int(time.time())}@justurbane.com",
                "password": "magazine3d123"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json=test_user,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
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
                    login_result = response.json()
                    if login_result.get("access_token") and login_result.get("token_type") == "bearer":
                        self.log_test("JWT Authentication System", True, "JWT system working for subscription access - token generated successfully")
                        
                        # Test protected endpoint access
                        auth_token = login_result["access_token"]
                        auth_session = requests.Session()
                        auth_session.headers.update({"Authorization": f"Bearer {auth_token}"})
                        
                        # Test premium articles endpoint (requires authentication)
                        response = auth_session.get(f"{self.base_url}/api/premium-articles?limit=1", timeout=10)
                        if response.status_code in [200, 403]:  # 403 is expected if user doesn't have premium subscription
                            self.log_test("JWT Protected Endpoints", True, f"JWT authentication working for protected endpoints (HTTP {response.status_code})")
                        else:
                            self.log_test("JWT Protected Endpoints", False, f"JWT authentication issue: HTTP {response.status_code}")
                    else:
                        self.log_test("JWT Authentication System", False, "Invalid JWT token response")
                else:
                    self.log_test("JWT Authentication System", False, f"Login failed: HTTP {response.status_code}")
            else:
                self.log_test("JWT Authentication System", False, f"Registration failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("JWT Authentication System", False, f"Error: {str(e)}")
    
    def test_api_performance(self, baseline_response_time):
        """Test 5: Performance - Check API response times for magazine content"""
        print("\n⚡ Testing API Performance")
        print("-" * 50)
        
        try:
            # Test multiple API endpoints for performance
            performance_tests = [
                ("/api/articles?limit=20", "Articles Loading"),
                ("/api/categories", "Categories Loading"),
                ("/api/issues", "Magazine Issues Loading"),
                ("/api/payments/packages", "Payment Packages Loading")
            ]
            
            total_response_time = 0
            fast_responses = 0
            
            for endpoint, test_name in performance_tests:
                start_time = time.time()
                response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                response_time = time.time() - start_time
                total_response_time += response_time
                
                if response.status_code == 200:
                    if response_time < 2.0:  # Fast response (under 2 seconds)
                        fast_responses += 1
                        self.log_test(f"Performance - {test_name}", True, f"Fast response time: {response_time:.2f}s")
                    elif response_time < 5.0:  # Acceptable response (under 5 seconds)
                        self.log_test(f"Performance - {test_name}", True, f"Acceptable response time: {response_time:.2f}s")
                    else:  # Slow response
                        self.log_test(f"Performance - {test_name}", False, f"Slow response time: {response_time:.2f}s")
                else:
                    self.log_test(f"Performance - {test_name}", False, f"API error: HTTP {response.status_code}")
            
            avg_response_time = total_response_time / len(performance_tests)
            
            if avg_response_time < 2.0:
                self.log_test("Overall API Performance", True, f"Excellent performance - average response time: {avg_response_time:.2f}s")
            elif avg_response_time < 3.0:
                self.log_test("Overall API Performance", True, f"Good performance - average response time: {avg_response_time:.2f}s")
            else:
                self.log_test("Overall API Performance", False, f"Performance needs improvement - average response time: {avg_response_time:.2f}s")
                
        except Exception as e:
            self.log_test("API Performance", False, f"Error: {str(e)}")
    
    def run_3d_magazine_verification(self):
        """Run all 3D magazine verification tests"""
        print("🎯 3D MAGAZINE FUNCTIONALITY VERIFICATION TEST")
        print("=" * 60)
        print("Testing 5 key areas for enhanced 3D magazine functionality:")
        print("1. Magazine Reader Backend APIs")
        print("2. Content Delivery Structure")
        print("3. Premium Gating (3-page limit)")
        print("4. User Authentication (JWT)")
        print("5. API Performance")
        print("=" * 60)
        
        # Test 1: Magazine Reader Backend
        articles, response_time = self.test_magazine_reader_backend_apis()
        
        # Test 2: Content Delivery Structure
        self.test_content_delivery_structure(articles)
        
        # Test 3: Premium Gating
        self.test_premium_gating_3_page_limit()
        
        # Test 4: User Authentication
        self.test_user_authentication_jwt()
        
        # Test 5: Performance
        self.test_api_performance(response_time)
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 60)
        print("📊 3D MAGAZINE VERIFICATION RESULTS")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Categorize results by test area
        test_areas = {
            "Magazine Reader Backend": ["Magazine Reader API Support"],
            "Content Delivery": ["Content Delivery Structure"],
            "Premium Gating": ["3-Page Free Preview Limit"],
            "Authentication": ["JWT Authentication System", "JWT Protected Endpoints"],
            "Performance": ["Performance", "Overall API Performance"]
        }
        
        print("\n📋 RESULTS BY TEST AREA:")
        for area, test_names in test_areas.items():
            area_tests = [r for r in self.test_results if any(name in r["test"] for name in test_names)]
            if area_tests:
                area_passed = sum(1 for t in area_tests if t["success"])
                area_total = len(area_tests)
                status = "✅" if area_passed == area_total else "⚠️" if area_passed > 0 else "❌"
                print(f"  {status} {area}: {area_passed}/{area_total} tests passed")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n🎯 CONCLUSION:")
        if passed_tests >= total_tests * 0.9:
            print("✅ 3D Magazine functionality is working correctly - ready for production")
        elif passed_tests >= total_tests * 0.8:
            print("⚠️ 3D Magazine functionality mostly working - minor issues to address")
        else:
            print("❌ 3D Magazine functionality has significant issues - requires attention")
        
        print("=" * 60)
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

def main():
    """Main testing function"""
    tester = Magazine3DVerificationTester()
    report = tester.run_3d_magazine_verification()
    
    # Save report
    with open("/app/magazine_3d_verification_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: /app/magazine_3d_verification_report.json")
    
    return report["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)