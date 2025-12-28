from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, Enum, Boolean
from infrastructure.databases.base import Base

class BusinessModel(Base):
    __tablename__ = 'business'
    __table_args__ = {'extend_existing': True}

    business_id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, nullable=False)
    business_name = Column(String(200), nullable=True)
    business_type = Column(String(100), nullable=True)
    tax_code = Column(String(50), nullable=False)
    address = Column(Text, nullable=False)
    province = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    ward = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=False)
    subscription_plan = Column(Enum('BASIC', 'PRO', 'ENTERPRISE'), nullable=False)
    subscription_start_date = Column(DateTime)
    subscription_end_date = Column(DateTime)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)