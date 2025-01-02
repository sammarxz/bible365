from functools import wraps
from flask import request, jsonify
from marshmallow import Schema, fields, validate, ValidationError


class UserSchema(Schema):
    username = fields.Str(required=True, validate=[
        validate.Length(min=3, max=80),
        validate.Regexp(
            '^[a-zA-Z0-9_.-]+$', error='Username must contain only letters, numbers, and _ - .')
    ])
    email = fields.Email(required=True)
    password = fields.Str(
        required=True, validate=validate.Length(min=6), load_only=True)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class ReadingProgressSchema(Schema):
    plan_id = fields.Int(required=True)
    chapter_id = fields.Int(required=True)
    notes = fields.Str(validate=validate.Length(max=1000))


def validate_request(schema_class):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            schema = schema_class()
            try:
                schema.load(request.get_json())
                return f(*args, **kwargs)
            except ValidationError as err:
                return jsonify({"error": "Validation error", "messages": err.messages}), 400
        return wrapper
    return decorator
