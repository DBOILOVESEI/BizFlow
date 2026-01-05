from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from infrastructure.databases.base import Base

class StockTransaction(Base):
    __tablename__ = "stock_transactions"

    stock_txn_id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity = Column(Integer)
    type = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

    product = relationship("Product", back_populates="stock_transactions")
