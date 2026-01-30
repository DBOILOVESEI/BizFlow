from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean
from infrastructure.databases.base import Base

class StockTransactionDetailModel(Base):
    __tablename__ = 'stock_transaction_detail'
    __table_args__ = {'extend_existing': True} 

    stock_transantion_detail_id = Column(Integer, primary_key=True)
    transaction_id = Column(Integer, ForeignKey('stock_transaction.transaction_id'))
    product_id = Column(Integer, ForeignKey('product.product_id'))
    quantity = Column(DECIMAL(15,4), nullable=False)
    unit = Column(String(50), nullable=True)
    unit_price = Column(DECIMAL(15,2), nullable=False)
    total_amount = Column(DECIMAL(15,2), nullable=False)
    notes = Column(Text, nullable=Text)