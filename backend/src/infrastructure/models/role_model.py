from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class RoleModel(Base):
    __tablename__ = "role"

    role_id = Column(Integer, primary_key=True)
    role_name = Column(Text, nullable=False)
