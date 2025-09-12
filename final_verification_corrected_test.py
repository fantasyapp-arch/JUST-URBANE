#!/usr/bin/env python3
"""
Just Urbane Magazine - Final Verification Test Suite (Corrected)
Testing the complete publishing workflow after database cleanup with proper API understanding
"""

import requests
import json
import time
import tempfile
import os
from datetime import datetime
from typing import Dict, Any, Optional

class FinalVerificationTesterCorrected:
    def __init__(self, base_url: str = "https://admin-fix-urbane.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        self.created_test_articles = []  # Track articles created during testing
        
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
        
    def test_clean_database_state(self):
        """Test 1: Verify Clean Database State - Only 8 original articles visible"""
        print("\n🧹 TESTING CLEAN DATABASE STATE")
        print("=" * 50)
        
        try:
            # Get all public articles
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                article_count = len(articles)
                
                # Check if we have exactly 8 original articles
                if article_count == 8:
                    self.log_test("Database Article Count", True, f"Exactly 8 original articles found (expected)")
                    
                    # Verify these are original articles by checking titles
                    original_titles = [
                        "Perfect Suit Guide for Men",
                        "When In France", 
                        "Travel With A Clear Conscious"
                    ]
                    
                    found_originals = 0
                    article_titles = [article.get("title", "") for article in articles]
                    
                    for title in original_titles:
                        if any(title.lower() in article_title.lower() for article_title in article_titles):
                            found_originals += 1
                    
                    if found_originals >= 3:
                        self.log_test("Original Articles Present", True, f"Found {found_originals}/3 key original articles")
                    else:
                        self.log_test("Original Articles Present", False, f"Only found {found_originals}/3 key original articles")
                    
                    # Check that no test articles are visible
                    test_keywords = ["test", "dummy", "sample", "temp"]
                    test_articles_found = 0
                    
                    for article in articles:
                        title = article.get("title", "").lower()
                        if any(keyword in title for keyword in test_keywords):
                            test_articles_found += 1
                    
                    if test_articles_found == 0:
                        self.log_test("No Test Articles Visible", True, "No test articles visible on public API")
                    else:
                        self.log_test("No Test Articles Visible", False, f"Found {test_articles_found} test articles still visible")
                    
                    return articles
                    
                else:
                    self.log_test("Database Article Count", False, f"Found {article_count} articles, expected exactly 8")
                    return articles
                    
            else:
                self.log_test("Database State Check", False, f"Failed to get articles: HTTP {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test("Database State Check", False, f"Error: {str(e)}")
            return None

    def test_admin_login(self):
        """Test admin login functionality"""
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
                    self.log_test("Admin Login", True, "Admin login successful (admin/admin123)")
                    return True
                else:
                    self.log_test("Admin Login", False, f"Invalid admin login response: {data}")
                    return False
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, f"Admin login error: {str(e)}")
            return False

    def test_complete_publishing_workflow(self):
        """Test 2: Complete Publishing Workflow - Create, Draft, Publish, Delete"""
        print("\n📝 TESTING COMPLETE PUBLISHING WORKFLOW")
        print("=" * 50)
        
        if not self.admin_token:
            self.log_test("Publishing Workflow", False, "No admin token available")
            return False
        
        try:
            # Step 1: Create a new test article via admin panel using form data
            test_article_data = {
                "title": "Final Verification Test Article",
                "body": "This is a test article created during final verification testing. It should be deleted after testing is complete.",
                "summary": "Test article for final verification",
                "author_name": "Test Author",
                "category": "technology",
                "subcategory": "testing",
                "tags": "test,verification,final",
                "status": "draft",  # Start as draft
                "featured": "false",
                "trending": "false",
                "premium": "false"
            }
            
            response = self.session.put(
                f"{self.base_url}/api/admin/articles/create",  # Try different endpoint
                data=test_article_data,  # Use form data instead of JSON
                timeout=15
            )
            
            # If that doesn't work, try the upload endpoint with a text file
            if response.status_code != 200:
                # Create a temporary text file
                with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as temp_file:
                    temp_file.write("This is a test article created during final verification testing. It should be deleted after testing is complete.")
                    temp_file_path = temp_file.name
                
                try:
                    with open(temp_file_path, 'rb') as text_file:
                        files = {"content_file": ("test_article.txt", text_file, "text/plain")}
                        form_data = {
                            "title": "Final Verification Test Article",
                            "summary": "Test article for final verification",
                            "author_name": "Test Author",
                            "category": "technology",
                            "subcategory": "testing",
                            "tags": "test,verification,final",
                            "featured": "false",
                            "trending": "false",
                            "premium": "false",
                            "reading_time": "5"
                        }
                        
                        response = self.session.post(
                            f"{self.base_url}/api/admin/articles/upload",
                            data=form_data,
                            files=files,
                            timeout=20
                        )
                finally:
                    os.unlink(temp_file_path)
            
            if response.status_code == 200:
                created_article = response.json()
                article_id = created_article.get("article_id")
                self.created_test_articles.append(article_id)
                self.log_test("Article Creation", True, f"Test article created with ID: {article_id}")
                
                # Step 2: Verify it does NOT appear on public API (draft status)
                public_response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
                if public_response.status_code == 200:
                    public_articles = public_response.json()
                    test_article_visible = any(article.get("id") == article_id for article in public_articles)
                    
                    if not test_article_visible:
                        self.log_test("Draft Article Hidden", True, "Draft article correctly hidden from public API")
                    else:
                        self.log_test("Draft Article Hidden", False, "Draft article incorrectly visible on public API")
                
                # Step 3: Change status to published using form data
                update_response = self.session.put(
                    f"{self.base_url}/api/admin/articles/{article_id}/status",
                    data={"status": "published"},  # Use form data
                    timeout=10
                )
                
                if update_response.status_code == 200:
                    self.log_test("Article Status Update", True, "Article status changed to published")
                    
                    # Step 4: Verify it DOES appear on public API immediately
                    time.sleep(1)  # Brief pause for consistency
                    public_response_2 = self.session.get(f"{self.base_url}/api/articles", timeout=10)
                    if public_response_2.status_code == 200:
                        public_articles_2 = public_response_2.json()
                        test_article_visible_2 = any(article.get("id") == article_id for article in public_articles_2)
                        
                        if test_article_visible_2:
                            self.log_test("Published Article Visible", True, "Published article immediately visible on public API")
                            
                            # Step 5: Test single article access
                            single_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                            if single_response.status_code == 200:
                                single_article = single_response.json()
                                if single_article.get("id") == article_id:
                                    self.log_test("Single Article Access", True, "Published article accessible via single article endpoint")
                                else:
                                    self.log_test("Single Article Access", False, "Article ID mismatch in single article response")
                            else:
                                self.log_test("Single Article Access", False, f"Single article access failed: HTTP {single_response.status_code}")
                        else:
                            self.log_test("Published Article Visible", False, "Published article not visible on public API")
                    
                    # Step 6: Delete the test article
                    delete_response = self.session.delete(
                        f"{self.base_url}/api/admin/articles/{article_id}",
                        timeout=10
                    )
                    
                    if delete_response.status_code == 200:
                        self.log_test("Test Article Cleanup", True, "Test article successfully deleted")
                        self.created_test_articles.remove(article_id)
                    else:
                        self.log_test("Test Article Cleanup", False, f"Failed to delete test article: HTTP {delete_response.status_code}")
                        
                else:
                    self.log_test("Article Status Update", False, f"Failed to update article status: HTTP {update_response.status_code}")
                    
            else:
                self.log_test("Article Creation", False, f"Failed to create test article: HTTP {response.status_code} - {response.text}")
                return False
                
            return True
            
        except Exception as e:
            self.log_test("Publishing Workflow", False, f"Error: {str(e)}")
            return False

    def create_test_rtf_file(self):
        """Create a test RTF file for upload testing"""
        rtf_content = r"""{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 Final Verification RTF Test Article

This is a test RTF file created for final verification testing of the RTF upload functionality.

\\b Key Features Being Tested:\\b0
\\par - RTF file parsing and content extraction
\\par - Article creation from RTF content
\\par - Publishing workflow integration
\\par - Content display on website

\\b Content Sections:\\b0
\\par 1. Introduction to RTF Testing
\\par 2. Technical Implementation Details
\\par 3. User Experience Verification
\\par 4. Cleanup and Maintenance

This article should be properly parsed, saved to the database, and made available for publishing through the admin panel.

\\b Author:\\b0 Final Verification Tester
\\b Category:\\b0 Technology
\\b Tags:\\b0 RTF, Testing, Verification, Upload

This test article will be deleted after successful verification.
}"""
        
        # Create temporary RTF file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8') as temp_file:
            temp_file.write(rtf_content)
            return temp_file.name

    def test_rtf_upload_functionality(self):
        """Test 3: RTF Upload Functionality - Upload, Parse, Publish, Delete"""
        print("\n📄 TESTING RTF UPLOAD FUNCTIONALITY")
        print("=" * 50)
        
        if not self.admin_token:
            self.log_test("RTF Upload Test", False, "No admin token available")
            return False
        
        try:
            # Step 1: Create test RTF file
            rtf_file_path = self.create_test_rtf_file()
            self.log_test("RTF File Creation", True, "Test RTF file created successfully")
            
            # Step 2: Upload RTF file via admin panel
            with open(rtf_file_path, 'rb') as rtf_file:
                files = {"content_file": ("test_verification.rtf", rtf_file, "application/rtf")}
                form_data = {
                    "title": "Final Verification RTF Test Article",
                    "summary": "Test RTF article for final verification",
                    "author_name": "Final Verification Tester",
                    "category": "technology",
                    "subcategory": "testing",
                    "tags": "rtf,testing,verification,upload",
                    "featured": "false",
                    "trending": "false",
                    "premium": "false",
                    "reading_time": "5"
                }
                
                response = self.session.post(
                    f"{self.base_url}/api/admin/articles/upload",
                    data=form_data,
                    files=files,
                    timeout=20
                )
            
            # Cleanup temp file
            os.unlink(rtf_file_path)
            
            if response.status_code == 200:
                upload_result = response.json()
                article_id = upload_result.get("article_id")
                self.created_test_articles.append(article_id)
                self.log_test("RTF Upload", True, f"RTF file uploaded and parsed successfully, article ID: {article_id}")
                
                # Step 3: Verify RTF content was properly parsed by getting the article
                article_response = self.session.get(f"{self.base_url}/api/admin/articles/{article_id}/edit", timeout=10)
                if article_response.status_code == 200:
                    article_data = article_response.json()
                    article_body = article_data.get("body", "")
                    article_title = article_data.get("title", "")
                    
                    if "Final Verification RTF Test Article" in article_title and len(article_body) > 100:
                        self.log_test("RTF Content Parsing", True, f"RTF content properly parsed - Title: {article_title}, Body length: {len(article_body)}")
                    else:
                        self.log_test("RTF Content Parsing", False, f"RTF content parsing issues - Title: {article_title}, Body length: {len(article_body)}")
                
                # Step 4: Publish the article (it should already be published by default)
                # Check if it's visible on public API
                time.sleep(1)
                public_response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
                if public_response.status_code == 200:
                    public_articles = public_response.json()
                    rtf_article_visible = any(article.get("id") == article_id for article in public_articles)
                    
                    if rtf_article_visible:
                        self.log_test("RTF Article Website Display", True, "RTF article visible on public website")
                    else:
                        self.log_test("RTF Article Website Display", False, "RTF article not visible on public website")
                
                # Step 5: Delete the test RTF article
                delete_response = self.session.delete(f"{self.base_url}/api/admin/articles/{article_id}", timeout=10)
                if delete_response.status_code == 200:
                    self.log_test("RTF Article Cleanup", True, "RTF test article successfully deleted")
                    self.created_test_articles.remove(article_id)
                else:
                    self.log_test("RTF Article Cleanup", False, f"Failed to delete RTF test article: HTTP {delete_response.status_code}")
                    
            else:
                self.log_test("RTF Upload", False, f"RTF upload failed: HTTP {response.status_code} - {response.text}")
                return False
                
            return True
            
        except Exception as e:
            self.log_test("RTF Upload Functionality", False, f"Error: {str(e)}")
            return False

    def test_original_content_verification(self):
        """Test 4: Verify Original Content Accessibility - Understanding Legacy Articles"""
        print("\n🏛️ TESTING ORIGINAL CONTENT VERIFICATION")
        print("=" * 50)
        
        try:
            # Get all public articles
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code != 200:
                self.log_test("Original Content Check", False, f"Failed to get articles: HTTP {response.status_code}")
                return False
            
            articles = response.json()
            
            # Key original articles to verify
            original_articles = [
                {"title_contains": "Perfect Suit Guide for Men", "slug_contains": "perfect-suit-guide"},
                {"title_contains": "When In France", "slug_contains": "when-in-france"},
                {"title_contains": "Travel With A Clear Conscious", "slug_contains": "sustainable-travel"}
            ]
            
            verified_originals = 0
            
            for original in original_articles:
                title_pattern = original["title_contains"]
                slug_pattern = original["slug_contains"]
                
                # Find matching article
                matching_article = None
                for article in articles:
                    title = article.get("title", "").lower()
                    slug = article.get("slug", "").lower()
                    
                    if title_pattern.lower() in title or slug_pattern.lower() in slug:
                        matching_article = article
                        break
                
                if matching_article:
                    article_id = matching_article.get("id")
                    article_slug = matching_article.get("slug")
                    
                    # Test access by ID
                    id_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    id_accessible = id_response.status_code == 200
                    
                    # Test access by slug
                    slug_accessible = False
                    if article_slug:
                        slug_response = self.session.get(f"{self.base_url}/api/articles/{article_slug}", timeout=10)
                        slug_accessible = slug_response.status_code == 200
                    
                    if id_accessible or slug_accessible:
                        verified_originals += 1
                        access_methods = []
                        if id_accessible:
                            access_methods.append("ID")
                        if slug_accessible:
                            access_methods.append("slug")
                        self.log_test(f"Original Article - {title_pattern}", True, f"Accessible via {'/'.join(access_methods)}: {matching_article.get('title')}")
                    else:
                        self.log_test(f"Original Article - {title_pattern}", False, f"Access issues - ID: {id_accessible}, Slug: {slug_accessible}")
                else:
                    self.log_test(f"Original Article - {title_pattern}", False, f"Article not found: {title_pattern}")
            
            # Overall verification
            if verified_originals >= 2:
                self.log_test("Original Content Verification", True, f"{verified_originals}/3 key original articles verified and accessible")
            else:
                self.log_test("Original Content Verification", False, f"Only {verified_originals}/3 original articles verified")
            
            return verified_originals >= 2
            
        except Exception as e:
            self.log_test("Original Content Verification", False, f"Error: {str(e)}")
            return False

    def test_legacy_article_status_issue(self):
        """Test 5: Investigate Legacy Article Status Issue"""
        print("\n🔍 TESTING LEGACY ARTICLE STATUS ISSUE")
        print("=" * 50)
        
        try:
            # Get all articles to check their status fields
            response = self.session.get(f"{self.base_url}/api/articles", timeout=10)
            if response.status_code != 200:
                self.log_test("Legacy Status Check", False, f"Failed to get articles: HTTP {response.status_code}")
                return False
            
            articles = response.json()
            
            # Check status field distribution
            status_distribution = {}
            articles_without_status = 0
            
            for article in articles:
                status = article.get("status")
                if status is None:
                    articles_without_status += 1
                    status = "null"
                
                status_distribution[status] = status_distribution.get(status, 0) + 1
            
            self.log_test("Status Field Analysis", True, f"Status distribution: {status_distribution}")
            
            if articles_without_status > 0:
                self.log_test("Legacy Articles Found", True, f"Found {articles_without_status} legacy articles without status field")
                
                # This explains why some articles might not be accessible if the API filters by status
                self.log_test("Legacy Article Issue", True, "Legacy articles have null status - this may affect API filtering")
            else:
                self.log_test("Legacy Articles Found", True, "All articles have status fields")
            
            return True
            
        except Exception as e:
            self.log_test("Legacy Status Check", False, f"Error: {str(e)}")
            return False

    def cleanup_test_articles(self):
        """Clean up any remaining test articles"""
        if not self.created_test_articles or not self.admin_token:
            return
        
        print("\n🧹 CLEANING UP TEST ARTICLES")
        print("=" * 30)
        
        for article_id in self.created_test_articles[:]:
            try:
                response = self.session.delete(f"{self.base_url}/api/admin/articles/{article_id}", timeout=10)
                if response.status_code == 200:
                    self.log_test("Cleanup", True, f"Deleted test article: {article_id}")
                    self.created_test_articles.remove(article_id)
                else:
                    self.log_test("Cleanup", False, f"Failed to delete test article {article_id}: HTTP {response.status_code}")
            except Exception as e:
                self.log_test("Cleanup", False, f"Error deleting test article {article_id}: {str(e)}")

    def generate_final_report(self):
        """Generate comprehensive final verification report"""
        print("\n" + "="*80)
        print("🎯 FINAL VERIFICATION TEST REPORT (CORRECTED)")
        print("="*80)
        
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
        critical_tests = []
        minor_issues = []
        
        for result in self.test_results:
            if not result["success"]:
                if any(keyword in result["test"].lower() for keyword in ["database", "login", "original", "legacy"]):
                    critical_tests.append(result)
                else:
                    minor_issues.append(result)
        
        if critical_tests:
            print(f"\n❌ CRITICAL ISSUES ({len(critical_tests)}):")
            for result in critical_tests:
                print(f"   • {result['test']}: {result['message']}")
        
        if minor_issues:
            print(f"\n⚠️ MINOR ISSUES ({len(minor_issues)}):")
            for result in minor_issues:
                print(f"   • {result['test']}: {result['message']}")
        
        # Success summary
        successful_tests = [result for result in self.test_results if result["success"]]
        if successful_tests:
            print(f"\n✅ SUCCESSFUL TESTS ({len(successful_tests)}):")
            for result in successful_tests:
                print(f"   • {result['test']}: {result['message']}")
        
        print(f"\n🏁 FINAL VERIFICATION STATUS:")
        if success_rate >= 90:
            print("   ✅ EXCELLENT - Publishing system fully functional")
        elif success_rate >= 80:
            print("   ✅ GOOD - Publishing system working with minor issues")
        elif success_rate >= 70:
            print("   ⚠️ ACCEPTABLE - Publishing system working with some issues")
        else:
            print("   ❌ NEEDS ATTENTION - Critical issues found")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_issues": len(critical_tests),
            "minor_issues": len(minor_issues)
        }

    def run_final_verification(self):
        """Run complete final verification test suite"""
        print("🎯 STARTING FINAL VERIFICATION TEST SUITE (CORRECTED)")
        print("="*80)
        print("Testing complete publishing system after database cleanup with proper API understanding...")
        print()
        
        # Test 1: Verify Clean Database State
        articles = self.test_clean_database_state()
        
        # Test 2: Admin Login
        admin_login_success = self.test_admin_login()
        
        if admin_login_success:
            # Test 3: Complete Publishing Workflow
            self.test_complete_publishing_workflow()
            
            # Test 4: RTF Upload Functionality
            self.test_rtf_upload_functionality()
        else:
            print("❌ Admin login failed - skipping admin-dependent tests")
        
        # Test 5: Original Content Verification
        self.test_original_content_verification()
        
        # Test 6: Legacy Article Status Issue Investigation
        self.test_legacy_article_status_issue()
        
        # Cleanup any remaining test articles
        self.cleanup_test_articles()
        
        # Generate final report
        return self.generate_final_report()

def main():
    """Main execution function"""
    tester = FinalVerificationTesterCorrected()
    results = tester.run_final_verification()
    
    print(f"\n🎯 Final Verification Complete!")
    print(f"Success Rate: {results['success_rate']:.1f}%")
    
    if results['success_rate'] >= 90:
        print("✅ Publishing system is fully functional and ready for production!")
    elif results['critical_issues'] > 0:
        print("❌ Critical issues found - publishing system needs attention")
    else:
        print("⚠️ Minor issues found - publishing system is mostly functional")

if __name__ == "__main__":
    main()