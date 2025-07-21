// Open access - no authentication required, but add logout capability
import { useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function useAuth() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  // Check if user explicitly logged out
  const loggedOut = typeof window !== 'undefined' && 
    (window.sessionStorage.getItem('loggedOut') === 'true' || isLoggedOut);
  
  const logout = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('loggedOut', 'true');
      setIsLoggedOut(true);
      window.location.href = '/';
    }
  };

  const login = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('loggedOut');
      setIsLoggedOut(false);
    }
  };

  return {
    user: loggedOut ? null : { 
      id: 'guest', 
      email: 'guest@yappyy.com', 
      firstName: 'Guest', 
      lastName: 'User' 
    } as User,
    isLoading: false,
    isAuthenticated: !loggedOut,
    logout,
    login,
    error: null
  };
}