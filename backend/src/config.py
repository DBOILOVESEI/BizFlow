import os

class Config:
    # Cấu hình bí mật (giữ nguyên hoặc sửa tùy ý)
    SECRET_KEY = 'bizflow_secret_key_2026'
    
    # --- QUAN TRỌNG NHẤT ---
    # Ghi thẳng mật khẩu 123456 vào đây. 
    # KHÔNG dùng os.environ.get() để tránh xung đột.
    DATABASE_URI = "postgresql+psycopg2://postgres:123456@localhost:5432/BizFlow"
    
    # Các cấu hình khác
    DEBUG = True
    CORS_HEADERS = 'Content-Type'