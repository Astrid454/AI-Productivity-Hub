import {useState, useContext, type SubmitEvent} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {extractTasks} from "../services/aiService.ts";
import {Priority} from "../types/task";
import type {AITaskSuggestion} from "../types/ai.ts";
import {createTask} from "../services/taskService.ts";
import {ChevronDown, Check} from "lucide-react";

function AIAssistantPage() {

    const [notes, setNotes] = useState("");
    const auth = useContext(AuthContext);
    const [suggestions, setSuggestions] = useState<AITaskSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [hasExtracted, setHasExtracted] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [openPriorityIndex, setOpenPriorityIndex] = useState<number | null>(null);

    async function handleExtractTasks(
        event: SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if(!auth?.token || !notes.trim()) {
            return;
        }

        setIsLoading(true);
        setError("");
        setSuggestions([]);
        setHasExtracted(false);
        setSuccessMessage("");

        try {
            const result = await extractTasks(
                auth.authenticatedRequest,
                notes.trim(),
            );

            setSuggestions(result.tasks);
            setHasExtracted(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    function updateSuggestion(
        index: number,
        updates: Partial<AITaskSuggestion>
    ) {

        setSuggestions((previous) =>
            previous.map((task, taskIndex) =>
                taskIndex === index ? {...task, ...updates} : task
            )
        );
    }

    function removeSuggestion(index: number) {
        setOpenPriorityIndex(null);

        setSuggestions((previous) =>
            previous.filter((_, taskIndex) => taskIndex !== index)
        );

        setHasExtracted(false);
    }

    async function handleSaveSuggestions() {
        if(!auth?.token || isSaving || suggestions.length === 0) {
            return;
        }

        if(suggestions.some((task) => !task.title.trim())) {
            setSaveError("Every task must have a title.");
            return;
        }

        setIsSaving(true);
        setSaveError("");
        setSuccessMessage("");

        let savedCount = 0;

        try {
            for (const suggestion of suggestions) {
                await createTask(auth.authenticatedRequest, {
                    title: suggestion.title.trim(),
                    description: suggestion.description ?? "",
                    priority: suggestion.priority
                });

                savedCount++;
            }

            setSuggestions([]);
            setNotes("");
            setHasExtracted(false);

            setSuccessMessage(
                `${savedCount} task${savedCount === 1 ? "" : "s"} saved successfully!`
            );
        } catch (err) {
            setSuggestions((previous) =>
                previous.slice(savedCount)
            );

            if (err instanceof Error) {
                setSaveError(err.message);
            } else {
                setSaveError("An unexpected error occurred.");
            }

        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main className="min-h-screen bg-app-bg px-4 py-6 text-white sm:px-6 lg:px-8">
            <p className="text-sm font-medium tracking-widest text-app-accent">
                AI PRODUCTIVITY HUB / ASSISTANT
            </p>

            <h1 className="mt-8 text-4xl font-bold">
                AI Task Assistant
            </h1>

            <p className="mt-3 text-app-muted">
                Turn your notes into actionable tasks with AI.
            </p>

            <form
                onSubmit={handleExtractTasks}
                className="mt-10 max-w-3xl rounded-2xl border border-app-border bg-app-surface p-5 sm:p-6"
            >

                <label
                    htmlFor="ai-notes"
                    className="block text-sm font-medium text-slate-200"
                >
                    Your Notes
                </label>

                <p className="mt-2 text-sm text-app-muted">
                    Describe what you need to do, and AI will suggest tasks.
                </p>

                <textarea
                    id="ai-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Example: Tomorrow I need to finish my React project and email my professor..."
                    rows={6}
                    maxLength={5000}
                    className="mt-5 w-full resize-y rounded-xl border border-app-border bg-app-input px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-app-primary-hover"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-slate-500">
                        {notes.length} / 5000 characters
                    </p>

                    <button
                        type="submit"
                        disabled={!notes.trim() || isLoading}
                        className="rounded-xl bg-app-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-app-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Extracting tasks..." : "Extract Tasks"}
                    </button>
                </div>
            </form>

            {successMessage && (
                <div
                    role="status"
                    className="mt-6 max-w-3xl rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                >
                    {successMessage}
                </div>
            )}

            {error && (
                <p role="alert" className="mt-4 text-sm text-rose-400">
                    {error}
                </p>
            )}

            {saveError && (
                <p role="alert" className="mt-4 text-sm text-rose-400">
                    {saveError}
                </p>
            )}

            {hasExtracted && suggestions.length === 0 && (
                <div className="mt-8 max-w-3xl rounded-2xl border border-dashed border-app-border bg-app-surface p-8 text-center">
                    <h2 className="text-lg font-semibold text-white">
                        No actionable tasks found
                    </h2>

                    <p className="mt-2 text-sm text-app-muted">
                        Try providing more details or describing specific actions
                        you need to complete.
                    </p>
                </div>
            )}

            {suggestions.length > 0 && (
                <section className="mt-8 max-w-3xl">
                    <h2 className="text-2xl font-semibold text-white">
                        AI Suggestions
                    </h2>

                    <p className="mt-2 text-sm text-app-muted">
                        Review the extracted tasks before saving them.
                    </p>

                    <div className="mt-5 space-y-4">
                        {suggestions.map((task, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-app-border bg-app-surface p-5"
                            >
                                <input
                                    type="text"
                                    aria-label={`Title for suggestion ${index + 1}`}
                                    value={task.title}
                                    onChange={(event) =>
                                        updateSuggestion(index, {title: event.target.value})
                                    }
                                    maxLength={200}
                                    className="w-full rounded-lg border border-app-border bg-app-input px-3 py-2 font-semibold text-white outline-none focus:border-app-primary-hover"
                                />

                                <textarea
                                    aria-label={`Description for suggestion ${index + 1}`}
                                    value={task.description ?? ""}
                                    onChange={(event) =>
                                        updateSuggestion(index, {description: event.target.value})
                                    }
                                    placeholder="Add a description (optional)"
                                    rows={3}
                                    className="mt-3 w-full resize-y rounded-xl border border-app-border bg-app-input px-3 py-2 text-sm text-white outline-none focus:border-app-primary-hover"
                                />


                                <div className="relative mt-3">
                                    <button
                                        type="button"
                                        aria-label={`Priority for suggestion ${index + 1}`}
                                        aria-expanded={openPriorityIndex === index}
                                        aria-haspopup="true"
                                        onClick={() =>
                                            setOpenPriorityIndex(
                                                openPriorityIndex === index ? null : index
                                            )
                                        }
                                        className="flex w-full items-center justify-between rounded-xl border border-app-border bg-app-input px-4 py-3 text-app-text transition-colors hover:border-app-primary-hover"
                                        >

                                        <span className="capitalize">
                                            {task.priority}
                                        </span>

                                        <ChevronDown
                                            size={18}
                                            className={`transition-transform ${
                                                openPriorityIndex === index ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {openPriorityIndex === index && (
                                        <div
                                            className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-app-border bg-app-surface p-1 shadow-xl"
                                        >
                                            {Object.values(Priority).map((priority) => (
                                                <button
                                                    key={priority}
                                                    type="button"
                                                    onClick={() => {
                                                        updateSuggestion(index, { priority });
                                                        setOpenPriorityIndex(null);
                                                    }}
                                                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                                                        task.priority === priority
                                                            ? "bg-app-primary/20 text-app-primary-hover"
                                                            : "text-app-text hover:bg-white/5"
                                                    }`}
                                                >

                                                <span className="capitalize">
                                                    {priority}
                                                </span>

                                                    {task.priority === priority && (
                                                        <Check size={16} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>


                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeSuggestion(index)}
                                        className="rounded-lg border border-rose-500/30 px-4 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-500/10"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => void handleSaveSuggestions()}
                            className="rounded-xl bg-app-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-app-primary-hover disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Confirm & Save"}
                        </button>
                    </div>

                </section>
            )}
        </main>
    );
}

export default AIAssistantPage;