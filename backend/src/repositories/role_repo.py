# repositories/user_repo.py
from infrastructure.databases.engine import session
from infrastructure.models.role_model import RoleModel

roles_to_create = [
    "OWNER",
    "EMPLOYEE",
    "ADMIN"
]

def get_role_id_by_name(role_name: str):
    role = session.query(RoleModel).filter_by(role_name=role_name).first()
    return role.role_id if role else None

def get_role_name_by_id(role_id: int):
    role = session.query(RoleModel).filter_by(role_id=role_id).first()
    return role.role_name if role else None

def create_roles():
    created = []

    for role_name in roles_to_create:
        existing_role = session.query(RoleModel)\
                               .filter_by(role_name=role_name)\
                               .first()
        if not existing_role:
            role = RoleModel(role_name=role_name)
            session.add(role)
            created.append(role_name)

    if created:
        session.commit()
        print(f"Created roles: {', '.join(created)}")
    else:
        print("All roles already exist.")

