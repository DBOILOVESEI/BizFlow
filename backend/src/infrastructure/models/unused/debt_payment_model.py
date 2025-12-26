from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum
from infrastructure.databases.base import Base

class DebtPaymentModel(Base):
    __tablename__ = 'debt_payment'
    __table_args__ = {'extend_existing': True} 

    payment_id = Column(Integer, primary_key=True)
    debt_id = Column(Integer, ForeignKey('customer_debt.debt_id'))
    payment_amount = Column(DECIMAL(15,2), nullable=False)
    payment_date = Column(DateTime, nullable=True)
    payment_method = Column(Enum('CASH', 'BANK_TRANSFER', 'OTHER'), nullable=False)
    notes = Column(Text, nullable=Text)
    received_by = Column(Integer, ForeignKey)
    created_at = Column(DateTime)