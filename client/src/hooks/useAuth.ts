import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, signInWithGoogle, firebaseSignOut, handleRedirectResult, onAuthChange, User as FirebaseUser } from '@/lib/firebase';

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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    handleRedirectResult().catch(console.error);
    
    const unsubscribe = onAuthChange((user) => {
      setFirebaseUser(user);
      setFirebaseLoading(false);
      
      if (user) {
        fetch('/api/auth/firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        }).then(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        }).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth');
    
    if (authToken) {
      window.history.replaceState({}, document.title, window.location.pathname);
      
      fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authToken })
      }).then(response => {
        if (response.ok) {
          console.log('✅ Token authentication successful');
          window.location.reload();
        } else {
          console.error('Token authentication failed');
        }
      }).catch(error => {
        console.error('Token authentication error:', error);
      });
    }
  }, []);
  
  const { data: userData, isLoading: apiLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: typeof window !== 'undefined' && !isLoggedOut && window.sessionStorage.getItem('loggedOut') !== 'true'
  });
  
  const loggedOut = typeof window !== 'undefined' && 
    (window.sessionStorage.getItem('loggedOut') === 'true' || isLoggedOut);
  
  const logout = useCallback(async () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('loggedOut', 'true');
      setIsLoggedOut(true);
      
      try {
        await firebaseSignOut();
      } catch (e) {
        console.error('Firebase sign out error:', e);
      }
      
      fetch('/api/auth/logout', { method: 'GET' }).then(() => {
        window.location.href = '/';
      });
    }
  }, []);

  const login = useCallback(async () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('loggedOut');
      setIsLoggedOut(false);
      
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Firebase login error:', error);
      }
    }
  }, []);

  const user = loggedOut ? null : (firebaseUser ? {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    username: firebaseUser.email?.split('@')[0] || '',
    authType: 'firebase',
    isAuthenticated: true,
    profileImageUrl: firebaseUser.photoURL || undefined,
  } : userData as User);

  const isAuthenticated = !loggedOut && (!!firebaseUser || (userData as any)?.isAuthenticated === true);
  const isLoading = firebaseLoading || apiLoading;

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    login,
    error,
    firebaseUser,
  };
}