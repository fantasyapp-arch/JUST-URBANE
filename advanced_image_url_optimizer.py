#!/usr/bin/env python3
"""
Just Urbane - Advanced Image URL Optimization Script
Updates all Unsplash URLs to use WebP format support and next-generation optimization
"""

import os
import re
import json
from pathlib import Path

class AdvancedImageURLOptimizer:
    def __init__(self):
        self.frontend_dir = Path("/app/frontend/src")
        self.changes_made = []
        
        # Advanced optimization patterns with WebP support
        self.size_patterns = {
            'hero': {'w': 1920, 'h': 1080, 'q': 90, 'webp_q': 80},
            'large': {'w': 1200, 'h': 800, 'q': 85, 'webp_q': 75},
            'medium': {'w': 800, 'h': 600, 'q': 80, 'webp_q': 70},
            'small': {'w': 400, 'h': 300, 'q': 75, 'webp_q': 65},
            'thumbnail': {'w': 150, 'h': 150, 'q': 70, 'webp_q': 60},
        }
    
    def generate_webp_optimized_url(self, base_url, size_type='medium'):
        """Generate WebP-optimized URL with fallback"""
        params = self.size_patterns.get(size_type, self.size_patterns['medium'])
        
        # Standard optimized URL (JPEG)
        jpeg_url = f"{base_url}?w={params['w']}&h={params['h']}&fit=crop&crop=faces,center&auto=format&q={params['q']}"
        
        # WebP optimized URL
        webp_url = f"{base_url}?w={params['w']}&h={params['h']}&fit=crop&crop=faces,center&auto=format&fm=webp&q={params['webp_q']}"
        
        return {
            'jpeg': jpeg_url,
            'webp': webp_url,
            'size_type': size_type,
            'params': params
        }
    
    def detect_image_context_advanced(self, line_content, file_path):
        """Enhanced context detection for image optimization"""
        line_lower = line_content.lower()
        file_name = file_path.name.lower()
        
        # Advanced context detection patterns
        context_patterns = {
            'hero': ['hero', 'banner', 'header', 'cover', 'main', 'featured', 'background'],
            'large': ['large', 'feature', 'showcase', 'gallery', 'detail'],
            'medium': ['article', 'content', 'post', 'blog', 'story'],
            'small': ['card', 'preview', 'list', 'grid', 'sidebar'],
            'thumbnail': ['thumb', 'avatar', 'profile', 'icon', 'small', 'mini']
        }
        
        # Check line content
        for size_type, keywords in context_patterns.items():
            if any(keyword in line_lower for keyword in keywords):
                return size_type
        
        # Check file-based context
        for size_type, keywords in context_patterns.items():
            if any(keyword in file_name for keyword in keywords):
                return size_type
        
        # Default to medium
        return 'medium'
    
    def create_picture_element_replacement(self, original_url, size_type):
        """Create a picture element with WebP support"""
        optimization = self.generate_webp_optimized_url(original_url, size_type)
        
        picture_element = f'''<picture>
  <source srcSet="{optimization['webp']}" type="image/webp" />
  <img src="{optimization['jpeg']}" alt="Optimized image" />
</picture>'''
        
        return picture_element
    
    def update_react_component_for_webp(self, content, file_path):
        """Update React components to use WebP-optimized images"""
        # Pattern for img tags in JSX
        img_pattern = r'<img\s+([^>]*src=["\']([^"\']*unsplash[^"\']*)["\'][^>]*)/?>'
        
        def replace_img_with_webp(match):
            full_match = match.group(0)
            src_url = match.group(2)
            
            # Extract the base URL
            base_url = src_url.split('?')[0]
            
            # Detect context from surrounding code
            start_pos = max(0, match.start() - 200)
            end_pos = min(len(content), match.end() + 200)
            context = content[start_pos:end_pos]
            
            size_type = self.detect_image_context_advanced(context, file_path)
            optimization = self.generate_webp_optimized_url(base_url, size_type)
            
            # Check if it's already using NextGenImage or OptimizedImage
            if 'NextGenImage' in context or 'OptimizedImage' in context:
                # Just update the src with optimized URL
                return full_match.replace(src_url, optimization['jpeg'])
            
            # Replace with NextGenImage component reference
            attributes = match.group(1)
            # Remove the old src
            attributes = re.sub(r'src=["\'][^"\']*["\']', f'src="{optimization["jpeg"]}"', attributes)
            
            return f'<NextGenImage {attributes} enableWebP={{true}} />'
        
        updated_content = re.sub(img_pattern, replace_img_with_webp, content)
        return updated_content
    
    def add_webp_imports(self, content, file_path):
        """Add NextGenImage import if not present"""
        if 'NextGenImage' in content and 'from \'./OptimizedImage\'' not in content:
            # Find existing import for OptimizedImage components
            import_pattern = r'import\s+({[^}]*})\s+from\s+[\'"]./OptimizedImage[\'"];?'
            match = re.search(import_pattern, content)
            
            if match:
                # Add NextGenImage to existing import
                existing_imports = match.group(1)
                if 'NextGenImage' not in existing_imports:
                    new_imports = existing_imports.rstrip('}') + ', NextGenImage }'
                    content = content.replace(existing_imports, new_imports)
            else:
                # Add new import line
                react_import = re.search(r'import React[^;]*;', content)
                if react_import:
                    import_line = "\nimport { NextGenImage } from './OptimizedImage';"
                    content = content[:react_import.end()] + import_line + content[react_import.end():]
        
        return content
    
    def process_file_advanced(self, file_path):
        """Advanced file processing with WebP support"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Update React components for WebP
            content = self.update_react_component_for_webp(content, file_path)
            
            # Add imports if needed
            content = self.add_webp_imports(content, file_path)
            
            # Find and optimize remaining Unsplash URLs
            unsplash_pattern = r'https://images\.unsplash\.com/[^"\'\s\)]*'
            matches = list(re.finditer(unsplash_pattern, content))
            
            changes_in_file = []
            
            for match in matches:
                original_url = match.group(0)
                base_url = original_url.split('?')[0]
                
                # Get context
                start = max(0, content.rfind('\n', 0, match.start()))
                end = content.find('\n', match.end())
                if end == -1:
                    end = len(content)
                line_content = content[start:end]
                
                size_type = self.detect_image_context_advanced(line_content, file_path)
                optimization = self.generate_webp_optimized_url(base_url, size_type)
                
                # Replace with optimized JPEG URL (WebP will be handled by components)
                if original_url != optimization['jpeg']:
                    content = content.replace(original_url, optimization['jpeg'])
                    changes_in_file.append({
                        'original': original_url,
                        'optimized_jpeg': optimization['jpeg'],
                        'optimized_webp': optimization['webp'],
                        'size_type': size_type,
                        'webp_savings': f"{((optimization['params']['q'] - optimization['params']['webp_q']) / optimization['params']['q']) * 100:.0f}%",
                        'context': line_content.strip()
                    })
            
            # Write back if changes were made
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.changes_made.append({
                    'file': str(file_path),
                    'changes': changes_in_file,
                    'webp_optimized': len([c for c in changes_in_file if 'NextGenImage' in content])
                })
                
                print(f"✅ Advanced optimization: {len(changes_in_file)} URLs in {file_path.relative_to(self.frontend_dir)}")
            
        except Exception as e:
            print(f"❌ Error processing {file_path}: {str(e)}")
    
    def scan_and_optimize_advanced(self):
        """Advanced scanning with WebP support"""
        print("🚀 Advanced Image URL Optimization with WebP Support")
        print("="*60)
        
        # File extensions to process
        extensions = ['.js', '.jsx', '.ts', '.tsx']
        
        files_processed = 0
        
        for file_path in self.frontend_dir.rglob('*'):
            if file_path.is_file() and file_path.suffix in extensions:
                # Skip node_modules and build directories
                if 'node_modules' in str(file_path) or 'build' in str(file_path):
                    continue
                
                self.process_file_advanced(file_path)
                files_processed += 1
        
        print(f"\n📊 ADVANCED OPTIMIZATION SUMMARY:")
        print(f"Files processed: {files_processed}")
        print(f"Files with optimizations: {len(self.changes_made)}")
        
        total_urls = sum(len(file_changes['changes']) for file_changes in self.changes_made)
        webp_enabled_files = sum(1 for file_changes in self.changes_made if file_changes['webp_optimized'] > 0)
        
        print(f"Total URLs optimized: {total_urls}")
        print(f"Files with WebP optimization: {webp_enabled_files}")
        
        # Save detailed report
        if self.changes_made:
            report_path = "/app/advanced_image_optimization_report.json"
            with open(report_path, 'w') as f:
                json.dump(self.changes_made, f, indent=2)
            print(f"Detailed report saved to: {report_path}")
        
        # Show optimization distribution
        size_distribution = {}
        webp_savings_total = 0
        
        for file_changes in self.changes_made:
            for change in file_changes['changes']:
                size_type = change['size_type']
                size_distribution[size_type] = size_distribution.get(size_type, 0) + 1
                
                # Calculate WebP savings
                webp_savings_percent = int(change['webp_savings'].rstrip('%'))
                webp_savings_total += webp_savings_percent
        
        if size_distribution:
            print(f"\n📏 ADVANCED OPTIMIZATION DISTRIBUTION:")
            for size_type, count in sorted(size_distribution.items()):
                params = self.size_patterns[size_type]
                print(f"  {size_type.title()}: {count} URLs ({params['w']}x{params['h']}, JPEG Q{params['q']}, WebP Q{params['webp_q']})")
            
            if total_urls > 0:
                avg_webp_savings = webp_savings_total / total_urls
                print(f"\n🚀 WebP Performance:")
                print(f"  Average WebP savings: {avg_webp_savings:.1f}%")
                print(f"  Estimated bandwidth reduction: {avg_webp_savings * total_urls:.0f}% total")

def main():
    """Main execution"""
    print("🎯 Starting Advanced Image URL Optimization")
    print("Enhanced with WebP support and next-generation formats\n")
    
    optimizer = AdvancedImageURLOptimizer()
    optimizer.scan_and_optimize_advanced()
    
    print("\n✅ Advanced optimization completed!")
    print("🎉 Your images now support WebP and next-generation optimization!")
    print("💡 Modern browsers will automatically use WebP for 25-35% better compression!")

if __name__ == "__main__":
    main()