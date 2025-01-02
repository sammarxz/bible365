from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_caching import Cache
from authlib.integrations.flask_client import OAuth

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cache = Cache()
oauth = OAuth()
