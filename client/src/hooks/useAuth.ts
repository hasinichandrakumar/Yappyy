import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // If there's an error (like database connection issues), treat as unauthenticated
  // but not loading so the homepage can show
  if (error) {
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error
    };
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error
  };
}