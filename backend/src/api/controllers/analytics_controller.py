from flask import Blueprint, jsonify, current_app
from repositories.analytics_repo import AnalyticsRepository

analytics_bp = Blueprint('analytics', __name__, url_prefix='/analytics')

@analytics_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    try:
        # 1. Call the repo
        repo = AnalyticsRepository()
        data = repo.get_dashboard_data()
        
        # 2. Send JSON back to Frontend
        return jsonify(data), 200

    except Exception as e:
        print(f"Server Error: {e}")
        # Send empty lists so frontend doesn't crash
        return jsonify({"orders": [], "customers": []}), 500