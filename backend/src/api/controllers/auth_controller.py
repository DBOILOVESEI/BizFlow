import jwt
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt

from modules.extensions import bcrypt, cors
from modules.decorators import role_required
from datetime import datetime, timedelta
from infrastructure.databases.engine import session

from repositories import user_repo
from repositories import role_repo

auth_bp = Blueprint('auth', __name__, url_prefix='/')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("username") 
    password = data.get("password")

    users = user_repo.user_exists(email)    
    if not users:
        return jsonify({'msg': 'Thông tin xác thực không hợp lệ.'}), 401
    role_id = users.role_id
    role = role_repo.get_role_name_by_id(role_id)

    # SẼ THAY ĐỔI SAU KHI CHỨC NĂNG ĐĂNG KÝ HOẠT ĐỘNG   
    # NHỚ PHẢI PASS ROLE VỀ 
    
    try: 
        if not bcrypt.check_password_hash(users.password_hash, password):
            # wrong pass
            return jsonify({'msg': 'Thông tin xác thực không hợp lệ. (Email hoặc Password không đúng.)'}), 401
        
    except ValueError:
        # hash error
        return jsonify({'msg': 'Server configuration error in password handling'}), 500

    payload = {
        'sub': str(users.user_id),
        'role': role,   # 👈 role name
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=2)
    }

    access_token = create_access_token(
        identity=str(users.user_id),
        additional_claims={
        "role": role
        }
    )
    """
    token = jwt.encode(
        payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    """
    
    # Đảm bảo token luôn là string trước khi gửi đi
    if isinstance(access_token, bytes):
        access_token = access_token.decode('utf-8')
    
    # 4. Trả về token và thông tin user cần thiết
    return jsonify({
        "access_token": access_token,
        "token_type": "Bearer",
        "user": {
            "id": str(users.user_id),
            "name": users.username,
            "email": users.email,
            "role": role   # 👈 QUAN TRỌNG
        }
    }), 200

@auth_bp.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()

    required_fields = ["username", "password", "role"] # email required if user = owner
    if not data or not all(field in data for field in required_fields):
        return jsonify({"msg": "Invalid input"}), 400

    username = data["username"].strip()
    password = data["password"]
    role = data["role"].strip().upper()
    
    email = None
    inviteCode = None
    owner_id = None
    existingOwner = None
    if role == "OWNER":
        if "email" not in data or not data["email"]:
            return jsonify({"msg": "Email is required for owner"}), 400
        email = data["email"].strip().lower()
    elif role == "EMPLOYEE":
        if "inviteCode" not in data or not data["inviteCode"]:
            return jsonify({"msg": "Invite code is required for employee"}), 400
        inviteCode = data["inviteCode"].strip()
        owner_id = int(inviteCode)

        existingOwner = user_repo.get_by_id(owner_id)
        if not existingOwner:
            return jsonify({"msg": "Owner doesn't exist. Please check your invite code again"}), 404
        
    existing_user = user_repo.user_exists(
        username=username,
        email=email if role == "OWNER" else None # send email if user = owner
    )
    if existing_user:
        return jsonify({"msg": "User already exists"}), 409

    role_id = role_repo.get_role_id_by_name(role)
    if not role_id:
        return jsonify({"msg": "Role doesn't exist"}), 400


    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    owner_id = owner_id if role == "EMPLOYEE" else None

    user_created = user_repo.create_user(username, password_hash, email, role_id, owner_id)
    if not user_created:
        return jsonify({"msg": "Database error"}), 500

    return jsonify({"msg": "Signup successful"}), 201

@auth_bp.route("/auth", methods=['GET'])
@role_required("OWNER", "EMPLOYEE")
def get_user_profile():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")

    user = user_repo.get_by_id(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "user_id": str(user.user_id),
        "username": user.username,
        "email": user.email,
        "role_name": role
    }), 200