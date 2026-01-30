from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class AIInteractionModel(Base):
    __tablename__ = 'ai_interaction'
    __table_args__ = {'extend_existing': True} 

    interaction_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    draft_order_id = Column(Integer, ForeignKey('draft_order.draft_id'))
    input_text = Column(Text, nullable=True)
    input_type = Column(Enum('VOICE', 'TEXT', name="AIInputTypeEnum"), nullable=True)
    parsed_output = Column(JSON, nullable=True)
    confidence_score = Column(DECIMAL(3,2), nullable=True)
    was_correct = Column(Boolean, nullable=True)
    feedback_notes = Column(Text, nullable=True)
    processing_time_ms = Column(Integer, nullable=True)
    model_version = Column(String(50), nullable=True)
    created_at = Column(DateTime)
