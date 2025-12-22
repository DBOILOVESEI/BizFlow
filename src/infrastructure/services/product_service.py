from src.domain.models.product import Product
from src.infrastructure.repositories.product_repository import ProductRepository

class ProductService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def add_new_product(self, name: str, unit: str, price: float, stock: int) -> Product:
        # Có thể thêm logic kiểm tra Thông tư 88 tại đây
        new_product = Product(id=None, name=name, unit=unit, price=price, stock_quantity=stock)
        return self.product_repo.create(new_product)