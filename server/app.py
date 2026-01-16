from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db, get_db_connection
import pandas as pd
from google import genai  # <--- NEW IMPORT
from pypdf import PdfReader

app = Flask(__name__)
CORS(app)
init_db()

# --- CONFIGURATION ---
# ⚠️ REPLACE WITH YOUR REAL KEY
GEMINI_API_KEY = "AIzaSyDLEwQRvC_9jvX1r92VFhTMO8GgU_4uujU"

# Initialize the new Client
client = genai.Client(api_key=GEMINI_API_KEY) # <--- NEW SETUP

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load ML Model
FEATURES = ['season', 'holiday', 'workingday', 'weather', 'temperature', 'humidity', 'windspeed', 'hour']
try:
    model = joblib.load('model.pkl')
except:
    model = None

# --- HELPER FUNCTIONS ---
def predict_demand(input_data):
    df = pd.DataFrame([input_data])[FEATURES]
    return int(model.predict(df)[0])

def parse_pdf_with_gemini(text):
    """Uses Gemini to extract JSON data from PDF text"""
    try:
        # <--- NEW SYNTAX HERE
        prompt = f"""
        Extract the following weather data from this text and return it as a JSON object:
        temperature (number), humidity (number), windspeed (number), season (1-4), weather (1-4).
        If values are missing, infer reasonable defaults based on context or use averages.

        Text: "{text[:2000]}"
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash", # Or "gemini-1.5-flash"
            contents=prompt
        )

        # Clean up code blocks if Gemini returns markdown
        json_str = response.text.replace('```json', '').replace('```', '')
        return json.loads(json_str)
    except Exception as e:
        print(f"Gemini Error: {e}")
        return None

# --- ROUTES ---

@app.route('/api/chat', methods=['POST'])
def chat_with_gemini():
    data = request.json
    message = data.get('message')

    try:
        # <--- NEW SYNTAX HERE
        prompt = f"You are RideWise AI, a helpful assistant for a bike rental platform in Mumbai. Keep answers short and friendly. User says: {message}"

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({"reply": "I'm having trouble connecting to my brain right now. Try again later."})

# ... (KEEP ALL OTHER ROUTES BELOW EXACTLY AS THEY WERE) ...
# Copy the rest of the routes (register, login, predict, predict/pdf, bookings, etc.)
# from the previous code block. The only changes needed were the imports and the Gemini calls above.

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    try:
        conn = get_db_connection()
        hashed_pw = generate_password_hash(data.get('password'))
        conn.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
                     (data.get('email'), hashed_pw, data.get('name')))
        conn.commit()
        conn.close()
        return jsonify({"status": "success"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (data.get('email'),)).fetchone()
    conn.close()
    if user and check_password_hash(user['password'], data.get('password')):
        return jsonify({"status": "success", "user": dict(user)})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    user_id = data.get('user_id')
    mode = data.get('mode', 'hourly')

    base_input = {
        'season': int(data.get('season', 1)),
        'holiday': 1 if data.get('isHoliday') else 0,
        'workingday': 1 if data.get('isWorkingDay') else 0,
        'weather': int(data.get('weather', 1)),
        'temperature': float(data.get('temperature', 25)),
        'humidity': float(data.get('humidity', 50)),
        'windspeed': float(data.get('windspeed', 10)),
        'hour': int(data.get('hour', 12))
    }

    if mode == 'hourly':
        prediction = predict_demand(base_input)
    else:
        total_demand = 0
        for h in range(24):
            temp_mod = base_input['temperature'] - 5 if (h < 6 or h > 20) else base_input['temperature']
            hour_input = base_input.copy()
            hour_input['hour'] = h
            hour_input['temperature'] = temp_mod
            total_demand += predict_demand(hour_input)
        prediction = total_demand

    if user_id:
        conn = get_db_connection()
        conn.execute('INSERT INTO predictions (user_id, input_data, prediction, type) VALUES (?, ?, ?, ?)',
                     (user_id, json.dumps(base_input), prediction, mode))
        conn.commit()
        conn.close()

    return jsonify({"prediction": prediction, "mode": mode, "status": "success"})

@app.route('/api/predict/pdf', methods=['POST'])
def predict_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    user_id = request.form.get('user_id')

    if file.filename == '': return jsonify({"error": "No file selected"}), 400

    try:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        extracted_data = parse_pdf_with_gemini(text)
        if not extracted_data:
            return jsonify({"error": "Could not extract weather data from PDF"}), 400

        full_input = {
            'season': extracted_data.get('season', 1),
            'holiday': 0, 'workingday': 1,
            'weather': extracted_data.get('weather', 1),
            'temperature': extracted_data.get('temperature', 25),
            'humidity': extracted_data.get('humidity', 50),
            'windspeed': extracted_data.get('windspeed', 10),
            'hour': 12
        }

        prediction = predict_demand(full_input)

        if user_id:
            conn = get_db_connection()
            conn.execute('INSERT INTO predictions (user_id, input_data, prediction, type) VALUES (?, ?, ?, ?)',
                         (user_id, json.dumps(full_input), prediction, 'pdf_hourly'))
            conn.commit()
            conn.close()

        return jsonify({"prediction": prediction, "extracted_data": full_input, "status": "success"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
def get_user_bookings():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    query = '''
        SELECT b.id, b.date, b.amount, b.status, l.name as location_name
        FROM bookings b
        JOIN locations l ON b.location_id = l.id
        WHERE b.user_id = ?
        ORDER BY b.timestamp DESC
    '''
    rows = conn.execute(query, (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/book', methods=['POST'])
def book_bike():
    data = request.json
    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO bookings (user_id, location_id, date, amount) VALUES (?, ?, ?, ?)',
                     (data['user_id'], data['location_id'], data['date'], data['amount']))
        conn.execute('UPDATE locations SET bikes_available = bikes_available - 1 WHERE id = ?', (data['location_id'],))
        conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/locations', methods=['GET'])
def get_locations():
    conn = get_db_connection()
    locs = conn.execute('SELECT * FROM locations').fetchall()
    conn.close()
    return jsonify([dict(l) for l in locs])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM predictions WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    if not rows: return jsonify({"total_predictions": 0, "avg_prediction": 0, "hourly_traffic": []})
    history = [{"prediction": r['prediction'], "input": json.loads(r['input_data'])} for r in rows]
    avg = int(sum(h['prediction'] for h in history) / len(history))
    return jsonify({"total_predictions": len(history), "avg_prediction": avg, "hourly_traffic": [10,20,30,40,50,60,50,40,30,20,10,5]})

@app.route('/api/user/update', methods=['PUT'])
def update_profile():
    data = request.json
    user_id = data.get('user_id')
    new_name = data.get('name')
    new_pic = data.get('profile_picture')

    if not user_id: return jsonify({"error": "User ID required"}), 401

    conn = get_db_connection()
    try:
        if new_name:
            conn.execute('UPDATE users SET name = ? WHERE id = ?', (new_name, user_id))
        if new_pic:
            conn.execute('UPDATE users SET profile_picture = ? WHERE id = ?', (new_pic, user_id))
        conn.commit()

        user = conn.execute('SELECT id, name, email, profile_picture FROM users WHERE id = ?', (user_id,)).fetchone()
        return jsonify({
            "status": "success",
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "profile_picture": user['profile_picture']
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    conn = get_db_connection()
    conn.execute('INSERT INTO feedback (user_id, message, rating) VALUES (?, ?, ?)',
                 (data.get('user_id'), data['message'], data['rating']))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
