from flask import Blueprint, request, jsonify
from extensions import db
from models.website_settings import WebsiteSetting
from utils.auth import admin_required

admin_settings_bp = Blueprint('admin_settings', __name__, url_prefix='/api/admin/website/settings')

@admin_settings_bp.route('', methods=['PUT'])
@admin_required()
def update_website_settings():
    data = request.get_json() or {}
    setting = WebsiteSetting.query.first()
    if not setting:
        setting = WebsiteSetting()
        db.session.add(setting)

    if 'site_name' in data:
        setting.site_name = data['site_name']
    if 'logo_url' in data:
        setting.logo_url = data['logo_url']
    if 'favicon_url' in data:
        setting.favicon_url = data['favicon_url']
    if 'site_description' in data:
        setting.site_description = data['site_description']
    if 'tagline' in data:
        setting.tagline = data['tagline']
    if 'dark_mode_default' in data:
        setting.dark_mode_default = bool(data['dark_mode_default'])

    db.session.commit()
    return jsonify({'message': 'Website settings updated successfully', 'settings': setting.to_dict()}), 200
