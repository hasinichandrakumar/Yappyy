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
          <div className="bg-white p-12 rounded-full shadow-2xl animate-bounce">
            <img 
              src={yappyyLogo} 
              alt="Yappyy - AI Speech Training" 
              className="h-32 w-auto"
            />
          </div>
        </div>
        
        {/* Welcome Message */}
        <div className="space-y-6">
          <h1 className="text-6xl font-extrabold text-white font-poppins drop-shadow-lg">
            Welcome to
          </h1>
          <h2 className="text-8xl font-black text-white font-poppins drop-shadow-xl tracking-wider">
            YAPPYY
          </h2>
          <p className="text-2xl text-white/90 font-medium drop-shadow-md">
            Connecting to Google Authentication...
          </p>
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