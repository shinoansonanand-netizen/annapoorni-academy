# 🎓 ANNAPOORNI ACADEMY V1.0

> **Production-Ready Full-Stack Educational Platform & Website**

Annapoorni Academy is a modern full-stack educational platform built with **React**, **Python Flask**, and **MySQL/SQLite**, featuring a database-driven public educational website and a centralized Admin Control Panel.

---

## 🌟 Key Features

- **Public Educational Website**:
  - Configurable Homepage (Hero with dual CTAs, About stats, Featured Courses, Benefits, Testimonials carousel, Announcements, CTA).
  - Course Catalog & Syllabus Timeline with difficulty levels, duration, and subject filters.
  - Interactive Lesson Viewer with video player, markdown reading notes, downloadable study resources, and prev/next lesson navigation.
  - Interactive Quiz Engine with live countdown timer, radio/checkbox inputs, immediate instant evaluation, score percentage recap, answer analysis, and confetti celebrations.
  - Category-tagged Announcements & Events feed.
  - Campus Contact page with Google Maps embed and inquiry forms.

- **Centralized Admin Control Panel** (`/admin/login`):
  - **Live Theme & Appearance Editor**: Configure primary/secondary/accent colors, Google Fonts (Outfit, Inter, Montserrat, Roboto, Plus Jakarta Sans), logos, branding, and theme presets (Academic, Modern, Minimal, Dark, Custom) with real-time split-pane preview.
  - **Homepage Section Editor**: Enable/disable sections, reorder layout, update copy, images, and buttons.
  - **Navigation & Social Media Managers**: Add/edit header and footer menu items, connect official social media profiles (Instagram, YouTube, LinkedIn, Facebook, X, WhatsApp), and choose placement locations.
  - **Content CRUD**: Comprehensive management for Courses, Subjects, Modules, Lessons, Quizzes, Questions, and Announcements.
  - **Media Library**: Asset uploader supporting JPG, PNG, WEBP, SVG with instant URL copying.
  - **SEO & Contact Settings**: Page title, meta descriptions, keywords, Open Graph social share cards, phone, email, address.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router v6, Axios, Lucide React, Recharts, Canvas Confetti, Modern Vanilla CSS with CSS Variables (`--primary-color`, etc.).
- **Backend**: Python 3.11, Flask, Flask-SQLAlchemy, Flask-CORS, Flask-JWT-Extended, PyMySQL, Werkzeug.
- **Database**: MySQL 8.0 (Production) / SQLite (Zero-config local dev fallback).
- **Deployment**: Docker, Docker Compose, Nginx, Gunicorn.

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (Recommended)
```bash
# Clone repository and launch containers
cp .env.example .env
docker-compose up -d --build

# Open browser:
# Public Site: http://localhost:80
# Admin Login: http://localhost:80/admin/login (Credentials: admin / admin123)
```

### Option 2: Local Development Setup

#### Backend
```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [REST API Specification](docs/API.md)
- [Deployment & Operations](docs/DEPLOYMENT.md)

---

## 🔒 Security & V1.0 Scope

- V1.0 is governed by a single centralized **Admin Authentication System** with password hashing and JWT token security.
- Per V1.0 specifications, there are **no student or teacher profile management accounts**, keeping public educational materials open while providing centralized admin control.
- No social media login credentials or passwords are required or stored.
