from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt
from repositories.user_repo import get_employees_by_owner_id
from modules.decorators import role_required
# API cho page /staff
employee_bp = Blueprint(
    "employee",
    __name__,
    url_prefix="/"
)

@employee_bp.route("/staff", methods=["GET"])
@role_required("OWNER")
def get_staff():
    # jwt để tạo token
    # jwt xử lý token
    # khi nhận request thì jwt sẽ biết là ai từ token

    
    owner_id = get_jwt_identity()
    employees = get_employees_by_owner_id(owner_id)

    return jsonify([
        {
            "id": e.user_id,
            "username": e.username,
            "status": "active" if e.is_active else "inactive",
            "joinedDate": e.created_at
        }
        for e in employees
    ])