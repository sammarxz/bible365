from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate, jwt
from app.config import config


def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.api import auth_bp, bible_bp, reading_plan_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(bible_bp, url_prefix='/api/bible')
    app.register_blueprint(reading_plan_bp, url_prefix='/api/reading-plan')

    return app
