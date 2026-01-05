from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Numeric,
    ForeignKey, TIMESTAMP
)
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)

    role_id = Column(Integer, ForeignKey("roles.role_id"))
    owner_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)

    role = relationship("Role", back_populates="users")

    owner = relationship(
        "User",
        remote_side=[user_id],
        backref="employees"
    )

    orders = relationship("Order", back_populates="user")

