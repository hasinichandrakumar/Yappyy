// Open access - no authentication required
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function useAuth() {
  // Always return authenticated for open dashboard access
  return {
    user: { 
      id: 'guest', 
      email: 'guest@yappyy.com', 
      firstName: 'Guest', 
      lastName: 'User' 
    } as User,
    isLoading: false,
    isAuthenticated: true,
    error: null
  };
}