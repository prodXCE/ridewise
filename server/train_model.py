import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

# 1. Define Features
FEATURES = ['season', 'holiday', 'workingday', 'weather', 'temperature', 'humidity', 'windspeed', 'hour']

print("🚴 Generating High-Sensitivity Dataset...")

# 2. Generates 5000 samples
np.random.seed(42)
n_samples = 5000
data = pd.DataFrame({
    'season': np.random.randint(1, 5, n_samples),
    'holiday': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
    'workingday': np.random.choice([0, 1], n_samples, p=[0.3, 0.7]),
    'weather': np.random.randint(1, 4, n_samples),
    'temperature': np.random.uniform(-5, 40, n_samples),
    'humidity': np.random.uniform(20, 100, n_samples),
    'windspeed': np.random.uniform(0, 40, n_samples),
    'hour': np.random.randint(0, 24, n_samples)
})

# 3. The "Real World" Logic
def calculate_demand(row):
    base = 100

    # --- HOUR EFFECT (Strongest) ---
    # Rush Hour (8-9 AM and 5-7 PM) -> Huge spike
    if 8 <= row['hour'] <= 9 or 17 <= row['hour'] <= 19:
        base += 150
    # Day time (10 AM - 4 PM) -> Moderate
    elif 10 <= row['hour'] <= 16:
        base += 80
    # Late Night (11 PM - 5 AM) -> Dead
    else:
        base -= 80

    # --- TEMPERATURE EFFECT ---
    # People love 20-28 degrees
    if 20 <= row['temperature'] <= 28:
        base += 50
    # Too cold (< 10) or Too hot (> 32)
    elif row['temperature'] < 10 or row['temperature'] > 32:
        base -= 40

    # --- WEATHER EFFECT ---
    # 1=Clear, 2=Mist, 3=Light Rain, 4=Heavy Rain
    if row['weather'] == 3: base -= 60  # Rain hurts
    if row['weather'] == 4: base -= 150 # Storm kills demand

    # --- SEASON EFFECT ---
    # 1=Spring, 2=Summer, 3=Fall, 4=Winter
    if row['season'] == 4: base -= 30 # Winter is slow
    if row['season'] == 2: base += 30 # Summer is busy

    if row['humidity'] > 80: base -= 30 # Too humid/muggy

    noise = np.random.normal(0, 15)
    return max(10, int(base + noise)) # Minimum 10 bikes

data['count'] = data.apply(calculate_demand, axis=1)

print("🛠️  Training Model...")

X = data[FEATURES]
y = data['count']

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

print("✅ Model Trained!")

test_case_good = pd.DataFrame([[2, 0, 1, 1, 25, 50, 10, 17]], columns=FEATURES) # Summer, 5PM, Nice
test_case_bad  = pd.DataFrame([[4, 0, 1, 3, 5, 90, 20, 3]], columns=FEATURES)   # Winter, 3AM, Rain

pred_good = model.predict(test_case_good)[0]
pred_bad = model.predict(test_case_bad)[0]

print(f"\n🧪 TEST RESULTS:")
print(f"   Ideally Perfect Day (Should be High): {int(pred_good)} bikes")
print(f"   Terrible Winter Night (Should be Low): {int(pred_bad)} bikes")

joblib.dump(model, 'model.pkl')
print("\n💾 Saved to 'model.pkl'")
