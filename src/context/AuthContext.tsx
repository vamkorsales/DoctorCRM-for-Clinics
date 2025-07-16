import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple login: only use supabase.auth.signInWithPassword
  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message || 'Login failed. Please try again.');
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          firstName: '',
          lastName: '',
          role: 'admin',
          permissions: [],
        });
        setIsAuthenticated(true);
        setError(null);
        return true;
      }
      setError('Login failed. Please try again.');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  // Restore session on mount
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user && mounted) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          firstName: '',
          lastName: '',
          role: 'admin',
          permissions: [],
        });
        setIsAuthenticated(true);
        setError(null);
      }
    });
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          firstName: '',
          lastName: '',
          role: 'admin',
          permissions: [],
        });
        setIsAuthenticated(true);
        setError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasPermission,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};