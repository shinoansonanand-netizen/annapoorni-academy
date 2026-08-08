from flask import Blueprint, request, jsonify
from extensions import db
from models.social import SocialLink
from utils.auth import admin_required

admin_social_bp = Blueprint('admin_social', __name__, url_prefix='/api/admin/social-links')

@admin_social_bp.route('', methods=['GET'])
@admin_required()
def get_all_social_links():
    links = SocialLink.query.order_by(SocialLink.display_order.asc()).all()
    return jsonify([l.to_dict() for l in links]), 200

@admin_social_bp.route('', methods=['POST'])
@admin_required()
def create_social_link():
    data = request.get_json() or {}
    if not data.get('platform') or not data.get('url'):
        return jsonify({'error': 'Platform name and URL are required'}), 400

    link = SocialLink(
        platform=data['platform'],
        url=data['url'],
        icon=data.get('icon', data['platform']),
        display_order=data.get('display_order', 0),
        is_enabled=data.get('is_enabled', True),
        show_in_header=data.get('show_in_header', True),
        show_in_footer=data.get('show_in_footer', True),
        show_in_contact=data.get('show_in_contact', True),
        show_in_homepage=data.get('show_in_homepage', True)
    )
    db.session.add(link)
    db.session.commit()
    return jsonify(link.to_dict()), 201

@admin_social_bp.route('/<int:link_id>', methods=['PUT'])
@admin_required()
def update_social_link(link_id):
    link = SocialLink.query.get(link_id)
    if not link:
        return jsonify({'error': 'Social link not found'}), 404

    data = request.get_json() or {}
    for f in ['platform', 'url', 'icon', 'display_order', 'is_enabled', 'show_in_header', 'show_in_footer', 'show_in_contact', 'show_in_homepage']:
        if f in data:
            setattr(link, f, data[f])

    db.session.commit()
    return jsonify(link.to_dict()), 200

@admin_social_bp.route('/<int:link_id>', methods=['DELETE'])
@admin_required()
def delete_social_link(link_id):
    link = SocialLink.query.get(link_id)
    if not link:
        return jsonify({'error': 'Social link not found'}), 404

    db.session.delete(link)
    db.session.commit()
    return jsonify({'message': 'Social link deleted successfully'}), 200
