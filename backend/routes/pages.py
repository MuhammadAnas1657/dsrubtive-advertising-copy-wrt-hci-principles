"""
Page routes — serves HTML templates for Original and HCI-Improved versions
"""
from flask import Blueprint, render_template_string, send_from_directory
import os

pages_bp = Blueprint("pages", __name__)

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend"))


@pages_bp.route("/")
def index():
    """Original Disruptive Advertising copy"""
    with open(os.path.join(FRONTEND_DIR, "index.html"), encoding="utf-8") as f:
        return f.read()


@pages_bp.route("/improved")
def improved():
    """HCI-Improved version"""
    with open(os.path.join(FRONTEND_DIR, "improved.html"), encoding="utf-8") as f:
        return f.read()


@pages_bp.route("/contact")
def contact():
    """Standalone contact page"""
    with open(os.path.join(FRONTEND_DIR, "contact.html"), encoding="utf-8") as f:
        return f.read()
