// Disable all WASM-dependent modules to prevent console errors

// Block all problematic imports
const blockedModules = [
  '@mediapipe/face_mesh',
  '@mediapipe/pose',
  '@mediapipe/hands',
  '@mediapipe/holistic',
  '@mediapipe/camera_utils',
  '@mediapipe/drawing_utils',
  '@tensorflow/tfjs',
  '@tensorflow/tfjs-node',
  'face-api.js',
  'opencv.js'
];

// Override dynamic imports
if (typeof window !== 'undefined') {
  const originalImport = window.eval('import');
  
  window.eval = function(code: string) {
    // Block import statements for problematic modules
    if (typeof code === 'string') {
      for (const blockedModule of blockedModules) {
        if (code.includes(blockedModule)) {
          console.warn(`Blocking import of ${blockedModule} to prevent WASM errors`);
          return Promise.reject(new Error(`Import blocked: ${blockedModule}`));
        }
      }
    }
    return originalImport.call(this, code);
  };
}

export function disableWasmModules() {
  console.log('WASM modules disabled to prevent console errors');
  
  // Override require if available
  if (typeof require !== 'undefined') {
    const originalRequire = require;
    (global as any).require = function(id: string) {
      if (blockedModules.some(blocked => id.includes(blocked))) {
        throw new Error(`Module ${id} blocked to prevent WASM errors`);
      }
      return originalRequire(id);
    };
  }
}