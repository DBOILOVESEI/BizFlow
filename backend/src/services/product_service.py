from typing import List, Optional
from domain.models.product import Product
from domain.models.iproduct_repository import IProductRepository
class ProductService:
    def __init__(self, repository: IProductRepository):
        self.repository = repository
    def create_product(self, product_name: str, description: str, status: str, start_date, end_date, created_at, updated_at) -> Product:
        product = Product(id=None, product_name=product_name, description=description, status=status, start_date=start_date, end_date=end_date, created_at=created_at, updated_at=updated_at)
        return self.repository.add(product)
    def get_product(self, product_id: int) -> Optional[Product]:
        return self.repository.get_by_id(product_id)

    def list_products(self) -> List[Product]:
        return self.repository.list()

    def update_product(self, product_id: int, product_name: str, description: str, status: str, start_date, end_date, created_at, updated_at) -> Product:
        product = Product(id=product_id, product_name=product_name, description=description, status=status, start_date=start_date, end_date=end_date, created_at=created_at, updated_at=updated_at)
        return self.repository.update(product)
    def delete_product(self, product_id: int) -> None:
        self.repository.delete(product_id)

    