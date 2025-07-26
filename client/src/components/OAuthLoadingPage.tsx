import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import yappyyLogo from '@assets/Y-2-removebg-preview_1753384287580.png';

export default function OAuthLoadingPage() {
  useEffect(() => {
    // Auto-redirect to Google OAuth after showing Yappyy branding
    const timer = setTimeout(() => {
      window.location.href = '/api/auth/google';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center p-4 animate-gradient-x">
      {/* Full Screen Yappyy Branding */}
      <div className="text-center space-y-12 max-w-md">
        {/* Massive Yappyy Logo */}
        <div className="flex justify-center">
          <div className="bg-white p-16 rounded-full shadow-2xl animate-pulse border-8 border-white/30">
            <img 
              src={yappyyLogo} 
              alt="Yappyy - AI Speech Training" 
              className="h-40 w-auto"
            />
          </div>
        </div>
        
        {/* Welcome Message */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-extrabold text-white font-poppins drop-shadow-2xl">
              Welcome to
            </h1>
            <h2 className="text-9xl font-black text-white font-poppins drop-shadow-2xl tracking-wider transform scale-110">
              YAPPYY
            </h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <p className="text-3xl text-white font-bold drop-shadow-lg">
              🚀 Connecting to Google
            </p>
            <p className="text-xl text-white/90 font-medium mt-2">
              AI-Powered Speech Training
            </p>
          </div>
        </div>
        
        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="text-white text-xl font-semibold">Authenticating</span>
        </div>
      </div>
    </div>
  );
}