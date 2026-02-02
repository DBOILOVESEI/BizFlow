from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum
from infrastructure.databases.base import Base
from datetime import datetime # Thêm import này để dùng default nếu cần

class CustomerDebtModel(Base):
    __tablename__ = 'customer_debt'
    __table_args__ = {'extend_existing': True} 

    debt_id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customer.customer_id'))
    order_id = Column(Integer, ForeignKey('order.order_id'))
    debt_amount = Column(DECIMAL(15,2), nullable=False)
    paid_amount = Column(DECIMAL(15,2), nullable=False)
    remaining_amount = Column(DECIMAL(15,2), nullable=False)
    debt_date = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    status = Column(Enum('UNPAID', 'PARTIAL', 'PAID', 'OVERDUE', name="CustomerDebtStatusEnum"), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow) 
    
    updated_at = Column(DateTime, default=datetime.utcnow)
