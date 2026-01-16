import sqlite3

DB_NAME = "ridewise.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # 1. Users
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, name TEXT, profile_picture TEXT)''')

    # 2. Predictions
    cursor.execute('''CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, input_data TEXT, prediction INTEGER, type TEXT DEFAULT 'hourly', timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')

    # 3. Locations (Mumbai)
    cursor.execute('''CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, lat REAL, lng REAL, bikes_available INTEGER, hourly_rate INTEGER)''')

    # 4. Bookings (With Cost)
    cursor.execute('''CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, location_id INTEGER, date TEXT, amount INTEGER, status TEXT DEFAULT 'Confirmed', timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')

    # 5. Feedback
    cursor.execute('''CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, message TEXT, rating INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')

    # Seed Mumbai Locations
    cursor.execute('SELECT count(*) FROM locations')
    if cursor.fetchone()[0] == 0:
        spots = [
            ('Gateway of India', 18.921984, 72.834654, 25, 50),
            ('Juhu Beach Hub', 19.098003, 72.827050, 15, 40),
            ('Bandra Kurla Complex', 19.060692, 72.863385, 40, 60),
            ('Marine Drive Stand', 18.943285, 72.822896, 20, 55),
            ('Powai Lake', 19.125956, 72.903823, 12, 35)
        ]
        cursor.executemany('INSERT INTO locations (name, lat, lng, bikes_available, hourly_rate) VALUES (?,?,?,?,?)', spots)

    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn
