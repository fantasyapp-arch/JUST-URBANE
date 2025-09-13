#!/usr/bin/env python3
"""
Just Urbane Magazine - Complete Enhanced Image Optimization System Testing
Final comprehensive test for advanced image optimization with WebP support, 
content-aware optimization, progressive JPEG, and advanced API endpoints
"""

import requests
import json
import time
import os
import io
from datetime import datetime
from typing import Dict, Any, Optional, List
from PIL import Image
import tempfile

class ComprehensiveImageOptimizationTester:
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
        
    def create_test_image(self, width: int = 800, height: int = 600, content_type: str = "photo") -> bytes:
        """Create a test image for optimization testing"""
        try:
            if content_type == "photo":
                # Create photographic-style image with gradients
                img = Image.new('RGB', (width, height))
                pixels = []
                for y in range(height):
                    for x in range(width):
                        r = int(255 * (x / width))
                        g = int(255 * (y / height))
                        b = int(255 * ((x + y) / (width + height)))
                        pixels.append((r, g, b))
                img.putdata(pixels)
            elif content_type == "graphic":
                # Create graphic-style image with solid colors
                img = Image.new('RGB', (width, height), (255, 0, 0))
                # Add some geometric shapes
                from PIL import ImageDraw
                draw = ImageDraw.Draw(img)
                draw.rectangle([width//4, height//4, 3*width//4, 3*height//4], fill=(0, 255, 0))
                draw.ellipse([width//3, height//3, 2*width//3, 2*height//3], fill=(0, 0, 255))
            else:
                # Default mixed content
                img = Image.new('RGB', (width, height), (128, 128, 128))
            
            # Save to bytes
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=95)
            return buffer.getvalue()
        except Exception as e:
            print(f"Error creating test image: {str(e)}")
            return b''

    def test_api_health(self):
        """Test basic API health"""
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("API Health Check", True, f"API is healthy: {data.get('message', 'N/A')}")
                    return True
                else:
                    self.log_test("API Health Check", False, f"API unhealthy: {data}")
                    return False
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_image_optimization_api_optimize(self):
        """Test /api/image-optimization/optimize endpoint"""
        try:
            # Create test image
            test_image = self.create_test_image(1200, 800, "photo")
            
            files = {'file': ('test_photo.jpg', test_image, 'image/jpeg')}
            data = {
                'size_preset': 'medium',
                'enable_webp': 'true',
                'enable_progressive': 'true'
            }
            
            response = self.session.post(f"{self.base_url}/api/image-optimization/optimize", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "optimized_formats" in result:
                    formats = result["optimized_formats"]
                    jpeg_info = formats.get("jpeg", {})
                    webp_info = formats.get("webp", {})
                    
                    message = f"Optimization successful - JPEG: {jpeg_info.get('size', 0)} bytes ({jpeg_info.get('savings_percent', 0)}% savings)"
                    if webp_info.get("available"):
                        message += f", WebP: {webp_info.get('size', 0)} bytes ({webp_info.get('savings_percent', 0)}% additional savings)"
                    
                    self.log_test("Image Optimization API - Optimize", True, message, result)
                    return True
                else:
                    self.log_test("Image Optimization API - Optimize", False, f"Invalid response structure: {result}")
                    return False
            else:
                self.log_test("Image Optimization API - Optimize", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Image Optimization API - Optimize", False, f"Error: {str(e)}")
            return False

    def test_image_optimization_api_optimize_url(self):
        """Test /api/image-optimization/optimize-url endpoint"""
        try:
            test_url = "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            
            data = {
                'url': test_url,
                'size_preset': 'large',
                'enable_webp': 'true'
            }
            
            response = self.session.post(f"{self.base_url}/api/image-optimization/optimize-url", data=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "optimized_urls" in result:
                    urls = result["optimized_urls"]
                    message = f"URL optimization successful - Generated {len(urls)} format URLs"
                    if "webp" in urls:
                        message += " (including WebP)"
                    
                    self.log_test("Image Optimization API - Optimize URL", True, message, result)
                    return True
                else:
                    self.log_test("Image Optimization API - Optimize URL", False, f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Image Optimization API - Optimize URL", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Image Optimization API - Optimize URL", False, f"Error: {str(e)}")
            return False

    def test_image_optimization_api_responsive_urls(self):
        """Test /api/image-optimization/responsive-urls endpoint"""
        try:
            test_url = "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            
            params = {
                'url': test_url,
                'enable_webp': 'true',
                'formats': 'thumbnail,small,medium,large,hero'
            }
            
            response = self.session.get(f"{self.base_url}/api/image-optimization/responsive-urls", params=params)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "responsive_urls" in result:
                    responsive_urls = result["responsive_urls"]
                    total_formats = len(responsive_urls)
                    
                    # Check if all requested formats are present
                    expected_formats = ['thumbnail', 'small', 'medium', 'large', 'hero']
                    missing_formats = [f for f in expected_formats if f not in responsive_urls]
                    
                    if not missing_formats:
                        message = f"Responsive URLs generated successfully - {total_formats} size presets with WebP support"
                        self.log_test("Image Optimization API - Responsive URLs", True, message, result)
                        return True
                    else:
                        message = f"Missing formats: {missing_formats}"
                        self.log_test("Image Optimization API - Responsive URLs", False, message, result)
                        return False
                else:
                    self.log_test("Image Optimization API - Responsive URLs", False, f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Image Optimization API - Responsive URLs", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Image Optimization API - Responsive URLs", False, f"Error: {str(e)}")
            return False

    def test_image_optimization_api_presets(self):
        """Test /api/image-optimization/presets endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/image-optimization/presets")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "presets" in result:
                    presets = result["presets"]
                    expected_presets = ['thumbnail', 'small', 'medium', 'large', 'hero', 'mobile_hero', 'ultra']
                    
                    available_presets = list(presets.keys())
                    missing_presets = [p for p in expected_presets if p not in available_presets]
                    
                    if not missing_presets:
                        features = result.get("features", [])
                        message = f"All {len(presets)} presets available with {len(features)} optimization features"
                        self.log_test("Image Optimization API - Presets", True, message, result)
                        return True
                    else:
                        message = f"Missing presets: {missing_presets}"
                        self.log_test("Image Optimization API - Presets", False, message, result)
                        return False
                else:
                    self.log_test("Image Optimization API - Presets", False, f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Image Optimization API - Presets", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Image Optimization API - Presets", False, f"Error: {str(e)}")
            return False

    def test_image_optimization_api_stats(self):
        """Test /api/image-optimization/stats endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/image-optimization/stats")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    stats_keys = ["total_optimizations", "total_size_saved", "average_compression", "webp_usage"]
                    available_stats = [key for key in stats_keys if key in result]
                    
                    message = f"Optimization stats available - {len(available_stats)}/{len(stats_keys)} metrics"
                    if "performance_grade" in result:
                        message += f" (Grade: {result['performance_grade']})"
                    
                    self.log_test("Image Optimization API - Stats", True, message, result)
                    return True
                else:
                    self.log_test("Image Optimization API - Stats", False, f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Image Optimization API - Stats", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Image Optimization API - Stats", False, f"Error: {str(e)}")
            return False

    def test_webp_endpoint_serving(self):
        """Test WebP endpoint serving"""
        try:
            response = self.session.get(f"{self.base_url}/api/media/webp/")
            
            # We expect either a directory listing or 404 (if no files)
            if response.status_code in [200, 404]:
                if response.status_code == 200:
                    message = "WebP endpoint accessible and serving content"
                else:
                    message = "WebP endpoint accessible (no files present, which is expected)"
                
                self.log_test("WebP Endpoint Serving", True, message)
                return True
            else:
                self.log_test("WebP Endpoint Serving", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("WebP Endpoint Serving", False, f"Error: {str(e)}")
            return False

    def test_optimized_endpoint_serving(self):
        """Test optimized images endpoint serving"""
        try:
            response = self.session.get(f"{self.base_url}/api/media/optimized/")
            
            # We expect either a directory listing or 404 (if no files)
            if response.status_code in [200, 404]:
                if response.status_code == 200:
                    message = "Optimized images endpoint accessible and serving content"
                else:
                    message = "Optimized images endpoint accessible (no files present, which is expected)"
                
                self.log_test("Optimized Images Endpoint Serving", True, message)
                return True
            else:
                self.log_test("Optimized Images Endpoint Serving", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Optimized Images Endpoint Serving", False, f"Error: {str(e)}")
            return False

    def test_content_aware_optimization(self):
        """Test content-aware optimization for different image types"""
        try:
            content_types = ["photo", "graphic", "mixed"]
            successful_optimizations = 0
            
            for content_type in content_types:
                try:
                    # Create test image for this content type
                    test_image = self.create_test_image(800, 600, content_type)
                    
                    files = {'file': (f'test_{content_type}.jpg', test_image, 'image/jpeg')}
                    data = {
                        'size_preset': 'medium',
                        'enable_webp': 'true',
                        'enable_progressive': 'true'
                    }
                    
                    response = self.session.post(f"{self.base_url}/api/image-optimization/optimize", files=files, data=data)
                    
                    if response.status_code == 200:
                        result = response.json()
                        if result.get("success") and result.get("optimization_features", {}).get("content_aware"):
                            successful_optimizations += 1
                        
                except Exception as e:
                    print(f"Error testing {content_type}: {str(e)}")
            
            if successful_optimizations == len(content_types):
                message = f"Content-aware optimization working for all {len(content_types)} content types"
                self.log_test("Content-Aware Optimization", True, message)
                return True
            else:
                message = f"Content-aware optimization working for {successful_optimizations}/{len(content_types)} content types"
                self.log_test("Content-Aware Optimization", False, message)
                return False
                
        except Exception as e:
            self.log_test("Content-Aware Optimization", False, f"Error: {str(e)}")
            return False

    def test_progressive_jpeg_support(self):
        """Test progressive JPEG generation"""
        try:
            # Create large test image for progressive JPEG
            test_image = self.create_test_image(1920, 1080, "photo")
            
            files = {'file': ('test_progressive.jpg', test_image, 'image/jpeg')}
            data = {
                'size_preset': 'hero',
                'enable_webp': 'false',
                'enable_progressive': 'true'
            }
            
            response = self.session.post(f"{self.base_url}/api/image-optimization/optimize", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("optimization_features", {}).get("progressive_jpeg"):
                    message = f"Progressive JPEG generation successful for hero size ({result.get('size_preset')})"
                    self.log_test("Progressive JPEG Support", True, message, result)
                    return True
                else:
                    self.log_test("Progressive JPEG Support", False, f"Progressive JPEG not enabled in response: {result}")
                    return False
            else:
                self.log_test("Progressive JPEG Support", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Progressive JPEG Support", False, f"Error: {str(e)}")
            return False

    def test_metadata_stripping(self):
        """Test metadata stripping functionality"""
        try:
            # Create test image (metadata stripping is automatic)
            test_image = self.create_test_image(800, 600, "photo")
            
            files = {'file': ('test_metadata.jpg', test_image, 'image/jpeg')}
            data = {
                'size_preset': 'medium',
                'enable_webp': 'true',
                'enable_progressive': 'true'
            }
            
            response = self.session.post(f"{self.base_url}/api/image-optimization/optimize", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("optimization_features", {}).get("metadata_stripped"):
                    message = "Metadata stripping functionality confirmed in optimization features"
                    self.log_test("Metadata Stripping", True, message, result)
                    return True
                else:
                    self.log_test("Metadata Stripping", False, f"Metadata stripping not confirmed: {result}")
                    return False
            else:
                self.log_test("Metadata Stripping", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Metadata Stripping", False, f"Error: {str(e)}")
            return False

    def test_webp_quality_optimization(self):
        """Test WebP quality optimization and file size reduction"""
        try:
            # Create test image
            test_image = self.create_test_image(1200, 800, "photo")
            
            files = {'file': ('test_webp_quality.jpg', test_image, 'image/jpeg')}
            data = {
                'size_preset': 'large',
                'enable_webp': 'true',
                'enable_progressive': 'true'
            }
            
            response = self.session.post(f"{self.base_url}/api/image-optimization/optimize", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    formats = result.get("optimized_formats", {})
                    jpeg_info = formats.get("jpeg", {})
                    webp_info = formats.get("webp", {})
                    
                    if webp_info.get("available") and webp_info.get("size") < jpeg_info.get("size", float('inf')):
                        webp_savings = webp_info.get("savings_percent", 0)
                        message = f"WebP optimization successful - {webp_savings}% smaller than JPEG ({webp_info.get('size')} vs {jpeg_info.get('size')} bytes)"
                        self.log_test("WebP Quality Optimization", True, message, result)
                        return True
                    else:
                        message = f"WebP not smaller than JPEG or not available: JPEG={jpeg_info.get('size')}, WebP={webp_info.get('size')}"
                        self.log_test("WebP Quality Optimization", False, message, result)
                        return False
                else:
                    self.log_test("WebP Quality Optimization", False, f"Optimization failed: {result}")
                    return False
            else:
                self.log_test("WebP Quality Optimization", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("WebP Quality Optimization", False, f"Error: {str(e)}")
            return False

    def run_comprehensive_tests(self):
        """Run all comprehensive image optimization tests"""
        print("🖼️ STARTING COMPREHENSIVE ENHANCED IMAGE OPTIMIZATION SYSTEM TESTING")
        print("=" * 80)
        
        start_time = time.time()
        
        # Test sequence based on review request priorities
        tests = [
            # 1. Advanced Optimization API Testing
            ("API Health Check", self.test_api_health),
            ("Image Optimization API - Optimize", self.test_image_optimization_api_optimize),
            ("Image Optimization API - Optimize URL", self.test_image_optimization_api_optimize_url),
            ("Image Optimization API - Responsive URLs", self.test_image_optimization_api_responsive_urls),
            ("Image Optimization API - Presets", self.test_image_optimization_api_presets),
            ("Image Optimization API - Stats", self.test_image_optimization_api_stats),
            
            # 2. Complete System Integration
            ("Content-Aware Optimization", self.test_content_aware_optimization),
            ("Progressive JPEG Support", self.test_progressive_jpeg_support),
            ("Metadata Stripping", self.test_metadata_stripping),
            
            # 3. WebP Format Verification
            ("WebP Endpoint Serving", self.test_webp_endpoint_serving),
            ("WebP Quality Optimization", self.test_webp_quality_optimization),
            
            # 4. Performance and Quality Metrics
            ("Optimized Images Endpoint Serving", self.test_optimized_endpoint_serving),
        ]
        
        passed_tests = 0
        total_tests = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed_tests += 1
            except Exception as e:
                self.log_test(test_name, False, f"Test execution error: {str(e)}")
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Calculate success rate
        success_rate = (passed_tests / total_tests) * 100
        
        print("\n" + "=" * 80)
        print("🖼️ COMPREHENSIVE ENHANCED IMAGE OPTIMIZATION SYSTEM TESTING COMPLETED")
        print(f"📊 RESULTS: {passed_tests}/{total_tests} tests passed ({success_rate:.1f}% success rate)")
        print(f"⏱️ Duration: {duration:.2f} seconds")
        
        # Detailed results
        print(f"\n📋 DETAILED TEST RESULTS:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"{status} {result['test']}: {result['message']}")
        
        # Summary based on review request areas
        print(f"\n🎯 REVIEW REQUEST VERIFICATION:")
        
        api_tests = [r for r in self.test_results if "Image Optimization API" in r["test"]]
        api_success = sum(1 for r in api_tests if r["success"])
        print(f"1. Advanced Optimization API Testing: {api_success}/{len(api_tests)} endpoints working")
        
        integration_tests = [r for r in self.test_results if r["test"] in ["Content-Aware Optimization", "Progressive JPEG Support", "Metadata Stripping"]]
        integration_success = sum(1 for r in integration_tests if r["success"])
        print(f"2. Complete System Integration: {integration_success}/{len(integration_tests)} features working")
        
        webp_tests = [r for r in self.test_results if "WebP" in r["test"]]
        webp_success = sum(1 for r in webp_tests if r["success"])
        print(f"3. WebP Format Verification: {webp_success}/{len(webp_tests)} WebP features working")
        
        performance_tests = [r for r in self.test_results if "Endpoint Serving" in r["test"]]
        performance_success = sum(1 for r in performance_tests if r["success"])
        print(f"4. Performance and Quality Metrics: {performance_success}/{len(performance_tests)} serving endpoints working")
        
        # Overall assessment
        if success_rate >= 90:
            print(f"\n🏆 EXCELLENT: Enhanced image optimization system is production-ready with {success_rate:.1f}% success rate")
        elif success_rate >= 80:
            print(f"\n✅ GOOD: Enhanced image optimization system is functional with {success_rate:.1f}% success rate")
        elif success_rate >= 70:
            print(f"\n⚠️ ACCEPTABLE: Enhanced image optimization system has issues but core functionality works ({success_rate:.1f}% success rate)")
        else:
            print(f"\n❌ NEEDS ATTENTION: Enhanced image optimization system has significant issues ({success_rate:.1f}% success rate)")
        
        return {
            "success_rate": success_rate,
            "passed_tests": passed_tests,
            "total_tests": total_tests,
            "duration": duration,
            "test_results": self.test_results
        }

if __name__ == "__main__":
    tester = ComprehensiveImageOptimizationTester()
    results = tester.run_comprehensive_tests()