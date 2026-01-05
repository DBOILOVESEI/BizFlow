from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
#from ... config import DATABASE_URL

DATABASE_URL = "postgresql+psycopg2://postgres@localhost:5432/bizflow_dev"


engine = create_engine(
    DATABASE_URL,
    echo=True,   # shows SQL, very good for learning
    future=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()