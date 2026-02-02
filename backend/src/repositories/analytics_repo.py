from sqlalchemy import func, desc
from infrastructure.databases.database import SessionLocal 
from infrastructure.models.order_model import OrderModel
from infrastructure.models.user_model import UserModel

class AnalyticsRepository:
    def __init__(self):
        self.session = SessionLocal()

    def get_dashboard_data(self):
        return {
            "orders": self._get_orders(),
            "customers": self._get_customers()
        }

    def _get_orders(self):
        orders = self.session.query(OrderModel).order_by(desc(OrderModel.created_at)).all()
        
        formatted_orders = []
        for o in orders:
            total_amount = float(o.total_amount or 0)
            debt_amount = float(o.debt_amount or 0)
            paid_amount = float(o.paid_amount or 0)

            formatted_orders.append({
                "id": str(o.order_id),
                "totalAmount": total_amount,
                "paidAmount": paid_amount,
                "debtAmount": debt_amount,
                "createdAt": o.created_at.isoformat() if o.created_at else "",
                "items": [
                    { "productName": "Sản phẩm cửa hàng", "quantity": 1 }
                ]
            })
        return formatted_orders

    def _get_customers(self):
        customers = self.session.query(UserModel).filter_by(role='customer').all()
        
        formatted_customers = []
        for c in customers:
            total_debt = self.session.query(func.sum(OrderModel.debt_amount))\
                .filter(OrderModel.customer_id == c.id)\
                .scalar() or 0.0

            formatted_customers.append({
                "id": str(c.id),
                "name": c.full_name or c.username,
                "phone": c.phone_number or "N/A",
                "debt": float(total_debt)
            })
        return formatted_customers