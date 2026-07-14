"""
WSGI entry point for Gunicorn / VPS deployment
Usage: gunicorn --bind 0.0.0.0:5000 wsgi:application
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app

application = create_app()

if __name__ == "__main__":
    application.run()
