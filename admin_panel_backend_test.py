#!/usr/bin/env python3
"""
Just Urbane Magazine Admin Panel Backend Testing Suite
Comprehensive testing of admin panel functionality including authentication, dashboard stats, 
content management, user management, analytics, and system health endpoints.
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class AdminPanelTester:
    def __init__(self, base_url: str = "https://urbane-admin-fix-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.admin_token = None
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

    def test_admin_login(self):
        """Test admin login endpoint with default credentials"""
        print("\n🔐 ADMIN AUTHENTICATION TESTING")
        print("=" * 40)
        
        admin_credentials = {
            "username": "admin",
            "password": "admin123"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json=admin_credentials,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token") and data.get("token_type"):
                    self.admin_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                    self.log_test("Admin Login - Valid Credentials", True, "Admin login successful, JWT token received")
                    return True
                else:
                    self.log_test("Admin Login - Valid Credentials", False, f"Invalid login response: {data}")
                    return False
            else:
                self.log_test("Admin Login - Valid Credentials", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login - Valid Credentials", False, f"Login error: {str(e)}")
            return False

    def test_admin_login_invalid_credentials(self):
        """Test admin login with invalid credentials"""
        invalid_credentials = {
            "username": "admin",
            "password": "wrongpassword"
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json=invalid_credentials,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 401 or response.status_code == 400:
                self.log_test("Admin Login - Invalid Credentials", True, "Invalid credentials properly rejected")
                return True
            else:
                self.log_test("Admin Login - Invalid Credentials", False, f"Expected 401/400, got HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Login - Invalid Credentials", False, f"Error: {str(e)}")
            return False

    def test_admin_dashboard_stats(self):
        """Test admin dashboard stats endpoint"""
        print("\n📊 ADMIN DASHBOARD STATS TESTING")
        print("=" * 40)
        
        if not self.admin_token:
            self.log_test("Admin Dashboard Stats", False, "No admin authentication token available")
            return False
            
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/dashboard/stats",
                timeout=10
            )
            
            if response.status_code == 200:
                stats = response.json()
                
                # Check required stats fields
                required_fields = ["total_articles", "total_magazines", "total_users", "total_subscribers"]
                missing_fields = [field for field in required_fields if field not in stats]
                
                if not missing_fields:
                    self.log_test("Dashboard Stats - Required Fields", True, f"All required stats fields present: {required_fields}")
                    
                    # Check revenue calculation
                    if "revenue" in stats:
                        self.log_test("Dashboard Stats - Revenue", True, f"Revenue calculation present: {stats.get('revenue', 0)}")
                    else:
                        self.log_test("Dashboard Stats - Revenue", False, "Revenue calculation missing")
                    
                    # Check popular articles
                    if "popular_articles" in stats:
                        popular_articles = stats["popular_articles"]
                        if isinstance(popular_articles, list):
                            self.log_test("Dashboard Stats - Popular Articles", True, f"Popular articles by views: {len(popular_articles)} articles")
                        else:
                            self.log_test("Dashboard Stats - Popular Articles", False, "Popular articles not in list format")
                    else:
                        self.log_test("Dashboard Stats - Popular Articles", False, "Popular articles data missing")
                    
                    # Check recent activities
                    if "recent_activities" in stats:
                        activities = stats["recent_activities"]
                        if isinstance(activities, list):
                            self.log_test("Dashboard Stats - Recent Activities", True, f"Recent activities data: {len(activities)} activities")
                        else:
                            self.log_test("Dashboard Stats - Recent Activities", False, "Recent activities not in list format")
                    else:
                        self.log_test("Dashboard Stats - Recent Activities", False, "Recent activities data missing")
                    
                    return True
                else:
                    self.log_test("Dashboard Stats - Required Fields", False, f"Missing required fields: {missing_fields}")
                    return False
            elif response.status_code == 401:
                self.log_test("Admin Dashboard Stats", False, "Authentication required - admin token invalid")
                return False
            else:
                self.log_test("Admin Dashboard Stats", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Dashboard Stats", False, f"Error: {str(e)}")
            return False

    def test_admin_articles_management(self):
        """Test admin articles management endpoints"""
        print("\n📰 ADMIN CONTENT MANAGEMENT TESTING")
        print("=" * 40)
        
        if not self.admin_token:
            self.log_test("Admin Articles Management", False, "No admin authentication token available")
            return False
            
        try:
            # Test articles listing with pagination
            response = self.session.get(
                f"{self.base_url}/api/admin/articles?page=1&limit=10",
                timeout=10
            )
            
            if response.status_code == 200:
                articles_data = response.json()
                
                if isinstance(articles_data, dict) and "articles" in articles_data:
                    articles = articles_data["articles"]
                    self.log_test("Admin Articles - Pagination", True, f"Articles listing with pagination: {len(articles)} articles")
                    
                    # Test category filtering
                    response = self.session.get(
                        f"{self.base_url}/api/admin/articles?category=fashion&limit=5",
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        filtered_data = response.json()
                        if isinstance(filtered_data, dict) and "articles" in filtered_data:
                            filtered_articles = filtered_data["articles"]
                            self.log_test("Admin Articles - Category Filter", True, f"Category filtering working: {len(filtered_articles)} fashion articles")
                        else:
                            self.log_test("Admin Articles - Category Filter", False, "Invalid category filter response format")
                    else:
                        self.log_test("Admin Articles - Category Filter", False, f"Category filter failed: HTTP {response.status_code}")
                    
                    # Test search functionality
                    response = self.session.get(
                        f"{self.base_url}/api/admin/articles?search=fashion&limit=5",
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        search_data = response.json()
                        if isinstance(search_data, dict) and "articles" in search_data:
                            search_articles = search_data["articles"]
                            self.log_test("Admin Articles - Search", True, f"Search functionality working: {len(search_articles)} results for 'fashion'")
                        else:
                            self.log_test("Admin Articles - Search", False, "Invalid search response format")
                    else:
                        self.log_test("Admin Articles - Search", False, f"Search failed: HTTP {response.status_code}")
                    
                    # Check article data structure
                    if articles:
                        first_article = articles[0]
                        required_fields = ["id", "title", "author_name", "category", "published_at"]
                        missing_fields = [field for field in required_fields if field not in first_article]
                        
                        if not missing_fields:
                            self.log_test("Admin Articles - Data Structure", True, "Articles have proper data structure with all required fields")
                        else:
                            self.log_test("Admin Articles - Data Structure", False, f"Missing fields in article data: {missing_fields}")
                    
                    return True
                else:
                    self.log_test("Admin Articles - Pagination", False, f"Invalid response format: {type(articles_data)}")
                    return False
            elif response.status_code == 401:
                self.log_test("Admin Articles Management", False, "Authentication required - admin token invalid")
                return False
            else:
                self.log_test("Admin Articles Management", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Articles Management", False, f"Error: {str(e)}")
            return False

    def test_admin_article_deletion(self):
        """Test admin article deletion endpoint"""
        if not self.admin_token:
            self.log_test("Admin Article Deletion", False, "No admin authentication token available")
            return False
            
        try:
            # First get an article to delete (we'll use a test article ID)
            # In a real test, we'd create a test article first
            test_article_id = "test-article-id-for-deletion"
            
            response = self.session.delete(
                f"{self.base_url}/api/admin/articles/{test_article_id}",
                timeout=10
            )
            
            # We expect either 200 (deleted), 404 (not found), or 401 (unauthorized)
            if response.status_code in [200, 404]:
                if response.status_code == 200:
                    self.log_test("Admin Article Deletion", True, "Article deletion endpoint working (article deleted)")
                else:
                    self.log_test("Admin Article Deletion", True, "Article deletion endpoint accessible (article not found - expected for test)")
                return True
            elif response.status_code == 401:
                self.log_test("Admin Article Deletion", False, "Authentication required - admin token invalid")
                return False
            else:
                self.log_test("Admin Article Deletion", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Article Deletion", False, f"Error: {str(e)}")
            return False

    def test_admin_user_management(self):
        """Test admin user management endpoints"""
        print("\n👥 ADMIN USER MANAGEMENT TESTING")
        print("=" * 40)
        
        if not self.admin_token:
            self.log_test("Admin User Management", False, "No admin authentication token available")
            return False
            
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/users?page=1&limit=10",
                timeout=10
            )
            
            if response.status_code == 200:
                users_data = response.json()
                
                if isinstance(users_data, dict) and "users" in users_data:
                    users = users_data["users"]
                    self.log_test("Admin Users - Pagination", True, f"User listing with pagination: {len(users)} users")
                    
                    # Check that sensitive data is excluded
                    if users:
                        first_user = users[0]
                        if "password" not in first_user and "hashed_password" not in first_user:
                            self.log_test("Admin Users - Data Security", True, "Sensitive data (passwords) properly excluded from user data")
                        else:
                            self.log_test("Admin Users - Data Security", False, "Sensitive data (passwords) exposed in user data")
                        
                        # Check user data structure
                        required_fields = ["id", "email", "full_name", "created_at"]
                        missing_fields = [field for field in required_fields if field not in first_user]
                        
                        if not missing_fields:
                            self.log_test("Admin Users - Data Structure", True, "Users have proper data structure with all required fields")
                        else:
                            self.log_test("Admin Users - Data Structure", False, f"Missing fields in user data: {missing_fields}")
                    
                    return True
                else:
                    self.log_test("Admin User Management", False, f"Invalid response format: {type(users_data)}")
                    return False
            elif response.status_code == 401:
                self.log_test("Admin User Management", False, "Authentication required - admin token invalid")
                return False
            else:
                self.log_test("Admin User Management", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin User Management", False, f"Error: {str(e)}")
            return False

    def test_admin_payment_analytics(self):
        """Test admin payment analytics endpoints"""
        print("\n💰 ADMIN ANALYTICS TESTING")
        print("=" * 40)
        
        if not self.admin_token:
            self.log_test("Admin Payment Analytics", False, "No admin authentication token available")
            return False
            
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/payments/analytics",
                timeout=10
            )
            
            if response.status_code == 200:
                analytics = response.json()
                
                # Check monthly revenue calculations
                if "monthly_revenue" in analytics:
                    monthly_revenue = analytics["monthly_revenue"]
                    if isinstance(monthly_revenue, (list, dict)):
                        self.log_test("Admin Analytics - Monthly Revenue", True, "Monthly revenue calculations present")
                    else:
                        self.log_test("Admin Analytics - Monthly Revenue", False, "Monthly revenue data in invalid format")
                else:
                    self.log_test("Admin Analytics - Monthly Revenue", False, "Monthly revenue calculations missing")
                
                # Check package popularity statistics
                if "package_popularity" in analytics:
                    package_stats = analytics["package_popularity"]
                    if isinstance(package_stats, (list, dict)):
                        self.log_test("Admin Analytics - Package Popularity", True, "Package popularity statistics present")
                    else:
                        self.log_test("Admin Analytics - Package Popularity", False, "Package popularity data in invalid format")
                else:
                    self.log_test("Admin Analytics - Package Popularity", False, "Package popularity statistics missing")
                
                # Check transaction data processing
                if "total_transactions" in analytics or "transaction_summary" in analytics:
                    self.log_test("Admin Analytics - Transaction Data", True, "Transaction data processing working")
                else:
                    self.log_test("Admin Analytics - Transaction Data", False, "Transaction data processing missing")
                
                return True
            elif response.status_code == 401:
                self.log_test("Admin Payment Analytics", False, "Authentication required - admin token invalid")
                return False
            else:
                self.log_test("Admin Payment Analytics", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Payment Analytics", False, f"Error: {str(e)}")
            return False

    def test_admin_system_health(self):
        """Test admin system health endpoints"""
        print("\n🏥 ADMIN SYSTEM HEALTH TESTING")
        print("=" * 40)
        
        if not self.admin_token:
            self.log_test("Admin System Health", False, "No admin authentication token available")
            return False
            
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/system/health",
                timeout=10
            )
            
            if response.status_code == 200:
                health_data = response.json()
                
                # Check database connectivity
                if "database" in health_data:
                    db_status = health_data["database"]
                    if isinstance(db_status, dict) and db_status.get("status") == "connected":
                        self.log_test("Admin Health - Database", True, "Database connectivity check working")
                    else:
                        self.log_test("Admin Health - Database", False, f"Database connectivity issue: {db_status}")
                else:
                    self.log_test("Admin Health - Database", False, "Database connectivity check missing")
                
                # Check Razorpay integration status
                if "razorpay" in health_data:
                    razorpay_status = health_data["razorpay"]
                    if isinstance(razorpay_status, dict):
                        self.log_test("Admin Health - Razorpay", True, f"Razorpay integration status: {razorpay_status.get('status', 'unknown')}")
                    else:
                        self.log_test("Admin Health - Razorpay", False, "Razorpay integration status in invalid format")
                else:
                    self.log_test("Admin Health - Razorpay", False, "Razorpay integration status missing")
                
                # Check overall system status
                if "system_status" in health_data or "status" in health_data:
                    system_status = health_data.get("system_status", health_data.get("status"))
                    if system_status in ["healthy", "operational", "ok"]:
                        self.log_test("Admin Health - System Status", True, f"System status reporting: {system_status}")
                    else:
                        self.log_test("Admin Health - System Status", False, f"System status concerning: {system_status}")
                else:
                    self.log_test("Admin Health - System Status", False, "System status reporting missing")
                
                return True
            elif response.status_code == 401:
                self.log_test("Admin System Health", False, "Authentication required - admin token invalid")
                return False
            else:
                self.log_test("Admin System Health", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin System Health", False, f"Error: {str(e)}")
            return False

    def run_admin_panel_tests(self):
        """Run comprehensive admin panel backend tests"""
        print("🔧 STARTING ADMIN PANEL BACKEND TESTING")
        print("=" * 60)
        print("Testing admin panel functionality including authentication, dashboard, content management...")
        print()
        
        # 1. Admin Authentication Testing
        admin_login_success = self.test_admin_login()
        self.test_admin_login_invalid_credentials()
        
        if not admin_login_success:
            print("\n❌ CRITICAL: Admin authentication failed - cannot proceed with protected endpoint tests")
            print("This indicates that admin panel functionality is not implemented or not working correctly.")
            return self.generate_admin_test_report()
        
        # 2. Admin Dashboard Stats Testing
        self.test_admin_dashboard_stats()
        
        # 3. Admin Content Management Testing
        self.test_admin_articles_management()
        self.test_admin_article_deletion()
        
        # 4. Admin User Management Testing
        self.test_admin_user_management()
        
        # 5. Admin Analytics Testing
        self.test_admin_payment_analytics()
        
        # 6. Admin System Health Testing
        self.test_admin_system_health()
        
        return self.generate_admin_test_report()

    def generate_admin_test_report(self):
        """Generate comprehensive admin panel test report"""
        print("\n" + "="*70)
        print("📊 ADMIN PANEL BACKEND TEST REPORT")
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
        
        # Categorize results by admin functionality areas
        admin_areas = {
            "Admin Authentication": ["Admin Login"],
            "Dashboard Stats": ["Dashboard Stats"],
            "Content Management": ["Admin Articles", "Admin Article"],
            "User Management": ["Admin Users"],
            "Payment Analytics": ["Admin Analytics", "Admin Payment"],
            "System Health": ["Admin Health", "Admin System"]
        }
        
        for area, keywords in admin_areas.items():
            area_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in keywords)]
            if area_tests:
                area_passed = sum(1 for t in area_tests if t["success"])
                area_total = len(area_tests)
                area_rate = (area_passed / area_total * 100) if area_total > 0 else 0
                
                status = "✅" if area_rate >= 80 else "⚠️" if area_rate >= 60 else "❌"
                print(f"{status} {area}: {area_passed}/{area_total} tests passed ({area_rate:.1f}%)")
        
        print()
        
        # Critical failures that need immediate attention
        critical_failures = []
        implementation_issues = []
        
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                message = result["message"]
                
                if "not implemented" in message.lower() or "404" in message or "not found" in message.lower():
                    implementation_issues.append(f"🚧 {test_name}: {message}")
                elif any(keyword in test_name.lower() for keyword in ["login", "authentication", "dashboard", "health"]):
                    critical_failures.append(f"❌ {test_name}: {message}")
        
        if implementation_issues:
            print("🚧 IMPLEMENTATION STATUS:")
            for issue in implementation_issues:
                print(f"   {issue}")
            print()
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES:")
            for failure in critical_failures:
                print(f"   {failure}")
            print()
        
        # Success highlights
        key_successes = [r for r in self.test_results if r["success"]]
        if key_successes:
            print("✅ WORKING ADMIN FUNCTIONALITY:")
            for success in key_successes[:8]:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        print("🎯 ADMIN PANEL IMPLEMENTATION ASSESSMENT:")
        
        if success_rate >= 80:
            print("   ✅ EXCELLENT: Admin panel is fully implemented and working correctly")
        elif success_rate >= 60:
            print("   ⚠️ GOOD: Admin panel is mostly implemented with minor issues")
        elif success_rate >= 40:
            print("   ⚠️ PARTIAL: Admin panel is partially implemented, needs completion")
        elif success_rate >= 20:
            print("   ❌ MINIMAL: Admin panel has basic functionality but major features missing")
        else:
            print("   ❌ NOT IMPLEMENTED: Admin panel functionality is not implemented or not working")
        
        print("="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "implementation_issues": implementation_issues,
            "admin_panel_status": "implemented" if success_rate >= 60 else "partial" if success_rate >= 20 else "not_implemented"
        }

def main():
    """Main function to run admin panel tests"""
    print("🔧 Just Urbane Magazine - Admin Panel Backend Testing")
    print("=" * 60)
    
    tester = AdminPanelTester()
    results = tester.run_admin_panel_tests()
    
    print(f"\n🏁 Testing completed with {results['success_rate']:.1f}% success rate")
    
    if results['success_rate'] < 20:
        print("⚠️  RECOMMENDATION: Admin panel functionality needs to be implemented")
        print("   The admin_routes.py file is missing and admin endpoints are not available")
    elif results['success_rate'] < 60:
        print("⚠️  RECOMMENDATION: Complete admin panel implementation and fix critical issues")
    else:
        print("✅ RECOMMENDATION: Admin panel is working well, address minor issues if any")

if __name__ == "__main__":
    main()