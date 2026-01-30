from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class Inventory(Base):
    __tablename__ = "inventory"

    inventory_id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity_in_stock = Column(Integer, default=0)

    product = relationship("Product", back_populates="inventory")
    stock_transactions = relationship("StockTransaction", back_populates="product")

