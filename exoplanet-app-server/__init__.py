# app/__init__.py
from flask import Flask
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from app.config import Config

db = MongoEngine()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    from app.controllers.authentication_controller import auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    return app
