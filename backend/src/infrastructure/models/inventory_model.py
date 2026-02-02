from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean
from infrastructure.databases.base import Base

class InventoryModel(Base):
    __tablename__ = 'inventory'
    __table_args__ = {'extend_existing': True} 

    inventory_id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey('user.user_id'))
    product_id = Column(Integer, ForeignKey('product.product_id'))
    quantity = Column(Integer, nullable=False)
    low_stock_threshold = Column(Integer, nullable=False)
    last_update = Column(DateTime)