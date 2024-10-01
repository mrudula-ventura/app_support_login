from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    from routes import app 
    app.run(debug=True, use_reloader=False)
