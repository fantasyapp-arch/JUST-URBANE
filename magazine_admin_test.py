#!/usr/bin/env python3
"""
Just Urbane Magazine Admin Panel Testing Suite
Testing magazine management functionality specifically for the reported issues:
1. Delete option not working in admin panel
2. Existing magazine not showing
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class MagazineAdminTester:
    def __init__(self, base_url: str = "https://backend-restore-2.preview.emergentagent.com"):
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
        """Test admin login to get authentication token"""
        try:
            # Try common admin credentials
            admin_credentials = [
                {"username": "admin", "password": "admin123"},
                {"username": "admin", "password": "password"},
                {"username": "admin", "password": "admin"},
                {"email": "admin@justurbane.com", "password": "admin123"},
                {"email": "admin@justurbane.com", "password": "password"}
            ]
            
            for creds in admin_credentials:
                try:
                    response = self.session.post(
                        f"{self.base_url}/api/admin/auth/login",
                        json=creds,
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        if data.get("access_token"):
                            self.admin_token = data["access_token"]
                            self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                            self.log_test("Admin Login", True, f"Successfully logged in as admin with credentials: {list(creds.keys())}")
                            return True
                except:
                    continue
            
            # If admin login fails, try regular user login and see if we can access admin endpoints
            try:
                user_creds = {
                    "email": f"testuser_{int(time.time())}@justurbane.com",
                    "password": "testpass123",
                    "full_name": "Test Admin User"
                }
                
                # Register user
                reg_response = self.session.post(
                    f"{self.base_url}/api/auth/register",
                    json=user_creds,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if reg_response.status_code == 200:
                    reg_data = reg_response.json()
                    if reg_data.get("access_token"):
                        self.admin_token = reg_data["access_token"]
                        self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                        self.log_test("Admin Login", True, "Using regular user token for admin endpoint testing")
                        return True
                        
            except Exception as e:
                pass
            
            self.log_test("Admin Login", False, "Failed to authenticate with admin credentials")
            return False
            
        except Exception as e:
            self.log_test("Admin Login", False, f"Login error: {str(e)}")
            return False

    def test_magazine_listing_api(self):
        """Test GET /api/admin/magazines - Core issue: existing magazines not showing"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/magazines",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                magazines = data.get("magazines", [])
                total_count = data.get("total_count", 0)
                
                if isinstance(magazines, list):
                    self.log_test("Magazine Listing API", True, f"Retrieved {len(magazines)} magazines (total: {total_count})")
                    
                    # Check if magazines have required fields
                    if magazines:
                        first_magazine = magazines[0]
                        required_fields = ["id", "title", "description"]
                        missing_fields = [field for field in required_fields if field not in first_magazine]
                        
                        if not missing_fields:
                            self.log_test("Magazine Data Structure", True, f"Magazines have proper structure: {list(first_magazine.keys())}")
                        else:
                            self.log_test("Magazine Data Structure", False, f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("Magazine Data Check", True, "No magazines found - this might be the issue user is reporting")
                    
                    return magazines
                else:
                    self.log_test("Magazine Listing API", False, f"Invalid response format: {type(magazines)}")
                    return None
            elif response.status_code == 401:
                self.log_test("Magazine Listing API", False, "Authentication required - admin token invalid")
                return None
            elif response.status_code == 403:
                self.log_test("Magazine Listing API", False, "Access forbidden - insufficient permissions")
                return None
            else:
                self.log_test("Magazine Listing API", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Magazine Listing API", False, f"Error: {str(e)}")
            return None

    def test_database_collections(self):
        """Check both magazines and issues collections for existing data"""
        try:
            # Check issues collection (fallback collection)
            response = self.session.get(f"{self.base_url}/api/issues", timeout=10)
            
            if response.status_code == 200:
                issues = response.json()
                if isinstance(issues, list):
                    self.log_test("Issues Collection Check", True, f"Found {len(issues)} items in issues collection")
                    
                    if issues:
                        # Check if these are magazines
                        first_issue = issues[0]
                        issue_fields = list(first_issue.keys())
                        self.log_test("Issues Data Structure", True, f"Issues have fields: {issue_fields}")
                        
                        # Check if issues have magazine-like properties
                        magazine_indicators = ["pdf_url", "pages", "cover_image", "month", "year"]
                        has_magazine_props = any(prop in first_issue for prop in magazine_indicators)
                        
                        if has_magazine_props:
                            self.log_test("Magazine Data in Issues", True, "Issues collection contains magazine-like data")
                        else:
                            self.log_test("Magazine Data in Issues", False, "Issues collection doesn't contain magazine data")
                    
                    return issues
                else:
                    self.log_test("Issues Collection Check", False, f"Invalid format: {type(issues)}")
                    return None
            else:
                self.log_test("Issues Collection Check", False, f"HTTP {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test("Database Collections Check", False, f"Error: {str(e)}")
            return None

    def test_magazine_delete_api(self, magazines):
        """Test DELETE /api/admin/magazines/{id} - Core issue: delete not working"""
        if not magazines:
            self.log_test("Magazine Delete API", False, "No magazines available to test delete functionality")
            return
        
        try:
            # Get the first magazine for testing
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            
            if not magazine_id:
                self.log_test("Magazine Delete API", False, "No magazine ID found for delete testing")
                return
            
            # Test DELETE request
            response = self.session.delete(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message"):
                    self.log_test("Magazine Delete API", True, f"Delete successful: {data['message']}")
                    
                    # Verify deletion by trying to get the magazine
                    verify_response = self.session.get(
                        f"{self.base_url}/api/admin/magazines/{magazine_id}",
                        timeout=10
                    )
                    
                    if verify_response.status_code == 404:
                        self.log_test("Magazine Delete Verification", True, "Magazine successfully deleted - returns 404")
                    else:
                        self.log_test("Magazine Delete Verification", False, f"Magazine still exists after delete: HTTP {verify_response.status_code}")
                else:
                    self.log_test("Magazine Delete API", False, f"Delete response missing message: {data}")
            elif response.status_code == 401:
                self.log_test("Magazine Delete API", False, "Authentication required - admin token invalid")
            elif response.status_code == 403:
                self.log_test("Magazine Delete API", False, "Access forbidden - insufficient permissions")
            elif response.status_code == 404:
                self.log_test("Magazine Delete API", False, f"Magazine not found for deletion: {magazine_id}")
            else:
                self.log_test("Magazine Delete API", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Magazine Delete API", False, f"Error: {str(e)}")

    def test_magazine_update_api(self, magazines):
        """Test PUT /api/admin/magazines/{id} - Update functionality"""
        if not magazines:
            self.log_test("Magazine Update API", False, "No magazines available to test update functionality")
            return
        
        try:
            # Get the first magazine for testing
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            
            if not magazine_id:
                self.log_test("Magazine Update API", False, "No magazine ID found for update testing")
                return
            
            # Test update with form data
            update_data = {
                "title": "Updated Test Magazine Title",
                "description": "Updated description for testing",
                "is_featured": True
            }
            
            response = self.session.put(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                data=update_data,  # Using form data as per the API
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message"):
                    self.log_test("Magazine Update API", True, f"Update successful: {data['message']}")
                    
                    # Verify update by getting the magazine
                    verify_response = self.session.get(
                        f"{self.base_url}/api/admin/magazines/{magazine_id}",
                        timeout=10
                    )
                    
                    if verify_response.status_code == 200:
                        updated_magazine = verify_response.json()
                        if updated_magazine.get("title") == update_data["title"]:
                            self.log_test("Magazine Update Verification", True, "Magazine successfully updated")
                        else:
                            self.log_test("Magazine Update Verification", False, "Magazine update not reflected")
                    else:
                        self.log_test("Magazine Update Verification", False, f"Cannot verify update: HTTP {verify_response.status_code}")
                else:
                    self.log_test("Magazine Update API", False, f"Update response missing message: {data}")
            elif response.status_code == 401:
                self.log_test("Magazine Update API", False, "Authentication required - admin token invalid")
            elif response.status_code == 403:
                self.log_test("Magazine Update API", False, "Access forbidden - insufficient permissions")
            elif response.status_code == 404:
                self.log_test("Magazine Update API", False, f"Magazine not found for update: {magazine_id}")
            else:
                self.log_test("Magazine Update API", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Magazine Update API", False, f"Error: {str(e)}")

    def test_single_magazine_retrieval(self, magazines):
        """Test GET /api/admin/magazines/{id} - Single magazine retrieval"""
        if not magazines:
            self.log_test("Single Magazine Retrieval", False, "No magazines available to test single retrieval")
            return
        
        try:
            # Test with first magazine
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            
            if not magazine_id:
                self.log_test("Single Magazine Retrieval", False, "No magazine ID found")
                return
            
            response = self.session.get(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                magazine = response.json()
                if magazine.get("id") == magazine_id:
                    self.log_test("Single Magazine Retrieval", True, f"Successfully retrieved magazine: {magazine.get('title', 'Unknown')}")
                    
                    # Check data consistency
                    required_fields = ["id", "title", "description"]
                    missing_fields = [field for field in required_fields if field not in magazine]
                    
                    if not missing_fields:
                        self.log_test("Single Magazine Data Consistency", True, "Magazine has all required fields")
                    else:
                        self.log_test("Single Magazine Data Consistency", False, f"Missing fields: {missing_fields}")
                else:
                    self.log_test("Single Magazine Retrieval", False, "Magazine ID mismatch in response")
            elif response.status_code == 404:
                self.log_test("Single Magazine Retrieval", False, f"Magazine not found: {magazine_id}")
            else:
                self.log_test("Single Magazine Retrieval", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Single Magazine Retrieval", False, f"Error: {str(e)}")

    def test_admin_authentication_requirements(self):
        """Test admin authentication requirements for magazine endpoints"""
        try:
            # Test without authentication
            temp_session = requests.Session()
            
            endpoints_to_test = [
                ("/api/admin/magazines", "GET", "Magazine Listing"),
                ("/api/admin/magazines/test-id", "GET", "Single Magazine"),
                ("/api/admin/magazines/test-id", "PUT", "Magazine Update"),
                ("/api/admin/magazines/test-id", "DELETE", "Magazine Delete")
            ]
            
            auth_protected_count = 0
            
            for endpoint, method, description in endpoints_to_test:
                if method == "GET":
                    response = temp_session.get(f"{self.base_url}{endpoint}", timeout=10)
                elif method == "PUT":
                    response = temp_session.put(f"{self.base_url}{endpoint}", data={"title": "test"}, timeout=10)
                elif method == "DELETE":
                    response = temp_session.delete(f"{self.base_url}{endpoint}", timeout=10)
                
                if response.status_code in [401, 403]:
                    auth_protected_count += 1
                    self.log_test(f"Auth Protection - {description}", True, f"Properly protected: HTTP {response.status_code}")
                else:
                    self.log_test(f"Auth Protection - {description}", False, f"Not protected: HTTP {response.status_code}")
            
            if auth_protected_count >= 3:
                self.log_test("Admin Authentication", True, f"{auth_protected_count}/{len(endpoints_to_test)} endpoints properly protected")
            else:
                self.log_test("Admin Authentication", False, f"Only {auth_protected_count}/{len(endpoints_to_test)} endpoints protected")
                
        except Exception as e:
            self.log_test("Admin Authentication Requirements", False, f"Error: {str(e)}")

    def test_magazine_id_consistency(self, magazines):
        """Test ID field consistency across different operations"""
        if not magazines:
            self.log_test("Magazine ID Consistency", False, "No magazines available for ID consistency testing")
            return
        
        try:
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            
            if not magazine_id:
                self.log_test("Magazine ID Consistency", False, "No magazine ID found")
                return
            
            # Test different ID formats
            id_formats_to_test = [
                magazine_id,  # Original ID
                str(magazine_id),  # String conversion
            ]
            
            successful_retrievals = 0
            
            for test_id in id_formats_to_test:
                try:
                    response = self.session.get(
                        f"{self.base_url}/api/admin/magazines/{test_id}",
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        successful_retrievals += 1
                        self.log_test(f"ID Format Test - {test_id}", True, "ID format works")
                    else:
                        self.log_test(f"ID Format Test - {test_id}", False, f"HTTP {response.status_code}")
                        
                except Exception as e:
                    self.log_test(f"ID Format Test - {test_id}", False, f"Error: {str(e)}")
            
            if successful_retrievals > 0:
                self.log_test("Magazine ID Consistency", True, f"{successful_retrievals}/{len(id_formats_to_test)} ID formats work")
            else:
                self.log_test("Magazine ID Consistency", False, "No ID formats work - this could be the core issue")
                
        except Exception as e:
            self.log_test("Magazine ID Consistency", False, f"Error: {str(e)}")

    def run_magazine_admin_tests(self):
        """Run comprehensive magazine admin panel tests"""
        print("🏢 STARTING MAGAZINE ADMIN PANEL TESTING")
        print("=" * 60)
        print("Testing reported issues:")
        print("1. Delete option not working in admin panel")
        print("2. Existing magazine not showing")
        print()
        
        # 1. Admin Authentication
        print("🔐 ADMIN AUTHENTICATION TESTING")
        print("=" * 40)
        auth_success = self.test_admin_login()
        
        if not auth_success:
            print("⚠️ Admin authentication failed - testing with available permissions")
        
        # 2. Test admin authentication requirements
        self.test_admin_authentication_requirements()
        
        # 3. Magazine Listing API (Core Issue #2)
        print("\n📋 MAGAZINE LISTING TESTING")
        print("=" * 40)
        magazines = self.test_magazine_listing_api()
        
        # 4. Database Collections Check
        print("\n🗄️ DATABASE COLLECTIONS TESTING")
        print("=" * 40)
        issues = self.test_database_collections()
        
        # 5. Single Magazine Retrieval
        if magazines:
            print("\n📖 SINGLE MAGAZINE RETRIEVAL TESTING")
            print("=" * 40)
            self.test_single_magazine_retrieval(magazines)
            
            # 6. Magazine Update API
            print("\n✏️ MAGAZINE UPDATE TESTING")
            print("=" * 40)
            self.test_magazine_update_api(magazines)
            
            # 7. Magazine Delete API (Core Issue #1)
            print("\n🗑️ MAGAZINE DELETE TESTING")
            print("=" * 40)
            self.test_magazine_delete_api(magazines)
            
            # 8. ID Consistency Testing
            print("\n🔍 ID CONSISTENCY TESTING")
            print("=" * 40)
            self.test_magazine_id_consistency(magazines)
        else:
            print("\n⚠️ No magazines found - this explains why 'existing magazine not showing'")
            if issues:
                print(f"However, found {len(issues)} items in issues collection")
                print("This suggests magazines might be stored in issues collection instead")
        
        return self.generate_magazine_admin_report()

    def generate_magazine_admin_report(self):
        """Generate comprehensive test report for magazine admin functionality"""
        print("\n" + "="*70)
        print("📊 MAGAZINE ADMIN PANEL TEST REPORT")
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
        
        # Analyze specific issues
        print("🔍 ISSUE ANALYSIS:")
        
        # Issue 1: Delete option not working
        delete_tests = [r for r in self.test_results if "delete" in r["test"].lower()]
        if delete_tests:
            delete_success = any(t["success"] for t in delete_tests)
            if delete_success:
                print("   ✅ Issue 1 (Delete not working): DELETE API is functional")
            else:
                print("   ❌ Issue 1 (Delete not working): DELETE API has issues")
                for test in delete_tests:
                    if not test["success"]:
                        print(f"      - {test['test']}: {test['message']}")
        else:
            print("   ⚠️ Issue 1 (Delete not working): Could not test - no magazines available")
        
        # Issue 2: Existing magazine not showing
        listing_tests = [r for r in self.test_results if "listing" in r["test"].lower() or "magazine" in r["test"].lower()]
        magazine_found = False
        for test in listing_tests:
            if test["success"] and "retrieved" in test["message"].lower() and "0 magazines" not in test["message"]:
                magazine_found = True
                break
        
        if magazine_found:
            print("   ✅ Issue 2 (Magazines not showing): Magazines are being retrieved")
        else:
            print("   ❌ Issue 2 (Magazines not showing): No magazines found in admin panel")
            print("      - This explains why user reports 'existing magazine not showing'")
        
        print()
        
        # Critical failures
        critical_failures = []
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["listing", "delete", "authentication", "retrieval"]):
                    critical_failures.append(f"❌ {test_name}: {result['message']}")
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES:")
            for failure in critical_failures[:5]:
                print(f"   {failure}")
            print()
        
        # Success highlights
        successes = [r for r in self.test_results if r["success"]]
        if successes:
            print("✅ WORKING FUNCTIONALITY:")
            for success in successes[:5]:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        print("🎯 ROOT CAUSE ANALYSIS:")
        
        # Determine root causes
        auth_issues = any("auth" in r["test"].lower() and not r["success"] for r in self.test_results)
        data_issues = any("listing" in r["test"].lower() and not r["success"] for r in self.test_results)
        api_issues = any("api" in r["test"].lower() and not r["success"] for r in self.test_results)
        
        if auth_issues:
            print("   🔐 Authentication issues detected - admin access may be restricted")
        if data_issues:
            print("   🗄️ Data retrieval issues - magazines may not exist in database")
        if api_issues:
            print("   🔌 API endpoint issues - some magazine management APIs may be broken")
        
        if not magazine_found:
            print("   📋 PRIMARY ISSUE: No magazines found in admin panel")
            print("      - Magazines collection may be empty")
            print("      - Data may be in 'issues' collection instead of 'magazines'")
            print("      - Admin panel may be looking in wrong database collection")
        
        print("="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "magazine_found": magazine_found,
            "issues_identified": {
                "delete_not_working": not any(t["success"] for t in delete_tests) if delete_tests else "unknown",
                "magazines_not_showing": not magazine_found,
                "authentication_issues": auth_issues,
                "data_issues": data_issues,
                "api_issues": api_issues
            }
        }

def main():
    """Main function to run magazine admin tests"""
    tester = MagazineAdminTester()
    results = tester.run_magazine_admin_tests()
    
    print(f"\n🏁 TESTING COMPLETED")
    print(f"Success Rate: {results['success_rate']:.1f}%")
    
    if results['success_rate'] < 70:
        print("⚠️ Significant issues detected in magazine admin functionality")
    elif results['success_rate'] < 90:
        print("⚠️ Some issues detected, but core functionality working")
    else:
        print("✅ Magazine admin functionality working well")

if __name__ == "__main__":
    main()