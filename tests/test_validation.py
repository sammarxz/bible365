import pytest
from app.schemas import UserSchema, LoginSchema, ReadingProgressSchema
from marshmallow import ValidationError


def test_valid_user_registration():
    schema = UserSchema()
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    }
    result = schema.load(data)
    assert result['username'] == data['username']
    assert result['email'] == data['email']


def test_invalid_username():
    schema = UserSchema()
    data = {
        'username': 'te',  # muito curto
        'email': 'test@example.com',
        'password': 'password123'
    }
    with pytest.raises(ValidationError) as err:
        schema.load(data)
    assert 'username' in err.value.messages


def test_invalid_email():
    schema = UserSchema()
    data = {
        'username': 'testuser',
        'email': 'invalid-email',
        'password': 'password123'
    }
    with pytest.raises(ValidationError) as err:
        schema.load(data)
    assert 'email' in err.value.messages


def test_short_password():
    schema = UserSchema()
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': '12345'  # muito curta
    }
    with pytest.raises(ValidationError) as err:
        schema.load(data)
    assert 'password' in err.value.messages


def test_valid_login():
    schema = LoginSchema()
    data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    result = schema.load(data)
    assert result['email'] == data['email']
    assert result['password'] == data['password']


def test_invalid_login_email():
    schema = LoginSchema()
    data = {
        'email': 'invalid-email',
        'password': 'password123'
    }
    with pytest.raises(ValidationError) as err:
        schema.load(data)
    assert 'email' in err.value.messages


def test_valid_reading_progress():
    schema = ReadingProgressSchema()
    data = {
        'plan_id': 1,
        'chapter_id': 1,
        'notes': 'Ótima leitura hoje!'
    }
    result = schema.load(data)
    assert result['plan_id'] == data['plan_id']
    assert result['chapter_id'] == data['chapter_id']


def test_invalid_reading_progress_notes():
    schema = ReadingProgressSchema()
    data = {
        'plan_id': 1,
        'chapter_id': 1,
        'notes': 'a' * 1001  # notas muito longas
    }
    with pytest.raises(ValidationError) as err:
        schema.load(data)
    assert 'notes' in err.value.messages


def test_missing_required_fields():
    schema = UserSchema()
    data = {
        'username': 'testuser'
        # faltando email e password
    }
    with pytest.raises(ValidationError) as err:
        schema.load(data)
    assert 'email' in err.value.messages
    assert 'password' in err.value.messages


def test_special_characters_username():
    schema = UserSchema()
    data = {
        'username': 'test@user!',
        'email': 'test@example.com',
        'password': 'password123'
    }
    with pytest.raises(ValidationError) as err:
        schema.load(data)
    assert 'username' in err.value.messages
