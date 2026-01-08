import jwt
from flask import Blueprint, request, jsonify, current_app
from modules.extensions import bcrypt, cors
from modules.decorators import role_required

from datetime import datetime, timedelta
from infrastructure.databases.engine import session

from repositories import user_repo

orders_bp = Blueprint('orders', __name__, url_prefix='/')

@orders_bp.route('/orders', methods=['POST'])
@role_required("OWNER", "EMPLOYEE")
def orders():
    print("hello")

@orders_bp.route('/inventory', methods=['GET'])
@role_required("OWNER", "EMPLOYEE")
def inventory():
    # fake data
    products_data = [
        {"id": "p1", "name": "Nước Khoáng", "sku": "NK001", "stockLevel": 150, "minStock": 50, "units": [{"name": "Chai", "price": 5000}]},
        # ... thêm các sản phẩm khác ...
    ]
    
    # Chỉnh sửa mã trạng thái thành 200 OK
    return jsonify(
        {
            "msg": "Retrieved products successfully",
            "products_data": products_data
        }
    ), 200

