from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean
from infrastructure.databases.base import Base

class ProductUnitModel(Base):
    __tablename__ = 'product_unit'
    __table_args__ = {'extend_existing': True} 

    unit_id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('product.product_id'))
    unit_name = Column(String(50), nullable=True)
    conversion_rate = Column(DECIMAL(10,4), nullable=False)
    price = Column(DECIMAL(15,2), nullable=False)
    is_active = Column(Boolean)
    created_at = Column(DateTime)