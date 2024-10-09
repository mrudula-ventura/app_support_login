from flask import request, jsonify
from models import UserInfo
from sqlalchemy import and_, or_, func
from db_connection import sso_session
from ecncryption_decryption import get_keys, encrypt, decrypt

pu_key, pr_key = get_keys()

def get_client_id_from_mobile_email():
    data = request.json
    email_mobile = data.get('emailOrPhone').lower()
    if not email_mobile:
        return jsonify({"message": "Email or Phone is missing"}), 400

    try:
        encrypted_email_mobile = encrypt(email_mobile, pu_key)
    except Exception as e:
        return jsonify({"message": "Decryption failed: Invalid ciphertext"}), 400

    sso_query = sso_session.query(UserInfo.client_id).filter(
    and_(
        or_(
            UserInfo.mobile_no == encrypted_email_mobile,
            UserInfo.email_id == encrypted_email_mobile
        ),
        UserInfo.account_status != 'closed'
    )
    ).first()
    # print(sso_query, " --------------")

    if not sso_query:
        return jsonify({
            "message": "Email / Mobile does not exist", 
            "clientId": None, 
            "clientId": None
        }), 404
    return jsonify({"clientId": sso_query[0]})

def get_client_id_details():
    data = request.json
    # email_or_mobile = data['emailOrMobile']
    client_id = data['clientId']
    if client_id:
        client_id_backend = sso_session.query(UserInfo.client_id, UserInfo.first_name, UserInfo.last_name, UserInfo.mobile_no, UserInfo.email_id).filter(func.lower(UserInfo.client_id) == func.lower(client_id)).first()
        client_id_, f_name, l_name, mobile, email = client_id_backend
        l_name_decrypt = decrypt(l_name, pr_key)
        email_decrypt = decrypt(email, pr_key)
        mobile_decrypt = decrypt(mobile, pr_key)
        if not client_id_backend:
            return None
        return jsonify({"client_id": client_id, "Full_Name": f_name + ' ' + l_name_decrypt, "Email": email_decrypt, "Mobile_No.": mobile_decrypt})