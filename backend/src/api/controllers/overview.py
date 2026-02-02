from datetime import datetime, timedelta
from infrastructure.databases.engine import session
from flask import g, Blueprint, request, jsonify, current_app
from services.overview_service import DashboardService

overview_bp = Blueprint('overview', __name__, url_prefix='/')

@overview_bp.route("/dashboard", methods=["GET"])
def get_dashboard_overview():
    # SỬA: Xóa dấu () vì session là object, không phải hàm
    db = session 
    try:
        service = DashboardService(db)
        data = service.get_overview()
        return jsonify(data), 200
    except Exception as e:
        # Quan trọng: Trả về JSON lỗi để trình duyệt không báo lỗi CORS linh tinh
        print(f"Lỗi thực thi: {e}")
        return jsonify({"error": str(e)}), 500
