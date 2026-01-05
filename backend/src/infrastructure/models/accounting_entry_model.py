from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class AccountingEntryModel(Base):
    __tablename__ = 'accounting_entry'
    __table_args__ = {'extend_existing': True} 

    entry_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    entry_date = Column(DateTime)
<<<<<<< HEAD
    entry_type = Column(
        Enum(
            'REVENUE',
            'PURCHASE',
            'DEBT_PAYMENT',
            'ADJUSTMENT',
            name='entry_type_enum'
        ),
        nullable=False
    )
=======
>>>>>>> ebc731bb4bf838b748d526476803a32a9e68a6b1
    entry_type = Column(Enum('REVENUE', 'PURCHASE', 'DEBT_PAYMENT', 'ADJUSTMENT', name="AccountingEntryTypeEnum"), nullable=False)
    reference_type = Column(String(50), nullable=True)
    reference_id = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    amount = Column(DECIMAL(15,2), nullable=True)
    created_at = Column(DateTime)
    created_by_system = Column(Boolean)