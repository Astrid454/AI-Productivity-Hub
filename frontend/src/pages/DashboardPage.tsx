import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {getTasks} from "../services/taskService";
import type {Task} from "../types/task";
import {TaskStatus} from "../types/task";
import {ListTodo, Clock3, Activity, CircleCheck, Sparkles, ArrowRight} from "lucide-react";
import {Link} from "react-router-dom";

function DashboardPage() {
    const auth = useContext(AuthContext);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!auth?.token) {
            return;
        }

        getTasks(auth.authenticatedRequest)
            .then((data) => {
                setTasks(data);
            })
            .catch(() => {
                setError("Failed to load dashboard data.");
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [auth?.token]);

    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
        (task) => task.status === TaskStatus.PENDING
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === TaskStatus.IN_PROGRESS
    ).length;

    const completedTasks = tasks.filter(
        (task) => task.status === TaskStatus.COMPLETED
    ).length;

    const completionPercentage =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    return (
        <main className="min-h-screen bg-app-bg px-8 py-12 text-app-text">
            <p className="text-sm font-medium tracking-widest text-app-accent">
                AI PRODUCTIVITY HUB / OVERVIEW
            </p>

            <h1 className="mt-6 text-4xl font-bold">
                Dashboard
            </h1>

            <p className="mt-4 text-app-muted">
                Your productivity at a glance.
            </p>

            {isLoading ? (
                <p className="mt-8 text-app-muted">
                    Loading dashboard...
                </p>
            ) : error ? (
                <p className="mt-8 text-rose-400">
                    {error}
                </p>
            ) : (
                <>
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                label: "Total Tasks",
                                value: totalTasks,
                                icon: ListTodo,
                                color: "text-blue-400",
                                iconBg: "bg-blue-500/10"
                            },
                            {
                                label: "Pending",
                                value: pendingTasks,
                                icon: Clock3,
                                color: "text-amber-400",
                                iconBg: "bg-amber-500/10"
                            },
                            {
                                label: "In Progress",
                                value: inProgressTasks,
                                icon: Activity,
                                color: "text-indigo-400",
                                iconBg: "bg-indigo-500/10"
                            },
                            {
                                label: "Completed",
                                value: completedTasks,
                                icon: CircleCheck,
                                color: "text-app-accent",
                                iconBg: "bg-app-accent/10"
                            }
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-app-border bg-app-surface p-6 transition-colors hover:border-app-primary/50"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-app-muted">
                                        {stat.label}
                                    </p>

                                    <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                                        <stat.icon size={22} className={stat.color} />
                                    </div>
                                </div>

                                <p className="mt-4 text-4xl font-bold text-app-text">
                                    {stat.value}
                                </p>
                            </div>

                        ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                        <section className="rounded-2xl border border-app-border bg-app-surface p-6">
                            <h2 className="text-xl font-semibold text-app-text">
                                Task Progress
                            </h2>

                            <p className="mt-2 text-sm text-app-muted">
                                Track how much work you've completed.
                            </p>

                            <p className="mt-6 text-4xl font-bold text-app-accent">
                                {completionPercentage}%
                            </p>

                            <div
                                className="mt-5 h-3 overflow-hidden rounded-full bg-app-border"
                                role="progressbar"
                                aria-label="Task completion"
                                aria-valuenow={completionPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className="h-full rounded-full bg-app-accent transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>

                            <p className="mt-4 text-sm text-app-muted">
                                {completedTasks} of {totalTasks} tasks completed
                            </p>
                        </section>


                        <section className="rounded-2xl border border-app-border bg-app-surface p-6">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-app-accent" size={24} />

                                <h2 className="text-xl font-semibold text-app-text">
                                    AI Assistant
                                </h2>
                            </div>

                            <p className="mt-4 text-sm text-app-muted">
                                Turn your notes and ideas into actionable tasks using AI.
                            </p>

                            <Link
                                to="/ai-assistant"
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-app-primary px-5 py-3 font-medium text-white transition-colors hover:bg-app-primary-hover"
                            >
                                Extract Tasks
                                <ArrowRight size={18} />
                            </Link>
                        </section>

                    </div>
                </>
            )}
        </main>
    );
}

export default DashboardPage;