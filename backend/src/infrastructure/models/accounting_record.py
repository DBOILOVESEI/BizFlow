from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from infrastructure.databases.base import Base

class AccountingRecord(Base):
    __tablename__ = "accounting_records"

    record_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"))

    record_type = Column(Text)
    amount = Column(Numeric)
    created_at = Column(TIMESTAMP, server_default=func.now())

    order = relationship("Order", back_populates="accounting_records")

