from flask import Blueprint
from .auth.routes import auth_bp
from .reading_plan.routes import reading_plan_bp

api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/v1')

api_v1.register_blueprint(auth_bp, url_prefix='/auth')
api_v1.register_blueprint(reading_plan_bp, url_prefix='/reading-plan')
