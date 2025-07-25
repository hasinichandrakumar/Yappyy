import { useEffect } from 'react';
import yappyyLogo from '@assets/Y-2-removebg-preview_1753384287580.png';

export default function GoogleOAuthLoadingPage() {
  useEffect(() => {
    // Redirect to Google OAuth after showing the logo for 2 seconds
    const timer = setTimeout(() => {
      window.location.href = '/api/auth/google/redirect';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        {/* Large Yappyy Logo */}
        <div className="flex justify-center">
          <img 
            src={yappyyLogo} 
            alt="Yappyy" 
            className="h-32 w-auto animate-pulse"
          />
        </div>
        
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-800">
            Connecting to Google
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Taking you to Google Sign-In to set up your personalized AI speech coaching experience with Yappyy.
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Preparing authentication</span>
            <span>Redirecting to Google</span>
          </div>
        </div>
        
        {/* Yappyy Branding */}
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-3">
              <img 
                src={yappyyLogo} 
                alt="Yappyy" 
                className="h-8 w-auto"
              />
              <div className="text-center">
                <p className="text-sm text-blue-800 font-bold">
                  Powered by Yappyy
                </p>
                <p className="text-xs text-blue-600">
                  AI-powered speech improvement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}