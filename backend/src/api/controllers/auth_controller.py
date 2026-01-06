import jwt
from flask import Blueprint, request, jsonify, current_app
from modules.extensions import bcrypt, jwt, cors
from datetime import datetime, timedelta
from infrastructure.models.user_model import UserModel
from infrastructure.databases.engine import session

auth_bp = Blueprint('auth', __name__, url_prefix='/')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    users = session.query(UserModel).filter_by(
        username=data['username'],
        password=data['password'],
        #role=data['role']
    ).first()
    if not users:
        return jsonify({'msg': 'Invalid credentials'}), 401

    payload =  {'sub': str(users.user_id),
                'role': users.role,
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
        created_by=0 ,
        role="employee"
    )

    try:
        session.add(new_user)
        session.commit()
    except IntegrityError:
        session.rollback()
        return jsonify({"msg": "Database error"}), 500

    return jsonify({"msg": "Signup successful"}), 200