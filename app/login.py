from flask import request, jsonify
from models import Users
from db_connection import app_support_session
from ecncryption_decryption import get_keys, encrypt

def login_details():
    data = request.json
    username = data["username"]
    password = data["password"]
    pu_key, pr_key = get_keys()
    encrypted_password = encrypt(password if type(password) == str else str(password), pu_key)

    user = app_support_session.query(Users).filter_by(email=username, password=encrypted_password).first()
    # active_status = app_support_session.query(Users.is_active).filter(Users.email == username).first()
    # if active_status[0]:
    
    if user:
        if user.is_active:
            return jsonify({"message": "Login successful", "is_super_user": user.is_super_user, "is_active": True}), 200
        else:
            return jsonify({"message": f"{username} is deactivated", "is_active": False}), 200
    return jsonify({"message": "Invalid Credentials"}), 400