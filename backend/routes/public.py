from flask import Blueprint, jsonify, request
from datetime import datetime
from extensions import db
from models.website_settings import WebsiteSetting
from models.theme import ThemeSetting
from models.homepage import HomepageSection
from models.navigation import NavigationItem
from models.social import SocialLink
from models.contact import ContactSetting
from models.seo import SeoSetting
from models.course import Course
from models.subject import Subject
from models.lesson import Lesson
from models.quiz import Quiz, QuizAttempt, QuizAnswer
from models.announcement import Announcement
from models.enrollment import Enrollment
from models.inquiry import ContactInquiry
from models.activity_log import ActivityLog
from services.email_service import send_admin_email_notification, send_student_confirmation_email

public_bp = Blueprint('public', __name__, url_prefix='/api')

@public_bp.route('/website/settings', methods=['GET'])
def get_website_settings():
    setting = WebsiteSetting.query.first()
    return jsonify(setting.to_dict() if setting else {}), 200

@public_bp.route('/website/theme', methods=['GET'])
def get_website_theme():
    theme = ThemeSetting.query.first()
    return jsonify(theme.to_dict() if theme else {}), 200

@public_bp.route('/homepage', methods=['GET'])
def get_homepage():
    sections = HomepageSection.query.filter_by(is_enabled=True).order_by(HomepageSection.display_order.asc()).all()
    return jsonify([sec.to_dict() for sec in sections]), 200

@public_bp.route('/navigation', methods=['GET'])
def get_navigation():
    items = NavigationItem.query.filter_by(is_enabled=True).order_by(NavigationItem.display_order.asc()).all()
    return jsonify([item.to_dict() for item in items]), 200

@public_bp.route('/social-links', methods=['GET'])
def get_social_links():
    links = SocialLink.query.filter_by(is_enabled=True).order_by(SocialLink.display_order.asc()).all()
    return jsonify([link.to_dict() for link in links]), 200

@public_bp.route('/contact', methods=['GET'])
def get_contact_settings():
    contact = ContactSetting.query.first()
    return jsonify(contact.to_dict() if contact else {}), 200

@public_bp.route('/seo', methods=['GET'])
def get_seo_settings():
    seo = SeoSetting.query.first()
    return jsonify(seo.to_dict() if seo else {}), 200

# Public Courses
@public_bp.route('/courses', methods=['GET'])
def get_courses():
    subject_id = request.args.get('subject_id')
    category = request.args.get('category')
    featured = request.args.get('featured')
    search = request.args.get('search')

    query = Course.query.filter_by(status='published')

    if subject_id:
        query = query.filter_by(subject_id=subject_id)
    if category:
        query = query.filter_by(category=category)
    if featured and featured.lower() in ['true', '1']:
        query = query.filter_by(is_featured=True)
    if search:
        query = query.filter(Course.title.ilike(f'%{search}%') | Course.description.ilike(f'%{search}%'))

    courses = query.order_by(Course.display_order.asc(), Course.created_at.desc()).all()
    return jsonify([c.to_dict() for c in courses]), 200

@public_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    course = Course.query.filter_by(id=course_id, status='published').first()
    if not course:
        # Check by slug
        course = Course.query.filter_by(slug=str(course_id), status='published').first()
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    return jsonify(course.to_dict(include_details=True)), 200

# Public Subjects
@public_bp.route('/subjects', methods=['GET'])
def get_subjects():
    subjects = Subject.query.filter_by(status='published').order_by(Subject.display_order.asc()).all()
    return jsonify([s.to_dict() for s in subjects]), 200

@public_bp.route('/subjects/<int:subject_id>', methods=['GET'])
def get_subject_detail(subject_id):
    subject = Subject.query.filter_by(id=subject_id, status='published').first()
    if not subject:
        subject = Subject.query.filter_by(slug=str(subject_id), status='published').first()
    if not subject:
        return jsonify({'error': 'Subject not found'}), 404

    data = subject.to_dict()
    data['courses'] = [c.to_dict() for c in subject.courses if c.status == 'published']
    data['lessons'] = [l.to_dict() for l in subject.lessons if l.is_published]
    return jsonify(data), 200

# Public Lessons
@public_bp.route('/lessons/<int:lesson_id>', methods=['GET'])
def get_lesson_detail(lesson_id):
    lesson = Lesson.query.filter_by(id=lesson_id, is_published=True).first()
    if not lesson:
        return jsonify({'error': 'Lesson not found'}), 404

    data = lesson.to_dict(include_details=True)
    
    # Previous and Next lesson navigation in course
    all_lessons = Lesson.query.filter_by(course_id=lesson.course_id, is_published=True).order_by(Lesson.display_order.asc()).all()
    idx = next((i for i, l in enumerate(all_lessons) if l.id == lesson.id), -1)
    data['prev_lesson_id'] = all_lessons[idx - 1].id if idx > 0 else None
    data['next_lesson_id'] = all_lessons[idx + 1].id if (idx >= 0 and idx < len(all_lessons) - 1) else None

    return jsonify(data), 200

# Public Quizzes & Submission
@public_bp.route('/quizzes/<int:quiz_id>', methods=['GET'])
def get_quiz_detail(quiz_id):
    quiz = Quiz.query.filter_by(id=quiz_id, is_published=True).first()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    # Do not include correct answer flag for public quiz taking
    return jsonify(quiz.to_dict(include_questions=True, include_correct=False)), 200

@public_bp.route('/quizzes/<int:quiz_id>/submit', methods=['POST'])
def submit_quiz(quiz_id):
    quiz = Quiz.query.filter_by(id=quiz_id, is_published=True).first()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    data = request.get_json() or {}
    user_identifier = data.get('user_name', 'Guest Student')
    submitted_answers = data.get('answers', {}) # format: { question_id: [selected_option_ids] or selected_option_id }

    total_score = 0
    max_score = 0
    detailed_results = []

    for question in quiz.questions:
        q_id = str(question.id)
        max_score += question.points
        user_selection = submitted_answers.get(q_id) or submitted_answers.get(question.id)

        if not isinstance(user_selection, list):
            user_selection = [user_selection] if user_selection is not None else []

        # Find correct options for this question
        correct_option_ids = [opt.id for opt in question.options if opt.is_correct]
        
        is_q_correct = set(user_selection) == set(correct_option_ids) and len(correct_option_ids) > 0
        q_score = question.points if is_q_correct else 0
        total_score += q_score

        detailed_results.append({
            'question_id': question.id,
            'question_text': question.question_text,
            'points': question.points,
            'earned_points': q_score,
            'is_correct': is_q_correct,
            'explanation': question.explanation,
            'user_selection': user_selection,
            'correct_option_ids': correct_option_ids
        })

    percentage = round((total_score / max_score * 100), 1) if max_score > 0 else 0.0
    is_passed = percentage >= quiz.passing_score

    # Save Attempt
    attempt = QuizAttempt(
        quiz_id=quiz.id,
        user_identifier=user_identifier,
        score=total_score,
        max_score=max_score,
        percentage=percentage,
        is_passed=is_passed
    )
    db.session.add(attempt)
    db.session.commit()

    return jsonify({
        'attempt_id': attempt.id,
        'quiz_id': quiz.id,
        'quiz_title': quiz.title,
        'user_identifier': user_identifier,
        'score': total_score,
        'max_score': max_score,
        'percentage': percentage,
        'passing_score': quiz.passing_score,
        'is_passed': is_passed,
        'results': detailed_results
    }), 200

# Public Announcements
@public_bp.route('/announcements', methods=['GET'])
def get_announcements():
    category = request.args.get('category')
    featured = request.args.get('featured')
    
    query = Announcement.query.filter_by(status='published')
    if category:
        query = query.filter_by(category=category)
    if featured and featured.lower() in ['true', '1']:
        query = query.filter_by(is_featured=True)

    items = query.order_by(Announcement.created_at.desc()).all()
    return jsonify([i.to_dict() for i in items]), 200

@public_bp.route('/courses/<int:course_id>/enroll', methods=['POST'])
def enroll_course(course_id):
    course = Course.query.get_or_404(course_id)
    data = request.get_json() or {}

    student_name = data.get('student_name')
    email = data.get('email')
    phone = data.get('phone')
    preferred_mode = data.get('preferred_mode', 'Live Online via Zoom')
    message = data.get('message', '')

    if not student_name or not email or not phone:
        return jsonify({'error': 'Name, email, and phone number are required.'}), 400

    enrollment = Enrollment(
        course_id=course.id,
        course_title=course.title,
        student_name=student_name,
        email=email,
        phone=phone,
        preferred_mode=preferred_mode,
        message=message
    )
    db.session.add(enrollment)

    # Log activity for admin dashboard
    log = ActivityLog(
        action=f"New Enrollment: {student_name} for '{course.title}' ({preferred_mode})",
        details=f"Email: {email}, Phone: {phone}, Message: {message}"
    )
    db.session.add(log)
    db.session.commit()

    # Send Admin Email Notification
    email_html = f"""
    <h2>🎓 New Course Enrollment Registration</h2>
    <p><strong>Course:</strong> {course.title}</p>
    <p><strong>Student Name:</strong> {student_name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Phone:</strong> {phone}</p>
    <p><strong>Preferred Learning Mode:</strong> {preferred_mode}</p>
    <p><strong>Message / Notes:</strong> {message or 'N/A'}</p>
    """
    send_admin_email_notification(f"New Enrollment: {student_name} - {course.title}", email_html)

    # Send Student Confirmation Email Copy
    student_email_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #1e3a8a; margin-top: 0;">🎓 Registration Confirmation — Annapoorni Academy</h2>
      <p>Dear <strong>{student_name}</strong>,</p>
      <p>Thank you for registering your enrollment inquiry for <strong>{course.title}</strong> with Coach Sindhu Ram.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #0f172a;">Your Registration Summary:</h4>
        <p><strong>Course:</strong> {course.title}</p>
        <p><strong>Preferred Batch Mode:</strong> {preferred_mode}</p>
        <p><strong>Contact Phone / WhatsApp:</strong> {phone}</p>
        <p><strong>Notes:</strong> {message or 'None'}</p>
      </div>
      <p>Our team will get in touch with you shortly with batch schedules and onboarding instructions.</p>
      <p style="margin-top: 25px;">
        <a href="https://wa.me/918122795064" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          💬 Chat Directly on WhatsApp (+91 8122795064)
        </a>
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
      <p style="font-size: 0.85rem; color: #64748b;">Warm regards,<br /><strong>Coach Sindhu Ram</strong><br />Annapoorni Academy</p>
    </div>
    """
    send_student_confirmation_email(email, student_name, f"Registration Confirmation: {course.title}", student_email_html)

    return jsonify({
        'message': f"Enrollment registration for '{course.title}' submitted successfully!",
        'enrollment': enrollment.to_dict()
    }), 201

@public_bp.route('/contact/inquiry', methods=['POST'])
@public_bp.route('/inquiries', methods=['POST'])
def submit_contact_inquiry():
    data = request.get_json() or {}

    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone', '')
    mode = data.get('mode', 'General Inquiry')
    subject = data.get('subject', 'General Inquiry')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({'error': 'Name, email, and message are required.'}), 400

    inquiry = ContactInquiry(
        name=name,
        email=email,
        phone=phone,
        mode=mode,
        subject=subject,
        message=message
    )
    db.session.add(inquiry)

    # Log activity for admin dashboard
    log = ActivityLog(
        action=f"New Contact Inquiry from {name}: '{subject}' ({mode})",
        details=f"Email: {email}, Phone: {phone}, Message: {message}"
    )
    db.session.add(log)
    db.session.commit()

    # Send Admin Email Notification
    inquiry_email_html = f"""
    <h2>📬 New Website Contact Inquiry</h2>
    <p><strong>Sender Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Phone:</strong> {phone}</p>
    <p><strong>Preferred Learning Mode:</strong> {mode}</p>
    <p><strong>Subject:</strong> {subject}</p>
    <p><strong>Message:</strong></p>
    <blockquote style="background:#f1f5f9; padding:12px; border-left:4px solid #1e3a8a;">{message}</blockquote>
    """
    send_admin_email_notification(f"New Contact Inquiry from {name}: {subject}", inquiry_email_html)

    # Send Student Confirmation Copy
    student_inquiry_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #1e3a8a; margin-top: 0;">📬 We Received Your Inquiry — Annapoorni Academy</h2>
      <p>Dear <strong>{name}</strong>,</p>
      <p>Thank you for reaching out to Coach Sindhu Ram at Annapoorni Academy. We have received your inquiry.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #0f172a;">Copy of Your Submitted Inquiry:</h4>
        <p><strong>Subject:</strong> {subject}</p>
        <p><strong>Preferred Mode:</strong> {mode}</p>
        <p><strong>Message:</strong> {message}</p>
      </div>
      <p>Our team will respond to you shortly via email or phone.</p>
      <p style="margin-top: 25px;">
        <a href="https://wa.me/918122795064" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          💬 Connect on WhatsApp (+91 8122795064)
        </a>
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
      <p style="font-size: 0.85rem; color: #64748b;">Warm regards,<br /><strong>Coach Sindhu Ram</strong><br />Annapoorni Academy</p>
    </div>
    """
    send_student_confirmation_email(email, name, f"Inquiry Received: {subject}", student_inquiry_html)

    return jsonify({
        'message': 'Your inquiry has been received. Our team will contact you shortly.',
        'inquiry': inquiry.to_dict()
    }), 201

