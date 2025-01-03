import os

from authlib.integrations.flask_client import OAuth


CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')


def init_oauth(app):
    oauth = OAuth(app)

    if not app.config['GOOGLE_CLIENT_ID'] or not app.config['GOOGLE_CLIENT_SECRET']:
        raise ValueError('Google OAuth credentials not configured')

    oauth.register(
        name='google',
        server_metadata_url=CONF_URL,
        # client_id=app.config['GOOGLE_CLIENT_ID'],
        # client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        # authorize_url='https://accounts.google.com/o/oauth2/auth',
        # authorize_params=None,
        # token_url='https://accounts.google.com/o/oauth2/token',
        # userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
        client_kwargs={'scope': 'openid email profile'},
    )
    return oauth
