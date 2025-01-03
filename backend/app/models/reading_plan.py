from datetime import datetime
from app.extensions import db
from app.utils.reading_plans import PLAN_TYPES


class ReadingPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_read_date = db.Column(db.DateTime)
    current_day = db.Column(db.Integer, default=1)
    completed = db.Column(db.Boolean, default=False)
    streak = db.Column(db.Integer, default=0)

    def get_progress(self):
        total_readings = DailyReading.query.filter_by(plan_id=self.id).count()
        completed_readings = DailyReading.query.filter_by(
            plan_id=self.id,
            completed=True
        ).count()

        return {
            'total_days': len(PLAN_TYPES['GENESIS_TO_REV']),
            'current_day': self.current_day,
            'completed_readings': completed_readings,
            'total_readings': total_readings,
            'percentage': round((completed_readings / total_readings) * 100, 2) if total_readings > 0 else 0
        }


class DailyReading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plan_id = db.Column(db.Integer, db.ForeignKey(
        'reading_plan.id'), nullable=False)
    day = db.Column(db.Integer, nullable=False)
    book = db.Column(db.String(100), nullable=False)
    chapter = db.Column(db.Integer, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)
    notes = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'day': self.day,
            'book': self.book,
            'chapter': self.chapter,
            'completed': self.completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'notes': self.notes
        }
