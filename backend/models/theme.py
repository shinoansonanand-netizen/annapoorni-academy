from datetime import datetime
from extensions import db

class ThemeSetting(db.Model):
    __tablename__ = 'theme_settings'

    id = db.Column(db.Integer, primary_key=True)
    active_preset = db.Column(db.String(50), default='Academic') # Default, Academic, Modern, Minimal, Dark, Custom
    primary_color = db.Column(db.String(20), default='#1E3A8A')   # Deep Blue / Navy
    secondary_color = db.Column(db.String(20), default='#0D9488') # Teal
    accent_color = db.Column(db.String(20), default='#F59E0B')    # Amber / Gold
    background_color = db.Column(db.String(20), default='#F8FAFC')# Slate Light
    text_color = db.Column(db.String(20), default='#0F172A')      # Slate Dark
    card_color = db.Column(db.String(20), default='#FFFFFF')      # White
    button_color = db.Column(db.String(20), default='#1E3A8A')    # Primary Button
    header_color = db.Column(db.String(20), default='#FFFFFF')    # Header Background
    footer_color = db.Column(db.String(20), default='#0F172A')    # Dark Footer
    
    font_heading = db.Column(db.String(100), default='Outfit')
    font_body = db.Column(db.String(100), default='Inter')
    font_scale = db.Column(db.String(20), default='medium')       # small, medium, large
    heading_weight = db.Column(db.String(20), default='700')
    body_weight = db.Column(db.String(20), default='400')
    border_radius = db.Column(db.String(20), default='12px')
    shadow_style = db.Column(db.String(20), default='modern')

    is_published = db.Column(db.Boolean, default=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'active_preset': self.active_preset,
            'primary_color': self.primary_color,
            'secondary_color': self.secondary_color,
            'accent_color': self.accent_color,
            'background_color': self.background_color,
            'text_color': self.text_color,
            'card_color': self.card_color,
            'button_color': self.button_color,
            'header_color': self.header_color,
            'footer_color': self.footer_color,
            'font_heading': self.font_heading,
            'font_body': self.font_body,
            'font_scale': self.font_scale,
            'heading_weight': self.heading_weight,
            'body_weight': self.body_weight,
            'border_radius': self.border_radius,
            'shadow_style': self.shadow_style,
            'is_published': self.is_published,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
