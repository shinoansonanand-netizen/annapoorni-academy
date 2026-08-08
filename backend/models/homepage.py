from datetime import datetime
import json
from extensions import db

class HomepageSection(db.Model):
    __tablename__ = 'homepage_sections'

    id = db.Column(db.Integer, primary_key=True)
    section_key = db.Column(db.String(50), unique=True, nullable=False) # hero, about, featured_courses, benefits, testimonials, announcements, cta, footer
    section_name = db.Column(db.String(100), nullable=False)
    is_enabled = db.Column(db.Boolean, default=True)
    display_order = db.Column(db.Integer, default=0)
    
    title = db.Column(db.String(255), nullable=True)
    subtitle = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    background_style = db.Column(db.String(50), default='default')
    
    cta_text = db.Column(db.String(100), nullable=True)
    cta_url = db.Column(db.String(255), nullable=True)
    secondary_cta_text = db.Column(db.String(100), nullable=True)
    secondary_cta_url = db.Column(db.String(255), nullable=True)

    # JSON stored string for cards/stats/testimonials lists
    meta_json = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def get_meta(self):
        if not self.meta_json:
            return []
        try:
            return json.loads(self.meta_json)
        except Exception:
            return []

    def set_meta(self, data):
        self.meta_json = json.dumps(data)

    def to_dict(self):
        return {
            'id': self.id,
            'section_key': self.section_key,
            'section_name': self.section_name,
            'is_enabled': self.is_enabled,
            'display_order': self.display_order,
            'title': self.title,
            'subtitle': self.subtitle,
            'content': self.content,
            'image_url': self.image_url,
            'background_style': self.background_style,
            'cta_text': self.cta_text,
            'cta_url': self.cta_url,
            'secondary_cta_text': self.secondary_cta_text,
            'secondary_cta_url': self.secondary_cta_url,
            'meta': self.get_meta(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
