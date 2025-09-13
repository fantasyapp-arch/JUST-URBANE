#!/usr/bin/env python3
"""
Corrected Just Urbane Article Publishing Test Suite
Using proper admin endpoints and form data as required by the backend
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class CorrectedPublishingTester:
    def __init__(self, base_url: str = "https://content-phoenix.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        self.admin_credentials = {"username": "admin", "password": "admin123"}
        
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
        """Login as admin to access admin functionality"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json=self.admin_credentials,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
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

    def check_database_state(self):
        """Check current database state using admin endpoint"""
        print("\n🗄️ CHECKING DATABASE STATE VIA ADMIN ENDPOINT")
        print("=" * 55)
        
        try:
            # Use admin articles endpoint
            response = self.session.get(f"{self.base_url}/api/admin/articles?limit=50", timeout=10)
            if response.status_code == 200:
                data = response.json()
                articles = data.get("articles", [])
                total_count = data.get("total_count", 0)
                
                self.log_test("Admin Articles Access", True, f"Retrieved {len(articles)} articles (total: {total_count})")
                
                # Analyze articles
                published_articles = [a for a in articles if a.get("status") == "published"]
                draft_articles = [a for a in articles if a.get("status") != "published"]
                
                print("\n📊 DATABASE ANALYSIS:")
                print(f"   Total Articles: {total_count}")
                print(f"   Published: {len(published_articles)}")
                print(f"   Draft/Other: {len(draft_articles)}")
                
                # Show sample articles
                print("\n📋 SAMPLE ARTICLES:")
                print("-" * 80)
                print(f"{'ID':<10} {'Title':<35} {'Status':<10} {'Category':<12}")
                print("-" * 80)
                
                for article in articles[:10]:
                    article_id = str(article.get("id", "N/A"))[:8]
                    title = str(article.get("title", "No Title"))[:33]
                    status = str(article.get("status", "unknown"))
                    category = str(article.get("category", "N/A"))[:10]
                    print(f"{article_id:<10} {title:<35} {status:<10} {category:<12}")
                
                if len(articles) > 10:
                    print(f"... and {len(articles) - 10} more articles")
                print("-" * 80)
                
                return {
                    "articles": articles,
                    "total_count": total_count,
                    "published": published_articles,
                    "drafts": draft_articles
                }
            else:
                self.log_test("Admin Articles Access", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_test("Admin Articles Access", False, f"Error: {str(e)}")
            return None

    def test_article_publishing_via_status_update(self, article_data):
        """Test publishing articles by updating their status"""
        print("\n📤 TESTING ARTICLE PUBLISHING VIA STATUS UPDATE")
        print("=" * 55)
        
        if not article_data or not article_data.get("drafts"):
            self.log_test("Article Publishing Test", False, "No draft articles available for publishing test")
            return False
            
        try:
            # Find a draft article to publish
            draft_articles = article_data["drafts"]
            test_article = draft_articles[0]
            article_id = test_article.get("id")
            title = test_article.get("title", "Unknown")
            
            print(f"   Publishing article: {title[:50]}...")
            
            # Update status to published using form data
            form_data = {"status": "published"}
            
            response = self.session.put(
                f"{self.base_url}/api/admin/articles/{article_id}/status",
                data=form_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("Article Status Update", True, f"Article status updated: {result.get('message')}")
                
                # Verify the article is now published in public API
                time.sleep(2)  # Allow for database propagation
                
                public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                if public_response.status_code == 200:
                    public_article = public_response.json()
                    if public_article.get("status") == "published":
                        self.log_test("Public Article Visibility", True, 
                                    f"Published article now visible in public API")
                        return True
                    else:
                        self.log_test("Public Article Visibility", False, 
                                    f"Article status in public API: {public_article.get('status')}")
                        return False
                else:
                    self.log_test("Public Article Visibility", False, 
                                f"Article not accessible via public API: HTTP {public_response.status_code}")
                    return False
            else:
                self.log_test("Article Status Update", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Article Publishing Test", False, f"Error: {str(e)}")
            return False

    def test_article_editing_workflow(self, article_data):
        """Test article editing using proper admin endpoints"""
        print("\n✏️ TESTING ARTICLE EDITING WORKFLOW")
        print("=" * 40)
        
        if not article_data or not article_data.get("articles"):
            self.log_test("Article Editing Test", False, "No articles available for editing test")
            return False
            
        try:
            # Get an article to edit
            articles = article_data["articles"]
            test_article = articles[0]
            article_id = test_article.get("id")
            original_title = test_article.get("title", "")
            
            print(f"   Editing article: {original_title[:50]}...")
            
            # Update article using form data (as required by admin endpoint)
            updated_title = f"EDITED: {original_title} - {datetime.now().strftime('%H:%M:%S')}"
            form_data = {
                "title": updated_title,
                "summary": "This article has been edited to test the editing workflow functionality.",
                "status": "published"
            }
            
            response = self.session.put(
                f"{self.base_url}/api/admin/articles/{article_id}",
                data=form_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("Article Update", True, f"Article updated: {result.get('message')}")
                
                # Verify the update by getting the article for edit
                time.sleep(1)
                verify_response = self.session.get(
                    f"{self.base_url}/api/admin/articles/{article_id}/edit", 
                    timeout=10
                )
                
                if verify_response.status_code == 200:
                    updated_article = verify_response.json()
                    if updated_article.get("title") == updated_title:
                        self.log_test("Article Edit Verification", True, 
                                    f"Edit verified: title updated successfully")
                        return True
                    else:
                        self.log_test("Article Edit Verification", False, 
                                    f"Edit not reflected. Expected: '{updated_title}', Got: '{updated_article.get('title')}'")
                        return False
                else:
                    self.log_test("Article Edit Verification", False, 
                                f"Cannot verify edit: HTTP {verify_response.status_code}")
                    return False
            else:
                self.log_test("Article Update", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Article Editing Test", False, f"Error: {str(e)}")
            return False

    def test_rtf_file_upload(self):
        """Test RTF file upload functionality"""
        print("\n📁 TESTING RTF FILE UPLOAD")
        print("=" * 30)
        
        try:
            # Create a simple RTF file content
            rtf_content = """{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 Test Article from RTF Upload
\\par
\\par This is a comprehensive test article created from RTF file upload functionality.
\\par
\\par The article content includes:
\\par - Rich text formatting capabilities
\\par - Multiple structured paragraphs
\\par - Professional content organization
\\par
\\par This tests the complete RTF upload and parsing workflow to ensure that:
\\par 1. RTF files can be properly uploaded
\\par 2. Content is correctly parsed and extracted
\\par 3. Articles are created with proper metadata
\\par 4. The publishing workflow functions correctly
\\par
\\par This functionality is essential for content management and editorial workflows.
}"""
            
            # Prepare form data and file
            form_data = {
                'title': 'RTF Upload Test Article - Real Content',
                'summary': 'A comprehensive test of RTF file upload functionality with real content structure.',
                'author_name': 'Test Editor',
                'category': 'technology',
                'subcategory': 'testing',
                'tags': 'rtf-upload,testing,content-management',
                'featured': 'false',
                'trending': 'false',
                'premium': 'false',
                'reading_time': '3',
                'hero_image_url': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&q=80'
            }
            
            files = {
                'content_file': ('test_article.rtf', rtf_content.encode('utf-8'), 'application/rtf')
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/articles/upload",
                files=files,
                data=form_data,
                timeout=15
            )
            
            if response.status_code == 200:
                result = response.json()
                article_id = result.get("article_id")
                self.log_test("RTF File Upload", True, 
                            f"RTF uploaded successfully: {result.get('title')} (ID: {article_id[:8] if article_id else 'N/A'})")
                
                # Verify the uploaded article exists and is accessible
                if article_id:
                    time.sleep(2)
                    verify_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    if verify_response.status_code == 200:
                        uploaded_article = verify_response.json()
                        if uploaded_article.get("status") == "published":
                            self.log_test("RTF Upload Verification", True, 
                                        "Uploaded RTF article is published and accessible")
                            return True
                        else:
                            self.log_test("RTF Upload Verification", False, 
                                        f"Uploaded article status: {uploaded_article.get('status')}")
                            return False
                    else:
                        self.log_test("RTF Upload Verification", False, 
                                    f"Cannot access uploaded article: HTTP {verify_response.status_code}")
                        return False
                else:
                    self.log_test("RTF Upload Verification", False, "No article ID returned")
                    return False
            else:
                self.log_test("RTF File Upload", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("RTF File Upload", False, f"Error: {str(e)}")
            return False

    def test_public_website_display(self):
        """Test if published articles appear on public website"""
        print("\n🌐 TESTING PUBLIC WEBSITE DISPLAY")
        print("=" * 40)
        
        try:
            # Get all articles from public API
            response = self.session.get(f"{self.base_url}/api/articles?limit=50", timeout=10)
            if response.status_code == 200:
                public_articles = response.json()
                if isinstance(public_articles, list):
                    published_count = len([a for a in public_articles if a.get("status") == "published"])
                    total_count = len(public_articles)
                    
                    self.log_test("Public Articles API", True, 
                                f"Public API returned {total_count} articles, {published_count} published")
                    
                    if published_count > 0:
                        # Show published articles
                        published_articles = [a for a in public_articles if a.get("status") == "published"]
                        
                        print("\n📋 PUBLISHED ARTICLES ON PUBLIC WEBSITE:")
                        print("-" * 70)
                        for i, article in enumerate(published_articles[:10]):
                            title = article.get("title", "No Title")[:45]
                            category = article.get("category", "N/A")
                            print(f"{i+1:2d}. {title} | {category}")
                        
                        if len(published_articles) > 10:
                            print(f"    ... and {len(published_articles) - 10} more published articles")
                        print("-" * 70)
                        
                        self.log_test("Published Articles Display", True, 
                                    f"{published_count} published articles visible on public website")
                        return True
                    else:
                        self.log_test("Published Articles Display", False, 
                                    "No published articles found on public website")
                        return False
                else:
                    self.log_test("Public Articles API", False, f"Invalid response format: {type(public_articles)}")
                    return False
            else:
                self.log_test("Public Articles API", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Public Website Display", False, f"Error: {str(e)}")
            return False

    def test_bulk_publishing(self, article_data):
        """Test bulk publishing of multiple articles"""
        print("\n📦 TESTING BULK PUBLISHING")
        print("=" * 30)
        
        if not article_data or not article_data.get("drafts"):
            self.log_test("Bulk Publishing Test", False, "No draft articles available for bulk publishing")
            return False
            
        try:
            # Get up to 3 draft articles for bulk publishing
            draft_articles = article_data["drafts"][:3]
            article_ids = [str(a.get("id")) for a in draft_articles]
            
            if not article_ids:
                self.log_test("Bulk Publishing Test", False, "No valid article IDs found")
                return False
            
            print(f"   Bulk publishing {len(article_ids)} articles...")
            
            # Use bulk update endpoint
            form_data = {
                "article_ids": ",".join(article_ids),
                "action": "status",
                "value": "published"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/articles/bulk-update",
                data=form_data,
                timeout=15
            )
            
            if response.status_code == 200:
                result = response.json()
                updated_count = result.get("updated_count", 0)
                self.log_test("Bulk Publishing", True, 
                            f"Bulk update completed: {updated_count} articles published")
                
                # Verify some articles are now published
                time.sleep(2)
                verification_count = 0
                for article_id in article_ids[:2]:  # Check first 2
                    verify_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                    if verify_response.status_code == 200:
                        article = verify_response.json()
                        if article.get("status") == "published":
                            verification_count += 1
                
                if verification_count > 0:
                    self.log_test("Bulk Publishing Verification", True, 
                                f"{verification_count} articles verified as published")
                    return True
                else:
                    self.log_test("Bulk Publishing Verification", False, 
                                "No articles could be verified as published")
                    return False
            else:
                self.log_test("Bulk Publishing", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Bulk Publishing Test", False, f"Error: {str(e)}")
            return False

    def generate_final_report(self):
        """Generate final comprehensive report"""
        print("\n" + "="*80)
        print("🎯 CORRECTED ARTICLE PUBLISHING TEST REPORT")
        print("="*80)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["success"]])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\n📊 FINAL RESULTS:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests} ✅")
        print(f"   Failed: {failed_tests} ❌")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        # Categorize results
        critical_issues = []
        minor_issues = []
        successes = []
        
        for result in self.test_results:
            if not result["success"]:
                if any(keyword in result["test"].lower() for keyword in 
                      ["publishing", "upload", "display", "status"]):
                    critical_issues.append(result)
                else:
                    minor_issues.append(result)
            else:
                successes.append(result)
        
        if critical_issues:
            print(f"\n🚨 CRITICAL ISSUES ({len(critical_issues)}):")
            for issue in critical_issues:
                print(f"   ❌ {issue['test']}: {issue['message']}")
        
        if minor_issues:
            print(f"\n⚠️ MINOR ISSUES ({len(minor_issues)}):")
            for issue in minor_issues:
                print(f"   ⚠️ {issue['test']}: {issue['message']}")
        
        print(f"\n✅ SUCCESSFUL OPERATIONS ({len(successes)}):")
        for success in successes:
            print(f"   ✅ {success['test']}: {success['message']}")
        
        # Overall assessment
        print(f"\n🎯 OVERALL ASSESSMENT:")
        if success_rate >= 80:
            print("   🎉 Article publishing system is working well!")
            assessment = "WORKING"
        elif success_rate >= 60:
            print("   ⚠️ Article publishing system has some issues that need attention")
            assessment = "NEEDS_ATTENTION"
        else:
            print("   🚨 Article publishing system has significant problems")
            assessment = "BROKEN"
        
        return {
            "total_tests": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": success_rate,
            "assessment": assessment,
            "critical_issues": critical_issues,
            "minor_issues": minor_issues,
            "all_results": self.test_results
        }

    def run_corrected_tests(self):
        """Run corrected comprehensive tests"""
        print("🎯 STARTING CORRECTED ARTICLE PUBLISHING TESTS")
        print("="*80)
        print("Using proper admin endpoints and form data formats...")
        print()
        
        # Step 1: Admin Login
        if not self.admin_login():
            print("❌ Cannot proceed without admin access")
            return self.generate_final_report()
        
        # Step 2: Check Database State
        article_data = self.check_database_state()
        
        # Step 3: Test Article Publishing via Status Update
        if article_data:
            self.test_article_publishing_via_status_update(article_data)
        
        # Step 4: Test Article Editing
        if article_data:
            self.test_article_editing_workflow(article_data)
        
        # Step 5: Test RTF File Upload
        self.test_rtf_file_upload()
        
        # Step 6: Test Public Website Display
        self.test_public_website_display()
        
        # Step 7: Test Bulk Publishing
        if article_data:
            self.test_bulk_publishing(article_data)
        
        # Generate Final Report
        return self.generate_final_report()

def main():
    """Main function"""
    print("🚀 Corrected Just Urbane Article Publishing Test Suite")
    print("=" * 65)
    print("Testing with proper admin endpoints and form data formats")
    print()
    
    tester = CorrectedPublishingTester()
    results = tester.run_corrected_tests()
    
    print("\n" + "="*80)
    print("🏁 CORRECTED TESTING COMPLETE")
    print("="*80)
    
    return results

if __name__ == "__main__":
    main()