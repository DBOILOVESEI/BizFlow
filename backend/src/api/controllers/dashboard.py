import jwt
from flask import Blueprint, request, jsonify, current_app
from modules.extensions import bcrypt, cors
from modules.decorators import role_required
from repositories import dashboard_repo

from datetime import datetime, timedelta
from infrastructure.databases.engine import session

from repositories import user_repo

auth_bp = Blueprint('auth', __name__, url_prefix='/')

@auth_bp.route('/dashboard', methods=['POST'])
@role_required("OWNER")
def dashboard():
    print("hello dashbard")
dashboard_bp = Blueprint('dashboard_bp', __name__)

#
@dashboard_bp.route('/dashboard', methods=['GET'])
def get_stats():
    try:
        # Gọi hàm lấy dữ liệu từ Repo
        # Lưu ý: Hãy đảm bảo tên hàm này khớp với file dashboard_repo.py của bạn
        # (Lúc nãy mình hướng dẫn là get_dashboard_statistics, code bạn gửi là get_dashboard_overview)
        data = dashboard_repo.get_dashboard_statistics(session)
        
        return jsonify({
            "status": "success",
            "data": data
        }), 200
        
    except Exception as e:
        print(f"Lỗi Dashboard Controller: {e}")
        return jsonify({
            "status": "error",
            "message": "Không thể tải dữ liệu thống kê"
        }), 500