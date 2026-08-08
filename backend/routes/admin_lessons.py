import re
from flask import Blueprint, request, jsonify
from extensions import db
from models.lesson import CourseModule, Lesson, Resource
from utils.auth import admin_required

admin_lessons_bp = Blueprint('admin_lessons', __name__, url_prefix='/api/admin')

def generate_slug(text):
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '-', slug)

# Modules CRUD
@admin_lessons_bp.route('/modules', methods=['POST'])
@admin_required()
def create_module():
    data = request.get_json() or {}
    if not data.get('course_id') or not data.get('title'):
        return jsonify({'error': 'course_id and title are required'}), 400

    module = CourseModule(
        course_id=data['course_id'],
        title=data['title'],
        description=data.get('description'),
        display_order=data.get('display_order', 0)
    )
    db.session.add(module)
    db.session.commit()
    return jsonify(module.to_dict()), 201

@admin_lessons_bp.route('/modules/<int:module_id>', methods=['PUT'])
@admin_required()
def update_module(module_id):
    module = CourseModule.query.get(module_id)
    if not module:
        return jsonify({'error': 'Module not found'}), 404

    data = request.get_json() or {}
    for f in ['title', 'description', 'display_order']:
        if f in data:
            setattr(module, f, data[f])

    db.session.commit()
    return jsonify(module.to_dict()), 200

@admin_lessons_bp.route('/modules/<int:module_id>', methods=['DELETE'])
@admin_required()
def delete_module(module_id):
    module = CourseModule.query.get(module_id)
    if not module:
        return jsonify({'error': 'Module not found'}), 404

    db.session.delete(module)
    db.session.commit()
    return jsonify({'message': 'Module deleted successfully'}), 200

# Lessons CRUD
@admin_lessons_bp.route('/lessons', methods=['GET'])
@admin_required()
def get_all_lessons():
    lessons = Lesson.query.order_by(Lesson.display_order.asc(), Lesson.created_at.desc()).all()
    return jsonify([l.to_dict(include_details=True) for l in lessons]), 200

@admin_lessons_bp.route('/lessons', methods=['POST'])
@admin_required()
def create_lesson():
    data = request.get_json() or {}
    title = data.get('title')
    course_id = data.get('course_id')

    if not title or not course_id:
        return jsonify({'error': 'Title and course_id are required'}), 400

    slug = data.get('slug') or generate_slug(title)
    existing = Lesson.query.filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{Lesson.query.count() + 1}"

    lesson = Lesson(
        title=title,
        slug=slug,
        course_id=course_id,
        module_id=data.get('module_id'),
        subject_id=data.get('subject_id'),
        description=data.get('description'),
        content=data.get('content'),
        video_url=data.get('video_url'),
        duration=data.get('duration', '15 mins'),
        display_order=data.get('display_order', 0),
        is_published=data.get('is_published', True)
    )
    db.session.add(lesson)
    db.session.commit()

    # Add optional attached resources
    resources_data = data.get('resources', [])
    for r in resources_data:
        if r.get('title') and r.get('file_url'):
            res = Resource(
                lesson_id=lesson.id,
                title=r['title'],
                file_url=r['file_url'],
                resource_type=r.get('resource_type', 'PDF')
            )
            db.session.add(res)
    db.session.commit()

    return jsonify(lesson.to_dict(include_details=True)), 201

@admin_lessons_bp.route('/lessons/<int:lesson_id>', methods=['PUT'])
@admin_required()
def update_lesson(lesson_id):
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({'error': 'Lesson not found'}), 404

    data = request.get_json() or {}
    for f in ['title', 'course_id', 'module_id', 'subject_id', 'description', 'content', 'video_url', 'duration', 'display_order', 'is_published']:
        if f in data:
            setattr(lesson, f, data[f])

    if 'title' in data and not data.get('slug'):
        lesson.slug = generate_slug(data['title'])

    # Update resources if provided
    if 'resources' in data:
        Resource.query.filter_by(lesson_id=lesson.id).delete()
        for r in data['resources']:
            if r.get('title') and r.get('file_url'):
                res = Resource(
                    lesson_id=lesson.id,
                    title=r['title'],
                    file_url=r['file_url'],
                    resource_type=r.get('resource_type', 'PDF')
                )
                db.session.add(res)

    db.session.commit()
    return jsonify(lesson.to_dict(include_details=True)), 200

@admin_lessons_bp.route('/lessons/<int:lesson_id>', methods=['DELETE'])
@admin_required()
def delete_lesson(lesson_id):
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({'error': 'Lesson not found'}), 404

    db.session.delete(lesson)
    db.session.commit()
    return jsonify({'message': 'Lesson deleted successfully'}), 200
