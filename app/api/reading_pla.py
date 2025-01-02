from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.reading_plan import ReadingPlan, ReadingProgress
from app.extensions import db
from . import reading_plan_bp


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
