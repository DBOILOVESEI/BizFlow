from abc import ABC, abstractmethod
from backend.src.domain.models.product import Product
from .customer_debt import CustomerDebt
from typing import List, Optional

class ICustomerDebtRepository(ABC):
    @abstractmethod
    def add(self, customer_debt: CustomerDebt) -> CustomerDebt:
        pass

    @abstractmethod
    def get_by_id(self, customer_debt_id: int) -> Optional[CustomerDebt]:
        pass

    @abstractmethod
    def list(self) -> List[CustomerDebt]:
        pass

    @abstractmethod
    def update(self, customer_debt: CustomerDebt) -> CustomerDebt:
        pass

    @abstractmethod
    def delete(self, customer_debt_id: int) -> None:
        pass 