from flask import request, jsonify
from utils import Users, UserInfo, IpoApplicationModel, ApplicantDetailsModel, IpoDetailsModel, ProfileOnboardingModel, BankDetailsModel, MutualFundPortfolio
from sqlalchemy import func, text, or_
from db_connection import app_support_session, sso_session, ipo_session, profile_session, cash_session, mf_session
from main import app
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from ecncryption_decryption import get_keys, encrypt, decrypt
import datetime
import json

# def getting_keys():
pu_key, pr_key = get_keys()
    # return pu_key, pr_key

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]
    # pu_key, pr_key = get_keys()
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

# ADD USER 
@app.route('/addUser', methods=['POST'])
def add_user():
    try:
        data = request.json
        password = data['password']
        # pu_key, pr_key = get_keys()

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

#DELETE USER 
@app.route('/delete-user', methods=['POST'])
def deleteuser():
    data = request.json
    user = app_support_session.query(Users).filter_by(email=data["email"]).first()

    if user:
        app_support_session.query(Users).filter(Users.email == data["email"]).update({Users.is_active: False}, synchronize_session=False)
        app_support_session.commit()
        return jsonify({"message": "User deactivated"}), 200
    return jsonify({"message": "User no found"}), 400

# CHECK MOBILE / EMAIL EXISTS IN SSO DB 
@app.route('/get-client-id', methods = ['POST'])
def check_if_data_exists():
    data = request.json
    email_mobile = data.get('emailOrPhone').lower()
    if not email_mobile:
        return jsonify({"message": "Email or Phone is missing"}), 400

    try:
        # pu_key, pr_key = get_keys() 
        encrypted_email_mobile = encrypt(email_mobile, pu_key)
    except Exception as e:
        return jsonify({"message": "Decryption failed: Invalid ciphertext"}), 400

    sso_query = sso_session.query(UserInfo.client_id).filter(
            or_(UserInfo.mobile_no == encrypted_email_mobile,
                UserInfo.email_id == encrypted_email_mobile
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

# GET CLIENT ID IF IT EXISTS
@app.route('/submit-client-id', methods=['POST'])
def get_client_id():
    data = request.json
    # email_or_mobile = data['emailOrMobile']
    client_id = data['clientId']
    # pu_key, pr_key = get_keys()
    if client_id:
        client_id_backend = sso_session.query(UserInfo.client_id, UserInfo.first_name, UserInfo.last_name, UserInfo.mobile_no, UserInfo.email_id).filter(func.lower(UserInfo.client_id) == func.lower(client_id)).first()
        client_id_, f_name, l_name, mobile, email = client_id_backend
        l_name_decrypt = decrypt(l_name, pr_key)
        email_decrypt = decrypt(email, pr_key)
        mobile_decrypt = decrypt(mobile, pr_key)
        if not client_id_backend:
            return None
        return  jsonify({"client_id": client_id, "Full_Name": f_name + ' ' + l_name_decrypt, "Email": email_decrypt, "Mobile No.": mobile_decrypt})

# IPO DETAILS
@app.route("/ipo", methods=['GET'])
def ipo_data():
    client_id = request.args.get('clientId')
    
    if not client_id:
        return jsonify({"error": "Client ID not found"}), 400

    application_details_table = ipo_session.query(ApplicantDetailsModel).filter(ApplicantDetailsModel.client_id == func.lower(client_id)).first()
    
    if not application_details_table:
        return jsonify({"message": "No application found for this client ID", "data": False}), 404
    
    ipo_applications_table = ipo_session.query(IpoApplicationModel).filter(IpoApplicationModel.applicant_id == application_details_table.applicant_id).order_by(IpoApplicationModel.created_datetime.desc()).all()
    
    if not ipo_applications_table:
        return jsonify({
            "message": "No IPO details found",
            "data": False
        }), 404
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

# MY PROFILE BANK DETAILS
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

@app.route('/wallet', methods=['GET'])
def wallet_details():
    client_id = request.args.get('clientId')

    wallet_query = '''
        select * from(
        select
            created_date as "Timestamp",
            case
                when true then 'INTENT'
            end as "Transaction type",
            amount as "amount",
            ventura_ref_no as "Reference no",
            case
                when hdfc_create_payment_res_data::text like '%SUCCESS%' then 'SUCCESS'
                else 'FAILED'
            end as "Bank Status",
            accord_hdfc_data_req_res_data::text as "accord status",
            rs_payin_api_res_data::text as "RS Status",
            final_status as "final Status",
            wallet.intent_txns_new.client_code
        from
            wallet.intent_txns_new
        union
        select
            wallet.payment_request.created_date as "Timestamp",
            wallet.payment_request.payment_mode::text as "Transaction type",
            total_amount as "amount",
            wallet.payment_request.ventura_ref_no as "Reference no",
            case
                when trans_status = 'SUCCESS' then 'SUCCESS'
                when trans_status in ('FAILED', 'REJECTED') then 'FAILED'
            end as "Bank Status",
            'NA' as "accord status",
            'NA' as "RS Status",
            trans_status as "final Status",
            wallet.payment_request.client_code
        from
            wallet.payment_request
        left join
            wallet.payment_response
        on
            wallet.payment_request.req_id_incr = wallet.payment_response.req_id
        union
        select
            wallet.netbanking_txns.created_date as "Timestamp",
            'NETBANKING' as "Transaction type",
            wallet.netbanking_txns.total_amount as "amount",
            wallet.netbanking_txns.mvp_ref_no as "Reference no",
            bank_status as "Bank Status",
            'NA' as "accord status",
            rs_status as "RS Status",
            final_status as "final Status",
            wallet.netbanking_txns.client_id
        from
            wallet.netbanking_txns
        union
        select
            wallet.payout_txns.created_date as "Timestamp",
            'PAYOUT' as "Transaction type",
            payout_amount as "amount",
            payout_req_id_incr::text as "Reference no",
            'NA' as "Bank Status",
            'NA' as "accord status",
            'NA' as "RS Status",
            case
                when payout_status = 'processed' then 'SUCCESS'
                when payout_status = 'cancelled' then 'FAILED'
            end as "final Status",
            wallet.payout_txns.client_code
        from
            wallet.payout_txns
        ) as sub_query
        where client_code like upper(:client_code)
        order by 1 desc;
    '''

    try:
        result = cash_session.execute(text(wallet_query), {"client_code": f'%{client_id}%'})
        result_fetch = result.fetchall()

        columns = result.keys()
        wallet_data = []
        for row in result_fetch:
            wallet = {}
            for column, value in zip(columns, row):
                # print(column, "-------------------------")
                if column == 'Timestamp' and value  is not None:
                    if isinstance(value, str):
                        dt = datetime.datetime.strptime(value, '%a, %d %b %Y %H:%M:%S %Z')
                    elif isinstance(value, datetime.datetime):
                        dt = value
                    else:
                        continue    
                    wallet[column] = dt.strftime('%d-%m-%Y %H:%M')
                elif column == 'RS Status' and value is not None:
                    try:
                        status = json.loads(value)
                        wallet[column] = status.get('status')
                    except json.JSONDecodeError:
                        wallet[column] = "NA"
                else:
                    wallet[column] = value
            wallet_data.append(wallet)
                    

        if not wallet_data:
            return jsonify({"message": "No data available"}), 404

        return jsonify({"message": "Data retrieved successfully", "walletData": wallet_data})
    
    except Exception as e:
        return jsonify({"message": f"Error occurred: {str(e)}"}), 500
 
@app.route('/mf', methods = ['GET'])
def mf():
    # client_id = request.args.get('clientId')
    client_id = func.upper('18j018')
    mf_query = mf_session.query(MutualFundPortfolio.summary_json).filter(MutualFundPortfolio.client_id == client_id).first()
    
    if not mf_query:
        return jsonify({"message": "No MF data available for the client"})
    
    summary = mf_query[0]
    result = []
    
    for g_total, summary_data in summary.items(): # g_tot = g_tot, summary, client_details
        if g_total == 'summary':
            for asset, scheme_name_and_data in summary_data.items(): # asset = liquid. etc / scheme_name_and_data = g_tot or schemes
                    for g_tot_or_schemes, schemes_data in scheme_name_and_data.items(): # g_tot = schemes / schemes_data = mf wise data                
                        if g_tot_or_schemes == 'schemes':
                            for scheme_name, data in schemes_data.items(): # scheme_name = mf names / data = m's respectiv data
                                result.append({
                                    "Scheme_name": scheme_name,
                                    "Asset": asset,
                                    "Curent_amount": data.get('c_amt'),
                                    "Purchase_amount": data.get('p_amt'),
                                    "Units": data.get('units'),
                                    "Folio_Number": data.get('folio_no'),
                                    "Nav": data.get('nav')
                                })
    
    if not result:
        return jsonify({"message": "No result"})
    
    return jsonify({"Data": result})
    
    
    
