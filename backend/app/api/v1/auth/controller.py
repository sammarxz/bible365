from flask_jwt_extended import create_access_token
from flask import url_for
from app.models.user import User
from app.utils import oauth
from app.utils.errors import APIError
from app.extensions import db


class AuthController:
    @staticmethod
    def register(data):
        if User.query.filter_by(email=data['email']).first():
            raise APIError('Email already registered', status_code=409)

        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        return {'message': 'User registered successfully'}, 201

    @staticmethod
    def login(data):
        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            raise APIError('Invalid credentials', status_code=401)

        access_token = create_access_token(identity=str(user.id))

        return {'access_token': access_token}, 200

    @staticmethod
    def google_auth():
        redirect_uri = url_for('auth', _external=True)
        return oauth.google.authorize_redirect(redirect_uri)
        # user = User.query.filter_by(email=user_info['email']).first()

        # # Se o usuário não existir, criar um novo
        # if not user:
        #     user = User(
        #         email=user_info['email'],
        #         # Usar o nome fornecido ou o email
        #         username=user_info.get('name', user_info['email']),
        #         oauth_provider='google',
        #     )
        #     db.session.add(user)
        #     db.session.commit()

        # access_token = create_access_token(identity=str(user.id))

        # return {'access_token': access_token}
