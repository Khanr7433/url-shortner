import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

const RequireAuth = ({ children, role }: { children: ReactNode, role?: 'admin' }) => {
    const { user, loading, role: userRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`} replace />;
    }

    if (role && userRole !== role) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RequireAuth;
