from flask import render_template, jsonify, request
from main import app
from holding_position import get_equity_hp
from ipo import ipo_data
from wallet import wallet_details
from myprofile import profile_details
from mutual_fund import mf_details
from login import login_details
from manager_user import add_user_details, delete_user_details, update_password
from client_details import get_client_id_from_mobile_email, get_client_id_details
from cob import cob_details
from sso import sso_details
from panic_api import panic_alerts
from functools import wraps
import jwt
from models import Users
from db_connection import app_support_session
from datetime import datetime, timedelta

SECRET_KEY = 'Jay9820104922@#123'

def fix_padding(token):
    # JWT tokens should have padding so their length is a multiple of 4
    missing_padding = len(token) % 4
    if missing_padding:
        token += '=' * (4 - missing_padding)
    return token

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        print(f"Received token: {token}")  # Debugging print

        if not token:
            return jsonify({'message': 'Token is missing'}), 403

        try:
            # Fix padding before decoding
            token = fix_padding(token.split(" ")[1])  # Extract the token from 'Bearer <token>'

            # Decode the token and get user info
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['user_id']  # Assuming 'user_id' is in the token
        except Exception as e:
            return jsonify({'message': 'Token is invalid', 'error': str(e)}), 403

        return f(current_user, *args, **kwargs)  # Pass current_user to the decorated function

    return decorated_function


# Login Email Password
@app.route('/login', methods=['POST'])
def login():
    return login_details()

# ADD USER 
@app.route('/addUser', methods=['POST'])
@token_required
def add_user(current_user):
    return add_user_details(current_user)

#DELETE USER 
@app.route('/delete-user', methods=['POST'])
@token_required
def delete_user(current_user):
    return delete_user_details(current_user)

@app.route('/reset-password', methods = ['POST'])
@token_required
def reset_password(current_user):
    return update_password(current_user)

# CHECK MOBILE / EMAIL EXISTS IN SSO DB 
@app.route('/get-client-id', methods = ['POST'])
@token_required
def mobile_email(current_user):
    return get_client_id_from_mobile_email(current_user)

# GET CLIENT ID IF IT EXISTS FROM  SSO DB ALSO IF CLIENT ID IS NOT CLOSED
@app.route('/submit-client-id', methods=['POST'])
@token_required
def get_client_id(current_user):
    return get_client_id_details(current_user)

# IPO DETAILS
@app.route("/ipo", methods=['GET'])
@token_required
def ipo(current_user):
    return ipo_data(current_user)

# WALLET DETAILS
@app.route('/wallet', methods=['GET'])
@token_required
def wallet(current_user):
    return wallet_details(current_user)
 
# MUTUAL FUNDS DETAILS
@app.route('/mf', methods = ['GET'])
@token_required
def mf(current_user):
    return mf_details(current_user)

# MY PROFILE DETAILS --> PERSONAL, BANKS, SEGMENT, NOMINEE
@app.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    return profile_details(current_user)

# HOLDINGS AND POSITION
@app.route('/get_equity', methods = ['GET'])
@token_required
def get_equity(current_user):
   return get_equity_hp(current_user)

# HOLDINGS AND POSITION
@app.route('/equity')
@token_required
def index():
    return render_template('equity.html')

# COB
# @app.route('/cob', methods = ['GET'])
# def cob():
#     return cob_details()

@app.route('/sso', methods = ['GET'])
@token_required
def sso(current_user):
    return sso_details(current_user)

@app.route('/panic', methods = ['GET'])
@token_required
def panic(current_user):
    return panic_alerts(current_user)