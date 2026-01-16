from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

SYSTEM_CONTEXT = """
You are the RideWise Assistant.
You analyze bike fleet data.
Answer in 1-2 short sentences.
"""

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
        response_json = response.json()
        ai_reply = response_json.get('response', 'Error: No response from Llama 3.')

        return jsonify({"reply": ai_reply})

    except Exception as e:
        print(f"Ollama Error: {e}")
        return jsonify({"reply": "I cannot reach Ollama. Is it running?"}), 500

if __name__ == '__main__':
    # Run on Port 5001 to avoid Mac conflicts
    app.run(debug=True, port=5001)
