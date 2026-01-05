from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class ReportTemplateModel(Base):
    __tablename__ = 'report_template'
    __table_args__ = {'extend_existing': True} 

    template_id = Column(Integer, primary_key=True)
    template_name = Column(String(200), nullable=True)
    template_code = Column(String(50), nullable=True)
<<<<<<< HEAD
    template_type = Column(Enum('REVENUE', 'DEBT', 'INVENTORY', 'BUSINESS_OPERATION'), nullable=False)
    calculation_reference = Column(String(100), nullable=True)
=======
    template_type = Column(Enum('REVENUE', 'DEBT', 'INVENTORY', 'BUSINESS_OPERATION', name="ReportTemplateTypeEnum"), nullable=False)
    carculation_reference = Column(String(100), nullable=True)
>>>>>>> ebc731bb4bf838b748d526476803a32a9e68a6b1
    version = Column(String(20), nullable=True)
    is_active = Column(Boolean, nullable=True)
    template_structure = Column(JSON, nullable=True)
    carculation_rules = Column(JSON, nullable=True)
    effective_date = Column(DateTime)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)