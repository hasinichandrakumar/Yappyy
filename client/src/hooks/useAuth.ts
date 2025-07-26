import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  authType: string;
  isAuthenticated: boolean;
  isNewUser?: boolean;
  welcomeMessageShown?: boolean;
  profileImageUrl?: string;
}

export function useAuth() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  // Handle OAuth token authentication on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth');
    
    if (authToken) {
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Authenticate with token
      fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authToken })
      }).then(response => {
        if (response.ok) {
          console.log('✅ Token authentication successful');
          window.location.reload(); // Reload to get user data
        } else {
          console.error('Token authentication failed');
        }
      }).catch(error => {
        console.error('Token authentication error:', error);
      });
    }
  }, []);
  
  // Fetch real user data from API - works for both authenticated and guest users
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: typeof window !== 'undefined' && !isLoggedOut && window.sessionStorage.getItem('loggedOut') !== 'true'
  });
  
  // Check if user explicitly logged out
  const loggedOut = typeof window !== 'undefined' && 
    (window.sessionStorage.getItem('loggedOut') === 'true' || isLoggedOut);
  
  const logout = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('loggedOut', 'true');
      setIsLoggedOut(true);
      // Call Google OAuth logout endpoint
      fetch('/api/auth/logout', { method: 'GET' }).then(() => {
        window.location.href = '/';
      });
    }
  };

  const login = () => {
    // Redirect to Google OAuth login
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('loggedOut');
      window.location.href = '/api/auth/google';
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