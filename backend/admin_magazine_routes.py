from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime
import os
import uuid
import shutil
from pathlib import Path
import json

from admin_models import *
from admin_auth import get_current_admin_user
from server import db

magazine_router = APIRouter(prefix="/api/admin/magazines", tags=["admin-magazines"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
MAGAZINE_DIR = UPLOAD_DIR / "magazines"
MAGAZINE_DIR.mkdir(exist_ok=True)

@magazine_router.post("/upload")
async def upload_magazine(
    current_admin: AdminUser = Depends(get_current_admin_user),
    title: str = Form(...),
    description: str = Form(...),
    month: str = Form(...),
    year: int = Form(...),
    is_featured: bool = Form(False),
    pdf_file: UploadFile = File(...)
):
    """Upload a new magazine PDF"""
    try:
        # Validate PDF file
        if not pdf_file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        if pdf_file.size > 50 * 1024 * 1024:  # 50MB limit
            raise HTTPException(status_code=400, detail="File size must be less than 50MB")
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = f"{file_id}_{pdf_file.filename}"
        file_path = MAGAZINE_DIR / filename
        
        # Save PDF file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(pdf_file.file, buffer)
        
        # Create magazine record
        magazine_data = {
            "id": str(uuid.uuid4()),
            "title": title,
            "description": description,
            "month": month,
            "year": year,
            "pdf_path": str(file_path),
            "pdf_url": f"/uploads/magazines/{filename}",
            "is_featured": is_featured,
            "is_published": True,
            "upload_date": datetime.utcnow(),
            "created_by": current_admin.username,
            "file_size": pdf_file.size,
            "pages": 0  # Will be updated when PDF is processed
        }
        
        # Save to database
        result = await db.magazines.insert_one(magazine_data)
        
        # Update issues collection for compatibility
        issue_data = {
            "id": magazine_data["id"],
            "title": title,
            "cover_image": f"/uploads/magazines/{filename}_cover.jpg",  # Placeholder
            "description": description,
            "month": month,
            "year": year,
            "pages": [],
            "is_digital": True,
            "published_at": datetime.utcnow(),
            "pdf_url": magazine_data["pdf_url"]
        }
        await db.issues.insert_one(issue_data)
        
        return {
            "message": "Magazine uploaded successfully",
            "magazine_id": magazine_data["id"],
            "filename": filename,
            "file_size": pdf_file.size
        }
        
    except Exception as e:
        # Cleanup file if database operation fails
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@magazine_router.get("/")
async def get_magazines(
    current_admin: AdminUser = Depends(get_current_admin_user),
    page: int = 1,
    limit: int = 10
):
    """Get all magazines with pagination"""
    skip = (page - 1) * limit
    
    # Get magazines from both collections
    magazines = await db.magazines.find({}).skip(skip).limit(limit).sort([("upload_date", -1)]).to_list(limit)
    total_count = await db.magazines.count_documents({})
    
    # If no magazines in magazines collection, fall back to issues
    if not magazines:
        magazines = await db.issues.find({}).skip(skip).limit(limit).sort([("published_at", -1)]).to_list(limit)
        total_count = await db.issues.count_documents({})
    
    # Convert ObjectId to string
    for magazine in magazines:
        magazine["id"] = str(magazine["_id"])
        del magazine["_id"]
    
    return {
        "magazines": magazines,
        "total_count": total_count,
        "page": page,
        "limit": limit,
        "total_pages": (total_count + limit - 1) // limit
    }

@magazine_router.get("/{magazine_id}")
async def get_magazine(
    magazine_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Get a specific magazine by ID"""
    magazine = await db.magazines.find_one({"id": magazine_id})
    
    if not magazine:
        # Try issues collection
        magazine = await db.issues.find_one({"id": magazine_id})
    
    if not magazine:
        raise HTTPException(status_code=404, detail="Magazine not found")
    
    magazine["id"] = str(magazine["_id"])
    del magazine["_id"]
    
    return magazine

@magazine_router.put("/{magazine_id}")
async def update_magazine(
    magazine_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    month: Optional[str] = Form(None),
    year: Optional[int] = Form(None),
    is_featured: Optional[bool] = Form(None),
    is_published: Optional[bool] = Form(None)
):
    """Update magazine metadata"""
    update_data = {}
    
    if title is not None:
        update_data["title"] = title
    if description is not None:
        update_data["description"] = description
    if month is not None:
        update_data["month"] = month
    if year is not None:
        update_data["year"] = year
    if is_featured is not None:
        update_data["is_featured"] = is_featured
    if is_published is not None:
        update_data["is_published"] = is_published
    
    update_data["updated_at"] = datetime.utcnow()
    update_data["updated_by"] = current_admin.username
    
    # Update in magazines collection
    result = await db.magazines.update_one(
        {"id": magazine_id}, 
        {"$set": update_data}
    )
    
    # Also update in issues collection for compatibility
    await db.issues.update_one(
        {"id": magazine_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Magazine not found")
    
    return {"message": "Magazine updated successfully"}

@magazine_router.delete("/{magazine_id}")
async def delete_magazine(
    magazine_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Delete a magazine and its PDF file"""
    # Get magazine to find PDF path
    magazine = await db.magazines.find_one({"id": magazine_id})
    
    if not magazine:
        # Try issues collection
        magazine = await db.issues.find_one({"id": magazine_id})
    
    if not magazine:
        raise HTTPException(status_code=404, detail="Magazine not found")
    
    # Delete PDF file if it exists
    if "pdf_path" in magazine and magazine["pdf_path"]:
        pdf_path = Path(magazine["pdf_path"])
        if pdf_path.exists():
            pdf_path.unlink()
    
    # Delete from both databases
    await db.magazines.delete_one({"id": magazine_id})
    await db.issues.delete_one({"id": magazine_id})
    
    return {"message": "Magazine deleted successfully"}

@magazine_router.post("/{magazine_id}/feature")
async def toggle_featured_magazine(
    magazine_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Toggle featured status of a magazine"""
    # First, unfeature all magazines
    await db.magazines.update_many({}, {"$set": {"is_featured": False}})
    await db.issues.update_many({}, {"$set": {"is_featured": False}})
    
    # Feature the selected magazine
    result = await db.magazines.update_one(
        {"id": magazine_id}, 
        {"$set": {"is_featured": True, "updated_by": current_admin.username}}
    )
    
    await db.issues.update_one(
        {"id": magazine_id}, 
        {"$set": {"is_featured": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Magazine not found")
    
    return {"message": "Magazine featured successfully"}

@magazine_router.get("/{magazine_id}/analytics")
async def get_magazine_analytics(
    magazine_id: str,
    current_admin: AdminUser = Depends(get_current_admin_user)
):
    """Get analytics for a specific magazine"""
    # Placeholder for future analytics implementation
    return {
        "magazine_id": magazine_id,
        "views": 0,
        "downloads": 0,
        "readers": 0,
        "completion_rate": 0.0,
        "popular_pages": [],
        "reading_time": "0 minutes"
    }