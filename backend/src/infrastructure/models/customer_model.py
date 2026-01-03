from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum
from infrastructure.databases.base import Base

class CustomerModel(Base):
    __tablename__ = 'customer'
    __table_args__ = {'extend_existing': True} 

    customer_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    customer_code = Column(String(50), nullable=False)
    customer_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)  
    customer_type = Column(Enum('RETAIL', 'WHOLESALE', 'VIP', name="CustomerTypeEnum"), nullable=False)
    total_debt = Column(DECIMAL(15,2), nullable=False)
    creadit_limit = Column(DECIMAL(15,2), nullable=True)
    notes = Column(Text, nullable=Text)
    is_active = Column(Boolean)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)