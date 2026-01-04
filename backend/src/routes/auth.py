from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from modules.extensions import bcrypt

auth_bp = Blueprint("auth", __name__)

# TEMP
users_db = {
    "admin_user": {
        "password": bcrypt.generate_password_hash("admin123").decode("utf-8"),
        "role": "admin"
    },
    "shop_owner": {
        "password": bcrypt.generate_password_hash("owner123").decode("utf-8"),
        "role": "owner"
    },
    "sales_staff": {
        "password": bcrypt.generate_password_hash("staff123").decode("utf-8"),
        "role": "employee"
    }
}

@auth_bp.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    user = users_db.get(username)

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"msg": "Incorrect username or password"}), 401

    additional_claims = {"role": user["role"]}
    access_token = create_access_token(
        identity=username,
        additional_claims=additional_claims
    )

    return jsonify(access_token=access_token, role=user["role"])