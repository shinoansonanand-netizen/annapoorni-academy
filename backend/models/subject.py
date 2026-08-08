from datetime import datetime
from extensions import db

class Subject(db.Model):
    __tablename__ = 'subjects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    slug = db.Column(db.String(120), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    icon = db.Column(db.String(50), default='BookOpen')
    status = db.Column(db.String(20), default='published') # published, draft
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    courses = db.relationship('Course', backref='subject', lazy=True, cascade='all, delete-orphan')
    lessons = db.relationship('Lesson', backref='subject', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'image_url': self.image_url,
            'icon': self.icon,
            'status': self.status,
            'display_order': self.display_order,
            'course_count': len(self.courses) if self.courses else 0,
            'lesson_count': len(self.lessons) if self.lessons else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
