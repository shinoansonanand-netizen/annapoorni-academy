from flask import Blueprint, request, jsonify
import json
from extensions import db
from models.homepage import HomepageSection
from utils.auth import admin_required

admin_homepage_bp = Blueprint('admin_homepage', __name__, url_prefix='/api/admin/homepage')

@admin_homepage_bp.route('', methods=['GET'])
@admin_required()
def get_all_homepage_sections():
    sections = HomepageSection.query.order_by(HomepageSection.display_order.asc()).all()
    return jsonify([s.to_dict() for s in sections]), 200

@admin_homepage_bp.route('', methods=['PUT'])
@admin_required()
def update_homepage_sections():
    data = request.get_json() or {}
    sections_data = data.get('sections', [])

    for s_data in sections_data:
        sec_id = s_data.get('id')
        sec_key = s_data.get('section_key')
        
        section = None
        if sec_id:
            section = HomepageSection.query.get(sec_id)
        elif sec_key:
            section = HomepageSection.query.filter_by(section_key=sec_key).first()

        if section:
            if 'is_enabled' in s_data:
                section.is_enabled = bool(s_data['is_enabled'])
            if 'display_order' in s_data:
                section.display_order = int(s_data['display_order'])
            if 'title' in s_data:
                section.title = s_data['title']
            if 'subtitle' in s_data:
                section.subtitle = s_data['subtitle']
            if 'content' in s_data:
                section.content = s_data['content']
            if 'image_url' in s_data:
                section.image_url = s_data['image_url']
            if 'background_style' in s_data:
                section.background_style = s_data['background_style']
            if 'cta_text' in s_data:
                section.cta_text = s_data['cta_text']
            if 'cta_url' in s_data:
                section.cta_url = s_data['cta_url']
            if 'secondary_cta_text' in s_data:
                section.secondary_cta_text = s_data['secondary_cta_text']
            if 'secondary_cta_url' in s_data:
                section.secondary_cta_url = s_data['secondary_cta_url']
            if 'meta' in s_data:
                section.set_meta(s_data['meta'])

    db.session.commit()
    updated = HomepageSection.query.order_by(HomepageSection.display_order.asc()).all()
    return jsonify({'message': 'Homepage updated successfully', 'sections': [s.to_dict() for s in updated]}), 200
