from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form, Query
from fastapi.responses import JSONResponse, FileResponse
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import uuid
import shutil
from pathlib import Path
import json
from PIL import Image, ImageOps
import mimetypes

from admin_models import *
from admin_auth import get_current_admin_user
from pymongo import MongoClient
import os

# Database connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/just_urbane")
client = MongoClient(mongo_url)
db = client.just_urbane

media_router = APIRouter(prefix="/api/admin/media", tags=["admin-media"])

# Create uploads directory structure
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
MEDIA_DIR = UPLOAD_DIR / "media"
MEDIA_DIR.mkdir(exist_ok=True)
IMAGES_DIR = MEDIA_DIR / "images"
IMAGES_DIR.mkdir(exist_ok=True)
VIDEOS_DIR = MEDIA_DIR / "videos"
VIDEOS_DIR.mkdir(exist_ok=True)
THUMBNAILS_DIR = MEDIA_DIR / "thumbnails"
THUMBNAILS_DIR.mkdir(exist_ok=True)

# Image resolution presets
IMAGE_RESOLUTIONS = {
    "thumbnail": (150, 150),
    "small": (300, 300),
    "medium": (600, 600),
    "large": (1200, 1200),
    "hero": (1920, 1080),
    "cover": (800, 1200),
    "square": (500, 500)
}

@media_router.post("/upload")
async def upload_media(
    current_admin: AdminUser = Depends(get_current_admin_user),
    files: List[UploadFile] = File(...),
    alt_text: str = Form(""),
    tags: str = Form(""),
    generate_resolutions: str = Form("thumbnail,small,medium")  # Comma-separated
):
    """Upload multiple media files with automatic resolution generation"""
    try:
        uploaded_files = []
        resolution_list = [r.strip() for r in generate_resolutions.split(",") if r.strip()]
        
        for file in files:
            # Validate file
            if file.size > 50 * 1024 * 1024:  # 50MB limit
                raise HTTPException(status_code=400, detail=f"File {file.filename} is too large (max 50MB)")
            
            # Determine file type
            mime_type, _ = mimetypes.guess_type(file.filename)
            if not mime_type:
                raise HTTPException(status_code=400, detail=f"Unable to determine file type for {file.filename}")
            
            is_image = mime_type.startswith('image/')
            is_video = mime_type.startswith('video/')
            
            if not (is_image or is_video):
                raise HTTPException(status_code=400, detail=f"Only image and video files are allowed. Got: {mime_type}")
            
            # Generate unique filename
            file_id = str(uuid.uuid4())
            file_extension = Path(file.filename).suffix.lower()
            safe_filename = f"{file_id}{file_extension}"
            
            # Choose directory based on file type
            target_dir = IMAGES_DIR if is_image else VIDEOS_DIR
            file_path = target_dir / safe_filename
            
            # Save original file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Get file dimensions for images/videos
            dimensions = None
            resolutions_generated = {}
            
            if is_image:
                try:
                    with Image.open(file_path) as img:
                        dimensions = {"width": img.width, "height": img.height}
                        
                        # Generate different resolutions
                        for resolution_name in resolution_list:
                            if resolution_name in IMAGE_RESOLUTIONS:
                                target_size = IMAGE_RESOLUTIONS[resolution_name]
                                resized_filename = f"{file_id}_{resolution_name}{file_extension}"
                                resized_path = IMAGES_DIR / resized_filename
                                
                                # Resize image maintaining aspect ratio
                                resized_img = ImageOps.fit(img, target_size, Image.Resampling.LANCZOS)
                                resized_img.save(resized_path, optimize=True, quality=85)
                                
                                resolutions_generated[resolution_name] = {
                                    "filename": resized_filename,
                                    "path": str(resized_path),
                                    "url": f"/uploads/media/images/{resized_filename}",
                                    "size": target_size,
                                    "file_size": resized_path.stat().st_size
                                }
                        
                        # Generate thumbnail for videos
                        thumbnail_filename = f"{file_id}_thumb.jpg"
                        thumbnail_path = THUMBNAILS_DIR / thumbnail_filename
                        thumbnail_img = ImageOps.fit(img, (300, 200), Image.Resampling.LANCZOS)
                        thumbnail_img.save(thumbnail_path, "JPEG", optimize=True, quality=80)
                        
                except Exception as e:
                    print(f"Error processing image {file.filename}: {str(e)}")
            
            elif is_video:
                # For videos, we'd typically use ffmpeg to get dimensions and generate thumbnails
                # For now, we'll store basic info
                dimensions = {"width": 0, "height": 0}  # Placeholder
            
            # Parse tags
            tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
            
            # Create media record
            media_data = {
                "id": file_id,
                "filename": file.filename,
                "safe_filename": safe_filename,
                "file_path": str(file_path),
                "file_type": "image" if is_image else "video",
                "mime_type": mime_type,
                "file_size": file.size,
                "dimensions": dimensions,
                "resolutions": resolutions_generated,
                "alt_text": alt_text,
                "tags": tag_list,
                "usage_count": 0,
                "uploaded_at": datetime.utcnow(),
                "uploaded_by": current_admin.username,
                "url": f"/uploads/media/{'images' if is_image else 'videos'}/{safe_filename}"
            }
            
            # Save to database
            result = db.media_files.insert_one(media_data)
            uploaded_files.append({
                "id": file_id,
                "filename": file.filename,
                "file_type": media_data["file_type"],
                "url": media_data["url"],
                "resolutions": list(resolutions_generated.keys())
            })
        
        return {
            "message": f"Uploaded {len(uploaded_files)} files successfully",
            "files": uploaded_files
        }
        
    except Exception as e:
        # Cleanup any uploaded files on error
        for file_info in uploaded_files:
            try:
                if "file_path" in locals():
                    Path(file_path).unlink(missing_ok=True)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@media_router.get("/")
def get_media_files(
    current_admin: AdminUser = Depends(get_current_admin_user),
    file_type: Optional[str] = Query(None),  # image, video
    tags: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get media files with filtering and pagination"""
    try:
        skip = (page - 1) * limit
        query = {}
        
        if file_type:
            query["file_type"] = file_type
        
        if tags:
            tag_list = [tag.strip() for tag in tags.split(",")]
            query["tags"] = {"$in": tag_list}
        
        if search:
            query["$or"] = [
                {"filename": {"$regex": search, "$options": "i"}},
                {"alt_text": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [search]}}
            ]
        
        media_files = list(db.media_files.find(query).skip(skip).limit(limit).sort([("uploaded_at", -1)]))
        total_count = db.media_files.count_documents(query)
        
        # Convert ObjectId to string
        for media_file in media_files:
            if "_id" in media_file:
                del media_file["_id"]
        
        return {
            "media_files": media_files,
            "total_count": total_count,
            "page": page,
            "limit": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get media files: {str(e)}")

@media_router.get("/{media_id}")
async def get_media_file(
    media_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Get specific media file details"""
    try:
        media_file = await db.media_files.find_one({"id": media_id})
        
        if not media_file:
            raise HTTPException(status_code=404, detail="Media file not found")
        
        if "_id" in media_file:
            del media_file["_id"]
        
        return media_file
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get media file: {str(e)}")

@media_router.put("/{media_id}")
async def update_media_file(
    media_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user),
    alt_text: Optional[str] = Form(None),
    tags: Optional[str] = Form(None)
):
    """Update media file metadata"""
    try:
        update_data = {
            "updated_at": datetime.utcnow(),
            "updated_by": current_admin.username
        }
        
        if alt_text is not None:
            update_data["alt_text"] = alt_text
        
        if tags is not None:
            update_data["tags"] = [tag.strip() for tag in tags.split(",") if tag.strip()]
        
        result = await db.media_files.update_one(
            {"id": media_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Media file not found")
        
        return {"message": "Media file updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@media_router.delete("/{media_id}")
async def delete_media_file(
    media_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Delete media file and all its resolutions"""
    try:
        # Get media file info
        media_file = await db.media_files.find_one({"id": media_id})
        
        if not media_file:
            raise HTTPException(status_code=404, detail="Media file not found")
        
        # Delete original file
        original_path = Path(media_file["file_path"])
        if original_path.exists():
            original_path.unlink()
        
        # Delete all resolution versions
        if "resolutions" in media_file:
            for resolution_data in media_file["resolutions"].values():
                resolution_path = Path(resolution_data["path"])
                if resolution_path.exists():
                    resolution_path.unlink()
        
        # Delete from database
        await db.media_files.delete_one({"id": media_id})
        
        return {"message": "Media file deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@media_router.post("/{media_id}/generate-resolutions")
async def generate_resolutions(
    media_id: str,
    resolutions: str = Form(...),  # Comma-separated resolution names
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Generate new resolutions for an existing image"""
    try:
        # Get media file
        media_file = await db.media_files.find_one({"id": media_id})
        
        if not media_file:
            raise HTTPException(status_code=404, detail="Media file not found")
        
        if media_file["file_type"] != "image":
            raise HTTPException(status_code=400, detail="Can only generate resolutions for images")
        
        original_path = Path(media_file["file_path"])
        if not original_path.exists():
            raise HTTPException(status_code=404, detail="Original file not found")
        
        resolution_list = [r.strip() for r in resolutions.split(",") if r.strip()]
        resolutions_generated = {}
        
        with Image.open(original_path) as img:
            for resolution_name in resolution_list:
                if resolution_name in IMAGE_RESOLUTIONS:
                    target_size = IMAGE_RESOLUTIONS[resolution_name]
                    file_extension = Path(media_file["safe_filename"]).suffix
                    resized_filename = f"{media_id}_{resolution_name}{file_extension}"
                    resized_path = IMAGES_DIR / resized_filename
                    
                    # Resize image
                    resized_img = ImageOps.fit(img, target_size, Image.Resampling.LANCZOS)
                    resized_img.save(resized_path, optimize=True, quality=85)
                    
                    resolutions_generated[resolution_name] = {
                        "filename": resized_filename,
                        "path": str(resized_path),
                        "url": f"/uploads/media/images/{resized_filename}",
                        "size": target_size,
                        "file_size": resized_path.stat().st_size
                    }
        
        # Update database with new resolutions
        current_resolutions = media_file.get("resolutions", {})
        current_resolutions.update(resolutions_generated)
        
        await db.media_files.update_one(
            {"id": media_id},
            {
                "$set": {
                    "resolutions": current_resolutions,
                    "updated_at": datetime.utcnow(),
                    "updated_by": current_admin.username
                }
            }
        )
        
        return {
            "message": f"Generated {len(resolutions_generated)} new resolutions",
            "resolutions": list(resolutions_generated.keys())
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resolution generation failed: {str(e)}")

@media_router.get("/stats/overview")
async def get_media_stats(current_admin: AdminUser = Depends(get_current_admin_user)):
    """Get media library statistics"""
    try:
        # Total counts by type
        total_images = await db.media_files.count_documents({"file_type": "image"})
        total_videos = await db.media_files.count_documents({"file_type": "video"})
        
        # Storage usage
        pipeline = [
            {
                "$group": {
                    "_id": "$file_type",
                    "total_size": {"$sum": "$file_size"},
                    "count": {"$sum": 1}
                }
            }
        ]
        
        storage_stats = await db.media_files.aggregate(pipeline).to_list(None)
        
        # Most used tags
        tag_pipeline = [
            {"$unwind": "$tags"},
            {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        
        popular_tags = await db.media_files.aggregate(tag_pipeline).to_list(10)
        
        return {
            "total_files": total_images + total_videos,
            "total_images": total_images,
            "total_videos": total_videos,
            "storage_stats": storage_stats,
            "popular_tags": popular_tags,
            "available_resolutions": list(IMAGE_RESOLUTIONS.keys())
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@media_router.post("/bulk-tag")
async def bulk_tag_media(
    media_ids: str = Form(...),  # Comma-separated IDs
    tags: str = Form(...),  # Comma-separated tags
    action: str = Form("add"),  # add, remove, replace
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Bulk tag operations on multiple media files"""
    try:
        ids = [id.strip() for id in media_ids.split(",") if id.strip()]
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
        
        if not ids or not tag_list:
            raise HTTPException(status_code=400, detail="Media IDs and tags are required")
        
        if action == "add":
            # Add tags to existing tags
            result = await db.media_files.update_many(
                {"id": {"$in": ids}},
                {
                    "$addToSet": {"tags": {"$each": tag_list}},
                    "$set": {
                        "updated_at": datetime.utcnow(),
                        "updated_by": current_admin.username
                    }
                }
            )
        elif action == "remove":
            # Remove specified tags
            result = await db.media_files.update_many(
                {"id": {"$in": ids}},
                {
                    "$pullAll": {"tags": tag_list},
                    "$set": {
                        "updated_at": datetime.utcnow(),
                        "updated_by": current_admin.username
                    }
                }
            )
        elif action == "replace":
            # Replace all tags with new tags
            result = await db.media_files.update_many(
                {"id": {"$in": ids}},
                {
                    "$set": {
                        "tags": tag_list,
                        "updated_at": datetime.utcnow(),
                        "updated_by": current_admin.username
                    }
                }
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid action. Use: add, remove, or replace")
        
        return {
            "message": f"Bulk tag operation completed: {action}",
            "updated_count": result.modified_count,
            "tags": tag_list
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk tag operation failed: {str(e)}")