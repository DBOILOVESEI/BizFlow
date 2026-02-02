from sqlalchemy import func, cast, Date, desc
from datetime import datetime, timedelta
from infrastructure.models.order_model import OrderModel
from infrastructure.models.customer_model import CustomerModel
from infrastructure.models.product_model import ProductModel

def get_dashboard_statistics(db_session):
    try:
        # --- 1. TÍNH TỔNG DOANH THU ---
        query_revenue = db_session.query(func.sum(OrderModel.final_amount)).filter(
            OrderModel.order_status == 'COMPLETED'
        )
        total_revenue = query_revenue.scalar() or 0

        # --- 2. TÍNH TỔNG KHÁCH HÀNG (ĐÃ SỬA) ---
        # A. Đếm số khách đã lưu trong bảng Customer
        registered_customers = db_session.query(func.count(CustomerModel.customer_id)).scalar() or 0
        
        # B. Đếm số lượt khách vãng lai (Dựa trên đơn hàng không có customer_id)
        # Chỉ tính các đơn đã hoàn thành
        guest_customers = db_session.query(func.count(OrderModel.order_id)).filter(
            OrderModel.customer_id == None,
            OrderModel.order_status == 'COMPLETED'
        ).scalar() or 0

        # Tổng cộng
        total_customers = registered_customers + guest_customers

        # --- 3. TÍNH TỔNG NỢ PHẢI THU ---
        total_debt = db_session.query(func.sum(CustomerModel.total_debt)).scalar() or 0

        # --- 4. SẢN PHẨM SẮP HẾT ---
        low_stock_count = db_session.query(func.count(ProductModel.product_id)).filter(
            ProductModel.stock_quantity <= 10,
            ProductModel.is_active == True
        ).scalar() or 0

        # --- 5. BIỂU ĐỒ DOANH THU 7 NGÀY ---
        seven_days_ago = datetime.now() - timedelta(days=6)
        
        chart_query = db_session.query(
            cast(OrderModel.order_date, Date).label('date'), 
            func.sum(OrderModel.final_amount).label('value')
        ).filter(
            OrderModel.order_date >= seven_days_ago,
            OrderModel.order_status == 'COMPLETED'
        ).group_by(
            cast(OrderModel.order_date, Date)
        ).order_by(
            cast(OrderModel.order_date, Date)
        ).all()

        chart_data = []
        for day, value in chart_query:
            chart_data.append({
                "day": day.strftime("%d/%m"), 
                "value": float(value)
            })

        return {
            "revenue": float(total_revenue),
            "customers": int(total_customers), # Số này giờ đã bao gồm cả khách vãng lai
            "debt": float(total_debt),
            "low_stock": int(low_stock_count),
            "chart_data": chart_data 
        }

    except Exception as e:
        print(f"Lỗi Dashboard Repo: {e}")
        return {
            "revenue": 0, "customers": 0, "debt": 0, "low_stock": 0, "chart_data": []
        }