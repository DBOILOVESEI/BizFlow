import jwt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, verify_jwt_in_request
from datetime import datetime, timedelta

# Import các module mở rộng
from modules.extensions import bcrypt
from infrastructure.databases.engine import session

# Import Models
from infrastructure.models.user_model import UserModel
from infrastructure.models.role_model import RoleModel

# Import Repositories (Dùng cho chức năng đăng ký)
from repositories import user_repo
from repositories import role_repo
from repositories import inventory_repo

# --- KHAI BÁO BLUEPRINT (Quan trọng) ---
auth_bp = Blueprint('auth', __name__, url_prefix='/')

# ==========================================
# 1. ĐĂNG NHẬP (LOGIN)
# ==========================================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Lấy thông tin (Chấp nhận cả 'username' và 'user_name')
    username = data.get('username') or data.get('user_name')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    # Tìm User trong Database
    user = session.query(UserModel).filter_by(username=username).first()

    # Kiểm tra mật khẩu (So sánh hash)
    # Lưu ý: Trong DB cột là password_hash
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Lấy tên Role từ bảng RoleModel
    role_name = "EMPLOYEE" # Mặc định
    if hasattr(user, 'role_id') and user.role_id:
        role_record = session.query(RoleModel).filter_by(role_id=user.role_id).first()
        if role_record:
            role_name = role_record.role_name

    # Tạo Token JWT
    token = create_access_token(
        identity=str(user.user_id),
        additional_claims={
            "role": role_name,
            "username": user.username
        },
        expires_delta=timedelta(hours=24)
    )

    # Trả về kết quả
    return jsonify({
        "access_token": token,
        "token_type": "Bearer",
        "user": {
            "id": str(user.user_id),
            "name": user.username,
            "email": user.email,
            "role": role_name
        }
    }), 200

# ==========================================
# 2. ĐĂNG KÝ (SIGNUP)
# ==========================================
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

    # Logic kiểm tra Role
    if role == "OWNER":
        if not data.get("email"):
            return jsonify({"msg": "Email is required for owner"}), 400
        email = data["email"].strip().lower()

    elif role == "EMPLOYEE":
        if not data.get("inviteCode"):
            return jsonify({"msg": "Invite code is required for employee"}), 400

        inviteCode = data["inviteCode"].strip()
        try:
            owner_id = int(inviteCode)
        except ValueError:
             return jsonify({"msg": "Invalid invite code format"}), 400

        existingOwner = user_repo.get_by_id(owner_id)
        if not existingOwner:
            return jsonify({
                "msg": "Owner doesn't exist. Please check your invite code again"
            }), 404
    else:
        return jsonify({"msg": "Invalid role"}), 400

    # Kiểm tra trùng user
    existing_user = user_repo.user_exists(
        username=username,
        email=email if role == "OWNER" else None
    )
    if existing_user:
        return jsonify({"msg": "User already exists"}), 409

    # Lấy role id
    role_id = role_repo.get_role_id_by_name(role)
    if not role_id:
        return jsonify({"msg": "Role doesn't exist"}), 400

    # Tạo user
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

    # Tạo kho hàng cho Owner
    if role == "OWNER":
        inventory_created = inventory_repo.create_inventory(user_created.user_id)
        if not inventory_created:
            return jsonify({"msg": "Failed to create inventory"}), 500

    return jsonify({"msg": "Signup successful"}), 201

# ==========================================
# 3. LẤY THÔNG TIN USER (PROFILE)
# ==========================================
# Quan trọng: Thêm methods=['OPTIONS'] để sửa lỗi 404 trên Frontend
@auth_bp.route("/auth", methods=['GET', 'OPTIONS'])
def get_user_profile():
    # Xử lý Preflight Request của trình duyệt
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    # Xác thực Token thủ công để tránh lỗi decorator
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        claims = get_jwt()
        role = claims.get("role")
    except Exception as e:
        return jsonify({"msg": "Unauthorized", "error": str(e)}), 401

    # Logic lấy thông tin
    auth_header = request.headers.get('Authorization')
    token = None
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header[7:]

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