import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signUp: (username: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users_new')
        .select('id, username, name')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { error: 'Invalid username or password' };
      }

      const userData = { id: data.id, username: data.username, name: data.name };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { error: null };
    } catch (error) {
      return { error: 'Authentication failed' };
    }
  };

  const signUp = async (username: string, password: string, name?: string) => {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users_new')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return { error: 'Username already exists' };
      }

      // Create new user
      const { data, error } = await supabase
        .from('users_new')
        .insert([{ username, password, name }])
        .select('id, username, name')
        .single();

      if (error || !data) {
        return { error: 'Failed to create account' };
      }

      const userData = { id: data.id, username: data.username, name: data.name };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { error: null };
    } catch (error) {
      return { error: 'Registration failed' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCustomAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCustomAuth must be used within an AuthProvider');
  }
  return context;
}