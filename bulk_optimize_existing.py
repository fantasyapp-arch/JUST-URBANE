#!/usr/bin/env python3
"""
Just Urbane - Bulk Image Optimization Script
Optimizes all existing images in the uploads directory with WebP and advanced features
"""

import os
import sys
import json
from pathlib import Path

# Add backend to path for imports
sys.path.append('/app/backend')

from image_optimizer import advanced_image_optimizer

class BulkImageOptimizer:
    def __init__(self):
        self.optimizer = advanced_image_optimizer
        self.results = {
            'total_processed': 0,
            'successfully_optimized': 0,
            'errors': 0,
            'total_size_before': 0,
            'total_size_after': 0,
            'webp_generated': 0,
            'file_details': []
        }
    
    def optimize_directory(self, directory_path: str):
        """Optimize all images in a directory"""
        print(f"🔍 Scanning directory: {directory_path}")
        
        if not os.path.exists(directory_path):
            print(f"❌ Directory not found: {directory_path}")
            return
        
        # Supported image extensions
        image_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        
        for root, dirs, files in os.walk(directory_path):
            # Skip already optimized directories
            if any(opt_dir in root for opt_dir in ['optimized', 'webp', 'avif', 'thumbnails']):
                continue
            
            for file in files:
                if any(file.lower().endswith(ext) for ext in image_extensions):
                    file_path = os.path.join(root, file)
                    self.optimize_single_file(file_path)
    
    def optimize_single_file(self, file_path: str):
        """Optimize a single image file"""
        try:
            self.results['total_processed'] += 1
            
            print(f"📸 Processing: {os.path.basename(file_path)}")
            
            # Read original file
            with open(file_path, 'rb') as f:
                original_data = f.read()
            
            original_size = len(original_data)
            self.results['total_size_before'] += original_size
            
            # Determine optimal size preset based on file size and dimensions
            from PIL import Image
            with Image.open(file_path) as img:
                width, height = img.size
                
                # Choose preset based on dimensions
                if width >= 1920 or height >= 1080:
                    size_preset = 'hero'
                elif width >= 1200 or height >= 800:
                    size_preset = 'large'
                elif width >= 600 or height >= 400:
                    size_preset = 'medium'
                elif width >= 300 or height >= 200:
                    size_preset = 'small'
                else:
                    size_preset = 'thumbnail'
            
            # Optimize with advanced features
            optimized_formats = self.optimizer.optimize_image_advanced(
                original_data,
                os.path.basename(file_path),
                size_preset=size_preset,
                enable_webp=True,
                enable_avif=False,  # Disabled for compatibility
                progressive=True
            )
            
            if optimized_formats:
                # Calculate savings
                jpeg_size = len(optimized_formats.get('jpeg', original_data))
                self.results['total_size_after'] += jpeg_size
                
                # Track WebP generation
                if 'webp' in optimized_formats:
                    self.results['webp_generated'] += 1
                    webp_size = len(optimized_formats['webp'])
                    webp_savings = ((jpeg_size - webp_size) / jpeg_size) * 100 if jpeg_size > 0 else 0
                else:
                    webp_size = 0
                    webp_savings = 0
                
                # Calculate overall savings
                savings_percent = ((original_size - jpeg_size) / original_size) * 100 if original_size > 0 else 0
                
                self.results['file_details'].append({
                    'file': os.path.basename(file_path),
                    'original_size': original_size,
                    'jpeg_size': jpeg_size,
                    'webp_size': webp_size,
                    'savings_percent': round(savings_percent, 1),
                    'webp_savings_percent': round(webp_savings, 1),
                    'size_preset': size_preset,
                    'dimensions': f"{width}x{height}"
                })
                
                self.results['successfully_optimized'] += 1
                
                print(f"  ✅ Optimized: {savings_percent:.1f}% smaller")
                if webp_savings > 0:
                    print(f"  🚀 WebP: {webp_savings:.1f}% smaller than JPEG")
            else:
                self.results['errors'] += 1
                print(f"  ❌ Failed to optimize")
                
        except Exception as e:
            self.results['errors'] += 1
            print(f"  ❌ Error: {str(e)}")
    
    def print_summary(self):
        """Print optimization summary"""
        print("\n" + "="*60)
        print("🎯 BULK OPTIMIZATION SUMMARY")
        print("="*60)
        
        print(f"📊 Files processed: {self.results['total_processed']}")
        print(f"✅ Successfully optimized: {self.results['successfully_optimized']}")
        print(f"🚀 WebP versions created: {self.results['webp_generated']}")
        print(f"❌ Errors: {self.results['errors']}")
        
        if self.results['total_size_before'] > 0:
            total_savings = ((self.results['total_size_before'] - self.results['total_size_after']) / self.results['total_size_before']) * 100
            size_before_mb = self.results['total_size_before'] / (1024 * 1024)
            size_after_mb = self.results['total_size_after'] / (1024 * 1024)
            size_saved_mb = (self.results['total_size_before'] - self.results['total_size_after']) / (1024 * 1024)
            
            print(f"\n💾 Storage Impact:")
            print(f"   Before: {size_before_mb:.2f} MB")
            print(f"   After: {size_after_mb:.2f} MB")
            print(f"   Saved: {size_saved_mb:.2f} MB ({total_savings:.1f}%)")
        
        # Show top savings
        if self.results['file_details']:
            print(f"\n🏆 Top 5 Optimizations:")
            sorted_files = sorted(self.results['file_details'], key=lambda x: x['savings_percent'], reverse=True)
            for i, file_detail in enumerate(sorted_files[:5], 1):
                print(f"   {i}. {file_detail['file']}: {file_detail['savings_percent']}% smaller")
        
        print("\n💡 Performance Impact:")
        print("   ⚡ Faster page loading times")
        print("   📱 Better mobile experience")
        print("   🌐 Reduced bandwidth usage")
        print("   🚀 WebP format support for modern browsers")
    
    def save_detailed_report(self, output_file: str = "/app/bulk_optimization_report.json"):
        """Save detailed optimization report"""
        try:
            with open(output_file, 'w') as f:
                json.dump(self.results, f, indent=2)
            print(f"\n📄 Detailed report saved: {output_file}")
        except Exception as e:
            print(f"❌ Error saving report: {str(e)}")

def main():
    """Main execution"""
    print("🚀 Starting Just Urbane Bulk Image Optimization")
    print("Enhanced with WebP support and advanced compression\n")
    
    optimizer = BulkImageOptimizer()
    
    # Directories to optimize
    directories_to_scan = [
        "/app/uploads/media/images",
        "/app/uploads/articles",
    ]
    
    for directory in directories_to_scan:
        if os.path.exists(directory):
            optimizer.optimize_directory(directory)
        else:
            print(f"⚠️ Directory not found: {directory}")
    
    # Print summary
    optimizer.print_summary()
    optimizer.save_detailed_report()
    
    print("\n✅ Bulk optimization completed!")
    print("🎉 Your Just Urbane website images are now optimized for maximum performance!")

if __name__ == "__main__":
    main()