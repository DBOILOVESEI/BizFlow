from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class NotificationModel(Base):
    __tablename__ = 'notification'
    __table_args__ = {'extend_existing': True} 

    notification_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.user_id'))
    notification_type = Column(Enum('NEW_DRAFT_ORDER', 'LOW_STOCK', 'DEBT_OVERDUE', 'SYSTEM'), nullable=False)
    title = Column(String(200), nullable=True)
    message = Column(Text, nullable=True)
    reference_type = Column(String(50), nullable=True)
    reference_id = Column(Integer, nullable=False)
    is_read = Column(Boolean, nullable=True)
    created_at = Column(DateTime)
    priority = Column(Enum('LOW', 'NORMAL', 'HIGH', 'URGENT'), nullable=False)
    read_at = Column(DateTime, nullable=True)