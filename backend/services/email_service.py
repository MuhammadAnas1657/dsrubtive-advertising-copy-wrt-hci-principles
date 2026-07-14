"""
Email notification service using Python smtplib
Configured via environment variables
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_notification(submission: dict):
    """
    Send email notification for new form submission.
    Silently fails if SMTP is not configured.
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    notify_email = os.getenv("NOTIFY_EMAIL", smtp_user)

    if not all([smtp_host, smtp_user, smtp_pass]):
        print("[EMAIL] SMTP not configured — skipping notification.")
        return

    subject_map = {
        "contact": "New Contact Form Submission",
        "audit_request": "New Free Audit Request",
    }
    subject = subject_map.get(submission.get("type", ""), "New Submission")

    body_lines = [
        f"<h2>{subject}</h2>",
        f"<p><strong>Time:</strong> {submission.get('timestamp', 'N/A')}</p>",
        f"<p><strong>Name:</strong> {submission.get('name', 'N/A')}</p>",
        f"<p><strong>Email:</strong> {submission.get('email', 'N/A')}</p>",
        f"<p><strong>Company:</strong> {submission.get('company', 'N/A')}</p>",
        f"<p><strong>Phone:</strong> {submission.get('phone', 'N/A')}</p>",
        f"<p><strong>Website:</strong> {submission.get('website', 'N/A')}</p>",
        f"<p><strong>Budget:</strong> {submission.get('monthly_budget', submission.get('budget', 'N/A'))}</p>",
        f"<p><strong>Message:</strong> {submission.get('message', 'N/A')}</p>",
        f"<p><strong>Source:</strong> {submission.get('source', 'N/A')}</p>",
    ]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = notify_email
    msg.attach(MIMEText("\n".join(body_lines), "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, notify_email, msg.as_string())
        print(f"[EMAIL] Notification sent to {notify_email}")
    except Exception as e:
        print(f"[EMAIL] Failed to send: {e}")
