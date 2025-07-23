import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  authType: string;
  isAuthenticated: boolean;
  profileImageUrl?: string;
}

export function useAuth() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  // Fetch real user data from API
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['/api/user/info'],
    enabled: typeof window !== 'undefined' && !isLoggedOut && window.sessionStorage.getItem('loggedOut') !== 'true'
  });
  
  // Check if user explicitly logged out
  const loggedOut = typeof window !== 'undefined' && 
    (window.sessionStorage.getItem('loggedOut') === 'true' || isLoggedOut);
  
  const logout = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('loggedOut', 'true');
      setIsLoggedOut(true);
      // Call logout endpoint
      fetch('/api/auth/logout', { method: 'GET' }).then(() => {
        window.location.href = '/';
      });
    }
  };

  const login = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('loggedOut');
      setIsLoggedOut(false);
    }
  };

  const user = loggedOut ? null : userData as User;
  const isAuthenticated = !loggedOut && (userData as any)?.isAuthenticated === true;

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    login,
    error
  };
}