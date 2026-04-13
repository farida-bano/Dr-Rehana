import sys
import os
sys.path.insert(0, '.')

# Add the app directory to the path
sys.path.insert(0, './app')

from app.database import create_db_and_tables

def init_database():
    print("Initializing database...")
    create_db_and_tables()
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_database()