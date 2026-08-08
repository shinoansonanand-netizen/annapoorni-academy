from flask import Blueprint, request, jsonify
from extensions import db
from models.seo import SeoSetting
from utils.auth import admin_required

admin_seo_bp = Blueprint('admin_seo', __name__, url_prefix='/api/admin/seo')

@admin_seo_bp.route('', methods=['PUT'])
@admin_required()
def update_seo_settings():
    data = request.get_json() or {}
    seo = SeoSetting.query.first()
    if not seo:
        seo = SeoSetting()
        db.session.add(seo)

    for f in ['site_title', 'meta_description', 'keywords', 'og_title', 'og_description', 'og_image', 'favicon_url']:
        if f in data:
            setattr(seo, f, data[f])

    db.session.commit()
    return jsonify({'message': 'SEO settings updated successfully', 'seo': seo.to_dict()}), 200
