#!/usr/bin/env python3
"""
Just Urbane - Image Optimization API
RESTful API endpoints for advanced image optimization with WebP support
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import Response, JSONResponse
from typing import List, Optional, Dict, Any
import io
import json
from image_optimizer import advanced_image_optimizer

# Create API router
optimization_api = APIRouter(prefix="/api/image-optimization", tags=["image-optimization"])

@optimization_api.post("/optimize")
async def optimize_image_endpoint(
    file: UploadFile = File(...),
    size_preset: str = Form("medium"),
    enable_webp: bool = Form(True),
    enable_progressive: bool = Form(True),
    quality_override: Optional[int] = Form(None)
):
    """
    Optimize a single image with advanced features
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        file_content = await file.read()
        
        if len(file_content) > 50 * 1024 * 1024:  # 50MB limit
            raise HTTPException(status_code=400, detail="File too large (max 50MB)")
        
        # Get size preset parameters
        if size_preset not in advanced_image_optimizer.size_presets:
            size_preset = "medium"
        
        # Override quality if specified
        if quality_override:
            preset = advanced_image_optimizer.size_presets[size_preset].copy()
            preset['q'] = min(100, max(10, quality_override))
            preset['webp_q'] = min(95, max(5, quality_override - 10))
        
        # Optimize image
        optimized_formats = advanced_image_optimizer.optimize_image_advanced(
            file_content,
            file.filename,
            size_preset=size_preset,
            enable_webp=enable_webp,
            enable_avif=False,  # Disabled for compatibility
            progressive=enable_progressive
        )
        
        if not optimized_formats:
            raise HTTPException(status_code=500, detail="Failed to optimize image")
        
        # Calculate savings
        original_size = len(file_content)
        jpeg_size = len(optimized_formats.get('jpeg', file_content))
        webp_size = len(optimized_formats.get('webp', b'')) if 'webp' in optimized_formats else 0
        
        jpeg_savings = ((original_size - jpeg_size) / original_size) * 100 if original_size > 0 else 0
        webp_savings = ((jpeg_size - webp_size) / jpeg_size) * 100 if webp_size > 0 and jpeg_size > 0 else 0
        
        # Return optimization results
        result = {
            "success": True,
            "original_size": original_size,
            "optimized_formats": {
                "jpeg": {
                    "size": jpeg_size,
                    "savings_percent": round(jpeg_savings, 1),
                    "available": True
                }
            },
            "size_preset": size_preset,
            "preset_params": advanced_image_optimizer.size_presets[size_preset],
            "optimization_features": {
                "content_aware": True,
                "metadata_stripped": True,
                "progressive_jpeg": enable_progressive,
                "webp_enabled": enable_webp
            }
        }
        
        if webp_size > 0:
            result["optimized_formats"]["webp"] = {
                "size": webp_size,
                "savings_percent": round(webp_savings, 1),
                "available": True
            }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

@optimization_api.post("/optimize-url")
async def optimize_url_endpoint(
    url: str = Form(...),
    size_preset: str = Form("medium"),
    enable_webp: bool = Form(True)
):
    """
    Generate optimized URLs for external images (like Unsplash)
    """
    try:
        if 'unsplash.com' not in url:
            raise HTTPException(status_code=400, detail="Only Unsplash URLs are supported")
        
        # Generate optimized URLs
        optimized_urls = advanced_image_optimizer.optimize_unsplash_url_advanced(
            url, 
            size_preset=size_preset, 
            enable_webp=enable_webp
        )
        
        preset_params = advanced_image_optimizer.size_presets.get(size_preset, advanced_image_optimizer.size_presets['medium'])
        
        result = {
            "success": True,
            "original_url": url,
            "optimized_urls": optimized_urls,
            "size_preset": size_preset,
            "preset_params": preset_params,
            "estimated_savings": {
                "jpeg": "20-40% smaller than original",
                "webp": "25-35% smaller than optimized JPEG" if enable_webp else "Not enabled"
            }
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL optimization failed: {str(e)}")

@optimization_api.get("/responsive-urls")
async def generate_responsive_urls(
    url: str = Query(..., description="Base image URL"),
    enable_webp: bool = Query(True, description="Enable WebP format"),
    formats: str = Query("thumbnail,small,medium,large,hero", description="Comma-separated size presets")
):
    """
    Generate responsive image URLs for multiple sizes
    """
    try:
        if 'unsplash.com' not in url:
            raise HTTPException(status_code=400, detail="Only Unsplash URLs are supported")
        
        # Parse requested formats
        requested_formats = [f.strip() for f in formats.split(',') if f.strip() in advanced_image_optimizer.size_presets]
        
        if not requested_formats:
            requested_formats = ['medium']
        
        responsive_urls = {}
        
        for size_preset in requested_formats:
            optimized_urls = advanced_image_optimizer.optimize_unsplash_url_advanced(
                url,
                size_preset=size_preset,
                enable_webp=enable_webp
            )
            
            responsive_urls[size_preset] = {
                "urls": optimized_urls,
                "params": advanced_image_optimizer.size_presets[size_preset]
            }
        
        result = {
            "success": True,
            "original_url": url,
            "responsive_urls": responsive_urls,
            "webp_enabled": enable_webp,
            "total_formats": len(requested_formats),
            "usage_example": {
                "srcset": f"{responsive_urls[requested_formats[0]]['urls']['jpeg']} {advanced_image_optimizer.size_presets[requested_formats[0]]['w']}w",
                "sizes": "(max-width: 768px) 100vw, 50vw"
            }
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Responsive URL generation failed: {str(e)}")

@optimization_api.get("/presets")
async def get_optimization_presets():
    """
    Get available optimization presets and their parameters
    """
    try:
        presets_info = {}
        
        for preset_name, preset_params in advanced_image_optimizer.size_presets.items():
            presets_info[preset_name] = {
                "dimensions": f"{preset_params['w']}x{preset_params['h']}",
                "jpeg_quality": preset_params['q'],
                "webp_quality": preset_params['webp_q'],
                "recommended_for": get_preset_recommendation(preset_name)
            }
        
        result = {
            "success": True,
            "presets": presets_info,
            "content_optimization_types": list(advanced_image_optimizer.content_optimization.keys()),
            "supported_formats": ["JPEG", "WebP", "PNG"],
            "max_file_size": "50MB",
            "features": [
                "Content-aware optimization",
                "Metadata stripping",
                "Progressive JPEG",
                "WebP support",
                "Responsive image generation",
                "Quality optimization per format"
            ]
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get presets: {str(e)}")

@optimization_api.get("/stats")
async def get_optimization_stats():
    """
    Get optimization statistics and performance metrics
    """
    try:
        # This would typically come from a database or cache
        # For now, return example stats
        stats = {
            "success": True,
            "total_optimizations": 1247,
            "total_size_saved": "2.3GB",
            "average_compression": "42%",
            "webp_usage": "78%",
            "top_presets": {
                "medium": 45,
                "large": 28,
                "hero": 18,
                "small": 7,
                "thumbnail": 2
            },
            "format_distribution": {
                "JPEG": 68,
                "WebP": 31,
                "PNG": 1
            },
            "average_processing_time": "0.23s",
            "performance_grade": "A+",
            "last_updated": "2025-09-06T05:50:00Z"
        }
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

def get_preset_recommendation(preset_name: str) -> str:
    """Get recommendation for when to use each preset"""
    recommendations = {
        "thumbnail": "Profile pictures, small icons, list previews",
        "small": "Card images, sidebar content, mobile thumbnails",
        "medium": "Article images, content photos, standard web images",
        "large": "Featured images, gallery photos, detailed views",
        "hero": "Hero banners, full-width headers, landing page images",
        "mobile_hero": "Mobile hero images, responsive headers",
        "ultra": "4K displays, high-resolution screens, print quality"
    }
    return recommendations.get(preset_name, "General purpose optimization")