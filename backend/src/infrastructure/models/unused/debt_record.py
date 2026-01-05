from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from infrastructure.databases.base import Base

class DebtRecord(Base):
    __tablename__ = "debt_records"

    debt_id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"))
    order_id = Column(Integer, ForeignKey("orders.order_id"))

    amount = Column(Numeric)
    status = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

    customer = relationship("Customer", back_populates="debts")
    order = relationship("Order", back_populates="debts")



