export const Priority = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export const TaskStatus = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
    id: number;
    title: string;
    description: string | null;
    priority: Priority;
    status: TaskStatus;
}

export interface TaskCreate {
    title: string;
    description: string;
    priority: Priority;
}

export interface TaskUpdate {
    title?: string;
    description?: string;
    priority?: Priority;
    status?: TaskStatus;
}