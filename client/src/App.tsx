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
// OAuth loading page removed - starting fresh
// OAuth components removed - starting fresh
import InteractiveCommunicationStats from "@/components/InteractiveCommunicationStats";
import ContentAnalysisPage from "@/pages/content-analysis";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Complete error suppression for clean development experience
  useEffect(() => {
    // Initialize WASM error handling first
    import('@/lib/wasm-error-handler').then(({ WasmErrorHandler }) => {
      WasmErrorHandler.initialize();
      WasmErrorHandler.disableMediaPipeWasm();
    }).catch(() => {
      console.log('WASM handler initialization skipped');
    });
    
    // Disable WASM modules
    import('@/utils/disable-wasm-modules').then(({ disableWasmModules }) => {
      disableWasmModules();
    }).catch(() => {
      console.log('WASM module disabling skipped');
    });
    
    // Then initialize general error suppression
    import('@/utils/error-suppression').then(({ initializeErrorSuppression, restoreErrorHandling }) => {
      initializeErrorSuppression();
      
      return () => {
        restoreErrorHandling();
      };
    }).catch(() => {
      console.log('Error suppression initialization skipped');
    });
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
        {/* OAuth loading route removed - starting fresh */}
        {/* OAuth callback route removed - starting fresh */}
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
      {/* OAuth loading route removed - starting fresh */}
      {/* OAuth callback route removed - starting fresh */}
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
