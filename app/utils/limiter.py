from flask_limiter import Limiter

limiter = None


def init_limiter(app):
    global limiter
    limiter = Limiter(app)
    return limiter
