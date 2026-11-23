import {useState, type SubmitEvent} from "react";
import {Priority, type TaskCreate} from "../types/task.ts";
import {createTask} from "../services/taskService.ts";
import type {AuthenticatedRequest} from "../services/apiClient";

interface CreateTaskFormProps {
    authenticatedRequest: AuthenticatedRequest;
    onTaskCreated: () => void;
}

function CreateTaskForm({authenticatedRequest, onTaskCreated}: CreateTaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setError("");

        try {
            const taskData: TaskCreate = {
                title: title.trim(),
                description,
                priority
            };

            await createTask(authenticatedRequest, taskData);

            setTitle("");
            setDescription("");
            setPriority(Priority.MEDIUM);

            onTaskCreated();
        } catch {
            setError("Failed to create task. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="task-title" className="block text-sm text-app-muted">
                        Title
                    </label>

                    <input
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Enter task title"
                        maxLength={100}
                        required
                        className="mt-2 w-full rounded-xl border border-app-border bg-app-input px-4 py-3 text-white outline-none focus:border-app-primary-hover"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm text-app-muted">
                        Description
                    </label>

                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Describe your task..."
                        maxLength={500}
                        className="mt-2 w-full rounded-xl border border-app-border bg-app-input px-4 py-3 text-white outline-none focus:border-app-primary-hover"
                    />
                </div>

                <div>
                    <label htmlFor="task-priority" className="block text-sm text-app-muted">
                        Priority
                    </label>

                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value as Priority)}
                        className="mt-2 w-full rounded-xl border border-app-border bg-app-input px-4 py-3 text-white outline-none focus:border-app-primary-hover"
                    >
                        <option value={Priority.LOW}>
                            Low
                        </option>
                        <option value={Priority.MEDIUM}>
                            Medium
                        </option>
                        <option value={Priority.HIGH}>
                            High
                        </option>
                    </select>
                </div>

                {error && (
                    <p className="text-sm text-rose-400">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !title.trim()}
                    className="w-full rounded-xl bg-app-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-app-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Creating task..." : "Create Task"}
                </button>

            </form>
        </div>
    )
}

export default CreateTaskForm;