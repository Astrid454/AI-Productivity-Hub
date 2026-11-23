import type {ReactNode} from "react";

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
}

function Modal({ title, children, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="flex max-h-[90dvh] w-full max-w-xl flex-col rounded-2xl border border-app-border bg-app-surface p-4 shadow-2xl backdrop-blur-sm sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-app-text">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="rounded-lg px-3 py-2 text-app-muted transition-colors hover:bg-app-border/40 hover:text-app-text"
                    >
                        ✕
                    </button>
                </div>

                <div className="min-h-0 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;