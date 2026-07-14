# Render.com Deployment Guide
## Disruptive Advertising Copy — HCI Subject Project

---

## What is Render?

[Render](https://render.com) is a cloud hosting platform that can deploy Python/Flask web applications **for free** (with limitations). It handles servers, SSL certificates, and domain names automatically — you just push your code to GitHub and Render does the rest.

**Free Tier Limits (as of 2026):**
| Feature | Free Tier |
|---------|-----------|
| Instance Type | 512 MB RAM, shared CPU |
| Sleep after inactivity | 15 minutes (first request wakes it up) |
| Bandwidth | 100 GB/month |
| Custom domains | ✅ Supported |
| SSL (HTTPS) | ✅ Automatic (Let's Encrypt) |
| Auto-deploy from GitHub | ✅ Yes |

> [!NOTE]
> Free tier services **spin down after 15 minutes** of inactivity. The first request after sleeping takes ~30–60 seconds to wake up. For a production/graded demo, consider upgrading to the **Starter plan ($7/month)** which never sleeps.

---

## Prerequisites

Before you begin, you need:

1. ✅ A **GitHub account** — [github.com](https://github.com)
2. ✅ A **Render account** — [render.com](https://render.com) (free, sign in with GitHub)
3. ✅ **Git installed** on your Windows machine — [git-scm.com](https://git-scm.com)
4. ✅ This project on your computer (already done ✓)

---

## Overview — How It Works

```
Your Computer                GitHub               Render
──────────────               ──────               ──────
project files  → git push → repository  →  auto-deploy → live website
                              (main branch)         ↑
                                            detects changes,
                                            runs: pip install
                                            starts: gunicorn
```

Render reads **two files** from your repository root:

| File | Purpose |
|------|---------|
| `render.yaml` | Tells Render: runtime, build command, start command, env vars |
| `requirements.txt` | Tells pip which Python packages to install |

Both are already created in your project. ✅

---

## Step-by-Step Deployment

---

### STEP 1 — Create a GitHub Repository

**1a.** Go to [github.com/new](https://github.com/new)

**1b.** Fill in the form:
- **Repository name:** `disruptive-advertising-hci` (or anything you like)
- **Visibility:** Public ✅ (required for free Render deployments)
- **Do NOT** check "Add a README" (we already have files)

**1c.** Click **"Create repository"**

You'll see a page with setup instructions. Keep it open.

---

### STEP 2 — Push Your Project to GitHub

Open **PowerShell** (or Git Bash) and run these commands **one by one**:

```powershell
# Navigate to your project root
cd "c:\Users\anas1\OneDrive\Documents\dsrubtive advertising copy wrt hci principles"

# Initialize a git repository (skip if already done)
git init

# Set your main branch name
git branch -M main

# Stage ALL files for commit
git add .

# Create your first commit
git commit -m "Initial commit: Disruptive Advertising HCI project"

# Connect to your GitHub repository
# REPLACE the URL below with YOUR repository URL from GitHub
git remote add origin https://github.com/YOUR-USERNAME/disruptive-advertising-hci.git

# Push everything to GitHub
git push -u origin main
```

> [!IMPORTANT]
> Replace `YOUR-USERNAME` with your actual GitHub username and `disruptive-advertising-hci` with your repository name.

**Verify:** Open your GitHub repository in the browser — you should see all your project files there.

---

### STEP 3 — Sign Up / Log In to Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Click **"Continue with GitHub"** — this links Render directly to your GitHub account
4. Authorize the permissions Render requests

---

### STEP 4 — Create a New Web Service on Render

**4a.** From the Render **Dashboard**, click **"New +"** → **"Web Service"**

**4b.** On the **"Connect a repository"** screen:
- You'll see a list of your GitHub repositories
- Find `disruptive-advertising-hci` and click **"Connect"**

> If you don't see your repository, click **"Configure account"** → give Render access to the specific repository.

---

### STEP 5 — Configure the Web Service

Render will show you a configuration screen. Fill it in **exactly** as follows:

| Field | Value |
|-------|-------|
| **Name** | `disruptive-advertising-hci` |
| **Region** | Oregon (US West) — free tier |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn wsgi:application --workers 2 --threads 2 --timeout 120 --bind 0.0.0.0:$PORT` |
| **Instance Type** | **Free** |

> [!IMPORTANT]
> The **Root Directory** must be set to `backend`. This tells Render to run commands from inside the `backend/` folder. Without this, pip won't find `requirements.txt` and gunicorn won't find `wsgi.py`.

**Why these gunicorn flags?**
| Flag | Meaning |
|------|---------|
| `--workers 2` | 2 parallel processes to handle requests |
| `--threads 2` | 2 threads per worker (handles concurrent requests) |
| `--timeout 120` | Kill worker if it doesn't respond in 120 seconds |
| `--bind 0.0.0.0:$PORT` | Listen on Render's assigned port (`$PORT` is set by Render automatically) |

---

### STEP 6 — Set Environment Variables

Scroll down to the **"Environment Variables"** section on the same page (or go to **Dashboard → Your Service → Environment**).

Click **"Add Environment Variable"** for each of the following:

#### Required Variables

| Key | Value | Secret? |
|-----|-------|---------|
| `FLASK_ENV` | `production` | No |
| `FLASK_DEBUG` | `0` | No |
| `SECRET_KEY` | *(see below)* | **Yes — encrypt** |

**Generating SECRET_KEY:**

Open PowerShell and run:
```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```
Copy the output (e.g. `a3f8b2...`) and paste it as the value for `SECRET_KEY`. Mark it as **Secret** (click the lock icon).

#### Optional Variables (for email notifications)

| Key | Value | Secret? |
|-----|-------|---------|
| `SMTP_HOST` | `smtp.gmail.com` | No |
| `SMTP_PORT` | `587` | No |
| `SMTP_USER` | `your-email@gmail.com` | **Yes** |
| `SMTP_PASS` | *(Gmail App Password)* | **Yes** |
| `NOTIFY_EMAIL` | `your-email@gmail.com` | No |
| `ADMIN_KEY` | *(any password you choose)* | **Yes** |

> [!NOTE]
> Email is **optional**. Skip these if you don't need email notifications. Form submissions are always saved to `submissions.json` regardless.

**How to get a Gmail App Password:**
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Search for **"App passwords"**
4. Create a new App Password → select "Mail" → copy the 16-character code
5. Paste that code as `SMTP_PASS`

---

### STEP 7 — Deploy!

Click the **"Create Web Service"** button at the bottom of the page.

Render will:
1. **Clone** your GitHub repository
2. **Run** `pip install -r requirements.txt` (installs Flask, gunicorn, etc.)
3. **Start** `gunicorn wsgi:application ...`
4. **Assign** a free HTTPS URL like `https://disruptive-advertising-hci.onrender.com`

You can watch the live build logs in the **"Logs"** tab.

**Build log should look like:**
```
==> Cloning from https://github.com/...
==> Checking out commit abc1234
==> Running build command: pip install -r requirements.txt
    Successfully installed flask-3.1.3 gunicorn-26.0.0 ...
==> Starting service with: gunicorn wsgi:application ...
    [INFO] Starting gunicorn 26.0.0
    [INFO] Listening at: http://0.0.0.0:10000
    [INFO] Booting worker with pid: 123
```

When you see **"Your service is live"** — you're done! 🎉

---

### STEP 8 — Verify Your Live Site

Your site is now at: `https://disruptive-advertising-hci.onrender.com`

Test these URLs:

| URL | Expected Result |
|-----|----------------|
| `https://your-app.onrender.com/` | Original homepage |
| `https://your-app.onrender.com/improved` | HCI-Improved version |
| `https://your-app.onrender.com/contact` | Contact page |
| `https://your-app.onrender.com/api/health` | `{"status": "ok", ...}` |
| `https://your-app.onrender.com/sitemap.xml` | XML sitemap |
| `https://your-app.onrender.com/robots.txt` | robots.txt |

---

## Using the `render.yaml` Blueprint (Alternative Method)

Your project already includes a `render.yaml` file at the root. This allows **one-click deployment** using Render Blueprints.

**How to use it:**

1. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
2. Click **"New Blueprint Instance"**
3. Connect your GitHub repository
4. Render reads `render.yaml` and pre-fills all settings automatically
5. You only need to add the **secret** environment variables manually
6. Click **"Apply"** — done!

This is the fastest method if your `render.yaml` is committed to GitHub.

---

## Auto-Deploy on Every Git Push

Once deployed, every time you push code to GitHub's `main` branch, Render **automatically rebuilds and redeploys** your site.

```powershell
# Make a change to any file, then:
git add .
git commit -m "Update: improved homepage section"
git push origin main
# → Render detects the push and redeploys automatically
```

You can watch the new deployment in **Dashboard → Your Service → Events**.

To **disable** auto-deploy: Dashboard → Settings → Auto-Deploy → Off.

---

## Adding a Custom Domain

**Free Render custom domains are supported:**

1. Go to **Dashboard → Your Service → Settings → Custom Domains**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g. `yourdomain.com`)
4. Render shows you a **CNAME record** to add to your DNS provider
5. Add the record to your domain's DNS settings (GoDaddy, Namecheap, Cloudflare, etc.)
6. Wait 5–10 minutes for DNS propagation
7. Render automatically issues an **SSL certificate** (free Let's Encrypt)

---

## Viewing Form Submissions on Render

Form submissions are saved to `submissions.json` inside the container. You can view them via the API:

```bash
# Replace with your actual Render URL and admin key
curl "https://your-app.onrender.com/api/submissions?key=YOUR-ADMIN-KEY"
```

> [!WARNING]
> On the **free tier**, the filesystem is **ephemeral** — `submissions.json` is **reset** every time the service redeploys or restarts. For persistent storage, you would need to:
> - Use **Render's persistent disk** (paid feature, $0.25/GB/month), OR
> - Connect a free **PostgreSQL database** on Render

**To add a Render Disk** (keeps submissions.json across deploys):
1. Dashboard → Your Service → Disks → Add Disk
2. Mount path: `/var/data`
3. Update `app.py` to use `SUBMISSIONS_FILE = /var/data/submissions.json`

---

## Troubleshooting

### ❌ "Build failed: No module named flask"

**Cause:** Root Directory not set to `backend`, so pip can't find `requirements.txt`.

**Fix:**
- Dashboard → Your Service → Settings → Build & Deploy
- Set **Root Directory** to `backend`
- Trigger a manual deploy: **Events → Deploy latest commit**

---

### ❌ "Application failed to respond"

**Cause:** Gunicorn start command is wrong, or `wsgi.py` has an import error.

**Fix:** Check the **Logs** tab for the exact error. Common causes:
1. Wrong start command — ensure it is exactly:
   ```
   gunicorn wsgi:application --workers 2 --threads 2 --timeout 120 --bind 0.0.0.0:$PORT
   ```
2. Missing `$PORT` — Render **requires** `--bind 0.0.0.0:$PORT` (not a hardcoded port number)
3. Import error in `app.py` — look for `ModuleNotFoundError` in logs

---

### ❌ "404 Not Found" on all pages

**Cause:** Flask can't find the `frontend/` templates because the directory structure is wrong relative to the `backend/` root.

**Fix:** The `app.py` uses `template_folder="../frontend"` which works because we set `rootDir: backend` in `render.yaml`. If this still fails, verify the folder structure in GitHub matches:
```
backend/
  app.py
  wsgi.py
  requirements.txt
frontend/
  index.html
  improved.html
  ...
```

---

### ❌ Site is very slow (30–60 second first load)

**Cause:** Free tier spin-down after 15 minutes of inactivity.

**Fix Options:**
- **Option A (Free):** Use a service like [UptimeRobot](https://uptimerobot.com) (free) to ping your site every 14 minutes — prevents sleep
- **Option B (Paid):** Upgrade to Render Starter plan ($7/month) — always-on

---

### ❌ CSS/JS not loading (404 on /assets/)

**Cause:** Static files served via Flask's `static_folder` — this depends on the relative path from `backend/` to `frontend/assets/`.

**Check:** In `app.py`, the Flask app is configured as:
```python
static_folder="../frontend/assets"
static_url_path="/assets"
```
This means Flask looks for `frontend/assets/` one directory **above** `backend/`. As long as your GitHub repo has both `backend/` and `frontend/` at the same level, this works automatically.

---

## Summary — All Commands

```powershell
# 1. Navigate to project
cd "c:\Users\anas1\OneDrive\Documents\dsrubtive advertising copy wrt hci principles"

# 2. Initialize git (first time only)
git init
git branch -M main

# 3. Stage and commit all files
git add .
git commit -m "Initial commit: Disruptive Advertising HCI project"

# 4. Add GitHub remote (replace URL)
git remote add origin https://github.com/YOUR-USERNAME/disruptive-advertising-hci.git

# 5. Push to GitHub
git push -u origin main

# Then: create Web Service on render.com using the settings above
# Your live URL: https://disruptive-advertising-hci.onrender.com

# --- For future updates ---
git add .
git commit -m "Your change description"
git push origin main
# Render auto-redeploys in ~2 minutes
```

---

## Render vs VPS vs Local — Quick Comparison

| | Render (Free) | Render (Starter) | VPS (Nginx+Gunicorn) |
|---|---|---|---|
| Cost | Free | $7/month | $4–20/month |
| Setup difficulty | ⭐ Very Easy | ⭐ Very Easy | ⭐⭐⭐ Advanced |
| Sleeps on inactivity | Yes (15 min) | No | No |
| Custom domain | ✅ | ✅ | ✅ |
| SSL (HTTPS) | ✅ Auto | ✅ Auto | Manual (Certbot) |
| Persistent storage | ❌ (ephemeral) | ✅ (add disk) | ✅ Native |
| Best for | Demo / grading | Small production | Full control |
