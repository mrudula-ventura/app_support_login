from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import get_config
from utils import Users  
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  

def db_connection():
    config = get_config("app_support")  
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
    # if not user:
        # return jsonify({"error": "User not found"}), 400
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


if __name__ == '__main__':
    app_support_session = db_connection()
    app.run(debug=True, use_reloader=False)
