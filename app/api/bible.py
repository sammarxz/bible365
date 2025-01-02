from flask import jsonify
from flask_jwt_extended import jwt_required
from app.models.bible import Book, Chapter
from . import bible_bp


@bible_bp.route('/books', methods=['GET'])
@jwt_required()
def get_books():
    books = Book.query.order_by(Book.order).all()
    return jsonify([{
        'id': book.id,
        'name': book.name,
        'chapters': book.chapters,
        'testament': book.testament
    } for book in books])


@bible_bp.route('/chapters/<int:book_id>', methods=['GET'])
@jwt_required()
def get_chapters(book_id):
    chapters = Chapter.query.filter_by(book_id=book_id).all()
    return jsonify([{
        'id': chapter.id,
        'number': chapter.number
    } for chapter in chapters])
