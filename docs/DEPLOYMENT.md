# VPS Deployment Guide
## Disruptive Advertising Copy — HCI Subject Project

---

## Prerequisites on Your VPS

| Software | How to Install |
|----------|---------------|
| Ubuntu 22.04 LTS | (OS) |
| Python 3.10+ | `sudo apt install python3 python3-pip python3-venv` |
| Nginx | `sudo apt install nginx` |
| Git | `sudo apt install git` |
| Certbot (SSL) | `sudo apt install certbot python3-certbot-nginx` |

---

## Step 1 — Upload Project to VPS

**Option A: Using Git**
```bash
# On VPS
git clone https://github.com/yourusername/disruptive-copy.git /var/www/disruptive-copy
```

**Option B: Using SCP (from your Windows machine)**
```powershell
# Replace your-vps-ip with your actual VPS IP
scp -r "c:\Users\anas1\OneDrive\Documents\dsrubtive advertising copy wrt hci principles" user@your-vps-ip:/var/www/disruptive-copy
```

---

## Step 2 — Set Up Python Environment on VPS

```bash
cd /var/www/disruptive-copy/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Step 3 — Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Edit with your real values:
```env
FLASK_ENV=production
FLASK_DEBUG=0
SECRET_KEY=generate-a-long-random-string-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-gmail-app-password
NOTIFY_EMAIL=notify@yourdomain.com
ADMIN_KEY=choose-a-strong-admin-key
```

> **Generate SECRET_KEY:** `python3 -c "import secrets; print(secrets.token_hex(32))"`

---

## Step 4 — Create Log Directory

```bash
sudo mkdir -p /var/log/disruptive-copy
sudo chown www-data:www-data /var/log/disruptive-copy
```

---

## Step 5 — Install Systemd Service

```bash
# Copy the service file
sudo cp /var/www/disruptive-copy/backend/deployment/disruptive-copy.service \
        /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable disruptive-copy

# Start the service
sudo systemctl start disruptive-copy

# Check it's running
sudo systemctl status disruptive-copy
```

**Expected output:**
```
● disruptive-copy.service - Disruptive Advertising Copy — Flask/Gunicorn
     Loaded: loaded (/etc/systemd/system/disruptive-copy.service; enabled)
     Active: active (running)
```

---

## Step 6 — Configure Nginx

```bash
# Copy nginx config
sudo cp /var/www/disruptive-copy/backend/deployment/nginx.conf \
        /etc/nginx/sites-available/disruptive-copy

# Edit domain name
sudo nano /etc/nginx/sites-available/disruptive-copy
# Replace "yourdomain.com" with your actual domain

# Enable the site
sudo ln -s /etc/nginx/sites-available/disruptive-copy \
           /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Add rate limiting to nginx.conf http block
sudo nano /etc/nginx/nginx.conf
# Add inside the http {} block:
# limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/m;

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## Step 7 — SSL Certificate (Let's Encrypt)

```bash
# Make sure your domain points to the VPS IP first!

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

Certbot will automatically update your nginx config with SSL settings.

---

## Step 8 — Set File Permissions

```bash
sudo chown -R www-data:www-data /var/www/disruptive-copy
sudo chmod -R 755 /var/www/disruptive-copy
sudo chmod 660 /var/www/disruptive-copy/backend/submissions.json 2>/dev/null || true
```

---

## Step 9 — Verify Deployment

```bash
# Test API health
curl https://yourdomain.com/api/health

# Expected:
# {"status": "ok", "timestamp": "2026-07-14T17:00:00"}
```

Open in browser:
- `https://yourdomain.com/` → Original copy
- `https://yourdomain.com/improved` → HCI-improved version
- `https://yourdomain.com/contact` → Contact page

---

## Useful Commands

```bash
# Restart app
sudo systemctl restart disruptive-copy

# View app logs
sudo journalctl -u disruptive-copy -f

# View nginx logs
sudo tail -f /var/log/nginx/disruptive-copy.access.log
sudo tail -f /var/log/nginx/disruptive-copy.error.log

# View form submissions (replace admin key)
curl "https://yourdomain.com/api/submissions?key=your-admin-key"

# Update code (if using git)
cd /var/www/disruptive-copy
git pull
sudo systemctl restart disruptive-copy
```

---

## Firewall Setup (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## DNS Configuration

Point your domain's DNS to your VPS IP:

| Type | Name | Value |
|------|------|-------|
| A | @ | your-vps-ip |
| A | www | your-vps-ip |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `502 Bad Gateway` | Gunicorn not running: `sudo systemctl start disruptive-copy` |
| `403 Forbidden` | Check file permissions: `sudo chown -R www-data:www-data /var/www/disruptive-copy` |
| SSL error | Domain DNS not propagated yet, or Certbot failed |
| Form not saving | Check `submissions.json` permissions and disk space |
| `ModuleNotFoundError` | Re-run `pip install -r requirements.txt` in venv |
