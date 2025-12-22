from fastapi import APIRouter, Depends
from src.api.schemas.product_schema import ProductCreateRequest, ProductResponse
from src.dependency_container import get_product_service

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductResponse)
def create_product(data: ProductCreateRequest, service=Depends(get_product_service)):
    return service.add_new_product(data.name, data.unit, data.price, data.stock_quantity)