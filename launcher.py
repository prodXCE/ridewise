import os
import time
import subprocess
import sys
from pyngrok import ngrok
from threading import Thread

NGROK_AUTH_TOKEN = ""
PORT = 5001

def start_server():
    print("🧠 Starting RideWise System...")
    subprocess.call([sys.executable, "app.py"], cwd="server")

def main():
    print("🔐 Authenticating Ngrok...")
    ngrok.set_auth_token(NGROK_AUTH_TOKEN)

    print("🚇 Creating Secure Tunnel...")
    try:
        tunnel = ngrok.connect(PORT, bind_tls=True)
        public_url = tunnel.public_url

        env_path = os.path.join("client", ".env")
        with open(env_path, "w") as f:
            f.write(f"VITE_API_URL={public_url}\n")

        print("\n" + "="*50)
        print(f"🚀 RIDEWISE IS LIVE!")
        print(f"🌍 Click here: {public_url}")
        print("="*50 + "\n")

    except Exception as e:
        print(f"❌ Tunnel Error: {e}")
        return

    t_server = Thread(target=start_server)
    t_server.daemon = True
    t_server.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
        ngrok.kill()
        sys.exit(0)

if __name__ == "__main__":
    main()
