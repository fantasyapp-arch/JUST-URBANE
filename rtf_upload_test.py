#!/usr/bin/env python3
"""
RTF File Upload Testing Script
Tests the fixed RTF parsing functionality in the admin article upload endpoint.
"""

import requests
import json
import os
import tempfile
from pathlib import Path
import time

# Configuration
BACKEND_URL = "https://admin-fix-urbane.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class RTFUploadTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details:
            for key, value in details.items():
                print(f"    {key}: {value}")
        print()

    def authenticate_admin(self):
        """Authenticate as admin user"""
        try:
            auth_data = {
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD
            }
            
            response = self.session.post(f"{BACKEND_URL}/admin/login", json=auth_data)
            
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get("access_token")
                self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                self.log_test("Admin Authentication", True, "Successfully authenticated as admin")
                return True
            else:
                self.log_test("Admin Authentication", False, f"Failed with status {response.status_code}", 
                            {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Exception: {str(e)}")
            return False

    def create_rtf_test_file(self, content_type="good"):
        """Create RTF test files with different content types"""
        if content_type == "good":
            # Create a proper RTF file with formatted content
            rtf_content = r"""{{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}
\f0\fs24 This is a test RTF article about sustainable fashion trends.

\b Fashion Revolution: Sustainable Trends for 2025\b0

The fashion industry is undergoing a significant transformation as consumers become increasingly conscious of environmental impact. Here are the key sustainable fashion trends shaping 2025:

\b 1. Circular Fashion Economy\b0
Brands are embracing circular design principles, creating clothes that can be easily recycled or upcycled at the end of their lifecycle.

\b 2. Plant-Based Materials\b0
Innovation in plant-based leather alternatives, including mushroom leather and pineapple leaf fiber, is revolutionizing sustainable fashion.

\b 3. Local Production\b0
Supporting local artisans and reducing carbon footprint through regional manufacturing is becoming a priority for conscious brands.

\b 4. Digital Fashion\b0
Virtual clothing for digital avatars is emerging as a new frontier, reducing physical waste while satisfying fashion desires.

\b Conclusion\b0
The future of fashion lies in sustainability, innovation, and conscious consumption. These trends represent a fundamental shift towards a more responsible fashion industry.
}"""
        elif content_type == "empty":
            # Empty RTF file
            rtf_content = r"{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}}"
            
        elif content_type == "invalid":
            # Invalid RTF content
            rtf_content = "This is not a valid RTF file content"
            
        elif content_type == "unicode_error":
            # RTF with problematic encoding
            rtf_content = r"{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}} \u8364? Euro symbol test}"
            
        else:
            # Default good content
            rtf_content = r"{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}} \f0\fs24 Simple RTF test content.}"
        
        # Create temporary RTF file
        temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8')
        temp_file.write(rtf_content)
        temp_file.close()
        
        return temp_file.name

    def test_rtf_upload_success(self):
        """Test successful RTF file upload"""
        try:
            # Create a good RTF file
            rtf_file_path = self.create_rtf_test_file("good")
            
            # Prepare form data
            form_data = {
                'title': 'Sustainable Fashion Trends 2025',
                'summary': 'A comprehensive guide to sustainable fashion trends shaping the industry in 2025',
                'author_name': 'Fashion Expert',
                'category': 'fashion',
                'subcategory': 'sustainability',
                'tags': 'sustainable fashion, eco-friendly, circular economy, plant-based materials',
                'featured': 'true',
                'trending': 'false',
                'premium': 'false',
                'reading_time': '5',
                'hero_image_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80'
            }
            
            # Upload file
            with open(rtf_file_path, 'rb') as f:
                files = {'content_file': ('test_article.rtf', f, 'application/rtf')}
                response = self.session.post(f"{BACKEND_URL}/admin/articles/upload", 
                                           data=form_data, files=files)
            
            # Clean up temp file
            os.unlink(rtf_file_path)
            
            if response.status_code == 200:
                data = response.json()
                article_id = data.get('article_id')
                slug = data.get('slug')
                
                self.log_test("RTF Upload Success", True, "RTF file uploaded and parsed successfully", {
                    "article_id": article_id,
                    "slug": slug,
                    "title": data.get('title')
                })
                
                # Verify article was created in database
                return self.verify_article_creation(article_id)
            else:
                self.log_test("RTF Upload Success", False, f"Upload failed with status {response.status_code}", 
                            {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("RTF Upload Success", False, f"Exception: {str(e)}")
            return False

    def test_rtf_upload_empty_file(self):
        """Test RTF upload with empty content"""
        try:
            rtf_file_path = self.create_rtf_test_file("empty")
            
            form_data = {
                'title': 'Empty RTF Test',
                'summary': 'Testing empty RTF file handling',
                'author_name': 'Test Author',
                'category': 'test',
                'tags': 'test',
                'reading_time': '1'
            }
            
            with open(rtf_file_path, 'rb') as f:
                files = {'content_file': ('empty_test.rtf', f, 'application/rtf')}
                response = self.session.post(f"{BACKEND_URL}/admin/articles/upload", 
                                           data=form_data, files=files)
            
            os.unlink(rtf_file_path)
            
            # Should fail with appropriate error message
            if response.status_code == 400:
                error_msg = response.json().get('detail', '')
                if 'empty' in error_msg.lower() or 'invalid' in error_msg.lower():
                    self.log_test("RTF Empty File Handling", True, "Empty RTF file properly rejected", 
                                {"error_message": error_msg})
                    return True
                else:
                    self.log_test("RTF Empty File Handling", False, "Wrong error message for empty file", 
                                {"error_message": error_msg})
                    return False
            else:
                self.log_test("RTF Empty File Handling", False, f"Expected 400 error, got {response.status_code}", 
                            {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("RTF Empty File Handling", False, f"Exception: {str(e)}")
            return False

    def test_rtf_upload_invalid_file(self):
        """Test RTF upload with invalid RTF content"""
        try:
            rtf_file_path = self.create_rtf_test_file("invalid")
            
            form_data = {
                'title': 'Invalid RTF Test',
                'summary': 'Testing invalid RTF file handling',
                'author_name': 'Test Author',
                'category': 'test',
                'tags': 'test',
                'reading_time': '1'
            }
            
            with open(rtf_file_path, 'rb') as f:
                files = {'content_file': ('invalid_test.rtf', f, 'application/rtf')}
                response = self.session.post(f"{BACKEND_URL}/admin/articles/upload", 
                                           data=form_data, files=files)
            
            os.unlink(rtf_file_path)
            
            # Should handle gracefully - either succeed with plain text or fail appropriately
            if response.status_code in [200, 400]:
                if response.status_code == 200:
                    self.log_test("RTF Invalid File Handling", True, "Invalid RTF handled gracefully as plain text")
                    return True
                else:
                    error_msg = response.json().get('detail', '')
                    self.log_test("RTF Invalid File Handling", True, "Invalid RTF properly rejected", 
                                {"error_message": error_msg})
                    return True
            else:
                self.log_test("RTF Invalid File Handling", False, f"Unexpected status {response.status_code}", 
                            {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("RTF Invalid File Handling", False, f"Exception: {str(e)}")
            return False

    def test_non_rtf_file_rejection(self):
        """Test that non-RTF files are properly rejected"""
        try:
            # Create a non-RTF file
            temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.pdf', delete=False)
            temp_file.write("This is not an RTF file")
            temp_file.close()
            
            form_data = {
                'title': 'PDF Test',
                'summary': 'Testing PDF file rejection',
                'author_name': 'Test Author',
                'category': 'test',
                'tags': 'test',
                'reading_time': '1'
            }
            
            with open(temp_file.name, 'rb') as f:
                files = {'content_file': ('test.pdf', f, 'application/pdf')}
                response = self.session.post(f"{BACKEND_URL}/admin/articles/upload", 
                                           data=form_data, files=files)
            
            os.unlink(temp_file.name)
            
            if response.status_code == 400:
                error_msg = response.json().get('detail', '')
                if 'rtf' in error_msg.lower() or 'txt' in error_msg.lower():
                    self.log_test("Non-RTF File Rejection", True, "Non-RTF file properly rejected", 
                                {"error_message": error_msg})
                    return True
                else:
                    self.log_test("Non-RTF File Rejection", False, "Wrong error message for non-RTF file", 
                                {"error_message": error_msg})
                    return False
            else:
                self.log_test("Non-RTF File Rejection", False, f"Expected 400 error, got {response.status_code}", 
                            {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Non-RTF File Rejection", False, f"Exception: {str(e)}")
            return False

    def verify_article_creation(self, article_id):
        """Verify that the article was properly created and stored"""
        try:
            # Get the article from the API
            response = self.session.get(f"{BACKEND_URL}/articles/{article_id}")
            
            if response.status_code == 200:
                article = response.json()
                
                # Check that RTF content was properly parsed
                body = article.get('body', '')
                title = article.get('title', '')
                
                # Verify content exists and looks properly parsed
                if len(body) > 50 and 'sustainable fashion' in body.lower():
                    self.log_test("Article Content Verification", True, "RTF content properly parsed and stored", {
                        "title": title,
                        "body_length": len(body),
                        "category": article.get('category'),
                        "author": article.get('author_name')
                    })
                    return True
                else:
                    self.log_test("Article Content Verification", False, "RTF content not properly parsed", {
                        "body_preview": body[:100] + "..." if len(body) > 100 else body
                    })
                    return False
            else:
                self.log_test("Article Content Verification", False, f"Could not retrieve article: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Article Content Verification", False, f"Exception: {str(e)}")
            return False

    def test_txt_file_upload(self):
        """Test TXT file upload as a control test"""
        try:
            # Create a simple text file
            temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8')
            temp_file.write("This is a simple text file for testing.\n\nIt should work without RTF parsing.")
            temp_file.close()
            
            form_data = {
                'title': 'Text File Test',
                'summary': 'Testing plain text file upload',
                'author_name': 'Test Author',
                'category': 'test',
                'tags': 'test, text file',
                'reading_time': '1'
            }
            
            with open(temp_file.name, 'rb') as f:
                files = {'content_file': ('test.txt', f, 'text/plain')}
                response = self.session.post(f"{BACKEND_URL}/admin/articles/upload", 
                                           data=form_data, files=files)
            
            os.unlink(temp_file.name)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("TXT File Upload", True, "Plain text file uploaded successfully", {
                    "article_id": data.get('article_id'),
                    "title": data.get('title')
                })
                return True
            else:
                self.log_test("TXT File Upload", False, f"TXT upload failed with status {response.status_code}", 
                            {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("TXT File Upload", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all RTF upload tests"""
        print("🧪 Starting RTF File Upload Testing")
        print("=" * 60)
        
        # Authenticate first
        if not self.authenticate_admin():
            print("❌ Cannot proceed without admin authentication")
            return
        
        # Run all tests
        tests = [
            self.test_rtf_upload_success,
            self.test_rtf_upload_empty_file,
            self.test_rtf_upload_invalid_file,
            self.test_non_rtf_file_rejection,
            self.test_txt_file_upload
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        # Summary
        print("=" * 60)
        print(f"📊 RTF Upload Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL RTF UPLOAD TESTS PASSED! The RTF parsing fix is working correctly.")
        else:
            print(f"⚠️  {total - passed} test(s) failed. RTF upload functionality needs attention.")
        
        print("\n📋 Detailed Results:")
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details']:
                for key, value in result['details'].items():
                    print(f"    {key}: {value}")
        
        return passed == total

if __name__ == "__main__":
    tester = RTFUploadTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)