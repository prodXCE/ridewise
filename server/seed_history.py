import json
import random
from datetime import datetime, timedelta


HISTORY_FILE = 'history.json'
entries = []

print("🌱 Seeding database with dummy history...")

for i in range(50):
    hour = random.randint(0, 23)

    base_demand = 50
    if 8 <= hour <= 19: base_demand += 100
    if 17 <= hour <= 18: base_demand += 100 # Peak

    prediction = base_demand + random.randint(-20, 50)

    entry = {
        "timestamp": (datetime.now() - timedelta(minutes=i*10)).strftime("%Y-%m-%d %H:%M:%S"),
        "input": {
            "temperature": 25,
            "humidity": 50,
            "hour": hour, # This is what the graph cares about
            "season": 1,
            "weather": 1
        },
        "prediction": max(10, prediction)
    }
    entries.append(entry)

with open(HISTORY_FILE, 'w') as f:
    json.dump(entries, f, indent=4)

print("✅ Done! Refresh your Dashboard.")
