from flask import Blueprint, request, jsonify
from extensions import db
from models.quiz import Quiz, Question, QuizOption
from utils.auth import admin_required

admin_quizzes_bp = Blueprint('admin_quizzes', __name__, url_prefix='/api/admin/quizzes')

@admin_quizzes_bp.route('', methods=['GET'])
@admin_required()
def get_all_quizzes():
    quizzes = Quiz.query.order_by(Quiz.created_at.desc()).all()
    return jsonify([q.to_dict(include_questions=True, include_correct=True) for q in quizzes]), 200

@admin_quizzes_bp.route('', methods=['POST'])
@admin_required()
def create_quiz():
    data = request.get_json() or {}
    title = data.get('title')
    if not title:
        return jsonify({'error': 'Title is required'}), 400

    quiz = Quiz(
        title=title,
        description=data.get('description'),
        course_id=data.get('course_id'),
        lesson_id=data.get('lesson_id'),
        time_limit_minutes=data.get('time_limit_minutes', 15),
        passing_score=data.get('passing_score', 70),
        is_published=data.get('is_published', True)
    )
    db.session.add(quiz)
    db.session.commit()

    # Save Questions if provided
    questions_data = data.get('questions', [])
    for q_idx, q_item in enumerate(questions_data):
        if not q_item.get('question_text'):
            continue
        question = Question(
            quiz_id=quiz.id,
            question_text=q_item['question_text'],
            question_type=q_item.get('question_type', 'multiple_choice'),
            points=q_item.get('points', 10),
            display_order=q_item.get('display_order', q_idx + 1),
            explanation=q_item.get('explanation')
        )
        db.session.add(question)
        db.session.flush()

        options_data = q_item.get('options', [])
        for opt_idx, opt_item in enumerate(options_data):
            if not opt_item.get('option_text'):
                continue
            option = QuizOption(
                question_id=question.id,
                option_text=opt_item['option_text'],
                is_correct=bool(opt_item.get('is_correct', False)),
                display_order=opt_item.get('display_order', opt_idx + 1)
            )
            db.session.add(option)

    db.session.commit()
    return jsonify(quiz.to_dict(include_questions=True, include_correct=True)), 201

@admin_quizzes_bp.route('/<int:quiz_id>', methods=['PUT'])
@admin_required()
def update_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    data = request.get_json() or {}
    for f in ['title', 'description', 'course_id', 'lesson_id', 'time_limit_minutes', 'passing_score', 'is_published']:
        if f in data:
            setattr(quiz, f, data[f])

    if 'questions' in data:
        # Re-sync questions
        Question.query.filter_by(quiz_id=quiz.id).delete()
        for q_idx, q_item in enumerate(data['questions']):
            if not q_item.get('question_text'):
                continue
            question = Question(
                quiz_id=quiz.id,
                question_text=q_item['question_text'],
                question_type=q_item.get('question_type', 'multiple_choice'),
                points=q_item.get('points', 10),
                display_order=q_item.get('display_order', q_idx + 1),
                explanation=q_item.get('explanation')
            )
            db.session.add(question)
            db.session.flush()

            for opt_idx, opt_item in enumerate(q_item.get('options', [])):
                if not opt_item.get('option_text'):
                    continue
                option = QuizOption(
                    question_id=question.id,
                    option_text=opt_item['option_text'],
                    is_correct=bool(opt_item.get('is_correct', False)),
                    display_order=opt_item.get('display_order', opt_idx + 1)
                )
                db.session.add(option)

    db.session.commit()
    return jsonify(quiz.to_dict(include_questions=True, include_correct=True)), 200

@admin_quizzes_bp.route('/<int:quiz_id>', methods=['DELETE'])
@admin_required()
def delete_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    db.session.delete(quiz)
    db.session.commit()
    return jsonify({'message': 'Quiz deleted successfully'}), 200
