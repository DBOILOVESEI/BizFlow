from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean
from infrastructure.databases.base import Base

class ProductModel(Base):
    __tablename__ = 'product'
    __table_args__ = {'extend_existing': True} 

    product_id = Column(Integer, primary_key=True)
    inventory_id = Column(Integer, ForeignKey('inventory.inventory_id'))
    product_code = Column(String(50), nullable=False)
    category_name = Column(String(50), nullable=False)
    product_name = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    base_unit = Column(String(50), nullable=False)
    base_price = Column(DECIMAL(15,2), nullable=False)
    cost_price = Column(DECIMAL(15,2), nullable=False)
    image_url = Column(String(500), nullable=True)
    barcode = Column(String(100), nullable=False)
    is_active = Column(Boolean)
    low_stock_threshold = Column(Integer, nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    