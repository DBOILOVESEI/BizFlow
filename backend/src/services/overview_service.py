from sqlalchemy.orm import Session

class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def get_overview(self):
        from repositories.overview import (
            get_total_revenue,
            get_total_customers,
            get_total_debt,
            get_low_stock_products,
            get_weekly_revenue
        )

        overview = {
            "total_revenue": get_total_revenue(self.db),
            "total_customers": get_total_customers(self.db),
            "total_debt": get_total_debt(self.db),
            "low_stock_products": get_low_stock_products(self.db),
            "weekly_revenue": get_weekly_revenue(self.db)
        }

        return overview