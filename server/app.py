from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import io
import os
from pypdf import PdfReader
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='../client/dist', static_url_path='')

CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ridewise.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-this'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db = SQLAlchemy(app)
jwt = JWTManager(app)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

# --- DEBUG LOGGER ---
@app.before_request
def log_request_info():
    if request.method != 'OPTIONS' and request.path != '/api/chat':
        if not request.path.startswith('/assets'):
             print(f"--- REQUEST: {request.method} {request.path} ---")

# --- DATABASE MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    prediction_value = db.Column(db.Integer, nullable=False)
    input_summary = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# --- AUTH ROUTES ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 400
    hashed_pw = generate_password_hash(data['password'])
    new_user = User(username=data['username'], password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify({"token": token, "username": user.username}), 200
    return jsonify({"msg": "Invalid credentials"}), 401

# --- PREDICTION ROUTES ---
@app.route('/api/save-prediction', methods=['POST'])
@jwt_required()
def save_prediction():
    user_id = get_jwt_identity()
    data = request.json
    new_pred = Prediction(
        user_id=user_id,
        date=data['date'],
        prediction_value=data['value'],
        input_summary=data.get('summary', 'Manual')
    )
    db.session.add(new_pred)
    db.session.commit()
    return jsonify({"msg": "Saved"}), 201

@app.route('/api/batch-predict', methods=['POST'])
@jwt_required()
def batch_predict():
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    file = request.files['file']
    try:
        pdf_file = io.BytesIO(file.read())
        reader = PdfReader(pdf_file)
        text_content = ""
        for page in reader.pages:
            text_content += page.extract_text()
        record_count = text_content.count("202")
        if record_count == 0: record_count = 10
        predicted_value = record_count * 125
        user_id = get_jwt_identity()
        new_pred = Prediction(
            user_id=user_id,
            date=datetime.utcnow().strftime("%Y-%m-%d"),
            prediction_value=predicted_value,
            input_summary=f"Batch PDF: {file.filename}"
        )
        db.session.add(new_pred)
        db.session.commit()
        return jsonify({"value": predicted_value, "msg": "Processed"}), 200
    except Exception as e:
        print(f"PDF Error: {e}")
        return jsonify({"msg": "Failed to process PDF"}), 500

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    preds = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.timestamp.desc()).all()
    results = [{
        "id": p.id,
        "date": p.date,
        "value": p.prediction_value,
        "summary": p.input_summary,
        "created_at": p.timestamp.strftime("%Y-%m-%d %H:%M")
    } for p in preds]
    return jsonify(results), 200

# --- OLLAMA CHAT ROUTE ---
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_text = data.get('message', '')
    try:
        payload = {
            "model": "llama3.2:1b",
            "prompt": f"You are RideWise Assistant. Answer briefly.\nUser: {user_text}\nAssistant:",
            "stream": False
        }
        response = requests.post('http://localhost:11434/api/generate', json=payload)
        if response.status_code == 200:
            ai_reply = response.json().get('response', 'Error: Empty response from AI')
            return jsonify({"reply": ai_reply})
        else:
            return jsonify({"reply": f"Ollama Error: {response.status_code}"}), 500
    except Exception as e:
        print(f"AI Error: {e}")
        return jsonify({"reply": "I cannot reach the AI brain. Is Ollama running?"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
