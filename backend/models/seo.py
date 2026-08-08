from datetime import datetime
from extensions import db

class SeoSetting(db.Model):
    __tablename__ = 'seo_settings'

    id = db.Column(db.Integer, primary_key=True)
    site_title = db.Column(db.String(255), default='Annapoorni Academy — Premier Educational Platform')
    meta_description = db.Column(db.Text, default='Discover structured courses, subjects, lessons, and interactive assessments at Annapoorni Academy.')
    keywords = db.Column(db.Text, default='education, online courses, learning platform, academy, lessons, quizzes, annapoorni')
    og_title = db.Column(db.String(255), default='Annapoorni Academy — Learn Better. Grow Smarter.')
    og_description = db.Column(db.Text, default='Empowering students with modern structured learning resources and interactive assessments.')
    og_image = db.Column(db.String(500), nullable=True)
    favicon_url = db.Column(db.String(500), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'site_title': self.site_title,
            'meta_description': self.meta_description,
            'keywords': self.keywords,
            'og_title': self.og_title,
            'og_description': self.og_description,
            'og_image': self.og_image,
            'favicon_url': self.favicon_url,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
