import jwt
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt

from modules.extensions import bcrypt, cors
from modules.decorators import role_required
from datetime import datetime, timedelta
from infrastructure.databases.engine import session

from repositories import user_repo
from repositories import role_repo
from repositories import inventory_repo

auth_bp = Blueprint('auth', __name__, url_prefix='/')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
<<<<<<< HEAD
    user = session.query(UserModel).filter_by(
        user_name=data['user_name'],
        password=data['password_hash'],
        role=data['role']
    ).first()
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    payload =  {'sub': str(user.user_id),
               'role': user.role,
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(hours=2)}
=======
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
>>>>>>> f39ae2140416c6d2bf1de88a8fbba34eb5b56f16

    token = create_access_token(
        identity=str(users.user_id),
        additional_claims={
        "role": role
        }
    )

    # Đảm bảo token luôn là string trước khi gửi đi
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    
    # 4. Trả về token và thông tin user cần thiết
    return jsonify({
        "access_token": token,
        "token_type": "Bearer",
        "user": {
            "id": str(users.user_id),
            "name": users.username,
            "email": users.email,
            "role": role,
            "token": token
        }
    }), 200

@auth_bp.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()

    required_fields = ["username", "password", "role"]
    if not data or not all(field in data for field in required_fields):
        return jsonify({"msg": "Invalid input"}), 400

    username = data["username"].strip()
    password = data["password"]
    role = data["role"].strip().upper()

    email = None
    inviteCode = None
    owner_id = None

    # check role
    if role == "OWNER":
        if not data.get("email"):
            return jsonify({"msg": "Email is required for owner"}), 400
        email = data["email"].strip().lower()

    elif role == "EMPLOYEE":
        if not data.get("inviteCode"):
            return jsonify({"msg": "Invite code is required for employee"}), 400

        inviteCode = data["inviteCode"].strip()
        owner_id = int(inviteCode)

        existingOwner = user_repo.get_by_id(owner_id)
        if not existingOwner:
            return jsonify({
                "msg": "Owner doesn't exist. Please check your invite code again"
            }), 404
    else:
        return jsonify({"msg": "Invalid role"}), 400

    # check dupe user
    existing_user = user_repo.user_exists(
        username=username,
        email=email if role == "OWNER" else None
    )
    if existing_user:
        return jsonify({"msg": "User already exists"}), 409

    # role id
    role_id = role_repo.get_role_id_by_name(role)
    if not role_id:
        return jsonify({"msg": "Role doesn't exist"}), 400

    # create user
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    user_created = user_repo.create_user(
        username, 
        password_hash, 
        email, 
        role_id,
        owner_id if role == "EMPLOYEE" else None
    )

    if not user_created:
        return jsonify({"msg": "Database error"}), 500

    # create inventory for owner
    if role == "OWNER":
        inventory_created = inventory_repo.create_inventory(user_created.user_id)
        if not inventory_created:
            return jsonify({"msg": "Failed to create inventory"}), 500

    return jsonify({"msg": "Signup successful"}), 201


@auth_bp.route("/auth", methods=['GET'])
@role_required("OWNER", "EMPLOYEE", "ADMIN")
def get_user_profile():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")

    auth_header = request.headers.get('Authorization')

    token = None

    # 3. Trích xuất token từ header
    if auth_header and auth_header.startswith('Bearer '):
        # format lấy token thôi
        token = auth_header[7:] # 👈 Đây là chuỗi token JWT gốc

    # thêm sanity check 
    user = user_repo.get_by_id(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "user_id": str(user.user_id),
        "username": user.username,
        "email": user.email,
        "role_name": role,
        "token": token,
    }), 200