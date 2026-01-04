from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class SubscriptionHistoryModel(Base):
    __tablename__ = 'subscription_history'
    __table_args__ = {'extend_existing': True} 

    history_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    plan_id = Column(Integer, ForeignKey('subscription_plan.plan_id'))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    amount_paid = Column(DECIMAL(10,2), nullable=True)
<<<<<<< HEAD
    payment_method = Column(Enum('BANK_TRANSFER', 'CARD', 'CASH'), nullable=False)
    status = Column(Enum('ACTIVE', 'EXPIRED', 'CANCELLED'), nullable=False)
=======
    payment_method = Column(Enum('BANK_TRANSFER', 'CARD', 'CASH', name="PaymentMethodEnum"), nullable=False)
    status = Column(Enum('ACTIVE', 'EXPIRED', 'CANCELLED', name="SubscriptionMethodEnum"), nullable=False)
>>>>>>> e0906b4a9d22d5a9239c2fb2c08633218e53faac
    created_at = Column(DateTime)