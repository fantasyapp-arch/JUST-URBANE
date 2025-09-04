#!/usr/bin/env python3
"""
Just Urbane Magazine Flip-Book Backend Testing
Focused testing for magazine reader functionality as per review request
"""

import requests
import json
from datetime import datetime
from typing import Dict, Any, List

class MagazineFlipBookTester:
    def __init__(self, base_url: str = "https://urbane-explore.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
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

    def test_articles_api_for_magazine_reader(self):
        """Test /api/articles returns properly formatted articles with all required fields for magazine display"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=10", timeout=15)
            if response.status_code != 200:
                self.log_test("Articles API Response", False, f"HTTP {response.status_code}: {response.text}")
                return False
            
            articles = response.json()
            if not isinstance(articles, list):
                self.log_test("Articles API Format", False, f"Expected list, got {type(articles)}")
                return False
            
            if len(articles) == 0:
                self.log_test("Articles API Content", False, "No articles returned")
                return False
            
            # Check required fields for magazine display
            required_fields = ['title', 'body', 'hero_image', 'author_name', 'category', 'tags', 'is_premium', 'published_at']
            articles_with_all_fields = 0
            
            for article in articles:
                has_all_fields = all(field in article for field in required_fields)
                if has_all_fields:
                    articles_with_all_fields += 1
                else:
                    missing_fields = [field for field in required_fields if field not in article]
                    print(f"   Article '{article.get('title', 'Unknown')}' missing: {missing_fields}")
            
            success_rate = (articles_with_all_fields / len(articles)) * 100
            if success_rate >= 90:
                self.log_test("Articles API Required Fields", True, 
                             f"{articles_with_all_fields}/{len(articles)} articles have all required fields ({success_rate:.1f}%)")
            else:
                self.log_test("Articles API Required Fields", False, 
                             f"Only {articles_with_all_fields}/{len(articles)} articles have all required fields ({success_rate:.1f}%)")
            
            # Test specific field quality
            self.test_article_field_quality(articles)
            return True
            
        except Exception as e:
            self.log_test("Articles API for Magazine Reader", False, f"Error: {str(e)}")
            return False

    def test_article_field_quality(self, articles: List[Dict]):
        """Test quality of article fields for magazine display"""
        try:
            # Test title quality
            articles_with_good_titles = sum(1 for article in articles 
                                          if article.get('title') and len(article['title']) > 10)
            title_rate = (articles_with_good_titles / len(articles)) * 100
            
            if title_rate >= 90:
                self.log_test("Article Titles Quality", True, 
                             f"{articles_with_good_titles}/{len(articles)} articles have quality titles ({title_rate:.1f}%)")
            else:
                self.log_test("Article Titles Quality", False, 
                             f"Only {articles_with_good_titles}/{len(articles)} articles have quality titles ({title_rate:.1f}%)")
            
            # Test author names
            articles_with_authors = sum(1 for article in articles 
                                      if article.get('author_name') and len(article['author_name']) > 2)
            author_rate = (articles_with_authors / len(articles)) * 100
            
            if author_rate >= 90:
                self.log_test("Article Authors Quality", True, 
                             f"{articles_with_authors}/{len(articles)} articles have proper author names ({author_rate:.1f}%)")
            else:
                self.log_test("Article Authors Quality", False, 
                             f"Only {articles_with_authors}/{len(articles)} articles have proper author names ({author_rate:.1f}%)")
            
            # Test categories
            articles_with_categories = sum(1 for article in articles 
                                         if article.get('category') and len(article['category']) > 2)
            category_rate = (articles_with_categories / len(articles)) * 100
            
            if category_rate >= 90:
                self.log_test("Article Categories Quality", True, 
                             f"{articles_with_categories}/{len(articles)} articles have proper categories ({category_rate:.1f}%)")
            else:
                self.log_test("Article Categories Quality", False, 
                             f"Only {articles_with_categories}/{len(articles)} articles have proper categories ({category_rate:.1f}%)")
            
        except Exception as e:
            self.log_test("Article Field Quality", False, f"Error: {str(e)}")

    def test_magazine_content_structure(self):
        """Verify articles have sufficient content in body field for magazine-style layout"""
        try:
            response = self.session.get(f"{self.base_url}/api/articles?limit=15", timeout=15)
            if response.status_code != 200:
                self.log_test("Magazine Content Structure", False, f"HTTP {response.status_code}")
                return False
            
            articles = response.json()
            if not articles:
                self.log_test("Magazine Content Structure", False, "No articles available")
                return False
            
            # Check content length and quality
            articles_with_sufficient_content = 0
            articles_with_formatted_content = 0
            total_articles = len(articles)
            
            for article in articles:
                body = article.get('body', '')
                
                # Check for sufficient content length (magazine articles should be substantial)
                if len(body) >= 200:  # Minimum for magazine-style content
                    articles_with_sufficient_content += 1
                
                # Check for proper formatting (paragraphs, structure)
                if '\n' in body or len(body.split('.')) > 3:  # Basic structure indicators
                    articles_with_formatted_content += 1
            
            content_rate = (articles_with_sufficient_content / total_articles) * 100
            format_rate = (articles_with_formatted_content / total_articles) * 100
            
            if content_rate >= 70:
                self.log_test("Magazine Content Length", True, 
                             f"{articles_with_sufficient_content}/{total_articles} articles have sufficient content ({content_rate:.1f}%)")
            else:
                self.log_test("Magazine Content Length", False, 
                             f"Only {articles_with_sufficient_content}/{total_articles} articles have sufficient content ({content_rate:.1f}%)")
            
            if format_rate >= 70:
                self.log_test("Magazine Content Formatting", True, 
                             f"{articles_with_formatted_content}/{total_articles} articles have proper formatting ({format_rate:.1f}%)")
            else:
                self.log_test("Magazine Content Formatting", False, 
                             f"Only {articles_with_formatted_content}/{total_articles} articles have proper formatting ({format_rate:.1f}%)")
            
            return True
            
        except Exception as e:
            self.log_test("Magazine Content Structure", False, f"Error: {str(e)}")
            return False

    def test_premium_content_system(self):
        """Test that premium vs free articles are properly flagged with is_premium field"""
        try:
            # Get all articles
            response = self.session.get(f"{self.base_url}/api/articles?limit=20", timeout=15)
            if response.status_code != 200:
                self.log_test("Premium Content System", False, f"HTTP {response.status_code}")
                return False
            
            articles = response.json()
            if not articles:
                self.log_test("Premium Content System", False, "No articles available")
                return False
            
            # Check premium flag consistency
            premium_articles = [a for a in articles if a.get('is_premium', False)]
            free_articles = [a for a in articles if not a.get('is_premium', False)]
            
            total_articles = len(articles)
            premium_count = len(premium_articles)
            free_count = len(free_articles)
            
            # Verify all articles have is_premium field
            articles_with_premium_flag = sum(1 for a in articles if 'is_premium' in a)
            flag_rate = (articles_with_premium_flag / total_articles) * 100
            
            if flag_rate == 100:
                self.log_test("Premium Flag Presence", True, 
                             f"All {total_articles} articles have is_premium field")
            else:
                self.log_test("Premium Flag Presence", False, 
                             f"Only {articles_with_premium_flag}/{total_articles} articles have is_premium field ({flag_rate:.1f}%)")
            
            # Test premium content access control
            if premium_articles:
                premium_article = premium_articles[0]
                article_id = premium_article.get('id')
                
                # Test premium article access without authentication
                response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                if response.status_code == 200:
                    article_data = response.json()
                    is_locked = article_data.get('is_locked', False)
                    
                    if is_locked:
                        self.log_test("Premium Content Access Control", True, 
                                     "Premium articles are properly locked for non-premium users")
                    else:
                        self.log_test("Premium Content Access Control", False, 
                                     "Premium articles are not properly locked")
                else:
                    self.log_test("Premium Content Access Control", False, 
                                 f"Failed to test premium article access: HTTP {response.status_code}")
            
            self.log_test("Premium Content Distribution", True, 
                         f"Found {premium_count} premium and {free_count} free articles")
            
            return True
            
        except Exception as e:
            self.log_test("Premium Content System", False, f"Error: {str(e)}")
            return False

    def test_category_based_magazine_issues(self):
        """Test that articles can be grouped by category and date for magazine issue creation"""
        try:
            # Test category grouping
            categories = ['fashion', 'business', 'technology', 'travel', 'culture']
            category_results = {}
            
            for category in categories:
                response = self.session.get(f"{self.base_url}/api/articles?category={category}&limit=10", timeout=10)
                if response.status_code == 200:
                    articles = response.json()
                    category_results[category] = len(articles)
                else:
                    category_results[category] = 0
            
            total_categorized = sum(category_results.values())
            categories_with_content = sum(1 for count in category_results.values() if count > 0)
            
            if categories_with_content >= 3:
                self.log_test("Category-based Grouping", True, 
                             f"{categories_with_content}/5 categories have articles. Total: {total_categorized} articles")
            else:
                self.log_test("Category-based Grouping", False, 
                             f"Only {categories_with_content}/5 categories have articles")
            
            # Test date-based sorting
            response = self.session.get(f"{self.base_url}/api/articles?limit=10", timeout=10)
            if response.status_code == 200:
                articles = response.json()
                
                # Check if articles have published_at dates
                articles_with_dates = sum(1 for a in articles if a.get('published_at'))
                date_rate = (articles_with_dates / len(articles)) * 100 if articles else 0
                
                if date_rate >= 90:
                    self.log_test("Date-based Sorting Support", True, 
                                 f"{articles_with_dates}/{len(articles)} articles have publication dates ({date_rate:.1f}%)")
                else:
                    self.log_test("Date-based Sorting Support", False, 
                                 f"Only {articles_with_dates}/{len(articles)} articles have publication dates ({date_rate:.1f}%)")
                
                # Check if articles are sorted by date (newest first)
                if len(articles) >= 2:
                    dates = [a.get('published_at') for a in articles if a.get('published_at')]
                    if len(dates) >= 2:
                        is_sorted = all(dates[i] >= dates[i+1] for i in range(len(dates)-1))
                        if is_sorted:
                            self.log_test("Date Sorting Order", True, "Articles are properly sorted by publication date (newest first)")
                        else:
                            self.log_test("Date Sorting Order", False, "Articles are not properly sorted by date")
            
            return True
            
        except Exception as e:
            self.log_test("Category-based Magazine Issues", False, f"Error: {str(e)}")
            return False

    def test_article_pagination_and_sorting(self):
        """Verify articles are returned in proper order for magazine reading experience"""
        try:
            # Test pagination
            page1_response = self.session.get(f"{self.base_url}/api/articles?limit=5&skip=0", timeout=10)
            page2_response = self.session.get(f"{self.base_url}/api/articles?limit=5&skip=5", timeout=10)
            
            if page1_response.status_code != 200 or page2_response.status_code != 200:
                self.log_test("Article Pagination", False, "Failed to fetch paginated results")
                return False
            
            page1_articles = page1_response.json()
            page2_articles = page2_response.json()
            
            if not isinstance(page1_articles, list) or not isinstance(page2_articles, list):
                self.log_test("Article Pagination", False, "Invalid pagination response format")
                return False
            
            # Check that pagination returns different articles
            page1_ids = {a.get('id') for a in page1_articles}
            page2_ids = {a.get('id') for a in page2_articles}
            
            if page1_ids.isdisjoint(page2_ids):
                self.log_test("Article Pagination", True, 
                             f"Pagination working correctly. Page 1: {len(page1_articles)} articles, Page 2: {len(page2_articles)} articles")
            else:
                self.log_test("Article Pagination", False, "Pagination returning duplicate articles")
            
            # Test sorting by different criteria
            # Test featured articles first
            featured_response = self.session.get(f"{self.base_url}/api/articles?featured=true&limit=10", timeout=10)
            if featured_response.status_code == 200:
                featured_articles = featured_response.json()
                featured_count = len(featured_articles)
                
                if featured_count > 0:
                    all_featured = all(a.get('is_featured', False) for a in featured_articles)
                    if all_featured:
                        self.log_test("Featured Articles Sorting", True, 
                                     f"Featured articles filter working correctly ({featured_count} articles)")
                    else:
                        self.log_test("Featured Articles Sorting", False, "Featured filter returning non-featured articles")
                else:
                    self.log_test("Featured Articles Sorting", True, "No featured articles found (valid result)")
            
            # Test trending articles
            trending_response = self.session.get(f"{self.base_url}/api/articles?trending=true&limit=10", timeout=10)
            if trending_response.status_code == 200:
                trending_articles = trending_response.json()
                trending_count = len(trending_articles)
                
                if trending_count > 0:
                    all_trending = all(a.get('is_trending', False) for a in trending_articles)
                    if all_trending:
                        self.log_test("Trending Articles Sorting", True, 
                                     f"Trending articles filter working correctly ({trending_count} articles)")
                    else:
                        self.log_test("Trending Articles Sorting", False, "Trending filter returning non-trending articles")
                else:
                    self.log_test("Trending Articles Sorting", True, "No trending articles found (valid result)")
            
            return True
            
        except Exception as e:
            self.log_test("Article Pagination and Sorting", False, f"Error: {str(e)}")
            return False

    def test_magazine_reader_integration(self):
        """Test overall integration for magazine flip-book reader"""
        try:
            # Test complete magazine reading flow
            response = self.session.get(f"{self.base_url}/api/articles?limit=1", timeout=10)
            if response.status_code != 200:
                self.log_test("Magazine Reader Integration", False, "Failed to get articles for integration test")
                return False
            
            articles = response.json()
            if not articles:
                self.log_test("Magazine Reader Integration", False, "No articles available for integration test")
                return False
            
            article = articles[0]
            article_id = article.get('id')
            
            # Test full article retrieval (magazine reader needs full content)
            full_article_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
            if full_article_response.status_code == 200:
                full_article = full_article_response.json()
                
                # Check if article has all necessary data for magazine display
                magazine_fields = ['title', 'body', 'author_name', 'published_at', 'category', 'hero_image']
                has_magazine_fields = all(field in full_article for field in magazine_fields)
                
                if has_magazine_fields:
                    self.log_test("Magazine Reader Data Completeness", True, 
                                 "Article has all required fields for magazine reader")
                else:
                    missing = [field for field in magazine_fields if field not in full_article]
                    self.log_test("Magazine Reader Data Completeness", False, 
                                 f"Article missing magazine reader fields: {missing}")
                
                # Test view count increment (important for magazine analytics)
                initial_views = full_article.get('view_count', 0)
                
                # Access article again
                second_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                if second_response.status_code == 200:
                    second_article = second_response.json()
                    new_views = second_article.get('view_count', 0)
                    
                    if new_views > initial_views:
                        self.log_test("Magazine Reader Analytics", True, 
                                     f"View count tracking working ({initial_views} → {new_views})")
                    else:
                        self.log_test("Magazine Reader Analytics", False, 
                                     "View count not incrementing properly")
            
            return True
            
        except Exception as e:
            self.log_test("Magazine Reader Integration", False, f"Error: {str(e)}")
            return False

    def run_magazine_flipbook_tests(self):
        """Run all magazine flip-book focused tests"""
        print("📖 Starting Just Urbane Magazine Flip-Book Backend Testing")
        print("=" * 70)
        print("Focus: Magazine reader functionality as per review request")
        print("=" * 70)
        
        # 1. Articles API for Magazine Reader
        print("\n📰 Testing Articles API for Magazine Reader...")
        self.test_articles_api_for_magazine_reader()
        
        # 2. Magazine Content Structure
        print("\n📄 Testing Magazine Content Structure...")
        self.test_magazine_content_structure()
        
        # 3. Premium Content System
        print("\n👑 Testing Premium Content System...")
        self.test_premium_content_system()
        
        # 4. Category-based Magazine Issues
        print("\n📂 Testing Category-based Magazine Issues...")
        self.test_category_based_magazine_issues()
        
        # 5. Article Pagination and Sorting
        print("\n📊 Testing Article Pagination and Sorting...")
        self.test_article_pagination_and_sorting()
        
        # 6. Magazine Reader Integration
        print("\n🔗 Testing Magazine Reader Integration...")
        self.test_magazine_reader_integration()
        
        return self.generate_report()

    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 60)
        print("📊 MAGAZINE FLIP-BOOK TEST RESULTS")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n✅ PASSED TESTS:")
        for result in self.test_results:
            if result["success"]:
                print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

def main():
    """Main testing function"""
    tester = MagazineFlipBookTester()
    report = tester.run_magazine_flipbook_tests()
    
    # Save detailed report
    with open("/app/magazine_flipbook_test_report.json", "w") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: /app/magazine_flipbook_test_report.json")
    
    return report["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)