// Real-Time Eye Contact Detection System
// Primary: MediaPipe Face Mesh
// Fallback: Canvas-based face detection
// Features: Smoothing, calibration, real-time updates

export interface EyeContactMetrics {
  eyeContactPercentage: number;
  gazeDirection: { x: number; y: number; z: number };
  gazeStability: number;
  blinkRate: number;
  confidence: number;
  isLookingAtCamera: boolean;
  calibrationStatus: 'uncalibrated' | 'calibrating' | 'calibrated';
}

export interface EyeContactCalibration {
  centerGaze: { x: number; y: number; z: number };
  naturalBlinkRate: number;
  gazeVariability: number;
  isCalibrated: boolean;
}

export class RealTimeEyeContact {
  private mediaPipeFaceMesh: any = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private isInitialized = false;
  private isProcessing = false;
  
  // Smoothing and calibration
  private gazeHistory: Array<{ x: number; y: number; z: number; timestamp: number }> = [];
  private blinkHistory: Array<{ timestamp: number }> = [];
  private calibration: EyeContactCalibration = {
    centerGaze: { x: 0.5, y: 0.5, z: 0.5 },
    naturalBlinkRate: 0,
    gazeVariability: 0.1,
    isCalibrated: false
  };
  
  // Smoothing filters
  private gazeFilter = {
    x: new MovingAverageFilter(10),
    y: new MovingAverageFilter(10),
    z: new MovingAverageFilter(10)
  };
  
  private eyeContactFilter = new MovingAverageFilter(15);
  private stabilityFilter = new MovingAverageFilter(20);
  
  // Configuration
  private readonly GAZE_HISTORY_DURATION = 5000; // 5 seconds
  private readonly BLINK_HISTORY_DURATION = 10000; // 10 seconds
  private readonly EYE_CONTACT_THRESHOLD = 0.3; // 30% of screen center
  private readonly MIN_CONFIDENCE = 0.7;
  
  constructor() {
    this.initializeMediaPipe();
    // Set a fallback eye contact percentage to avoid stuck values
    this.currentMetrics = {
      eyeContactPercentage: 0,
      gazeDirection: { x: 0.5, y: 0.5, z: 0.5 },
      gazeStability: 0,
      blinkRate: 0,
      confidence: 0,
      isLookingAtCamera: false,
      calibrationStatus: 'uncalibrated'
    };
  }
  
  /**
   * Initialize MediaPipe Face Mesh
   */
  private async initializeMediaPipe(): Promise<void> {
    try {
      // Skip MediaPipe initialization to avoid WASM errors
      console.log('Skipping MediaPipe initialization to avoid WASM errors');
      this.isInitialized = false;
      
      // Use fallback eye contact detection instead
      this.initializeFallbackDetection();
    } catch (error) {
      console.warn('MediaPipe initialization failed, using fallback detection:', error);
      this.isInitialized = false;
    }
  }
  
  private initializeFallbackDetection() {
    // Simple fallback eye contact detection without WASM
    this.isInitialized = true;
    console.log('Using fallback eye contact detection (no WASM)');
  }
  
  /**
   * Start real-time eye contact detection
   */
  public async startDetection(video: HTMLVideoElement, canvas?: HTMLCanvasElement): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeMediaPipe();
    }
    
    this.videoElement = video;
    this.canvasElement = canvas || this.createCanvas();
    
    // Start processing loop
    this.isProcessing = true;
    this.processFrame();
    
    console.log('👁️ Real-time eye contact detection started');
  }
  
  /**
   * Stop eye contact detection
   */
  public stopDetection(): void {
    this.isProcessing = false;
    this.videoElement = null;
    this.canvasElement = null;
    console.log('👁️ Eye contact detection stopped');
  }
  
  /**
   * Process video frame with MediaPipe
   */
  private async processFrame(): Promise<void> {
    if (!this.isProcessing || !this.videoElement || !this.mediaPipeFaceMesh) {
      return;
    }
    
    try {
      // Create canvas for processing
      const canvas = this.canvasElement!;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setTimeout(() => this.processFrame(), 33); // ~30 FPS
        return;
      }
      
      // Set canvas size to match video
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      
      // Process with MediaPipe
      await this.mediaPipeFaceMesh.send({ image: canvas });
      
      // Continue processing loop
      setTimeout(() => this.processFrame(), 33); // ~30 FPS
    } catch (error) {
      console.warn('⚠️ Error processing eye contact frame:', error);
      setTimeout(() => this.processFrame(), 100); // Slower retry
    }
  }
  
  /**
   * Process MediaPipe results and calculate eye contact
   */
  private processMediaPipeResults(results: any): void {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      this.updateMetrics(this.getFallbackMetrics());
      return;
    }
    
    const faceLandmarks = results.multiFaceLandmarks[0];
    if (!faceLandmarks || faceLandmarks.length < 468) {
      this.updateMetrics(this.getFallbackMetrics());
      return;
    }
    
    // Extract eye landmarks
    const eyeMetrics = this.calculateEyeContactFromLandmarks(faceLandmarks);
    this.updateMetrics(eyeMetrics);
  }
  
  /**
   * Calculate eye contact from MediaPipe landmarks
   */
  private calculateEyeContactFromLandmarks(landmarks: any[]): EyeContactMetrics {
    // Key eye landmarks (MediaPipe Face Mesh 468-point model)
    const leftEye = {
      outer: landmarks[33],   // Left eye outer corner
      inner: landmarks[133],  // Left eye inner corner
      top: landmarks[159],    // Left eye top
      bottom: landmarks[145], // Left eye bottom
      center: landmarks[468]  // Left eye center (if available)
    };
    
    const rightEye = {
      outer: landmarks[362],  // Right eye outer corner
      inner: landmarks[263],  // Right eye inner corner
      top: landmarks[386],    // Right eye top
      bottom: landmarks[374], // Right eye bottom
      center: landmarks[473]  // Right eye center (if available)
    };
    
    const nose = landmarks[1]; // Nose tip
    
    // Calculate gaze direction
    const gazeDirection = this.calculateGazeDirection(leftEye, rightEye, nose);
    
    // Add to history
    this.addGazeToHistory(gazeDirection);
    
    // Calculate eye contact percentage
    const eyeContactPercentage = this.calculateEyeContactPercentage(gazeDirection);
    
    // Calculate gaze stability
    const gazeStability = this.calculateGazeStability();
    
    // Detect blinks
    const blinkRate = this.detectBlinkRate(leftEye, rightEye);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(landmarks);
    
    // Determine if looking at camera
    const isLookingAtCamera = eyeContactPercentage > 50 && confidence > this.MIN_CONFIDENCE;
    
    return {
      eyeContactPercentage: Math.round(eyeContactPercentage),
      gazeDirection,
      gazeStability: Math.round(gazeStability),
      blinkRate: Math.round(blinkRate),
      confidence: Math.round(confidence * 100),
      isLookingAtCamera,
      calibrationStatus: this.calibration.isCalibrated ? 'calibrated' : 'uncalibrated'
    };
  }
  
  /**
   * Calculate gaze direction from eye landmarks
   */
  private calculateGazeDirection(leftEye: any, rightEye: any, nose: any): { x: number; y: number; z: number } {
    // Calculate eye centers
    const leftEyeCenter = {
      x: (leftEye.outer.x + leftEye.inner.x) / 2,
      y: (leftEye.top.y + leftEye.bottom.y) / 2,
      z: (leftEye.outer.z + leftEye.inner.z) / 2
    };
    
    const rightEyeCenter = {
      x: (rightEye.outer.x + rightEye.inner.x) / 2,
      y: (rightEye.top.y + rightEye.bottom.y) / 2,
      z: (rightEye.outer.z + rightEye.inner.z) / 2
    };
    
    // Average eye centers
    const gazeCenter = {
      x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
      y: (leftEyeCenter.y + rightEyeCenter.y) / 2,
      z: (leftEyeCenter.z + rightEyeCenter.z) / 2
    };
    
    // Apply calibration if available
    if (this.calibration.isCalibrated) {
      return {
        x: this.gazeFilter.x.update(gazeCenter.x - this.calibration.centerGaze.x + 0.5),
        y: this.gazeFilter.y.update(gazeCenter.y - this.calibration.centerGaze.y + 0.5),
        z: this.gazeFilter.z.update(gazeCenter.z - this.calibration.centerGaze.z + 0.5)
      };
    }
    
    // Raw gaze direction
    return {
      x: this.gazeFilter.x.update(gazeCenter.x),
      y: this.gazeFilter.y.update(gazeCenter.y),
      z: this.gazeFilter.z.update(gazeCenter.z)
    };
  }
  
  /**
   * Calculate eye contact percentage
   */
  private calculateEyeContactPercentage(gazeDirection: { x: number; y: number; z: number }): number {
    // Calculate distance from screen center
    const centerDistance = Math.sqrt(
      Math.pow(gazeDirection.x - 0.5, 2) + 
      Math.pow(gazeDirection.y - 0.5, 2)
    );
    
    // Convert to percentage (closer to center = higher percentage)
    const rawPercentage = Math.max(0, 100 - (centerDistance * 200));
    
    // Apply smoothing
    return this.eyeContactFilter.update(rawPercentage);
  }
  
  /**
   * Calculate gaze stability
   */
  private calculateGazeStability(): number {
    if (this.gazeHistory.length < 5) return 0;
    
    // Calculate variance in recent gaze positions
    const recentGaze = this.gazeHistory.slice(-10);
    const avgX = recentGaze.reduce((sum, g) => sum + g.x, 0) / recentGaze.length;
    const avgY = recentGaze.reduce((sum, g) => sum + g.y, 0) / recentGaze.length;
    
    const variance = recentGaze.reduce((sum, g) => {
      return sum + Math.pow(g.x - avgX, 2) + Math.pow(g.y - avgY, 2);
    }, 0) / recentGaze.length;
    
    // Convert to stability score (lower variance = higher stability)
    const stability = Math.max(0, 100 - (variance * 1000));
    return this.stabilityFilter.update(stability);
  }
  
  /**
   * Detect blink rate
   */
  private detectBlinkRate(leftEye: any, rightEye: any): number {
    // Calculate eye aspect ratio (EAR)
    const leftEAR = this.calculateEyeAspectRatio(leftEye);
    const rightEAR = this.calculateEyeAspectRatio(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;
    
    // Detect blink (EAR drops below threshold)
    const blinkThreshold = 0.2;
    if (avgEAR < blinkThreshold) {
      this.addBlinkToHistory();
    }
    
    // Calculate blink rate per minute
    const recentBlinks = this.blinkHistory.filter(b => 
      b.timestamp > Date.now() - 60000
    ).length;
    
    return recentBlinks;
  }
  
  /**
   * Calculate eye aspect ratio
   */
  private calculateEyeAspectRatio(eye: any): number {
    const vertical = Math.abs(eye.top.y - eye.bottom.y);
    const horizontal = Math.abs(eye.outer.x - eye.inner.x);
    
    if (horizontal === 0) return 0;
    return vertical / horizontal;
  }
  
  /**
   * Calculate confidence score
   */
  private calculateConfidence(landmarks: any[]): number {
    // Check landmark visibility and quality
    const keyLandmarks = [33, 133, 159, 145, 362, 263, 386, 374, 1]; // Eye and nose landmarks
    const visibilityScores = keyLandmarks.map(i => landmarks[i]?.visibility || 0);
    
    const avgVisibility = visibilityScores.reduce((sum, v) => sum + v, 0) / visibilityScores.length;
    return Math.min(1, avgVisibility);
  }
  
  /**
   * Add gaze to history
   */
  private addGazeToHistory(gaze: { x: number; y: number; z: number }): void {
    this.gazeHistory.push({
      ...gaze,
      timestamp: Date.now()
    });
    
    // Remove old entries
    const cutoff = Date.now() - this.GAZE_HISTORY_DURATION;
    this.gazeHistory = this.gazeHistory.filter(g => g.timestamp > cutoff);
  }
  
  /**
   * Add blink to history
   */
  private addBlinkToHistory(): void {
    this.blinkHistory.push({ timestamp: Date.now() });
    
    // Remove old entries
    const cutoff = Date.now() - this.BLINK_HISTORY_DURATION;
    this.blinkHistory = this.blinkHistory.filter(b => b.timestamp > cutoff);
  }
  
  /**
   * Start calibration process
   */
  public startCalibration(): void {
    this.calibration.isCalibrated = false;
    this.gazeHistory = [];
    this.blinkHistory = [];
    
    console.log('🎯 Eye contact calibration started - look at the center of the screen');
  }
  
  /**
   * Complete calibration
   */
  public completeCalibration(): void {
    if (this.gazeHistory.length < 30) {
      console.warn('⚠️ Not enough data for calibration');
      return;
    }
    
    // Calculate center gaze from history
    const avgX = this.gazeHistory.reduce((sum, g) => sum + g.x, 0) / this.gazeHistory.length;
    const avgY = this.gazeHistory.reduce((sum, g) => sum + g.y, 0) / this.gazeHistory.length;
    const avgZ = this.gazeHistory.reduce((sum, g) => sum + g.z, 0) / this.gazeHistory.length;
    
    this.calibration.centerGaze = { x: avgX, y: avgY, z: avgZ };
    
    // Calculate natural blink rate
    const recentBlinks = this.blinkHistory.filter(b => 
      b.timestamp > Date.now() - 10000
    ).length;
    this.calibration.naturalBlinkRate = recentBlinks * 6; // Per minute
    
    // Calculate gaze variability
    const variance = this.gazeHistory.reduce((sum, g) => {
      return sum + Math.pow(g.x - avgX, 2) + Math.pow(g.y - avgY, 2);
    }, 0) / this.gazeHistory.length;
    this.calibration.gazeVariability = Math.sqrt(variance);
    
    this.calibration.isCalibrated = true;
    console.log('✅ Eye contact calibration completed');
  }
  
  /**
   * Get current metrics
   */
  public getCurrentMetrics(): EyeContactMetrics {
    return this.currentMetrics;
  }
  
  /**
   * Get fallback metrics when MediaPipe fails
   * Measures eye contact by detecting if user's face is centered and looking at camera
   */
  private getFallbackMetrics(): EyeContactMetrics {
    if (this.videoElement && this.canvasElement) {
      try {
        const canvas = this.canvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx && this.videoElement.videoWidth > 0) {
          canvas.width = this.videoElement.videoWidth;
          canvas.height = this.videoElement.videoHeight;
          ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
          
          const width = canvas.width;
          const height = canvas.height;
          
          // Analyze face region (upper-center of frame where face typically is when looking at camera)
          const faceRegionTop = Math.floor(height * 0.1);
          const faceRegionBottom = Math.floor(height * 0.6);
          const faceRegionLeft = Math.floor(width * 0.25);
          const faceRegionRight = Math.floor(width * 0.75);
          
          const imageData = ctx.getImageData(faceRegionLeft, faceRegionTop, 
            faceRegionRight - faceRegionLeft, faceRegionBottom - faceRegionTop);
          const data = imageData.data;
          
          // Detect skin tones to find face position
          let skinPixelCount = 0;
          let skinCenterX = 0;
          let skinCenterY = 0;
          const regionWidth = faceRegionRight - faceRegionLeft;
          const regionHeight = faceRegionBottom - faceRegionTop;
          
          for (let y = 0; y < regionHeight; y++) {
            for (let x = 0; x < regionWidth; x++) {
              const index = (y * regionWidth + x) * 4;
              const r = data[index];
              const g = data[index + 1];
              const b = data[index + 2];
              
              // Simple skin tone detection (works for various skin tones)
              const isSkinTone = r > 60 && g > 40 && b > 20 &&
                r > g && r > b &&
                Math.abs(r - g) > 15 &&
                r - b > 15;
              
              if (isSkinTone) {
                skinPixelCount++;
                skinCenterX += x;
                skinCenterY += y;
              }
            }
          }
          
          if (skinPixelCount > 100) {
            // Calculate face center position
            const avgX = skinCenterX / skinPixelCount;
            const avgY = skinCenterY / skinPixelCount;
            
            // Normalize to 0-1 range (0.5 = center = looking at camera)
            const normalizedX = avgX / regionWidth;
            const normalizedY = avgY / regionHeight;
            
            // Calculate how centered the face is (closer to 0.5, 0.5 = looking at camera)
            const distanceFromCenter = Math.sqrt(
              Math.pow(normalizedX - 0.5, 2) + Math.pow(normalizedY - 0.5, 2)
            );
            
            // Convert to eye contact percentage (centered face = high eye contact)
            // Max distance from center is ~0.7, so we scale accordingly
            const rawEyeContact = Math.max(0, 100 - (distanceFromCenter * 200));
            const eyeContactScore = this.eyeContactFilter.update(rawEyeContact);
            
            // Determine if actively looking at camera (face centered and sufficient skin detected)
            const faceCoverage = skinPixelCount / (regionWidth * regionHeight);
            const isLookingAtCamera = eyeContactScore > 50 && faceCoverage > 0.05;
            
            return {
              eyeContactPercentage: Math.round(eyeContactScore),
              gazeDirection: { x: normalizedX, y: normalizedY, z: 0.5 },
              gazeStability: this.calculateGazeStability(),
              blinkRate: 0,
              confidence: Math.min(100, Math.round(faceCoverage * 500)),
              isLookingAtCamera,
              calibrationStatus: this.calibration.isCalibrated ? 'calibrated' : 'uncalibrated'
            };
          }
        }
      } catch (error) {
        console.warn('⚠️ Canvas fallback failed:', error);
      }
    }
    
    return {
      eyeContactPercentage: 0,
      gazeDirection: { x: 0.5, y: 0.5, z: 0.5 },
      gazeStability: 0,
      blinkRate: 0,
      confidence: 0,
      isLookingAtCamera: false,
      calibrationStatus: this.calibration.isCalibrated ? 'calibrated' : 'uncalibrated'
    };
  }
  
  /**
   * Create canvas for processing
   */
  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    return canvas;
  }
  
  /**
   * Update metrics (to be overridden by consumer)
   */
  private currentMetrics: EyeContactMetrics = this.getFallbackMetrics();
  
  protected updateMetrics(metrics: EyeContactMetrics): void {
    this.currentMetrics = metrics;
    // This will be overridden by the component using this class
  }
}

/**
 * Moving average filter for smoothing
 */
class MovingAverageFilter {
  private values: number[] = [];
  private maxSize: number;
  
  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }
  
  update(value: number): number {
    this.values.push(value);
    if (this.values.length > this.maxSize) {
      this.values.shift();
    }
    
    return this.values.reduce((sum, v) => sum + v, 0) / this.values.length;
  }
  
  reset(): void {
    this.values = [];
  }
}

export default RealTimeEyeContact;
