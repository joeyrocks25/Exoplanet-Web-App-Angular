# app/services/authentication_service.py
from flask_jwt_extended import create_access_token, get_jwt_identity
from app.models.user_model import User
from app.utils.authentication_utils import hash_password, verify_password

def register_user(data):
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    dob_str = data.get('dob')

    if not username or not email or not password or not dob_str:
        return {'message': 'Incomplete data'}, 400

    # Convert dob string to a datetime object
    dob = datetime.strptime(dob_str, '%Y-%m-%d')

    hashed_password = hash_password(password)

    new_user = User(username=username, email=email, password=hashed_password, dob=dob)
    new_user.save()

    return {'message': 'User registered successfully'}, 201

def login_user(data):
    username = data.get('username')
    password = data.get('password')

    user = User.objects(username=username).first()

    if user and verify_password(user.password, password):
        access_token = create_access_token(identity=username)
        return {'access_token': access_token}, 200
    else:
        return {'message': 'Invalid credentials'}, 401

def get_current_user():
    current_user = get_jwt_identity()
    user = User.objects(username=current_user).first()

    if user:
        return {'username': user.username, 'email': user.email}, 200
    else:
        return {'message': 'User not found'}, 404
