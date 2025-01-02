import pytest
from app import create_app
from app.extensions import db
from app.models.bible import Book, Chapter
from app.models.user import User


@pytest.fixture
def app():
    app = create_app('testing')
    app.config['JWT_SECRET_KEY'] = 'test-key'

    with app.app_context():
        db.create_all()

        book = Book(name='Genesis', chapters=50, testament='Old', order=1)
        db.session.add(book)

        chapter = Chapter(book_id=1, number=1)
        db.session.add(chapter)

        db.session.commit()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_token(client):
    user = User(username='test', email='test@test.com')
    user.set_password('password')
    db.session.add(user)
    db.session.commit()

    response = client.post('/api/auth/login', json={
        'email': 'test@test.com',
        'password': 'password'
    })
    return response.json['access_token']
