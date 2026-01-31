from domain.models.icustomer_debt_repository import ICustomerDebtRepository
from domain.models.customer_debt import CustomerDebt
from typing import List, Optional
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import Config
from sqlalchemy import Column, Integer, String, DateTime
from infrastructure.databases import Base
from sqlalchemy.orm import Session
from infrastructure.models.customer_debt_model import CustomerDebtModel
from infrastructure.databases.engine import session
load_dotenv()

class CustomerDebtRepository(ICustomerDebtRepository):
    def __init__(self, session: Session):
        self.session = session

    def add(self, customer_debt: CustomerDebt) -> CustomerDebtModel:
        customer_debt_model = CustomerDebtModel(
            customer_id=customer_debt.customer_id,
            order_id=customer_debt.order_id,
            debt_amount=customer_debt.debt_amount,
            paid_amount=customer_debt.paid_amount,
            remaining_amount=customer_debt.remaining_amount,
            debt_date=customer_debt.debt_date,
            due_date=customer_debt.due_date,
            status=customer_debt.status
        )

        self.session.add(customer_debt_model)
        self.session.commit()
        self.session.refresh(customer_debt_model)

        return customer_debt_model

    def get_by_id(self, customer_debt_id: int) -> Optional[CustomerDebtModel]:
        return (
            self.session
            .query(CustomerDebtModel)
            .filter_by(debt_id=customer_debt_id)
            .first()
        )

    def list(self) -> List[CustomerDebtModel]:
        return self.session.query(CustomerDebtModel).all()

    def update(self, customer_debt: CustomerDebt) -> Optional[CustomerDebtModel]:
        customer_debt_model = (
            self.session
            .query(CustomerDebtModel)
            .filter_by(debt_id=customer_debt.customer_debt_id)
            .first()
        )

        if not customer_debt_model:
            return None

        customer_debt_model.customer_id = customer_debt.customer_id
        customer_debt_model.order_id = customer_debt.order_id
        customer_debt_model.debt_amount = customer_debt.debt_amount
        customer_debt_model.paid_amount = customer_debt.paid_amount
        customer_debt_model.remaining_amount = customer_debt.remaining_amount
        customer_debt_model.debt_date = customer_debt.debt_date
        customer_debt_model.due_date = customer_debt.due_date
        customer_debt_model.status = customer_debt.status

        self.session.commit()
        self.session.refresh(customer_debt_model)

        return customer_debt_model

    def delete(self, customer_debt_id: int) -> bool:
        customer_debt_model = (
            self.session
            .query(CustomerDebtModel)
            .filter_by(debt_id=customer_debt_id)
            .first()
        )

        if not customer_debt_model:
            return False

        self.session.delete(customer_debt_model)
        self.session.commit()
        return True