# Procfile — Heroku-style process file (Render also supports this)
# Used as a fallback if render.yaml is not present, OR for manual service setup.
# Start command: gunicorn from inside the backend/ folder
web: cd backend && gunicorn wsgi:application --workers 2 --threads 2 --timeout 120 --bind 0.0.0.0:$PORT
