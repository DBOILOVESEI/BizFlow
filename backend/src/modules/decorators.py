from functools import wraps
from flask_jwt_extended import get_jwt, jwt_required
from flask import jsonify

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