import { useEffect, useState } from 'react';
import { User } from '../types';

const TOKEN_KEY = 'auth_user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // no async load on mount

  useEffect(() => {
    const storedUser = localStorage.getItem(TOKEN_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    setUser(data.user); // or data.username
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data.user)); // ✅ persist
  };

  const signUp = async (username: string, password: string) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    setUser(data.user); // assuming backend doesn’t return user
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data.user)); // ✅ persist
  };

  const signOut = () => {
    setUser(null); // optionally clear anything else
    localStorage.removeItem(TOKEN_KEY);
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}