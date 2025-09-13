#!/usr/bin/env python3
"""
Final Article Publishing Diagnosis
Comprehensive analysis of the article publishing system issues
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class PublishingDiagnoser:
    def __init__(self, base_url: str = "https://justurb-panel.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.findings = []
        self.admin_credentials = {"username": "admin", "password": "admin123"}
        
    def log_finding(self, category: str, severity: str, issue: str, details: str = "", solution: str = ""):
        """Log diagnostic findings"""
        finding = {
            "category": category,
            "severity": severity,  # CRITICAL, HIGH, MEDIUM, LOW
            "issue": issue,
            "details": details,
            "solution": solution,
            "timestamp": datetime.now().isoformat()
        }
        self.findings.append(finding)
        
        severity_icon = {
            "CRITICAL": "🚨",
            "HIGH": "⚠️",
            "MEDIUM": "⚡",
            "LOW": "ℹ️"
        }
        
        print(f"{severity_icon.get(severity, '•')} {severity}: {issue}")
        if details:
            print(f"   Details: {details}")
        if solution:
            print(f"   Solution: {solution}")
        print()

    def admin_login(self):
        """Login as admin"""
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
                    return True
            return False
        except:
            return False

    def diagnose_public_api_filtering(self):
        """Diagnose public API filtering issues"""
        print("🔍 DIAGNOSING PUBLIC API FILTERING")
        print("=" * 45)
        
        try:
            # Get articles from public API
            public_response = self.session.get(f"{self.base_url}/api/articles?limit=50", timeout=10)
            if public_response.status_code != 200:
                self.log_finding("API", "CRITICAL", "Public API not accessible", 
                               f"HTTP {public_response.status_code}")
                return
            
            public_articles = public_response.json()
            
            # Get articles from admin API for comparison
            if not self.auth_token:
                self.log_finding("AUTH", "HIGH", "Cannot access admin API for comparison")
                return
                
            admin_response = self.session.get(f"{self.base_url}/api/admin/articles?limit=50", timeout=10)
            if admin_response.status_code != 200:
                self.log_finding("API", "HIGH", "Admin API not accessible", 
                               f"HTTP {admin_response.status_code}")
                return
            
            admin_data = admin_response.json()
            admin_articles = admin_data.get("articles", [])
            
            # Analyze the differences
            public_count = len(public_articles)
            admin_count = len(admin_articles)
            
            # Check if public API has status filtering
            public_with_status = [a for a in public_articles if "status" in a]
            admin_published = [a for a in admin_articles if a.get("status") == "published"]
            admin_drafts = [a for a in admin_articles if a.get("status") != "published"]
            
            self.log_finding("DATA", "MEDIUM", f"Article count comparison",
                           f"Public API: {public_count}, Admin API: {admin_count}")
            
            if len(public_with_status) == 0:
                self.log_finding("API", "CRITICAL", "Public API missing status field",
                               "Public articles don't have status field, indicating no filtering by publication status",
                               "Add status filtering to public API endpoint")
            
            if public_count == admin_count:
                self.log_finding("API", "CRITICAL", "Public API returns ALL articles including drafts",
                               f"Public API returns {public_count} articles, same as admin API total. This means drafts are visible to public.",
                               "Filter public API to only return published articles")
            
            if len(admin_published) > 0 and public_count != len(admin_published):
                self.log_finding("API", "CRITICAL", "Published articles not properly filtered",
                               f"Admin shows {len(admin_published)} published articles, but public API returns {public_count}",
                               "Fix public API filtering logic")
            
            # Check specific articles
            print("📊 DETAILED ANALYSIS:")
            print(f"   Admin Articles Total: {admin_count}")
            print(f"   Admin Published: {len(admin_published)}")
            print(f"   Admin Drafts: {len(admin_drafts)}")
            print(f"   Public API Returns: {public_count}")
            print(f"   Public with Status Field: {len(public_with_status)}")
            
        except Exception as e:
            self.log_finding("SYSTEM", "HIGH", "Error during API diagnosis", str(e))

    def diagnose_article_status_consistency(self):
        """Diagnose article status consistency"""
        print("🔍 DIAGNOSING ARTICLE STATUS CONSISTENCY")
        print("=" * 50)
        
        if not self.auth_token:
            self.log_finding("AUTH", "HIGH", "Cannot diagnose without admin access")
            return
            
        try:
            # Get admin articles
            response = self.session.get(f"{self.base_url}/api/admin/articles?limit=50", timeout=10)
            if response.status_code != 200:
                return
                
            data = response.json()
            articles = data.get("articles", [])
            
            # Analyze status distribution
            status_counts = {}
            articles_without_status = []
            
            for article in articles:
                status = article.get("status", "MISSING")
                status_counts[status] = status_counts.get(status, 0) + 1
                
                if status == "MISSING":
                    articles_without_status.append(article.get("title", "Unknown"))
            
            print("📊 STATUS DISTRIBUTION:")
            for status, count in status_counts.items():
                print(f"   {status}: {count} articles")
            
            if "MISSING" in status_counts:
                self.log_finding("DATA", "HIGH", f"{status_counts['MISSING']} articles missing status field",
                               f"Articles: {', '.join(articles_without_status[:3])}{'...' if len(articles_without_status) > 3 else ''}",
                               "Add default status to articles missing this field")
            
            # Check if published articles are actually accessible
            published_articles = [a for a in articles if a.get("status") == "published"]
            if published_articles:
                test_article = published_articles[0]
                article_id = test_article.get("id")
                
                # Test public access
                public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                if public_response.status_code == 200:
                    public_article = public_response.json()
                    if "status" not in public_article:
                        self.log_finding("API", "MEDIUM", "Single article endpoint missing status field",
                                       "Individual articles don't return status field in public API")
                else:
                    self.log_finding("API", "HIGH", "Published article not accessible via public API",
                                   f"Article {article_id[:8]} marked as published but returns HTTP {public_response.status_code}")
            
        except Exception as e:
            self.log_finding("SYSTEM", "HIGH", "Error during status consistency check", str(e))

    def diagnose_publishing_workflow(self):
        """Diagnose the publishing workflow"""
        print("🔍 DIAGNOSING PUBLISHING WORKFLOW")
        print("=" * 40)
        
        if not self.auth_token:
            self.log_finding("AUTH", "HIGH", "Cannot test publishing workflow without admin access")
            return
            
        try:
            # Get a draft article to test publishing
            response = self.session.get(f"{self.base_url}/api/admin/articles?limit=20", timeout=10)
            if response.status_code != 200:
                return
                
            data = response.json()
            articles = data.get("articles", [])
            
            draft_articles = [a for a in articles if a.get("status") != "published"]
            if not draft_articles:
                self.log_finding("TEST", "MEDIUM", "No draft articles available for publishing test")
                return
            
            test_article = draft_articles[0]
            article_id = test_article.get("id")
            original_title = test_article.get("title", "")
            
            print(f"   Testing with article: {original_title[:50]}...")
            
            # Try to publish the article
            form_data = {"status": "published"}
            publish_response = self.session.put(
                f"{self.base_url}/api/admin/articles/{article_id}/status",
                data=form_data,
                timeout=10
            )
            
            if publish_response.status_code == 200:
                print("   ✅ Status update successful")
                
                # Check if it appears in public API
                time.sleep(2)
                public_response = self.session.get(f"{self.base_url}/api/articles/{article_id}", timeout=10)
                
                if public_response.status_code == 200:
                    print("   ✅ Article accessible via public API")
                    
                    # Check if it appears in public articles list
                    list_response = self.session.get(f"{self.base_url}/api/articles?limit=50", timeout=10)
                    if list_response.status_code == 200:
                        public_articles = list_response.json()
                        found_in_list = any(a.get("id") == article_id for a in public_articles)
                        
                        if found_in_list:
                            print("   ✅ Article appears in public articles list")
                            self.log_finding("WORKFLOW", "LOW", "Publishing workflow working correctly",
                                           "Article successfully published and visible in public API")
                        else:
                            self.log_finding("WORKFLOW", "HIGH", "Published article not in public list",
                                           "Article can be accessed individually but doesn't appear in articles list")
                    else:
                        self.log_finding("API", "HIGH", "Cannot access public articles list")
                else:
                    self.log_finding("WORKFLOW", "CRITICAL", "Published article not accessible via public API",
                                   f"Article marked as published but returns HTTP {public_response.status_code}")
            else:
                self.log_finding("WORKFLOW", "CRITICAL", "Cannot update article status",
                               f"Status update failed: HTTP {publish_response.status_code}")
                
        except Exception as e:
            self.log_finding("SYSTEM", "HIGH", "Error during publishing workflow test", str(e))

    def diagnose_database_schema(self):
        """Diagnose database schema issues"""
        print("🔍 DIAGNOSING DATABASE SCHEMA")
        print("=" * 35)
        
        if not self.auth_token:
            return
            
        try:
            # Get sample articles to analyze schema
            response = self.session.get(f"{self.base_url}/api/admin/articles?limit=10", timeout=10)
            if response.status_code != 200:
                return
                
            data = response.json()
            articles = data.get("articles", [])
            
            if not articles:
                self.log_finding("DATA", "HIGH", "No articles found in database")
                return
            
            # Analyze schema consistency
            all_fields = set()
            field_presence = {}
            
            for article in articles:
                for field in article.keys():
                    all_fields.add(field)
                    field_presence[field] = field_presence.get(field, 0) + 1
            
            total_articles = len(articles)
            
            print("📊 SCHEMA ANALYSIS:")
            critical_fields = ["id", "title", "body", "status", "category", "author_name"]
            
            for field in critical_fields:
                count = field_presence.get(field, 0)
                percentage = (count / total_articles) * 100
                print(f"   {field}: {count}/{total_articles} ({percentage:.1f}%)")
                
                if percentage < 100:
                    self.log_finding("SCHEMA", "HIGH" if field in ["id", "title", "status"] else "MEDIUM",
                                   f"Field '{field}' missing in some articles",
                                   f"Only {count}/{total_articles} articles have this field",
                                   f"Add default value for missing '{field}' fields")
            
            # Check for inconsistent field types
            status_values = set()
            for article in articles:
                if "status" in article:
                    status_values.add(article["status"])
            
            print(f"\n   Status values found: {', '.join(status_values)}")
            
            expected_statuses = {"published", "draft", "archived"}
            unexpected_statuses = status_values - expected_statuses
            
            if unexpected_statuses:
                self.log_finding("SCHEMA", "MEDIUM", "Unexpected status values found",
                               f"Found: {', '.join(unexpected_statuses)}",
                               "Standardize status values to: published, draft, archived")
                
        except Exception as e:
            self.log_finding("SYSTEM", "HIGH", "Error during schema analysis", str(e))

    def generate_comprehensive_report(self):
        """Generate comprehensive diagnostic report"""
        print("\n" + "="*80)
        print("🎯 COMPREHENSIVE ARTICLE PUBLISHING DIAGNOSIS REPORT")
        print("="*80)
        
        # Categorize findings by severity
        critical_issues = [f for f in self.findings if f["severity"] == "CRITICAL"]
        high_issues = [f for f in self.findings if f["severity"] == "HIGH"]
        medium_issues = [f for f in self.findings if f["severity"] == "MEDIUM"]
        low_issues = [f for f in self.findings if f["severity"] == "LOW"]
        
        print(f"\n📊 FINDINGS SUMMARY:")
        print(f"   🚨 Critical Issues: {len(critical_issues)}")
        print(f"   ⚠️ High Priority: {len(high_issues)}")
        print(f"   ⚡ Medium Priority: {len(medium_issues)}")
        print(f"   ℹ️ Low Priority: {len(low_issues)}")
        
        if critical_issues:
            print(f"\n🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION:")
            for i, issue in enumerate(critical_issues, 1):
                print(f"\n{i}. {issue['issue']}")
                if issue['details']:
                    print(f"   Problem: {issue['details']}")
                if issue['solution']:
                    print(f"   Solution: {issue['solution']}")
        
        if high_issues:
            print(f"\n⚠️ HIGH PRIORITY ISSUES:")
            for i, issue in enumerate(high_issues, 1):
                print(f"\n{i}. {issue['issue']}")
                if issue['details']:
                    print(f"   Problem: {issue['details']}")
                if issue['solution']:
                    print(f"   Solution: {issue['solution']}")
        
        # Overall assessment
        print(f"\n🎯 OVERALL ASSESSMENT:")
        if len(critical_issues) > 0:
            print("   🚨 SYSTEM BROKEN: Critical issues prevent proper article publishing")
            assessment = "BROKEN"
        elif len(high_issues) > 2:
            print("   ⚠️ SYSTEM IMPAIRED: Multiple high-priority issues affect functionality")
            assessment = "IMPAIRED"
        elif len(high_issues) > 0 or len(medium_issues) > 3:
            print("   ⚡ SYSTEM NEEDS ATTENTION: Some issues affect user experience")
            assessment = "NEEDS_ATTENTION"
        else:
            print("   ✅ SYSTEM WORKING: Minor issues only")
            assessment = "WORKING"
        
        print(f"\n🔧 RECOMMENDED ACTIONS:")
        print("1. Fix public API to filter by status='published' only")
        print("2. Ensure all articles have proper status field")
        print("3. Test publishing workflow end-to-end")
        print("4. Verify public website displays only published content")
        
        return {
            "assessment": assessment,
            "critical_count": len(critical_issues),
            "high_count": len(high_issues),
            "medium_count": len(medium_issues),
            "low_count": len(low_issues),
            "all_findings": self.findings
        }

    def run_comprehensive_diagnosis(self):
        """Run comprehensive diagnosis"""
        print("🎯 STARTING COMPREHENSIVE ARTICLE PUBLISHING DIAGNOSIS")
        print("="*80)
        print("Analyzing all aspects of the article publishing system...")
        print()
        
        # Login
        if not self.admin_login():
            print("❌ Cannot access admin functions - limited diagnosis possible")
        
        # Run all diagnostic tests
        self.diagnose_public_api_filtering()
        self.diagnose_article_status_consistency()
        self.diagnose_publishing_workflow()
        self.diagnose_database_schema()
        
        # Generate report
        return self.generate_comprehensive_report()

def main():
    """Main function"""
    print("🚀 Just Urbane Article Publishing Diagnosis")
    print("=" * 50)
    print("Comprehensive analysis of publishing system issues")
    print()
    
    diagnoser = PublishingDiagnoser()
    results = diagnoser.run_comprehensive_diagnosis()
    
    print("\n" + "="*80)
    print("🏁 DIAGNOSIS COMPLETE")
    print("="*80)
    
    return results

if __name__ == "__main__":
    main()