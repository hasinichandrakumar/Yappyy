import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import yappyyLogo from '@assets/Y-2-removebg-preview_1753384287580.png';

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your authentication...');

  useEffect(() => {
    // Check URL parameters for OAuth callback status
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const code = urlParams.get('code');

    if (error) {
      setStatus('error');
      setMessage('Authentication failed. Please try again.');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } else if (code) {
      setStatus('success');
      setMessage('Authentication successful! Redirecting to dashboard...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } else {
      // Still processing
      setTimeout(() => {
        setStatus('success');
        setMessage('Authentication successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }, 2000);
    }
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-0 shadow-2xl backdrop-blur-sm bg-white/95">
        <CardContent className="p-12 text-center space-y-8">
          {/* Large Yappyy Logo with Success Animation */}
          <div className="flex justify-center pt-4">
            <div className="relative mx-8">
              <div className={`bg-gradient-to-br ${status === 'success' ? 'from-green-500 to-blue-600' : status === 'error' ? 'from-red-500 to-orange-600' : 'from-blue-500 to-purple-600'} p-6 rounded-3xl shadow-2xl ${status === 'processing' ? 'animate-pulse' : 'animate-bounce'}`}>
                <img 
                  src={yappyyLogo} 
                  alt="Yappyy - AI Speech Training" 
                  className="h-16 w-auto filter brightness-0 invert"
                />
              </div>
              {status === 'success' && (
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-3xl opacity-30 animate-ping"></div>
              )}
            </div>
          </div>
          
          {/* Status Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-poppins">
              Yappyy
            </h1>
            <h2 className="text-2xl font-bold text-gray-800">
              {status === 'processing' && 'Processing Authentication'}
              {status === 'success' && 'Welcome Back!'}
              {status === 'error' && 'Authentication Error'}
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              {message}
            </p>
          </div>
          
          {/* Status Icon and Animation */}
          <div className="flex justify-center items-center space-x-4">
            {getStatusIcon()}
            <span className={`text-xl font-bold ${getStatusColor()}`}>
              {status === 'processing' && 'Authenticating...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Failed'}
            </span>
          </div>
          
          {/* Progress Bar */}
          {status === 'processing' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '90%' }}></div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>
          )}
          
          {/* Yappyy Branding Footer */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-lg text-gray-600">
              Welcome to <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Yappyy</span>
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