from flask import Flask
from flask_cors import CORS
import os
import requests

current_directory = os.getcwd()
parent_directory = os.path.abspath(os.path.join(current_directory, os.pardir))

app = Flask(__name__, template_folder=parent_directory)
CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    from routes import app 
    app.run(debug=True, use_reloader=False)
