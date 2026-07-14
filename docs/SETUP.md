# Setup Guide — Disruptive Advertising Copy

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | 3.10+ | [python.org](https://python.org) |
| pip | Latest | Included with Python |
| Git | Any | Optional, for cloning |

---

## Local Development Setup

### Step 1 — Navigate to the project

```bash
cd "dsrubtive advertising copy wrt hci principles"
```

### Step 2 — Set up Python virtual environment

```bash
cd backend
python -m venv venv
```

Activate it:
- **Windows:** `venv\Scripts\activate`
- **Linux / macOS:** `source venv/bin/activate`

### Step 3 — Install dependencies

```bash
pip install -r requirements.txt
```

### Step 4 — Configure environment variables

```bash
# Windows
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

Edit `.env` with your values:

```env
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-random-secret-key-here

# Optional: SMTP email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
NOTIFY_EMAIL=notify@yourdomain.com

# Optional: Admin key for viewing submissions
ADMIN_KEY=changeme
```

> **Note:** Email notifications are optional. If SMTP is not configured, form submissions are still saved to `backend/submissions.json`.

### Step 5 — Run the development server

```bash
python app.py
```

The app will start at **http://localhost:5000**

### Pages available locally

| URL | Description |
|-----|-------------|
| http://localhost:5000/ | Original Disruptive Advertising copy |
| http://localhost:5000/improved | HCI-Improved version |
| http://localhost:5000/contact | Contact page |
| http://localhost:5000/api/health | API health check |
| http://localhost:5000/sitemap.xml | SEO sitemap |
| http://localhost:5000/robots.txt | Robots file |

---

## Toggle Between Versions

Click the **"✦ View HCI Version"** button in the navbar to switch from the original to the HCI-improved version.

Click **"← View Original"** in the HCI version navbar to return.

---

## Viewing Form Submissions

Form submissions are saved to `backend/submissions.json`.

You can also view them via the API (requires admin key):

```bash
curl "http://localhost:5000/api/submissions?key=changeme"
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: flask` | Run `pip install -r requirements.txt` |
| Port 5000 already in use | Change port: `python app.py --port 5001` |
| Fonts not loading | Check internet connection (Google Fonts CDN) |
| Form not submitting | Check browser console; ensure Flask is running |
