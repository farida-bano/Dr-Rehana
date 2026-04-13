from sqlmodel import create_engine, Session, SQLModel
from .models import User, Task
import os

# Database URL - using Neon PostgreSQL in production, SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session