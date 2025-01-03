from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.utils.errors import APIError
from .controller import ReadingPlanController

reading_plan_bp = Blueprint('reading_plan', __name__)


@reading_plan_bp.route('/types', methods=['GET'])
@jwt_required()
def get_plan_types():
    """Lista todos os tipos de planos disponíveis"""
    return jsonify(ReadingPlanController.get_plan_types())


@reading_plan_bp.route('/start/<string:plan_type>', methods=['POST'])
@jwt_required()
def start_plan(plan_type):
    """Inicia um novo plano de leitura"""
    user_id = get_jwt_identity()
    try:
        result = ReadingPlanController.create_plan(user_id, plan_type)
        return jsonify(result), 201
    except APIError as e:
        return jsonify({'error': str(e)}), e.status_code


@reading_plan_bp.route('/current', methods=['GET'])
@jwt_required()
def get_current_plan():
    """Obtém o plano atual do usuário"""
    user_id = get_jwt_identity()
    try:
        return jsonify(ReadingPlanController.get_user_plan(user_id))
    except APIError as e:
        return jsonify({'error': str(e)}), e.status_code


@reading_plan_bp.route('/complete/<int:chapter_id>', methods=['POST'])
@jwt_required()
def complete_reading(chapter_id):
    """Marca uma leitura como concluída"""
    user_id = get_jwt_identity()
    try:
        result = ReadingPlanController.mark_reading_completed(
            user_id, chapter_id)
        return jsonify(result)
    except APIError as e:
        return jsonify({'error': str(e)}), e.status_code


@reading_plan_bp.route('/history', methods=['GET'])
@jwt_required()
def get_reading_history():
    """Obtém histórico de leituras do usuário"""
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    result = ReadingPlanController.get_reading_history(
        user_id,
        page=page,
        per_page=per_page
    )
    return jsonify(result)
