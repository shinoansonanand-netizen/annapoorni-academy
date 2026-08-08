# Annapoorni Academy V1.0 — REST API Specification

All endpoints return JSON responses and use standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`).

---

## 1. Public API Endpoints

### Website Settings
- **GET** `/api/website/settings`
  - Returns site name, tagline, description, logo URL, favicon URL.

### Theme Settings
- **GET** `/api/website/theme`
  - Returns active preset, primary color, secondary color, accent color, background color, text color, font families, font scale, and border radius.

### Homepage Sections
- **GET** `/api/homepage`
  - Returns ordered array of active homepage sections (Hero, About, Featured Courses, Benefits, Testimonials, Announcements, CTA).

### Navigation Items
- **GET** `/api/navigation`
  - Returns array of active menu links and destinations.

### Social Media Links
- **GET** `/api/social-links`
  - Returns array of official social media profile URLs and placement flags.

### Contact & SEO Settings
- **GET** `/api/contact` — Returns campus address, email, phone, working hours, maps URL.
- **GET** `/api/seo` — Returns page title, meta description, keywords, Open Graph social tags.

### Content Browsing
- **GET** `/api/courses` (Query params: `subject_id`, `category`, `featured`, `search`)
- **GET** `/api/courses/:id` — Detailed course syllabus, modules, and lessons.
- **GET** `/api/subjects`
- **GET** `/api/subjects/:id` — Subject detail with associated courses.
- **GET** `/api/lessons/:id` — Lesson video URL, markdown content, resources, and prev/next links.
- **GET** `/api/quizzes/:id` — Quiz assessment details and question options.
- **POST** `/api/quizzes/:id/submit` — Submit quiz answers, returns score, percentage, pass/fail status, and question breakdown.
- **GET** `/api/announcements` — Published news and workshop alerts.

---

## 2. Admin Protected API Endpoints (Requires `Authorization: Bearer <JWT>`)

### Admin Auth
- **POST** `/api/admin/login` — JSON body: `{ "username": "admin", "password": "admin123" }`
- **GET** `/api/admin/me` — Get current logged-in admin identity.
- **POST** `/api/admin/logout`

### Admin Dashboard
- **GET** `/api/admin/dashboard` — Returns count metrics, recent courses, recent quiz attempts.

### Appearance & Settings
- **PUT** `/api/admin/website/settings` — Update site name, logo, description.
- **PUT** `/api/admin/website/theme` — Update theme preset, colors, typography.
- **GET / PUT** `/api/admin/homepage` — Update section display order, visibility, copy, images.

### Navigation & Social Media CRUD
- **GET / POST** `/api/admin/navigation`
- **PUT / DELETE** `/api/admin/navigation/:id`
- **GET / POST** `/api/admin/social-links`
- **PUT / DELETE** `/api/admin/social-links/:id`

### Content CRUD
- **GET / POST** `/api/admin/courses`
- **PUT / DELETE** `/api/admin/courses/:id`
- **GET / POST** `/api/admin/subjects`
- **PUT / DELETE** `/api/admin/subjects/:id`
- **GET / POST** `/api/admin/lessons`
- **PUT / DELETE** `/api/admin/lessons/:id`
- **GET / POST** `/api/admin/quizzes`
- **PUT / DELETE** `/api/admin/quizzes/:id`
- **GET / POST** `/api/admin/announcements`
- **PUT / DELETE** `/api/admin/announcements/:id`

### Media Library & Uploads
- **GET** `/api/admin/media` — List uploaded assets.
- **POST** `/api/admin/media/upload` — Multipart form upload.
- **DELETE** `/api/admin/media/:id`
