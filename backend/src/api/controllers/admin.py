import jwt
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt
from modules.decorators import role_required

from repositories import user_repo

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route("/owners", methods=['GET'])
@role_required("ADMIN")
def admin_owners():
    print("skibidi sigma balls")
    try:
        owners = user_repo.get_owners()
        output = []

        """
        type Owner = {
            id: string;
            username: string;
            email: string;
            phone: string;
            plan: string;
            joined: string;
        }
        """
        for owner in owners:
            output.append({
                "id": owner.user_id,
                "username": owner.username,
                "email": owner.email,
                "phone": owner.phone,
                "plan": "Premium",
                "joined": owner.created_at.strftime("%Y-%m-%d") if owner.created_at else "N/A",
            })
        return jsonify({"owners": output}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500