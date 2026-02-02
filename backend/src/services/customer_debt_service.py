from typing import List, Optional
from domain.models.customer_debt import CustomerDebt
from domain.models.icustomer_debt_repository import ICustomerDebtRepository
class CustomerDebtService:
    def __init__(self, repository: ICustomerDebtRepository):
        self.repository = repository

    def create_customer_debt(self, 
                             customer_id: int, 
                             order_id: int, 
                             debt_amount: float, 
                             paid_amount: float, 
                             remaining_amount: float, 
                             debt_date, due_date, 
                             status: str) -> CustomerDebt:        
        customer_debt = CustomerDebt(customer_id=customer_id, order_id=order_id, debt_amount=debt_amount, paid_amount=paid_amount, remaining_amount=remaining_amount, debt_date=debt_date, due_date=due_date, status=status)
        return self.repository.add(customer_debt)

    def get_customer_debt(self, customer_debt_id: int) -> Optional[CustomerDebt]:
        return self.repository.get_by_id(customer_debt_id)

    def list_customer_debts(self) -> List[CustomerDebt]:
        return self.repository.list()

    def update_customer_debt(self, customer_debt_id: int, customer_id: int, order_id: int, debt_amount: float, paid_amount: float, remaining_amount: float, debt_date, due_date, status: str) -> CustomerDebt:
        customer_debt = CustomerDebt(customer_debt_id=customer_debt_id, customer_id=customer_id, order_id=order_id, debt_amount=debt_amount, paid_amount=paid_amount, remaining_amount=remaining_amount, debt_date=debt_date, due_date=due_date, status=status)
        return self.repository.update(customer_debt)
    
    def delete_customer_debt(self, customer_debt_id: int) -> None:
        self.repository.delete(customer_debt_id)