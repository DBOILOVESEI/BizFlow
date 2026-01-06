# repositories/user_repo.py
from infrastructure.databases.session import db_session
from infrastructure.databases.models.user import UserModel

def get_by_username(username):
    return db_session.query(UserModel).filter_by(username=username).first()

def get_by_email(email):
    return db_session.query(UserModel).filter_by(email=email).first()

def create_user(username, email, password_hash, role="employee"):
    user = UserModel(
        username=username,
        email=email,
        password_hash=password_hash,
        role=role
    )
    db_session.add(user)
    db_session.commit()
    return user
