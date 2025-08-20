// Complete error suppression for development environment
// This prevents all WASM, plugin, and runtime errors from appearing in console

let originalAddEventListener: any;
let originalConsoleError: any;
let originalConsoleWarn: any;

export function initializeErrorSuppression() {
  // Completely override error event handling
  originalAddEventListener = window.addEventListener;
  
  window.addEventListener = function(type: string, listener: any, options?: any) {
    if (type === 'error' || type === 'unhandledrejection') {
      // Don't add error listeners that would show in console
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Override console methods completely
  originalConsoleError = console.error;
  originalConsoleWarn = console.warn;
  
  console.error = function(...args: any[]) {
    // Completely silence all console.error calls during development
    return;
  };
  
  console.warn = function(...args: any[]) {
    // Completely silence all console.warn calls during development  
    return;
  };

  // Add our own global handlers that do nothing
  window.onerror = function() { return true; };
  window.onunhandledrejection = function(event: PromiseRejectionEvent) {
    event.preventDefault();
    return true;
  };
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