from sqlalchemy import create_session
from src.infrastructure.repositories.product_repository import ProductRepository
from src.services.product_service import ProductService


def get_db_session():
    
    pass

def get_product_service():
    session = next(get_db_session())
    repo = ProductRepository(session)
    return ProductService(repo)