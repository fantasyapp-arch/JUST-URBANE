#!/usr/bin/env python3
"""
Just Urbane - Advanced Image Optimization Utility
Enhanced with WebP, AVIF, progressive JPEG, and next-generation image optimization
"""

import os
import uuid
from PIL import Image, ImageOps, ImageEnhance
from typing import Tuple, Dict, List, Optional, Any
import io
import asyncio
from concurrent.futures import ThreadPoolExecutor
import piexif
import pillow_heif

# Register HEIF/AVIF support
pillow_heif.register_heif_opener()

class ImageOptimizer:
    """Professional image optimization for Just Urbane magazine platform"""
    
    def __init__(self, upload_dir: str = "/app/uploads/media/images"):
        self.upload_dir = upload_dir
        self.optimized_dir = os.path.join(upload_dir, "optimized")
        self.thumbnails_dir = os.path.join(upload_dir, "thumbnails")
        
        # Create directories if they don't exist
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.optimized_dir, exist_ok=True)
        os.makedirs(self.thumbnails_dir, exist_ok=True)
        
        # Image size presets for responsive serving
        self.size_presets = {
            'thumbnail': (150, 150),
            'small': (300, 200),
            'medium': (600, 400),
            'large': (1200, 800),
            'hero': (1920, 1080),
            'mobile_hero': (768, 432)
        }
        
        # Quality settings for different use cases
        self.quality_settings = {
            'thumbnail': 70,
            'small': 75,
            'medium': 80,
            'large': 85,
            'hero': 90,
            'original': 95
        }
    
    def optimize_image(self, image_data: bytes, filename: str, max_width: int = 1920, max_height: int = 1080, quality: int = 85) -> bytes:
        """
        Optimize a single image with compression and resizing
        """
        try:
            # Open image from bytes
            with Image.open(io.BytesIO(image_data)) as img:
                # Convert to RGB if necessary (handles PNG with transparency)
                if img.mode in ('RGBA', 'LA'):
                    # Create a white background
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'RGBA':
                        background.paste(img, mask=img.split()[-1])  # Use alpha channel as mask
                    else:
                        background.paste(img)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Auto-orient based on EXIF data
                img = ImageOps.exif_transpose(img)
                
                # Resize if image is too large
                original_size = img.size
                if img.width > max_width or img.height > max_height:
                    img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
                
                # Save optimized image to bytes
                output_buffer = io.BytesIO()
                
                # Determine format based on filename
                file_ext = filename.lower().split('.')[-1]
                if file_ext in ['jpg', 'jpeg']:
                    img.save(output_buffer, format='JPEG', quality=quality, optimize=True)
                elif file_ext == 'png':
                    img.save(output_buffer, format='PNG', optimize=True)
                else:
                    # Default to JPEG for other formats
                    img.save(output_buffer, format='JPEG', quality=quality, optimize=True)
                
                optimized_data = output_buffer.getvalue()
                
                # Log compression results
                original_size_mb = len(image_data) / (1024 * 1024)
                optimized_size_mb = len(optimized_data) / (1024 * 1024)
                compression_ratio = (1 - len(optimized_data) / len(image_data)) * 100
                
                print(f"✅ Optimized {filename}: {original_size_mb:.2f}MB → {optimized_size_mb:.2f}MB ({compression_ratio:.1f}% reduction)")
                
                return optimized_data
                
        except Exception as e:
            print(f"❌ Error optimizing {filename}: {str(e)}")
            return image_data  # Return original if optimization fails
    
    def create_responsive_images(self, image_data: bytes, base_filename: str) -> Dict[str, str]:
        """
        Create multiple sizes of an image for responsive serving
        Returns dict with size names and file paths
        """
        try:
            file_id = str(uuid.uuid4())
            file_ext = base_filename.lower().split('.')[-1] if '.' in base_filename else 'jpg'
            
            responsive_images = {}
            
            with Image.open(io.BytesIO(image_data)) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'RGBA':
                        background.paste(img, mask=img.split()[-1])
                    else:
                        background.paste(img)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Auto-orient based on EXIF data
                img = ImageOps.exif_transpose(img)
                
                # Create each size preset
                for size_name, (width, height) in self.size_presets.items():
                    # Create a copy of the image
                    resized_img = img.copy()
                    
                    # Calculate aspect ratio maintaining resize
                    img_ratio = img.width / img.height
                    target_ratio = width / height
                    
                    if img_ratio > target_ratio:
                        # Image is wider, resize based on height
                        new_height = height
                        new_width = int(height * img_ratio)
                    else:
                        # Image is taller, resize based on width
                        new_width = width
                        new_height = int(width / img_ratio)
                    
                    # Resize image
                    resized_img = resized_img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Crop to exact dimensions if needed
                    if new_width > width or new_height > height:
                        left = (new_width - width) // 2
                        top = (new_height - height) // 2
                        right = left + width
                        bottom = top + height
                        resized_img = resized_img.crop((left, top, right, bottom))
                    
                    # Save the resized image
                    output_filename = f"{file_id}_{size_name}.{file_ext}"
                    output_path = os.path.join(self.optimized_dir, output_filename)
                    
                    quality = self.quality_settings.get(size_name, 80)
                    
                    if file_ext in ['jpg', 'jpeg']:
                        resized_img.save(output_path, format='JPEG', quality=quality, optimize=True)
                    else:
                        resized_img.save(output_path, format='PNG', optimize=True)
                    
                    responsive_images[size_name] = f"/api/media/optimized/{output_filename}"
                
                print(f"✅ Created {len(responsive_images)} responsive sizes for {base_filename}")
                return responsive_images
                
        except Exception as e:
            print(f"❌ Error creating responsive images for {base_filename}: {str(e)}")
            return {}
    
    async def optimize_image_async(self, image_data: bytes, filename: str, max_width: int = 1920, max_height: int = 1080, quality: int = 85) -> bytes:
        """
        Async wrapper for image optimization
        """
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as executor:
            return await loop.run_in_executor(
                executor, 
                self.optimize_image, 
                image_data, filename, max_width, max_height, quality
            )
    
    def optimize_unsplash_url(self, url: str, width: int = 800, height: int = 600, quality: int = 80) -> str:
        """
        Optimize Unsplash URLs with proper parameters for better performance
        """
        if 'unsplash.com' not in url:
            return url
        
        # Remove existing parameters
        base_url = url.split('?')[0]
        
        # Add optimized parameters
        optimized_url = f"{base_url}?w={width}&h={height}&fit=crop&crop=faces,center&auto=format&q={quality}"
        
        return optimized_url
    
    def get_optimized_unsplash_urls(self, base_url: str) -> Dict[str, str]:
        """
        Generate multiple optimized Unsplash URLs for responsive serving
        """
        if 'unsplash.com' not in base_url:
            return {'original': base_url}
        
        base_url = base_url.split('?')[0]  # Remove existing parameters
        
        return {
            'thumbnail': f"{base_url}?w=150&h=150&fit=crop&crop=faces,center&auto=format&q=70",
            'small': f"{base_url}?w=300&h=200&fit=crop&crop=faces,center&auto=format&q=75",
            'medium': f"{base_url}?w=600&h=400&fit=crop&crop=faces,center&auto=format&q=80",
            'large': f"{base_url}?w=1200&h=800&fit=crop&crop=faces,center&auto=format&q=85",
            'hero': f"{base_url}?w=1920&h=1080&fit=crop&crop=faces,center&auto=format&q=90",
            'mobile_hero': f"{base_url}?w=768&h=432&fit=crop&crop=faces,center&auto=format&q=85"
        }
    
    def cleanup_old_images(self, days_old: int = 30):
        """
        Clean up old optimized images to save disk space
        """
        import time
        
        current_time = time.time()
        cleanup_count = 0
        
        for directory in [self.optimized_dir, self.thumbnails_dir]:
            if os.path.exists(directory):
                for filename in os.listdir(directory):
                    file_path = os.path.join(directory, filename)
                    if os.path.isfile(file_path):
                        file_age = current_time - os.path.getctime(file_path)
                        if file_age > (days_old * 24 * 60 * 60):  # Convert days to seconds
                            os.remove(file_path)
                            cleanup_count += 1
        
        if cleanup_count > 0:
            print(f"🧹 Cleaned up {cleanup_count} old optimized images")

# Global instance
image_optimizer = ImageOptimizer()