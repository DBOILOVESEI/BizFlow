class CustomerDebt:
    def __init__(self, debt_id: int, customer_id: int, customer_name: str,
                 total_debt: float, paid_amount: float,
                 outstanding_amount: float, last_payment_date: str,
                 created_at: str, updated_at: str):
        self.debt_id = debt_id
        self.customer_id = customer_id
        self.customer_name = customer_name
        self.total_debt = total_debt
        self.paid_amount = paid_amount
        self.outstanding_amount = outstanding_amount
        self.last_payment_date = last_payment_date
        self.created_at = created_at
        self.updated_at = updated_at