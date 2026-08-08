from datetime import datetime
from extensions import db

class NavigationItem(db.Model):
    __tablename__ = 'navigation_items'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    display_order = db.Column(db.Integer, default=0)
    is_enabled = db.Column(db.Boolean, default=True)
    is_external = db.Column(db.Boolean, default=False)
    location = db.Column(db.String(20), default='header') # header, footer, both
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'label': self.label,
            'destination': self.destination,
            'display_order': self.display_order,
            'is_enabled': self.is_enabled,
            'is_external': self.is_external,
            'location': self.location,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
