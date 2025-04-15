import { useEffect, useState } from 'react';
import { User } from '../types';
import { mockAuth } from '../lib/mockDb';

const TOKEN_KEY = 'auth_token';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      mockAuth.getSession(token).then((session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user, token } = await mockAuth.signIn(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const signUp = async (email: string, password: string) => {
    const { user, token } = await mockAuth.signUp(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const signOut = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await mockAuth.signOut(token);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}