from flask import Flask, request, jsonify, session
from flask_cors import CORS
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from config import get_config
from utils import Users, UserInfo, IpoApplicationModel, ApplicantDetailsModel, IpoDetailsModel
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def db_connection(env):
    config = get_config(env)  
    DATABASE_URL = f"postgresql://{config['DB_USER']}:{config['DB_PASSWORD']}@{config['DB_HOST']}/{config['DB_NAME']}"
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    return session

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    user = app_support_session.query(Users).filter_by(email=username, password=password).first()
    if not user:
        return jsonify({"error": "User not found"}), 400
    if user:
        active_status = app_support_session.query(Users.is_active).filter(Users.email == data["username"]).first()
        print(active_status[0], "active_status")
        if active_status[0] == True:
            return jsonify({"message": "Login successful", "is_super_user": user.is_super_user, "is_active": active_status[0]}), 200
        else:
            return jsonify({"message": f"{data["username"]} is deactivated"}), 200
    return jsonify({"error": "User not found"}), 400


@app.route('/addUser', methods=['POST'])
def add_user():
    try:
        data = request.json
        app.logger.info(f"Data received: {data}") 

        existing_user = app_support_session.query(Users).filter_by(email=data["email"]).first()
        if existing_user:
            app.logger.info("Email already registered")
            return jsonify({"message": "Email id already registered"}), 400
        
        is_superuser = data.get("isSuperuser", False) 

        new_user = Users(
            email=data["email"],
            password=data["password"],
            is_super_user=is_superuser, 
            is_user_readonly=False if is_superuser else True,
            is_active = True,
            created_dttm = datetime.datetime.now()
        )
        print(new_user.is_super_user, new_user.is_user_readonly)

        app_support_session.add(new_user)
        app_support_session.commit()

        return jsonify({"message": "User added successfully", "data": data}), 200
    except Exception as e:
        app.logger.error(f"Error adding user: {str(e)}")
        app_support_session.rollback()  
        return jsonify({"message": "Error adding user", "error": str(e)}), 500
    
@app.route('/delete-user', methods = ['POST'])
def deleteuser():
    data = request.json
    email = app_support_session.query(Users).filter_by(email=data["email"]).first()

    if email:
        # update_status = Users.update().where(Users.is_active == True).values(is_active = False)
        app_support_session.query(Users).filter(Users.email == data["email"]).\
        update({Users.is_active: False}, synchronize_session=False)
        app_support_session.commit()
        return jsonify({"message": "User deactivated"}), 200
    return jsonify({"message": "Unable to delete user"}), 400

@app.route('/get-client-id', methods = ['POST'])
def get_client_id():
    data = request.json
    clientid = sso_session.query(UserInfo.client_id).filter(UserInfo.client_id == func.lower(data["clientIdField"])).first()

    if clientid:
        client_id = clientid[0]
        return jsonify({"message": "User found", "client_id": client_id}), 200 
    return jsonify({"message": "Client id not found"}), 400

@app.route("/api/ipos", methods=['GET'])
def ipo_data():
    client_id = request.args.get('clientId')
    
    if client_id:
        ipo_app = ipo_session.query(ApplicantDetailsModel).filter(ApplicantDetailsModel.client_id == client_id).first()
        
        if ipo_app:
            applicant_id = ipo_app.applicant_id
            ipo_details = ipo_session.query(IpoApplicationModel).filter(IpoApplicationModel.applicant_id == applicant_id).all()
            if ipo_details:
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
            return jsonify({"message": "No IPO details found", "ipoData":{
                                "name": "None",
                                "applyDate": "None",
                                "mandateSentDate": "None",
                                "paymentStatus": "None",
                                "allocated": "None",
                                "applicationNo": "None"
                            }}), 400
        return jsonify({"message": "No application found for this client ID"}), 400
    return jsonify({"error": "Client ID not found in query parameters"}), 400


if __name__ == '__main__':
    app_support_session = db_connection("app_support")
    sso_session = db_connection("sso_prod")
    ipo_session = db_connection("ipo")


    app.run(debug=True, use_reloader=False)
