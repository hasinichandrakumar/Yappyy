import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, User, Shield } from "lucide-react";
import yapUpLogoImage from "@assets/YapUp-2_1749483329460.png";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={yapUpLogoImage} 
              alt="YapUp Logo" 
              className="w-20 h-20 rounded-xl shadow-lg"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Welcome to YapUp
            </CardTitle>
            <p className="text-gray-600 mt-2">
              AI-powered public speaking improvement platform
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Personalized Coaching</p>
                <p className="text-xs text-gray-600">AI analysis tailored to your speaking style</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Secure & Private</p>
                <p className="text-xs text-gray-600">Your practice sessions stay confidential</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2"
            size="lg"
          >
            <LogIn className="w-5 h-5" />
            <span>Start Demo Session</span>
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}