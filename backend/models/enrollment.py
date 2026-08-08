from datetime import datetime
from extensions import db

class Enrollment(db.Model):
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    course_title = db.Column(db.String(255), nullable=False)
    student_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    preferred_mode = db.Column(db.String(50), default='Live Online via Zoom') # Live Online via Zoom / In-Person Offline
    message = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='new') # new, contacted, enrolled, archived
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    course = db.relationship('Course', backref=db.backref('enrollments', lazy=True, cascade='all, delete-orphan'))

    def to_dict(self):
        return {
            'id': self.id,
            'course_id': self.course_id,
            'course_title': self.course_title,
            'student_name': self.student_name,
            'email': self.email,
            'phone': self.phone,
            'preferred_mode': self.preferred_mode,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
