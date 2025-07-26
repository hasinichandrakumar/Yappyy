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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 border-blue-100 shadow-2xl">
        <CardContent className="p-12 text-center space-y-8">
          {/* Large Yappyy Logo */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl">
              <img 
                src={yappyyLogo} 
                alt="Yappyy - AI Speech Training" 
                className="h-16 w-auto filter brightness-0 invert animate-pulse"
              />
            </div>
          </div>
          
          {/* Connecting Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-900 font-poppins">
              Connecting to Google
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Redirecting you to Google's secure sign-in...
            </p>
          </div>
          
          {/* Loading Animation */}
          <div className="flex justify-center items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-blue-600 font-semibold">Authenticating</span>
          </div>
          
          {/* Yappyy Branding Footer */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Powered by <span className="font-bold text-blue-600">Yappyy</span> AI Speech Training
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}