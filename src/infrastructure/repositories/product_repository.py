from sqlalchemy.orm import Session
from src.domain.models.product import Product
from src.infrastructure.models.product_model import ProductTable

class ProductRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, product: Product) -> Product:
        db_product = ProductTable(
            name=product.name,
            unit=product.unit,
            price=product.price,
            stock_quantity=product.stock_quantity
        )
        self.session.add(db_product)
        self.session.commit()
        self.session.refresh(db_product)
        product.id = db_product.id
        return product