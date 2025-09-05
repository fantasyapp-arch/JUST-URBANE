#!/usr/bin/env python3
"""
Sustainable Travel Article Backend Testing
Testing the newly integrated "Travel With A Clear Conscious" article
"""

import requests
import json
from datetime import datetime

class SustainableTravelTester:
    def __init__(self, base_url: str = "https://urbane-ui-revamp.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, response_data: any = None):
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
        
    def test_sustainable_travel_article_integration(self):
        """Test Sustainable Travel Article Integration - REVIEW REQUEST PRIORITY"""
        print("\n🌱 SUSTAINABLE TRAVEL ARTICLE INTEGRATION TESTING")
        print("=" * 60)
        
        try:
            # Test 1: Articles API with Sustainable Travel - Verify article appears in general listing
            print("\n1. Testing Articles API - General Listing")
            response = self.session.get(f"{self.base_url}/articles", timeout=10)
            if response.status_code == 200:
                all_articles = response.json()
                sustainable_articles = [a for a in all_articles if "conscious" in a.get("title", "").lower()]
                
                if sustainable_articles:
                    sustainable_article = sustainable_articles[0]
                    self.log_test("Articles API - Sustainable Travel Found", True, f"Found sustainable travel article: '{sustainable_article.get('title', 'Unknown')}'")
                    
                    # Verify expected title
                    expected_title = "Travel With A Clear Conscious"
                    actual_title = sustainable_article.get("title", "")
                    if expected_title == actual_title:
                        self.log_test("Title Verification", True, f"Title matches exactly: '{actual_title}'")
                    else:
                        self.log_test("Title Verification", False, f"Title mismatch. Expected: '{expected_title}', Got: '{actual_title}'")
                    
                    # Verify expected author
                    expected_author = "Komal Bhandekar"
                    actual_author = sustainable_article.get("author_name", "")
                    if expected_author == actual_author:
                        self.log_test("Author Verification", True, f"Author matches: '{actual_author}'")
                    else:
                        self.log_test("Author Verification", False, f"Author mismatch. Expected: '{expected_author}', Got: '{actual_author}'")
                    
                    # Store article details for further testing
                    self.sustainable_article_id = sustainable_article.get("id")
                    self.sustainable_article_slug = sustainable_article.get("slug")
                    
                else:
                    self.log_test("Articles API - Sustainable Travel Found", False, "No sustainable travel article found in general listing")
                    return False
            else:
                self.log_test("Articles API - General Listing", False, f"Failed to get articles: HTTP {response.status_code}")
                return False
            
            # Test 2: Category Filtering - Travel category should include sustainable travel article
            print("\n2. Testing Category Filtering - Travel Category")
            response = self.session.get(f"{self.base_url}/articles?category=travel", timeout=10)
            if response.status_code == 200:
                travel_articles = response.json()
                sustainable_in_travel = [a for a in travel_articles if "conscious" in a.get("title", "").lower()]
                
                if sustainable_in_travel:
                    self.log_test("Category Filtering - Travel", True, f"Sustainable travel article found in travel category ({len(travel_articles)} total travel articles)")
                    
                    # Verify category is correctly set to "travel"
                    article = sustainable_in_travel[0]
                    if article.get("category", "").lower() == "travel":
                        self.log_test("Category Field Verification", True, f"Category correctly set to 'travel'")
                    else:
                        self.log_test("Category Field Verification", False, f"Category mismatch. Expected: 'travel', Got: '{article.get('category')}'")
                else:
                    self.log_test("Category Filtering - Travel", False, f"Sustainable travel article not found in travel category (found {len(travel_articles)} travel articles)")
            else:
                self.log_test("Category Filtering - Travel", False, f"Failed to get travel articles: HTTP {response.status_code}")
            
            # Test 3: Subcategory Filtering - Travel/Culture should include sustainable travel article
            print("\n3. Testing Subcategory Filtering - Travel/Culture")
            response = self.session.get(f"{self.base_url}/articles?category=travel&subcategory=culture", timeout=10)
            if response.status_code == 200:
                travel_culture_articles = response.json()
                sustainable_in_culture = [a for a in travel_culture_articles if "conscious" in a.get("title", "").lower()]
                
                if sustainable_in_culture:
                    self.log_test("Subcategory Filtering - Travel/Culture", True, f"Sustainable travel article found in travel/culture subcategory ({len(travel_culture_articles)} total articles)")
                    
                    # Verify subcategory is correctly set to "culture"
                    article = sustainable_in_culture[0]
                    if article.get("subcategory", "").lower() == "culture":
                        self.log_test("Subcategory Field Verification", True, f"Subcategory correctly set to 'culture'")
                    else:
                        self.log_test("Subcategory Field Verification", False, f"Subcategory mismatch. Expected: 'culture', Got: '{article.get('subcategory')}'")
                else:
                    self.log_test("Subcategory Filtering - Travel/Culture", False, f"Sustainable travel article not found in travel/culture subcategory (found {len(travel_culture_articles)} articles)")
            else:
                self.log_test("Subcategory Filtering - Travel/Culture", False, f"Failed to get travel/culture articles: HTTP {response.status_code}")
            
            # Test 4: Single Article Retrieval by Slug
            print("\n4. Testing Single Article Retrieval")
            test_slug = "sustainable-travel-conscious-guide"
            response = self.session.get(f"{self.base_url}/articles/{test_slug}", timeout=10)
            if response.status_code == 200:
                article = response.json()
                self.log_test("Single Article Retrieval by Slug", True, f"Successfully retrieved article by slug: '{test_slug}'")
            else:
                # Try with the actual slug from the article
                if hasattr(self, 'sustainable_article_slug') and self.sustainable_article_slug:
                    response = self.session.get(f"{self.base_url}/articles/{self.sustainable_article_slug}", timeout=10)
                    if response.status_code == 200:
                        article = response.json()
                        self.log_test("Single Article Retrieval by Actual Slug", True, f"Successfully retrieved article by actual slug: '{self.sustainable_article_slug}'")
                    else:
                        self.log_test("Single Article Retrieval by Slug", False, f"Failed to retrieve article by slug: HTTP {response.status_code}")
                        return False
                else:
                    self.log_test("Single Article Retrieval by Slug", False, f"Failed to retrieve article by slug '{test_slug}': HTTP {response.status_code}")
                    return False
            
            # Test 5: Article Content Structure - Verify all required fields
            print("\n5. Testing Article Content Structure")
            required_fields = ["title", "author_name", "category", "subcategory", "body", "hero_image", "gallery"]
            missing_fields = []
            present_fields = []
            
            for field in required_fields:
                if field in article and article[field] is not None:
                    present_fields.append(field)
                else:
                    missing_fields.append(field)
            
            if not missing_fields:
                self.log_test("Article Content Structure - Required Fields", True, f"All required fields present: {', '.join(present_fields)}")
            else:
                self.log_test("Article Content Structure - Required Fields", False, f"Missing fields: {', '.join(missing_fields)}")
            
            # Verify image count (1 hero + 4 gallery = 5 total)
            hero_image = article.get("hero_image")
            gallery = article.get("gallery", [])
            
            hero_count = 1 if hero_image else 0
            gallery_count = len(gallery) if isinstance(gallery, list) else 0
            total_images = hero_count + gallery_count
            
            if total_images == 5:
                self.log_test("Article Images - Count Verification", True, f"Correct image count: 1 hero + {gallery_count} gallery = {total_images} total")
            else:
                self.log_test("Article Images - Count Verification", False, f"Incorrect image count: {hero_count} hero + {gallery_count} gallery = {total_images} total (expected 5)")
            
            # Verify content includes sustainable travel tips
            body_content = article.get("body", "")
            sustainable_keywords = ["sustainable", "eco-friendly", "responsible", "green", "environment", "conscious"]
            found_keywords = [keyword for keyword in sustainable_keywords if keyword.lower() in body_content.lower()]
            
            if len(found_keywords) >= 3:
                self.log_test("Article Content - Sustainability Relevance", True, f"Content includes sustainable travel concepts: {', '.join(found_keywords[:3])}")
            else:
                self.log_test("Article Content - Sustainability Relevance", False, f"Limited sustainable travel content. Found keywords: {', '.join(found_keywords)}")
            
            # Check content length for 5 sections
            content_length = len(body_content)
            if content_length > 1000:  # Reasonable length for 5 sections
                self.log_test("Article Content - Length for 5 Sections", True, f"Sufficient content length for 5 sections: {content_length} characters")
            else:
                self.log_test("Article Content - Length for 5 Sections", False, f"Content may be too short for 5 sections: {content_length} characters")
            
            # Test 6: Alternative retrieval by ID
            print("\n6. Testing Article Retrieval by ID")
            if hasattr(self, 'sustainable_article_id') and self.sustainable_article_id:
                response = self.session.get(f"{self.base_url}/articles/{self.sustainable_article_id}", timeout=10)
                if response.status_code == 200:
                    article_by_id = response.json()
                    self.log_test("Single Article Retrieval by ID", True, f"Successfully retrieved article by ID: {self.sustainable_article_id}")
                else:
                    self.log_test("Single Article Retrieval by ID", False, f"Failed to retrieve article by ID: HTTP {response.status_code}")
            
            return True
            
        except Exception as e:
            self.log_test("Sustainable Travel Integration", False, f"Error during testing: {str(e)}")
            return False

    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 SUSTAINABLE TRAVEL ARTICLE TEST REPORT")
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
        
        # Show failed tests if any
        failed_results = [result for result in self.test_results if not result["success"]]
        if failed_results:
            print("🚨 FAILED TESTS:")
            for failure in failed_results:
                print(f"   ❌ {failure['test']}: {failure['message']}")
            print()
        
        # Show successful tests
        successful_results = [result for result in self.test_results if result["success"]]
        if successful_results:
            print("✅ SUCCESSFUL TESTS:")
            for success in successful_results:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "failed_results": failed_results
        }

    def run_tests(self):
        """Run all sustainable travel article tests"""
        print("🌱 STARTING SUSTAINABLE TRAVEL ARTICLE BACKEND TESTING")
        print("=" * 70)
        print("Testing the newly integrated 'Travel With A Clear Conscious' article...")
        print()
        
        # Run the main test
        self.test_sustainable_travel_article_integration()
        
        return self.generate_report()

if __name__ == "__main__":
    tester = SustainableTravelTester()
    report = tester.run_tests()