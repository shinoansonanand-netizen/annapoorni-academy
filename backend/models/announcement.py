from datetime import datetime
from extensions import db

class Announcement(db.Model):
    __tablename__ = 'announcements'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    event_date = db.Column(db.DateTime, nullable=True)
    category = db.Column(db.String(50), default='General') # General, Event, Exam, Workshop, Admission
    status = db.Column(db.String(20), default='published') # published, draft
    is_featured = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'description': self.description,
            'content': self.content,
            'image_url': self.image_url,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'category': self.category,
            'status': self.status,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
