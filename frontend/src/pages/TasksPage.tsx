import {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/AuthContext.tsx";
import {getCurrentUser} from "../services/authService.ts";
import {getTasks, deleteTask} from "../services/taskService.ts";
import type {UserResponse} from "../types/auth.ts";
import {Priority, type Task} from "../types/task.ts";
import {TaskStatus} from "../types/task";
import TaskCard from "../components/TaskCard";
import CreateTaskForm from "../components/CreateTaskForm.tsx";
import EditTaskForm from "../components/EditTaskForm";
import Modal from "../components/Modal";
import {ChevronDown, Check} from "lucide-react";

function TasksPage() {
    const auth = useContext(AuthContext);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isTasksLoading, setIsTasksLoading] = useState(true);
    const [tasksError, setTasksError] = useState("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"high-to-low" | "low-to-high">("high-to-low");
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        if(!auth?.token) {
            return;
        }

        getCurrentUser(auth.authenticatedRequest)
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                console.error("Failed to load user:", error);
            });

    }, [auth?.token])

    useEffect(() => {
        if (!auth?.token) {
            return;
        }

        getTasks(auth.authenticatedRequest)
            .then((data) => {
                setTasks(data);
                setTasksError("");
            })
            .catch(() => {
                setTasksError("Failed to load tasks. Please try again.");
            })
            .finally(() => {
                setIsTasksLoading(false);
            });

    }, [auth?.token]);


    async function handleTaskCreated() {
        if (!auth?.token) {
            return;
        }

        try {
            const updatedTasks = await getTasks(auth.authenticatedRequest);
            setTasks(updatedTasks);
        } catch {
            setTasksError("Failed to refresh tasks.");
        }
    }


    async function handleDeleteTask(taskId: number) {
        if (!auth?.token || isDeleting) {
            return;
        }

        setIsDeleting(true);
        setDeleteError("");

        try {
            await deleteTask(auth.authenticatedRequest, taskId);

            setTasks((previousTasks) =>
                previousTasks.filter((task) => task.id !== taskId)
            );

            setTaskToDelete(null);

        } catch {
            setDeleteError("Failed to delete task. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    }


    function handleEditTask(task: Task) {
        setEditingTask(task);
    }

    function handleTaskUpdated(updatedTask: Task) {
        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );

        setEditingTask(null)
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            statusFilter === "all" || task.status === statusFilter;

        const matchesSearch = task.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(searchQuery.toLowerCase().replace(/\s+/g, ""));

        return matchesStatus && matchesSearch;
    });

    const priorityOrder: Record<Priority, number> = {
        [Priority.LOW]: 1,
        [Priority.MEDIUM]: 2,
        [Priority.HIGH]: 3,
    };

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortOrder === "high-to-low") {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return (
        <main className="min-h-screen bg-app-bg px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-12">
            <p className="text-sm font-medium tracking-widest text-app-accent">
                AI PRODUCTIVITY HUB
            </p>

            <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-4xl font-bold">
                        My Tasks
                    </h1>

                    <p className="mt-3 text-app-muted">
                        {user
                            ? `Manage your tasks, ${user.email}!`
                            : "Loading your profile..."}
                    </p>

                    <p className="mt-3 text-sm text-app-muted">
                        {tasks.length} total tasks
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="self-start rounded-xl bg-app-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-app-primary-hover sm:self-auto"
                >
                    + New Task
                </button>

            </div>

            {isCreateOpen && auth?.token && (
                <Modal
                    title="New Task"
                    onClose={() => setIsCreateOpen(false)}
                >
                    <CreateTaskForm
                        authenticatedRequest={auth.authenticatedRequest}
                        onTaskCreated={() => {
                            void handleTaskCreated();
                            setIsCreateOpen(false);
                        }}
                    />
                </Modal>
            )}

            {editingTask && (
                <Modal
                    title="Edit Task"
                    onClose={() => setEditingTask(null)}
                >
                    <EditTaskForm
                        key={editingTask.id}
                        task={editingTask}
                        onCancel={() => setEditingTask(null)}
                        onTaskUpdated={handleTaskUpdated}
                    />
                </Modal>
            )}

            {taskToDelete && (
                <Modal
                    title="Delete Task"
                    onClose={() => {
                        if (!isDeleting) {
                            setTaskToDelete(null);
                            setDeleteError("");
                        }
                    }}
                >
                    <p className="text-app-muted">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-white">
                {taskToDelete.title}
            </span>
                        ?
                    </p>

                    <p className="mt-3 text-sm text-app-muted">
                        This action cannot be undone.
                    </p>

                    {deleteError && (
                        <p role="alert" className="mt-4 text-sm text-rose-400">
                            {deleteError}
                        </p>
                    )}

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() =>{
                                setTaskToDelete(null);
                                setDeleteError("");
                            }}
                            disabled={isDeleting}
                            className="flex-1 rounded-xl border border-app-border px-4 py-3 text-app-muted transition-colors hover:bg-app-border/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => void handleDeleteTask(taskToDelete.id)}
                            disabled={isDeleting}
                            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete Task"}
                        </button>
                    </div>
                </Modal>
            )}

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="w-full md:max-w-md">
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="w-full rounded-xl border border-app-border bg-app-input px-4 py-3 text-app-text placeholder-slate-500 outline-none transition-colors focus:border-app-primary-hover"
                    />
                </div>


                <div className="flex items-center gap-3">
    <span className="text-sm text-app-muted">
        Sort by priority
    </span>

                    <div className="relative">
                        <button
                            type="button"
                            aria-label="Sort by priority"
                            aria-expanded={isSortOpen}
                            aria-haspopup="true"
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex w-44 items-center justify-between
                       rounded-xl border border-app-border
                       bg-app-input px-4 py-3 text-app-text
                       transition-colors hover:border-app-primary-hover"
                        >
                            {sortOrder === "high-to-low" ? "High → Low" : "Low → High"}

                            <ChevronDown
                                size={18}
                                className={`transition-transform ${
                                    isSortOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {isSortOpen && (
                            <div
                                className="absolute right-0 z-20 mt-2 w-44
                           rounded-xl border border-app-border
                           bg-app-surface p-1 shadow-xl"
                            >
                                {[
                                    { label: "High → Low", value: "high-to-low" },
                                    { label: "Low → High", value: "low-to-high" }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setSortOrder(
                                                option.value as "high-to-low" | "low-to-high"
                                            );
                                            setIsSortOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between
                                    rounded-lg px-3 py-3 text-left text-sm
                                    transition-colors ${
                                            sortOrder === option.value
                                                ? "bg-app-primary/20 text-app-primary-hover"
                                                : "text-app-text hover:bg-white/5"
                                        }`}
                                    >
                                        {option.label}

                                        {sortOrder === option.value && (
                                            <Check size={16} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


            </div>

            <div className="mt-8 flex flex-wrap gap-3">
                {[
                    { label: "All", value: "all" },
                    { label: "Pending", value: TaskStatus.PENDING },
                    { label: "In Progress", value: TaskStatus.IN_PROGRESS },
                    { label: "Completed", value: TaskStatus.COMPLETED },
                ].map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() =>
                            setStatusFilter(filter.value as "all" | TaskStatus)
                        }
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                            statusFilter === filter.value
                                ? "bg-app-primary text-white"
                                : "border border-app-border bg-app-surface text-app-muted hover:bg-app-border/40"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {isTasksLoading ? (
                <p className="mt-8 text-app-muted">
                    Loading tasks...
                </p>
            ) : tasksError ? (
                <p className="mt-8 text-red-400">
                    {tasksError}
                </p>
            ) : tasks.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-app-border bg-app-surface p-10 text-center">
                    <h3 className="text-xl font-semibold text-white">
                        No tasks yet
                    </h3>

                    <p className="mt-3 text-sm text-app-muted">
                        Your workspace is empty. Create your first task to get started.
                    </p>
                </div>

            ) : sortedTasks.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-app-border bg-app-surface p-10 text-center">
                    <h3 className="text-xl font-semibold text-white">
                        No matching tasks found
                    </h3>

                    <p className="mt-3 text-sm text-app-muted">
                        Try changing your search query or status filter.
                    </p>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                    {sortedTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={() => setTaskToDelete(task)}
                            onEdit={handleEditTask}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default TasksPage;