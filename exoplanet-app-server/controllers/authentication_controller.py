from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from datetime import datetime, timedelta
from models.user_model import User
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth', __name__)


# Retrieves user details based on the JWT token.
# Requires a valid JWT token for authentication.
@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    try:
        username = get_jwt_identity()
        user = User.objects(username=username).first()

        if not user:
            return jsonify(message="User not found"), 404

        user_data = {
            'username': user.username,
            'password': user.password,
            'email': user.email,
            'dob': user.dob.strftime('%d/%m/%Y'),
            'decks': []
        }

        for deck in user.decks:
            deck_data = {
                'name': deck.name,
                'id': str(deck.id),
                'planets': [planet.to_mongo().to_dict() for planet in deck.planets]
            }
            user_data['decks'].append(deck_data)

        return jsonify(user_data), 200

    except Exception as e:
        print(f"Error during get_user: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Registers a new user.
# Expects JSON data with 'username', 'password', 'email', and 'dob' fields.
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        dob_str = data.get('dob')

        print(f"Received registration request with data: {data}")

        if not username or not password:
            print("Username and password are required")
            return jsonify(message='Username and password are required'), 400

        if User.objects(username=username):
            print(f"Username {username} already exists")
            return jsonify(message='Username already exists'), 400

        try:
            dob = datetime.strptime(dob_str, '%d/%m/%Y')
        except ValueError:
            print(f"Invalid date of birth format: {dob_str}")
            return jsonify(message='Invalid date of birth format'), 400

        new_user = User(username=username, password=password, email=email, dob=dob)
        new_user.save()

        access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
        print(f"User {username} registered successfully")
        return jsonify(message='User registered successfully', access_token=access_token), 201

    except Exception as e:
        print(f"Error during registration: {str(e)}")
        return jsonify(message='Internal Server Error'), 500



# Logs in an existing user.
# Expects JSON data with 'username' and 'password' fields.
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        user = User.objects(username=username).first()

        if not user or not user.check_password(password):
            return jsonify(message='Invalid username or password'), 401

        access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
        return jsonify(access_token=access_token), 200

    except Exception as e:
        print(f"Error during login: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Logs out the current user by invalidating the JWT token.
# Requires a valid JWT token for authentication.
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        current_user = get_jwt_identity()
        logger.info(f"Logout attempt for user: {current_user}")
        response = jsonify(message=f"User {current_user} logged out successfully")
        unset_jwt_cookies(response)
        logger.info(f"User {current_user} logged out successfully")
        return response, 200

    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Protected route requiring a valid JWT token.
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    try:
        username = get_jwt_identity()
        return jsonify(logged_in_as=username), 200

    except Exception as e:
        print(f"Error during protected: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Updates the details of the current user.
# Requires a valid JWT token for authentication.
@auth_bp.route('/user/update', methods=['PUT'])
@jwt_required()
def update_user():
    try:
        current_user = get_jwt_identity()
        data = request.json
        logger.info(f"Received update request for {current_user} with data: {data}")
        user = User.objects(username=current_user).first()

        if not user:
            return jsonify(message="User not found"), 404

        user.update_fields(data)

        if 'dob' in data:
            data['dob'] = datetime.strptime(data['dob'], '%d/%m/%Y').date()

        user.save()

        logger.info(f"User {current_user} updated successfully")
        return jsonify(message="User updated successfully"), 200

    except Exception as e:
        logger.error(f"Error during update_user: {str(e)}")
        return jsonify(message='Internal Server Error'), 500


# Deletes an existing user.
# Requires a valid JWT token for authentication.
@auth_bp.route('/user/delete', methods=['DELETE'])
@jwt_required()
def delete_user():
    try:
        current_user = get_jwt_identity()
        user = User.objects(username=current_user).first()

        if not user:
            return jsonify(message="User not found"), 404

        user.delete()
        return jsonify(message="User deleted successfully"), 200

    except Exception as e:
        print(f"Error during delete_user: {str(e)}")
        return jsonify(message='Internal Server Error'), 500
