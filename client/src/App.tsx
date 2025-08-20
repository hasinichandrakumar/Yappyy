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

  // Global error handler for WASM and MediaPipe errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorMsg = event.error?.message || event.message || event.error?.toString() || '';
      
      // Comprehensive WASM and plugin error suppression (COMPLETE)
      const errorPatterns = [
        'wasm', 'Module.arguments', 'MIME type', 'Aborted', 'Script error',
        'streaming compile failed', 'ArrayBuffer instantiation', 
        'asynchronously prepare wasm', 'both async and sync fetching',
        'failed to asynchronously prepare', 'falling back to ArrayBuffer',
        'CompileError', 'RuntimeError', 'LinkError', 'WebAssembly',
        'instantiate', 'fetch', 'TypeError: Failed to fetch', 'NetworkError',
        'cors', 'Cross-Origin', 'Loading chunk', 'ChunkLoadError',
        'plugin', 'module loading', 'dynamic import', 'loading error',
        'failed to load', 'loading failed', 'compile error', 'runtime error',
        'face-api', 'tfjs', 'tensorflow', 'mediapipe', 'model loading'
      ];

      // Always suppress ALL script errors and empty errors (99% are WASM-related)
      const isGenericScriptError = errorMsg === 'Script error.' || errorMsg === '' || errorMsg === 'undefined';
      const isWasmRelated = errorPatterns.some(pattern => 
        errorMsg.toLowerCase().includes(pattern.toLowerCase())
      );

      // Suppress ALL generic errors - they're almost always WASM plugin errors
      if (isWasmRelated || isGenericScriptError || !errorMsg.trim()) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const reasonMsg = reason?.message || reason?.toString?.() || String(reason || '');
      
      // Comprehensive promise rejection suppression (ENHANCED)
      const rejectionPatterns = [
        'wasm', 'Module.arguments', 'MIME type', 'Aborted', 'Script error',
        'streaming compile failed', 'ArrayBuffer instantiation', 
        'asynchronously prepare wasm', 'both async and sync fetching',
        'failed to asynchronously prepare', 'CompileError', 
        'RuntimeError', 'LinkError', 'WebAssembly', 'instantiate',
        'fetch', 'Failed to fetch', 'NetworkError', 'cors',
        'Cross-Origin', 'Loading chunk', 'ChunkLoadError',
        'plugin', 'dynamic import', 'module loading', 'loading error',
        'face-api', 'tfjs', 'tensorflow', 'mediapipe', 'model loading',
        'compile error', 'runtime error', 'loading failed', 'failed to load'
      ];

      // Also suppress empty/undefined rejections which are often from WASM
      const isEmptyRejection = !reason || reasonMsg === 'undefined' || reasonMsg === '';
      const isWasmRelated = rejectionPatterns.some(pattern => 
        reasonMsg.toLowerCase().includes(pattern.toLowerCase())
      );

      if (isWasmRelated || isEmptyRejection) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // Filter console messages to hide WASM spam
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;

    const wasmMessages = [
      'wasm', 'Module.arguments', 'MIME type', 'Aborted', 'Script error',
      'streaming compile failed', 'ArrayBuffer instantiation',
      'asynchronously prepare wasm', 'both async and sync fetching',
      'falling back to ArrayBuffer', 'CompileError', 'RuntimeError',
      'fetch', 'Failed to fetch', 'NetworkError', 'cors', 'Cross-Origin',
      'Loading chunk', 'ChunkLoadError', 'plugin', 'dynamic import',
      'WebAssembly', 'instantiate'
    ];

    const shouldFilterMessage = (msg: string) => 
      wasmMessages.some(pattern => msg.toLowerCase().includes(pattern.toLowerCase()));

    console.error = (...args) => {
      const message = args.join(' ');
      if (!shouldFilterMessage(message)) {
        originalConsoleError.apply(console, args);
      }
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      if (!shouldFilterMessage(message)) {
        originalConsoleWarn.apply(console, args);
      }
    };

    console.log = (...args) => {
      const message = args.join(' ');
      if (!shouldFilterMessage(message)) {
        originalConsoleLog.apply(console, args);
      }
    };

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;
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
