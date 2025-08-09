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
      
      <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center space-y-6 pb-6 pt-8">
          <div className="flex justify-center px-6">
            <button 
              onClick={() => window.location.href = '/'} 
              className="hover:opacity-80 transition-all duration-300 hover:scale-105"
            >
              <YappyyAILogo width={100} height={100} />
            </button>
          </div>
          <div className="space-y-4">
            <CardTitle className="text-3xl font-bold yappyy-gradient font-display">
              Welcome to Yappyy
            </CardTitle>
            <p className="text-gray-600 text-lg font-body leading-relaxed">
              AI-powered public speaking improvement platform
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-0">
          <div className="space-y-4">
            <Button
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-700 hover:via-cyan-600 hover:to-sky-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
              onClick={handleLogin}
            >
              <LogIn className="w-6 h-6 mr-3" />
              Sign in with Google
            </Button>
          </div>

          <div className="space-y-5 text-sm text-gray-600">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/80 border border-blue-100">
              <User className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              <span className="font-medium">Create your personalized speaking profile</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/80 border border-blue-100">
              <Shield className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              <span className="font-medium">Your data is secure and private</span>
            </div>
          </div>
          
          <div className="text-center pt-4 border-t border-gray-200/50">
            <p className="text-xs text-gray-500 font-body">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}