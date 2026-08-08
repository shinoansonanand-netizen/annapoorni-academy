import os
from flask import Blueprint, request, jsonify
from extensions import db
from models.media import Media
from services.media_service import save_media_file
from utils.auth import admin_required

admin_media_bp = Blueprint('admin_media', __name__, url_prefix='/api/admin/media')

@admin_media_bp.route('', methods=['GET'])
@admin_required()
def get_media_library():
    category = request.args.get('category')
    query = Media.query
    if category:
        query = query.filter_by(category=category)
    media_list = query.order_by(Media.created_at.desc()).all()
    return jsonify([m.to_dict() for m in media_list]), 200

@admin_media_bp.route('/upload', methods=['POST'])
@admin_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file field in request'}), 400

    file = request.files['file']
    category = request.form.get('category', 'general')
    alt_text = request.form.get('alt_text')

    try:
        media_dict = save_media_file(file, category=category, alt_text=alt_text)
        return jsonify(media_dict), 201
    except ValueError as val_err:
        return jsonify({'error': str(val_err)}), 400
    except Exception as err:
        return jsonify({'error': 'File upload failed', 'details': str(err)}), 500

@admin_media_bp.route('/<int:media_id>', methods=['DELETE'])
@admin_required()
def delete_media(media_id):
    media = Media.query.get(media_id)
    if not media:
        return jsonify({'error': 'Media item not found'}), 404

    try:
        if os.path.exists(media.file_path):
            os.remove(media.file_path)
    except Exception:
        pass

    db.session.delete(media)
    db.session.commit()
    return jsonify({'message': 'Media item deleted successfully'}), 200
