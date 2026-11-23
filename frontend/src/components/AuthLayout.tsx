import type {ReactNode} from "react";
import {Sparkles, CheckCircle2} from "lucide-react";

interface AuthLayoutProps {
    children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="grid min-h-screen bg-app-bg text-app-text lg:grid-cols-2">

            <section
                className="relative flex flex-col justify-between
                           overflow-hidden border-b border-app-border
                           bg-[linear-gradient(145deg,#102B48_0%,#11223C_45%,#080F18_100%)]
                           p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-16"
            >
                <div className="flex items-center gap-3">
                    <Sparkles size={28} className="text-app-accent" />

                    <span className="text-xl font-bold text-app-text">
                        AI Productivity Hub
                    </span>
                </div>

                <div className="my-12 max-w-lg lg:my-0">
                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                        Focus on what matters.
                    </h1>

                    <p className="mt-6 text-lg text-app-muted">
                        Organize your work, simplify your day.
                    </p>

                    <div className="mt-8 flex items-center gap-3 text-app-text">
                        <CheckCircle2
                            size={22}
                            className="shrink-0 text-app-accent"
                        />
                        <span>Plan smarter. Achieve more.</span>
                    </div>
                </div>

                <div className="hidden items-center gap-2 lg:flex">
                    <span className="h-1 w-12 rounded-full bg-app-accent" />
                    <span className="h-1 w-6 rounded-full bg-app-primary-hover" />
                    <span className="h-1 w-6 rounded-full bg-app-border" />
                </div>
            </section>


            <section
                className="flex items-center justify-center
                           bg-app-bg px-6 py-12 sm:px-10 lg:px-16"
            >
                <div className="w-full max-w-md">
                    {children}
                </div>
            </section>

        </main>
    );
}

export default AuthLayout;
