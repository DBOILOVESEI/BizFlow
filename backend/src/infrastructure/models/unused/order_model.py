from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum
from infrastructure.databases.base import Base

class OrderModel(Base):
    __tablename__ = 'order'
    __table_args__ = {'extend_existing': True} 

    order_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    order_number = Column(String(50), nullable=True)
    order_type = Column(Enum('AT_COUNTER', 'PHONE', 'ZALO', 'AI_GENERATED'), nullable=False)
    order_status = Column(Enum('DRAFT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'), nullable=False)
    customer_id = Column(Integer, ForeignKey('customer.customer_id'))
    customer_name = Column(String(200), nullable=True)
    order_date = Column(DateTime)
    total_amount = Column(DECIMAL(15,2), nullable=False)
    discount_amount = Column(DECIMAL(15,2), nullable=True)
    final_amount = Column(DECIMAL(15,2), nullable=False)
    payment_mrthod = Column(Enum('CASH', 'DEBT', 'BANK_TRANSFER', 'MIXED'), nullable=False)
    paid_amount = Column(DECIMAL(15,2), nullable=False)
    debt_amount = Column(DECIMAL(15,2), nullable=False)
    notes = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey)
    confirmed_by = Column(Integer, ForeignKey)
    confirmed_at = Column(DateTime)
    is_printed = Column(Boolean, nullable=True)
    created_at = Column(DateTime)
    updated_at =Column(DateTime) 
