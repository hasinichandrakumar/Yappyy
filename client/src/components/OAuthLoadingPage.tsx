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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 animate-gradient-x flex items-center justify-center p-6">
      {/* Floating Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-12 h-12 bg-white/10 rounded-full opacity-30 animate-blob"></div>
        <div className="absolute top-32 right-16 w-8 h-8 bg-white/10 rounded-full opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-48 left-1/4 w-6 h-6 bg-white/10 rounded-full opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-32 right-20 w-10 h-10 bg-white/10 rounded-full opacity-35 animate-blob"></div>
        <div className="absolute bottom-48 left-20 w-4 h-4 bg-white/10 rounded-full opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-14 h-14 bg-white/10 rounded-full opacity-25 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 left-1/3 w-7 h-7 bg-white/10 rounded-full opacity-45 animate-blob"></div>
      </div>
      
      <Card className="w-full max-w-lg border-0 shadow-2xl backdrop-blur-sm bg-white/95">
        <CardContent className="p-12 text-center space-y-8">
          {/* Enhanced Yappyy Logo with Gradient Animation */}
          <div className="flex justify-center pt-4">
            <div className="relative mx-8">
              <div className="bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500 p-6 rounded-3xl shadow-2xl">
                <img 
                  src={yappyyLogo} 
                  alt="Yappyy - AI Speech Training" 
                  className="h-16 w-auto filter brightness-0 invert"
                />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-3xl opacity-40"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 rounded-3xl opacity-30"></div>
            </div>
          </div>
          
          {/* Enhanced Connecting Message with Yappy Gradient */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold yappyy-gradient font-display">
              Welcome to Yappyy
            </h1>
            <h2 className="text-2xl font-bold text-gray-800 font-semibold">
              Connecting to Google
            </h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Redirecting you to Google's secure authentication...
            </p>
          </div>
          
          {/* Enhanced Loading Animation with Yappy Colors */}
          <div className="flex justify-center items-center space-x-4 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 bg-clip-text text-transparent">
              Authenticating with Google
            </span>
          </div>
          
          {/* Enhanced Progress Bar with Yappy Gradient */}
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 h-3 rounded-full shadow-lg" 
              style={{ width: '75%' }}
            ></div>
          </div>
          
          {/* Enhanced Yappyy Branding Footer */}
          <div className="pt-6 border-t border-gray-200/50">
            <p className="text-lg text-gray-700 font-medium">
              Powered by <span className="yappyy-gradient font-extrabold">Yappyy</span>
            </p>
            <p className="text-sm text-gray-500 mt-2 font-body">
              AI-Powered Speech Training Platform
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}