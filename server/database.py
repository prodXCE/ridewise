import sqlite3

DB_NAME = "ridewise.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            profile_picture TEXT
        )
    ''')

    # 2. Predictions Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            input_data TEXT NOT NULL,
            prediction INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # 3. Locations Table (Rental Spots)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            lat REAL,
            lng REAL,
            bikes_available INTEGER
        )
    ''')

    # 4. Bookings Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            location_id INTEGER,
            date TEXT,
            status TEXT DEFAULT 'Confirmed',
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')

    # 5. Feedback Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            message TEXT,
            rating INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seed Dummy Locations if empty
    cursor.execute('SELECT count(*) FROM locations')
    if cursor.fetchone()[0] == 0:
        spots = [
            ('Central Park Hub', 40.7829, -73.9654, 15),
            ('Downtown Market', 40.7580, -73.9855, 8),
            ('Riverside Station', 40.8000, -73.9700, 22),
            ('University Campus', 40.7291, -73.9965, 5)
        ]
        cursor.executemany('INSERT INTO locations (name, lat, lng, bikes_available) VALUES (?,?,?,?)', spots)

    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn
