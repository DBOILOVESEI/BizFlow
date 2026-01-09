from datetime import datetime, timedelta

# repositories/user_repo.py
from infrastructure.databases.engine import session
from infrastructure.models.user_model import UserModel
from . import role_repo
from . import inventory_repo

def get_by_username(username):
    return session.query(UserModel).filter_by(username=username).first()

def get_by_email(email):
    return session.query(UserModel).filter_by(email=email).first()

def get_by_id(user_id):
    return session.query(UserModel).filter_by(user_id=user_id).first()

def user_exists(username: str, email: str | None = None):
    # username exists?
    user = session.query(UserModel).filter_by(username=username).first()
    if user:
        return user

    if email!=None:
        # username not taken. email exists?
        return session.query(UserModel).filter_by(email=email).first()
    
def create_user(username, password_hash, email, role_id, owner_id):
    new_user = UserModel(
        username=username,
        password_hash=password_hash,
        email=email,
        role_id=role_id,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        created_by=0,
        owner_id = owner_id
    )
    try:
        session.add(new_user)
        session.commit()
        return new_user

    except InterruptedError:
        session.rollback()
        return None

def get_employees_by_owner_id(owner_id: int):
    employee_role_id = role_repo.get_role_id_by_name("EMPLOYEE")

    if not employee_role_id:
        return []
    
    return session.query(UserModel).filter(
        UserModel.owner_id == owner_id,
        UserModel.role_id == employee_role_id
    ).all()