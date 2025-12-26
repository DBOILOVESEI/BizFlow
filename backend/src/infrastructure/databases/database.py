from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from . import base
engine = None
SessionLocal = None

def init_db(app):
    global engine, SessionLocal

    engine = create_engine(
        app.config['DATABASE_URI'],
        echo=True,
        future=True
    )

    SessionLocal = sessionmaker(bind=engine)

    base.Base.metadata.create_all(engine)
