import pytest
from datetime import datetime, timedelta, timezone
from app.models.reading_plan import ReadingPlan, DailyReading
from app.api.v1.reading_plan.controller import ReadingPlanController
from app.utils.errors import APIError
from app.utils.reading_plans import PLAN_TYPES


class TestReadingPlanController:
    def test_get_user_plan_success(self, app, db, test_user, active_plan):
        """Testa obtenção do plano do usuário com sucesso"""
        with app.app_context():
            result = ReadingPlanController.get_user_plan(test_user.id)

            assert result['plan_id'] == active_plan.id
            assert result['current_day'] == 1
            assert result['streak'] == 0
            assert 'progress' in result
            assert len(result['todays_readings']) == 3  # 3 capítulos por dia

            # Verifica primeiro capítulo
            first_reading = result['todays_readings'][0]
            assert first_reading['book'] == 'Genesis'
            assert first_reading['chapter'] == 1

    def test_get_user_plan_no_active_plan(self, app, db, test_user):
        """Testa obtenção de plano quando não existe plano ativo"""
        with app.app_context():
            with pytest.raises(APIError) as error:
                ReadingPlanController.get_user_plan(test_user.id)

            assert error.value.status_code == 404
            assert 'Nenhum plano ativo encontrado' in str(error.value)

    def test_mark_reading_completed_success(self, app, db, test_user, active_plan):
        """Testa marcação de leitura como concluída"""
        with app.app_context():
            # Pega primeira leitura do dia
            reading = DailyReading.query.filter_by(
                plan_id=active_plan.id,
                day=1
            ).first()

            result = ReadingPlanController.mark_reading_completed(
                test_user.id,
                reading.id
            )

            assert 'message' in result
            assert 'progress' in result

            # Verifica se leitura foi marcada como concluída
            updated_reading = DailyReading.query.get(reading.id)
            assert updated_reading.completed
            assert updated_reading.completed_at is not None

    def test_mark_all_daily_readings_completed(self, app, db, test_user, active_plan):
        """Testa conclusão de todas as leituras do dia"""
        with app.app_context():
            readings = DailyReading.query.filter_by(
                plan_id=active_plan.id,
                day=1
            ).all()

            # Marca todas as leituras do dia como concluídas
            for reading in readings:
                ReadingPlanController.mark_reading_completed(
                    test_user.id,
                    reading.id
                )

            # Verifica se o plano avançou para o próximo dia
            updated_plan = ReadingPlan.query.get(active_plan.id)
            assert updated_plan.current_day == 2
            assert updated_plan.streak == 1

    def test_mark_reading_invalid_chapter(self, app, db, test_user, active_plan):
        """Testa marcação de leitura com capítulo inválido"""
        with app.app_context():
            with pytest.raises(APIError) as error:
                ReadingPlanController.mark_reading_completed(
                    test_user.id,
                    999999  # ID inválido
                )

            assert error.value.status_code == 404
            assert 'Leitura não encontrada' in str(error.value)

    def test_get_reading_history(self, app, db, test_user, active_plan):
        """Testa obtenção do histórico de leituras"""
        with app.app_context():
            # Marca as leituras existentes como concluídas
            readings = DailyReading.query.filter_by(
                plan_id=active_plan.id,
                day=1
            ).all()

            for reading in readings:
                reading.completed = True
                reading.completed_at = datetime.now(timezone.utc)

            db.session.commit()

            # Busca histórico
            result = ReadingPlanController.get_reading_history(
                test_user.id,
                page=1,
                per_page=10
            )

            assert len(result['readings']) == 3
            assert result['total'] == 3
            assert all(r['completed'] for r in result['readings'])

    def test_reading_streak_maintenance(self, app, db, test_user, active_plan):
        """Testa manutenção do streak de leitura"""
        with app.app_context():
            # Criar leituras para o dia 1 e 2
            readings_day1 = [
                DailyReading(
                    plan_id=active_plan.id,
                    day=1,
                    book='Genesis',
                    chapter=i
                ) for i in range(1, 4)
            ]

            readings_day2 = [
                DailyReading(
                    plan_id=active_plan.id,
                    day=2,
                    book='Genesis',
                    chapter=i
                ) for i in range(4, 7)
            ]

            for reading in readings_day1 + readings_day2:
                db.session.add(reading)
            db.session.commit()

            # Completa leituras do dia 1
            for reading in readings_day1:
                ReadingPlanController.mark_reading_completed(
                    test_user.id,
                    reading.id
                )

            # Verifica streak inicial
            plan = ReadingPlan.query.get(active_plan.id)
            assert plan.streak == 0

            # Simula passagem de tempo
            plan.last_read_date = datetime.utcnow() - timedelta(days=2)
            db.session.commit()

            # Completa uma leitura do dia 2
            ReadingPlanController.mark_reading_completed(
                test_user.id,
                readings_day2[0].id
            )

            # Verifica que streak foi resetado
            plan = ReadingPlan.query.get(active_plan.id)
            assert plan.streak == 0

    def test_plan_completion(self, app, db, test_user, active_plan):
        """Testa conclusão do plano"""
        with app.app_context():
            # Pegar o último dia do plano
            total_days = len(PLAN_TYPES['GENESIS_TO_REV'])

            # Criar leituras para o último dia
            last_day_readings = [
                DailyReading(
                    plan_id=active_plan.id,
                    day=total_days,
                    book='Revelation',
                    chapter=i
                ) for i in range(20, 23)  # últimos capítulos
            ]

            for reading in last_day_readings:
                db.session.add(reading)

            # Atualiza plano para último dia
            active_plan.current_day = total_days
            db.session.commit()

            # Marca leituras como concluídas
            for reading in last_day_readings:
                ReadingPlanController.mark_reading_completed(
                    test_user.id,
                    reading.id
                )

            # Verifica que o plano foi marcado como concluído
            updated_plan = ReadingPlan.query.get(active_plan.id)
            assert updated_plan.completed
