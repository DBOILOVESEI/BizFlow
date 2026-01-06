# repositories/user_repo.py
from infrastructure.databases.engine import session
from infrastructure.models.user_model import UserModel

def get_by_username(username):
    return session.query(UserModel).filter_by(username=username).first()

def get_by_email(email):
    return session.query(UserModel).filter_by(email=email).first()

def user_exists(email):
    return session.query(UserModel).filter_by(
        email=email,
        #role=data['role']
    ).first() 
    
def create_user(username, email, password_hash, role="employee"):
    user = UserModel(
        username=username,
        email=email,
        password_hash=password_hash,
        role=role
    )
    session.add(user)
    session.commit()
    return user
