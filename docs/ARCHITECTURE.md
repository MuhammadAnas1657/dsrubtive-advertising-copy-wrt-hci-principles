# Architecture Document
## Disruptive Advertising Copy — HCI Subject Project

---

## System Architecture Overview

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
│                          NGINX (VPS)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  - SSL Termination (Let's Encrypt)                  │    │
│  │  - Static files: /assets/ → frontend/assets/        │    │
│  │  - Security headers (CSP, X-Frame-Options, etc.)    │    │
│  │  - Gzip compression                                 │    │
│  │  - Rate limiting: /api/ — 10 req/min                │    │
│  │  - Reverse proxy: all other → 127.0.0.1:5000        │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │ localhost:5000
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    GUNICORN (3 workers)                      │
│                    wsgi.py → app.py                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     FLASK APPLICATION                        │
│                                                              │
│  ┌─────────────────┐    ┌──────────────────────────────┐    │
│  │  pages_bp       │    │         api_bp               │    │
│  │                 │    │                              │    │
│  │  GET /          │    │  POST /api/contact           │    │
│  │  → index.html   │    │  POST /api/audit             │    │
│  │                 │    │  GET  /api/health            │    │
│  │  GET /improved  │    │  GET  /api/submissions       │    │
│  │  → improved.html│    │         (admin)              │    │
│  │                 │    └──────────────┬───────────────┘    │
│  │  GET /contact   │                   │                    │
│  │  → contact.html │    ┌──────────────▼───────────────┐    │
│  │                 │    │      email_service.py        │    │
│  │  GET /sitemap   │    │      smtplib → SMTP server   │    │
│  │  GET /robots    │    └──────────────────────────────┘    │
│  └─────────────────┘                   │                    │
│                                        ▼                    │
│                          ┌─────────────────────────┐        │
│                          │    submissions.json      │        │
│                          │  (flat file storage)     │        │
│                          └─────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### Page Load (Original)
```
Browser → HTTPS → Nginx → Gunicorn → Flask pages_bp
→ reads frontend/index.html → returns HTML
Browser → loads /assets/css/main.css, original.css
Browser → loads /assets/js/main.js, form.js (deferred)
Browser → loads Google Fonts (CDN)
```

### Form Submission
```
User fills form → JavaScript validates → fetch('/api/contact', POST)
→ Nginx → Gunicorn → Flask api_bp → validates data
→ saves to submissions.json
→ (optional) email_service.py → SMTP → email notification
→ returns JSON {success: true, message: "..."}
→ JavaScript shows success state in modal
```

### Version Toggle
```
User clicks "✦ View HCI Version" → browser navigates to /improved
Flask pages_bp → reads frontend/improved.html → returns HTML
Browser → loads improved.css additionally
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Web Server | Nginx | Latest stable |
| App Server | Gunicorn | 21.2+ |
| Framework | Python Flask | 3.0+ |
| Language (Backend) | Python | 3.10+ |
| Language (Frontend) | JavaScript ES6+ | N/A |
| Styling | Vanilla CSS3 | N/A |
| Markup | HTML5 | N/A |
| Fonts | Google Fonts (Barlow) | N/A |
| Process Manager | Systemd | N/A |
| SSL | Let's Encrypt (Certbot) | N/A |

---

## Data Flow — Form Submissions

```
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "company": "Acme Corp",
  "phone": "+1 555-0000",
  "website": "https://acme.com",
  "budget": "10k-25k",
  "services": "ppc",
  "message": "...",
  "form_type": "contact"
}

→ Validation (required fields, email format, URL format)
→ Save to submissions.json as:
{
  "id": "20260714171500000001",
  "timestamp": "2026-07-14T17:15:00",
  "type": "contact",
  "name": "Jane Smith",
  ...
}
→ Return: { "success": true, "message": "Thank you! We'll be in touch within 1 business day." }
```

---

## Security Measures

| Threat | Mitigation |
|--------|-----------|
| XSS | Content-Security-Policy header via Nginx |
| Clickjacking | X-Frame-Options: SAMEORIGIN |
| MIME sniffing | X-Content-Type-Options: nosniff |
| API abuse | Rate limiting: 10 req/min per IP on /api/ |
| Data exposure | /api/submissions requires admin key |
| HTTPS enforcement | HTTP → HTTPS 301 redirect |
| Secrets | Loaded from .env (never hardcoded) |

---

## File Serving Strategy

| Resource | Served By | Cache |
|----------|-----------|-------|
| `/assets/css/*.css` | Nginx directly | 30 days, immutable |
| `/assets/js/*.js` | Nginx directly | 30 days, immutable |
| `/sitemap.xml` | Nginx directly | 1 day |
| `/robots.txt` | Nginx directly | 1 day |
| `/*.html` pages | Flask via Gunicorn | No cache (dynamic) |
| `/api/*` endpoints | Flask via Gunicorn | No cache |
