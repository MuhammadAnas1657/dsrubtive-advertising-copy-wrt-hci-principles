# Disruptive Advertising Copy & HCI-Improved Version
## Complete Comprehensive Project Documentation

This document serves as the master documentation for the Disruptive Advertising Copy & HCI-Improved Version website project, combining architectural design, local setup procedures, technical tools explanation, SEO strategies, human-computer interaction analysis, and production deployment steps (VPS and Render.com) into a single, comprehensive reference file.

---

## 1. Project Overview & Scope

This project is a fully functional web application constructed to fulfill requirements for a Human-Computer Interaction (HCI) university subject. The assignment demands two core implementations:
1. **Faithful Copy (Original):** A pixel-accurate reproduction of the homepage of [disruptiveadvertising.com](https://disruptiveadvertising.com/) capturing all visual layouts, section sequences, transitions, and copy elements.
2. **HCI-Improved Version:** A secondary implementation of the website redesigning structural and interactive components to adhere to Nielsen’s 10 Usability Heuristics and WCAG 2.1 AA accessibility guidelines.

A specialized, styled toggle button integrated into the navigation bar allows users to dynamically switch between the original replica and the HCI-improved version. The application runs on a Python Flask backend serving static files with JSON-based file persistence for contact forms (requiring no external database setup), and is fully configured for production deployments.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                       │
│  ┌──────────────┐   Toggle   ┌──────────────────────────┐   │
│  │  index.html  │ ─────────► │     improved.html        │   │
│  │  (Original)  │ ◄───────── │   (HCI-Improved)         │   │
│  └──────────────┘            └──────────────────────────┘   │
│         │                              │                     │
│   main.js + form.js              main.js + form.js           │
│   original.css + main.css  improved.css + original.css       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 REVERSE PROXY / ROUTING LAYER                │
│  - Serves static assets directly (/assets/)                 │
│  - Terminates SSL (HTTPS via Let's Encrypt)                 │
│  - Enforces Security Headers (CSP, Frame-Options, etc.)     │
│  - Limits Request Rates on API endpoints (/api/)            │
└────────────────────────┬────────────────────────────────────┘
                         │ localhost:5000 (Internal)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION RUNTIME                      │
│   Flask Web Application factory (app.py) run by Gunicorn   │
│                                                              │
│  ┌─────────────────┐    ┌──────────────────────────────┐    │
│  │  pages_bp       │    │         api_bp               │    │
│  │                 │    │                              │    │
│  │  GET /          │    │  POST /api/contact           │    │
│  │  → index.html   │    │  POST /api/audit             │    │
│  │                 │    │  GET  /api/health            │    │
│  │  GET /improved  │    │  GET  /api/submissions       │    │
│  │  → improved.html│    │         (Admin key req.)     │    │
│  │                 │    └──────────────┬───────────────┘    │
│  │  GET /contact   │                   │                    │
│  │  → contact.html │    ┌──────────────▼───────────────┐    │
│  │                 │    │      email_service.py        │    │
│  │  GET /sitemap   │    │      smtplib SMTP Dispatch   │    │
│  │  GET /robots    │    └──────────────────────────────┘    │
│  └─────────────────┘                   │                    │
│                                        ▼                    │
│                          ┌─────────────────────────┐        │
│                          │    submissions.json      │        │
│                          │  (Flat File Data Store)  │        │
│                          └─────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Application Infrastructure Detail
* **Routing & Template Separation:** Page-level routing is handled via Flask blueprints. Since no server-side compilation is needed, the backend serves raw, optimized HTML files straight from the `frontend/` directory. Static files are systematically served via the `/assets` URL path.
* **Storage & Persistence:** In place of a heavy database setup, contact form entries are processed and validated on the backend and appended to `backend/submissions.json` as structured, timestamped JSON records.
* **Email Service:** Email alerts are sent asynchronously using Flask's runtime through Python's standard `smtplib` library. If SMTP details are absent from environment variables, the system fails gracefully by recording the submission in the local file structure.

---

## 3. Technology Stack & Tools Used

### Frontend Architecture
1. **HTML5:** Utilizes strict semantic tags (e.g., `<main>`, `<header>`, `<nav>`, `<section>`, `<article>`) to preserve document structure, maximizing indexability for search crawlers and compatibility with screen readers.
2. **Vanilla CSS3:** Eliminates third-party CSS framework overhead to enforce absolute pixel-perfect replica integrity. Uses custom variables (CSS design tokens) to maintain color palettes, grid configurations, and smooth transitions.
3. **Vanilla JavaScript (ES6+):** Programmed without compiled frameworks (such as React or Vue) to keep execution fast. Implements logic for navigation drawers, counter increments, modals, multi-step validation engines, carousels, and global notifications.
4. **Google Fonts (Barlow & Barlow Condensed):** Standardizes typeface choices to replicate the original branding.
5. **Inline SVGs:** Renders logos and user avatars using vector graphics to reduce server round-trips and preserve scalability.

### Backend Infrastructure
1. **Python 3.10+ & Flask:** The application runs on Flask's WSGI interface. Configured using the Application Factory pattern (`create_app()`).
2. **Flask-CORS:** Configured to handle Cross-Origin Resource Sharing for API routes when developing locally.
3. **python-dotenv:** Auto-loads production environment secrets (SMTP keys, Flask environments) from local `.env` files.
4. **Gunicorn:** Handles multi-threaded concurrency using greenlet processes, bound to local ports for proxy forwarding.

---

## 4. Human-Computer Interaction (HCI) Analysis

Ten Nielsen heuristics were used as the foundation for the `/improved` version:

### 1. Visibility of System Status
* **Issue:** The original site features no navigation progress tracking. Users do not know their location on a massive scrolling layout.
* **Improvement:** Added a top-running CSS scroll progress bar mapped to client viewport values. Placed a persistent floating dot indicator menu on the right margin highlighting the active content section.

### 2. Match Between System and the Real World
* **Issue:** Original CTAs use corporate jargon ("LET'S TALK").
* **Improvement:** Redesigned labels to clear, conversational directives: **"TALK TO A HUMAN"** and **"LET'S TALK ABOUT YOUR GOALS"**. Added plain-language verification badges for security and timing.

### 3. User Control and Freedom
* **Issue:** The original uses rigid modals and external multi-step widgets that block easy recovery or exit.
* **Improvement:** Configured standard escape-key mappings to close active modals instantly. Included a clear "Back" step for all fields in multi-step modules. Modal backgrounds are clickable for closing.

### 4. Consistency and Standards
* **Issue:** Text paddings, section blocks, and interactive buttons vary randomly in scale and spacing.
* **Improvement:** Fixed interactive items to a standard minimum dimension of **52px** (ideal for mobile touch targets). Normalised padding parameters across all landing panels.

### 5. Error Prevention
* **Issue:** Validation only occurs when clicking final submit buttons.
* **Improvement:** Added real-time inline checking using the `blur` event. Implemented helpful field guides underneath input fields (e.g., reminding users to prepend "https://" to URLs) to guide them as they type.

### 6. Recognition Over Recall
* **Issue:** Long page lengths force users to memorize past navigation locations to reach specific sections.
* **Improvement:** Configured a secondary subnav bar that sticks to the top of the screen as the user scrolls, showing active anchors. Added descriptive tooltips on interactive targets.

### 7. Flexibility and Efficiency of Use
* **Issue:** Blind or keyboard-only navigation is slow and tedious on long pages.
* **Improvement:** Implemented a hidden keyboard-focused "Skip to main content" skip-link. Configured a global hotkey (the **"/"** key) to trigger the contact modal from anywhere. Added full keyboard tab-navigation logic to dropdown menus.

### 8. Aesthetic and Minimalist Design
* **Issue:** Dense blocks of text and overlapping call-to-actions compete for attention.
* **Improvement:** Simplified layouts down to one clear call-to-action per screen. Increased margins and whitespace to highlight core content blocks.

### 9. Help Users Recognize, Diagnose, and Recover from Errors
* **Issue:** Submitting a form during a network failure displays blank spaces or vague error messages.
* **Improvement:** Designed an error-state container with a clear retry option (**"↻ Try Again"**).

### 10. Accessibility (WCAG 2.1 AA Compliance)
* **Issue:** Default focus rings are hidden, and low contrast makes reading difficult.
* **Improvement:** Added high-contrast focus indicators, explicit ARIA tags for screen readers, high-contrast support, and a `prefers-reduced-motion` media query to respect OS-level animation preferences.

---

## 5. SEO Strategy

* **Optimized Tags:** Unique keyword-focused title tags and meta descriptions are set for the `/`, `/improved`, and `/contact` endpoints.
* **Heading Hierarchy:** Structured page elements strictly under a single `<h1>` tag with logically nested `<h2>` and `<h3>` tags.
* **Structured Data:** Built-in JSON-LD organization and website schemas allow search engines to parse review scores and corporate metrics directly.
* **Site Indexing:** Configured custom XML sitemaps (`sitemap.xml`) and web-crawler directives (`robots.txt`) served directly from Flask routing.

---

## 6. Local Installation & Configuration

### Prerequisites
Ensure Python 3.10+ and Git are installed.

```bash
# 1. Clone or navigate to the directory
cd "dsrubtive advertising copy wrt hci principles"

# 2. Go to the backend folder
cd backend

# 3. Create virtual environment
python -m venv venv

# 4. Activate the virtual environment
# On Windows (PowerShell):
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 5. Install dependencies
pip install -r requirements.txt

# 6. Set up your environmental variables
copy .env.example .env  # Use 'cp' instead of 'copy' on Linux/macOS
```

Open `.env` and fill out keys:
```env
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=generate_a_random_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
NOTIFY_EMAIL=destination_email@gmail.com
ADMIN_KEY=set_admin_viewing_password
```

Start the application:
```bash
python app.py
```
Open **http://localhost:5000** in your browser.

---

## 7. Production Deployment Options

### Option A: Hosting on Render.com (Recommended for Quick Setup)

Render offers cloud deployment integrated directly with GitHub.

#### 1. Push Code to GitHub
Create a new GitHub repository, open your terminal at the project root, and execute:
```bash
git init
git branch -M main
git add .
git commit -m "Initial commit of disruptive advertising website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

#### 2. Connect to Render
1. Log in to [render.com](https://render.com) using your GitHub account.
2. Select **New +** → **Web Service**.
3. Choose the repository you just pushed.
4. Input these settings on the creation screen:
   * **Root Directory:** `backend` *(CRITICAL)*
   * **Runtime:** `Python 3`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `gunicorn wsgi:application --workers 2 --threads 2 --timeout 120 --bind 0.0.0.0:$PORT`
   * **Instance Type:** `Free` (or Starter to prevent spin-down delays)
5. Under **Environment Variables**, add:
   * `FLASK_ENV`: `production`
   * `FLASK_DEBUG`: `0`
   * `SECRET_KEY`: (Generate a secure hex key)
   * (Add optional SMTP settings if email alerts are required)
6. Click **Create Web Service**. Render will build and deploy the app at a custom address (e.g. `https://your-app.onrender.com`).

---

### Option B: Hosting on a Virtual Private Server (VPS)

For deployments requiring full command-line control (e.g., Ubuntu Linux).

#### 1. Directory Setup
Upload your project files to the VPS directory `/var/www/disruptive-copy/`.

#### 2. Gunicorn & Systemd Configuration
Create a Systemd service file at `/etc/systemd/system/disruptive-copy.service`:
```ini
[Unit]
Description=Disruptive Advertising Copy — Flask/Gunicorn
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/disruptive-copy/backend
Environment="PATH=/var/www/disruptive-copy/venv/bin"
ExecStart=/var/www/disruptive-copy/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 --timeout 60 wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```
Run `sudo systemctl enable --now disruptive-copy` to launch the backend.

#### 3. Nginx Server Block Setup
Save the following config to `/etc/nginx/sites-available/disruptive-copy`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Serve static assets directly for faster loading
    location /assets/ {
        alias /var/www/disruptive-copy/frontend/assets/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location = /sitemap.xml {
        alias /var/www/disruptive-copy/frontend/sitemap.xml;
    }

    location = /robots.txt {
        alias /var/www/disruptive-copy/frontend/robots.txt;
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Link the file to `/etc/nginx/sites-enabled/` and reload Nginx (`sudo systemctl reload nginx`).
