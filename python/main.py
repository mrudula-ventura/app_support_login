from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import get_config
from utils import Users  

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

    user = app_support_session.query(Users).filter_by(username=username, password=password).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "Login successful", "is_super_user": user.is_super_user}), 201


@app.route('/addUser', methods=['POST'])
def add_user():
    try:
        data = request.json
        app.logger.info(f"Data received: {data}") 

        existing_user = app_support_session.query(Users).filter_by(username=data["username"], password=data["password"]).first()
        if existing_user:
            app.logger.info("User exists")
            return jsonify({"message": "User already exists"}), 401
        
        is_superuser = data.get("isSuperuser", False) 

        new_user = Users(
            username=data["username"],
            password=data["password"],
            email=data["email"],
            is_super_user=is_superuser, 
            is_user_readonly=False if is_superuser else True  
        )
        print(new_user.is_super_user, new_user.is_user_readonly)

        app_support_session.add(new_user)
        app_support_session.commit()

        return jsonify({"message": "User added successfully", "data": data}), 201 
    except Exception as e:
        app.logger.error(f"Error adding user: {str(e)}")
        app_support_session.rollback()  
        return jsonify({"message": "Error adding user", "error": str(e)}), 500
    

if __name__ == '__main__':
    app_support_session = db_connection()
    app.run(debug=True, use_reloader=False)
