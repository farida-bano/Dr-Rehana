"""
Tests for messages API
"""
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    from app.main import app
    return TestClient(app)

def test_create_message(client):
    """Test creating a message"""
    response = client.post("/api/v1/messages", json={
        "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
        "channel": "email",
        "content": "Test message",
        "sender_type": "customer"
    })
    assert response.status_code == 200

def test_get_message(client):
    """Test getting a message"""
    response = client.get("/api/v1/messages/550e8400-e29b-41d4-a716-446655440000")
    assert response.status_code == 200

def test_list_messages(client):
    """Test listing messages"""
    response = client.get("/api/v1/messages?skip=0&limit=10")
    assert response.status_code == 200
