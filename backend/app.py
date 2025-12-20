from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows your Flutter app to talk to this backend

# --- Configuration ---
app.config["JWT_SECRET_KEY"] = "super-secret-key-change-this"  # Change this!
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# --- Mock Database (Replace with real DB later) ---
# This simulates the users from your flowchart
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

# --- 1. The Login Endpoint ---
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = users_db.get(username)

    # Verify user exists and password matches
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"msg": "Bad username or password"}), 401

    # Create Token with the specific ROLE embedded inside
    # We add "role" as an extra claim so the frontend knows what to show
    additional_claims = {"role": user["role"]}
    access_token = create_access_token(identity=username, additional_claims=additional_claims)
    
    return jsonify(access_token=access_token, role=user["role"])

# --- 2. Security Middleware (The Gatekeeper) ---
# We create a custom decorator to check roles easily
from functools import wraps

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims["role"] != required_role:
                 return jsonify(msg="Access denied: You are not authorized."), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

# --- 3. Flowchart Implementation (Protected Routes) ---

# === ADMIN ROUTES (Top Left of Flowchart) ===
@app.route('/admin/dashboard', methods=['GET'])
@role_required("admin")
def admin_dashboard():
    return jsonify(msg="Welcome Admin. Here is System Health & Subscription data.")

# === OWNER ROUTES (Middle of Flowchart) ===
@app.route('/owner/kpi', methods=['GET'])
@role_required("owner")
def owner_kpi():
    return jsonify(msg="Owner Dashboard: Revenue is up 10% this month.")

@app.route('/owner/inventory', methods=['POST'])
@role_required("owner")
def manage_inventory():
    return jsonify(msg="Inventory updated.")

# === EMPLOYEE ROUTES (Right of Flowchart) ===
@app.route('/employee/create-order', methods=['POST'])
@jwt_required() 
def create_order():
    # Employees AND Owners might be able to create orders, so we just check login
    # Or strict check:
    claims = get_jwt()
    if claims["role"] not in ["employee", "owner"]:
        return jsonify(msg="Not authorized"), 403
        
    return jsonify(msg="Order created successfully for Customer.")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
