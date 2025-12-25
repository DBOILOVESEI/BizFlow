from fastapi import FastAPI
from src.api.controllers import product_controller

def create_app() -> FastAPI:
    app = FastAPI(title="Hệ thống POS Thông tư 88")
    
    # Đăng ký routes
    app.include_router(product_controller.router)
    
    return app