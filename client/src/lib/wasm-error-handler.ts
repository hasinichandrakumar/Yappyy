// WASM Error Handler - Completely disable problematic WASM components
export class WasmErrorHandler {
  private static initialized = false;
  
  public static initialize() {
    if (this.initialized) return;
    
    console.log('Disabling all WASM components to prevent console errors');
    
    // Completely disable WebAssembly
    if (typeof window !== 'undefined') {
      try {
        // Override WebAssembly entirely
        (window as any).WebAssembly = {
          instantiateStreaming: async () => {
            throw new Error('WebAssembly disabled');
          },
          instantiate: async () => {
            throw new Error('WebAssembly disabled');
          },
          compile: async () => {
            throw new Error('WebAssembly disabled');
          },
          compileStreaming: async () => {
            throw new Error('WebAssembly disabled');
          }
        };
        
        // Override fetch for WASM files
        const originalFetch = window.fetch;
        window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
          const url = typeof input === 'string' ? input : input.toString();
          
          // Block WASM file requests
          if (url.includes('.wasm') || url.includes('wasm')) {
            throw new Error('WASM file requests blocked');
          }
          
          return originalFetch(input, init);
        };
        
        // Disable TensorFlow.js completely
        (window as any).tf = undefined;
        
        // Disable MediaPipe Module
        (window as any).Module = undefined;
        
        // Override dynamic imports for problematic modules
        const originalImport = (window as any).import || ((path: string) => import(path));
        (window as any).import = async function(path: string) {
          if (path.includes('mediapipe') || 
              path.includes('tensorflow') || 
              path.includes('face-api') ||
              path.includes('@tensorflow') ||
              path.includes('@mediapipe')) {
            throw new Error(`Import of ${path} blocked to prevent WASM errors`);
          }
          return originalImport(path);
        };
        
      } catch (error) {
        console.warn('Failed to disable WebAssembly completely:', error);
      }
    }
    
    this.initialized = true;
  }
  
  public static disableMediaPipeWasm() {
    // Additional MediaPipe disabling
    if (typeof window !== 'undefined') {
      (window as any).MediaPipe = undefined;
      (window as any).cv = undefined; // OpenCV
      
      // Override constructor functions
      try {
        (window as any).FaceMesh = function() { 
          throw new Error('FaceMesh disabled'); 
        };
        (window as any).Pose = function() { 
          throw new Error('Pose disabled'); 
        };
        (window as any).Hands = function() { 
          throw new Error('Hands disabled'); 
        };
      } catch (error) {
        // Ignore constructor override errors
      }
    }
  }
}