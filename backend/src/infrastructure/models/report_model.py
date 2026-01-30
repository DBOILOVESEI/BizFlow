from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, DECIMAL, Boolean, Enum, JSON
from infrastructure.databases.base import Base

class ReportModel(Base):
    __tablename__ = 'report'
    __table_args__ = {'extend_existing': True} 

    report_id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('business.business_id'))
    report_type = Column(Enum('REVENUE', 'DEBT', 'INVENTORY', 'BUSINESS_OPERATION', 'TAX', name="ReportTypeEnum"), nullable=False)
    report_period = Column(String(20), nullable=True)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    template_version = Column(String(20), nullable=True)
    report_data = Column(JSON, nullable=False)
    file_path = Column(String(500), nullable=True)
    status = Column(Enum('DRAFT', 'FINALIZED', 'SUBMITTED', name="ReportStatusEnum"), nullable=False)
    generated_at = Column(DateTime)
    generated_by = Column(Integer, nullable=False)
    finalized_at = Column(DateTime, nullable=True)