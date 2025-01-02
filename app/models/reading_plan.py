from app.extensions import db
from datetime import datetime


class ReadingPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    current_chapter = db.Column(db.Integer, db.ForeignKey('chapter.id'))
    completed = db.Column(db.Boolean, default=False)
    progress = db.relationship('ReadingProgress', backref='plan', lazy=True)


class ReadingProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plan_id = db.Column(db.Integer, db.ForeignKey(
        'reading_plan.id'), nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey(
        'chapter.id'), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
