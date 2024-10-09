from flask import request, jsonify
from models import Users
from db_connection import app_support_session
from ecncryption_decryption import get_keys, encrypt
import datetime

def add_user_details():
    try:
        data = request.json
        password = data['password']
        pu_key, pr_key = get_keys()

        existing_user = app_support_session.query(Users).filter_by(email=data["email"]).first()
        if existing_user:
            return jsonify({"message": "Email id already registered"}), 400
        
        encrypt_password = encrypt(password if type(password) == str else str(password), pu_key)
        is_superuser = data.get("isSuperuser", False)
        new_user = Users(
            email=data["email"],
            password=encrypt_password,
            is_super_user=is_superuser, 
            is_user_readonly=not is_superuser,
            is_active=True,
            created_dttm=datetime.datetime.now()
        )

        app_support_session.add(new_user)
        app_support_session.commit()
        return jsonify({"message": "User added successfully"}), 200
    except Exception as e:
        app_support_session.rollback()  
        return jsonify({"message": "Error adding user", "error": str(e)}), 500
    
def delete_user_details():
    data = request.json
    user = app_support_session.query(Users).filter_by(email=data["email"]).first()

    if user:
        app_support_session.query(Users).filter(Users.email == data["email"]).update({Users.is_active: False}, synchronize_session=False)
        app_support_session.commit()
        return jsonify({"message": "User deactivated"}), 200
    return jsonify({"message": "User no found"}), 400