import type {Task, TaskCreate, TaskUpdate} from "../types/task.ts";
import type {AuthenticatedRequest} from "./apiClient";

export async function getTasks(
    authenticatedRequest: AuthenticatedRequest
): Promise<Task[]> {
    const response = await authenticatedRequest(
        "http://127.0.0.1:8000/tasks",
        {
            method: "GET"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }

    return response.json();
}

export async function createTask(
    authenticatedRequest: AuthenticatedRequest,
    task: TaskCreate
): Promise<Task> {
    const response = await authenticatedRequest(
        "http://127.0.0.1:8000/tasks",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        }
    );

    if(!response.ok) {
        throw new Error("Failed to create task");
    }

    return response.json();
}

export async function deleteTask(
    authenticatedRequest: AuthenticatedRequest,
    taskId: number
): Promise<void> {

    const response = await authenticatedRequest(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
            method: "DELETE"
        }
    );

    if(!response.ok) {
        throw new Error("Failed to delete task");
    }
}

export async function updateTask(
    authenticatedRequest: AuthenticatedRequest,
    taskId: number,
    updates: TaskUpdate
): Promise<Task> {

    const response = await authenticatedRequest(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        }
    );

    if(!response.ok) {
        throw new Error("Failed to update task");
    }

    return response.json();
}