from flask import Flask
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from flask_cors import CORS
# controllers
from controllers.authentication_controller import auth_bp
from controllers.deck_controller import deck_bp
from controllers.exoplanet_controller import exoplanets_bp


app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=["http://localhost:4200"])


# MongoDB configuration
app.config['MONGODB_SETTINGS'] = {
    'db': 'test',
    'host': 'mongodb://localhost:27017/test',
}

db = MongoEngine(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth/v1.0')
app.register_blueprint(deck_bp, url_prefix='/api/v1.0')
app.register_blueprint(exoplanets_bp, url_prefix='/collections/v1.0')

app.config['JWT_SECRET_KEY'] = 'your-secret-key'

# Initialize the JWTManager
jwt = JWTManager(app)

# Your other app configuration and route imports go here

if __name__ == '__main__':
    app.run(debug=True)
