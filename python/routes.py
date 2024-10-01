from flask import request, jsonify
from utils import Users, UserInfo, IpoApplicationModel, ApplicantDetailsModel, IpoDetailsModel, ProfileOnboardingModel, BankDetailsModel
from sqlalchemy import func
from db_connection import app_support_session, sso_session, ipo_session, profile_session
from main import app
import datetime

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    user = app_support_session.query(Users).filter_by(email=username, password=password).first()
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
        existing_user = app_support_session.query(Users).filter_by(email=data["email"]).first()
        if existing_user:
            return jsonify({"message": "Email id already registered"}), 400
        
        is_superuser = data.get("isSuperuser", False)
        new_user = Users(
            email=data["email"],
            password=data["password"],
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
    client_id = sso_session.query(UserInfo.client_id).filter(func.lower(UserInfo.client_id) == func.lower(data["clientIdField"])).first()

    if client_id:
        return jsonify({"message": "User found", "client_id": client_id[0]}), 200 
    return jsonify({"message": "Client id not found"}), 400

@app.route("/api/ipos", methods=['GET'])
def ipo_data():
    client_id = request.args.get('clientId')
    
    if not client_id:
        return jsonify({"error": "Client ID not found"}), 400
    
    ipo_app = ipo_session.query(ApplicantDetailsModel).filter(ApplicantDetailsModel.client_id == client_id).first()
    
    if not ipo_app:
        return jsonify({"message": "No application found for this client ID"}), 400
    
    ipo_details = ipo_session.query(IpoApplicationModel).filter(IpoApplicationModel.applicant_id == ipo_app.applicant_id).order_by(IpoApplicationModel.created_datetime.desc()).all()
    
    if not ipo_details:
        return jsonify({
            "message": "No IPO details found", 
            "ipoData": {
                "name": "None",
                "applyDate": "None",
                "mandateSentDate": "None",
                "paymentStatus": "None",
                "allocated": "None",
                "applicationNo": "None"
            }
        }), 400

    ipo = []
    for i in ipo_details:
        ipo_detail = ipo_session.query(IpoDetailsModel).filter(IpoDetailsModel.ipo_id == i.ipo_id).all()
        if ipo_detail:
            for j in ipo_detail:
                ipo.append({
                    "name": j.company_name,
                    "applyDate": i.created_datetime,
                    "mandateSentDate": i.payment_mandate_sent_date if i.payment_mandate_sent_date else " ",
                    "paymentStatus": i.payment_status,
                    "allocated": "Yes" if i.application_status == "Alloted" else "No",
                    "applicationNo": i.application_no
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
    