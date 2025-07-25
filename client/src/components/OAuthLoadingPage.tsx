import { useEffect } from 'react';
import yappyyLogo from '@assets/Y-2-removebg-preview_1753384287580.png';

export default function OAuthLoadingPage() {
  useEffect(() => {
    // Check for OAuth callback params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      window.location.href = '/?error=oauth_failed';
      return;
    }
    
    if (code) {
      // OAuth success - redirect will be handled by backend
      console.log('OAuth code received, processing...');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        {/* Large Yappyy Logo */}
        <div className="flex justify-center">
          <img 
            src={yappyyLogo} 
            alt="Yappyy" 
            className="h-28 w-auto animate-pulse"
          />
        </div>
        
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-800">
            Signing you in...
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Connecting to your Google account to set up your personalized AI speech coaching experience.
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Authenticating</span>
            <span>Almost ready</span>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="max-w-sm mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-blue-800 font-medium">
                Secure OAuth authentication powered by Google
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}