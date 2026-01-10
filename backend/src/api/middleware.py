# Middleware functions for processing requests and responses
import jwt
from flask import request, jsonify
from functools import wraps

SECRET_KEY = "passed"  # Khóa bí mật để ký JWT

# Middleware kiểm tra JWT và phân quyền
def jwt_required(required_role=None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing or invalid Authorization header"}), 401

            token = auth_header.split(" ")[1]
            try:
                # Giải mã token
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                user_role = payload.get("role")

                # Nếu có yêu cầu role thì kiểm tra
                if required_role and user_role != required_role:
                    return jsonify({"error": "Forbidden: insufficient permissions"}), 403

            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401

            return func(*args, **kwargs)
        return wrapper
    return decorator

def log_request_info(app):
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())

def handle_options_request():
    return jsonify({'message': 'CORS preflight response'}), 200

def error_handling_middleware(error):
    response = jsonify({'error': str(error)})
    response.status_code = 500
    return response

def add_custom_headers(response):
    response.headers['X-Custom-Header'] = 'Value'
    return response

def middleware(app):
    @app.before_request
    def before_request():
        log_request_info(app)

    @app.after_request
    def after_request(response):
        return add_custom_headers(response)

    @app.errorhandler(Exception)
    def handle_exception(error):
        return error_handling_middleware(error)

    @app.route('/options', methods=['OPTIONS'])
    def options_route():
        return handle_options_request()

    # Route chỉ cho admin
    @app.route('/admin', methods=['GET'])
    @jwt_required(required_role="admin")
    def admin_route():
        return jsonify({"message": "Welcome, admin!"})

    # Route cho mọi user có token hợp lệ
    @app.route('/profile', methods=['GET'])
    @jwt_required()
    def profile_route():
        return jsonify({"message": "This is your profile"})