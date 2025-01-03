import pytest
from app.models.user import User
from app.api.v1.auth.controller import AuthController
from app.utils.errors import APIError


class TestAuthController:
    def test_register_success(self, app, db):
        """Testa registro de usuário com sucesso"""
        with app.app_context():
            data = {
                'username': 'newuser',
                'email': 'new@example.com',
                'password': 'password123'
            }
            response, status_code = AuthController.register(data)

            assert status_code == 201
            assert response['message'] == 'User registered successfully'

            # Verifica se usuário foi criado
            user = User.query.filter_by(email='new@example.com').first()
            assert user is not None
            assert user.username == 'newuser'
            assert user.check_password('password123')

    def test_register_duplicate_email(self, app, db, test_user):
        """Testa tentativa de registro com email duplicado"""
        with app.app_context():
            data = {
                'username': 'another',
                'email': test_user.email,
                'password': 'password123'
            }

            with pytest.raises(APIError) as error:
                AuthController.register(data)

            assert error.value.status_code == 409
            assert 'Email already registered' in str(error.value)

    def test_login_success(self, app, db, test_user):
        """Testa login com credenciais válidas"""
        with app.app_context():
            data = {
                'email': test_user.email,
                'password': 'password123'
            }
            response, status_code = AuthController.login(data)

            assert status_code == 200
            assert 'access_token' in response

    def test_login_invalid_password(self, app, db, test_user):
        """Testa login com senha inválida"""
        with app.app_context():
            data = {
                'email': test_user.email,
                'password': 'wrongpassword'
            }

            with pytest.raises(APIError) as error:
                AuthController.login(data)

            assert error.value.status_code == 401
            assert 'Invalid credentials' in str(error.value)

    def test_login_nonexistent_user(self, app, db):
        """Testa login com usuário inexistente"""
        with app.app_context():
            data = {
                'email': 'nonexistent@example.com',
                'password': 'password123'
            }

            with pytest.raises(APIError) as error:
                AuthController.login(data)

            assert error.value.status_code == 401
            assert 'Invalid credentials' in str(error.value)

    def test_google_auth_new_user(self, app, db):
        """Testa autenticação Google para novo usuário"""
        with app.app_context():
            user_info = {
                'email': 'google@example.com',
                'name': 'Google User'
            }

            response = AuthController.google_auth(user_info)

            assert 'access_token' in response

            # Verifica se usuário foi criado
            user = User.query.filter_by(email='google@example.com').first()
            assert user is not None
            assert user.username == 'Google User'
            assert user.oauth_provider == 'google'

    def test_google_auth_existing_user(self, app, db):
        """Testa autenticação Google para usuário existente"""
        with app.app_context():
            # Cria usuário primeiro
            user = User(
                email='google@example.com',
                username='Existing User',
                oauth_provider='google'
            )
            db.session.add(user)
            db.session.commit()

            user_info = {
                'email': 'google@example.com',
                'name': 'Google User'
            }

            response = AuthController.google_auth(user_info)

            assert 'access_token' in response

            # Verifica que não criou usuário duplicado
            users = User.query.filter_by(email='google@example.com').all()
            assert len(users) == 1


class TestAuthRoutes:
    def test_register_route(self, app, db, client):
        """Testa rota de registro"""
        response = client.post('/api/v1/auth/register', json={
            'username': 'routetest',
            'email': 'route@example.com',
            'password': 'password123'
        })

        assert response.status_code == 201
        assert 'message' in response.json

    def test_login_route(self, client, test_user):
        """Testa rota de login"""
        response = client.post('/api/v1/auth/login', json={
            'email': test_user.email,
            'password': 'password123'
        })

        assert response.status_code == 200
        assert 'access_token' in response.json
