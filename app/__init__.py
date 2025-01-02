from flask import Flask
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from app.extensions import db, migrate, jwt
from app.config import config
from app.utils.limiter import init_limiter
from app.utils.logging import setup_logging
from app.utils.errors import register_error_handlers
from app.utils.middleware import init_middleware
from app.extensions import cache


def create_app(config_name="development"):
    app = Flask(__name__)

    setup_logging(app)

    app.config.from_object(config[config_name])
    app.config["CACHE_TYPE"] = "simple"

    cache.init_app(app)
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    init_limiter(app)
    init_middleware(app)

    register_error_handlers(app)

    # Swagger config
    SWAGGER_URL = "/api/docs"
    API_URL = "/static/swagger.json"
    swagger_bp = get_swaggerui_blueprint(
        SWAGGER_URL, API_URL, config={"app_name": "Bible365 API"}
    )
    app.register_blueprint(swagger_bp, url_prefix=SWAGGER_URL)

    from app.api import init_app

    init_app(app)

    return app
