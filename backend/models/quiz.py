from datetime import datetime
from extensions import db

class Quiz(db.Model):
    __tablename__ = 'quizzes'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='SET NULL'), nullable=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id', ondelete='SET NULL'), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    time_limit_minutes = db.Column(db.Integer, default=15)
    passing_score = db.Column(db.Integer, default=70) # percentage
    is_published = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    questions = db.relationship('Question', backref='quiz', lazy=True, cascade='all, delete-orphan')
    attempts = db.relationship('QuizAttempt', backref='quiz', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_questions=False, include_correct=False):
        data = {
            'id': self.id,
            'course_id': self.course_id,
            'course_title': self.course.title if self.course else None,
            'lesson_id': self.lesson_id,
            'lesson_title': self.lesson.title if self.lesson else None,
            'title': self.title,
            'description': self.description,
            'time_limit_minutes': self.time_limit_minutes,
            'passing_score': self.passing_score,
            'is_published': self.is_published,
            'question_count': len(self.questions) if self.questions else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        if include_questions:
            data['questions'] = [q.to_dict(include_correct=include_correct) for q in sorted(self.questions, key=lambda x: x.display_order)]
        return data


class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id', ondelete='CASCADE'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), default='multiple_choice') # single_choice, multiple_choice, true_false
    points = db.Column(db.Integer, default=10)
    display_order = db.Column(db.Integer, default=0)
    explanation = db.Column(db.Text, nullable=True)

    options = db.relationship('QuizOption', backref='question', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_correct=False):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'question_text': self.question_text,
            'question_type': self.question_type,
            'points': self.points,
            'display_order': self.display_order,
            'explanation': self.explanation,
            'options': [opt.to_dict(include_correct=include_correct) for opt in sorted(self.options, key=lambda x: x.display_order)]
        }


class QuizOption(db.Model):
    __tablename__ = 'quiz_options'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id', ondelete='CASCADE'), nullable=False)
    option_text = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self, include_correct=False):
        data = {
            'id': self.id,
            'question_id': self.question_id,
            'option_text': self.option_text,
            'display_order': self.display_order
        }
        if include_correct:
            data['is_correct'] = self.is_correct
        return data


class QuizAttempt(db.Model):
    __tablename__ = 'quiz_attempts'

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id', ondelete='CASCADE'), nullable=False)
    user_identifier = db.Column(db.String(100), default='Guest Student')
    score = db.Column(db.Integer, default=0)
    max_score = db.Column(db.Integer, default=0)
    percentage = db.Column(db.Float, default=0.0)
    is_passed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    answers = db.relationship('QuizAnswer', backref='attempt', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'user_identifier': self.user_identifier,
            'score': self.score,
            'max_score': self.max_score,
            'percentage': self.percentage,
            'is_passed': self.is_passed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class QuizAnswer(db.Model):
    __tablename__ = 'quiz_answers'

    id = db.Column(db.Integer, primary_key=True)
    attempt_id = db.Column(db.Integer, db.ForeignKey('quiz_attempts.id', ondelete='CASCADE'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id', ondelete='CASCADE'), nullable=False)
    selected_option_id = db.Column(db.Integer, nullable=True)
    is_correct = db.Column(db.Boolean, default=False)
