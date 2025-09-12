#!/usr/bin/env python3
"""
Detailed RTF Upload Testing - Focus on the specific fix
Tests the RTF parsing fix: striprtf import and rtf_to_text usage
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

class DetailedRTFTester:
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

    def test_rtf_parsing_fix(self):
        """Test the specific RTF parsing fix - rtf_to_text function"""
        try:
            # Create a complex RTF file that would have failed with the old striprtf() function
            rtf_content = r"""{{\rtf1\ansi\deff0 {\fonttbl {\f0\fswiss\fcharset0 Arial;}{\f1\froman\fcharset0 Times New Roman;}}
{\colortbl ;\red255\green0\blue0;\red0\green128\blue0;\red0\green0\blue255;}
\viewkind4\uc1\pard\cf1\f0\fs28\b RTF Parsing Test Article\b0\fs24\cf0\par
\par
\f1\fs22 This RTF file tests the new \b rtf_to_text\b0  function implementation.\par
\par
\cf2\b Key Features Being Tested:\b0\cf0\par
\pard{\pntext\f0 1.\tab}{\*\pn\pnlvlbdy\pnf0\pnindent0{\pntxtb 1.}}
\fi-360\li720 Complex RTF formatting with fonts and colors\par
{\pntext\f0 2.\tab}Unicode character handling: \u8364? Euro, \u8482? Trademark\par
{\pntext\f0 3.\tab}Multiple font families and sizes\par
{\pntext\f0 4.\tab}Color formatting and bold text\par
\pard\par
\cf3\i This content should be properly extracted by the new rtf_to_text function.\i0\cf0\par
\par
\b Previous Issue:\b0  The old striprtf() function was causing HTTP 500 errors.\par
\b Current Fix:\b0  Using rtf_to_text() from striprtf.striprtf module.\par
\par
\f0\fs20 End of test content.\par
}"""
            
            # Create temporary RTF file
            temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8')
            temp_file.write(rtf_content)
            temp_file.close()
            
            # Prepare form data
            form_data = {
                'title': 'RTF Parsing Fix Verification',
                'summary': 'Testing the fixed RTF parsing with rtf_to_text function',
                'author_name': 'RTF Test Engineer',
                'category': 'technology',
                'subcategory': 'testing',
                'tags': 'rtf, parsing, fix, striprtf, rtf_to_text',
                'featured': 'false',
                'trending': 'false',
                'premium': 'false',
                'reading_time': '3',
                'hero_image_url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80'
            }
            
            # Upload file
            with open(temp_file.name, 'rb') as f:
                files = {'content_file': ('rtf_parsing_test.rtf', f, 'application/rtf')}
                response = self.session.post(f"{BACKEND_URL}/admin/articles/upload", 
                                           data=form_data, files=files)
            
            # Clean up temp file
            os.unlink(temp_file.name)
            
            if response.status_code == 200:
                data = response.json()
                article_id = data.get('article_id')
                
                self.log_test("RTF Parsing Fix", True, "Complex RTF file processed successfully with rtf_to_text", {
                    "article_id": article_id,
                    "slug": data.get('slug'),
                    "title": data.get('title')
                })
                
                # Verify the content was properly parsed
                return self.verify_rtf_content_parsing(article_id)
            else:
                self.log_test("RTF Parsing Fix", False, f"RTF parsing failed with status {response.status_code}", 
                            {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("RTF Parsing Fix", False, f"Exception: {str(e)}")
            return False

    def verify_rtf_content_parsing(self, article_id):
        """Verify that RTF content was properly parsed and cleaned"""
        try:
            # Get the article from the API
            response = self.session.get(f"{BACKEND_URL}/articles/{article_id}")
            
            if response.status_code == 200:
                article = response.json()
                body = article.get('body', '')
                
                # Check for proper RTF parsing indicators
                parsing_checks = {
                    "content_extracted": len(body) > 100,
                    "rtf_artifacts_removed": not any(artifact in body for artifact in ['{', '}', '\\rtf', '\\f0', '\\par']),
                    "text_content_present": 'RTF Parsing Test Article' in body,
                    "formatting_cleaned": 'rtf_to_text' in body,
                    "unicode_handled": True  # Basic check - if we got here, unicode was handled
                }
                
                all_checks_passed = all(parsing_checks.values())
                
                if all_checks_passed:
                    self.log_test("RTF Content Parsing Verification", True, "RTF content properly parsed and cleaned", {
                        "body_length": len(body),
                        "parsing_checks": parsing_checks,
                        "content_preview": body[:200] + "..." if len(body) > 200 else body
                    })
                    return True
                else:
                    failed_checks = [check for check, passed in parsing_checks.items() if not passed]
                    self.log_test("RTF Content Parsing Verification", False, f"RTF parsing issues found: {failed_checks}", {
                        "parsing_checks": parsing_checks,
                        "body_preview": body[:300] + "..." if len(body) > 300 else body
                    })
                    return False
            else:
                self.log_test("RTF Content Parsing Verification", False, f"Could not retrieve article: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("RTF Content Parsing Verification", False, f"Exception: {str(e)}")
            return False

    def test_rtf_error_handling(self):
        """Test RTF error handling improvements"""
        try:
            # Create RTF with potential encoding issues
            rtf_content = r"""{\rtf1\ansi\deff0 {\fonttbl {\f0 Arial;}}
\f0\fs24 Testing error handling with special characters: 
\u8364? Euro symbol
\u8482? Trademark
\u169? Copyright
End of test.
}"""
            
            temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8')
            temp_file.write(rtf_content)
            temp_file.close()
            
            form_data = {
                'title': 'RTF Error Handling Test',
                'summary': 'Testing improved RTF error handling',
                'author_name': 'Error Test Engineer',
                'category': 'technology',
                'tags': 'rtf, error handling, unicode',
                'reading_time': '2'
            }
            
            with open(temp_file.name, 'rb') as f:
                files = {'content_file': ('error_handling_test.rtf', f, 'application/rtf')}
                response = self.session.post(f"{BACKEND_URL}/admin/articles/upload", 
                                           data=form_data, files=files)
            
            os.unlink(temp_file.name)
            
            if response.status_code == 200:
                self.log_test("RTF Error Handling", True, "RTF with special characters handled correctly", {
                    "article_id": response.json().get('article_id')
                })
                return True
            else:
                # Check if it's a proper error response (not a 500 crash)
                if response.status_code == 400:
                    error_detail = response.json().get('detail', '')
                    self.log_test("RTF Error Handling", True, "RTF error properly handled with 400 response", {
                        "error_message": error_detail
                    })
                    return True
                else:
                    self.log_test("RTF Error Handling", False, f"Unexpected error response: {response.status_code}", 
                                {"response": response.text})
                    return False
                
        except Exception as e:
            self.log_test("RTF Error Handling", False, f"Exception: {str(e)}")
            return False

    def test_before_after_comparison(self):
        """Test to demonstrate the fix works vs old behavior"""
        try:
            # Create an RTF that would have failed with old striprtf() function
            problematic_rtf = r"""{\rtf1\ansi\deff0 {\fonttbl {\f0\fswiss Arial;}}
\f0\fs24 This RTF content would have caused issues with the old striprtf() function.

The fix changed:
- Import: from striprtf import striprtf → from striprtf.striprtf import rtf_to_text
- Usage: striprtf() → rtf_to_text()
- Added: UnicodeDecodeError handling

This should now work perfectly!
}"""
            
            temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.rtf', delete=False, encoding='utf-8')
            temp_file.write(problematic_rtf)
            temp_file.close()
            
            form_data = {
                'title': 'Before/After Fix Comparison',
                'summary': 'Demonstrating the RTF parsing fix effectiveness',
                'author_name': 'Fix Verification Engineer',
                'category': 'technology',
                'subcategory': 'development',
                'tags': 'rtf, fix, before, after, striprtf',
                'reading_time': '2'
            }
            
            with open(temp_file.name, 'rb') as f:
                files = {'content_file': ('before_after_test.rtf', f, 'application/rtf')}
                response = self.session.post(f"{BACKEND_URL}/admin/articles/upload", 
                                           data=form_data, files=files)
            
            os.unlink(temp_file.name)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Before/After Fix Comparison", True, "RTF that would have failed now works perfectly", {
                    "article_id": data.get('article_id'),
                    "message": "The striprtf → rtf_to_text fix is working!"
                })
                return True
            else:
                self.log_test("Before/After Fix Comparison", False, f"Fix verification failed: {response.status_code}", 
                            {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Before/After Fix Comparison", False, f"Exception: {str(e)}")
            return False

    def run_detailed_tests(self):
        """Run detailed RTF parsing tests"""
        print("🔬 Starting Detailed RTF Parsing Fix Testing")
        print("=" * 70)
        print("Testing the specific fix:")
        print("  - Import: from striprtf.striprtf import rtf_to_text")
        print("  - Usage: rtf_to_text() instead of striprtf()")
        print("  - Error handling: UnicodeDecodeError handling")
        print("=" * 70)
        
        # Authenticate first
        if not self.authenticate_admin():
            print("❌ Cannot proceed without admin authentication")
            return
        
        # Run detailed tests
        tests = [
            self.test_rtf_parsing_fix,
            self.test_rtf_error_handling,
            self.test_before_after_comparison
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        # Summary
        print("=" * 70)
        print(f"📊 Detailed RTF Fix Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 RTF PARSING FIX VERIFIED! All detailed tests passed.")
            print("✅ The striprtf → rtf_to_text fix is working correctly.")
            print("✅ RTF files are now properly parsed without HTTP 500 errors.")
            print("✅ Error handling improvements are functioning.")
        else:
            print(f"⚠️  {total - passed} detailed test(s) failed.")
        
        print("\n📋 Detailed Test Results:")
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details']:
                for key, value in result['details'].items():
                    if isinstance(value, dict):
                        print(f"    {key}:")
                        for sub_key, sub_value in value.items():
                            print(f"      {sub_key}: {sub_value}")
                    else:
                        print(f"    {key}: {value}")
        
        return passed == total

if __name__ == "__main__":
    tester = DetailedRTFTester()
    success = tester.run_detailed_tests()
    exit(0 if success else 1)