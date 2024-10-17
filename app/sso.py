from models import UserInfo, UserPlatform, UserPlatformMaster
from db_connection import sso_session
from sqlalchemy import func
from ecncryption_decryption import get_keys, encrypt, decrypt
from flask import jsonify, request
from datetime import date, datetime

def sso_details():
    client_id = request.args.get('clientId')
    sso_details = []
    platform_details = []
    current_year = datetime.now().year
    print(current_year)
    _, pr_key = get_keys()
    sso_query = sso_session.query(UserInfo.user_id_incr, UserInfo.dob, UserInfo.pan_no, UserInfo.is_active, UserInfo.is_bau, UserInfo.is_exclusive, UserInfo.account_status, UserInfo.migration_source, UserInfo.google_auth_enabled, UserInfo.is_new_user_pin_set, UserInfo.created_dttm).filter(UserInfo.client_id == func.lower(client_id) and UserInfo.account_status != 'closed').first()
    user_access_id_incr, dob, pan, is_active, is_bau, is_exclusive, account_status, migration_source, google_auth, pin_set, created_dttm = sso_query
    decrypted_dob = decrypt(dob, pr_key)
    decrypted_pan = decrypt(pan, pr_key)
    client_year =  datetime.strptime(decrypted_dob, '%d/%m/%Y')
    year = current_year - client_year.year
    print(year)
    user_platform = sso_session.query(UserPlatform.platform_app_master_id).filter(UserPlatform.user_id == user_access_id_incr).all()
    user_platform_details = sso_session.query(UserPlatformMaster.platform, UserPlatform.is_active).select_from(UserPlatformMaster).join(UserPlatform, UserPlatformMaster.platform_app_master_id == UserPlatform.platform_app_master_id).filter(UserPlatform.user_id == user_access_id_incr).all()
    
    for platforms in user_platform_details:
        platform, status = platforms
        if status != False: 
            platform_details.append(platform)
    sso_details.append({
            "GOOGLE_AUTH_ENABLED": google_auth,
            "pin_set": pin_set,
            "PAN": decrypted_pan if decrypted_pan else None,
            "IS_ACTIVE": is_active,
            "IS_BAU": is_bau,
            "IS_EXCLUSIVE": is_exclusive,
            "ACCOUNT_STATUS": account_status if account_status else None,
            "MIGRATION_SOURCE": migration_source if migration_source else None, 
            "CREATED_DTTM": created_dttm if created_dttm else None,
            "PLATFORM": f'{platform_details}'
        })
    print(sso_details)
    return jsonify({"data": sso_details})
# sso_details()