import unittest
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app import app
from extensions import db
from models.admin import Admin
from models.course import Course
from models.subject import Subject

class AnnapoorniAcademyTestSuite(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_01_admin_login(self):
        """Test Case 1: Admin authentication with updated credentials"""
        res = self.client.post('/api/admin/login', json={
            'username': 'admin',
            'password': '$12345678'
        }, content_type='application/json')
        self.assertEqual(res.status_code, 200, "Admin login should return 200 OK")
        data = res.get_json()
        self.assertIn('token', data, "Login response must contain JWT token")
        self.assertEqual(data['admin']['email'], 'shinoanson84@gmail.com', "Admin email must be shinoanson84@gmail.com")

    def test_02_public_courses_api(self):
        """Test Case 2: Public courses endpoint"""
        res = self.client.get('/api/courses')
        self.assertEqual(res.status_code, 200, "Courses endpoint should return 200 OK")
        data = res.get_json()
        self.assertIsInstance(data, list, "Courses response must be a list")
        self.assertGreaterEqual(len(data), 1, "At least 1 course should exist")

    def test_03_public_subjects_api(self):
        """Test Case 3: Public subjects endpoint"""
        res = self.client.get('/api/subjects')
        self.assertEqual(res.status_code, 200, "Subjects endpoint should return 200 OK")
        data = res.get_json()
        self.assertIsInstance(data, list, "Subjects response must be a list")
        self.assertGreaterEqual(len(data), 3, "Flagship subjects (Vedic Maths, Memory, Speed Reading) must exist")

    def test_04_course_detail_api(self):
        """Test Case 4: Public course detail endpoint"""
        res = self.client.get('/api/courses/1')
        self.assertEqual(res.status_code, 200, "Course detail should return 200 OK")
        data = res.get_json()
        self.assertEqual(data['id'], 1)
        self.assertIn('title', data)

    def test_05_course_enrollment_with_dual_email(self):
        """Test Case 5: Student course enrollment with admin & student copy email dispatch"""
        res = self.client.post('/api/courses/1/enroll', json={
            'student_name': 'Test Student Automated',
            'email': 'student.automated@example.com',
            'phone': '+91 8122795064',
            'preferred_mode': 'Live Online via Zoom',
            'message': 'Automated test suite enrollment registration'
        }, content_type='application/json')
        self.assertEqual(res.status_code, 201, "Course enrollment should return 201 Created")
        data = res.get_json()
        self.assertIn('enrollment', data)
        self.assertEqual(data['enrollment']['email'], 'student.automated@example.com')

    def test_06_contact_inquiry_with_dual_email(self):
        """Test Case 6: Website contact inquiry with admin & student copy email dispatch"""
        res = self.client.post('/api/contact/inquiry', json={
            'name': 'Test Visitor Automated',
            'email': 'visitor.automated@example.com',
            'phone': '+91 8122795064',
            'mode': 'In-Person Offline Classes',
            'subject': 'Automated Test Inquiry',
            'message': 'Testing contact inquiry submission'
        }, content_type='application/json')
        self.assertEqual(res.status_code, 201, "Contact inquiry should return 201 Created")
        data = res.get_json()
        self.assertIn('inquiry', data)
        self.assertEqual(data['inquiry']['email'], 'visitor.automated@example.com')

    def test_07_admin_inquiries_protected_api(self):
        """Test Case 7: Admin retrieval of contact inquiries with JWT Auth"""
        # Login to get JWT Token
        login_res = self.client.post('/api/admin/login', json={'username': 'admin', 'password': '$12345678'}, content_type='application/json')
        token = login_res.get_json()['token']

        res = self.client.get('/api/admin/contact/inquiries', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res.status_code, 200, "Admin inquiries should return 200 OK")
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

    def test_08_admin_enrollments_protected_api(self):
        """Test Case 8: Admin retrieval of student enrollments with JWT Auth"""
        login_res = self.client.post('/api/admin/login', json={'username': 'admin', 'password': '$12345678'}, content_type='application/json')
        token = login_res.get_json()['token']

        res = self.client.get('/api/admin/enrollments', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res.status_code, 200, "Admin enrollments should return 200 OK")
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

if __name__ == '__main__':
    unittest.main()
