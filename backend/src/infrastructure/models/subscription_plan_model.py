from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class SubscriptionPlanModel(Base):
    __tablename__ = 'subscription_plan'
    __table_args__ = {'extend_existing': True} 

    plan_id = Column(Integer, primary_key=True)
    plan_code = Column(String(50), nullable=True)
    plan_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    monthly_price = Column(DECIMAL(10,2), nullable=False)
    annual_price = Column(DECIMAL(10,2), nullable=False)
    max_employees = Column(Integer, nullable=True)
    max_products = Column(Integer, nullable=True)
    max_order_per_month = Column(Integer, nullable=True)
    features = Column(JSON, nullable=True)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)