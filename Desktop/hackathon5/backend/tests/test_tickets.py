"""
Tests for tickets API
"""
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    from app.main import app
    return TestClient(app)

def test_create_ticket(client):
    """Test creating a ticket"""
    response = client.post("/api/v1/tickets", json={
        "customer_id": "550e8400-e29b-41d4-a716-446655440000",
        "issue_category": "billing",
        "priority": "normal"
    })
    assert response.status_code == 200

def test_get_ticket(client):
    """Test getting a ticket"""
    response = client.get("/api/v1/tickets/550e8400-e29b-41d4-a716-446655440000")
    assert response.status_code == 200

def test_list_tickets(client):
    """Test listing tickets"""
    response = client.get("/api/v1/tickets?skip=0&limit=10")
    assert response.status_code == 200
