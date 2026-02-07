import { useContext } from 'react';
import { createContext } from 'react';

// User interface
export interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
}

// Auth context type
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<void>;
    setUserFromToken: (userData: User, token: string) => void;
}

// Auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// HOC for protected routes
export interface WithAuthProps {
    isAuthenticated: boolean;
    user: User | null;
}

export const withAuth = <P extends Record<string, unknown>>(
    Component: React.ComponentType<P & WithAuthProps>
): React.FC<P> => {
    return (props: P) => {
        const { isAuthenticated, user } = useAuth();
        return <Component {...props} isAuthenticated={isAuthenticated} user={user} />;
    };
};