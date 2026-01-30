from flask import Blueprint, request, jsonify
from modules.decorators import role_required
from repositories import orders_repo

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/analytics', methods=['GET'])
@role_required("OWNER")
def dashboard():
    days = request.args.get('days', default=7, type=int)
    data = orders_repo.get_analytics_data(days)
    return jsonify({
        "summary": {
            "totalRevenue": data['total_revenue'],
            "totalReceivables": data['total_debt'],
            "totalOrders": data['total_orders'],
            "avgOrderValue": data['avg_order_value'],
            "revenueGrowth": 0, "orderGrowthStatus": "stable"
        },
        "revenueChart": data['chart_data'],
        "paymentMethods": {
            "cashAndCard": data['payment_cash'],
            "debt": data['payment_debt']
        }
    })