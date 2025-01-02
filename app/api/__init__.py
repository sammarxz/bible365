from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
bible_bp = Blueprint('bible', __name__)
reading_plan_bp = Blueprint('reading_plan', __name__)


def init_app(app):
    from . import routes  # noqa: F401
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(bible_bp, url_prefix='/api/bible')
    app.register_blueprint(reading_plan_bp, url_prefix='/api/reading-plan')
