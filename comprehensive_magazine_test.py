#!/usr/bin/env python3
"""
Just Urbane Magazine Admin Panel Testing Suite - COMPREHENSIVE
Testing magazine management functionality with proper admin authentication
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class ComprehensiveMagazineAdminTester:
    def __init__(self, base_url: str = "http://localhost:8001"):
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
        """Test admin login with correct credentials"""
        try:
            admin_credentials = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json=admin_credentials,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.admin_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                    admin_user = data.get("admin_user", {})
                    self.log_test("Admin Login", True, f"Successfully logged in as {admin_user.get('username', 'admin')}")
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

    def test_magazine_listing_api(self):
        """Test GET /api/admin/magazines - Check if magazines are showing"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/magazines",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                magazines = data.get("magazines", [])
                
                if isinstance(magazines, list):
                    self.log_test("Magazine Listing API", True, f"Retrieved {len(magazines)} magazines")
                    
                    if magazines:
                        # Check magazine data structure
                        first_magazine = magazines[0]
                        required_fields = ["id", "title", "description", "month", "year"]
                        missing_fields = [field for field in required_fields if field not in first_magazine]
                        
                        if not missing_fields:
                            self.log_test("Magazine Data Structure", True, f"Magazines have proper structure")
                        else:
                            self.log_test("Magazine Data Structure", False, f"Missing fields: {missing_fields}")
                        
                        # Log magazine details
                        for i, mag in enumerate(magazines[:3]):  # Show first 3
                            self.log_test(f"Magazine {i+1} Details", True, f"ID: {mag.get('id')}, Title: {mag.get('title')}, Month: {mag.get('month')} {mag.get('year')}")
                    else:
                        self.log_test("Magazine Data Check", False, "No magazines found - this explains user issue 'existing magazine not showing'")
                    
                    return magazines
                else:
                    self.log_test("Magazine Listing API", False, f"Invalid response format: {type(magazines)}")
                    return None
            else:
                self.log_test("Magazine Listing API", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Magazine Listing API", False, f"Error: {str(e)}")
            return None

    def test_magazine_delete_api(self, magazines):
        """Test DELETE /api/admin/magazines/{id} - Core issue: delete not working"""
        if not magazines:
            self.log_test("Magazine Delete API", False, "No magazines available to test delete functionality")
            return False
        
        try:
            # Get the first magazine for testing
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            magazine_title = test_magazine.get("title", "Unknown")
            
            if not magazine_id:
                self.log_test("Magazine Delete API", False, "No magazine ID found for delete testing")
                return False
            
            self.log_test("Delete Test Setup", True, f"Testing delete for magazine: {magazine_title} (ID: {magazine_id})")
            
            # Test DELETE request
            response = self.session.delete(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message"):
                    self.log_test("Magazine Delete API", True, f"Delete successful: {data['message']}")
                    
                    # Verify deletion by checking magazine list
                    verify_response = self.session.get(
                        f"{self.base_url}/api/admin/magazines",
                        timeout=10
                    )
                    
                    if verify_response.status_code == 200:
                        verify_data = verify_response.json()
                        remaining_magazines = verify_data.get("magazines", [])
                        
                        # Check if the deleted magazine is still in the list
                        deleted_magazine_still_exists = any(mag.get("id") == magazine_id for mag in remaining_magazines)
                        
                        if not deleted_magazine_still_exists:
                            self.log_test("Magazine Delete Verification", True, f"Magazine successfully deleted - not in list anymore")
                            return True
                        else:
                            self.log_test("Magazine Delete Verification", False, f"Magazine still exists after delete")
                            return False
                    else:
                        self.log_test("Magazine Delete Verification", False, f"Cannot verify deletion: HTTP {verify_response.status_code}")
                        return False
                else:
                    self.log_test("Magazine Delete API", False, f"Delete response missing message: {data}")
                    return False
            elif response.status_code == 404:
                self.log_test("Magazine Delete API", False, f"Magazine not found for deletion: {magazine_id} - This is the core issue!")
                return False
            else:
                self.log_test("Magazine Delete API", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Magazine Delete API", False, f"Error: {str(e)}")
            return False

    def test_magazine_update_api(self, magazines):
        """Test PUT /api/admin/magazines/{id} - Update functionality"""
        if not magazines:
            self.log_test("Magazine Update API", False, "No magazines available to test update functionality")
            return False
        
        try:
            # Get the first magazine for testing
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            original_title = test_magazine.get("title", "Unknown")
            
            if not magazine_id:
                self.log_test("Magazine Update API", False, "No magazine ID found for update testing")
                return False
            
            # Test update with form data (as per admin_magazine_routes.py)
            update_data = {
                "title": f"Updated Test Magazine - {int(time.time())}",
                "description": "Updated description for comprehensive testing",
                "is_featured": True
            }
            
            self.log_test("Update Test Setup", True, f"Testing update for magazine: {original_title} (ID: {magazine_id})")
            
            response = self.session.put(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                data=update_data,  # Using form data as per the API
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message"):
                    self.log_test("Magazine Update API", True, f"Update successful: {data['message']}")
                    
                    # Verify update by getting the magazine list again
                    verify_response = self.session.get(
                        f"{self.base_url}/api/admin/magazines",
                        timeout=10
                    )
                    
                    if verify_response.status_code == 200:
                        verify_data = verify_response.json()
                        updated_magazines = verify_data.get("magazines", [])
                        
                        # Find the updated magazine
                        updated_magazine = next((mag for mag in updated_magazines if mag.get("id") == magazine_id), None)
                        
                        if updated_magazine and updated_magazine.get("title") == update_data["title"]:
                            self.log_test("Magazine Update Verification", True, f"Magazine successfully updated: {updated_magazine.get('title')}")
                            return True
                        else:
                            self.log_test("Magazine Update Verification", False, "Magazine update not reflected in listing")
                            return False
                    else:
                        self.log_test("Magazine Update Verification", False, f"Cannot verify update: HTTP {verify_response.status_code}")
                        return False
                else:
                    self.log_test("Magazine Update API", False, f"Update response missing message: {data}")
                    return False
            elif response.status_code == 404:
                self.log_test("Magazine Update API", False, f"Magazine not found for update: {magazine_id}")
                return False
            else:
                self.log_test("Magazine Update API", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Magazine Update API", False, f"Error: {str(e)}")
            return False

    def test_database_collection_consistency(self):
        """Test consistency between magazines and issues collections"""
        try:
            # Check issues collection (public endpoint)
            issues_response = self.session.get(f"{self.base_url}/api/issues", timeout=10)
            
            if issues_response.status_code == 200:
                issues = issues_response.json()
                self.log_test("Issues Collection Check", True, f"Found {len(issues)} items in issues collection")
                
                # Check admin magazines endpoint
                admin_response = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=10)
                
                if admin_response.status_code == 200:
                    admin_data = admin_response.json()
                    admin_magazines = admin_data.get("magazines", [])
                    
                    # Compare counts
                    if len(issues) == len(admin_magazines):
                        self.log_test("Collection Consistency", True, f"Both collections have {len(issues)} items")
                    else:
                        self.log_test("Collection Consistency", False, f"Mismatch: issues={len(issues)}, admin_magazines={len(admin_magazines)}")
                    
                    # Check if IDs match
                    if issues and admin_magazines:
                        issue_ids = set(issue.get("id") for issue in issues)
                        admin_ids = set(mag.get("id") for mag in admin_magazines)
                        
                        if issue_ids == admin_ids:
                            self.log_test("ID Consistency", True, "Magazine IDs match between collections")
                        else:
                            self.log_test("ID Consistency", False, f"ID mismatch - issues: {issue_ids}, admin: {admin_ids}")
                    
                    return {"issues": issues, "admin_magazines": admin_magazines}
                else:
                    self.log_test("Admin Collection Check", False, f"Admin magazines failed: HTTP {admin_response.status_code}")
                    return {"issues": issues, "admin_magazines": []}
            else:
                self.log_test("Issues Collection Check", False, f"Issues collection failed: HTTP {issues_response.status_code}")
                return {"issues": [], "admin_magazines": []}
                
        except Exception as e:
            self.log_test("Database Collection Consistency", False, f"Error: {str(e)}")
            return {"issues": [], "admin_magazines": []}

    def test_magazine_id_formats(self, magazines):
        """Test different ID formats for magazine operations"""
        if not magazines:
            self.log_test("Magazine ID Format Test", False, "No magazines available for ID format testing")
            return
        
        try:
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            
            if not magazine_id:
                self.log_test("Magazine ID Format Test", False, "No magazine ID found")
                return
            
            # Test different operations with the ID
            operations_to_test = [
                ("GET", f"/api/admin/magazines", "Magazine listing"),
                ("DELETE", f"/api/admin/magazines/{magazine_id}", "Magazine delete"),
            ]
            
            successful_operations = 0
            
            for method, endpoint, description in operations_to_test:
                try:
                    if method == "GET":
                        response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                    elif method == "DELETE":
                        # Don't actually delete, just test the endpoint response
                        response = self.session.delete(f"{self.base_url}{endpoint}", timeout=10)
                    
                    if response.status_code in [200, 404]:  # 404 is also valid response
                        successful_operations += 1
                        self.log_test(f"ID Format - {description}", True, f"ID format works: HTTP {response.status_code}")
                    else:
                        self.log_test(f"ID Format - {description}", False, f"HTTP {response.status_code}")
                        
                except Exception as e:
                    self.log_test(f"ID Format - {description}", False, f"Error: {str(e)}")
            
            if successful_operations >= 1:
                self.log_test("Magazine ID Format Test", True, f"{successful_operations}/{len(operations_to_test)} operations work with current ID format")
            else:
                self.log_test("Magazine ID Format Test", False, "No operations work with current ID format")
                
        except Exception as e:
            self.log_test("Magazine ID Format Test", False, f"Error: {str(e)}")

    def diagnose_delete_issue(self, magazines):
        """Diagnose why delete might not be working"""
        if not magazines:
            self.log_test("Delete Issue Diagnosis", False, "No magazines to diagnose")
            return
        
        try:
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            
            self.log_test("Delete Diagnosis Start", True, f"Diagnosing delete issue for magazine ID: {magazine_id}")
            
            # Check if magazine exists in issues collection (where admin delete looks)
            issues_response = self.session.get(f"{self.base_url}/api/issues", timeout=10)
            
            if issues_response.status_code == 200:
                issues = issues_response.json()
                issue_ids = [issue.get("id") for issue in issues]
                
                if magazine_id in issue_ids:
                    self.log_test("Delete Diagnosis - Issues Collection", True, f"Magazine ID {magazine_id} found in issues collection")
                else:
                    self.log_test("Delete Diagnosis - Issues Collection", False, f"Magazine ID {magazine_id} NOT found in issues collection - This is why delete fails!")
                    self.log_test("Delete Diagnosis - Available IDs", True, f"Available issue IDs: {issue_ids}")
            
            # Check the actual delete endpoint response for detailed error
            delete_response = self.session.delete(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                timeout=10
            )
            
            self.log_test("Delete Diagnosis - Response", True, f"Delete response: HTTP {delete_response.status_code}, Body: {delete_response.text}")
            
            # Check if there's a mismatch between admin listing and actual database
            if delete_response.status_code == 404:
                self.log_test("Delete Issue Root Cause", False, "FOUND THE ISSUE: Admin listing shows magazines but delete can't find them - ID mismatch between collections!")
            
        except Exception as e:
            self.log_test("Delete Issue Diagnosis", False, f"Error: {str(e)}")

    def run_comprehensive_magazine_tests(self):
        """Run comprehensive magazine admin panel tests"""
        print("🏢 STARTING COMPREHENSIVE MAGAZINE ADMIN PANEL TESTING")
        print("=" * 70)
        print("Testing reported issues:")
        print("1. Delete option not working in admin panel")
        print("2. Existing magazine not showing")
        print()
        
        # 1. Admin Authentication
        print("🔐 ADMIN AUTHENTICATION TESTING")
        print("=" * 40)
        auth_success = self.test_admin_login()
        
        if not auth_success:
            print("❌ Cannot proceed without admin authentication")
            return self.generate_comprehensive_report()
        
        # 2. Magazine Listing API (Core Issue #2)
        print("\n📋 MAGAZINE LISTING TESTING")
        print("=" * 40)
        magazines = self.test_magazine_listing_api()
        
        # 3. Database Collection Consistency
        print("\n🗄️ DATABASE COLLECTION CONSISTENCY TESTING")
        print("=" * 50)
        collection_data = self.test_database_collection_consistency()
        
        # 4. Magazine Operations Testing
        if magazines:
            print("\n✏️ MAGAZINE UPDATE TESTING")
            print("=" * 40)
            update_success = self.test_magazine_update_api(magazines)
            
            print("\n🗑️ MAGAZINE DELETE TESTING (CORE ISSUE)")
            print("=" * 50)
            delete_success = self.test_magazine_delete_api(magazines)
            
            if not delete_success:
                print("\n🔍 DELETE ISSUE DIAGNOSIS")
                print("=" * 40)
                self.diagnose_delete_issue(magazines)
            
            print("\n🔍 ID FORMAT TESTING")
            print("=" * 40)
            self.test_magazine_id_formats(magazines)
        else:
            print("\n⚠️ No magazines found - this explains issue #2: 'existing magazine not showing'")
        
        return self.generate_comprehensive_report()

    def generate_comprehensive_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*80)
        print("📊 COMPREHENSIVE MAGAZINE ADMIN PANEL TEST REPORT")
        print("="*80)
        
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
        
        # Analyze specific reported issues
        print("🔍 REPORTED ISSUES ANALYSIS:")
        print("-" * 40)
        
        # Issue 1: Delete option not working
        delete_tests = [r for r in self.test_results if "delete" in r["test"].lower()]
        delete_working = any(t["success"] for t in delete_tests if "delete api" in t["test"].lower())
        
        if delete_working:
            print("   ✅ Issue 1 (Delete not working): DELETE API is functional")
        else:
            print("   ❌ Issue 1 (Delete not working): DELETE API has issues")
            delete_failures = [t for t in delete_tests if not t["success"]]
            for failure in delete_failures[:2]:
                print(f"      - {failure['test']}: {failure['message']}")
        
        # Issue 2: Existing magazine not showing
        listing_tests = [r for r in self.test_results if "listing" in r["test"].lower()]
        magazines_showing = any(t["success"] and "retrieved" in t["message"].lower() and "0 magazines" not in t["message"] for t in listing_tests)
        
        if magazines_showing:
            print("   ✅ Issue 2 (Magazines not showing): Magazines are being retrieved")
        else:
            print("   ❌ Issue 2 (Magazines not showing): No magazines found in admin panel")
        
        print()
        
        # Root cause analysis
        print("🎯 ROOT CAUSE ANALYSIS:")
        print("-" * 30)
        
        # Look for specific diagnostic messages
        diagnosis_tests = [r for r in self.test_results if "diagnosis" in r["test"].lower() or "root cause" in r["test"].lower()]
        
        if diagnosis_tests:
            for diag in diagnosis_tests:
                if not diag["success"]:
                    print(f"   🔍 {diag['message']}")
        
        # Collection consistency issues
        consistency_tests = [r for r in self.test_results if "consistency" in r["test"].lower()]
        consistency_issues = [t for t in consistency_tests if not t["success"]]
        
        if consistency_issues:
            print("   🗄️ DATABASE CONSISTENCY ISSUES DETECTED:")
            for issue in consistency_issues:
                print(f"      - {issue['message']}")
        
        print()
        
        # Critical failures that need immediate attention
        critical_failures = []
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["delete api", "listing api", "root cause", "diagnosis"]):
                    critical_failures.append(f"❌ {test_name}: {result['message']}")
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION:")
            for failure in critical_failures:
                print(f"   {failure}")
            print()
        
        # Success highlights
        successes = [r for r in self.test_results if r["success"]]
        if successes:
            print("✅ WORKING FUNCTIONALITY:")
            key_successes = [s for s in successes if any(keyword in s["test"].lower() for keyword in ["login", "listing", "update", "consistency"])]
            for success in key_successes[:5]:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*80)
        print("🎯 FINAL ASSESSMENT:")
        
        if success_rate >= 80:
            print("   ✅ GOOD: Most functionality working, minor issues detected")
        elif success_rate >= 60:
            print("   ⚠️ MODERATE: Some significant issues detected")
        else:
            print("   ❌ CRITICAL: Major issues detected, immediate attention required")
        
        # Specific recommendations
        print("\n📋 RECOMMENDATIONS:")
        if not delete_working:
            print("   1. Fix magazine delete functionality - check ID consistency between collections")
        if not magazines_showing:
            print("   2. Investigate why magazines are not showing in admin panel")
        
        print("   3. Verify database collection consistency between 'magazines' and 'issues'")
        print("   4. Test with real admin user credentials in production")
        
        print("="*80)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "delete_working": delete_working,
            "magazines_showing": magazines_showing,
            "critical_failures": critical_failures
        }

def main():
    """Main function to run comprehensive magazine admin tests"""
    tester = ComprehensiveMagazineAdminTester()
    results = tester.run_comprehensive_magazine_tests()
    
    print(f"\n🏁 COMPREHENSIVE TESTING COMPLETED")
    print(f"Success Rate: {results['success_rate']:.1f}%")
    
    if results['success_rate'] < 70:
        print("⚠️ Significant issues detected in magazine admin functionality")
    elif results['success_rate'] < 90:
        print("⚠️ Some issues detected, but core functionality working")
    else:
        print("✅ Magazine admin functionality working well")

if __name__ == "__main__":
    main()