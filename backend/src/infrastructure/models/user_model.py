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
>>>>>>> f39ae2140416c6d2bf1de88a8fbba34eb5b56f16
    full_name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
<<<<<<< HEAD
    last_login = Column(DateTime)
=======
    last_login = Column(DateTime)
    created_by = Column(Integer, nullable=False)

    role_id = Column(Integer, ForeignKey('role.role_id'))
    owner_id = Column(Integer, ForeignKey('user.user_id'), nullable=True)
    inventory_id = Column(Integer, ForeignKey('inventory.inventory_id'), nullable=True)
>>>>>>> f39ae2140416c6d2bf1de88a8fbba34eb5b56f16
