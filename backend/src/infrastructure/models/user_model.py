from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Boolean, Enum
from infrastructure.databases.base import Base

class UserModel(Base):
    __tablename__ = "user"
    __table_args__ = {'extend_existing': True}

    user_id = Column(Integer, primary_key=True)
    role = Column(Enum('admin', 'owner', 'employee'), nullable=False)
    username = Column(String(50), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, nullable=True)

    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_login = Column(DateTime)

    created_by = Column(Integer, ForeignKey("user.user_id"), nullable=False)