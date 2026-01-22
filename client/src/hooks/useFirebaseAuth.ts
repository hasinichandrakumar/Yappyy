import { useState, useEffect, useCallback } from 'react';
import { auth, signInWithGoogle, firebaseSignOut, handleRedirectResult, onAuthChange, User } from '@/lib/firebase';

interface FirebaseAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useFirebaseAuth() {
  const [state, setState] = useState<FirebaseAuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    handleRedirectResult().catch(console.error);
    
    const unsubscribe = onAuthChange((user) => {
      setState({
        user,
        loading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to sign in',
      }));
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await firebaseSignOut();
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to sign out',
      }));
    }
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signIn,
    signOut,
    isAuthenticated: !!state.user,
  };
}
