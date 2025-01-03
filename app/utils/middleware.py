import time
from flask import app, request, g


def timer_middleware():
    def decorator(f):
        def decorated_function(*args, **kwargs):
            start = time.time()
            response = f(*args, **kwargs)
            duration = time.time() - start

            # Log request duration
            app.logger.info(f'Request to {request.path} took {duration:.2f}s')

            # Add timing header
            response.headers['X-Response-Time'] = f'{duration:.2f}s'
            return response
        return decorated_function
    return decorator


def init_middleware(app):
    @app.before_request
    def before_request():
        g.start_time = time.time()

    @app.after_request
    def after_request(response):
        if hasattr(g, 'start_time'):
            duration = time.time() - g.start_time
            app.logger.info(f'{request.method} {request.path} {response.status_code} - {duration:.2f}s')

        return response
