from flask import request, jsonify
from models import Users
from db_connection import app_support_session
from ecncryption_decryption import get_keys, encrypt, decrypt
import datetime

def add_user_details(current_user):
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
    
def delete_user_details(current_user):
    try:
        data = request.json
        user = app_support_session.query(Users).filter_by(email=data["email"]).first()

        if user:
            app_support_session.query(Users).filter(Users.email == data["email"]).update({Users.is_active: False}, synchronize_session=False)
            app_support_session.commit()
            return jsonify({"message": "User deactivated"}), 200
        return jsonify({"message": "User no found"}), 400
    except Exception as e:
        return jsonify({"message": "Error in deleting user", "error": str(e)})
    
def update_password(current_user):
    try:
        data = request.json
        email = data.get('email')
        newPassword = data.get('newPassword')
        pu_key, pr_key = get_keys()
        
        print(email)
        print(newPassword)
        get_client = app_support_session.query(Users.password).filter(Users.email == email).first()
        if not get_client:
            return jsonify({"message": "Email Does Not Exists"})
        email_pass = get_client[0]
        if not email_pass:
            return jsonify({"message": "Password data not found for the given email"})

        print("Encrypted Password (bytea format):", repr(email_pass))
        
        try:
            if isinstance(email_pass, memoryview):
                email_pass = email_pass.tobytes()
            elif isinstance(email_pass, str):
                email_pass = bytes(email_pass, 'utf-8')
                
            d_email_pass = decrypt(email_pass, pr_key)
        except Exception as e:
            print(e)
            return jsonify({"message": "Decryption failed", "error": str(e)})
        print(d_email_pass)     
        if newPassword == d_email_pass:
            return jsonify({"message": "New Password Can't be same as previous one. Please try New Password "})
        try:
            update_pass = app_support_session.query(Users).filter(Users.email == email).update({Users.password: encrypt(newPassword, pu_key)}, synchronize_session=False)
            app_support_session.commit()
            return jsonify({"message": "Password Update successfully"})
        except Exception as e:
            return jsonify({"message": "Error in updating password", "error": str(e)})
    except Exception as e:
        return jsonify({"message": "Exception in reset password", "error": str(e)})
    
