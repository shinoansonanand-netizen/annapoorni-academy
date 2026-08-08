import re
from flask import Blueprint, request, jsonify
from extensions import db
from models.course import Course
from utils.auth import admin_required

admin_courses_bp = Blueprint('admin_courses', __name__, url_prefix='/api/admin/courses')

def generate_slug(text):
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '-', slug)

@admin_courses_bp.route('', methods=['GET'])
@admin_required()
def get_admin_courses():
    courses = Course.query.order_by(Course.display_order.asc(), Course.created_at.desc()).all()
    return jsonify([c.to_dict(include_details=True) for c in courses]), 200

@admin_courses_bp.route('', methods=['POST'])
@admin_required()
def create_course():
    data = request.get_json() or {}
    title = data.get('title')
    if not title:
        return jsonify({'error': 'Title is required'}), 400

    slug = data.get('slug') or generate_slug(title)
    existing = Course.query.filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{Course.query.count() + 1}"

    course = Course(
        title=title,
        slug=slug,
        description=data.get('description'),
        thumbnail_url=data.get('thumbnail_url'),
        category=data.get('category', 'General'),
        subject_id=data.get('subject_id'),
        difficulty=data.get('difficulty', 'Beginner'),
        duration=data.get('duration', '4 Weeks'),
        status=data.get('status', 'published'),
        is_featured=data.get('is_featured', False),
        display_order=data.get('display_order', 0)
    )
    db.session.add(course)
    db.session.commit()
    return jsonify(course.to_dict(include_details=True)), 201

@admin_courses_bp.route('/<int:course_id>', methods=['PUT'])
@admin_required()
def update_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    data = request.get_json() or {}
    for f in ['title', 'description', 'thumbnail_url', 'category', 'subject_id', 'difficulty', 'duration', 'status', 'is_featured', 'display_order']:
        if f in data:
            setattr(course, f, data[f])

    if 'title' in data and not data.get('slug'):
        course.slug = generate_slug(data['title'])

    db.session.commit()
    return jsonify(course.to_dict(include_details=True)), 200

@admin_courses_bp.route('/<int:course_id>', methods=['DELETE'])
@admin_required()
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    db.session.delete(course)
    db.session.commit()
    return jsonify({'message': 'Course deleted successfully'}), 200
