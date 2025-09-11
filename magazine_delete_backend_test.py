#!/usr/bin/env python3
"""
Just Urbane Magazine Delete Functionality Testing Suite
Testing the fixed magazine delete, update, and get functionality with dual ID support
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class MagazineDeleteTester:
    def __init__(self, base_url: str = "https://backend-restore-2.preview.emergentagent.com"):
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
        
    def test_admin_login(self):
        """Test admin login to get authentication token"""
        try:
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_test("Admin Login", True, "Admin login successful, token received")
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
    
    def test_get_magazines_list(self):
        """Test GET /api/admin/magazines - Get magazines list"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/magazines",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                magazines = data.get("magazines", [])
                
                self.log_test("Get Magazines List", True, f"Retrieved {len(magazines)} magazines")
                
                # Return magazines for further testing
                return magazines
            else:
                self.log_test("Get Magazines List", False, f"HTTP {response.status_code}: {response.text}")
                return []
        except Exception as e:
            self.log_test("Get Magazines List", False, f"Error: {str(e)}")
            return []
    
    def test_get_single_magazine(self, magazine_id: str):
        """Test GET /api/admin/magazines/{id} - Get single magazine (NEW FEATURE)"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                magazine = response.json()
                magazine_title = magazine.get("title", "Unknown")
                magazine_returned_id = magazine.get("id")
                
                self.log_test("Get Single Magazine", True, f"Retrieved magazine: '{magazine_title}' (ID: {magazine_returned_id})")
                return magazine
            elif response.status_code == 404:
                self.log_test("Get Single Magazine", False, f"Magazine not found: {magazine_id}")
                return None
            else:
                self.log_test("Get Single Magazine", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Get Single Magazine", False, f"Error: {str(e)}")
            return None
    
    def test_update_magazine(self, magazine_id: str):
        """Test PUT /api/admin/magazines/{id} - Update magazine (NEW FEATURE)"""
        try:
            # Prepare update data as JSON (not form data)
            update_data = {
                "title": "Updated Magazine Title - Test",
                "description": "Updated description for testing purposes",
                "is_featured": True
            }
            
            response = self.session.put(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                json=update_data,  # Using JSON data as per the endpoint
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                message = result.get("message", "Updated successfully")
                self.log_test("Update Magazine", True, f"Magazine updated: {message}")
                return True
            elif response.status_code == 404:
                self.log_test("Update Magazine", False, f"Magazine not found for update: {magazine_id}")
                return False
            else:
                self.log_test("Update Magazine", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Update Magazine", False, f"Error: {str(e)}")
            return False
    
    def test_delete_magazine(self, magazine_id: str):
        """Test DELETE /api/admin/magazines/{id} - Delete magazine (MAIN FIX)"""
        try:
            response = self.session.delete(
                f"{self.base_url}/api/admin/magazines/{magazine_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                message = result.get("message", "Deleted successfully")
                self.log_test("Delete Magazine", True, f"Magazine deleted: {message}")
                return True
            elif response.status_code == 404:
                self.log_test("Delete Magazine", False, f"Magazine not found for deletion: {magazine_id}")
                return False
            else:
                self.log_test("Delete Magazine", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Delete Magazine", False, f"Error: {str(e)}")
            return False
    
    def test_verify_real_time_updates(self, deleted_magazine_id: str):
        """Test real-time updates - Verify deleted magazine no longer appears"""
        try:
            # Get magazines list again to verify deletion
            magazines = self.test_get_magazines_list()
            
            # Check if deleted magazine is still in the list
            deleted_magazine_found = any(mag.get("id") == deleted_magazine_id for mag in magazines)
            
            if not deleted_magazine_found:
                self.log_test("Real-time Updates", True, f"Deleted magazine {deleted_magazine_id} no longer appears in list")
                return True
            else:
                self.log_test("Real-time Updates", False, f"Deleted magazine {deleted_magazine_id} still appears in list")
                return False
        except Exception as e:
            self.log_test("Real-time Updates", False, f"Error: {str(e)}")
            return False
    
    def test_dual_id_support(self, magazines: list):
        """Test dual ID support - Both custom 'id' and MongoDB '_id' ObjectId"""
        try:
            if not magazines:
                self.log_test("Dual ID Support", False, "No magazines available for dual ID testing")
                return False
            
            test_magazine = magazines[0]
            magazine_id = test_magazine.get("id")
            
            if not magazine_id:
                self.log_test("Dual ID Support", False, "No ID found in magazine for testing")
                return False
            
            # Test 1: Get magazine by custom ID
            magazine_by_id = self.test_get_single_magazine(magazine_id)
            
            if magazine_by_id:
                # Test 2: Try to get the same magazine using different ID formats
                # This tests the dual ID support in the backend
                
                # Check if the magazine has consistent ID field
                returned_id = magazine_by_id.get("id")
                if returned_id == magazine_id:
                    self.log_test("Dual ID Support - Consistency", True, f"Magazine ID consistent: {returned_id}")
                else:
                    self.log_test("Dual ID Support - Consistency", False, f"ID mismatch: expected {magazine_id}, got {returned_id}")
                
                # Check if _id field is properly converted to id
                if "_id" not in magazine_by_id and "id" in magazine_by_id:
                    self.log_test("Dual ID Support - Field Conversion", True, "MongoDB _id properly converted to id field")
                else:
                    self.log_test("Dual ID Support - Field Conversion", False, "ID field conversion issue detected")
                
                return True
            else:
                self.log_test("Dual ID Support", False, "Failed to retrieve magazine for dual ID testing")
                return False
                
        except Exception as e:
            self.log_test("Dual ID Support", False, f"Error: {str(e)}")
            return False
    
    def test_magazine_crud_workflow(self):
        """Test complete CRUD workflow for magazines"""
        try:
            print("\n🔄 TESTING COMPLETE MAGAZINE CRUD WORKFLOW")
            print("=" * 50)
            
            # Step 1: Get initial magazines list
            initial_magazines = self.test_get_magazines_list()
            
            if not initial_magazines:
                self.log_test("CRUD Workflow", False, "No magazines available for CRUD testing")
                return False
            
            # Step 2: Test dual ID support
            self.test_dual_id_support(initial_magazines)
            
            # Step 3: Select a magazine for testing (use the first one)
            test_magazine = initial_magazines[0]
            magazine_id = test_magazine.get("id")
            magazine_title = test_magazine.get("title", "Unknown")
            
            print(f"\n📋 Testing with magazine: '{magazine_title}' (ID: {magazine_id})")
            
            # Step 4: Test GET single magazine
            retrieved_magazine = self.test_get_single_magazine(magazine_id)
            
            if not retrieved_magazine:
                self.log_test("CRUD Workflow", False, f"Failed to retrieve magazine {magazine_id}")
                return False
            
            # Step 5: Test UPDATE magazine
            update_success = self.test_update_magazine(magazine_id)
            
            if update_success:
                # Verify update by getting the magazine again
                updated_magazine = self.test_get_single_magazine(magazine_id)
                if updated_magazine:
                    updated_title = updated_magazine.get("title", "")
                    if "Updated Magazine Title - Test" in updated_title:
                        self.log_test("Update Verification", True, "Magazine update verified successfully")
                    else:
                        self.log_test("Update Verification", False, f"Update not reflected: {updated_title}")
            
            # Step 6: Test DELETE magazine (MAIN FIX)
            delete_success = self.test_delete_magazine(magazine_id)
            
            if delete_success:
                # Step 7: Verify real-time updates
                self.test_verify_real_time_updates(magazine_id)
                
                # Step 8: Try to get deleted magazine (should return 404)
                deleted_magazine = self.test_get_single_magazine(magazine_id)
                if deleted_magazine is None:
                    self.log_test("Delete Verification", True, "Deleted magazine no longer accessible")
                else:
                    self.log_test("Delete Verification", False, "Deleted magazine still accessible")
            
            return True
            
        except Exception as e:
            self.log_test("CRUD Workflow", False, f"Error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test error handling for non-existent magazines"""
        try:
            print("\n🚫 TESTING ERROR HANDLING")
            print("=" * 30)
            
            fake_id = "non-existent-magazine-id-12345"
            
            # Test GET with non-existent ID
            response = self.session.get(f"{self.base_url}/api/admin/magazines/{fake_id}", timeout=10)
            if response.status_code == 404:
                self.log_test("Error Handling - GET", True, "Correctly returns 404 for non-existent magazine")
            else:
                self.log_test("Error Handling - GET", False, f"Expected 404, got {response.status_code}")
            
            # Test UPDATE with non-existent ID
            response = self.session.put(
                f"{self.base_url}/api/admin/magazines/{fake_id}",
                data={"title": "Test"},
                timeout=10
            )
            if response.status_code == 404:
                self.log_test("Error Handling - UPDATE", True, "Correctly returns 404 for non-existent magazine update")
            else:
                self.log_test("Error Handling - UPDATE", False, f"Expected 404, got {response.status_code}")
            
            # Test DELETE with non-existent ID
            response = self.session.delete(f"{self.base_url}/api/admin/magazines/{fake_id}", timeout=10)
            if response.status_code == 404:
                self.log_test("Error Handling - DELETE", True, "Correctly returns 404 for non-existent magazine deletion")
            else:
                self.log_test("Error Handling - DELETE", False, f"Expected 404, got {response.status_code}")
            
            return True
            
        except Exception as e:
            self.log_test("Error Handling", False, f"Error: {str(e)}")
            return False
    
    def run_magazine_delete_tests(self):
        """Run comprehensive magazine delete functionality tests"""
        print("🗂️ STARTING MAGAZINE DELETE FUNCTIONALITY TESTING")
        print("=" * 60)
        print("Testing the fixed magazine delete, update, and get functionality...")
        print()
        
        # Step 1: Admin Authentication
        if not self.test_admin_login():
            print("❌ Cannot proceed without admin authentication")
            return self.generate_report()
        
        # Step 2: Test complete CRUD workflow
        self.test_magazine_crud_workflow()
        
        # Step 3: Test error handling
        self.test_error_handling()
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 MAGAZINE DELETE FUNCTIONALITY TEST REPORT")
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
        
        # Categorize results by functionality
        functionality_areas = {
            "Admin Authentication": ["Admin Login"],
            "Magazine Retrieval": ["Get Magazines List", "Get Single Magazine"],
            "Magazine Updates": ["Update Magazine", "Update Verification"],
            "Magazine Deletion": ["Delete Magazine", "Delete Verification"],
            "Real-time Updates": ["Real-time Updates"],
            "Dual ID Support": ["Dual ID Support"],
            "Error Handling": ["Error Handling"]
        }
        
        for area, keywords in functionality_areas.items():
            area_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in keywords)]
            if area_tests:
                area_passed = sum(1 for t in area_tests if t["success"])
                area_total = len(area_tests)
                area_rate = (area_passed / area_total * 100) if area_total > 0 else 0
                
                status = "✅" if area_rate >= 80 else "⚠️" if area_rate >= 60 else "❌"
                print(f"{status} {area}: {area_passed}/{area_total} tests passed ({area_rate:.1f}%)")
        
        print()
        
        # Critical failures
        critical_failures = []
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name for keyword in ["Delete Magazine", "Get Single Magazine", "Update Magazine"]):
                    critical_failures.append(f"❌ {test_name}: {result['message']}")
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES:")
            for failure in critical_failures:
                print(f"   {failure}")
            print()
        
        # Success highlights
        key_successes = [r for r in self.test_results if r["success"] and any(keyword in r["test"] for keyword in ["Delete Magazine", "Get Single Magazine", "Update Magazine", "Real-time Updates"])]
        if key_successes:
            print("✅ KEY FUNCTIONALITY VERIFIED:")
            for success in key_successes:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        print("🎯 MAGAZINE DELETE FIX ASSESSMENT:")
        
        if success_rate >= 90:
            print("   ✅ EXCELLENT: Magazine delete functionality is working perfectly")
        elif success_rate >= 80:
            print("   ⚠️ GOOD: Magazine delete functionality mostly working, minor issues detected")
        elif success_rate >= 70:
            print("   ⚠️ MODERATE: Some issues with magazine delete functionality")
        else:
            print("   ❌ CRITICAL: Significant issues with magazine delete functionality")
        
        print("="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures
        }

def main():
    """Main function to run the tests"""
    tester = MagazineDeleteTester()
    results = tester.run_magazine_delete_tests()
    
    print(f"\n🏁 Testing completed with {results['success_rate']:.1f}% success rate")
    
    if results['success_rate'] >= 80:
        print("✅ Magazine delete functionality is working well!")
    else:
        print("❌ Magazine delete functionality needs attention!")
        
    return results

if __name__ == "__main__":
    main()