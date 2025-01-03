from flask import Flask
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from app.extensions import db, migrate, jwt, cache, oauth
from app.config import config
from app.utils.limiter import init_limiter
from app.utils.logging import setup_logging
from app.utils.errors import register_error_handlers
from app.utils.oauth import init_oauth
from app.utils.middleware import init_middleware


def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    app.config["CACHE_TYPE"] = "simple"

    # Configurar CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "https://bible365-api.onrender.com/"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Inicializar extensões
    cache.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    oauth.init_app(app)

    # Configurar utilitários
    init_oauth(app)
    setup_logging(app)
    init_limiter(app)
    init_middleware(app)
    register_error_handlers(app)

    # Swagger
    SWAGGER_URL = "/api/v1/docs"
    API_URL = "/static/swagger.json"
    swagger_bp = get_swaggerui_blueprint(
        SWAGGER_URL, API_URL, config={"app_name": "Bible365 API"}
    )
    app.register_blueprint(swagger_bp, url_prefix=SWAGGER_URL)

    # Registrar blueprints
    from app.api.v1 import api_v1
    app.register_blueprint(api_v1)

    return app
