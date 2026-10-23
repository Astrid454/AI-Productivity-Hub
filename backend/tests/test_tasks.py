from fastapi.testclient import TestClient
from app.main import app
import pytest
from app.services import task_service

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_tasks():
    task_service.tasks_db.clear()
    task_service.next_task_id = 1

def test_create_task():
    response = client.post(
        "/tasks",
        json={
            "title": "Pytest",
            "description": "Test api endpoints",
            "priority": "medium"
        }
    )

    assert response.status_code == 201
    data = response.json()

    assert data["title"] == "Pytest"
    assert data["priority"] == "medium"
    assert data["status"] == "pending"


def test_create_task_invalid_priority():
    response = client.post(
        "/tasks",
        json={
            "title": "Pytest",
            "description": "Test api endpoints",
            "priority": "Medium"
        }
    )

    assert response.status_code == 422

def test_get_task():
    response = client.post(
        "/tasks",
        json={
            "title": "Learn FastAPI",
            "description": "Practice REST APIs",
            "priority": "high"
        }
    )

    task_id = response.json()["id"]
    response = client.get(f"/tasks/{task_id}")

    assert response.status_code == 200
    data = response.json()

    assert data["title"] == "Learn FastAPI"
    assert data["id"] == task_id
