import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { User } from '../services/authService';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  redirectPath: string;
  setRedirectPath: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string>('/dashboard');

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if user is authenticated first
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid token
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Handle login
  const login = useCallback(async (username: string, password: string) => {
    try {
      const { user, token } = await authService.login(username, password);
      setUser(user);
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      localStorage.removeItem('token');
      throw error; // Re-throw to be handled by the component
    }
  }, []);

  // Handle logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setRedirectPath('/login');
  }, []);

  // Handle token expiration
  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        logout();
      }
    };

    // Check auth status every minute
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [logout]);

  // Derive isAuthenticated from both the token and user state
  const isAuthenticated = authService.isAuthenticated() && user !== null;
  
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
    redirectPath,
    setRedirectPath,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
