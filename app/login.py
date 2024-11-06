from flask import request, jsonify
from models import Users
from db_connection import app_support_session
from ecncryption_decryption import get_keys, encrypt
import jwt
import datetime

SECRET_KEY = 'Jay9820104922@#123'

def login_details():
    try:
        data = request.json
        username = data["username"]
        password = data["password"]
        pu_key, pr_key = get_keys()
        encrypted_password = encrypt(password if type(password) == str else str(password), pu_key)

        user = app_support_session.query(Users).filter_by(email=username, password=encrypted_password).first()
        if user:
            if user.is_active:
                expiry_time = (datetime.datetime.utcnow() + datetime.timedelta(hours=1)).isoformat()
                token = jwt.encode({
                    'user_id': user.id,
                    'expiry_time': expiry_time 
                }, SECRET_KEY, algorithm="HS256")
                
                return jsonify({
                    "message": "Login successful",
                    "is_super_user": user.is_super_user,
                    "is_active": True,
                    "token": token
                }), 200
            else:
                return jsonify({"message": f"{username} is deactivated", "is_active": False}), 200
        return jsonify({"message": "Invalid Credentials"}), 400
    except Exception as e:
        return jsonify({"message": "Exception in login.py", "error": str(e)}), 500