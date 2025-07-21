import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MagicLinkLoginProps {
  onSuccess?: () => void;
}

export default function MagicLinkLogin({ onSuccess }: MagicLinkLoginProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState('');
  const [developmentUrl, setDevelopmentUrl] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/request-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send magic link');
      }

      setLinkSent(true);
      if (data.developmentUrl) {
        setDevelopmentUrl(data.developmentUrl);
      }

      toast({
        title: "Magic Link Sent!",
        description: "Check your email for the login link",
        duration: 5000,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevelopmentLogin = () => {
    if (developmentUrl) {
      window.location.href = developmentUrl;
    }
  };

  if (linkSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a magic link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Click the link in your email to sign in. The link expires in 15 minutes.
            </AlertDescription>
          </Alert>

          {/* Development mode: show direct login button */}
          {developmentUrl && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <p className="text-sm font-medium">Development Mode</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDevelopmentLogin}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Quick Login (Dev)
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => {
                setLinkSent(false);
                setEmail('');
                setDevelopmentUrl('');
              }}
              className="text-sm"
            >
              Use a different email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>
          Enter your email to receive a secure login link
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="text-center"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Magic Link...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Magic Link
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>No password required. We'll send you a secure link to sign in.</p>
        </div>
      </CardContent>
    </Card>
  );
}