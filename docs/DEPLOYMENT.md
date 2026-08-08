# Annapoorni Academy V1.0 — Deployment & Operations Guide

## 1. Quick Start with Docker Compose (Recommended for Production)

Ensure Docker and Docker Compose are installed on your server.

```bash
# 1. Clone repository and navigate to project root
cd annapoorni-academy

# 2. Copy environment variable file
cp .env.example .env

# 3. Launch full-stack services (Frontend Nginx, Flask Backend, MySQL 8.0)
docker-compose up -d --build

# 4. Access Platform
# Public Website: http://localhost:80
# Admin Panel:    http://localhost:80/admin/login
# REST API:       http://localhost:5000/api
```

---

## 2. Manual Development Setup

### Backend Setup (Python Flask)
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask backend server
python app.py
# Server runs at http://localhost:5000
```

### Database Initialization
The Flask application automatically initializes SQLite/MySQL database tables and populates default admin credentials (`admin` / `admin123`) and seed content on startup.

Alternatively, execute `database/schema.sql` and `database/seed.sql` directly on your MySQL instance:
```bash
mysql -u root -p annapoorni_db < database/schema.sql
mysql -u root -p annapoorni_db < database/seed.sql
```

### Frontend Setup (React + Vite)
```bash
cd frontend

# Install Node packages
npm install

# Start Vite development server
npm run dev
# App runs at http://localhost:5173
```

---

## 3. Production Build

To create the optimized static production bundle for the frontend:
```bash
cd frontend
npm run build
```
The output files will be in `frontend/dist/` ready to be served via Nginx or Apache.
