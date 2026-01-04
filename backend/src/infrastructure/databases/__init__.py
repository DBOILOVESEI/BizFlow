from infrastructure.databases.engine import engine
from infrastructure.databases.base import Base

from infrastructure.models.user import User

Base.metadata.create_all(engine)