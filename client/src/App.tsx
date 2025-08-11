import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { useAuth } from "@/hooks/useAuth.ts";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import UserProfile from "@/components/UserProfile";
import LogoExport from "@/pages/logo-export";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import ClubsHub from "@/components/ClubsHub";
import AccuracyTestSuite from "@/components/AccuracyTestSuite";

const IntegratedAnalysisTest = lazy(() => import("@/components/IntegratedAnalysisTest"));
import OAuthLoadingPage from "@/components/OAuthLoadingPage";
import OAuthCallbackPage from "@/components/OAuthCallbackPage";
import InteractiveCommunicationStats from "@/components/InteractiveCommunicationStats";
import ContentAnalysisPage from "@/pages/content-analysis";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Global error handler for WASM and MediaPipe errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Suppress common WASM/MediaPipe errors that don't affect functionality
      if (event.error && (
        event.error.message?.includes('wasm') || 
        event.error.message?.includes('Module.arguments') ||
        event.error.message?.includes('MIME type') ||
        event.error.message?.includes('Aborted') ||
        event.error.message?.includes('streaming compile failed') ||
        event.error.message?.includes('ArrayBuffer instantiation') ||
        event.error.message?.includes('asynchronously prepare wasm') ||
        event.message?.includes('Script error.')
      )) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && (
        event.reason.message?.includes('wasm') ||
        event.reason.message?.includes('Module.arguments') ||
        event.reason.message?.includes('MIME type') ||
        event.reason.message?.includes('Aborted') ||
        event.reason.message?.includes('streaming compile failed') ||
        event.reason.message?.includes('ArrayBuffer instantiation') ||
        event.reason.message?.includes('asynchronously prepare wasm') ||
        typeof event.reason === 'string' && event.reason.includes('wasm')
      )) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Handle redirect from old routes
  useEffect(() => {
    if (location === '/competitions') {
      setLocation('/clubs');
    }
  }, [location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/oauth-loading" component={OAuthLoadingPage} />
        <Route path="/oauth2callback" component={OAuthCallbackPage} />
        <Route component={Home} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/landing" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/profile/:section" component={UserProfile} />
      <Route path="/clubs" component={ClubsHub} />
      <Route path="/logo" component={LogoExport} />
      <Route path="/test" component={AccuracyTestSuite} />
      <Route path="/integrated-test" component={IntegratedAnalysisTest} />
      <Route path="/stats" component={InteractiveCommunicationStats} />
      <Route path="/content-analysis" component={ContentAnalysisPage} />
      <Route path="/oauth-loading" component={OAuthLoadingPage} />
      <Route path="/oauth2callback" component={OAuthCallbackPage} />
      <Route path="*" component={Dashboard} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
