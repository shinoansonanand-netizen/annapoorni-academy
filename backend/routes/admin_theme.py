from flask import Blueprint, request, jsonify
from extensions import db
from models.theme import ThemeSetting
from utils.auth import admin_required

admin_theme_bp = Blueprint('admin_theme', __name__, url_prefix='/api/admin/website/theme')

@admin_theme_bp.route('', methods=['PUT'])
@admin_required()
def update_theme():
    data = request.get_json() or {}
    theme = ThemeSetting.query.first()
    if not theme:
        theme = ThemeSetting()
        db.session.add(theme)

    fields = [
        'active_preset', 'primary_color', 'secondary_color', 'accent_color',
        'background_color', 'text_color', 'card_color', 'button_color',
        'header_color', 'footer_color', 'font_heading', 'font_body',
        'font_scale', 'heading_weight', 'body_weight', 'border_radius',
        'shadow_style', 'is_published'
    ]

    for f in fields:
        if f in data:
            setattr(theme, f, data[f])

    db.session.commit()
    return jsonify({'message': 'Theme updated successfully', 'theme': theme.to_dict()}), 200
