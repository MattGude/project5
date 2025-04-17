import { useEffect, useState } from 'react';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // no async load on mount

  const signIn = async (username: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    setUser(data.user); // or data.username
  };

  const signUp = async (username: string, password: string) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    setUser({ username }); // assuming backend doesn’t return user
  };

  const signOut = () => {
    setUser(null); // optionally clear anything else
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}