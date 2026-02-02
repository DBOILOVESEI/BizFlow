from sqlalchemy import func, cast, Date, desc
from datetime import datetime, timedelta
from infrastructure.models.order_model import OrderModel
from infrastructure.models.customer_model import CustomerModel
from infrastructure.models.product_model import ProductModel
from infrastructure.models.inventory_model import InventoryModel

def get_dashboard_statistics(db_session, owner_id): # 👈 Thêm tham số owner_id
    try:
        # --- 1. TÍNH TỔNG DOANH THU (Của User này) ---
        query_revenue = db_session.query(func.sum(OrderModel.final_amount)).filter(
            OrderModel.order_status == 'COMPLETED',
            OrderModel.created_by == owner_id  # 👈 Lọc theo người tạo
        )
        total_revenue = query_revenue.scalar() or 0

        # --- 2. TÍNH TỔNG KHÁCH HÀNG ---
        # A. Khách đã đăng ký (do User này tạo)
        registered_customers = db_session.query(func.count(CustomerModel.customer_id)).filter(
            CustomerModel.created_by == owner_id # 👈 Lọc theo người tạo
        ).scalar() or 0
        
        # B. Khách vãng lai (Dựa trên đơn hàng của User này)
        guest_customers = db_session.query(func.count(OrderModel.order_id)).filter(
            OrderModel.customer_id == None,
            OrderModel.order_status == 'COMPLETED',
            OrderModel.created_by == owner_id # 👈 Lọc theo đơn hàng của User này
        ).scalar() or 0

        total_customers = registered_customers + guest_customers

        # --- 3. TỔNG NỢ PHẢI THU (Của khách do User này quản lý) ---
        total_debt = db_session.query(func.sum(CustomerModel.total_debt)).filter(
            CustomerModel.created_by == owner_id # 👈 Lọc theo người tạo
        ).scalar() or 0

        # --- 4. SẢN PHẨM SẮP HẾT ---
        # Phải tìm kho hàng của User này trước
        user_inventory = db_session.query(InventoryModel).filter(
            InventoryModel.owner_id == owner_id
        ).first()

        low_stock_count = 0
        if user_inventory:
            low_stock_count = db_session.query(func.count(ProductModel.product_id)).filter(
                ProductModel.inventory_id == user_inventory.inventory_id, # 👈 Lọc theo kho của User
                ProductModel.stock_quantity <= 10,
                ProductModel.is_active == True
            ).scalar() or 0

        # --- 5. BIỂU ĐỒ DOANH THU 7 NGÀY (Của User này) ---
        seven_days_ago = datetime.now() - timedelta(days=6)
        
        chart_query = db_session.query(
            cast(OrderModel.created_at, Date).label('date'),  # Sửa order_date thành created_at nếu model bạn dùng tên này
            func.sum(OrderModel.final_amount).label('value')
        ).filter(
            OrderModel.created_at >= seven_days_ago,
            OrderModel.order_status == 'COMPLETED',
            OrderModel.created_by == owner_id # 👈 Quan trọng nhất
        ).group_by(
            cast(OrderModel.created_at, Date)
        ).order_by(
            cast(OrderModel.created_at, Date)
        ).all()

        chart_data = []
        for day, value in chart_query:
            chart_data.append({
                "day": day.strftime("%d/%m"), 
                "value": float(value)
            })

        return {
            "revenue": float(total_revenue),
            "customers": int(total_customers),
            "debt": float(total_debt),
            "low_stock": int(low_stock_count),
            "chart_data": chart_data 
        }

    except Exception as e:
        print(f"Lỗi Dashboard Repo: {e}")
        # Trả về dữ liệu rỗng để không làm crash App
        return {
            "revenue": 0, "customers": 0, "debt": 0, "low_stock": 0, "chart_data": []
        }