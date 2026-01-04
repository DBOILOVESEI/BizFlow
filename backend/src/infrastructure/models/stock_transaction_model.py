from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum
from infrastructure.databases.base import Base

class StockTransactionModel(Base):
    __tablename__ = 'stock_transaction'
    __table_args__ = {'extend_existing': True} 

    transaction_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    transaction_type = Column(Enum('IMPORT', 'EXPORT', 'ADJUSTMENT', name="StockTransactionTypeEnum"), nullable=False)
    transaction_date = Column(DateTime)
    reference_type = Column(Enum('PURCHASE_ORDER', 'SALES_ORDER', 'MANUAL', name="ReferenceTypeEnum"), nullable=False)
    reference_id = Column(Integer, nullable=False)
    notes = Column(Text, nullable=Text)
    created_by = Column(Integer, nullable=False)
    created_at = Column(DateTime)