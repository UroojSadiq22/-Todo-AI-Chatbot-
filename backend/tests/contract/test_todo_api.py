"""Contract tests for todo API endpoints."""

import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.database.session import AsyncSessionLocal
from src.models.user import User
from src.models.todo import Todo
from src.auth import create_access_token
from uuid import uuid4


@pytest.fixture
def client():
    """Create a test client for the API."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.mark.asyncio
async def test_get_todos_endpoint_contract():
    """Test the contract for GET /api/todos endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        response = client.get("/api/todos/")

        # Expected response format
        assert "status_code" in ["200", "401"]  # 200 for success, 401 for auth failure

        # If successful, response should be a list of todos
        # Each todo should have id, title, description, completed, user_id, timestamps
        if response.status_code == 200:
            todos = response.json()
            if isinstance(todos, list) and len(todos) > 0:
                todo = todos[0]
                assert "id" in todo
                assert "title" in todo
                assert "description" in todo
                assert "completed" in todo
                assert "user_id" in todo
                assert "created_at" in todo
                assert "updated_at" in todo


@pytest.mark.asyncio
async def test_create_todo_endpoint_contract():
    """Test the contract for POST /api/todos endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        new_todo_data = {
            "title": "Test Todo",
            "description": "Test Description"
        }

        response = client.post("/api/todos/", json=new_todo_data)

        # Expected response format
        assert "status_code" in ["201", "401", "422"]  # 201 for success, 401 for auth, 422 for validation

        # If successful, response should contain the created todo
        if response.status_code == 201:
            todo = response.json()
            assert "id" in todo
            assert "title" in todo
            assert "description" in todo
            assert "completed" in todo
            assert "user_id" in todo
            assert "created_at" in todo
            assert "updated_at" in todo


@pytest.mark.asyncio
async def test_get_specific_todo_endpoint_contract():
    """Test the contract for GET /api/todos/{id} endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        fake_todo_id = str(uuid4())
        response = client.get(f"/api/todos/{fake_todo_id}")

        # Expected response format
        assert "status_code" in ["200", "401", "404"]  # 200 for success, 401 for auth, 404 for not found

        # If successful, response should contain the todo
        if response.status_code == 200:
            todo = response.json()
            assert "id" in todo
            assert "title" in todo
            assert "description" in todo
            assert "completed" in todo
            assert "user_id" in todo
            assert "created_at" in todo
            assert "updated_at" in todo


@pytest.mark.asyncio
async def test_update_todo_endpoint_contract():
    """Test the contract for PUT /api/todos/{id} endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        fake_todo_id = str(uuid4())
        update_data = {
            "title": "Updated Todo",
            "description": "Updated Description",
            "completed": True
        }

        response = client.put(f"/api/todos/{fake_todo_id}", json=update_data)

        # Expected response format
        assert "status_code" in ["200", "401", "404", "422"]  # 200 for success, 401 for auth, 404 for not found, 422 for validation

        # If successful, response should contain the updated todo
        if response.status_code == 200:
            todo = response.json()
            assert "id" in todo
            assert "title" in todo
            assert "description" in todo
            assert "completed" in todo
            assert "user_id" in todo
            assert "created_at" in todo
            assert "updated_at" in todo


@pytest.mark.asyncio
async def test_delete_todo_endpoint_contract():
    """Test the contract for DELETE /api/todos/{id} endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        fake_todo_id = str(uuid4())
        response = client.delete(f"/api/todos/{fake_todo_id}")

        # Expected response format
        assert "status_code" in ["204", "401", "404"]  # 204 for success, 401 for auth, 404 for not found


@pytest.mark.asyncio
async def test_toggle_todo_completion_endpoint_contract():
    """Test the contract for PATCH /api/todos/{id}/toggle endpoint."""
    with TestClient(app) as client:
        # This test will fail initially as expected, per TDD
        fake_todo_id = str(uuid4())
        response = client.patch(f"/api/todos/{fake_todo_id}/toggle")

        # Expected response format
        assert "status_code" in ["200", "401", "404"]  # 200 for success, 401 for auth, 404 for not found

        # If successful, response should contain the toggled todo
        if response.status_code == 200:
            todo = response.json()
            assert "id" in todo
            assert "title" in todo
            assert "description" in todo
            assert "completed" in todo
            assert "user_id" in todo
            assert "created_at" in todo
            assert "updated_at" in todo