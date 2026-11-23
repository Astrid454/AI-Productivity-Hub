import type {AITaskExtractionResponse} from "../types/ai.ts";
import type {AuthenticatedRequest} from "./apiClient";

export async function extractTasks(
    authenticatedRequest: AuthenticatedRequest,
    text: string
): Promise<AITaskExtractionResponse> {

    const response = await authenticatedRequest(
        "http://127.0.0.1:8000/ai/extract-tasks",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({text})
        }
    );

    if(!response.ok) {
        throw new Error("Failed to extract tasks. Please try again.");
    }

    return response.json();
}