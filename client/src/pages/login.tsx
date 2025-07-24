import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import MagicLinkLogin from '@/components/MagicLinkLogin';
import yappyyLogoPath from '@assets/Y-removebg-preview_1753380214189.png';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
              <div className="hidden sm:block ml-3">
                {/* Header text removed per user request */}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">
              Sign in to continue your speaking improvement journey
            </p>
          </div>
          
          <MagicLinkLogin />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              New to Yappyy? Signing in will create your account automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}