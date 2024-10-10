from flask import request, jsonify
from models import UserInfo, ProfileOnboardingModel, BankDetailsModel, BankMasterModel, BranchMasterModel, ClientNomineeDetailsModel, ClientAddressDetails, SegmentModel, SegmentMasterModel, ClientDematDetailsModel
from sqlalchemy import func
from db_connection import sso_session, profile_session
from ecncryption_decryption import decrypt, get_keys


def profile_details():
    client_id = request.args.get('clientId')
    pu_key, pr_key = get_keys()

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
    nse_fno = []
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
            "ACCOUNT_NO": decrypted_account_no or "ACCOUNT NO. NOT PRESENT",
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
        "address": decrypt_add1 if decrypt_add1 else "" + decrypt_add2 if decrypt_add2 else "" + decrypt_add3 if decrypt_add3 else "" + country if country else None,
        "type": a_type if a_type else None,
        "source":source if source else None,
        "proof": proof if proof else None,
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
    nse_fno.append({"nsefno": nse_fno_query[0]})
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
    return jsonify({"user": client_details, "accounts": bank_list, "nominee": nominees_list, "address": address_list, "segment": segment_details,"nse_fno": nse_fno, "demat": demat_list, "Unavailable_data": not_list})