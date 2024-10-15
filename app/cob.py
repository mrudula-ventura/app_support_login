from models import ClientOnboardingDetailsModel
from db_connection import cob_session
from sqlalchemy import func
from flask import jsonify
from ecncryption_decryption import get_keys, encrypt, decrypt
from datetime import datetime, date


def cob_details():
    client_id = 'aa0760'
    client_details = []
    no_data = []
    _, pr_key = get_keys()
    cob_query = cob_session.query(ClientOnboardingDetailsModel.client_detail_id_incr, ClientOnboardingDetailsModel.dob, ClientOnboardingDetailsModel.pan_no, ClientOnboardingDetailsModel.pan_father_name, ClientOnboardingDetailsModel.client_mgmt_id, ClientOnboardingDetailsModel.platform, ClientOnboardingDetailsModel.ocr_push_status, ClientOnboardingDetailsModel.created_timestamp, ClientOnboardingDetailsModel.updated_timestamp).filter(ClientOnboardingDetailsModel.client_id == func.upper(client_id)).first()
    if not cob_query:
        no_data.append({"message": "No Cob Details available"})
        client_details = []
    id_incr, dob, pan, pan_father_name, mgmt, platform, ocr_status, created_time, updated_time = cob_query
    decrypted_dob = decrypt(dob, pr_key)
    decrypted_pan = decrypt(pan, pr_key)
    born_year_date = datetime.strptime(decrypted_dob, '%Y-%M-%d')
    born_year = born_year_date.strftime('%Y')
    current_datetime = datetime.now()
    age = int(current_datetime.year) - int(born_year)
    client_details.append({
        "id_incr": id_incr if id_incr else None,
        "dob": decrypted_dob if decrypted_dob else None,
        "age": age if age else None,
        "pan": decrypted_pan if decrypted_pan else None,
        "pan_father_name": pan_father_name if pan_father_name else None,
        "mgmt": mgmt if mgmt else None,
        "platform": platform if platform else None,
        "ocr_status": ocr_status if ocr_status else None,
        "created_time": created_time.strftime('%d-%B-%Y %H:%M') if created_time else None,
        "updated_time": updated_time.strftime('%d-%B-%Y %H:%M') if updated_time else None
    })
    return jsonify({"message": client_details, "no_data": no_data})


    