from unittest.mock import MagicMock


def test_google_login(client):
    with client.application.test_request_context():
        client.application.config['GOOGLE_CLIENT_ID'] = 'test-id'
        client.application.config['GOOGLE_CLIENT_SECRET'] = 'test-secret'
        response = client.get('/api/auth/login/google')
        assert response.status_code == 302


def test_google_authorized(client, mocker):
    mock_oauth = MagicMock()
    mock_oauth.google.authorize_access_token.return_value = {
        'access_token': 'fake-token'}
    mock_oauth.google.get.return_value.json.return_value = {
        'email': 'test@example.com',
        'name': 'Test User'
    }

    with client.application.test_request_context():
        mocker.patch('app.api.routes.oauth', mock_oauth)
        response = client.get('/api/auth/login/google/authorized')
        assert response.status_code == 200
        assert 'access_token' in response.json
