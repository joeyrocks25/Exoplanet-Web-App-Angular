# app/utils/authentication_utils.py
from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    return generate_password_hash(password, method='sha256')

def verify_password(hashed_password, password):
    return check_password_hash(hashed_password, password)
