import jwt
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
from infrastructure.models.user_model import UserModel
from infrastructure.databases.engine import session

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    users = session.query(UserModel).filter_by(
        user_name=data['user_name'],
        password=data['password_hash'],
        role=data['role']
    ).first()
    if not users:
        return jsonify({'error': 'Invalid credentials'}), 401

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