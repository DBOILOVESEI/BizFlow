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
<<<<<<< HEAD
    customer_type = Column(Enum('RETAIL', 'WHOLESALE', 'VIP'), nullable=False)
=======
    customer_type = Column(Enum('RETAIL', 'WHOLESALE', 'VIP', name="CustomerTypeEnum"), nullable=False)
>>>>>>> ebc731bb4bf838b748d526476803a32a9e68a6b1
    total_debt = Column(DECIMAL(15,2), nullable=False)
    credit_limit = Column(DECIMAL(15,2), nullable=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)