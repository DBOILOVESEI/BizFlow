from flask import Blueprint, jsonify
from modules.decorators import role_required

#admin_bp = Blueprint("admin", __name__, url_prefix = "/admin")
admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/admin", methods=["GET"])
@role_required("admin")
def admin_dashboard():
    return jsonify(msg="Welcome Admin! You have full access.")

