from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from infrastructure.databases.engine import SessionLocal
from repositories.customer_repo import get_customers_by_owner, settle_debt_for_customer

customer_bp = Blueprint('customer_bp', __name__)

@customer_bp.route('/customers', methods=['GET'])
@jwt_required() 
def list_customers():
    # 1. Lấy User ID từ Token
    current_user_id = get_jwt_identity()
    
    print(f"[DEBUG] User đang login ID: {current_user_id} (Kiểu: {type(current_user_id)})")
    
    session = SessionLocal()
    try:
        # 2. Gọi Repo lấy khách của User này
        customers = get_customers_by_owner(session, current_user_id)
        print(f"👉 [DEBUG] Tìm thấy {len(customers)} khách hàng trong DB.")

        data = []
        for c in customers:
            # Logic: Chỉ hiện người có nợ > 0
            if c.total_debt is not None and float(c.total_debt) > 0:
                print(f" Lấy khách: {c.customer_name} - Nợ: {c.total_debt}")
                data.append({
                    "customer_id": c.customer_id,
                    "full_name": c.customer_name,
                    "phone": c.phone if c.phone else "",
                    "total_debt": float(c.total_debt)
                })
            else:
                # Dòng này để biết ai bị ẩn do không nợ
                print(f"  Bỏ qua khách: {c.customer_name} - Nợ: {c.total_debt}")

        return jsonify({
            "status": "success",
            "data": data
        }), 200
        
    except Exception as e:
        print(f"Lỗi Controller: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        session.close()

# API Xóa nợ (Giữ nguyên logic)
@customer_bp.route('/customers/<int:customer_id>/settle-debt', methods=['POST'])
@jwt_required()
def settle_debt(customer_id):
    # 1. Lấy ID user từ token
    current_user_id = get_jwt_identity()
    
    session = SessionLocal()
    try:
        # 2. Truyền ID user xuống để repo kiểm tra quyền
        success = settle_debt_for_customer(session, customer_id, current_user_id)
        
        if success:
            return jsonify({"status": "success", "message": "Đã xóa nợ thành công!"}), 200
        else:
            return jsonify({"status": "error", "message": "Không thể xóa nợ (Lỗi quyền hoặc không tìm thấy khách)"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        session.close()