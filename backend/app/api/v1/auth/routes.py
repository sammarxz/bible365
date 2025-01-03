from flask import Blueprint, jsonify, request, url_for
from app.utils.limiter import limiter
from .controller import AuthController
from app.schemas import UserSchema, LoginSchema, validate_request
from app.extensions import oauth
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/me')
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    })


@auth_bp.route('/register', methods=['POST'])
@validate_request(UserSchema)
def register():
    response, status_code = AuthController.register(request.get_json())
    return jsonify(response), status_code


@auth_bp.route('/login', methods=['POST'])
@validate_request(LoginSchema)
@limiter.limit("5 per minute")
def login():
    response, status_code = AuthController.login(request.get_json())
    return jsonify(response), status_code


@auth_bp.route('/login/google')
def google_login():
    return oauth.google.authorize_redirect(
        redirect_uri=url_for('auth.google_authorized', _external=True)
    )


@auth_bp.route('/login/google/authorized')
def google_authorized():
    oauth.google.authorize_access_token()
    user_info = oauth.google.get('userinfo').json()
    response = AuthController.google_auth(user_info)
    return jsonify(response)
