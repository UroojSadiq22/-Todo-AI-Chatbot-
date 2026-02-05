"""Contract tests for auth API endpoints."""

import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.database.session import AsyncSessionLocal
from src.models.user import User
from src.auth import create_access_token
from uuid import uuid4


@pytest.fixture
def client():
    """Create a test client for the API."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.mark.asyncio
async def test_register_endpoint_contract():
    """Test the contract for POST /api/auth/register endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        new_user_data = {
            "email": "test@example.com",
            "name": "Test User",
            "password": "securepassword123"
        }

        response = client.post("/api/auth/register", json=new_user_data)

        # Expected response format
        assert "status_code" in ["200", "400", "409"]  # 200 for success, 400 for bad request, 409 for conflict

        # If successful, response should contain the created user
        if response.status_code == 200:
            user = response.json()
            assert "id" in user
            assert "email" in user
            assert "name" in user
            assert "created_at" in user
            assert "updated_at" in user


@pytest.mark.asyncio
async def test_login_endpoint_contract():
    """Test the contract for POST /api/auth/token endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        user_credentials = {
            "email": "test@example.com",
            "password": "securepassword123"
        }

        response = client.post("/api/auth/token", json=user_credentials)

        # Expected response format
        assert "status_code" in ["200", "401"]  # 200 for success, 401 for unauthorized

        # If successful, response should contain the access token
        if response.status_code == 200:
            token_response = response.json()
            assert "access_token" in token_response
            assert "token_type" in token_response
            assert token_response["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_logout_endpoint_contract():
    """Test the contract for POST /api/auth/logout endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        # Need to provide valid token in headers
        headers = {"Authorization": "Bearer valid_token_here"}
        response = client.post("/api/auth/logout", headers=headers)

        # Expected response format
        assert "status_code" in ["200", "401"]  # 200 for success, 401 for unauthorized