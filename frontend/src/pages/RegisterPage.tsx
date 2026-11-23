import {useState, type SubmitEvent} from 'react'
import {register} from "../services/authService.ts";
import {Link, useNavigate} from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("");

        if(password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        try {
            await register(email.trim(), password);
            navigate("/login");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <AuthLayout>
            <div className="w-full">

                <p className="text-sm font-medium tracking-widest text-app-accent">
                    GET STARTED
                </p>

                <h2 className="mt-4 text-3xl font-bold text-app-text">
                    Create your account
                </h2>

                <p className="mt-3 text-app-muted">
                    Start organizing your work in one intelligent space.
                </p>

                <form onSubmit={handleSubmit} className="mt-10 space-y-6">

                    <div>
                        <label
                            htmlFor="register-email"
                            className="block text-sm font-medium text-app-muted"
                        >
                            Email address
                        </label>

                        <input
                            id="register-email"
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
                            htmlFor="register-password"
                            className="block text-sm font-medium text-app-muted"
                        >
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            required
                            className="mt-2 w-full rounded-xl border border-app-border
                                   bg-app-input px-4 py-3 text-app-text
                                   placeholder-slate-500 outline-none
                                   transition-colors focus:border-app-primary-hover"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="register-confirm-password"
                            className="block text-sm font-medium text-app-muted"
                        >
                            Confirm password
                        </label>

                        <input
                            id="register-confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
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
                               disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>

                </form>

                <p className="mt-8 text-center text-sm text-app-muted">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-app-primary-hover
                               hover:text-app-accent"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </AuthLayout>
    );

}

export default RegisterPage;