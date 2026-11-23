import type {Priority} from "./task";

export interface AITaskSuggestion {
    title: string;
    description: string | null;
    priority: Priority;
}

export interface AITaskExtractionResponse {
    tasks: AITaskSuggestion[];
}