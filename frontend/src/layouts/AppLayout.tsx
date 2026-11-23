import {NavLink, Outlet} from "react-router-dom";
import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {LayoutDashboard, ListTodo, LogOut, Menu, X, Sparkles} from "lucide-react";
import {logout} from "../services/authService";

function AppLayout() {

    const auth = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    async function handleLogout() {
        try {
            await logout();
            auth?.setToken(null);
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    }

    function navLinkClass(isActive: boolean) {
        return `flex items-center gap-3 rounded-xl px-4 py-3
            transition-colors ${
            isActive
                ? "bg-app-primary/20 text-app-primary-hover"
                : "text-app-muted hover:bg-white/5 hover:text-app-text"
        }`;
    }

    return (
        <div className="flex min-h-screen w-full overflow-x-clip bg-app-bg text-white">

            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-app-border bg-app-surface p-6 md:flex">
                <h2 className="text-lg font-bold text-app-accent">
                    AI Productivity Hub
                </h2>

                <nav className="mt-10 flex flex-col gap-3">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => navLinkClass(isActive)}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className={({ isActive }) => navLinkClass(isActive)}
                    >
                        <ListTodo size={20} />
                        <span>My Tasks</span>
                    </NavLink>

                    <NavLink
                        to="/ai-assistant"
                        className={({ isActive }) => navLinkClass(isActive)}
                    >
                        <Sparkles size={20} />
                        <span>AI Assistant</span>
                    </NavLink>
                </nav>

                <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="flex items-center gap-3 mt-auto rounded-xl border border-app-border px-4 py-3 text-left text-app-muted transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">

                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />


                    <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-app-border bg-app-surface p-6">

                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-app-accent">
                                AI Productivity Hub
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close navigation menu"
                                className="rounded-lg p-2 text-app-muted hover:bg-white/10"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <nav className="mt-10 flex flex-col gap-3">
                            <NavLink
                                to="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => navLinkClass(isActive)}
                            >
                                <LayoutDashboard size={20} />
                                <span>Dashboard</span>
                            </NavLink>

                            <NavLink
                                to="/tasks"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => navLinkClass(isActive)}
                            >
                                <ListTodo size={20} />
                                <span>My Tasks</span>
                            </NavLink>

                            <NavLink
                                to="/ai-assistant"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => navLinkClass(isActive)}
                            >
                                <Sparkles size={20} />
                                <span>AI Assistant</span>
                            </NavLink>
                        </nav>

                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                void handleLogout();
                            }}
                            className="mt-auto flex items-center gap-3 rounded-xl border border-app-border px-4 py-3 text-left text-app-muted hover:bg-rose-500/10 hover:text-rose-300"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>

                    </aside>
                </div>
            )}

            <div className="min-w-0 flex-1">

                <header className="flex items-center justify-between border-b border-app-border bg-app-surface px-5 py-4 md:hidden">
                    <span className="font-semibold text-app-accent">
                        AI Productivity Hub
                    </span>

                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open navigation menu"
                        aria-expanded={isMobileMenuOpen}
                        className="rounded-lg p-2 text-app-muted hover:bg-white/10"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <Outlet />
            </div>

        </div>
    );
}

export default AppLayout;