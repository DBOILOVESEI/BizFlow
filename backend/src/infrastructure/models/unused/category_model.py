from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, Boolean
from infrastructure.databases.base import Base

class CategoryModel(Base):
    __tablename__ = 'category'
    __table_args__ = {'extend_existing': True}

    category_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    category_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    parent_category_id = Column(Integer, ForeignKey)
    is_active = Column(Boolean)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)