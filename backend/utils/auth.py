from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models.admin import Admin

def admin_required():
    """Custom decorator enforcing valid JWT token belonging to an active Admin user."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                identity = get_jwt_identity()
                admin = Admin.query.get(identity)
                if not admin:
                    return jsonify({'error': 'Unauthorized admin access'}), 403
            except Exception as e:
                return jsonify({'error': 'Invalid or expired token', 'details': str(e)}), 401
            return fn(*args, **kwargs)
        return wrapper
    return decorator
