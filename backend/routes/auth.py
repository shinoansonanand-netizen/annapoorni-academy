from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from models.admin import Admin
from utils.auth import admin_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/admin')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username_or_email = data.get('username') or data.get('email')
    password = data.get('password')

    if not username_or_email or not password:
        return jsonify({'error': 'Username/email and password are required'}), 400

    admin = Admin.query.filter(
        (Admin.username == username_or_email) | (Admin.email == username_or_email)
    ).first()

    if not admin or not admin.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=admin.id)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'admin': admin.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@admin_required()
def me():
    identity = get_jwt_identity()
    admin = Admin.query.get(identity)
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404
    return jsonify(admin.to_dict()), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200
