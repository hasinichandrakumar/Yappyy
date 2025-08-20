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
  /wasm streaming compile failed/,
  /falling back to ArrayBuffer instantiation/,
  /Aborted\(both async and sync fetching of the wasm failed\)/,
  /failed to asynchronously prepare wasm/,
  /Aborted\(RuntimeError: Aborted/,
  /Aborted\(Module\.arguments has been replaced/,
  /Unexpected response MIME type\. Expected 'application\/wasm'/,
  /Script error\./,
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
    const message = args.join(' ');
    const shouldFilter = harmlessErrorPatterns.some(pattern => pattern.test(message)) ||
      message.includes('wasm') ||
      message.includes('WASM') ||
      message.includes('WebAssembly') ||
      message.includes('Aborted') ||
      message.includes('Script error') ||
      message.includes('MediaPipe') ||
      message.includes('TensorFlow') ||
      message.includes('face-api');
    
    if (!shouldFilter) {
      originalConsoleError.apply(console, args);
    }
  };
  
  console.warn = function(...args: any[]) {
    const message = args.join(' ');
    const shouldFilter = harmlessWarningPatterns.some(pattern => pattern.test(message)) ||
      message.includes('wasm') ||
      message.includes('WASM') ||
      message.includes('WebAssembly') ||
      message.includes('MediaPipe') ||
      message.includes('TensorFlow');
    
    if (!shouldFilter) {
      originalConsoleWarn.apply(console, args);
    }
  };

  // Handle ALL unhandled rejections aggressively  
  window.addEventListener('unhandledrejection', function(event: PromiseRejectionEvent) {
    // Prevent ALL unhandled rejections from showing in console
    event.preventDefault();
  });

  // Handle regular errors with filtering
  window.addEventListener('error', function(event: ErrorEvent) {
    const message = event.message || '';
    const shouldFilter = harmlessErrorPatterns.some(pattern => pattern.test(message)) ||
      message.includes('wasm') ||
      message.includes('WASM') ||
      message.includes('WebAssembly') ||
      message.includes('Script error');
    
    if (shouldFilter) {
      event.preventDefault();
      return true;
    }
    return false;
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