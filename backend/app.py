import os
from flask import Flask, send_from_directory, jsonify
from config import config_by_name
from extensions import db, cors, jwt
from middleware.error_handler import register_error_handlers
from services.seed_service import seed_database

# Import Blueprints
from routes.auth import auth_bp
from routes.public import public_bp
from routes.admin_settings import admin_settings_bp
from routes.admin_theme import admin_theme_bp
from routes.admin_homepage import admin_homepage_bp
from routes.admin_navigation import admin_nav_bp
from routes.admin_social import admin_social_bp
from routes.admin_courses import admin_courses_bp
from routes.admin_subjects import admin_subjects_bp
from routes.admin_lessons import admin_lessons_bp
from routes.admin_quizzes import admin_quizzes_bp
from routes.admin_announcements import admin_announcements_bp
from routes.admin_media import admin_media_bp
from routes.admin_seo import admin_seo_bp
from routes.admin_contact import admin_contact_bp
from routes.admin_dashboard import admin_dashboard_bp
from routes.admin_enrollments import admin_enrollments_bp

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name['default']))

    # Configure CORS origins based on FRONTEND_URL environment variable
    frontend_env = os.environ.get('FRONTEND_URL', '')
    allowed_origins = ['https://annapoorniacademy.netlify.app', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:80']
    if frontend_env and frontend_env.strip() != '*':
        for url in frontend_env.split(','):
            cleaned = url.strip()
            if cleaned and cleaned not in allowed_origins:
                allowed_origins.append(cleaned)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {"origins": allowed_origins},
        r"/uploads/*": {"origins": allowed_origins}
    }, supports_credentials=True)
    jwt.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_settings_bp)
    app.register_blueprint(admin_theme_bp)
    app.register_blueprint(admin_homepage_bp)
    app.register_blueprint(admin_nav_bp)
    app.register_blueprint(admin_social_bp)
    app.register_blueprint(admin_courses_bp)
    app.register_blueprint(admin_subjects_bp)
    app.register_blueprint(admin_lessons_bp)
    app.register_blueprint(admin_quizzes_bp)
    app.register_blueprint(admin_announcements_bp)
    app.register_blueprint(admin_media_bp)
    app.register_blueprint(admin_seo_bp)
    app.register_blueprint(admin_contact_bp)
    app.register_blueprint(admin_dashboard_bp)
    app.register_blueprint(admin_enrollments_bp)

    # Serve uploaded media files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'service': 'Annapoorni Academy API'}), 200

    # Auto-create tables and seed database
    with app.app_context():
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        db.create_all()
        try:
            seed_database()
        except Exception as e:
            app.logger.error(f"Seed initialization note: {e}")

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    is_debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=is_debug)
