from datetime import datetime
from extensions import db

class CourseModule(db.Model):
    __tablename__ = 'course_modules'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    display_order = db.Column(db.Integer, default=0)

    lessons = db.relationship('Lesson', backref='module', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_lessons=False):
        data = {
            'id': self.id,
            'course_id': self.course_id,
            'title': self.title,
            'description': self.description,
            'display_order': self.display_order,
            'lesson_count': len(self.lessons) if self.lessons else 0
        }
        if include_lessons:
            data['lessons'] = [l.to_dict() for l in sorted(self.lessons, key=lambda x: x.display_order)]
        return data


class Lesson(db.Model):
    __tablename__ = 'lessons'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('course_modules.id', ondelete='SET NULL'), nullable=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id', ondelete='SET NULL'), nullable=True)
    
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=True) # Markdown formatted lesson content
    video_url = db.Column(db.String(500), nullable=True)
    duration = db.Column(db.String(50), default='15 mins')
    display_order = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    resources = db.relationship('Resource', backref='lesson', lazy=True, cascade='all, delete-orphan')
    quizzes = db.relationship('Quiz', backref='lesson', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_details=False):
        data = {
            'id': self.id,
            'course_id': self.course_id,
            'course_title': self.course.title if self.course else None,
            'module_id': self.module_id,
            'module_title': self.module.title if self.module else None,
            'subject_id': self.subject_id,
            'title': self.title,
            'slug': self.slug,
            'description': self.description,
            'content': self.content,
            'video_url': self.video_url,
            'duration': self.duration,
            'display_order': self.display_order,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        if include_details:
            data['resources'] = [r.to_dict() for r in self.resources]
            data['quizzes'] = [q.to_dict() for q in self.quizzes if q.is_published]
        return data


class Resource(db.Model):
    __tablename__ = 'resources'

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    resource_type = db.Column(db.String(50), default='PDF') # PDF, Document, Link, Code

    def to_dict(self):
        return {
            'id': self.id,
            'lesson_id': self.lesson_id,
            'title': self.title,
            'file_url': self.file_url,
            'resource_type': self.resource_type
        }
