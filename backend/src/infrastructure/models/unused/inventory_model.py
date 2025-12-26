from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean
from infrastructure.databases.base import Base

class InventoryModel(Base):
    __tablename__ = 'inventory'
    __table_args__ = {'extend_existing': True} 

    inventory_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    product_id = Column(Integer, ForeignKey('product.product_id'))
    quantity_in_base_unit = Column(DECIMAL(15,4), nullable=False)
    last_update = Column(DateTime)