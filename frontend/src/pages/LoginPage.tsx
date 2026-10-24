import {useState, type SubmitEvent} from "react";
import {login} from "../services/authService";


function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setError("");

        try {
            const response = await login(email, password);

            console.log("Login successful!");
            console.log("Token received:", Boolean(response.access_token));
        } catch (error) {
            setError("Invalid email or password. Please try again!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#0B0D16] text-white">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center px-8">
                <div>
                    <p className="mb-4 text-sm font-medium tracking-widest text-violet-400">
                        AI PRODUCTIVITY HUB
                    </p>

                    <h1 className="text-5xl font-bold tracking-tight">
                        Welcome back!
                    </h1>

                    <p className="mt-4 text-lg text-slate-400">
                        Sign in to organize your work and unlock your productivity.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8">

                        <div className="mt-8">
                            <label htmlFor="email" className="block text-sm text-slate-300">
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your email"
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-[#171A2B] px-4 py-3 text-white outline-none focus:border-violet-500"
                            />
                        </div>


                        <div className="mt-6">
                            <label htmlFor="password" className="block text-sm text-slate-300">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-[#171A2B] px-4 py-3 text-white outline-none focus:border-violet-500"
                            />
                            {error && (
                                <p className="mt-4 text-sm text-red-400">
                                    {error}
                                </p>
                            )}
                        </div>


                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-8 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>

            </div>
        </main>
    );
}

export default LoginPage;