# 🚲 RideWise: AI-Powered Fleet Management

RideWise is a full-stack, enterprise-grade analytics dashboard for bike-sharing systems.  
It leverages a **local LLM (Llama 3)** to provide natural-language insights and voice-based interactions for fleet monitoring and demand analysis.

---

## 🚀 Features

- **AI Assistant**  
  Conversational analytics using Llama 3 via Ollama (text and voice input).

- **Demand Predictor**  
  Machine-learning–based forecasting using XGBoost / Random Forest.

- **Live Map Visualization**  
  Interactive Leaflet map with real-time bike status and simulated payments.

- **Secure Authentication**  
  JWT-based authentication with private user sessions and history.

---

## 🛠 Tech Stack

### Frontend
- React
- Tailwind CSS
- Vite
- Recharts
- Leaflet

### Backend
- Python
- Flask
- SQLAlchemy

### AI & Voice
- Ollama (Llama 3.2)
- Web Speech API

---

## 📦 Installation

### 1. Prerequisites
Ensure the following are installed:
- Node.js and npm
- Python 3.10+
- Ollama  
  ```bash
  ```ollama run llama3.2:1b

### 2. Backend Setup
```cd server
```pip install -r requirements.txt
```python app.py

---

### 3. Frontend Setup
```cd client
```npm install
```npm run dev

▶ Usage
Open the application in your browser:
http://localhost:5173
Register or log in to access the RideWise dashboard.
📌 Final Push (Git)
After adding the README, commit and push the changes:
```git add .
```git commit -m "Add project documentation"
```git push

