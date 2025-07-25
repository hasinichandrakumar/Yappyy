import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, User, Shield, Mic } from "lucide-react";
import yappyyMicIcon from "@assets/image_1749675190198.png";
import yappyyLogo from "@assets/Y-2-removebg-preview_1753384287580.png";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <button onClick={() => window.location.href = '/'} className="hover:opacity-80 transition-opacity">
              <img src={yappyyLogo} alt="Yappyy" className="h-16 w-auto" />
            </button>
          </div>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
              <img src={yappyyMicIcon} alt="Yappyy" className="w-12 h-12" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold gradient-text font-display">
              Welcome to Yappyy
            </CardTitle>
            <p className="text-gray-600 mt-2 font-body">
              AI-powered public speaking improvement platform
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm font-heading">Personalized Coaching</p>
                <p className="text-xs text-gray-600 font-body">AI analysis tailored to your speaking style</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm font-heading">Secure & Private</p>
                <p className="text-xs text-gray-600 font-body">Your practice sessions stay confidential</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-3 py-6"
            size="lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-button text-lg">Continue with Google</span>
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}