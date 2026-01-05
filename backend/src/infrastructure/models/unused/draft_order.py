from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from infrastructure.databases.base import Base

class DraftOrder(Base):
    __tablename__ = "draft_orders"

    draft_id = Column(Integer, primary_key=True)
    raw_input_text = Column(Text)
    status = Column(Text)
    created_by_system = Column(Boolean)
    created_at = Column(TIMESTAMP, server_default=func.now())

