import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, User, Shield, Mic } from "lucide-react";
import yappyyMicIcon from "@assets/5-removebg-preview_1749674959175.png";
import yappyyLogo from "@assets/4-removebg-preview_1749674959175.png";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
              <img src={yappyyMicIcon} alt="Yappyy" className="w-12 h-12" />
            </div>
          </div>
          <div>
            <img 
              src={yappyyLogo} 
              alt="Yappyy" 
              className="h-8 w-auto mx-auto mb-2"
              style={{ 
                imageRendering: 'crisp-edges',
                maxWidth: '150px',
                objectFit: 'contain'
              }}
            />
            <CardTitle className="text-xl font-bold gradient-text font-display">
              Welcome
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
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2"
            size="lg"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-button">Continue with Google</span>
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}