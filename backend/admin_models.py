from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class AdminUser(BaseModel):
    id: Optional[str] = None
    username: str
    hashed_password: str
    full_name: str
    email: str
    is_super_admin: bool = True
    created_at: datetime = datetime.utcnow()
    last_login: Optional[datetime] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str
    admin_user: dict

class DashboardStats(BaseModel):
    total_articles: int
    total_magazines: int
    total_users: int
    total_subscribers: int
    total_revenue: float
    monthly_visitors: int
    popular_articles: List[Dict[str, Any]]
    recent_activities: List[Dict[str, Any]]

class ContentUpload(BaseModel):
    title: str
    content_type: str  # 'article', 'magazine', 'image', 'video'
    file_path: Optional[str] = None
    metadata: Dict[str, Any] = {}
    status: str = 'draft'  # 'draft', 'published', 'archived'
    created_at: datetime = datetime.utcnow()

class MagazineUpload(BaseModel):
    title: str
    description: str
    cover_image: Optional[str] = None
    pdf_path: str
    month: str
    year: int
    pages: int
    is_featured: bool = False
    is_published: bool = False
    upload_date: datetime = datetime.utcnow()

class ArticleEdit(BaseModel):
    id: str
    title: Optional[str] = None
    body: Optional[str] = None
    summary: Optional[str] = None
    hero_image: Optional[str] = None
    author_name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    tags: Optional[List[str]] = None
    featured: Optional[bool] = None
    trending: Optional[bool] = None
    premium: Optional[bool] = None
    is_published: Optional[bool] = None

class MediaFile(BaseModel):
    id: Optional[str] = None
    filename: str
    file_path: str
    file_type: str  # 'image', 'video', 'pdf', 'document'
    file_size: int
    dimensions: Optional[Dict[str, int]] = None  # width, height for images/videos
    resolutions: Optional[List[Dict[str, Any]]] = None  # different resolution versions
    alt_text: Optional[str] = None
    tags: List[str] = []
    usage_count: int = 0
    uploaded_at: datetime = datetime.utcnow()

class AnalyticsData(BaseModel):
    page_views: Dict[str, int]
    unique_visitors: int
    popular_content: List[Dict[str, Any]]
    user_engagement: Dict[str, float]
    revenue_data: Dict[str, float]
    conversion_rates: Dict[str, float]
    geographic_data: Dict[str, int]
    device_data: Dict[str, int]
    time_period: str  # 'daily', 'weekly', 'monthly', 'yearly'
    date_range: Dict[str, str]