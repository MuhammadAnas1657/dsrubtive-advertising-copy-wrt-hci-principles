"""
API routes — form submission, audit request, health check
All data saved to submissions.json (no database required)
"""
import os
import json
import re
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app

api_bp = Blueprint("api", __name__)


def load_submissions():
    path = current_app.config["SUBMISSIONS_FILE"]
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_submission(entry):
    path = current_app.config["SUBMISSIONS_FILE"]
    data = load_submissions()
    data.append(entry)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def is_valid_email(email):
    return re.match(r"^[^@]+@[^@]+\.[^@]+$", email) is not None


@api_bp.route("/health")
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()})


@api_bp.route("/contact", methods=["POST"])
def contact():
    """
    Contact form submission handler.
    Accepts JSON or form-data with: name, email, company, phone, message, form_type
    """
    data = request.get_json(silent=True) or request.form.to_dict()

    # Validate required fields
    required = ["name", "email"]
    errors = {}
    for field in required:
        if not data.get(field, "").strip():
            errors[field] = f"{field.capitalize()} is required."

    if data.get("email") and not is_valid_email(data["email"]):
        errors["email"] = "Please enter a valid email address."

    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    entry = {
        "id": datetime.utcnow().strftime("%Y%m%d%H%M%S%f"),
        "timestamp": datetime.utcnow().isoformat(),
        "type": data.get("form_type", "contact"),
        "name": data.get("name", "").strip(),
        "email": data.get("email", "").strip(),
        "company": data.get("company", "").strip(),
        "phone": data.get("phone", "").strip(),
        "website": data.get("website", "").strip(),
        "budget": data.get("budget", "").strip(),
        "services": data.get("services", ""),
        "message": data.get("message", "").strip(),
        "source": request.headers.get("Referer", "unknown")
    }

    try:
        save_submission(entry)
        print(f"[SUBMISSION] New contact from {entry['name']} <{entry['email']}>")
    except Exception as e:
        print(f"[ERROR] Could not save submission: {e}")

    # Try to send email notification (non-blocking)
    try:
        from services.email_service import send_notification
        send_notification(entry)
    except Exception as e:
        print(f"[EMAIL] Notification skipped: {e}")

    return jsonify({
        "success": True,
        "message": "Thank you! We'll be in touch within 1 business day."
    }), 200


@api_bp.route("/audit", methods=["POST"])
def audit():
    """
    Free marketing audit request handler.
    Accepts: name, email, website, monthly_budget
    """
    data = request.get_json(silent=True) or request.form.to_dict()

    errors = {}
    if not data.get("name", "").strip():
        errors["name"] = "Name is required."
    if not data.get("email", "").strip():
        errors["email"] = "Email is required."
    elif not is_valid_email(data["email"]):
        errors["email"] = "Please enter a valid email address."
    if not data.get("website", "").strip():
        errors["website"] = "Website URL is required."

    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    entry = {
        "id": datetime.utcnow().strftime("%Y%m%d%H%M%S%f"),
        "timestamp": datetime.utcnow().isoformat(),
        "type": "audit_request",
        "name": data.get("name", "").strip(),
        "email": data.get("email", "").strip(),
        "website": data.get("website", "").strip(),
        "monthly_budget": data.get("monthly_budget", "").strip(),
        "company_size": data.get("company_size", "").strip(),
        "current_services": data.get("current_services", ""),
    }

    try:
        save_submission(entry)
        print(f"[AUDIT REQUEST] From {entry['name']} — site: {entry['website']}")
    except Exception as e:
        print(f"[ERROR] Could not save audit request: {e}")

    return jsonify({
        "success": True,
        "message": "Audit request received! Our team will review your site and reach out within 24 hours."
    }), 200


@api_bp.route("/submissions", methods=["GET"])
def get_submissions():
    """
    View all submissions (admin endpoint — protect with auth in production)
    """
    secret = request.args.get("key", "")
    if secret != os.getenv("ADMIN_KEY", "changeme"):
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify(load_submissions()), 200
