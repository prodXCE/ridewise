from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db, get_db_connection

app = Flask(__name__)
CORS(app)

init_db()

FEATURES = ['season', 'holiday', 'workingday', 'weather', 'temperature', 'humidity', 'windspeed', 'hour']
try:
    model = joblib.load('model.pkl')
    print("✅ Model loaded successfully")
except:
    model = None

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    try:
        conn = get_db_connection()
        hashed_pw = generate_password_hash(data.get('password'))
        conn.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
                     (data.get('email'), hashed_pw, data.get('name')))
        conn.commit()
        return jsonify({"status": "success"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409
    finally:
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (data.get('email'),)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], data.get('password')):
        return jsonify({
            "status": "success",
            "user": {"id": user['id'], "name": user['name'], "email": user['email']}
        })
    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/api/predict', methods=['POST'])
def predict():
    if not model: return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    user_id = data.get('user_id') # <--- Frontend must send this now!

    if not user_id:
        return jsonify({"error": "Unauthorized: User ID missing"}), 401

    try:
        input_dict = {
            'season': int(data.get('season')),
            'holiday': 1 if data.get('isHoliday') else 0,
            'workingday': 1 if data.get('isWorkingDay') else 0,
            'weather': int(data.get('weather')),
            'temperature': float(data.get('temperature')),
            'humidity': float(data.get('humidity')),
            'windspeed': float(data.get('windspeed')),
            'hour': int(data.get('hour'))
        }

        import pandas as pd
        df = pd.DataFrame([input_dict])[FEATURES]
        prediction = int(model.predict(df)[0])

        conn = get_db_connection()
        conn.execute('''
            INSERT INTO predictions (user_id, input_data, prediction)
            VALUES (?, ?, ?)
        ''', (user_id, json.dumps(input_dict), prediction))
        conn.commit()
        conn.close()

        return jsonify({"prediction": prediction, "status": "success"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID required"}), 401

    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM predictions WHERE user_id = ? ORDER BY timestamp DESC', (user_id,)).fetchall()
    conn.close()

    if not rows:
        return jsonify({"total_predictions": 0, "avg_prediction": 0, "hourly_traffic": []})

    history = [{"prediction": r['prediction'], "input": json.loads(r['input_data'])} for r in rows]

    total = len(history)
    avg = int(sum(h['prediction'] for h in history) / total)

    chart_data = []
    df = pd.DataFrame([h['input'] | {'prediction': h['prediction']} for h in history])

    for h in range(0, 24, 2):
        val = df[(df['hour'] >= h) & (df['hour'] < h+2)]['prediction'].mean()
        chart_data.append(int(val) if not pd.isna(val) else 0)

    return jsonify({
        "total_predictions": total,
        "avg_prediction": avg,
        "hourly_traffic": chart_data,
        "recent_alerts": []
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
