#!/usr/bin/env python3
"""
Just Urbane - Existing Image URL Optimization Script
Scans codebase and optimizes Unsplash URLs for better performance
"""

import os
import re
import json
from pathlib import Path

class ImageURLOptimizer:
    def __init__(self):
        self.frontend_dir = Path("/app/frontend/src")
        self.changes_made = []
        
        # Common image size patterns for different use cases
        self.size_patterns = {
            'hero': {'w': 1920, 'h': 1080, 'q': 90},
            'large': {'w': 1200, 'h': 800, 'q': 85},
            'medium': {'w': 800, 'h': 600, 'q': 80},
            'small': {'w': 400, 'h': 300, 'q': 75},
            'thumbnail': {'w': 150, 'h': 150, 'q': 70},
        }
    
    def optimize_unsplash_url(self, url, size_type='medium'):
        """Optimize a single Unsplash URL"""
        if 'unsplash.com' not in url:
            return url
        
        # Remove existing parameters
        base_url = url.split('?')[0]
        
        # Get size parameters
        params = self.size_patterns.get(size_type, self.size_patterns['medium'])
        
        # Build optimized URL
        optimized_url = f"{base_url}?w={params['w']}&h={params['h']}&fit=crop&crop=faces,center&auto=format&q={params['q']}"
        
        return optimized_url
    
    def detect_image_context(self, line_content, file_path):
        """Detect the context/use case of an image to determine optimal size"""
        line_lower = line_content.lower()
        file_name = file_path.name.lower()
        
        # Hero images
        if any(keyword in line_lower for keyword in ['hero', 'background', 'banner', 'cover']):
            return 'hero'
        
        # Thumbnail images
        if any(keyword in line_lower for keyword in ['thumb', 'avatar', 'profile', 'small']):
            return 'thumbnail'
        
        # Large images
        if any(keyword in line_lower for keyword in ['large', 'featured', 'main']):
            return 'large'
        
        # Small images
        if any(keyword in line_lower for keyword in ['card', 'preview', 'list']):
            return 'small'
        
        # File-based context
        if any(keyword in file_name for keyword in ['hero', 'banner']):
            return 'hero'
        elif any(keyword in file_name for keyword in ['card', 'list']):
            return 'small'
        
        # Default to medium
        return 'medium'
    
    def process_file(self, file_path):
        """Process a single file and optimize Unsplash URLs"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Find all Unsplash URLs
            unsplash_pattern = r'https://images\.unsplash\.com/[^"\'\s\)]*'
            matches = re.finditer(unsplash_pattern, content)
            
            changes_in_file = []
            
            for match in matches:
                original_url = match.group(0)
                
                # Get the line containing this URL for context
                start = max(0, content.rfind('\n', 0, match.start()))
                end = content.find('\n', match.end())
                if end == -1:
                    end = len(content)
                line_content = content[start:end]
                
                # Detect image context
                size_type = self.detect_image_context(line_content, file_path)
                
                # Optimize URL
                optimized_url = self.optimize_unsplash_url(original_url, size_type)
                
                if optimized_url != original_url:
                    content = content.replace(original_url, optimized_url)
                    changes_in_file.append({
                        'original': original_url,
                        'optimized': optimized_url,
                        'size_type': size_type,
                        'context': line_content.strip()
                    })
            
            # Write back if changes were made
            if changes_in_file:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.changes_made.append({
                    'file': str(file_path),
                    'changes': changes_in_file
                })
                
                print(f"✅ Optimized {len(changes_in_file)} URLs in {file_path.relative_to(self.frontend_dir)}")
            
        except Exception as e:
            print(f"❌ Error processing {file_path}: {str(e)}")
    
    def scan_and_optimize(self):
        """Scan all frontend files and optimize Unsplash URLs"""
        print("🔍 Scanning frontend files for Unsplash URLs...")
        
        # File extensions to process
        extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']
        
        files_processed = 0
        
        for file_path in self.frontend_dir.rglob('*'):
            if file_path.is_file() and file_path.suffix in extensions:
                # Skip node_modules and build directories
                if 'node_modules' in str(file_path) or 'build' in str(file_path):
                    continue
                
                self.process_file(file_path)
                files_processed += 1
        
        print(f"\n📊 OPTIMIZATION SUMMARY:")
        print(f"Files processed: {files_processed}")
        print(f"Files with optimizations: {len(self.changes_made)}")
        
        total_urls = sum(len(file_changes['changes']) for file_changes in self.changes_made)
        print(f"Total URLs optimized: {total_urls}")
        
        # Save detailed report
        if self.changes_made:
            report_path = "/app/image_optimization_report.json"
            with open(report_path, 'w') as f:
                json.dump(self.changes_made, f, indent=2)
            print(f"Detailed report saved to: {report_path}")
        
        # Show size type distribution
        size_distribution = {}
        for file_changes in self.changes_made:
            for change in file_changes['changes']:
                size_type = change['size_type']
                size_distribution[size_type] = size_distribution.get(size_type, 0) + 1
        
        if size_distribution:
            print(f"\n📏 SIZE OPTIMIZATION DISTRIBUTION:")
            for size_type, count in sorted(size_distribution.items()):
                params = self.size_patterns[size_type]
                print(f"  {size_type.title()}: {count} URLs ({params['w']}x{params['h']}, Q{params['q']})")

def main():
    """Main execution"""
    print("🚀 Starting Just Urbane Image Optimization...")
    
    optimizer = ImageURLOptimizer()
    optimizer.scan_and_optimize()
    
    print("\n✅ Image optimization completed!")
    print("💡 Images will now load faster with optimized dimensions and quality settings.")

if __name__ == "__main__":
    main()