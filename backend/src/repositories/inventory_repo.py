from datetime import datetime, timedelta

# repositories/user_repo.py
from infrastructure.databases.engine import session
from infrastructure.models.inventory_model import InventoryModel
from . import role_repo
    
def create_inventory(owner_id: int):
    new_inventory = InventoryModel(
        last_update=datetime.utcnow(),
        owner_id=owner_id
    )
    try:
        session.add(new_inventory)
        session.commit()
        return new_inventory

    except InterruptedError:
        session.rollback()
        return None

def get_inventory_from_owner_id(owner_id: int):
    return session.query(InventoryModel).filter(
        InventoryModel.owner_id == owner_id,
    ).first()