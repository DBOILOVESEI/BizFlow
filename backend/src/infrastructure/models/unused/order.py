from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from infrastructure.databases.base import Base

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    customer_id = Column(Integer, ForeignKey("customers.customer_id"), nullable=True)

    order_date = Column(TIMESTAMP, server_default=func.now())
    total_amount = Column(Numeric)
    status = Column(Text)

    user = relationship("User", back_populates="orders")
    customer = relationship("Customer", back_populates="orders")

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    debts = relationship("DebtRecord", back_populates="order")
    accounting_records = relationship("AccountingRecord", back_populates="order")

