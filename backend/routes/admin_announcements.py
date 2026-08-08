import re
from flask import Blueprint, request, jsonify
from datetime import datetime
from extensions import db
from models.announcement import Announcement
from utils.auth import admin_required

admin_announcements_bp = Blueprint('admin_announcements', __name__, url_prefix='/api/admin/announcements')

def generate_slug(text):
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '-', slug)

@admin_announcements_bp.route('', methods=['GET'])
@admin_required()
def get_all_admin_announcements():
    items = Announcement.query.order_by(Announcement.created_at.desc()).all()
    return jsonify([i.to_dict() for i in items]), 200

@admin_announcements_bp.route('', methods=['POST'])
@admin_required()
def create_announcement():
    data = request.get_json() or {}
    title = data.get('title')
    if not title:
        return jsonify({'error': 'Title is required'}), 400

    slug = data.get('slug') or generate_slug(title)
    existing = Announcement.query.filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{Announcement.query.count() + 1}"

    event_date = None
    if data.get('event_date'):
        try:
            event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
        except Exception:
            event_date = None

    item = Announcement(
        title=title,
        slug=slug,
        description=data.get('description'),
        content=data.get('content'),
        image_url=data.get('image_url'),
        event_date=event_date,
        category=data.get('category', 'General'),
        status=data.get('status', 'published'),
        is_featured=data.get('is_featured', False)
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@admin_announcements_bp.route('/<int:item_id>', methods=['PUT'])
@admin_required()
def update_announcement(item_id):
    item = Announcement.query.get(item_id)
    if not item:
        return jsonify({'error': 'Announcement not found'}), 404

    data = request.get_json() or {}
    for f in ['title', 'description', 'content', 'image_url', 'category', 'status', 'is_featured']:
        if f in data:
            setattr(item, f, data[f])

    if 'event_date' in data:
        if data['event_date']:
            try:
                item.event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
            except Exception:
                item.event_date = None
        else:
            item.event_date = None

    if 'title' in data and not data.get('slug'):
        item.slug = generate_slug(data['title'])

    db.session.commit()
    return jsonify(item.to_dict()), 200

@admin_announcements_bp.route('/<int:item_id>', methods=['DELETE'])
@admin_required()
def delete_announcement(item_id):
    item = Announcement.query.get(item_id)
    if not item:
        return jsonify({'error': 'Announcement not found'}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Announcement deleted successfully'}), 200
