from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, timedelta

from infrastructure.models.order_model import OrderModel
from infrastructure.models.customer_model import CustomerModel
from infrastructure.models.customer_debt_model import CustomerDebtModel
from infrastructure.models.inventory_model import InventoryModel


def get_total_revenue(db: Session):
    return db.query(
        func.coalesce(func.sum(OrderModel.final_amount), 0)
    ).scalar()


def get_total_customers(db: Session):
    return db.query(
        func.count(CustomerModel.customer_id)
    ).scalar()

def get_total_debt(db: Session):
    return db.query(
        func.coalesce(func.sum(OrderModel.debt_amount), 0)
    ).scalar()

def get_low_stock_products(db: Session):
    return db.query(
        func.count(InventoryModel.inventory_id)
    ).filter(
        InventoryModel.quantity <= InventoryModel.low_stock_threshold
    ).scalar()

def get_weekly_revenue(db: Session):
    start_date = datetime.now().date() - timedelta(days=6)

    rows = (
        db.query(
            cast(OrderModel.order_date, Date).label("date"),
            func.sum(OrderModel.final_amount).label("revenue")
        )
        .filter(OrderModel.order_date >= start_date)
        .group_by(cast(OrderModel.order_date, Date))
        .order_by(cast(OrderModel.order_date, Date))
        .all()
    )

    return [
        {
            "date": row.date.isoformat(),
            "revenue": float(row.revenue)
        }
        for row in rows
    ]