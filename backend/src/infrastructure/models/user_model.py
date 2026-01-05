from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Boolean, Enum
from infrastructure.databases.base import Base

class UserModel(Base):
<<<<<<< HEAD
    __tablename__ = "user"
    __table_args__ = {'extend_existing': True}

    user_id = Column(Integer, primary_key=True)
    role = Column(Enum('admin', 'owner', 'employee'), nullable=False)
    username = Column(String(50), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
=======
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}

    user_id = Column(Integer, primary_key = True)
    username = Column(String(50), nullable = True)
    password_hash = Column(String(255), nullable = True)
>>>>>>> ebc731bb4bf838b748d526476803a32a9e68a6b1
    full_name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_login = Column(DateTime)
<<<<<<< HEAD

    created_by = Column(Integer, ForeignKey("user.user_id"), nullable=False)
=======
    created_by = Column(Integer, nullable=False)
>>>>>>> ebc731bb4bf838b748d526476803a32a9e68a6b1
