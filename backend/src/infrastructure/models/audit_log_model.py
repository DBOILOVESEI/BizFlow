from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class AuditLogModel(Base):
    __tablename__ = 'audit_log'
    __table_args__ = {'extend_existing': True} 

    log_id = Column(Integer, primary_key=True)    
    user_id = Column(Integer, ForeignKey('user.user_id'))
    business_id = Column(Integer, ForeignKey('business.business_id'))
    action_type = Column(String(100), nullable=True)
    entity_type = Column(String(50), nullable=True)
    entity_id = Column(Integer, nullable=False)
    old_value = Column(JSON, nullable=False)
    new_value = Column(JSON, nullable=False)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    crated_at = Column(DateTime)