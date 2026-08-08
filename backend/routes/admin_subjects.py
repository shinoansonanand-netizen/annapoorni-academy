import re
from flask import Blueprint, request, jsonify
from extensions import db
from models.subject import Subject
from utils.auth import admin_required

admin_subjects_bp = Blueprint('admin_subjects', __name__, url_prefix='/api/admin/subjects')

def generate_slug(text):
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '-', slug)

@admin_subjects_bp.route('', methods=['GET'])
@admin_required()
def get_admin_subjects():
    subjects = Subject.query.order_by(Subject.display_order.asc()).all()
    return jsonify([s.to_dict() for s in subjects]), 200

@admin_subjects_bp.route('', methods=['POST'])
@admin_required()
def create_subject():
    data = request.get_json() or {}
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400

    slug = data.get('slug') or generate_slug(name)
    existing = Subject.query.filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{Subject.query.count() + 1}"

    subject = Subject(
        name=name,
        slug=slug,
        description=data.get('description'),
        image_url=data.get('image_url'),
        icon=data.get('icon', 'BookOpen'),
        status=data.get('status', 'published'),
        display_order=data.get('display_order', 0)
    )
    db.session.add(subject)
    db.session.commit()
    return jsonify(subject.to_dict()), 201

@admin_subjects_bp.route('/<int:subject_id>', methods=['PUT'])
@admin_required()
def update_subject(subject_id):
    subject = Subject.query.get(subject_id)
    if not subject:
        return jsonify({'error': 'Subject not found'}), 404

    data = request.get_json() or {}
    for f in ['name', 'description', 'image_url', 'icon', 'status', 'display_order']:
        if f in data:
            setattr(subject, f, data[f])

    if 'name' in data and not data.get('slug'):
        subject.slug = generate_slug(data['name'])

    db.session.commit()
    return jsonify(subject.to_dict()), 200

@admin_subjects_bp.route('/<int:subject_id>', methods=['DELETE'])
@admin_required()
def delete_subject(subject_id):
    subject = Subject.query.get(subject_id)
    if not subject:
        return jsonify({'error': 'Subject not found'}), 404

    db.session.delete(subject)
    db.session.commit()
    return jsonify({'message': 'Subject deleted successfully'}), 200
