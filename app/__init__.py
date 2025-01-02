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

    from app.api import init_app
    init_app(app)

    return app
