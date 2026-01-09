import jwt
from flask import Blueprint, request, jsonify, current_app
from modules.extensions import bcrypt, cors
from modules.decorators import role_required

from datetime import datetime, timedelta
from infrastructure.databases.engine import session

from repositories import user_repo

auth_bp = Blueprint('auth', __name__, url_prefix='/')

@auth_bp.route('/dashboard', methods=['POST'])
@role_required("OWNER")
def dashboard():
    print("hello dashbard")
