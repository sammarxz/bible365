from app.extensions import db


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    chapters = db.Column(db.Integer, nullable=False)
    testament = db.Column(db.String(20), nullable=False)
    order = db.Column(db.Integer, nullable=False)


class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey("book.id"), nullable=False)
    number = db.Column(db.Integer, nullable=False)
    verses = db.relationship("Verse", backref="chapter", lazy=True)


class Verse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey(
        "chapter.id"), nullable=False)
    number = db.Column(db.Integer, nullable=False)
    text = db.Column(db.Text, nullable=False)
