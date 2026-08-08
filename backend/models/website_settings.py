from datetime import datetime
from extensions import db

class WebsiteSetting(db.Model):
    __tablename__ = 'website_settings'

    id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(150), nullable=False, default='Annapoorni Academy')
    logo_url = db.Column(db.String(500), nullable=True)
    favicon_url = db.Column(db.String(500), nullable=True)
    site_description = db.Column(db.Text, nullable=True)
    tagline = db.Column(db.String(255), nullable=True, default='Empowering Minds, Shaping Futures')
    dark_mode_default = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'site_name': self.site_name,
            'logo_url': self.logo_url,
            'favicon_url': self.favicon_url,
            'site_description': self.site_description,
            'tagline': self.tagline,
            'dark_mode_default': self.dark_mode_default,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
