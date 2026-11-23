import {useContext, type ReactNode} from 'react';
import {Navigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.tsx";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const auth = useContext(AuthContext);

    if(auth?.isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0B0D16] text-slate-300">
                Restoring session...
            </div>
        );
    }

    if(!auth?.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;