from datetime import datetime, timezone
from app.models.reading_plan import DailyReading, ReadingPlan
from app.utils.errors import APIError
from app.utils.reading_plans import PLAN_TYPES
from app.extensions import db


class ReadingPlanController:
    @staticmethod
    def create_plan(user_id, plan_type):
        # Verifica plano ativo
        if ReadingPlan.query.filter_by(user_id=user_id, completed=False).first():
            raise APIError('Usuário já possui um plano ativo', status_code=400)

        plan = ReadingPlan(user_id=user_id)
        db.session.add(plan)
        db.session.commit()

        if not plan.id:
            raise APIError('Falha ao criar o plano de leitura',
                           status_code=500)

        if plan_type == 'GENESIS_TO_REV':
            daily_readings = PLAN_TYPES['GENESIS_TO_REV']
        else:
            raise APIError('Tipo de plano inválido', status_code=400)

        for day_num, daily_readings in enumerate(daily_readings, 1):
            for reading in daily_readings:
                parts = reading.rsplit(' ', 1)

                if len(parts) != 2:
                    print(f"Erro ao processar leitura: {reading}")
                    continue

                book, chapter = parts
                try:
                    chapter = int(chapter)
                except ValueError:
                    print(f"Capítulo inválido: {chapter}")
                    continue  # Ignorar capítulos inválidos

                # Criação da leitura diária
                daily = DailyReading(
                    plan_id=plan.id,
                    day=day_num,
                    book=book,
                    chapter=chapter
                )
                db.session.add(daily)

        db.session.commit()
        return {'message': 'Plano criado com sucesso!', 'plan_id': plan.id}

    @staticmethod
    def get_todays_reading(user_id):
        plan = ReadingPlan.query.filter_by(
            user_id=user_id,
            completed=False
        ).first()

        if not plan:
            raise APIError('Nenhum plano ativo encontrado',
                           status_code=404)

        readings = DailyReading.query.filter_by(
            plan_id=plan.id,
            day=plan.current_day
        ).all()

        return {
            'day': plan.current_day,
            'streak': plan.streak,
            'readings': [reading.to_dict() for reading in readings],
            'progress': plan.get_progress()
        }

    @staticmethod
    def get_user_plan(user_id):
        """Obtém o plano ativo do usuário com detalhes"""
        plan = ReadingPlan.query.filter_by(
            user_id=user_id,
            completed=False
        ).first()

        if not plan:
            raise APIError('Nenhum plano ativo encontrado', status_code=404)

        return {
            'plan_id': plan.id,
            'current_day': plan.current_day,
            'streak': plan.streak,
            'start_date': plan.start_date.isoformat(),
            'last_read_date': plan.last_read_date.isoformat() if plan.last_read_date else None,
            'progress': plan.get_progress(),
            'todays_readings': [
                reading.to_dict() for reading in
                DailyReading.query.filter_by(
                    plan_id=plan.id,
                    day=plan.current_day
                ).all()
            ]
        }

    @staticmethod
    def mark_reading_completed(user_id, chapter_id):
        """Marca uma leitura específica como concluída"""
        plan = ReadingPlan.query.filter_by(
            user_id=user_id,
            completed=False
        ).first()

        if not plan:
            raise APIError('Nenhum plano ativo encontrado', status_code=404)

        reading = DailyReading.query.filter_by(
            id=chapter_id,
            plan_id=plan.id,
            completed=False
        ).first()

        if not reading:
            raise APIError(
                'Leitura não encontrada ou já concluída', status_code=404)

        reading.completed = True
        reading.completed_at = datetime.now(timezone.utc)

        # Verifica se todas as leituras do dia foram completadas
        pending_readings = DailyReading.query.filter_by(
            plan_id=plan.id,
            day=plan.current_day,
            completed=False
        ).count()

        if pending_readings == 0:  # Esta é a última leitura do dia
            # Atualiza o dia atual e streak
            plan.current_day += 1
            now = datetime.now(timezone.utc)

            if plan.last_read_date:
                time_since_last = now - plan.last_read_date
                if time_since_last.days <= 1:
                    plan.streak += 1
                else:
                    plan.streak = 1
            else:
                plan.streak = 1

            plan.last_read_date = now

            # Verifica se o plano foi completado
            if plan.current_day > len(PLAN_TYPES['GENESIS_TO_REV']):
                plan.completed = True

        db.session.commit()

        return {
            'message': 'Leitura marcada como concluída',
            'progress': plan.get_progress()
        }

    @staticmethod
    def get_reading_history(user_id, page=1, per_page=10):
        """Retorna histórico de leituras paginado"""
        readings = DailyReading.query.join(ReadingPlan).filter(
            ReadingPlan.user_id == user_id,
            DailyReading.completed == True
        ).order_by(
            DailyReading.completed_at.desc()
        ).paginate(
            page=page,
            per_page=per_page
        )

        return {
            'readings': [reading.to_dict() for reading in readings.items],
            'total': readings.total,
            'pages': readings.pages,
            'current_page': page,
            'per_page': per_page,
            'has_next': readings.has_next,
            'has_prev': readings.has_prev
        }
