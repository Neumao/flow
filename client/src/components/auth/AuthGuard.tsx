import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/login', '/signup', '/forget-password'];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to login if user becomes unauthenticated while on protected route
    useEffect(() => {
        if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }, [isAuthenticated, isLoading, location.pathname, navigate, location]);

    // Show loading while auth state is being determined
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Allow access to public routes regardless of auth state
    if (PUBLIC_ROUTES.includes(location.pathname)) {
        // If user is already authenticated and tries to access login/signup, redirect to layout
        if (isAuthenticated && location.pathname !== '/forget-password') {
            return <Navigate to="/layout/workitems" replace />;
        }
        return <>{children}</>;
    }

    // For protected routes, require authentication
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default AuthGuard;
