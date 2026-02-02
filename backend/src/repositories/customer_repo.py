from sqlalchemy.orm import Session
from sqlalchemy import text
from infrastructure.models.customer_model import CustomerModel
from infrastructure.models.customer_debt_model import CustomerDebtModel
def get_customers_by_owner(session: Session, owner_id: int):
    try:
        # Lấy tất cả khách do owner_id tạo
        # Sắp xếp theo ID giảm dần (người mới tạo lên đầu)
        customers = session.query(CustomerModel).filter(
            CustomerModel.created_by == owner_id
        ).order_by(CustomerModel.customer_id.desc()).all()
        
        return customers
    except Exception as e:
        print(f" Lỗi Repo: {e}")
        return []

def settle_debt_for_customer(session, customer_id: int, owner_id: int):
    try:
        # 1. Tìm khách hàng khớp ID và phải do User này tạo (created_by)
        customer = session.query(CustomerModel).filter(
            CustomerModel.customer_id == customer_id,
            CustomerModel.created_by == owner_id 
        ).first()
        
        if not customer:
            print(f"Không tìm thấy khách {customer_id} của user {owner_id}")
            return False

        # 2. Reset nợ về 0
        customer.total_debt = 0
        
        # 3. (Tùy chọn) Nếu bạn muốn cập nhật trạng thái trong bảng lịch sử nợ thành 'PAID'
        # Nếu không có bảng này hoặc không cần thiết thì bỏ qua đoạn này
        debts = session.query(CustomerDebtModel).filter(
            CustomerDebtModel.customer_id == customer_id,
            CustomerDebtModel.status == 'UNPAID'
        ).all()
        for debt in debts:
            debt.status = 'PAID'
            debt.paid_amount = debt.debt_amount
            debt.remaining_amount = 0
        
        # 4. Commit thay đổi
        session.commit()
        return True
    except Exception as e:
        session.rollback()
        print(f"Lỗi Repo Xóa Nợ: {e}")
        return False