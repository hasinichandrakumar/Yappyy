import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import yappyyLogo from '@assets/Y-2-removebg-preview_1753384287580.png';

export default function OAuthLoadingPage() {
  useEffect(() => {
    // Auto-redirect to Google OAuth after showing Yappyy branding
    const timer = setTimeout(() => {
      window.location.href = '/api/auth/google';
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 border-blue-100 shadow-2xl">
        <CardContent className="p-12 text-center space-y-8">
          {/* Extra Large Yappyy Logo with Enhanced Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-3xl shadow-2xl animate-pulse">
                <img 
                  src={yappyyLogo} 
                  alt="Yappyy - AI Speech Training" 
                  className="h-20 w-auto filter brightness-0 invert"
                />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl opacity-30 animate-ping"></div>
            </div>
          </div>
          
          {/* Enhanced Connecting Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 font-poppins">
              Welcome to Yappyy
            </h1>
            <h2 className="text-2xl font-bold text-gray-800">
              Connecting to Google
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Redirecting you to Google's secure authentication...
            </p>
          </div>
          
          {/* Enhanced Loading Animation */}
          <div className="flex justify-center items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-xl text-blue-600 font-bold">Authenticating with Google</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
          
          {/* Enhanced Yappyy Branding Footer */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-lg text-gray-600">
              Powered by <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Yappyy</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              AI-Powered Speech Training Platform
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}