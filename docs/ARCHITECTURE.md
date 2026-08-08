# Annapoorni Academy V1.0 — Architecture Overview

## 1. System High-Level Architecture

Annapoorni Academy V1.0 is built on a modular full-stack decoupled architecture.

```text
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                       │
│  ┌───────────────────────┐   ┌───────────────────────┐  │
│  │     Public Website    │   │      Admin Panel      │  │
│  │   React + Vite SPA    │   │   React + Vite SPA    │  │
│  └───────────┬───────────┘   └───────────┬───────────┘  │
└──────────────│───────────────────────────│──────────────┘
               │                           │
               │ REST API (JSON / JWT)     │ REST API (JWT Header)
               │                           │
┌──────────────▼───────────────────────────▼──────────────┐
│                      Backend Layer                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   Python Flask                    │  │
│  │  App Factory (app.py) & Modular Blueprints        │  │
│  │  Flask-SQLAlchemy • Flask-CORS • Flask-JWT-Ext    │  │
│  └─────────────────────────┬─────────────────────────┘  │
└────────────────────────────│────────────────────────────┘
                             │
                             │ ORM Queries (SQLAlchemy)
┌────────────────────────────▼────────────────────────────┐
│                     Database Layer                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │             MySQL / Relational Database           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles

1. **Centralized Database-Driven Configuration**:
   - The public website has no hardcoded brand colors, logos, navigation links, hero text, or section order.
   - All website settings, colors, fonts, hero sections, navigation links, and official social media profile URLs are retrieved dynamically from `/api/website/settings`, `/api/website/theme`, `/api/homepage`, `/api/navigation`, and `/api/social-links`.

2. **Real-time CSS Variable Theme Injection**:
   - `ThemeContext` updates CSS root variables (`--primary-color`, `--secondary-color`, `--accent-color`, `--font-heading`, `--font-body`, `--border-radius`) in real-time.
   - When the Admin updates the theme or color palette in `/admin/appearance`, changes propagate live throughout the entire application.

3. **Single Administrative User System**:
   - In accordance with V1.0 specifications, there are no student or teacher account tables or login requirements.
   - Public users can access courses, subjects, lessons, study materials, and take interactive quizzes freely.
   - Authentication is restricted strictly to the **Admin System** via JWT token auth on `/admin/login`.

4. **Draft & Publish System**:
   - Content and theme settings support published vs draft states, allowing administrators to stage changes prior to public release.
