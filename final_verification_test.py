#!/usr/bin/env python3
"""
Just Urbane Magazine - Final Verification Test
Complete verification of yacht article restoration and publishing system
"""

import requests
import json
import time
import tempfile
import os
from datetime import datetime
from typing import Dict, Any, Optional, List

class FinalVerificationTester:
    def __init__(self, base_url: str = "https://admin-fix-urbane.preview.emergentagent.com"):
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
        """Test admin login with admin/admin123"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json={"username": "admin", "password": "admin123"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    self.log_test("Admin Authentication", True, "Admin login successful with admin/admin123")
                    return True
            
            self.log_test("Admin Authentication", False, f"Login failed: HTTP {response.status_code}")
            return False
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Error: {str(e)}")
            return False

    def verify_website_state(self):
        """Verify Website State - Requirement 1"""
        print("\n🌐 VERIFYING WEBSITE STATE")
        print("="*35)
        
        # 1.1: Check that Sunseeker yacht article is hero article
        try:
            response = self.session.get(f"{self.base_url}/api/homepage/content", timeout=10)
            if response.status_code == 200:
                data = response.json()
                hero_article = data.get("hero_article")
                
                if hero_article:
                    title = hero_article.get("title", "")
                    featured = hero_article.get("featured", False)
                    
                    if "sunseeker" in title.lower() and "yacht" in title.lower():
                        self.log_test("Yacht Article as Hero", True, f"✅ Sunseeker yacht article is hero: '{title}'")
                        
                        if featured:
                            self.log_test("Yacht Article Featured", True, "✅ Yacht article has featured status")
                        else:
                            self.log_test("Yacht Article Featured", False, "❌ Yacht article not marked as featured")
                    else:
                        self.log_test("Yacht Article as Hero", False, f"❌ Hero article is not yacht article: '{title}'")
                else:
                    self.log_test("Yacht Article as Hero", False, "❌ No hero article found")
            else:
                self.log_test("Yacht Article as Hero", False, f"❌ Homepage API failed: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Yacht Article as Hero", False, f"❌ Error: {str(e)}")
        
        # 1.2: Verify only published articles are visible
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=50", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    draft_count = 0
                    published_count = 0
                    
                    for article in articles:
                        status = article.get("status", "published")  # Legacy articles
                        if status == "draft":
                            draft_count += 1
                        else:
                            published_count += 1
                    
                    if draft_count == 0:
                        self.log_test("Only Published Articles Visible", True, f"✅ Only published articles visible: {published_count} articles, 0 drafts")
                    else:
                        self.log_test("Only Published Articles Visible", False, f"❌ Draft articles visible: {draft_count} drafts found")
                else:
                    self.log_test("Only Published Articles Visible", False, "❌ Invalid response format")
            else:
                self.log_test("Only Published Articles Visible", False, f"❌ Articles API failed: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Only Published Articles Visible", False, f"❌ Error: {str(e)}")
        
        # 1.3: Confirm original articles are accessible
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list):
                    total_count = len(articles)
                    yacht_found = False
                    
                    for article in articles:
                        title = article.get("title", "").lower()
                        if "sunseeker" in title or "yacht" in title:
                            yacht_found = True
                            break
                    
                    if total_count >= 8:
                        self.log_test("Original Articles Count", True, f"✅ Found {total_count} articles (expected 8+)")
                    else:
                        self.log_test("Original Articles Count", False, f"❌ Only {total_count} articles found (expected 8+)")
                    
                    if yacht_found:
                        self.log_test("Yacht Article Accessible", True, "✅ Yacht article is accessible")
                    else:
                        self.log_test("Yacht Article Accessible", False, "❌ Yacht article not found")
                else:
                    self.log_test("Original Articles Count", False, "❌ Invalid response format")
            else:
                self.log_test("Original Articles Count", False, f"❌ Articles API failed: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Original Articles Count", False, f"❌ Error: {str(e)}")

    def test_publishing_system(self):
        """Test Publishing System - Requirement 2"""
        print("\n📝 TESTING PUBLISHING SYSTEM")
        print("="*35)
        
        if not self.auth_token:
            self.log_test("Publishing System Test", False, "❌ No admin authentication - cannot test publishing")
            return
        
        # 2.1: Test admin can create new articles (via RTF upload)
        try:
            rtf_content = r"""{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}
\f0\fs24 This is a test article to verify the publishing system is working correctly.

The publishing workflow should allow creating articles and managing their status.

This test verifies the complete publishing pipeline.
}"""
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False) as temp_file:
                temp_file.write(rtf_content)
                temp_file_path = temp_file.name
            
            form_data = {
                "title": f"Publishing Test Article {int(time.time())}",
                "summary": "Test article to verify publishing system",
                "author_name": "Test Author",
                "category": "technology",
                "subcategory": "testing",
                "tags": "test,publishing,verification",
                "featured": "false",
                "trending": "false",
                "premium": "false",
                "reading_time": "2"
            }
            
            with open(temp_file_path, 'rb') as rtf_file:
                files = {"content_file": ("test_article.rtf", rtf_file, "application/rtf")}
                response = self.session.post(
                    f"{self.base_url}/api/admin/articles/upload",
                    data=form_data,
                    files=files,
                    timeout=15
                )
            
            os.unlink(temp_file_path)
            
            if response.status_code == 200:
                result = response.json()
                article_id = result.get("article_id")
                if article_id:
                    self.log_test("Admin Article Creation", True, f"✅ Admin can create articles: {article_id}")
                    
                    # 2.2: Test publishing workflow (draft -> published)
                    try:
                        # Update article status to published using the correct endpoint
                        status_data = {"status": "published"}
                        response = self.session.put(
                            f"{self.base_url}/api/admin/articles/{article_id}/status",
                            json=status_data,
                            headers={"Content-Type": "application/json"},
                            timeout=10
                        )
                        
                        if response.status_code == 200:
                            self.log_test("Publishing Workflow", True, "✅ Draft to published workflow working")
                            
                            # 2.3: Test immediate visibility
                            time.sleep(2)  # Wait for database update
                            
                            response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                            if response.status_code == 200:
                                article_data = response.json()
                                if article_data.get("status") == "published":
                                    self.log_test("Immediate Article Visibility", True, "✅ Published articles appear immediately")
                                else:
                                    self.log_test("Immediate Article Visibility", False, f"❌ Article status not updated: {article_data.get('status')}")
                            else:
                                self.log_test("Immediate Article Visibility", False, f"❌ Published article not accessible: HTTP {response.status_code}")
                        else:
                            self.log_test("Publishing Workflow", False, f"❌ Status update failed: HTTP {response.status_code}")
                    except Exception as e:
                        self.log_test("Publishing Workflow", False, f"❌ Error: {str(e)}")
                    
                    # Cleanup
                    try:
                        self.session.delete(f"{self.base_url}/api/admin/articles/{article_id}", timeout=10)
                        self.log_test("Test Article Cleanup", True, "✅ Test article cleaned up")
                    except:
                        pass
                else:
                    self.log_test("Admin Article Creation", False, "❌ No article ID returned")
            else:
                self.log_test("Admin Article Creation", False, f"❌ Article creation failed: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Admin Article Creation", False, f"❌ Error: {str(e)}")

    def verify_article_order(self):
        """Verify Article Order - Requirement 3"""
        print("\n📊 VERIFYING ARTICLE ORDER")
        print("="*30)
        
        # 3.1: Confirm featured articles appear first
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                if isinstance(articles, list) and articles:
                    featured_positions = []
                    non_featured_positions = []
                    
                    for i, article in enumerate(articles):
                        if article.get("featured", False):
                            featured_positions.append(i)
                        else:
                            non_featured_positions.append(i)
                    
                    if featured_positions and non_featured_positions:
                        first_featured = min(featured_positions)
                        first_non_featured = min(non_featured_positions)
                        
                        if first_featured < first_non_featured:
                            self.log_test("Featured Articles First", True, f"✅ Featured articles appear first (pos {first_featured} vs {first_non_featured})")
                        else:
                            self.log_test("Featured Articles First", False, f"❌ Featured articles not first (pos {first_featured} vs {first_non_featured})")
                    elif featured_positions:
                        self.log_test("Featured Articles First", True, "✅ Only featured articles found (correct ordering)")
                    else:
                        self.log_test("Featured Articles First", True, "✅ No featured articles (ordering not applicable)")
                    
                    # 3.2: Check yacht article has featured status and is first
                    first_article = articles[0]
                    first_title = first_article.get("title", "")
                    first_featured = first_article.get("featured", False)
                    
                    if ("sunseeker" in first_title.lower() or "yacht" in first_title.lower()) and first_featured:
                        self.log_test("Yacht Article Order", True, f"✅ Yacht article is featured and first: '{first_title}'")
                    else:
                        self.log_test("Yacht Article Order", False, f"❌ First article issue: '{first_title}' (featured: {first_featured})")
                else:
                    self.log_test("Featured Articles First", False, "❌ No articles found for ordering test")
            else:
                self.log_test("Featured Articles First", False, f"❌ Articles API failed: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Featured Articles First", False, f"❌ Error: {str(e)}")

    def generate_final_report(self):
        """Generate final comprehensive report"""
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*80)
        print("🎯 FINAL VERIFICATION REPORT - YACHT ARTICLE RESTORATION")
        print("="*80)
        print(f"📊 OVERALL RESULTS: {passed_tests}/{total_tests} tests passed ({success_rate:.1f}% success rate)")
        print()
        
        # Requirements summary
        requirements = {
            "1. Website State Verification": [],
            "2. Publishing System Testing": [],
            "3. Article Order Verification": [],
            "Admin Authentication": []
        }
        
        for result in self.test_results:
            test_name = result["test"]
            if any(keyword in test_name for keyword in ["Hero", "Visible", "Count", "Accessible"]):
                requirements["1. Website State Verification"].append(result)
            elif any(keyword in test_name for keyword in ["Creation", "Workflow", "Immediate", "Cleanup"]):
                requirements["2. Publishing System Testing"].append(result)
            elif any(keyword in test_name for keyword in ["First", "Order"]):
                requirements["3. Article Order Verification"].append(result)
            elif "Authentication" in test_name:
                requirements["Admin Authentication"].append(result)
        
        for requirement, results in requirements.items():
            if results:
                passed = sum(1 for r in results if r["success"])
                total = len(results)
                status = "✅ PASS" if passed == total else "⚠️ PARTIAL" if passed > 0 else "❌ FAIL"
                print(f"{status} {requirement}: {passed}/{total} tests passed")
                
                for result in results:
                    status_icon = "✅" if result["success"] else "❌"
                    print(f"    {status_icon} {result['test']}")
                print()
        
        # Final assessment
        print("🎯 FINAL ASSESSMENT")
        print("="*20)
        
        website_state_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in ["Hero", "Visible", "Count", "Accessible"])]
        publishing_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in ["Creation", "Workflow", "Immediate"])]
        order_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in ["First", "Order"])]
        
        website_state_pass = all(r["success"] for r in website_state_tests)
        publishing_pass = all(r["success"] for r in publishing_tests)
        order_pass = all(r["success"] for r in order_tests)
        
        if website_state_pass:
            print("✅ Website State: RESTORED - Yacht article is back on top as requested")
        else:
            print("❌ Website State: ISSUES - Yacht article restoration incomplete")
            
        if publishing_pass:
            print("✅ Publishing System: WORKING - Admin can create and publish articles")
        else:
            print("⚠️ Publishing System: PARTIAL - Some publishing functionality working")
            
        if order_pass:
            print("✅ Article Order: CORRECT - Featured articles appear first, yacht article featured")
        else:
            print("❌ Article Order: ISSUES - Article ordering problems detected")
        
        print()
        print("🎉 SUMMARY:")
        if website_state_pass and order_pass:
            print("✅ PRIMARY GOAL ACHIEVED: Yacht article successfully restored to top position")
            print("✅ WEBSITE LOOKS LIKE ORIGINAL: With yacht article featured as requested")
        
        if publishing_pass:
            print("✅ PUBLISHING SYSTEM: Fully functional for future content management")
        
        print(f"📊 Overall Success Rate: {success_rate:.1f}%")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "success_rate": success_rate,
            "website_state_restored": website_state_pass,
            "publishing_system_working": publishing_pass,
            "article_order_correct": order_pass
        }

    def run_final_verification(self):
        """Run complete final verification"""
        print("🚢 FINAL VERIFICATION - YACHT ARTICLE RESTORATION")
        print("="*60)
        print("Verifying that the website has been restored to its original state")
        print("with the yacht article on top and publishing system working...")
        print()
        
        # Admin Authentication
        print("🔐 ADMIN AUTHENTICATION")
        print("="*25)
        self.test_admin_login()
        
        # Run all verification tests
        self.verify_website_state()
        self.test_publishing_system()
        self.verify_article_order()
        
        # Generate final report
        return self.generate_final_report()

def main():
    """Main function"""
    tester = FinalVerificationTester()
    report = tester.run_final_verification()
    
    print("\n" + "="*60)
    print("🎯 VERIFICATION COMPLETE")
    print("="*60)
    
    if report["website_state_restored"] and report["article_order_correct"]:
        print("🎉 SUCCESS: Website restored with yacht article on top!")
    else:
        print("⚠️ ISSUES: Some restoration problems detected")
    
    if report["publishing_system_working"]:
        print("✅ Publishing system is fully functional")
    else:
        print("⚠️ Publishing system has some limitations")

if __name__ == "__main__":
    main()