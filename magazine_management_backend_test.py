#!/usr/bin/env python3
"""
Just Urbane Magazine Management Backend Testing Suite
Critical magazine management and real-time updates testing as per review request
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class MagazineManagementTester:
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
        
    def admin_login(self):
        """Login as admin to access magazine management endpoints"""
        try:
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.admin_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                    self.log_test("Admin Login", True, "Successfully logged in as admin")
                    return True
                else:
                    self.log_test("Admin Login", False, f"No access token in response: {data}")
                    return False
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, f"Login error: {str(e)}")
            return False

    def test_existing_magazine_display(self):
        """Test /api/admin/magazines endpoint to see if existing magazines are accessible"""
        print("\n📚 TESTING EXISTING MAGAZINE DISPLAY")
        print("=" * 50)
        
        try:
            # Test admin magazines endpoint
            response = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                magazines = data.get("magazines", [])
                total_count = data.get("total_count", 0)
                
                if magazines:
                    self.log_test("Admin Magazines Endpoint", True, f"Retrieved {len(magazines)} magazines from admin panel")
                    
                    # Check magazine data structure
                    first_magazine = magazines[0]
                    required_fields = ["id", "title", "description"]
                    has_required_fields = all(field in first_magazine for field in required_fields)
                    
                    if has_required_fields:
                        self.log_test("Magazine Data Structure", True, f"Magazines have proper structure: {list(first_magazine.keys())}")
                    else:
                        missing_fields = [field for field in required_fields if field not in first_magazine]
                        self.log_test("Magazine Data Structure", False, f"Missing fields: {missing_fields}")
                    
                    return magazines
                else:
                    self.log_test("Admin Magazines Endpoint", False, f"No magazines found in admin panel (total_count: {total_count})")
                    return []
            else:
                self.log_test("Admin Magazines Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return []
                
        except Exception as e:
            self.log_test("Admin Magazines Endpoint", False, f"Error: {str(e)}")
            return []

    def test_public_issues_endpoint(self):
        """Test /api/issues endpoint to see existing magazine data"""
        print("\n🌐 TESTING PUBLIC ISSUES ENDPOINT")
        print("=" * 40)
        
        try:
            response = self.session.get(f"{self.base_url}/api/issues", timeout=15)
            
            if response.status_code == 200:
                issues = response.json()
                
                if isinstance(issues, list):
                    if issues:
                        self.log_test("Public Issues Endpoint", True, f"Retrieved {len(issues)} magazine issues from public API")
                        
                        # Check issue data structure
                        first_issue = issues[0]
                        required_fields = ["id", "title", "description"]
                        has_required_fields = all(field in first_issue for field in required_fields)
                        
                        if has_required_fields:
                            self.log_test("Issue Data Structure", True, f"Issues have proper structure: {list(first_issue.keys())}")
                        else:
                            missing_fields = [field for field in required_fields if field not in first_issue]
                            self.log_test("Issue Data Structure", False, f"Missing fields: {missing_fields}")
                        
                        return issues
                    else:
                        self.log_test("Public Issues Endpoint", False, "No magazine issues found in public API")
                        return []
                else:
                    self.log_test("Public Issues Endpoint", False, f"Invalid response format: {type(issues)}")
                    return []
            else:
                self.log_test("Public Issues Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return []
                
        except Exception as e:
            self.log_test("Public Issues Endpoint", False, f"Error: {str(e)}")
            return []

    def test_magazine_upload_endpoint(self):
        """Test magazine upload at /api/admin/magazines/upload"""
        print("\n📤 TESTING MAGAZINE UPLOAD ENDPOINT")
        print("=" * 40)
        
        try:
            # Test upload endpoint structure (without actual file)
            upload_data = {
                "title": "Test Magazine Upload",
                "description": "Testing magazine upload functionality",
                "month": "January",
                "year": 2025,
                "is_featured": False
            }
            
            # Test without PDF file to check validation
            response = self.session.post(
                f"{self.base_url}/api/admin/magazines/upload",
                data=upload_data,
                timeout=15
            )
            
            # Should return 422 (validation error) since PDF file is required
            if response.status_code == 422:
                self.log_test("Magazine Upload Validation", True, "Upload endpoint properly validates required PDF file")
            elif response.status_code == 401:
                self.log_test("Magazine Upload Authentication", False, "Upload endpoint requires authentication - admin login may have failed")
            else:
                self.log_test("Magazine Upload Endpoint", False, f"Unexpected response: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Magazine Upload Endpoint", False, f"Error: {str(e)}")

    def test_magazine_analytics_endpoints(self):
        """Test /api/admin/magazines/{id}/analytics endpoints"""
        print("\n📊 TESTING MAGAZINE ANALYTICS ENDPOINTS")
        print("=" * 45)
        
        try:
            # First get magazines to test analytics
            response = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                magazines = data.get("magazines", [])
                
                if magazines:
                    # Test analytics for first magazine
                    magazine_id = magazines[0].get("id")
                    if magazine_id:
                        analytics_response = self.session.get(
                            f"{self.base_url}/api/admin/magazines/{magazine_id}/analytics",
                            timeout=15
                        )
                        
                        if analytics_response.status_code == 200:
                            analytics_data = analytics_response.json()
                            expected_fields = ["magazine_id", "views", "downloads", "readers"]
                            has_expected_fields = all(field in analytics_data for field in expected_fields)
                            
                            if has_expected_fields:
                                self.log_test("Magazine Analytics Endpoint", True, f"Analytics working for magazine {magazine_id}")
                            else:
                                missing_fields = [field for field in expected_fields if field not in analytics_data]
                                self.log_test("Magazine Analytics Structure", False, f"Missing analytics fields: {missing_fields}")
                        elif analytics_response.status_code == 404:
                            self.log_test("Magazine Analytics Endpoint", False, f"Analytics not found for magazine {magazine_id}")
                        elif analytics_response.status_code == 500:
                            self.log_test("Magazine Analytics Endpoint", False, f"Server error in analytics: {analytics_response.text}")
                        else:
                            self.log_test("Magazine Analytics Endpoint", False, f"HTTP {analytics_response.status_code}: {analytics_response.text}")
                    else:
                        self.log_test("Magazine Analytics Test", False, "No magazine ID found for analytics testing")
                else:
                    self.log_test("Magazine Analytics Test", False, "No magazines available for analytics testing")
            else:
                self.log_test("Magazine Analytics Setup", False, f"Failed to get magazines for analytics test: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Magazine Analytics Endpoints", False, f"Error: {str(e)}")

    def test_data_synchronization(self):
        """Test magazine data synchronization between admin and public APIs"""
        print("\n🔄 TESTING DATA SYNCHRONIZATION")
        print("=" * 35)
        
        try:
            # Get magazines from admin endpoint
            admin_response = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=15)
            
            # Get issues from public endpoint (remove auth header temporarily)
            temp_headers = self.session.headers.copy()
            if "Authorization" in self.session.headers:
                del self.session.headers["Authorization"]
            
            public_response = self.session.get(f"{self.base_url}/api/issues", timeout=15)
            
            # Restore auth header
            self.session.headers.update(temp_headers)
            
            if admin_response.status_code == 200 and public_response.status_code == 200:
                admin_data = admin_response.json()
                admin_magazines = admin_data.get("magazines", [])
                public_issues = public_response.json()
                
                admin_count = len(admin_magazines)
                public_count = len(public_issues) if isinstance(public_issues, list) else 0
                
                if admin_count == public_count and admin_count > 0:
                    self.log_test("Data Synchronization", True, f"Admin and public APIs synchronized: {admin_count} magazines")
                elif admin_count == 0 and public_count == 0:
                    self.log_test("Data Synchronization", True, "Both admin and public APIs show no magazines (consistent)")
                else:
                    self.log_test("Data Synchronization", False, f"Mismatch: Admin has {admin_count} magazines, Public has {public_count} issues")
                
                # Check if magazine IDs match
                if admin_magazines and public_issues:
                    admin_ids = {mag.get("id") for mag in admin_magazines}
                    public_ids = {issue.get("id") for issue in public_issues if isinstance(public_issues, list)}
                    
                    matching_ids = admin_ids.intersection(public_ids)
                    if matching_ids:
                        self.log_test("ID Synchronization", True, f"{len(matching_ids)} magazine IDs match between admin and public")
                    else:
                        self.log_test("ID Synchronization", False, "No matching magazine IDs between admin and public APIs")
                        
            else:
                self.log_test("Data Synchronization", False, f"API access failed - Admin: {admin_response.status_code}, Public: {public_response.status_code}")
                
        except Exception as e:
            self.log_test("Data Synchronization", False, f"Error: {str(e)}")

    def test_database_collections(self):
        """Test database investigation - magazines vs issues collections"""
        print("\n🗄️ TESTING DATABASE COLLECTIONS")
        print("=" * 35)
        
        try:
            # Test magazines collection via admin endpoint
            magazines_response = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=15)
            
            # Test issues collection via public endpoint
            temp_headers = self.session.headers.copy()
            if "Authorization" in self.session.headers:
                del self.session.headers["Authorization"]
            
            issues_response = self.session.get(f"{self.base_url}/api/issues", timeout=15)
            
            # Restore auth header
            self.session.headers.update(temp_headers)
            
            magazines_accessible = magazines_response.status_code == 200
            issues_accessible = issues_response.status_code == 200
            
            if magazines_accessible:
                magazines_data = magazines_response.json()
                magazines_count = len(magazines_data.get("magazines", []))
                self.log_test("Magazines Collection Access", True, f"Magazines collection accessible with {magazines_count} records")
            else:
                self.log_test("Magazines Collection Access", False, f"Magazines collection not accessible: HTTP {magazines_response.status_code}")
            
            if issues_accessible:
                issues_data = issues_response.json()
                issues_count = len(issues_data) if isinstance(issues_data, list) else 0
                self.log_test("Issues Collection Access", True, f"Issues collection accessible with {issues_count} records")
            else:
                self.log_test("Issues Collection Access", False, f"Issues collection not accessible: HTTP {issues_response.status_code}")
            
            # Check data structure compatibility
            if magazines_accessible and issues_accessible:
                magazines_data = magazines_response.json().get("magazines", [])
                issues_data = issues_response.json()
                
                if magazines_data and isinstance(issues_data, list) and issues_data:
                    mag_fields = set(magazines_data[0].keys())
                    issue_fields = set(issues_data[0].keys())
                    
                    common_fields = mag_fields.intersection(issue_fields)
                    if len(common_fields) >= 3:  # At least id, title, description
                        self.log_test("Data Structure Compatibility", True, f"Collections share {len(common_fields)} common fields")
                    else:
                        self.log_test("Data Structure Compatibility", False, f"Collections have different structures - common fields: {common_fields}")
                        
        except Exception as e:
            self.log_test("Database Collections", False, f"Error: {str(e)}")

    def test_magazine_crud_operations(self):
        """Test magazine CRUD operations"""
        print("\n🔧 TESTING MAGAZINE CRUD OPERATIONS")
        print("=" * 40)
        
        try:
            # Test GET operation (already tested above, but verify again)
            get_response = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=15)
            
            if get_response.status_code == 200:
                self.log_test("Magazine GET Operation", True, "Magazine listing works correctly")
                
                magazines = get_response.json().get("magazines", [])
                if magazines:
                    # Test individual magazine GET
                    magazine_id = magazines[0].get("id")
                    if magazine_id:
                        single_response = self.session.get(f"{self.base_url}/api/admin/magazines/{magazine_id}", timeout=15)
                        
                        if single_response.status_code == 200:
                            self.log_test("Single Magazine GET", True, f"Individual magazine retrieval works for ID: {magazine_id}")
                        else:
                            self.log_test("Single Magazine GET", False, f"HTTP {single_response.status_code}: {single_response.text}")
                    
                    # Test magazine UPDATE operation
                    if magazine_id:
                        update_data = {
                            "title": "Updated Test Magazine Title",
                            "description": "Updated description for testing"
                        }
                        
                        update_response = self.session.put(
                            f"{self.base_url}/api/admin/magazines/{magazine_id}",
                            data=update_data,
                            timeout=15
                        )
                        
                        if update_response.status_code == 200:
                            self.log_test("Magazine UPDATE Operation", True, f"Magazine update works for ID: {magazine_id}")
                        else:
                            self.log_test("Magazine UPDATE Operation", False, f"HTTP {update_response.status_code}: {update_response.text}")
                    
                    # Test magazine feature toggle
                    if magazine_id:
                        feature_response = self.session.post(
                            f"{self.base_url}/api/admin/magazines/{magazine_id}/feature",
                            timeout=15
                        )
                        
                        if feature_response.status_code == 200:
                            self.log_test("Magazine Feature Toggle", True, f"Feature toggle works for ID: {magazine_id}")
                        else:
                            self.log_test("Magazine Feature Toggle", False, f"HTTP {feature_response.status_code}: {feature_response.text}")
                            
            else:
                self.log_test("Magazine GET Operation", False, f"HTTP {get_response.status_code}: {get_response.text}")
                
        except Exception as e:
            self.log_test("Magazine CRUD Operations", False, f"Error: {str(e)}")

    def test_real_time_updates(self):
        """Test real-time update functionality"""
        print("\n⚡ TESTING REAL-TIME UPDATES")
        print("=" * 30)
        
        try:
            # Get initial state from both endpoints
            admin_response1 = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=15)
            
            temp_headers = self.session.headers.copy()
            if "Authorization" in self.session.headers:
                del self.session.headers["Authorization"]
            
            public_response1 = self.session.get(f"{self.base_url}/api/issues", timeout=15)
            
            # Restore auth header
            self.session.headers.update(temp_headers)
            
            if admin_response1.status_code == 200 and public_response1.status_code == 200:
                admin_data1 = admin_response1.json()
                public_data1 = public_response1.json()
                
                initial_admin_count = len(admin_data1.get("magazines", []))
                initial_public_count = len(public_data1) if isinstance(public_data1, list) else 0
                
                self.log_test("Real-time Updates - Initial State", True, f"Admin: {initial_admin_count}, Public: {initial_public_count} magazines")
                
                # Check if updates would be reflected (test the mechanism)
                if initial_admin_count == initial_public_count:
                    self.log_test("Real-time Sync Mechanism", True, "Admin and public APIs show consistent data")
                else:
                    self.log_test("Real-time Sync Mechanism", False, f"Data inconsistency detected: Admin={initial_admin_count}, Public={initial_public_count}")
                    
            else:
                self.log_test("Real-time Updates", False, f"Failed to get initial state - Admin: {admin_response1.status_code}, Public: {public_response1.status_code}")
                
        except Exception as e:
            self.log_test("Real-time Updates", False, f"Error: {str(e)}")

    def test_api_health_and_connectivity(self):
        """Test basic API health and connectivity"""
        print("\n🏥 TESTING API HEALTH AND CONNECTIVITY")
        print("=" * 45)
        
        try:
            # Test health endpoint
            health_response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            
            if health_response.status_code == 200:
                health_data = health_response.json()
                if health_data.get("status") == "healthy":
                    self.log_test("API Health Check", True, "Backend API is healthy and responding")
                else:
                    self.log_test("API Health Check", False, f"Unexpected health status: {health_data}")
            else:
                self.log_test("API Health Check", False, f"HTTP {health_response.status_code}: {health_response.text}")
            
            # Test admin system health
            if self.admin_token:
                admin_health_response = self.session.get(f"{self.base_url}/api/admin/system/health", timeout=15)
                
                if admin_health_response.status_code == 200:
                    admin_health_data = admin_health_response.json()
                    db_status = admin_health_data.get("database", {}).get("status")
                    
                    if db_status == "connected":
                        self.log_test("Database Connectivity", True, "Database connection is healthy")
                    else:
                        self.log_test("Database Connectivity", False, f"Database status: {db_status}")
                else:
                    self.log_test("Admin System Health", False, f"HTTP {admin_health_response.status_code}: {admin_health_response.text}")
                    
        except Exception as e:
            self.log_test("API Health and Connectivity", False, f"Error: {str(e)}")

    def run_magazine_management_tests(self):
        """Run comprehensive magazine management tests"""
        print("🎯 STARTING MAGAZINE MANAGEMENT CRITICAL TESTING")
        print("=" * 60)
        print("Testing critical magazine management and real-time update issues...")
        print()
        
        # 1. API Health Check
        self.test_api_health_and_connectivity()
        
        # 2. Admin Authentication
        if not self.admin_login():
            print("\n❌ CRITICAL: Admin login failed - cannot test admin endpoints")
            return self.generate_report()
        
        # 3. Test existing magazine display issue
        admin_magazines = self.test_existing_magazine_display()
        
        # 4. Test public issues endpoint
        public_issues = self.test_public_issues_endpoint()
        
        # 5. Test magazine upload process
        self.test_magazine_upload_endpoint()
        
        # 6. Test magazine analytics
        self.test_magazine_analytics_endpoints()
        
        # 7. Test data synchronization
        self.test_data_synchronization()
        
        # 8. Test database collections
        self.test_database_collections()
        
        # 9. Test CRUD operations
        self.test_magazine_crud_operations()
        
        # 10. Test real-time updates
        self.test_real_time_updates()
        
        return self.generate_report()

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 MAGAZINE MANAGEMENT CRITICAL ISSUES REPORT")
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
        
        # Categorize results by critical areas from review request
        critical_areas = {
            "Existing Magazine Display": ["Admin Magazines", "Magazine Data Structure"],
            "Real-time Updates": ["Data Synchronization", "Real-time", "ID Synchronization"],
            "Magazine Analytics": ["Analytics"],
            "Main Website Integration": ["Public Issues", "Issues Collection"],
            "Database Investigation": ["Database", "Collections"],
            "Magazine Upload Process": ["Upload", "CRUD"]
        }
        
        print("🎯 CRITICAL AREAS ASSESSMENT:")
        for area, keywords in critical_areas.items():
            area_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in keywords)]
            if area_tests:
                area_passed = sum(1 for t in area_tests if t["success"])
                area_total = len(area_tests)
                area_rate = (area_passed / area_total * 100) if area_total > 0 else 0
                
                status = "✅" if area_rate >= 80 else "⚠️" if area_rate >= 60 else "❌"
                print(f"   {status} {area}: {area_passed}/{area_total} tests passed ({area_rate:.1f}%)")
        
        print()
        
        # Critical failures that need immediate attention
        critical_failures = []
        minor_issues = []
        
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["admin magazines", "data synchronization", "analytics", "public issues", "upload"]):
                    critical_failures.append(f"❌ {test_name}: {result['message']}")
                else:
                    minor_issues.append(f"⚠️ {test_name}: {result['message']}")
        
        if critical_failures:
            print("🚨 CRITICAL MAGAZINE MANAGEMENT ISSUES:")
            for failure in critical_failures:
                print(f"   {failure}")
            print()
        
        if minor_issues:
            print("⚠️ MINOR ISSUES:")
            for issue in minor_issues[:3]:
                print(f"   {issue}")
            print()
        
        # Success highlights
        key_successes = [r for r in self.test_results if r["success"] and any(keyword in r["test"].lower() for keyword in ["admin magazines", "public issues", "analytics", "synchronization"])]
        if key_successes:
            print("✅ KEY MAGAZINE FUNCTIONALITY WORKING:")
            for success in key_successes:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        print("🎯 MAGAZINE MANAGEMENT DIAGNOSIS:")
        
        if success_rate >= 90:
            print("   ✅ EXCELLENT: Magazine management system is working correctly")
        elif success_rate >= 80:
            print("   ⚠️ GOOD: Magazine system mostly working, minor issues detected")
        elif success_rate >= 70:
            print("   ⚠️ MODERATE: Some magazine management issues detected")
        else:
            print("   ❌ CRITICAL: Significant magazine management issues require immediate attention")
        
        print("="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "minor_issues": minor_issues
        }

def main():
    """Main function to run magazine management tests"""
    tester = MagazineManagementTester()
    results = tester.run_magazine_management_tests()
    
    print(f"\n🏁 MAGAZINE MANAGEMENT TESTING COMPLETED")
    print(f"Success Rate: {results['success_rate']:.1f}%")
    
    if results['success_rate'] < 80:
        print("⚠️ Magazine management system needs attention!")
    else:
        print("✅ Magazine management system is functioning well!")

if __name__ == "__main__":
    main()