from extensions import db
from models.admin import Admin
from models.website_settings import WebsiteSetting
from models.theme import ThemeSetting
from models.homepage import HomepageSection
from models.navigation import NavigationItem
from models.social import SocialLink
from models.contact import ContactSetting
from models.seo import SeoSetting
from models.media import Media
from models.subject import Subject
from models.course import Course
from models.lesson import CourseModule, Lesson, Resource
from models.quiz import Quiz, Question, QuizOption, QuizAttempt, QuizAnswer
from models.announcement import Announcement
from models.activity_log import ActivityLog
from models.enrollment import Enrollment
from models.inquiry import ContactInquiry

__all__ = [
    'db',
    'Admin',
    'WebsiteSetting',
    'ThemeSetting',
    'HomepageSection',
    'NavigationItem',
    'SocialLink',
    'ContactSetting',
    'SeoSetting',
    'Media',
    'Subject',
    'Course',
    'CourseModule',
    'Lesson',
    'Resource',
    'Quiz',
    'Question',
    'QuizOption',
    'QuizAttempt',
    'QuizAnswer',
    'Announcement',
    'ActivityLog',
    'Enrollment',
    'ContactInquiry'
]
