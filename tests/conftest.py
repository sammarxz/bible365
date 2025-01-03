import pytest
from datetime import datetime, timezone
from app import create_app
from app.extensions import db as _db
from app.models.user import User
from app.models.reading_plan import ReadingPlan, DailyReading
from app.utils.limiter import limiter


@pytest.fixture
def app():
    """Cria e configura uma nova aplicação para cada teste."""
    app = create_app('testing')
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': 'test-key'
    })

    return app


@pytest.fixture
def db(app):
    """Cria um banco de dados novo para cada teste."""
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def client(app):
    """Cria um cliente de teste."""
    return app.test_client()


@pytest.fixture
def test_user(db):
    """Cria um usuário de teste."""
    user = User(
        username='testuser',
        email='test@example.com'
    )
    user.set_password('password123')
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def auth_headers(client, test_user):
    """Cria headers de autenticação para o usuário de teste."""
    response = client.post('/api/v1/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def active_plan(db, test_user):
    """Cria um plano de leitura ativo para o usuário de teste."""
    plan = ReadingPlan(
        user_id=test_user.id,
        start_date=datetime.now(timezone.utc),
        current_day=1,
        completed=False
    )
    db.session.add(plan)
    db.session.commit()

    readings = [
        DailyReading(
            plan_id=plan.id,
            day=1,
            book='Genesis',
            chapter=i,
            completed=False
        ) for i in range(1, 4)  # 3 capítulos no dia 1
    ]

    for reading in readings:
        db.session.add(reading)
    db.session.commit()

    return plan


def active_plan_with_readings(db, test_user):
    """Cria um plano com algumas leituras já concluídas"""
    plan = ReadingPlan(
        user_id=test_user.id,
        current_day=1,
        completed=False,
        last_read_date=datetime.now(timezone.utc)
    )
    db.session.add(plan)
    db.session.commit()

    # Adiciona leituras concluídas
    readings = [
        DailyReading(
            plan_id=plan.id,
            day=1,
            book='Genesis',
            chapter=n,
            completed=True,
            completed_at=datetime.now(datetime.timezone.utc)
        ) for n in range(1, 4)
    ]

    for reading in readings:
        db.session.add(reading)
    db.session.commit()

    return plan


@pytest.fixture(autouse=True)
def disable_limiter():
    """Desabilita o rate limiting durante os testes"""
    limiter.enabled = False
    yield
    limiter.enabled = True
