import os
import requests
from config import get_config
from flask import Flask, render_template, jsonify


# Get the current working directory
current_directory = os.getcwd()
# Get the parent directory
parent_directory = os.path.abspath(os.path.join(current_directory, os.pardir))


app = Flask(__name__, template_folder=parent_directory)


def get_api_resp(URL, header, payload=None):
    req = requests.post(URL, headers=header, json=payload)
    return req.json()


@app.route('/get_equity')
def get_equity():
    # Technically passed by the frontend
    client_id = "H011"

    # Get and set all variables
    X_API_KEY = get_config("X_API_KEY")

    HOLDING_LIST_URL = get_config("CASH_HOLDING_LIST_V1_URL")
    HOLDING_LIST_PAYLOAD = {"sort_by": 1, "size": 0, "page": 0, "searchKey": ""}  # client id in this?

    HOLDING_SUMMARY_URL = get_config("CASH_HOLDING_SUMMARY_V2_URL")

    POSITION_LIST_URL = get_config("CASH_POSITION_LIST_V2_URL")
    POSITION_LIST_PAYLOAD = {"sort_by": 8, "searchKey": ""}

    POSITION_SUMMARY_URL = get_config("CASH_POSITION_SUMMARY_V2_URL")

    # Set the header used for all the APIs
    header = {
            'x-client-id': f'{client_id}',
            'x-api-key': f'{X_API_KEY}',
            'Content-Type': 'application/json'
            }

    # Start getting all responses. All are post APIs
    holdings = get_api_resp(HOLDING_LIST_URL, header, HOLDING_LIST_PAYLOAD)
    holding_summary = get_api_resp(HOLDING_SUMMARY_URL, header)
    print(f"Holding List: {holdings}\nHolding Summary: {holding_summary}")

    positions = get_api_resp(POSITION_LIST_URL, header, POSITION_LIST_PAYLOAD)
    position_summary = get_api_resp(POSITION_SUMMARY_URL, header)
    print(f"Position List: {positions}\nPosition Summary: {position_summary}")

    return jsonify([holdings, holding_summary, positions, position_summary])


@app.route('/equity')
def index():
    return render_template('equity.html')


if __name__ == '__main__':
    app.run(debug=True)
