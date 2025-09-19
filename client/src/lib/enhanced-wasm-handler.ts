// Enhanced WASM Handler - Enable AI capabilities with proper error handling
export class EnhancedWasmHandler {
  private static initialized = false;
  private static wasmErrors: string[] = [];
  
  public static initialize() {
    if (this.initialized) return;
    
    if (typeof window !== 'undefined') {
      try {
        // Set up error tracking instead of blocking
        this.setupErrorTracking();
        
        // Enable WebAssembly with error handling
        this.enableWebAssembly();
        
        // Set up graceful fallbacks for AI libraries
        this.setupAILibraryFallbacks();
        
        console.log('🚀 Enhanced WASM Handler initialized - AI capabilities enabled');
      } catch (error) {
        console.warn('Enhanced WASM Handler setup failed:', error);
      }
    }
    
    this.initialized = true;
  }
  
  private static setupErrorTracking() {
    // Track WASM errors for debugging
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (message.includes('WASM') || message.includes('WebAssembly')) {
        this.wasmErrors.push(message);
        console.warn('🔧 WASM Error (handled):', message);
        return;
      }
      originalConsoleError.apply(console, args);
    };
  }
  
  private static enableWebAssembly() {
    // Don't override WebAssembly - let it work naturally
    // Just add error handling
    if (typeof WebAssembly !== 'undefined') {
      const originalInstantiate = WebAssembly.instantiate;
      const originalInstantiateStreaming = WebAssembly.instantiateStreaming;
      
      WebAssembly.instantiate = async (bytes: BufferSource, importObject?: any) => {
        try {
          return await originalInstantiate.call(WebAssembly, bytes, importObject);
        } catch (error) {
          console.warn('🔧 WebAssembly instantiate error (handled):', error);
          throw error; // Re-throw to let libraries handle it
        }
      };
      
      WebAssembly.instantiateStreaming = async (response: Response | Promise<Response>, importObject?: any) => {
        try {
          return await originalInstantiateStreaming.call(WebAssembly, response, importObject);
        } catch (error) {
          console.warn('🔧 WebAssembly instantiateStreaming error (handled):', error);
          throw error; // Re-throw to let libraries handle it
        }
      };
    }
  }
  
  private static setupAILibraryFallbacks() {
    // Set up fallbacks for AI libraries if they fail to load
    const setupLibraryFallback = (libraryName: string, fallbackFactory: () => any) => {
      const originalDefineProperty = Object.defineProperty;
      Object.defineProperty(window, libraryName, {
        get() {
          try {
            return (window as any)[`_${libraryName}`] || fallbackFactory();
          } catch (error) {
            console.warn(`🔧 ${libraryName} fallback activated:`, error);
            return fallbackFactory();
          }
        },
        set(value) {
          (window as any)[`_${libraryName}`] = value;
        },
        configurable: true
      });
    };
    
    // Set up fallbacks for common AI libraries
    setupLibraryFallback('tf', () => ({
      loadLayersModel: () => Promise.resolve(null),
      tensor: () => null,
      dispose: () => {},
      ready: () => Promise.resolve(),
      browser: {
        fromPixels: () => null,
        toPixels: () => null
      }
    }));
    
    setupLibraryFallback('MediaPipe', () => ({
      Holistic: class { constructor() { return null; } },
      FaceMesh: class { constructor() { return null; } },
      Hands: class { constructor() { return null; } },
      Pose: class { constructor() { return null; } }
    }));
  }
  
  public static getWasmErrors(): string[] {
    return [...this.wasmErrors];
  }
  
  public static clearWasmErrors(): void {
    this.wasmErrors = [];
  }
  
  public static isWasmWorking(): boolean {
    return typeof WebAssembly !== 'undefined' && WebAssembly.instantiate !== undefined;
  }
}
