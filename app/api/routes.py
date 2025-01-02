from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.bible import Book, Chapter
from app.models.reading_plan import ReadingPlan, ReadingProgress
from app.extensions import db, cache
from app.utils.limiter import limiter
from app.utils.errors import APIError
from . import auth_bp, bible_bp, reading_plan_bp


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter_by(email=data['email']).first():
        raise APIError('Email already registered', status_code=409)

    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        raise APIError('Invalid credentials', status_code=401)

    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token}), 200


@bible_bp.route('/books', methods=['GET'])
@jwt_required()
@cache.cached(timeout=3600)
def get_books():
    try:
        books = Book.query.all()
        return jsonify({'books': [{'id': b.id, 'name': b.name} for b in books]})
    except Exception as e:
        raise APIError(str(e), status_code=500)


@bible_bp.route('/chapters/<int:book_id>', methods=['GET'])
@jwt_required()
def get_chapters(book_id):
    chapters = Chapter.query.filter_by(book_id=book_id).all()
    return jsonify([{
        'id': chapter.id,
        'number': chapter.number
    } for chapter in chapters])


@reading_plan_bp.route('/', methods=['POST'])
@jwt_required()
def create_plan():
    user_id = get_jwt_identity()
    plan = ReadingPlan(user_id=user_id)
    db.session.add(plan)
    db.session.commit()
    return jsonify({'message': 'Reading plan created', 'plan_id': plan.id}), 201


@reading_plan_bp.route('/progress', methods=['POST'])
@jwt_required()
def update_progress():
    data = request.get_json()
    progress = ReadingProgress(
        plan_id=data['plan_id'],
        chapter_id=data['chapter_id'],
        notes=data.get('notes', '')
    )
    db.session.add(progress)
    db.session.commit()
    return jsonify({'message': 'Progress updated'}), 200
