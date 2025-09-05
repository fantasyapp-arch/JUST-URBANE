#!/usr/bin/env python3
"""
Comprehensive Fashion > Men Subcategory Testing
Based on review request to verify cleanup and image fix
"""

import requests
import json
import time
from datetime import datetime

class FashionMenComprehensiveTester:
    def __init__(self, base_url: str = "https://style-luxury-mag.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, response_data=None):
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
        
    def run_comprehensive_tests(self):
        """Run all comprehensive tests for Fashion > Men subcategory"""
        print("🧹 COMPREHENSIVE FASHION > MEN SUBCATEGORY TESTING")
        print("=" * 70)
        print("Review Request Requirements:")
        print("1. Call /api/articles?category=fashion&subcategory=men to confirm only 1 article remains")
        print("2. Check 'Perfect Suit Guide for Men' article has new working hero image URL")
        print("3. Test hero image URL is accessible (not returning HTTP 422)")
        print("4. Verify all article data is intact after cleanup and update")
        print("5. Confirm thumbnail should now display properly")
        print()
        
        # Test 1: API Health Check
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                self.log_test("API Health Check", True, "Backend API is healthy and responding")
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}")
                return self.generate_report()
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return self.generate_report()
        
        # Test 2: Fashion > Men Articles Count and Content
        try:
            response = self.session.get(f"{self.base_url}/articles?category=fashion&subcategory=men", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                article_count = len(articles)
                
                # Log current state
                self.log_test("Fashion Men Articles Retrieved", True, f"Found {article_count} articles in Fashion > Men subcategory")
                
                # Requirement 1: Should be only 1 article
                if article_count == 1:
                    self.log_test("Article Count Requirement", True, "✅ Exactly 1 article remains as required")
                    target_article = articles[0]
                else:
                    self.log_test("Article Count Requirement", False, f"❌ Found {article_count} articles, expected 1. Cleanup needed.")
                    
                    # Find the Perfect Suit Guide article
                    target_article = None
                    for article in articles:
                        title = article.get("title", "").lower()
                        if "perfect" in title and "suit" in title and "guide" in title:
                            target_article = article
                            break
                    
                    if not target_article:
                        self.log_test("Perfect Suit Guide Article Found", False, "❌ Perfect Suit Guide article not found among the articles")
                        return self.generate_report()
                
                # Test the target article (Perfect Suit Guide)
                if target_article:
                    self.test_perfect_suit_guide_article(target_article)
                    
            else:
                self.log_test("Fashion Men Articles Retrieved", False, f"HTTP {response.status_code}: {response.text}")
                return self.generate_report()
                
        except Exception as e:
            self.log_test("Fashion Men Articles Retrieved", False, f"Error: {str(e)}")
            return self.generate_report()
        
        return self.generate_report()
    
    def test_perfect_suit_guide_article(self, article):
        """Test the Perfect Suit Guide article comprehensively"""
        
        # Test 2: Verify article title and identity
        title = article.get("title", "")
        if "perfect" in title.lower() and "suit" in title.lower() and "guide" in title.lower():
            self.log_test("Perfect Suit Guide Identity", True, f"✅ Correct article found: '{title}'")
        else:
            self.log_test("Perfect Suit Guide Identity", False, f"❌ Unexpected article: '{title}'")
        
        # Test 3: Hero Image URL Accessibility (Key Requirement)
        hero_image_url = article.get("hero_image")
        if hero_image_url:
            self.log_test("Hero Image URL Present", True, f"✅ Hero image URL found: {hero_image_url}")
            
            # Test if image is accessible
            try:
                image_response = self.session.head(hero_image_url, timeout=15, allow_redirects=True)
                
                if image_response.status_code == 200:
                    content_type = image_response.headers.get('content-type', '')
                    content_length = image_response.headers.get('content-length', 'Unknown')
                    self.log_test("Hero Image Accessibility", True, f"✅ Hero image is accessible (HTTP 200, {content_type}, {content_length} bytes)")
                elif image_response.status_code == 422:
                    self.log_test("Hero Image Accessibility", False, f"❌ CRITICAL: Hero image returns HTTP 422 (Unprocessable Entity) - SAME ISSUE AS BEFORE")
                else:
                    self.log_test("Hero Image Accessibility", False, f"❌ Hero image not accessible (HTTP {image_response.status_code})")
                    
            except Exception as e:
                self.log_test("Hero Image Accessibility", False, f"❌ Image URL connection error: {str(e)}")
        else:
            self.log_test("Hero Image URL Present", False, "❌ No hero image URL found")
        
        # Test 4: Article Data Integrity
        required_fields = ["id", "title", "body", "hero_image", "author_name", "category", "subcategory", "slug"]
        missing_fields = [field for field in required_fields if not article.get(field)]
        
        if not missing_fields:
            self.log_test("Article Data Integrity", True, f"✅ All required fields present: {', '.join(required_fields)}")
            
            # Check data quality
            body_length = len(article.get("body", ""))
            if body_length > 1000:
                self.log_test("Article Content Quality", True, f"✅ Substantial content: {body_length} characters")
            else:
                self.log_test("Article Content Quality", False, f"❌ Content may be insufficient: {body_length} characters")
                
            # Verify categorization
            category = article.get("category", "").lower()
            subcategory = article.get("subcategory", "").lower()
            if category == "fashion" and subcategory == "men":
                self.log_test("Correct Categorization", True, f"✅ Properly categorized: {category}/{subcategory}")
            else:
                self.log_test("Correct Categorization", False, f"❌ Wrong categorization: {category}/{subcategory}")
        else:
            self.log_test("Article Data Integrity", False, f"❌ Missing fields: {', '.join(missing_fields)}")
        
        # Test 5: Thumbnail Display Readiness
        thumbnail_ready = (
            article.get("hero_image") and 
            article.get("title") and 
            article.get("category") and 
            article.get("author_name")
        )
        
        if thumbnail_ready:
            self.log_test("Thumbnail Display Readiness", True, "✅ All data required for thumbnail display is present")
        else:
            self.log_test("Thumbnail Display Readiness", False, "❌ Missing data required for thumbnail display")
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 FASHION > MEN COMPREHENSIVE TEST REPORT")
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
        
        # Analyze results for review request requirements
        critical_issues = []
        successes = []
        
        for result in self.test_results:
            if not result["success"]:
                if any(keyword in result["test"].lower() for keyword in ["article count", "hero image accessibility", "perfect suit guide"]):
                    critical_issues.append(f"❌ {result['test']}: {result['message']}")
            else:
                successes.append(f"✅ {result['test']}: {result['message']}")
        
        if critical_issues:
            print("🚨 CRITICAL ISSUES FOUND:")
            for issue in critical_issues:
                print(f"   {issue}")
            print()
        
        if successes:
            print("✅ SUCCESSFUL VERIFICATIONS:")
            for success in successes[:5]:  # Show top 5
                print(f"   {success}")
            print()
        
        # Summary for main agent
        print("📋 REVIEW REQUEST STATUS:")
        
        # Check each requirement
        requirements_status = {
            "Only 1 article in Fashion > Men": any("Article Count Requirement" in r["test"] and r["success"] for r in self.test_results),
            "Perfect Suit Guide article present": any("Perfect Suit Guide Identity" in r["test"] and r["success"] for r in self.test_results),
            "Hero image URL accessible (not HTTP 422)": any("Hero Image Accessibility" in r["test"] and r["success"] for r in self.test_results),
            "Article data intact": any("Article Data Integrity" in r["test"] and r["success"] for r in self.test_results),
            "Thumbnail display ready": any("Thumbnail Display Readiness" in r["test"] and r["success"] for r in self.test_results)
        }
        
        for requirement, status in requirements_status.items():
            status_icon = "✅" if status else "❌"
            print(f"   {status_icon} {requirement}")
        
        print("\n" + "="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "requirements_met": sum(requirements_status.values()),
            "total_requirements": len(requirements_status),
            "critical_issues": critical_issues,
            "all_requirements_met": all(requirements_status.values())
        }

def main():
    """Main function"""
    tester = FashionMenComprehensiveTester()
    results = tester.run_comprehensive_tests()
    return 0 if results["all_requirements_met"] else 1

if __name__ == "__main__":
    exit(main())