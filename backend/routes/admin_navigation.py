from flask import Blueprint, request, jsonify
from extensions import db
from models.navigation import NavigationItem
from utils.auth import admin_required

admin_nav_bp = Blueprint('admin_navigation', __name__, url_prefix='/api/admin/navigation')

@admin_nav_bp.route('', methods=['GET'])
@admin_required()
def get_all_navigation_items():
    items = NavigationItem.query.order_by(NavigationItem.display_order.asc()).all()
    return jsonify([i.to_dict() for i in items]), 200

@admin_nav_bp.route('', methods=['POST'])
@admin_required()
def create_navigation_item():
    data = request.get_json() or {}
    if not data.get('label') or not data.get('destination'):
        return jsonify({'error': 'Label and destination are required'}), 400

    item = NavigationItem(
        label=data['label'],
        destination=data['destination'],
        display_order=data.get('display_order', 0),
        is_enabled=data.get('is_enabled', True),
        is_external=data.get('is_external', False),
        location=data.get('location', 'both')
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@admin_nav_bp.route('/<int:item_id>', methods=['PUT'])
@admin_required()
def update_navigation_item(item_id):
    item = NavigationItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Navigation item not found'}), 404

    data = request.get_json() or {}
    for f in ['label', 'destination', 'display_order', 'is_enabled', 'is_external', 'location']:
        if f in data:
            setattr(item, f, data[f])

    db.session.commit()
    return jsonify(item.to_dict()), 200

@admin_nav_bp.route('/<int:item_id>', methods=['DELETE'])
@admin_required()
def delete_navigation_item(item_id):
    item = NavigationItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Navigation item not found'}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Navigation item deleted successfully'}), 200
