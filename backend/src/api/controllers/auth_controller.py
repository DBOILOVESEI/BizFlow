import jwt
from flask import Blueprint, request, jsonify, current_app
from modules.extensions import bcrypt, cors
from datetime import datetime, timedelta
from infrastructure.models.user_model import UserModel
from infrastructure.databases.engine import session

from repositories import user_repo

auth_bp = Blueprint('auth', __name__, url_prefix='/')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("username") 
    password = data.get("password")

    users = user_repo.user_exists(email)    
    if not users:
        return jsonify({'msg': 'Thông tin xác thực không hợp lệ.'}), 401

    # SẼ THAY ĐỔI SAU KHI CHỨC NĂNG ĐĂNG KÝ HOẠT ĐỘNG   
    # NHỚ PHẢI PASS ROLE VỀ 
    """
    try:
        
        if not bcrypt.check_password_hash(users.password_hash, password):
            # wrong pass
            return jsonify({'msg': 'Thông tin xác thực không hợp lệ. (Email hoặc Password không đúng.)'}), 401
        
    except ValueError:
        # hash error
        return jsonify({'msg': 'Server configuration error in password handling'}), 500
    """
    if users.password_hash != password:
        return jsonify({'msg': 'Thông tin xác thực không hợp lệ. (Email hoặc Password không đúng.)'}), 401
    print("gay nigger1")
    payload =  {
        'sub': str(users.user_id),
        #'role': users.role,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=2)
    }

    token = jwt.encode(
        payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    
    # Đảm bảo token luôn là string trước khi gửi đi
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    
    # 4. Trả về token và thông tin user cần thiết
    print("gay nigger")
    return jsonify({
        "access_token": token,
        "token_type": "Bearer",
        # Có thể trả về thêm thông tin user cơ bản:
        "user": {
            "id": str(users.user_id),
            "name": users.username,
            "email": users.email,
            #"role": users.role,
        }
    }), 200
    """
    payload =  {'sub': str(users.user_id),
                #'role': users.role or "Employee",
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(hours=2)}

    token = jwt.encode(
        payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    if isinstance(token, bytes):
        token = token.decode('utf-8')
        return jsonify({'access_token': token,'token_type': 'Bearer'})

    return jsonify({
        "access_token": token,
        "token_type": "Bearer",
    }), 200
    """

@auth_bp.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()

    required_fields = ["username", "password", "email"]
    if not data or not all(field in data for field in required_fields):
        return jsonify({"msg": "Invalid input"}), 400

    username = data["username"].strip()
    password = data["password"]
    email = data["email"].strip().lower()

    existing_user = session.query(UserModel).filter(
        (UserModel.email == email)
    ).first()

    if existing_user:
        return jsonify({"msg": "User already exists"}), 409

    password_hash = bcrypt.generate_password_hash(password)

    new_user = UserModel(
        username=username,
        password_hash=password_hash,
        email=email,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        created_by=0
    )

    try:
        session.add(new_user)
        session.commit()
    except IntegrityError:
        session.rollback()
        return jsonify({"msg": "Database error"}), 500

    return jsonify({"msg": "Signup successful"}), 200