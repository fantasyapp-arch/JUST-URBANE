#!/usr/bin/env python3
"""
Just Urbane - Advanced Image Optimization Utility
Enhanced with WebP, progressive JPEG, and next-generation image optimization
"""

import os
import uuid
from PIL import Image, ImageOps, ImageEnhance
from typing import Tuple, Dict, List, Optional, Any
import io
import asyncio
from concurrent.futures import ThreadPoolExecutor

class AdvancedImageOptimizer:
    """Next-generation image optimization for Just Urbane magazine platform"""
    
    def __init__(self, upload_dir: str = "/app/uploads/media/images"):
        self.upload_dir = upload_dir
        self.optimized_dir = os.path.join(upload_dir, "optimized")
        self.webp_dir = os.path.join(upload_dir, "webp")
        self.avif_dir = os.path.join(upload_dir, "avif")
        self.thumbnails_dir = os.path.join(upload_dir, "thumbnails")
        
        # Create directories if they don't exist
        for directory in [self.upload_dir, self.optimized_dir, self.webp_dir, 
                         self.avif_dir, self.thumbnails_dir]:
            os.makedirs(directory, exist_ok=True)
        
        # Enhanced image size presets with context-aware optimization
        self.size_presets = {
            'thumbnail': {'w': 150, 'h': 150, 'q': 70, 'webp_q': 60},
            'small': {'w': 300, 'h': 200, 'q': 75, 'webp_q': 65},
            'medium': {'w': 600, 'h': 400, 'q': 80, 'webp_q': 70},
            'large': {'w': 1200, 'h': 800, 'q': 85, 'webp_q': 75},
            'hero': {'w': 1920, 'h': 1080, 'q': 90, 'webp_q': 80},
            'mobile_hero': {'w': 768, 'h': 432, 'q': 85, 'webp_q': 75},
            'ultra': {'w': 2560, 'h': 1440, 'q': 95, 'webp_q': 85}
        }
        
        # Content-aware optimization settings
        self.content_optimization = {
            'photo': {'sharpness': 1.1, 'contrast': 1.05, 'color': 1.02},
            'graphic': {'sharpness': 1.2, 'contrast': 1.1, 'color': 1.0},
            'text': {'sharpness': 1.3, 'contrast': 1.15, 'color': 0.98},
            'mixed': {'sharpness': 1.1, 'contrast': 1.08, 'color': 1.01}
        }

    def detect_image_content_type(self, img: Image.Image) -> str:
        """
        Analyze image to determine content type for optimization
        """
        try:
            # Convert to RGB if needed for analysis
            if img.mode != 'RGB':
                analysis_img = img.convert('RGB')
            else:
                analysis_img = img
            
            # Resize for faster analysis
            analysis_img = analysis_img.resize((100, 100), Image.Resampling.LANCZOS)
            
            # Get pixel data
            pixels = list(analysis_img.getdata())
            
            # Calculate color variance (higher = more photographic)
            r_values = [p[0] for p in pixels]
            g_values = [p[1] for p in pixels]
            b_values = [p[2] for p in pixels]
            
            color_variance = (
                (max(r_values) - min(r_values)) +
                (max(g_values) - min(g_values)) +
                (max(b_values) - min(b_values))
            ) / 3
            
            # Detect edges (higher = more graphic/text content)
            edge_img = analysis_img.filter(ImageOps.FIND_EDGES)
            edge_pixels = list(edge_img.getdata())
            edge_intensity = sum([sum(p) for p in edge_pixels]) / len(edge_pixels)
            
            # Classification logic
            if color_variance > 200 and edge_intensity < 30:
                return 'photo'  # High color variance, low edges = photo
            elif edge_intensity > 60:
                return 'text'   # High edges = text/graphics
            elif color_variance < 100:
                return 'graphic' # Low color variance = graphics
            else:
                return 'mixed'   # Mixed content
                
        except Exception:
            return 'mixed'  # Default fallback

    def enhance_image_content_aware(self, img: Image.Image, content_type: str) -> Image.Image:
        """
        Apply content-aware enhancements to improve image quality
        """
        try:
            settings = self.content_optimization.get(content_type, self.content_optimization['mixed'])
            
            # Apply sharpness enhancement
            if settings['sharpness'] != 1.0:
                sharpness_enhancer = ImageEnhance.Sharpness(img)
                img = sharpness_enhancer.enhance(settings['sharpness'])
            
            # Apply contrast enhancement
            if settings['contrast'] != 1.0:
                contrast_enhancer = ImageEnhance.Contrast(img)
                img = contrast_enhancer.enhance(settings['contrast'])
            
            # Apply color enhancement
            if settings['color'] != 1.0:
                color_enhancer = ImageEnhance.Color(img)
                img = color_enhancer.enhance(settings['color'])
            
            return img
        except Exception:
            return img  # Return original if enhancement fails

    def strip_metadata(self, img: Image.Image) -> Image.Image:
        """
        Strip EXIF and other metadata to reduce file size
        (keeping only essential orientation data)
        """
        try:
            # Auto-orient first to preserve correct orientation
            img = ImageOps.exif_transpose(img)
            
            # Create new image without metadata
            data = list(img.getdata())
            clean_img = Image.new(img.mode, img.size)
            clean_img.putdata(data)
            
            return clean_img
        except Exception:
            return img

    def optimize_image_advanced(self, image_data: bytes, filename: str, 
                              size_preset: str = 'medium', 
                              enable_webp: bool = True,
                              enable_avif: bool = False,
                              progressive: bool = True) -> Dict[str, bytes]:
        """
        Advanced image optimization with multiple format support
        """
        results = {}
        
        try:
            preset = self.size_presets.get(size_preset, self.size_presets['medium'])
            
            with Image.open(io.BytesIO(image_data)) as img:
                # Strip metadata for smaller file size
                img = self.strip_metadata(img)
                
                # Detect content type for optimization
                content_type = self.detect_image_content_type(img)
                
                # Apply content-aware enhancements
                img = self.enhance_image_content_aware(img, content_type)
                
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA'):
                    # For images with transparency, keep it for WebP/PNG
                    has_transparency = True
                    if img.mode == 'RGBA':
                        # Check if alpha channel is actually used
                        alpha = img.split()[-1]
                        has_transparency = alpha.getbbox() is not None
                else:
                    has_transparency = False
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                
                # Resize if needed
                if img.width > preset['w'] or img.height > preset['h']:
                    img.thumbnail((preset['w'], preset['h']), Image.Resampling.LANCZOS)
                
                # Generate JPEG (progressive if enabled)
                jpeg_buffer = io.BytesIO()
                save_options = {
                    'format': 'JPEG',
                    'quality': preset['q'],
                    'optimize': True
                }
                if progressive and not has_transparency:
                    save_options['progressive'] = True
                
                if has_transparency:
                    # For images with transparency, create white background for JPEG
                    jpeg_img = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'RGBA':
                        jpeg_img.paste(img, mask=img.split()[-1])
                    else:
                        jpeg_img.paste(img)
                    jpeg_img.save(jpeg_buffer, **save_options)
                else:
                    img.save(jpeg_buffer, **save_options)
                
                results['jpeg'] = jpeg_buffer.getvalue()
                
                # Generate WebP (better compression)
                if enable_webp:
                    try:
                        webp_buffer = io.BytesIO()
                        webp_options = {
                            'format': 'WebP',
                            'quality': preset['webp_q'],
                            'method': 6,  # Maximum compression
                            'optimize': True
                        }
                        
                        # WebP supports transparency
                        img.save(webp_buffer, **webp_options)
                        results['webp'] = webp_buffer.getvalue()
                    except Exception as e:
                        print(f"WebP generation failed: {str(e)} (WebP support may not be available)")
                
                # Generate AVIF (even better compression, newer format)
                if enable_avif:
                    try:
                        avif_buffer = io.BytesIO()
                        # Basic AVIF support (may require additional libraries)
                        img.save(avif_buffer, format='AVIF', quality=preset['webp_q'] - 5)
                        results['avif'] = avif_buffer.getvalue()
                    except Exception as e:
                        print(f"AVIF generation failed: {str(e)} (this is normal if AVIF support is not available)")
                
                # Log compression results
                original_size_mb = len(image_data) / (1024 * 1024)
                jpeg_size_mb = len(results['jpeg']) / (1024 * 1024)
                
                compression_info = f"JPEG: {original_size_mb:.2f}MB → {jpeg_size_mb:.2f}MB"
                
                if 'webp' in results:
                    webp_size_mb = len(results['webp']) / (1024 * 1024)
                    webp_savings = (1 - len(results['webp']) / len(results['jpeg'])) * 100
                    compression_info += f", WebP: {webp_size_mb:.2f}MB ({webp_savings:.1f}% smaller)"
                
                if 'avif' in results:
                    avif_size_mb = len(results['avif']) / (1024 * 1024)
                    avif_savings = (1 - len(results['avif']) / len(results['jpeg'])) * 100
                    compression_info += f", AVIF: {avif_size_mb:.2f}MB ({avif_savings:.1f}% smaller)"
                
                print(f"✅ Advanced optimization for {filename} ({content_type}): {compression_info}")
                
                return results
                
        except Exception as e:
            print(f"❌ Error in advanced optimization for {filename}: {str(e)}")
            # Fallback to original image
            return {'jpeg': image_data}

    def create_responsive_images_advanced(self, image_data: bytes, base_filename: str) -> Dict[str, Dict[str, str]]:
        """
        Create multiple sizes and formats for responsive serving
        """
        try:
            file_id = str(uuid.uuid4())
            responsive_images = {}
            
            for size_name, preset in self.size_presets.items():
                # Generate all formats for this size
                optimized_formats = self.optimize_image_advanced(
                    image_data, 
                    base_filename, 
                    size_preset=size_name,
                    enable_webp=True,
                    enable_avif=True,
                    progressive=True
                )
                
                size_urls = {}
                
                # Save JPEG version
                if 'jpeg' in optimized_formats:
                    jpeg_filename = f"{file_id}_{size_name}.jpg"
                    jpeg_path = os.path.join(self.optimized_dir, jpeg_filename)
                    with open(jpeg_path, 'wb') as f:
                        f.write(optimized_formats['jpeg'])
                    size_urls['jpeg'] = f"/api/media/optimized/{jpeg_filename}"
                
                # Save WebP version
                if 'webp' in optimized_formats:
                    webp_filename = f"{file_id}_{size_name}.webp"
                    webp_path = os.path.join(self.webp_dir, webp_filename)
                    with open(webp_path, 'wb') as f:
                        f.write(optimized_formats['webp'])
                    size_urls['webp'] = f"/api/media/webp/{webp_filename}"
                
                # Save AVIF version
                if 'avif' in optimized_formats:
                    avif_filename = f"{file_id}_{size_name}.avif"
                    avif_path = os.path.join(self.avif_dir, avif_filename)
                    with open(avif_path, 'wb') as f:
                        f.write(optimized_formats['avif'])
                    size_urls['avif'] = f"/api/media/avif/{avif_filename}"
                
                responsive_images[size_name] = size_urls
            
            total_formats = sum(len(urls) for urls in responsive_images.values())
            print(f"✅ Created {len(responsive_images)} sizes with {total_formats} total format variants for {base_filename}")
            
            return responsive_images
            
        except Exception as e:
            print(f"❌ Error creating responsive images for {base_filename}: {str(e)}")
            return {}

    def optimize_unsplash_url_advanced(self, url: str, size_preset: str = 'medium', 
                                     enable_webp: bool = True) -> Dict[str, str]:
        """
        Generate advanced optimized Unsplash URLs with WebP support
        """
        if 'unsplash.com' not in url:
            return {'original': url}
        
        base_url = url.split('?')[0]
        preset = self.size_presets.get(size_preset, self.size_presets['medium'])
        
        urls = {}
        
        # Standard JPEG version
        jpeg_params = f"w={preset['w']}&h={preset['h']}&fit=crop&crop=faces,center&auto=format&q={preset['q']}"
        urls['jpeg'] = f"{base_url}?{jpeg_params}"
        
        # WebP version (Unsplash supports fm=webp parameter)
        if enable_webp:
            webp_params = f"w={preset['w']}&h={preset['h']}&fit=crop&crop=faces,center&auto=format&fm=webp&q={preset['webp_q']}"
            urls['webp'] = f"{base_url}?{webp_params}"
        
        # AVIF version (if Unsplash supports it)
        try:
            avif_params = f"w={preset['w']}&h={preset['h']}&fit=crop&crop=faces,center&auto=format&fm=avif&q={preset['webp_q'] - 5}"
            urls['avif'] = f"{base_url}?{avif_params}"
        except:
            pass  # AVIF might not be supported
        
        return urls

    def bulk_optimize_directory(self, directory_path: str, file_extensions: List[str] = ['.jpg', '.jpeg', '.png']) -> Dict[str, Any]:
        """
        Bulk optimize all images in a directory
        """
        results = {
            'processed': 0,
            'optimized': 0,
            'errors': 0,
            'total_size_before': 0,
            'total_size_after': 0,
            'files': []
        }
        
        try:
            for root, dirs, files in os.walk(directory_path):
                # Skip already optimized directories
                if any(opt_dir in root for opt_dir in ['optimized', 'webp', 'avif']):
                    continue
                    
                for file in files:
                    if any(file.lower().endswith(ext) for ext in file_extensions):
                        file_path = os.path.join(root, file)
                        
                        try:
                            # Read original file
                            with open(file_path, 'rb') as f:
                                original_data = f.read()
                            
                            original_size = len(original_data)
                            results['total_size_before'] += original_size
                            results['processed'] += 1
                            
                            # Optimize image
                            optimized_formats = self.optimize_image_advanced(
                                original_data, 
                                file,
                                size_preset='large',
                                enable_webp=True,
                                enable_avif=True
                            )
                            
                            if optimized_formats and 'jpeg' in optimized_formats:
                                # Save optimized version
                                base_name = os.path.splitext(file)[0]
                                optimized_path = os.path.join(self.optimized_dir, f"{base_name}_optimized.jpg")
                                
                                with open(optimized_path, 'wb') as f:
                                    f.write(optimized_formats['jpeg'])
                                
                                optimized_size = len(optimized_formats['jpeg'])
                                results['total_size_after'] += optimized_size
                                results['optimized'] += 1
                                
                                # Save WebP version if available
                                if 'webp' in optimized_formats:
                                    webp_path = os.path.join(self.webp_dir, f"{base_name}_optimized.webp")
                                    with open(webp_path, 'wb') as f:
                                        f.write(optimized_formats['webp'])
                                
                                results['files'].append({
                                    'original': file_path,
                                    'optimized': optimized_path,
                                    'original_size': original_size,
                                    'optimized_size': optimized_size,
                                    'savings_percent': ((original_size - optimized_size) / original_size) * 100
                                })
                            
                        except Exception as e:
                            results['errors'] += 1
                            print(f"❌ Error optimizing {file_path}: {str(e)}")
            
            # Calculate total savings
            if results['total_size_before'] > 0:
                total_savings = ((results['total_size_before'] - results['total_size_after']) / results['total_size_before']) * 100
                results['total_savings_percent'] = total_savings
                results['total_size_saved'] = results['total_size_before'] - results['total_size_after']
                
                print(f"✅ Bulk optimization complete:")
                print(f"   Files processed: {results['processed']}")
                print(f"   Files optimized: {results['optimized']}")
                print(f"   Total size before: {results['total_size_before'] / (1024*1024):.2f}MB")
                print(f"   Total size after: {results['total_size_after'] / (1024*1024):.2f}MB")
                print(f"   Total savings: {total_savings:.1f}% ({results['total_size_saved'] / (1024*1024):.2f}MB)")
            
            return results
            
        except Exception as e:
            print(f"❌ Error in bulk optimization: {str(e)}")
            return results

    # Legacy compatibility methods
    def optimize_image(self, image_data: bytes, filename: str, max_width: int = 1920, max_height: int = 1080, quality: int = 85) -> bytes:
        """Legacy compatibility method"""
        results = self.optimize_image_advanced(image_data, filename, 'large', enable_webp=False, enable_avif=False)
        return results.get('jpeg', image_data)

    def create_responsive_images(self, image_data: bytes, base_filename: str) -> Dict[str, str]:
        """Legacy compatibility method"""
        advanced_results = self.create_responsive_images_advanced(image_data, base_filename)
        # Return only JPEG URLs for compatibility
        legacy_results = {}
        for size_name, urls in advanced_results.items():
            if 'jpeg' in urls:
                legacy_results[size_name] = urls['jpeg']
        return legacy_results

    async def optimize_image_async(self, image_data: bytes, filename: str, max_width: int = 1920, max_height: int = 1080, quality: int = 85) -> bytes:
        """Legacy async wrapper"""
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            return await loop.run_in_executor(
                executor, 
                self.optimize_image, 
                image_data, filename, max_width, max_height, quality
            )

    def optimize_unsplash_url(self, url: str, width: int = 800, height: int = 600, quality: int = 80) -> str:
        """Legacy Unsplash URL optimization"""
        if 'unsplash.com' not in url:
            return url
        
        base_url = url.split('?')[0]
        optimized_url = f"{base_url}?w={width}&h={height}&fit=crop&crop=faces,center&auto=format&q={quality}"
        return optimized_url

    def get_optimized_unsplash_urls(self, base_url: str) -> Dict[str, str]:
        """Legacy method for Unsplash URLs"""
        if 'unsplash.com' not in base_url:
            return {'original': base_url}
        
        base_url = base_url.split('?')[0]
        
        return {
            'thumbnail': f"{base_url}?w=150&h=150&fit=crop&crop=faces,center&auto=format&q=70",
            'small': f"{base_url}?w=300&h=200&fit=crop&crop=faces,center&auto=format&q=75",
            'medium': f"{base_url}?w=600&h=400&fit=crop&crop=faces,center&auto=format&q=80",
            'large': f"{base_url}?w=1200&h=800&fit=crop&crop=faces,center&auto=format&q=85",
            'hero': f"{base_url}?w=1920&h=1080&fit=crop&crop=faces,center&auto=format&q=90",
            'mobile_hero': f"{base_url}?w=768&h=432&fit=crop&crop=faces,center&auto=format&q=85"
        }

    def cleanup_old_images(self, days_old: int = 30):
        """Clean up old optimized images"""
        import time
        
        current_time = time.time()
        cleanup_count = 0
        
        for directory in [self.optimized_dir, self.webp_dir, self.avif_dir, self.thumbnails_dir]:
            if os.path.exists(directory):
                for filename in os.listdir(directory):
                    file_path = os.path.join(directory, filename)
                    if os.path.isfile(file_path):
                        file_age = current_time - os.path.getctime(file_path)
                        if file_age > (days_old * 24 * 60 * 60):
                            os.remove(file_path)
                            cleanup_count += 1
        
        if cleanup_count > 0:
            print(f"🧹 Cleaned up {cleanup_count} old optimized images")

# Global instance with advanced features
advanced_image_optimizer = AdvancedImageOptimizer()

# Legacy compatibility
image_optimizer = advanced_image_optimizer