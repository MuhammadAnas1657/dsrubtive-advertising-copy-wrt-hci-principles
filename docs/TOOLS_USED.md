# Tools Used — Disruptive Advertising Copy
## HCI Subject Project

---

## Overview

This document describes every tool, library, language, and framework used to build this project — including **what it does**, **why it was chosen**, and **how it was used**.

---

## Frontend Tools

### 1. HTML5
**What:** HyperText Markup Language version 5 — the standard for web page structure.

**Why:** Provides semantic elements (`<section>`, `<article>`, `<nav>`, `<main>`) that improve both SEO and accessibility. No build step required.

**How used:**
- `index.html` — Complete original site copy (all 12+ sections)
- `improved.html` — HCI-improved version with ARIA attributes
- `contact.html` — Standalone contact page
- Semantic tags used throughout for proper heading hierarchy, landmarks, and accessible forms

---

### 2. CSS3 (Vanilla CSS)
**What:** Cascading Style Sheets — controls visual presentation.

**Why:** Chosen over Tailwind or Bootstrap to demonstrate full understanding of CSS fundamentals. Gives complete control over the design system and allows pixel-perfect reproduction.

**How used:**
- `main.css` — CSS custom properties (variables), reset, shared utilities, animations, modal base
- `original.css` — Section-by-section faithful copy of the original site's visual design
- `improved.css` — HCI enhancements, accessibility improvements, dark mode, reduced-motion support
- CSS animations: `@keyframes` for hero text cycling, `IntersectionObserver`-triggered fade-in-up
- CSS Grid and Flexbox for all layouts
- Media queries for responsive design at 480px, 768px, 1024px

---

### 3. JavaScript (ES6+ Vanilla)
**What:** Client-side scripting language — handles all interactivity.

**Why:** No framework overhead (no React, Vue, etc.). Demonstrates pure JS mastery and keeps the bundle minimal for performance.

**How used:**
- `main.js` — Navbar scroll behavior, dropdowns with keyboard navigation, scroll progress bar, IntersectionObserver animations, hero text cycling, modal open/close, counter animations, testimonial carousel, section indicator dots
- `form.js` — `MultiStepForm` class for multi-step form management, real-time field validation, API submission with fetch(), error states, retry logic

---

### 4. Google Fonts — Barlow & Barlow Condensed
**What:** Open-source font families by Jeremy Tribby, hosted by Google.

**Why:** Matches the original Disruptive Advertising website's typography. Barlow Condensed at 900 weight produces the bold, impactful headlines characteristic of the original design.

**How used:**
- Loaded via `<link rel="preconnect">` and Google Fonts CDN for fast loading
- `font-family: 'Barlow', sans-serif` for body text
- `font-family: 'Barlow Condensed', sans-serif` for all headings and navigation

---

### 5. SVG (Inline & Data URIs)
**What:** Scalable Vector Graphics — resolution-independent vector images.

**Why:** Used for logos and icons to avoid external image dependencies. Renders perfectly at any screen size.

**How used:**
- Disruptive logo: inline `<svg>` with text elements (DIS in red, RUPTIVE in dark)
- Hero background: data URI SVG for the building silhouette effect
- Testimonial avatar placeholders: inline SVG circles

---

## Backend Tools

### 6. Python 3
**What:** High-level, interpreted programming language.

**Why:** Recommended by the user. Python has excellent web framework support, is easy to deploy on VPS, and the `flask` ecosystem is mature and well-documented.

**How used:**
- All backend logic written in Python 3.10+
- File I/O for reading HTML templates and writing `submissions.json`
- `smtplib` for email notifications
- `re` module for email validation regex

---

### 7. Flask
**What:** Lightweight Python web framework (micro-framework).

**Why:** Minimal footprint, easy to deploy with Gunicorn, excellent for serving static HTML + JSON APIs without needing a heavy framework. Perfect for a project with no database requirements.

**How used:**
- `app.py` — App factory with `create_app()` pattern
- Blueprint registration: `pages_bp` and `api_bp`
- Serves HTML files directly (no Jinja2 templating needed — pure HTML)
- Serves `sitemap.xml` and `robots.txt` with correct MIME types
- Handles CORS via `flask-cors`

**Version:** Flask 3.0.0+

---

### 8. Flask-CORS
**What:** Flask extension that adds Cross-Origin Resource Sharing headers.

**Why:** Required for the JavaScript `fetch()` API to communicate with the Flask backend from the browser, especially when serving from different ports during development.

**How used:**
- Initialized on the Flask app: `CORS(app)`
- Allows all origins by default (can be restricted in production)

---

### 9. python-dotenv
**What:** Python library that loads environment variables from a `.env` file.

**Why:** Keeps sensitive configuration (SMTP credentials, secret key) out of source code. Industry standard practice.

**How used:**
- `load_dotenv()` called at app startup
- `.env.example` template provided for easy setup
- Variables accessed via `os.getenv()`

---

### 10. Gunicorn
**What:** Python WSGI HTTP Server — production-grade application server.

**Why:** Flask's built-in development server is not suitable for production. Gunicorn handles multiple concurrent requests, process management, and integrates with Nginx.

**How used:**
- `wsgi.py` — Entry point (`application = create_app()`)
- Command: `gunicorn --workers 3 --bind 127.0.0.1:5000 wsgi:application`
- Systemd service file (`disruptive-copy.service`) for auto-restart on VPS

---

## Deployment Tools

### 11. Nginx
**What:** High-performance HTTP server and reverse proxy.

**Why:** Sits in front of Gunicorn to handle SSL termination, static file serving, gzip compression, security headers, and rate limiting — tasks Gunicorn is not designed for.

**How used:**
- `backend/deployment/nginx.conf` — Full production configuration
- Serves `/assets/` static files directly (bypass Flask for performance)
- Reverse proxies all other requests to `127.0.0.1:5000` (Gunicorn)
- Enforces HTTPS via 301 redirect
- Sets security headers: `X-Frame-Options`, `X-Content-Type-Options`, CSP
- Rate limits `/api/` endpoints: 10 req/min per IP

---

### 12. Systemd
**What:** Linux service manager — manages background processes on the VPS.

**Why:** Ensures the Gunicorn server starts automatically on boot and restarts on failure.

**How used:**
- `disruptive-copy.service` — Unit file defining how the app runs
- `Restart=always` for automatic recovery from crashes

---

## Development Workflow

### Build Steps

The project was built in this sequence:

1. **Website Analysis** — Browsed and documented the original disruptiveadvertising.com with screenshots, capturing all 14 sections, colors, typography, and animations
2. **Implementation Plan** — Created detailed plan covering all components, HCI principles, SEO requirements, and technical architecture
3. **Backend First** — Flask app, routes, API, email service, requirements.txt, wsgi.py
4. **CSS Design System** — main.css (shared), original.css (faithful copy), improved.css (HCI enhancements)
5. **JavaScript Logic** — main.js (shared interactivity), form.js (multi-step form engine)
6. **HTML — Original** — index.html with all 12+ sections, full SEO meta, JSON-LD, modals
7. **HTML — Improved** — improved.html applying all 10 HCI principles with annotation badges
8. **HTML — Contact** — contact.html standalone contact page
9. **SEO Files** — sitemap.xml, robots.txt
10. **Deployment Config** — nginx.conf, systemd service, wsgi.py
11. **Documentation** — All 6 docs files in `/docs/`

### No Build Tools Required

This project intentionally uses **no build tools** (no Webpack, Vite, Gulp, etc.):
- CSS is plain `.css` files — no Sass or PostCSS
- JavaScript is plain ES6+ — no TypeScript, no bundling
- HTML is plain `.html` — no template compilation
- This makes the project easy to understand, inspect, and grade

---

## File Count Summary

| Directory | Files | Purpose |
|-----------|-------|---------|
| `frontend/` | 7 HTML/XML/TXT | Pages + SEO assets |
| `frontend/assets/css/` | 3 | Stylesheets |
| `frontend/assets/js/` | 2 | JavaScript |
| `backend/` | 5 Python files | App + routes + services |
| `backend/deployment/` | 2 config files | VPS deployment |
| `docs/` | 6 Markdown files | Documentation |
| **Total** | **25 files** | |
