#!/usr/bin/env python3
"""
Just Urbane Admin Panel Backend Testing - Database Schema Mismatch Fix Verification
Testing the fixed admin panel backend to verify that database schema mismatch issues have been resolved.
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class AdminSchemaFixTester:
    def __init__(self, base_url: str = "https://justurb-panel.preview.emergentagent.com"):
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
        
    def test_admin_authentication(self):
        """Test admin login endpoint"""
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
                if data.get("access_token") and data.get("token_type") == "bearer":
                    self.admin_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                    self.log_test("Admin Authentication", True, "Admin login successful, JWT token received")
                    return True
                else:
                    self.log_test("Admin Authentication", False, f"Invalid admin login response: {data}")
                    return False
            else:
                self.log_test("Admin Authentication", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Admin login error: {str(e)}")
            return False

    def test_article_crud_operations(self):
        """Test Article CRUD Operations - Previously failing due to schema mismatch"""
        print("\n📝 ARTICLE CRUD OPERATIONS TESTING")
        print("=" * 45)
        
        if not self.admin_token:
            self.log_test("Article CRUD Setup", False, "No admin authentication token available")
            return
        
        # Test 1: GET /api/admin/articles (list articles)
        try:
            response = self.session.get(f"{self.base_url}/api/admin/articles", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                articles = data.get("articles", [])
                if isinstance(articles, list):
                    self.log_test("GET /api/admin/articles", True, f"Retrieved {len(articles)} articles successfully")
                    
                    # Test with actual article IDs from database
                    if articles:
                        test_article = articles[0]
                        article_id = test_article.get("id")
                        
                        if article_id:
                            # Test 2: GET /api/admin/articles/{id}/edit (get article for editing)
                            self.test_article_edit_endpoint(article_id)
                            
                            # Test 3: PUT /api/admin/articles/{id} (update article)
                            self.test_article_update_endpoint(article_id)
                            
                            # Test 4: DELETE /api/admin/articles/{id} (delete article) - Use a copy
                            # We'll test delete with a non-existent ID to avoid deleting real data
                            self.test_article_delete_endpoint("non-existent-id")
                        else:
                            self.log_test("Article ID Field", False, "Article missing 'id' field - schema mismatch issue")
                    else:
                        self.log_test("Article Database Content", False, "No articles found in database")
                else:
                    self.log_test("GET /api/admin/articles", False, f"Invalid response format: {type(articles)}")
            else:
                self.log_test("GET /api/admin/articles", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("GET /api/admin/articles", False, f"Error: {str(e)}")

    def test_article_edit_endpoint(self, article_id: str):
        """Test GET /api/admin/articles/{id}/edit endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/admin/articles/{article_id}/edit", timeout=10)
            
            if response.status_code == 200:
                article_data = response.json()
                if article_data.get("id") == article_id:
                    self.log_test("GET /api/admin/articles/{id}/edit", True, f"Successfully retrieved article for editing: {article_data.get('title', 'Unknown')}")
                    
                    # Check for proper field structure
                    required_fields = ["id", "title", "body", "category", "author_name"]
                    missing_fields = [field for field in required_fields if field not in article_data]
                    
                    if not missing_fields:
                        self.log_test("Article Edit Data Structure", True, "All required fields present in edit response")
                    else:
                        self.log_test("Article Edit Data Structure", False, f"Missing fields: {missing_fields}")
                        
                else:
                    self.log_test("GET /api/admin/articles/{id}/edit", False, "Article ID mismatch in edit response")
            else:
                self.log_test("GET /api/admin/articles/{id}/edit", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("GET /api/admin/articles/{id}/edit", False, f"Error: {str(e)}")

    def test_article_update_endpoint(self, article_id: str):
        """Test PUT /api/admin/articles/{id} endpoint"""
        try:
            # Test update with minimal data to avoid changing actual content
            update_data = {
                "reading_time": 6  # Safe field to update
            }
            
            response = self.session.put(
                f"{self.base_url}/api/admin/articles/{article_id}",
                data=update_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Article updated successfully":
                    self.log_test("PUT /api/admin/articles/{id}", True, "Article update successful")
                else:
                    self.log_test("PUT /api/admin/articles/{id}", False, f"Unexpected response: {result}")
            else:
                self.log_test("PUT /api/admin/articles/{id}", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("PUT /api/admin/articles/{id}", False, f"Error: {str(e)}")

    def test_article_delete_endpoint(self, article_id: str):
        """Test DELETE /api/admin/articles/{id} endpoint"""
        try:
            response = self.session.delete(f"{self.base_url}/api/admin/articles/{article_id}", timeout=10)
            
            # For non-existent ID, we expect 404
            if response.status_code == 404:
                self.log_test("DELETE /api/admin/articles/{id}", True, "Delete endpoint working - properly handles non-existent IDs")
            elif response.status_code == 200:
                self.log_test("DELETE /api/admin/articles/{id}", True, "Delete endpoint working - successful deletion")
            else:
                self.log_test("DELETE /api/admin/articles/{id}", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("DELETE /api/admin/articles/{id}", False, f"Error: {str(e)}")

    def test_magazine_crud_operations(self):
        """Test Magazine CRUD Operations"""
        print("\n📖 MAGAZINE CRUD OPERATIONS TESTING")
        print("=" * 45)
        
        if not self.admin_token:
            self.log_test("Magazine CRUD Setup", False, "No admin authentication token available")
            return
        
        # Test 1: GET /api/admin/magazines (list magazines)
        try:
            response = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                magazines = data.get("magazines", [])
                if isinstance(magazines, list):
                    self.log_test("GET /api/admin/magazines", True, f"Retrieved {len(magazines)} magazines successfully")
                    
                    if magazines:
                        # Test with existing magazine
                        test_magazine = magazines[0]
                        magazine_id = test_magazine.get("id")
                        
                        if magazine_id:
                            self.test_magazine_single_retrieval(magazine_id)
                        else:
                            self.log_test("Magazine ID Field", False, "Magazine missing 'id' field - schema mismatch issue")
                    else:
                        self.log_test("Magazine Database Content", True, "No magazines found in database (expected for new installation)")
                else:
                    self.log_test("GET /api/admin/magazines", False, f"Invalid response format: {type(magazines)}")
            else:
                self.log_test("GET /api/admin/magazines", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("GET /api/admin/magazines", False, f"Error: {str(e)}")
        
        # Test 2: POST /api/admin/magazines/upload (test upload validation)
        self.test_magazine_upload_validation()

    def test_magazine_single_retrieval(self, magazine_id: str):
        """Test single magazine retrieval"""
        try:
            response = self.session.get(f"{self.base_url}/api/admin/magazines/{magazine_id}", timeout=10)
            
            if response.status_code == 200:
                magazine_data = response.json()
                if magazine_data.get("id") == magazine_id:
                    self.log_test("GET /api/admin/magazines/{id}", True, f"Successfully retrieved magazine: {magazine_data.get('title', 'Unknown')}")
                else:
                    self.log_test("GET /api/admin/magazines/{id}", False, "Magazine ID mismatch in response")
            else:
                self.log_test("GET /api/admin/magazines/{id}", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("GET /api/admin/magazines/{id}", False, f"Error: {str(e)}")

    def test_magazine_upload_validation(self):
        """Test POST /api/admin/magazines/upload validation"""
        try:
            # Test upload endpoint accessibility (without actual file)
            response = self.session.post(
                f"{self.base_url}/api/admin/magazines/upload",
                data={"title": "Test Magazine"},
                timeout=10
            )
            
            # We expect 422 (validation error) since we're not sending a file
            if response.status_code == 422:
                self.log_test("POST /api/admin/magazines/upload", True, "Upload endpoint accessible with proper validation")
            elif response.status_code == 400:
                self.log_test("POST /api/admin/magazines/upload", True, "Upload endpoint accessible with proper validation")
            else:
                self.log_test("POST /api/admin/magazines/upload", False, f"Unexpected response: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("POST /api/admin/magazines/upload", False, f"Error: {str(e)}")

    def test_database_content_verification(self):
        """Test Database Content Verification - Confirm existing articles can be accessed by their _id"""
        print("\n🗄️ DATABASE CONTENT VERIFICATION")
        print("=" * 40)
        
        # Test public articles API to verify database content
        try:
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list) and articles:
                    self.log_test("Database Articles Access", True, f"Found {len(articles)} articles in database")
                    
                    # Test accessing articles by their IDs
                    test_article = articles[0]
                    article_id = test_article.get("id")
                    
                    if article_id:
                        # Test single article access
                        single_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                        
                        if single_response.status_code == 200:
                            single_article = single_response.json()
                            if single_article.get("id") == article_id:
                                self.log_test("Article Access by ID", True, f"Successfully accessed article by ID: {article_id}")
                                
                                # Check for proper ID field conversion (_id to id)
                                if "id" in single_article and "_id" not in single_article:
                                    self.log_test("Database Schema Fix", True, "Article has 'id' field and no '_id' field - schema conversion working")
                                else:
                                    self.log_test("Database Schema Fix", False, "Article still has '_id' field or missing 'id' field")
                            else:
                                self.log_test("Article Access by ID", False, "Article ID mismatch in response")
                        else:
                            self.log_test("Article Access by ID", False, f"Failed to access article: HTTP {single_response.status_code}")
                    else:
                        self.log_test("Article ID Field", False, "Article missing 'id' field - schema mismatch not fixed")
                        
                    # Check category distribution
                    categories = set(article.get("category", "unknown") for article in articles)
                    self.log_test("Database Categories", True, f"Found articles in categories: {', '.join(sorted(categories))}")
                    
                else:
                    self.log_test("Database Articles Access", False, "No articles found in database")
            else:
                self.log_test("Database Articles Access", False, f"Failed to access articles: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Database Content Verification", False, f"Error: {str(e)}")

    def test_specific_user_issues(self):
        """Test User's Specific Issues from the review request"""
        print("\n🎯 USER-SPECIFIC ISSUES TESTING")
        print("=" * 40)
        
        # Issue 1: Test if article editing now works (was HTTP 500 before)
        if self.admin_token:
            try:
                # Get articles first
                response = self.session.get(f"{self.base_url}/api/admin/articles", timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get("articles", [])
                    
                    if articles:
                        article_id = articles[0].get("id")
                        if article_id:
                            # Test edit endpoint that was previously failing
                            edit_response = self.session.get(f"{self.base_url}/api/admin/articles/{article_id}/edit", timeout=10)
                            
                            if edit_response.status_code == 200:
                                self.log_test("Article Editing Fix", True, "Article editing now works - no more HTTP 500 errors")
                            else:
                                self.log_test("Article Editing Fix", False, f"Article editing still failing: HTTP {edit_response.status_code}")
                        else:
                            self.log_test("Article Editing Fix", False, "Cannot test - articles missing ID field")
                    else:
                        self.log_test("Article Editing Fix", False, "Cannot test - no articles in database")
                else:
                    self.log_test("Article Editing Fix", False, f"Cannot get articles: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test("Article Editing Fix", False, f"Error testing article editing: {str(e)}")
        
        # Issue 2: Verify magazine list and upload endpoints are accessible
        try:
            # Magazine list
            mag_response = self.session.get(f"{self.base_url}/api/admin/magazines", timeout=10)
            if mag_response.status_code == 200:
                self.log_test("Magazine List Access", True, "Magazine list endpoint accessible")
            else:
                self.log_test("Magazine List Access", False, f"Magazine list failed: HTTP {mag_response.status_code}")
            
            # Magazine upload validation
            upload_response = self.session.post(
                f"{self.base_url}/api/admin/magazines/upload",
                data={"title": "Test"},
                timeout=10
            )
            
            # Expect validation error (422) since no file provided
            if upload_response.status_code in [400, 422]:
                self.log_test("Magazine Upload Access", True, "Magazine upload endpoint accessible with validation")
            else:
                self.log_test("Magazine Upload Access", False, f"Magazine upload unexpected response: HTTP {upload_response.status_code}")
                
        except Exception as e:
            self.log_test("Magazine Endpoints Access", False, f"Error: {str(e)}")

    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("🎯 ADMIN PANEL SCHEMA FIX TEST REPORT")
        print("="*70)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\n📊 OVERALL RESULTS:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {failed_tests}")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        # Categorize results
        critical_failures = []
        minor_issues = []
        successes = []
        
        for result in self.test_results:
            if not result["success"]:
                if any(keyword in result["test"].lower() for keyword in ["authentication", "schema", "crud", "edit", "update"]):
                    critical_failures.append(result)
                else:
                    minor_issues.append(result)
            else:
                successes.append(result)
        
        if critical_failures:
            print(f"\n❌ CRITICAL FAILURES ({len(critical_failures)}):")
            for failure in critical_failures:
                print(f"   • {failure['test']}: {failure['message']}")
        
        if minor_issues:
            print(f"\n⚠️ MINOR ISSUES ({len(minor_issues)}):")
            for issue in minor_issues:
                print(f"   • {issue['test']}: {issue['message']}")
        
        print(f"\n✅ SUCCESSFUL TESTS ({len(successes)}):")
        for success in successes[:10]:  # Show first 10 successes
            print(f"   • {success['test']}: {success['message']}")
        
        if len(successes) > 10:
            print(f"   ... and {len(successes) - 10} more successful tests")
        
        # Key findings
        print(f"\n🔍 KEY FINDINGS:")
        
        # Check if schema fix is working
        schema_tests = [r for r in self.test_results if "schema" in r["test"].lower() or "id field" in r["test"].lower()]
        if schema_tests:
            schema_success = all(r["success"] for r in schema_tests)
            if schema_success:
                print("   ✅ Database schema mismatch issues appear to be RESOLVED")
            else:
                print("   ❌ Database schema mismatch issues still present")
        
        # Check article CRUD operations
        crud_tests = [r for r in self.test_results if any(op in r["test"].lower() for op in ["get /api/admin/articles", "put /api/admin/articles", "delete /api/admin/articles"])]
        if crud_tests:
            crud_success = all(r["success"] for r in crud_tests)
            if crud_success:
                print("   ✅ Article CRUD operations are working correctly")
            else:
                print("   ❌ Some article CRUD operations still failing")
        
        # Check admin authentication
        auth_tests = [r for r in self.test_results if "authentication" in r["test"].lower()]
        if auth_tests and auth_tests[0]["success"]:
            print("   ✅ Admin authentication is working correctly")
        elif auth_tests:
            print("   ❌ Admin authentication is failing")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": len(critical_failures),
            "minor_issues": len(minor_issues),
            "test_results": self.test_results
        }

    def run_comprehensive_test(self):
        """Run comprehensive admin panel schema fix testing"""
        print("🎯 STARTING ADMIN PANEL SCHEMA FIX TESTING")
        print("=" * 70)
        print("Testing the fixed admin panel backend to verify database schema mismatch resolution...")
        print()
        
        # 1. Admin Authentication
        auth_success = self.test_admin_authentication()
        
        if not auth_success:
            print("❌ Admin authentication failed - cannot proceed with admin-specific tests")
            # Still run public tests
            self.test_database_content_verification()
            return self.generate_test_report()
        
        # 2. Article CRUD Operations (main focus)
        self.test_article_crud_operations()
        
        # 3. Magazine CRUD Operations
        self.test_magazine_crud_operations()
        
        # 4. Database Content Verification
        self.test_database_content_verification()
        
        # 5. User-Specific Issues
        self.test_specific_user_issues()
        
        # 6. Generate Report
        return self.generate_test_report()

if __name__ == "__main__":
    tester = AdminSchemaFixTester()
    report = tester.run_comprehensive_test()
    
    print(f"\n🏁 TESTING COMPLETED")
    print(f"Success Rate: {report['success_rate']:.1f}%")
    
    if report['success_rate'] >= 80:
        print("✅ Admin panel schema fix appears to be working well!")
    elif report['success_rate'] >= 60:
        print("⚠️ Admin panel has some issues but core functionality working")
    else:
        print("❌ Admin panel has significant issues requiring attention")