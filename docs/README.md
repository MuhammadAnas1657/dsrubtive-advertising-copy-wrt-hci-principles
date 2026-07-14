# Disruptive Advertising Website Copy
## HCI Subject Project — Complete Documentation

---

## Project Overview

This project is a **complete, functional copy** of [disruptiveadvertising.com](https://disruptiveadvertising.com/) built as part of an **HCI (Human-Computer Interaction) subject** assignment. It demonstrates both:

1. **Faithful Reproduction** — A pixel-accurate copy of the original site with all animations, sections, and interactions
2. **HCI-Improved Version** — An enhanced version applying 10 documented HCI principles

A special **toggle button** in the navigation bar lets users switch between both versions seamlessly.

---

## Quick Start

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Copy and configure environment
copy .env.example .env

# 6. Run the development server
python app.py
```

Open your browser at **http://localhost:5000**

---

## Project Structure

```
project-root/
├── frontend/
│   ├── index.html          ← Original copy
│   ├── improved.html       ← HCI-Improved version
│   ├── contact.html        ← Standalone contact page
│   ├── sitemap.xml         ← SEO sitemap
│   ├── robots.txt          ← SEO crawl control
│   └── assets/
│       ├── css/
│       │   ├── main.css    ← Shared base styles + variables
│       │   ├── original.css← Original site styles
│       │   └── improved.css← HCI-improved styles
│       └── js/
│           ├── main.js     ← Shared JS logic
│           ├── animations.js (see main.js — integrated)
│           └── form.js     ← Multi-step form engine
├── backend/
│   ├── app.py              ← Flask app factory
│   ├── wsgi.py             ← Gunicorn entry point
│   ├── requirements.txt    ← Python dependencies
│   ├── .env.example        ← Environment variable template
│   ├── routes/
│   │   ├── pages.py        ← Page routes (/, /improved, /contact)
│   │   └── api.py          ← API routes (/api/contact, /api/audit)
│   ├── services/
│   │   └── email_service.py← SMTP email notifications
│   └── deployment/
│       ├── nginx.conf      ← Nginx reverse proxy (VPS)
│       └── disruptive-copy.service ← Systemd unit file
└── docs/
    ├── README.md           ← This file
    ├── SETUP.md            ← Detailed setup guide
    ├── HCI_ANALYSIS.md     ← All 10 HCI principles documented
    ├── SEO_REPORT.md       ← SEO implementation details
    ├── TOOLS_USED.md       ← Tool descriptions
    ├── ARCHITECTURE.md     ← System architecture
    └── DEPLOYMENT.md       ← VPS deployment guide
```

---

## Features

| Feature | Status |
|---------|--------|
| Pixel-faithful original copy | ✅ Complete |
| HCI-Improved version | ✅ Complete |
| Navbar toggle (Original ↔ HCI) | ✅ Complete |
| CSS hero text cycling animation | ✅ Complete |
| Multi-step contact form | ✅ Complete |
| Free audit request form | ✅ Complete |
| Flask API backend | ✅ Complete |
| JSON form submission storage | ✅ Complete |
| Email notifications (SMTP) | ✅ Complete |
| SEO meta tags + JSON-LD | ✅ Complete |
| sitemap.xml + robots.txt | ✅ Complete |
| Mobile responsive | ✅ Complete |
| Accessibility (WCAG 2.1 AA) | ✅ Complete |
| VPS deployment configs | ✅ Complete |

---

## Team / Author

HCI Subject Project — University Assignment  
Built with: Python Flask, HTML5, CSS3, Vanilla JavaScript
