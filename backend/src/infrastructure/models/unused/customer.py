from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True)
    name = Column(Text)
    phone = Column(Text)
    address = Column(Text)
    total_debt = Column(Numeric, default=0)

    orders = relationship("Order", back_populates="customer")
    debts = relationship("DebtRecord", back_populates="customer")

