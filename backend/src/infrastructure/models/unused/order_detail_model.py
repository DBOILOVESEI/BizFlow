from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean
from infrastructure.databases.base import Base

class OrderDetailModel(Base):
    __tablename__ = 'order_detail'
    __table_args__ = {'extend_existing': True} 

    detail_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('order.order_id'))
    product_id = Column(Integer, ForeignKey('product.product_id'))
    product_name = Column(String(200), nullable=True)
    quantity = Column(DECIMAL(15,2), nullable=True)
    unit = Column(String(50), nullable=True)
    unit_price = Column(DECIMAL(15,2), nullable=False)
    discount_percent = Column(DECIMAL(15,2), nullable=True)
    discount_amount = Column(DECIMAL(15,2), nullable=True)
    line_total = Column(DECIMAL(15,2), nullable=False)
    notes = Column(Text, nullable=True)