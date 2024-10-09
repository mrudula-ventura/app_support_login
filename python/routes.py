from flask import render_template, request, jsonify
from utils import Users, UserInfo, IpoApplicationModel, ApplicantDetailsModel, IpoDetailsModel, ProfileOnboardingModel, BankDetailsModel, MutualFundPortfolio, BankMasterModel, BranchMasterModel, ClientNomineeDetailsModel, ClientAddressDetails, SegmentModel, SegmentMasterModel, ClientDematDetailsModel
from sqlalchemy import func, text, or_, select
from db_connection import app_support_session, sso_session, ipo_session, profile_session, cash_session, mf_session
from main import app
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from ecncryption_decryption import get_keys, encrypt, decrypt
import datetime
import json
import os
import requests
from config import get_config
from holding_position import get_equity_hp

# def getting_keys():
pu_key, pr_key = get_keys()
    # return pu_key, pr_key
def get_api_resp(URL, header, payload=None):
    req = requests.post(URL, headers=header, json=payload)
    return req.json()

# Get the current working directory
current_directory = os.getcwd()
# Get the parent directory
parent_directory = os.path.abspath(os.path.join(current_directory, os.pardir))

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
        return jsonify({"client_id": client_id, "Full_Name": f_name + ' ' + l_name_decrypt, "Email": email_decrypt, "Mobile_No.": mobile_decrypt})

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
                    "allocated": ipo_details_list[i.ipo_id] / company_name[i.ipo_id]["lot_size"],
                    "allotment_status": i.allotment_status,
                    "allotment_shares": i.allotted_shares
                })
    return jsonify({"message": "Data retrieved successfully", "ipoData": ipo}), 200

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
    client_id = request.args.get('clientId')
    # client_id = func.upper('18j018')
    mf_query = mf_session.query(MutualFundPortfolio.summary_json).filter(MutualFundPortfolio.client_id == func.upper(client_id)).first()
    
    if not mf_query:
        return jsonify({"message": "No MF data available for the client"})
    
    summary = mf_query[0]
    result = []
    
    for g_total, summary_data in summary.items(): # g_tot = g_tot, summary, client_details
        # print(summary, "---------")
        if 'g_tot' in g_total:

            result.append({
                'C_amnt': summary['g_tot']['c_amt'],
                "P_amt": summary['g_tot']['p_amt'],
                "XIRR": summary['g_tot']['xirr']
            })
            
        if 'summary' in g_total:
            for asset, scheme_name_and_data in summary_data.items(): # asset = liquid. etc / scheme_name_and_data = g_tot or schemes
                    for g_tot_or_schemes, schemes_data in scheme_name_and_data.items(): # g_tot = schemes / schemes_data = mf wise data                
                        if g_tot_or_schemes == 'schemes':
                            for scheme_name, data in schemes_data.items(): # scheme_name = mf names / data = m's respectiv data
                                result.append({
                                    # "c_amt": 
                                    "Scheme_name": data.get('s_name'),
                                    "Asset": asset,
                                    "Curent_amount": data.get('c_amt'),
                                    "Purchase_amount": data.get('p_amt'),
                                    "Units": data.get('units'),
                                    "Folio_Number": data.get('folio_no'),
                                    "Nav": data.get('nav'),
                                    "OnlineFlag": data.get('online_flag')
                                })
    # print(result)
    if not result:
        return jsonify({"message": "No result"})
    
    return jsonify({"Data": result})
    
@app.route('/profile', methods=['GET'])
def profile():
    client_id = request.args.get('clientId')
    # client_id = 'aa0760'
    if not client_id:
        return jsonify({"message": "Client id not found in arguments"})
    
    # Query the profile details for the client
    mp_query = profile_session.query(ProfileOnboardingModel).filter(ProfileOnboardingModel.client_id == func.lower(client_id)).first()
    if not mp_query:
        return jsonify({"message": f"No record in profile for {client_id}"})
    # client_details = []
    mobile = mp_query.phone_no
    email = mp_query.email_id
    decrypted_mobile = decrypt(mobile, pr_key)
    decrypted_email = decrypt(email, pr_key)
    client_details = {
        "First_Name": mp_query.first_name,
        "Last_Name": mp_query.last_name,
        "Mobile_NO.": decrypted_mobile,
        "Email": decrypted_email
    }
    
    bank_list = []
    nominees_list = []
    not_list = []
    client_detail_id = mp_query.client_detail_id_incr
    
    nominee_query = profile_session.query(ClientNomineeDetailsModel.nominee_name, ClientNomineeDetailsModel.nominee_relationship, ClientNomineeDetailsModel.nominee_share, ClientNomineeDetailsModel.is_nominee_minor, ClientNomineeDetailsModel.nominee_identification_type, ClientNomineeDetailsModel.created_timestamp).select_from(ProfileOnboardingModel).join(ClientNomineeDetailsModel, ProfileOnboardingModel.client_detail_id_incr == ClientNomineeDetailsModel.client_detail_id).filter(ProfileOnboardingModel.client_id == func.lower(client_id)).all()
    if not nominee_query:
        not_list.append({"nominee": "No nominees available", "data": False})
    for nominees in nominee_query:
        name, relation, share, minor, identification_type, created_date = nominees
        # datetime_obj = datetime.datetime.strptime
        nominees_list.append({
            "name": name if name else None,
            "relation": relation if relation else None,
            "share": share if share else None,
            "minor":minor if minor else None,
            "type": identification_type if identification_type else None,
            "date": created_date.strftime('%Y-%m-%d %H:%M:%S')
        })

    bank_details = profile_session.query(ProfileOnboardingModel.first_name, ProfileOnboardingModel.last_name, ProfileOnboardingModel.phone_no, ProfileOnboardingModel.email_id, BankMasterModel.bank_name, BankDetailsModel.account_no, BankDetailsModel.ifsc_code, BankDetailsModel.bank_account_status, BankDetailsModel.is_primary_bank, BankDetailsModel.is_active, BankDetailsModel.is_bank_verified, BankDetailsModel.created_timestamp).select_from(ProfileOnboardingModel).join(BankDetailsModel, BankDetailsModel.client_detail_id == ProfileOnboardingModel.client_detail_id_incr).join(BranchMasterModel, BranchMasterModel.ifsc_code == BankDetailsModel.ifsc_code).join(BankMasterModel, BankMasterModel.bank_id_incr == BranchMasterModel.bank_id).filter(ProfileOnboardingModel.client_detail_id_incr == client_detail_id).all()
    if not bank_details:
        not_list.append({"bank": "No bank details available"})
    for bank in bank_details:
        decrypted_account_no = decrypt(bank.account_no, pr_key)
        bank_list.append({
            "ACCOUNT_NO.": decrypted_account_no or "ACCOUNT NO. NOT PRESENT",
            "IFSC_CODE": bank.ifsc_code or "IFSC CODE NOT PRESENT",
            "BANK_NAME": bank.bank_name or "BANK NAME NOT FOUND",
            "IS_BANK_CURRENTLY_ACTIVE": bank.is_active,
            "IS_BANK_PRIMARY": bank.is_primary_bank,
            "IS_BANK_VERIFIED": bank.is_bank_verified,
            "BANK_ACCOUNT_STATUS": bank.bank_account_status,
            "BANK_ADDED_DATE": bank.created_timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })
    address_list = []
    address_query = profile_session.query(ClientAddressDetails.address_line1, ClientAddressDetails.address_line2, ClientAddressDetails.address_line3, ClientAddressDetails.address_type, ClientAddressDetails.address_source, ClientAddressDetails.address_proof, ClientAddressDetails.country, ClientAddressDetails.created_by, ClientAddressDetails.created_timestamp).select_from(ProfileOnboardingModel).join(ClientAddressDetails, ProfileOnboardingModel.client_detail_id_incr == ClientAddressDetails.client_detail_id).filter(ProfileOnboardingModel.client_id == func.lower(client_id)).first()

    if not address_query:
        not_list.append({"address": "No address available", "data": False})
    add1, add2, add3, a_type, source, proof, country, created_by, a_time = address_query
    if add1 is not None:
        decrypt_add1 = decrypt(add1, pr_key)
    if add2 is not None:
        decrypt_add2 = decrypt(add2, pr_key)
    if add3 is not None:
        decrypt_add3 = decrypt(add3, pr_key)
    
    address_list.append({
        "add1": decrypt_add1 if decrypt_add1 else None,
        "add2": decrypt_add2 if decrypt_add2 else None,
        "add3": decrypt_add3 if decrypt_add3 else None, 
        "type": a_type if a_type else None,
        "source":source if source else None,
        "proof": proof if proof else None,
        "country": country if country else None,
        "created_by": created_by if created_by else None,
        "time": a_time.strftime('%d-%B-%Y %H:%M') if a_time else None
    })
    segment_details = []
    segment_query = profile_session.query(SegmentMasterModel.segment, SegmentModel.is_active, SegmentModel.segment_status, SegmentModel.created_timestamp, SegmentModel.updated_timestamp).select_from(ProfileOnboardingModel).join(SegmentModel, ProfileOnboardingModel.client_detail_id_incr == SegmentModel.client_detail_id).join(SegmentMasterModel, SegmentModel.segment_type == SegmentMasterModel.segment_id_incr).filter(ProfileOnboardingModel.client_id == func.lower(client_id)).all()
    if not segment_query:
        not_list.append({"segment": "No segments available", "data": False})
    for segments in segment_query:
        seg_type, active, status, created_time, updated_time = segments
        segment_details.append({
            "type": seg_type if seg_type else None,
            "active": active if active else None,
            "status": status if status else None,
            "created_time": created_time.strftime('%d-%B-%Y %H:%M') if created_time else None,
            "updated_time": updated_time.strftime('%d-%B-%Y %H:%M') if updated_time else None
        })
    nse_fno_query = sso_session.query(UserInfo.nsefno).filter(UserInfo.client_id == func.lower(client_id)).first()
    segment_details.append({"nsefno": nse_fno_query[0]})
    demat_list = []
    demat_query = profile_session.query(ClientDematDetailsModel).select_from(ProfileOnboardingModel).join(ClientDematDetailsModel, ProfileOnboardingModel.client_detail_id_incr == ClientDematDetailsModel.client_detail_id).filter(ProfileOnboardingModel.client_id == func.lower(client_id)).first()
    if not demat_query:
        not_list.append({"demat": "No demat details available"})
    demat_list.append({
        "demat_no": demat_query.demat_no if demat_query.demat_no else None,
        "depository": demat_query.depository if demat_query.depository else None,
        "created_time": demat_query.created_dttm.strftime('%d-%B-%Y %H:%M') if demat_query.created_dttm else None
    })
    # print(f"message: Bank details fetched successfully,Client_Details: {client_details},Bank_Details: {bank_list}")
    return jsonify({"user": client_details, "accounts": bank_list, "nominee": nominees_list, "address": address_list, "segment": segment_details, "demat": demat_list, "Unavailable_data": not_list})

@app.route('/get_equity', methods = ['GET'])
def get_equity():
   return get_equity_hp()


@app.route('/equity')
def index():
    return render_template('equity.html')