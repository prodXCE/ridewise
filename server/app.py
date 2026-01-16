from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ridewise.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-this'  # Change in production

db = SQLAlchemy(app)
jwt = JWTManager(app)

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
    input_summary = db.Column(db.String(200)) # Store "Hourly, 24C, Rain"
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Create Tables (Run once)
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

    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()

    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({"token": token, "username": user.username}), 200

    return jsonify({"msg": "Invalid credentials"}), 401

# --- PRIVATE DATA ROUTES ---
@app.route('/api/save-prediction', methods=['POST'])
@jwt_required()
def save_prediction():
    user_id = get_jwt_identity()
    data = request.json

    new_pred = Prediction(
        user_id=user_id,
        date=data['date'],
        prediction_value=data['value'],
        input_summary=data.get('summary', 'Manual Prediction')
    )
    db.session.add(new_pred)
    db.session.commit()
    return jsonify({"msg": "Saved"}), 201

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    # Filter ONLY by this user's ID
    preds = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.timestamp.desc()).all()

    results = [{
        "id": p.id,
        "date": p.date,
        "value": p.prediction_value,
        "summary": p.input_summary,
        "created_at": p.timestamp.strftime("%Y-%m-%d %H:%M")
    } for p in preds]

    return jsonify(results), 200

# --- CHAT PROXY (Llama 3.2) ---
SYSTEM_CONTEXT = "You are the RideWise Assistant. Answer briefly."

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_text = data.get('message', '')
    try:
        payload = {
            "model": "llama3.2:1b",
            "prompt": f"{SYSTEM_CONTEXT}\nUser: {user_text}\nAssistant:",
            "stream": False
        }
        response = requests.post('http://localhost:11434/api/generate', json=payload)
        return jsonify({"reply": response.json().get('response', 'Error')})
    except Exception as e:
        return jsonify({"reply": "Backend Error: Check Ollama connection."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
