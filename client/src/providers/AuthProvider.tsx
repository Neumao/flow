import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType, User } from '../hooks/useAuth';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../lib/constants';

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const userData = localStorage.getItem(USER_STORAGE_KEY);

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch {
          // Clear invalid data
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();

    // Listen for auth error events from GraphQL client
    const handleAuthError = () => {
      setUser(null);
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);  // Login is now handled by GraphQL mutation in components  
  const login = async (): Promise<void> => {
    throw new Error('Use GraphQL login mutation in components');
  };

  const register = async (): Promise<void> => {
    // Register is now handled by GraphQL mutation in components
    throw new Error('Use GraphQL register mutation in components');
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  // Method to set user from external login (like GraphQL mutation)
  const setUserFromToken = (userData: User, token: string): void => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    setUserFromToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
