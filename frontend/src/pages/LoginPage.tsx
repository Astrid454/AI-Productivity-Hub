import {useContext, useState, type SubmitEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {login} from "../services/authService";
import AuthLayout from "../components/AuthLayout";


function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setError("");

        try {
            const response = await login(email, password);

            if(!auth) {
                throw new Error("AuthContext is not available");
            }

            auth.setToken(response.access_token);

            navigate("/dashboard", { replace: true });

        } catch (error) {
            if(error instanceof Error && error.message === "AuthContext is not available") {
                console.error(error);
            }

            setError("Login failed. Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <AuthLayout>
            <div className="w-full">

                <p className="text-sm font-medium tracking-widest text-app-accent">
                    WELCOME BACK
                </p>

                <h2 className="mt-4 text-3xl font-bold text-app-text">
                    Sign in to your account
                </h2>

                <p className="mt-3 text-app-muted">
                    Welcome back! Continue where you left off.
                </p>

                <form onSubmit={handleSubmit} className="mt-10 space-y-6">

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-app-muted"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="mt-2 w-full rounded-xl border border-app-border
                                   bg-app-input px-4 py-3 text-app-text
                                   placeholder-slate-500 outline-none
                                   transition-colors focus:border-app-primary-hover"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-app-muted"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className="mt-2 w-full rounded-xl border border-app-border
                                   bg-app-input px-4 py-3 text-app-text
                                   placeholder-slate-500 outline-none
                                   transition-colors focus:border-app-primary-hover"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-rose-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-app-primary px-5 py-3
                               font-semibold text-white transition-colors
                               hover:bg-app-primary-hover
                               disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                <p className="mt-8 text-center text-sm text-app-muted">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-app-primary-hover
                               hover:text-app-accent"
                    >
                        Create an account
                    </Link>
                </p>

            </div>
        </AuthLayout>
    );

}

export default LoginPage;