// Selective error filtering for development environment
// Filter specific known harmless errors while preserving genuine debugging info

let originalConsoleError: any;
let originalConsoleWarn: any;

const harmlessErrorPatterns = [
  /ResizeObserver loop limit exceeded/,
  /Non-passive event listener/,
  /Favicon could not be loaded/,
  /manifest\.json/,
  /The resource.*was preloaded using link preload but not used/,
  /WASM streaming compile failed/,
  /WebAssembly.instantiateStreaming/,
];

const harmlessWarningPatterns = [
  /componentWillReceiveProps has been renamed/,
  /componentWillMount has been renamed/,
  /React does not recognize the .* prop on a DOM element/,
  /Failed to parse source map/,
  /DevTools failed to load source map/,
];

function shouldFilterError(args: any[]): boolean {
  const message = args.join(' ');
  return harmlessErrorPatterns.some(pattern => pattern.test(message));
}

function shouldFilterWarning(args: any[]): boolean {
  const message = args.join(' ');
  return harmlessWarningPatterns.some(pattern => pattern.test(message));
}

export function initializeErrorSuppression() {
  // Override console methods with filtering
  originalConsoleError = console.error;
  originalConsoleWarn = console.warn;
  
  console.error = function(...args: any[]) {
    if (!shouldFilterError(args)) {
      originalConsoleError.apply(console, args);
    }
  };
  
  console.warn = function(...args: any[]) {
    if (!shouldFilterWarning(args)) {
      originalConsoleWarn.apply(console, args);
    }
  };

  // Handle unhandled rejections with filtering
  window.addEventListener('unhandledrejection', function(event: PromiseRejectionEvent) {
    const reason = event.reason?.message || event.reason || '';
    const shouldFilter = harmlessErrorPatterns.some(pattern => pattern.test(String(reason)));
    
    if (shouldFilter) {
      event.preventDefault();
    }
  });
}

export function restoreErrorHandling() {
  if (originalAddEventListener) {
    window.addEventListener = originalAddEventListener;
  }
  if (originalConsoleError) {
    console.error = originalConsoleError;
  }
  if (originalConsoleWarn) {
    console.warn = originalConsoleWarn;
  }
}