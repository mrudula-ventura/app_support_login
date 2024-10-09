from flask import request, jsonify
from models import IpoApplicationModel, ApplicantDetailsModel, IpoDetailsModel
from sqlalchemy import func
from db_connection import  ipo_session


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