from flask import render_template
from main import app
from holding_position import get_equity_hp
from ipo import ipo_data
from wallet import wallet_details
from myprofile import profile_details
from mutual_fund import mf_details
from login import login_details
from manager_user import add_user_details, delete_user_details
from client_details import get_client_id_from_mobile_email, get_client_id_details
from cob import cob_details
from sso import sso_details

# Login Email Password
@app.route('/login', methods=['POST'])
def login():
    return login_details()

# ADD USER 
@app.route('/addUser', methods=['POST'])
def add_user():
    return add_user_details()

#DELETE USER 
@app.route('/delete-user', methods=['POST'])
def delete_user():
    return delete_user_details()

# CHECK MOBILE / EMAIL EXISTS IN SSO DB 
@app.route('/get-client-id', methods = ['POST'])
def mobile_email():
    return get_client_id_from_mobile_email()

# GET CLIENT ID IF IT EXISTS FROM  SSO DB ALSO IF CLIENT ID IS NOT CLOSED
@app.route('/submit-client-id', methods=['POST'])
def get_client_id():
    return get_client_id_details()

# IPO DETAILS
@app.route("/ipo", methods=['GET'])
def ipo():
    return ipo_data()

# WALLET DETAILS
@app.route('/wallet', methods=['GET'])
def wallet():
    return wallet_details()
 
# MUTUAL FUNDS DETAILS
@app.route('/mf', methods = ['GET'])
def mf():
    return mf_details()

# MY PROFILE DETAILS --> PERSONAL, BANKS, SEGMENT, NOMINEE
@app.route('/profile', methods=['GET'])
def profile():
    return profile_details()

# HOLDINGS AND POSITION
@app.route('/get_equity', methods = ['GET'])
def get_equity():
   return get_equity_hp()

# HOLDINGS AND POSITION
@app.route('/equity')
def index():
    return render_template('equity.html')

# COB
# @app.route('/cob', methods = ['GET'])
# def cob():
#     return cob_details()

@app.route('/sso', methods = ['GET'])
def sso():
    return sso_details()