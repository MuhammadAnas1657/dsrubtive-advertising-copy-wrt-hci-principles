"""
Disruptive Advertising Website Copy — Flask Backend
HCI Subject Project
"""

import os
import json
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(
        __name__,
        template_folder="../frontend",
        static_folder="../frontend/assets",
        static_url_path="/assets"
    )

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-change-in-prod")
    app.config["SUBMISSIONS_FILE"] = os.path.join(os.path.dirname(__file__), "submissions.json")

    CORS(app)

    # Register blueprints
    from routes.pages import pages_bp
    from routes.api import api_bp

    app.register_blueprint(pages_bp)
    app.register_blueprint(api_bp, url_prefix="/api")

    # Serve sitemap.xml and robots.txt from frontend/static
    from flask import send_from_directory

    @app.route("/sitemap.xml")
    def sitemap():
        return send_from_directory("../frontend", "sitemap.xml", mimetype="application/xml")

    @app.route("/robots.txt")
    def robots():
        return send_from_directory("../frontend", "robots.txt", mimetype="text/plain")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=os.getenv("FLASK_DEBUG", "0") == "1")
