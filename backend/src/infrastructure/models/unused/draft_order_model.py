from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class DraftOrderModel(Base):
    __tablename__ = 'draft_order'
    __table_args__ = {'extend_existing': True} 

    draft_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    source_type = Column(Enum('VOICE', 'TEXT', 'ZALO', 'PHONE'), nullable=False)
    original_message = Column(Text, nullable=True)
    customer_identifier = Column(String(200), nullable=True)
    customer_id = Column(Integer, ForeignKey('customer.customer_id'))
    ai_confidence_score = Column(DECIMAL(3,2), nullable=True)
    draft_status = Column(Enum('PENDING', 'CONFIRMED', 'REJECTED', 'EDITED'), nullable=False)
    parsed_data = Column(JSON, nullable=True)
    notes_from_ai = Column(Text, nullable=True)
    created_at = Column(DateTime)
    processed_at = Column(DateTime)
    processed_by = Column(Integer, ForeignKey)
    order_id = Column(Integer, ForeignKey('order.order_id'))