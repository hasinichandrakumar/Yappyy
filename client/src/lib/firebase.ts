import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, signOut, onAuthStateChanged, User, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let isInitialized = false;

function initializeFirebase() {
  if (isInitialized) return;
  
  try {
    if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      isInitialized = true;
      console.log('✅ Firebase initialized successfully');
    } else {
      console.warn('⚠️ Firebase config incomplete, skipping initialization');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
}

initializeFirebase();

export { auth };

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !googleProvider) {
    console.error('Firebase not initialized');
    return null;
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    console.error('Firebase auth error:', error);
    throw error;
  }
}

export async function handleRedirectResult(): Promise<User | null> {
  if (!auth) return null;
  
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error('Redirect result error:', error);
    return null;
  }
}

export async function firebaseSignOut(): Promise<void> {
  if (!auth) return;
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!auth) {
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function isFirebaseReady(): boolean {
  return isInitialized;
}

export type { User };
