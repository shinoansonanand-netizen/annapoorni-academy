from datetime import datetime
from extensions import db

class SocialLink(db.Model):
    __tablename__ = 'social_links'

    id = db.Column(db.Integer, primary_key=True)
    platform = db.Column(db.String(50), nullable=False) # Instagram, Facebook, YouTube, LinkedIn, X, WhatsApp, Telegram, etc.
    url = db.Column(db.String(500), nullable=False)
    icon = db.Column(db.String(50), nullable=True) # lucide icon name or brand slug
    display_order = db.Column(db.Integer, default=0)
    is_enabled = db.Column(db.Boolean, default=True)
    
    show_in_header = db.Column(db.Boolean, default=True)
    show_in_footer = db.Column(db.Boolean, default=True)
    show_in_contact = db.Column(db.Boolean, default=True)
    show_in_homepage = db.Column(db.Boolean, default=True)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'platform': self.platform,
            'url': self.url,
            'icon': self.icon,
            'display_order': self.display_order,
            'is_enabled': self.is_enabled,
            'show_in_header': self.show_in_header,
            'show_in_footer': self.show_in_footer,
            'show_in_contact': self.show_in_contact,
            'show_in_homepage': self.show_in_homepage,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
