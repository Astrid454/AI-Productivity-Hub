import type {Task} from "../types/task";
import {Priority, TaskStatus} from "../types/task";

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: number) => void;
    onEdit: (task: Task) => void;
}

function TaskCard({task, onDelete, onEdit}: TaskCardProps) {
    const priorityColor = {
        [Priority.LOW]: "text-emerald-400",
        [Priority.MEDIUM]: "text-amber-400",
        [Priority.HIGH]: "text-rose-400"
    };

    const statusColor = {
        [TaskStatus.PENDING]: "bg-blue-500/10 text-blue-400",
        [TaskStatus.IN_PROGRESS]: "bg-indigo-500/10 text-indigo-400",
        [TaskStatus.COMPLETED]: "bg-app-accent/10 text-app-accent"
    };

    return (
        <div className="rounded-2xl border border-app-border bg-app-surface p-5
           transition-all duration-200
           hover:-translate-y-1
           hover:border-app-primary/50
           hover:shadow-lg hover:shadow-app-primary/10"
        >

            <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">
                    {task.title}
                </h3>

                <span className={`text-xs font-semibold uppercase ${priorityColor[task.priority]}`}>
                    {task.priority}
                </span>
            </div>

            <p className="mt-3 text-sm text-app-muted">
                {task.description || "No description provided."}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-app-border pt-4">
                <span className={`rounded-lg px-3 py-1 text-xs font-medium ${statusColor[task.status]}`}>
                    {task.status === TaskStatus.IN_PROGRESS
                        ? "In Progress"
                        : task.status === TaskStatus.COMPLETED
                            ? "Completed"
                            : "Pending"}
                </span>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-app-muted">
                        #{task.id}
                    </span>

                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="rounded-lg px-3 py-2 text-sm font-medium
                           text-app-primary-hover transition-colors
                           hover:bg-app-primary/10 hover:text-app-text"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                    >
                        Delete
                    </button>
                </div>
            </div>

        </div>
    );
}

export default TaskCard;