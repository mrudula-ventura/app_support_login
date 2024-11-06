from flask import Flask, request, jsonify
from db_connection import app_support_session
from models import PanicAlerts
from sqlalchemy import func
from datetime import datetime

def panic_alerts():
    try:
        client_id = request.args.get('clientId')
        panic_list = []
        panic_alerts_query = app_support_session.query(PanicAlerts.url, PanicAlerts.page_id, PanicAlerts.response_code, PanicAlerts.timestamp, PanicAlerts.latency, PanicAlerts.request_payload, PanicAlerts.response_payload, PanicAlerts.device_type, PanicAlerts.section).filter(PanicAlerts.client_id == func.upper(client_id)).order_by(PanicAlerts.timestamp.desc()).all()
        if not panic_alerts_query:
            return jsonify({"message": "No alerts were found for this client id"}), 200
        for i in panic_alerts_query:
            url, page_id, response_code, timestamp, latency, request_payload, response_payload, device_type, section = i
            panic_list.append({
                "url": url if url else None,
                "page_id": page_id if page_id else None,
                "response_code":response_code if response_code else None,
                "latency": latency if latency else None,
                "request_payload": request_payload if request_payload else None,
                "response_payload": response_payload if response_payload else None,
                "device_type": device_type if device_type else None,
                "section": section if section else None,
                "timestamp": timestamp.strftime('%Y-%m-%d %H:%M:%S')
            })
        print(panic_list)
        return jsonify({"data": panic_list})
            
    except Exception as e:
        return jsonify({"error": "An error occurred in panic API function", "error": str(e)}), 500
    
