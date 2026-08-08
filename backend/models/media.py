from datetime import datetime
from extensions import db

class Media(db.Model):
    __tablename__ = 'media'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    mime_type = db.Column(db.String(100), nullable=False)
    file_size = db.Column(db.Integer, default=0) # size in bytes
    alt_text = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(50), default='general') # logo, course, hero, lesson, avatar
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_name': self.original_name,
            'file_url': self.file_url,
            'mime_type': self.mime_type,
            'file_size': self.file_size,
            'alt_text': self.alt_text,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
