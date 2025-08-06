import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, User, Shield } from "lucide-react";
import YappyyAILogo from "./YappyyAILogo";

export default function LoginPage() {
  const handleLogin = () => {
    // Redirect to loading page first to show Yappyy branding
    window.location.href = '/oauth-loading';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 flex items-center justify-center">
              <YappyyAILogo width={80} height={80} />
            </div>
          </div>
          <div>
            <button onClick={() => window.location.href = '/'} className="hover:opacity-80 transition-opacity mb-2">
              <YappyyAILogo width={120} height={120} />
            </button>
            <CardTitle className="text-xl font-bold gradient-text font-display">
              Welcome
            </CardTitle>
            <p className="text-gray-600 mt-2 font-body">
              AI-powered public speaking improvement platform
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              size="lg"
              onClick={handleLogin}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign in with Google
            </Button>
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>Create your personalized speaking profile</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Your data is secure and private</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}