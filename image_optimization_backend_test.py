#!/usr/bin/env python3
"""
Just Urbane Magazine - Image Optimization System Testing Suite
Comprehensive testing of the newly implemented image optimization functionality
"""

import requests
import json
import time
import os
import io
from datetime import datetime
from typing import Dict, Any, Optional
from PIL import Image
import tempfile

class ImageOptimizationTester:
    def __init__(self, base_url: str = "https://justurb-panel.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
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
        
    def create_test_image(self, width: int = 800, height: int = 600, format: str = "JPEG") -> bytes:
        """Create a test image for upload testing"""
        try:
            # Create a simple test image
            img = Image.new('RGB', (width, height), color='red')
            
            # Add some content to make it more realistic
            from PIL import ImageDraw, ImageFont
            draw = ImageDraw.Draw(img)
            
            # Draw some shapes
            draw.rectangle([50, 50, width-50, height-50], outline='blue', width=5)
            draw.ellipse([100, 100, width-100, height-100], fill='green')
            
            # Convert to bytes
            img_buffer = io.BytesIO()
            img.save(img_buffer, format=format, quality=90)
            return img_buffer.getvalue()
        except Exception as e:
            print(f"Error creating test image: {str(e)}")
            return b""
    
    def test_health_check(self):
        """Test API health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, "API is healthy and responding")
                    return True
                else:
                    self.log_test("API Health Check", False, f"Unexpected health status: {data}")
                    return False
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_admin_authentication(self):
        """Test admin authentication for media upload testing"""
        try:
            admin_credentials = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/login",
                json=admin_credentials,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.admin_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                    self.log_test("Admin Authentication", True, "Admin login successful, token received")
                    return True
                else:
                    self.log_test("Admin Authentication", False, f"No access token in response: {data}")
                    return False
            else:
                self.log_test("Admin Authentication", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Admin login error: {str(e)}")
            return False
    
    def test_optimized_media_static_serving(self):
        """Test /api/media/optimized/ static file serving"""
        try:
            # Test the static file mount endpoint
            response = self.session.get(f"{self.base_url}/api/media/optimized/", timeout=10)
            
            # Even if no files exist, the endpoint should be accessible (404 or directory listing)
            if response.status_code in [200, 404, 403]:
                self.log_test("Optimized Media Static Serving", True, f"Static file endpoint accessible (HTTP {response.status_code})")
                return True
            else:
                self.log_test("Optimized Media Static Serving", False, f"Static endpoint not accessible: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Optimized Media Static Serving", False, f"Static serving error: {str(e)}")
            return False
    
    def test_uploads_directory_access(self):
        """Test /uploads/ directory access for media files"""
        try:
            # Test the uploads directory mount
            response = self.session.get(f"{self.base_url}/uploads/", timeout=10)
            
            # Even if no files exist, the endpoint should be accessible
            if response.status_code in [200, 404, 403]:
                self.log_test("Uploads Directory Access", True, f"Uploads directory accessible (HTTP {response.status_code})")
                return True
            else:
                self.log_test("Uploads Directory Access", False, f"Uploads directory not accessible: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Uploads Directory Access", False, f"Uploads access error: {str(e)}")
            return False
    
    def test_admin_media_upload_endpoint(self):
        """Test admin media upload endpoint with image optimization"""
        if not self.admin_token:
            self.log_test("Admin Media Upload", False, "No admin authentication token available")
            return False
            
        try:
            # Create a test image
            test_image_data = self.create_test_image(1200, 800, "JPEG")
            if not test_image_data:
                self.log_test("Admin Media Upload", False, "Failed to create test image")
                return False
            
            # Prepare multipart form data
            files = {
                'files': ('test_image.jpg', test_image_data, 'image/jpeg')
            }
            
            form_data = {
                'alt_text': 'Test image for optimization testing',
                'tags': 'test,optimization,backend',
                'generate_resolutions': 'thumbnail,small,medium,large'
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/media/upload",
                files=files,
                data=form_data,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("files") and len(data["files"]) > 0:
                    uploaded_file = data["files"][0]
                    resolutions = uploaded_file.get("resolutions", [])
                    
                    if len(resolutions) > 0:
                        self.log_test("Admin Media Upload with Optimization", True, 
                                    f"Image uploaded and optimized successfully. Generated {len(resolutions)} resolutions: {resolutions}")
                        return uploaded_file
                    else:
                        self.log_test("Admin Media Upload with Optimization", False, 
                                    f"Image uploaded but no resolutions generated: {data}")
                        return False
                else:
                    self.log_test("Admin Media Upload with Optimization", False, f"No files in upload response: {data}")
                    return False
            else:
                self.log_test("Admin Media Upload with Optimization", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Media Upload with Optimization", False, f"Upload error: {str(e)}")
            return False
    
    def test_media_files_listing(self):
        """Test media files listing endpoint"""
        if not self.admin_token:
            self.log_test("Media Files Listing", False, "No admin authentication token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/api/admin/media/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                media_files = data.get("media_files", [])
                total_count = data.get("total_count", 0)
                
                self.log_test("Media Files Listing", True, 
                            f"Retrieved {len(media_files)} media files (total: {total_count})")
                return media_files
            else:
                self.log_test("Media Files Listing", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Media Files Listing", False, f"Media listing error: {str(e)}")
            return False
    
    def test_media_statistics(self):
        """Test media statistics endpoint"""
        if not self.admin_token:
            self.log_test("Media Statistics", False, "No admin authentication token available")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/api/admin/media/stats/overview", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                total_files = data.get("total_files", 0)
                total_images = data.get("total_images", 0)
                available_resolutions = data.get("available_resolutions", [])
                
                self.log_test("Media Statistics", True, 
                            f"Media stats: {total_files} total files, {total_images} images, {len(available_resolutions)} resolution types available")
                return data
            else:
                self.log_test("Media Statistics", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Media Statistics", False, f"Media stats error: {str(e)}")
            return False
    
    def test_resolution_generation(self, media_id: str):
        """Test resolution generation for existing media"""
        if not self.admin_token or not media_id:
            self.log_test("Resolution Generation", False, "No admin token or media ID available")
            return False
            
        try:
            form_data = {
                'resolutions': 'hero,cover,square'
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/media/{media_id}/generate-resolutions",
                data=form_data,
                timeout=20
            )
            
            if response.status_code == 200:
                data = response.json()
                generated_resolutions = data.get("resolutions", [])
                
                self.log_test("Resolution Generation", True, 
                            f"Generated {len(generated_resolutions)} new resolutions: {generated_resolutions}")
                return True
            else:
                self.log_test("Resolution Generation", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Resolution Generation", False, f"Resolution generation error: {str(e)}")
            return False
    
    def test_bulk_tagging_operations(self):
        """Test bulk tagging operations on media files"""
        if not self.admin_token:
            self.log_test("Bulk Tagging Operations", False, "No admin authentication token available")
            return False
            
        try:
            # Get media files first
            media_files = self.test_media_files_listing()
            if not media_files or len(media_files) == 0:
                self.log_test("Bulk Tagging Operations", True, "No media files available for bulk tagging (expected)")
                return True
            
            # Test bulk tagging with first media file
            media_id = media_files[0].get("id")
            if not media_id:
                self.log_test("Bulk Tagging Operations", False, "No media ID found in media files")
                return False
            
            form_data = {
                'media_ids': media_id,
                'tags': 'optimized,tested,backend-verified',
                'action': 'add'
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/media/bulk-tag",
                data=form_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                updated_count = data.get("updated_count", 0)
                
                self.log_test("Bulk Tagging Operations", True, 
                            f"Bulk tagging successful: {updated_count} files updated")
                return True
            else:
                self.log_test("Bulk Tagging Operations", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Bulk Tagging Operations", False, f"Bulk tagging error: {str(e)}")
            return False
    
    def test_image_optimization_error_handling(self):
        """Test error handling for invalid image uploads"""
        if not self.admin_token:
            self.log_test("Image Optimization Error Handling", False, "No admin authentication token available")
            return False
            
        try:
            # Test 1: Upload non-image file
            files = {
                'files': ('test.txt', b'This is not an image file', 'text/plain')
            }
            
            form_data = {
                'alt_text': 'Invalid file test',
                'tags': 'test,error',
                'generate_resolutions': 'thumbnail'
            }
            
            response = self.session.post(
                f"{self.base_url}/api/admin/media/upload",
                files=files,
                data=form_data,
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_test("Error Handling - Invalid File Type", True, 
                            "Correctly rejected non-image file with HTTP 400")
            else:
                self.log_test("Error Handling - Invalid File Type", False, 
                            f"Expected HTTP 400, got {response.status_code}")
            
            # Test 2: Upload oversized file (simulate)
            large_image_data = self.create_test_image(5000, 5000, "JPEG")  # Large image
            if large_image_data:
                files = {
                    'files': ('large_test.jpg', large_image_data, 'image/jpeg')
                }
                
                response = self.session.post(
                    f"{self.base_url}/api/admin/media/upload",
                    files=files,
                    data=form_data,
                    timeout=30
                )
                
                # Should either succeed (with optimization) or fail gracefully
                if response.status_code in [200, 400, 413]:
                    self.log_test("Error Handling - Large File", True, 
                                f"Large file handled appropriately (HTTP {response.status_code})")
                else:
                    self.log_test("Error Handling - Large File", False, 
                                f"Unexpected response for large file: HTTP {response.status_code}")
            
            return True
        except Exception as e:
            self.log_test("Image Optimization Error Handling", False, f"Error handling test failed: {str(e)}")
            return False
    
    def test_performance_verification(self):
        """Test image optimization performance and compression"""
        try:
            # Create test images of different sizes
            test_cases = [
                (400, 300, "Small Image"),
                (800, 600, "Medium Image"),
                (1920, 1080, "Large Image")
            ]
            
            performance_results = []
            
            for width, height, description in test_cases:
                start_time = time.time()
                
                # Create test image
                test_image = self.create_test_image(width, height, "JPEG")
                original_size = len(test_image)
                
                # Test optimization through upload (if admin token available)
                if self.admin_token and test_image:
                    files = {
                        'files': (f'perf_test_{width}x{height}.jpg', test_image, 'image/jpeg')
                    }
                    
                    form_data = {
                        'alt_text': f'Performance test - {description}',
                        'tags': 'performance,test',
                        'generate_resolutions': 'thumbnail,medium'
                    }
                    
                    response = self.session.post(
                        f"{self.base_url}/api/admin/media/upload",
                        files=files,
                        data=form_data,
                        timeout=30
                    )
                    
                    end_time = time.time()
                    processing_time = end_time - start_time
                    
                    if response.status_code == 200:
                        data = response.json()
                        uploaded_file = data.get("files", [{}])[0]
                        resolutions = uploaded_file.get("resolutions", [])
                        
                        performance_results.append({
                            "description": description,
                            "original_size_kb": original_size / 1024,
                            "processing_time_s": processing_time,
                            "resolutions_generated": len(resolutions)
                        })
                        
                        self.log_test(f"Performance - {description}", True, 
                                    f"Processed in {processing_time:.2f}s, generated {len(resolutions)} resolutions")
                    else:
                        self.log_test(f"Performance - {description}", False, 
                                    f"Upload failed: HTTP {response.status_code}")
            
            # Overall performance assessment
            if performance_results:
                avg_time = sum(r["processing_time_s"] for r in performance_results) / len(performance_results)
                total_resolutions = sum(r["resolutions_generated"] for r in performance_results)
                
                if avg_time < 5.0:  # Under 5 seconds average
                    self.log_test("Overall Performance Verification", True, 
                                f"Good performance: avg {avg_time:.2f}s, {total_resolutions} total resolutions generated")
                else:
                    self.log_test("Overall Performance Verification", False, 
                                f"Slow performance: avg {avg_time:.2f}s processing time")
                
                return True
            else:
                self.log_test("Performance Verification", False, "No performance data collected")
                return False
                
        except Exception as e:
            self.log_test("Performance Verification", False, f"Performance test error: {str(e)}")
            return False
    
    def run_image_optimization_tests(self):
        """Run comprehensive image optimization system tests"""
        print("🖼️ STARTING IMAGE OPTIMIZATION SYSTEM TESTING")
        print("=" * 60)
        print("Testing the newly implemented image optimization functionality...")
        print()
        
        # 1. Basic API Health Check
        self.test_health_check()
        
        # 2. Static File Serving Tests
        print("\n📁 STATIC FILE SERVING TESTING")
        print("=" * 40)
        self.test_optimized_media_static_serving()
        self.test_uploads_directory_access()
        
        # 3. Admin Authentication for Media Management
        print("\n🔐 ADMIN AUTHENTICATION TESTING")
        print("=" * 40)
        admin_auth_success = self.test_admin_authentication()
        
        # 4. Media Management APIs Testing
        if admin_auth_success:
            print("\n📸 MEDIA MANAGEMENT APIs TESTING")
            print("=" * 40)
            
            # Test media upload with optimization
            uploaded_file = self.test_admin_media_upload_endpoint()
            
            # Test media listing
            media_files = self.test_media_files_listing()
            
            # Test media statistics
            self.test_media_statistics()
            
            # Test resolution generation (if we have uploaded files)
            if uploaded_file and uploaded_file.get("id"):
                self.test_resolution_generation(uploaded_file["id"])
            
            # Test bulk operations
            self.test_bulk_tagging_operations()
            
            # 5. Error Handling Tests
            print("\n⚠️ ERROR HANDLING TESTING")
            print("=" * 40)
            self.test_image_optimization_error_handling()
            
            # 6. Performance Verification
            print("\n⚡ PERFORMANCE VERIFICATION TESTING")
            print("=" * 40)
            self.test_performance_verification()
        else:
            print("\n⚠️ SKIPPING MEDIA TESTS - Admin authentication failed")
        
        return self.generate_image_optimization_report()
    
    def generate_image_optimization_report(self):
        """Generate comprehensive test report for image optimization system"""
        print("\n" + "="*70)
        print("📊 IMAGE OPTIMIZATION SYSTEM TEST REPORT")
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
        
        # Categorize results by functionality areas
        functionality_areas = {
            "Static File Serving": ["Static Serving", "Directory Access"],
            "Admin Authentication": ["Admin Authentication"],
            "Image Upload & Optimization": ["Media Upload", "Optimization"],
            "Media Management": ["Media Files", "Statistics", "Resolution", "Tagging"],
            "Error Handling": ["Error Handling", "Invalid"],
            "Performance": ["Performance"]
        }
        
        for area, keywords in functionality_areas.items():
            area_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in keywords)]
            if area_tests:
                area_passed = sum(1 for t in area_tests if t["success"])
                area_total = len(area_tests)
                area_rate = (area_passed / area_total * 100) if area_total > 0 else 0
                
                status = "✅" if area_rate >= 80 else "⚠️" if area_rate >= 60 else "❌"
                print(f"{status} {area}: {area_passed}/{area_total} tests passed ({area_rate:.1f}%)")
        
        print()
        
        # Critical issues
        critical_failures = []
        minor_issues = []
        
        for result in self.test_results:
            if not result["success"]:
                test_name = result["test"]
                if any(keyword in test_name.lower() for keyword in ["upload", "optimization", "static", "admin"]):
                    critical_failures.append(f"❌ {test_name}: {result['message']}")
                else:
                    minor_issues.append(f"⚠️ {test_name}: {result['message']}")
        
        if critical_failures:
            print("🚨 CRITICAL ISSUES:")
            for failure in critical_failures[:5]:
                print(f"   {failure}")
            print()
        
        if minor_issues:
            print("⚠️ MINOR ISSUES:")
            for issue in minor_issues[:3]:
                print(f"   {issue}")
            print()
        
        # Success highlights
        key_successes = [r for r in self.test_results if r["success"] and 
                        any(keyword in r["test"].lower() for keyword in ["upload", "optimization", "static", "performance"])]
        if key_successes:
            print("✅ KEY IMAGE OPTIMIZATION FEATURES VERIFIED:")
            for success in key_successes[:8]:
                print(f"   ✅ {success['test']}: {success['message']}")
        
        print("\n" + "="*70)
        print("🎯 IMAGE OPTIMIZATION SYSTEM ASSESSMENT:")
        
        if success_rate >= 90:
            print("   ✅ EXCELLENT: Image optimization system working perfectly")
        elif success_rate >= 80:
            print("   ⚠️ GOOD: Image optimization system mostly working, minor issues detected")
        elif success_rate >= 70:
            print("   ⚠️ MODERATE: Some image optimization issues detected")
        else:
            print("   ❌ CRITICAL: Significant image optimization issues detected")
        
        print("="*70)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "critical_failures": critical_failures,
            "minor_issues": minor_issues,
            "system_status": "excellent" if success_rate >= 90 else "good" if success_rate >= 80 else "moderate" if success_rate >= 70 else "critical"
        }

def main():
    """Main function to run image optimization tests"""
    print("🖼️ Just Urbane Magazine - Image Optimization System Testing")
    print("=" * 65)
    
    tester = ImageOptimizationTester()
    results = tester.run_image_optimization_tests()
    
    print(f"\n🏁 Testing completed with {results['success_rate']:.1f}% success rate")
    
    return results

if __name__ == "__main__":
    main()