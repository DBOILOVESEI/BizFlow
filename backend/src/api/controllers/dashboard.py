from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from infrastructure.databases.engine import SessionLocal
from repositories import dashboard_repo

# --- CẤU HÌNH BLUEPRINT ---
# Lưu ý: Không để url_prefix='/api' để đường dẫn là /dashboard như bạn muốn
dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_stats():
    current_user_id = get_jwt_identity()
    session = SessionLocal()
    
    try:
        # Gọi xuống Repo (đảm bảo hàm bên repo tên là get_dashboard_statistics)
        data = dashboard_repo.get_dashboard_statistics(session, current_user_id)
        
        return jsonify({
            "status": "success",
            "data": data
        }), 200
        
    except Exception as e:
        print(f"❌ Lỗi Dashboard Controller: {e}")
        return jsonify({
            "status": "error",
            "message": "Không thể tải dữ liệu thống kê"
        }), 500
    finally:
        session.close()