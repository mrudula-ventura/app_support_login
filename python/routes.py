from flask import request, jsonify
from utils import Users, UserInfo, IpoApplicationModel, ApplicantDetailsModel, IpoDetailsModel, ProfileOnboardingModel, BankDetailsModel
from sqlalchemy import func
from db_connection import app_support_session, sso_session, ipo_session, profile_session
from main import app
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from ecncryption_decryption import get_keys, encrypt, decrypt
import datetime

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]
    pu_key, pr_key = get_keys()
    encrypted_password = encrypt(password if type(password) == str else str(password), pu_key)

    user = app_support_session.query(Users).filter_by(email=username, password=encrypted_password).first()
    if user:
        active_status = app_support_session.query(Users.is_active).filter(Users.email == username).first()
        if active_status[0]:
            return jsonify({"message": "Login successful", "is_super_user": user.is_super_user, "is_active": active_status[0]}), 200
        else:
            return jsonify({"message": f"{username} is deactivated"}), 200
    return jsonify({"error": "User not found"}), 400

@app.route('/addUser', methods=['POST'])
def add_user():
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
    
@app.route('/delete-user', methods=['POST'])
def deleteuser():
    data = request.json
    user = app_support_session.query(Users).filter_by(email=data["email"]).first()

    if user:
        app_support_session.query(Users).filter(Users.email == data["email"]).update({Users.is_active: False}, synchronize_session=False)
        app_support_session.commit()
        return jsonify({"message": "User deactivated"}), 200
    return jsonify({"message": "Unable to delete user"}), 400

@app.route('/get-client-id', methods=['POST'])
def get_client_id():
    data = request.json
    # email_or_mobile = data['emailOrMobile']
    client_id = data['clientIdField']
    pu_key, pr_key = get_keys()
    if client_id:
        client_data = look_by_client_id(client_id)
    # if email_or_mobile:
    #     encyrypted_email = encrypt(email_or_mobile, pu_key)
    #     client_data = look_by_email_or_mobile(encyrypted_email)

    if client_data:
        return jsonify({"message": "Client found", "clientId": client_data["client_id"]}), 200
    else:
        return jsonify({"message": "Client ID or Email/Mobile not found."}), 404


def look_by_client_id(client_id):
    client_id_backend = sso_session.query(UserInfo.client_id).filter(func.lower(UserInfo.client_id) == func.lower(client_id)).first()
    if not client_id_backend:
        return None
    return {"client_id": client_id[0]}

# def look_by_email_or_mobile(emailOrMobile):
#     client_email_encrypted = sso_session.query(UserInfo.client_id).filter((UserInfo.email_id) == emailOrMobile or (UserInfo.mobile_no) == emailOrMobile).first()
#     if not client_email_encrypted:
#         return None
#     return {"client_id": client_email_encrypted[0]}


@app.route("/api/ipos", methods=['GET'])
def ipo_data():
    client_id = request.args.get('clientId')
    
    if not client_id:
        return jsonify({"error": "Client ID not found"}), 400

    application_details_table = ipo_session.query(ApplicantDetailsModel).filter(ApplicantDetailsModel.client_id == func.lower(client_id)).first()
    
    if not application_details_table:
        return jsonify({"message": "No application found for this client ID"}), 400
    
    ipo_applications_table = ipo_session.query(IpoApplicationModel).filter(IpoApplicationModel.applicant_id == application_details_table.applicant_id).order_by(IpoApplicationModel.created_datetime.desc()).all()
    
    if not ipo_applications_table:
        return jsonify({
            "message": "No IPO details found", 
            "ipoData": {
                "name": "None",
                "applyDate": "None",
                "mandateSentDate": "None",
                "paymentStatus": "None",
                "allocated": "None"
            }
        }), 400
    ipo_details_list = {i.ipo_id: i.bid_quantity for i in ipo_applications_table}
    ipo_detail = ipo_session.query(IpoDetailsModel).filter(IpoDetailsModel.ipo_id.in_(ipo_details_list.keys())).all()
    company_name = {i.ipo_id: {"company_name": i.company_name, "lot_size": i.lot_size} for i in ipo_detail}
    # lots_applied = [i.lot_size for i in ipo_detail]
    ipo = []
    for i in ipo_applications_table:
                ipo.append({
                    "name": company_name[i.ipo_id]["company_name"],
                    "applyDate": i.created_datetime.strftime('%d %b %Y %H:%M'),
                    "mandateSentDate": i.payment_mandate_sent_date.strftime('%d %b %Y %H:%M') if i.payment_mandate_sent_date else " ",
                    "paymentStatus": company_name[i.ipo_id]["lot_size"],
                    "allocated": ipo_details_list[i.ipo_id] / company_name[i.ipo_id]["lot_size"]
                    # "Lots per size": company_name[i.ipo_id]["lot_size"],
                    # "Lots applied": list(ipo_details_list.keys())
                })
    return jsonify({"message": "Data retrieved successfully", "ipoData": ipo}), 200

@app.route("/profile_bank", methods = ['GET'])
def profile_bank():
    client_id = request.args.get('clientId')
    if not client_id:
        return jsonify({"message": "Client id not found in headers"})
    
    mp_query = profile_session.query(ProfileOnboardingModel).filter(ProfileOnboardingModel.client_id == client_id).first()
    if not mp_query:
        return jsonify({f"message: No record in profile for {client_id}"})
    
    client_detail_id = mp_query.client_detail_id_incr
    client_bank_details = profile_session.query(BankDetailsModel).filter(BankDetailsModel.bank_detail_id == client_detail_id).all()
    if not client_bank_details:
        return jsonify({f"message: No Bank details for {client_id}"})
    bank_list = []
    for i in client_bank_details:
        bank_list.append({
            "CLIENT NAME": mp_query.first_name + mp_query.last_name,
            "ACCOUNT NO.": i.account_no if i.account_no else "ACCOUNT NO. NOT PRESENT ",
            "IFSC CODE": i.ifsc_code if i.ifsc_code else "IFSC CODE NOT PRESENT",
            "BANK NAME": "None",
            "IS BANK CURRENTLY ACTIVE": i.is_active,
            "IS BANK PRIMARY": i.is_primary_bank,
            "IS BANK VERIFIED": i.is_bank_verified,
            "BANK ACCOUNT STATUS": i.bank_account_status,
            "BANK ADDED DATE": i.created_timestamp
        })
    return jsonify({
        "message": "Bank details fetched successfully",
        "Bank Details": bank_list
    })

# def profile_segment():
#     segment_query = profile_session.query(SegmentModel).filter(SegmentModel.client_detail_id == )
    