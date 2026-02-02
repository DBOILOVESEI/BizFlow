from flask import Flask, jsonify
from modules.extensions import bcrypt, jwt, cors
from infrastructure import databases
from api.controllers.dashboard import dashboard_bp

# BLUEPRINTS
from api.controllers.auth_controller import auth_bp
from api.controllers.orders import orders_bp
from api.controllers.staff import employee_bp
from api.controllers.admin import admin_bp
from api.controllers.customer import customer_bp
#from routes import auth_bp
#from routes import admin_bp

from repositories import role_repo
role_repo.create_roles()

app = Flask(__name__)
app.config["SECRET_KEY"] = "super-secret-key"

bcrypt.init_app(app)
jwt.init_app(app)
cors.init_app(app)

# Register blueprints
app.register_blueprint(customer_bp,)
app.register_blueprint(dashboard_bp,)
app.register_blueprint(auth_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(admin_bp)

@app.route("/", methods=["GET"])
def health_check():
    return jsonify(msg="Server is running!")

if __name__ == "__main__":
    app.run(debug=True, port=5000)


"""
# FLASK SERVICES
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# DATABASE
from infrastructure import databases

app = Flask(__name__)
CORS(app)  # Allows Flutter to connect

# --- CONFIGURATION ---
app.config["JWT_SECRET_KEY"] = "super-secret-key-change-this" 
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# --- MOCK DATABASE (Temporary for Task 1.3) ---
# TODO: When merging with Task 1.1, replace this dictionary with SQLAlchemy queries.
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

# --- LOGIN ENDPOINT ---
@app.route('/login', methods=['POST'])
def login():
    # 1. Get data from the App
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # 2. Check if user exists (Mock Check)
    user = users_db.get(username)

    # 3. Verify Password
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"msg": "Incorrect username or password"}), 401

    # 4. Generate JWT Token with Role
    additional_claims = {"role": user["role"]}
    access_token = create_access_token(identity=username, additional_claims=additional_claims)
    
    return jsonify(access_token=access_token, role=user["role"])

# --- SECURITY GATEKEEPER (Middleware) ---
from functools import wraps

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims["role"] != required_role:
                 return jsonify(msg="Access denied: Insufficient permissions"), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

# --- TEST ROUTES (To prove it works) ---
@app.route('/admin/dashboard', methods=['GET'])
@role_required("admin")
def admin_dashboard():
    return jsonify(msg="Welcome Admin! You have full access.")

@app.route('/', methods=['GET'])
def health_check():
    return jsonify(msg="Server is running!")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
"""