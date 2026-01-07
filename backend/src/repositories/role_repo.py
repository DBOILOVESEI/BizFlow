# repositories/user_repo.py
from infrastructure.databases.engine import session
from infrastructure.models.role_model import RoleModel

def get_role_id_by_name(role_name: str):
    role = session.query(RoleModel).filter_by(role_name=role_name).first()
    return role.role_id if role else None

def get_role_name_by_id(role_id: int):
    role = session.query(RoleModel).filter_by(role_id=role_id).first()
    return role.role_name if role else None

