from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.bible import Book, Chapter
from app.models.reading_plan import ReadingPlan, ReadingProgress
from app.extensions import db, cache
from app.utils import limiter
from . import auth_bp, bible_bp, reading_plan_bp


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409

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

    if user and user.check_password(data['password']):
        access_token = create_access_token(
            identity=str(user.id))  # Convertendo para string
        return jsonify({'access_token': access_token}), 200

    return jsonify({'error': 'Invalid credentials'}), 401


@bible_bp.route('/books', methods=['GET'])
@jwt_required()
@cache.cached(timeout=3600)
def get_books():
    try:
        current_user = get_jwt_identity()
        print(f"User ID: {current_user}")  # Debug
        books = Book.query.all()
        return jsonify({'books': [{'id': b.id, 'name': b.name} for b in books]})
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug
        return jsonify({'error': str(e)}), 500


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
