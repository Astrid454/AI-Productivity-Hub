import {useContext, useState, type SubmitEvent} from "react";
import {AuthContext} from "../context/AuthContext";
import {updateTask} from "../services/taskService";
import {Priority, TaskStatus, type Task, type TaskUpdate} from "../types/task";

interface EditTaskFormProps {
    task: Task;
    onCancel: () => void;
    onTaskUpdated: (updatedTask: Task) => void;
}

function EditTaskForm({ task, onCancel, onTaskUpdated}: EditTaskFormProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [priority, setPriority] = useState<Priority>(task.priority);
    const [status, setStatus] = useState<TaskStatus>(task.status);

    const auth = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!auth?.token) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const updates: TaskUpdate = {
                title: title.trim(),
                description,
                priority,
                status
            };

            const updatedTask = await updateTask(
                auth.authenticatedRequest,
                task.id,
                updates
            );

            onTaskUpdated(updatedTask);

        } catch {
            setError("Failed to update task. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex max-h-[70dvh] min-h-0 flex-col"
        >
            <div className="modal-scroll min-h-0 flex-1 space-y-5 overflow-y-auto pr-3">
                <div>
                    <label htmlFor="edit-title" className="block text-sm text-app-muted">
                        Title
                    </label>
                    <input
                        id="edit-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        maxLength={100}
                        required
                        className="mt-2 w-full rounded-xl border border-app-border bg-app-input px-4 py-3 text-white outline-none focus:border-app-primary-hover"
                    />
                </div>

                <div>
                    <label htmlFor="edit-description" className="block text-sm text-app-muted">
                        Description
                    </label>
                    <textarea
                        id="edit-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        maxLength={500}
                        rows={3}
                        className="mt-2 w-full rounded-xl border border-app-border bg-app-input px-4 py-3 text-white outline-none focus:border-app-primary-hover"
                    />
                </div>

                <div>
                    <label htmlFor="edit-priority" className="block text-sm text-app-muted">
                        Priority
                    </label>
                    <select
                        id="edit-priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value as Priority)}
                        className="mt-2 w-full rounded-xl border border-app-border bg-app-input px-4 py-3 text-white outline-none focus:border-app-primary-hover"
                    >
                        <option value={Priority.LOW}>Low</option>
                        <option value={Priority.MEDIUM}>Medium</option>
                        <option value={Priority.HIGH}>High</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="edit-status" className="block text-sm text-app-muted">
                        Status
                    </label>
                    <select
                        id="edit-status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value as TaskStatus)}
                        className="mt-2 w-full rounded-xl border border-app-border bg-app-input px-4 py-3 text-white outline-none focus:border-app-primary-hover"
                    >
                        <option value={TaskStatus.PENDING}>Pending</option>
                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>
                </div>
            </div>


            <div className="mt-4 shrink-0 space-y-3 border-t border-app-border pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full rounded-xl border border-app-border px-5 py-3 font-medium text-app-muted transition-colors hover:bg-app-border/40"
                >
                    Cancel
                </button>

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
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

export default EditTaskForm;