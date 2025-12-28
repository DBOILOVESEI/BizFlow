from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    price = Column(Numeric, nullable=False)
    category = Column(Text)
    is_active = Column(Boolean, default=True)

    inventory = relationship("Inventory", back_populates="product", uselist=False)
    order_items = relationship("OrderItem", back_populates="product")

