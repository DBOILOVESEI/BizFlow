from infrastructure.databases.engine import engine
from infrastructure.databases.base import Base

import infrastructure.models

Base.metadata.create_all(engine)
