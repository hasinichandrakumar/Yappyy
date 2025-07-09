// WebGazer.js Precise Eye Contact & Gaze Tracking
declare global {
  interface Window {
    webgazer: any;
  }
}

export interface GazeData {
  x: number;
  y: number;
  timestamp: number;
  confidence: number;
}

export interface EyeContactAnalysis {
  gazePoints: GazeData[];
  focusRegions: {
    center: number;
    leftSide: number;
    rightSide: number;
    topSide: number;
    bottomSide: number;
  };
  attentionScore: number;
  gazeStability: number;
  eyeContactPercentage: number;
  distractionLevel: number;
}

export interface GazeHeatmap {
  regions: number[][];
  hotspots: { x: number; y: number; intensity: number }[];
  centerFocus: number;
  peripheralDistraction: number;
}

// Advanced WebGazer Eye Tracking System
export class WebGazerEyeTracking {
  private isInitialized = false;
  private gazeHistory: GazeData[] = [];
  private calibrationPoints: { x: number; y: number }[] = [];
  private onGazeCallback?: (gazeData: GazeData) => void;
  private screenWidth = window.innerWidth;
  private screenHeight = window.innerHeight;
  private isCalibrated = false;

  constructor() {
    this.setupCalibrationPoints();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load WebGazer
      if (!window.webgazer) {
        await this.loadWebGazer();
      }

      // Configure WebGazer
      window.webgazer
        .setRegression('ridge') // Use ridge regression for better accuracy
        .setTracker('clmtrackr') // Use CLM tracker for face tracking
        .setGazeListener((data: any, elapsedTime: number) => {
          if (data) {
            this.handleGazeData(data, elapsedTime);
          }
        })
        .showPredictionPoints(false) // Hide prediction points in production
        .showFaceOverlay(false) // Hide face overlay
        .showFaceFeedbackBox(false); // Hide feedback box

      // Start WebGazer
      await window.webgazer.begin();
      
      this.isInitialized = true;
      console.log('👁️ WebGazer Eye Tracking initialized');
      
      // Start calibration process
      await this.startCalibration();
    } catch (error) {
      console.error('Failed to initialize WebGazer:', error);
    }
  }

  private async loadWebGazer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private setupCalibrationPoints(): void {
    // Create calibration points for accurate gaze tracking
    const margin = 100;
    this.calibrationPoints = [
      { x: margin, y: margin }, // Top-left
      { x: this.screenWidth / 2, y: margin }, // Top-center
      { x: this.screenWidth - margin, y: margin }, // Top-right
      { x: margin, y: this.screenHeight / 2 }, // Middle-left
      { x: this.screenWidth / 2, y: this.screenHeight / 2 }, // Center
      { x: this.screenWidth - margin, y: this.screenHeight / 2 }, // Middle-right
      { x: margin, y: this.screenHeight - margin }, // Bottom-left
      { x: this.screenWidth / 2, y: this.screenHeight - margin }, // Bottom-center
      { x: this.screenWidth - margin, y: this.screenHeight - margin }, // Bottom-right
    ];
  }

  async startCalibration(): Promise<void> {
    return new Promise((resolve) => {
      let currentPoint = 0;
      const calibrationDuration = 3000; // 3 seconds per point
      
      const showCalibrationPoint = (point: { x: number; y: number }) => {
        // Create calibration dot
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.left = `${point.x}px`;
        dot.style.top = `${point.y}px`;
        dot.style.width = '20px';
        dot.style.height = '20px';
        dot.style.backgroundColor = '#3B82F6';
        dot.style.borderRadius = '50%';
        dot.style.zIndex = '10000';
        dot.style.transform = 'translate(-50%, -50%)';
        dot.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.8)';
        dot.style.animation = 'pulse 1s infinite';
        
        document.body.appendChild(dot);

        // Add CSS animation if not exists
        if (!document.getElementById('calibration-style')) {
          const style = document.createElement('style');
          style.id = 'calibration-style';
          style.textContent = `
            @keyframes pulse {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
              100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
          `;
          document.head.appendChild(style);
        }

        // Click event for calibration
        const handleClick = () => {
          window.webgazer.recordScreenPosition(point.x, point.y);
          dot.remove();
          
          currentPoint++;
          if (currentPoint < this.calibrationPoints.length) {
            setTimeout(() => showCalibrationPoint(this.calibrationPoints[currentPoint]), 500);
          } else {
            this.isCalibrated = true;
            console.log('✅ Eye tracking calibration completed');
            resolve();
          }
        };

        dot.addEventListener('click', handleClick);
        
        // Auto-advance after duration
        setTimeout(() => {
          if (document.body.contains(dot)) {
            handleClick();
          }
        }, calibrationDuration);
      };

      // Start calibration
      showCalibrationPoint(this.calibrationPoints[0]);
    });
  }

  private handleGazeData(data: any, elapsedTime: number): void {
    const gazeData: GazeData = {
      x: data.x,
      y: data.y,
      timestamp: Date.now(),
      confidence: this.calculateGazeConfidence(data)
    };

    // Add to history
    this.gazeHistory.push(gazeData);
    
    // Keep only recent data (last 30 seconds)
    const thirtySecondsAgo = Date.now() - 30000;
    this.gazeHistory = this.gazeHistory.filter(gaze => gaze.timestamp > thirtySecondsAgo);

    // Call callback if set
    if (this.onGazeCallback) {
      this.onGazeCallback(gazeData);
    }
  }

  private calculateGazeConfidence(data: any): number {
    // Calculate confidence based on tracking stability
    if (this.gazeHistory.length < 5) return 0.5;

    const recent = this.gazeHistory.slice(-5);
    const avgX = recent.reduce((sum, gaze) => sum + gaze.x, 0) / recent.length;
    const avgY = recent.reduce((sum, gaze) => sum + gaze.y, 0) / recent.length;

    const variance = recent.reduce((sum, gaze) => {
      const diffX = gaze.x - avgX;
      const diffY = gaze.y - avgY;
      return sum + (diffX * diffX + diffY * diffY);
    }, 0) / recent.length;

    // Lower variance = higher confidence
    return Math.max(0, Math.min(1, 1 - (variance / 10000)));
  }

  // Analyze eye contact for public speaking
  analyzeEyeContact(cameraPosition: { x: number; y: number; width: number; height: number }): EyeContactAnalysis {
    if (this.gazeHistory.length === 0) {
      return this.getDefaultEyeContactAnalysis();
    }

    const recentGazes = this.gazeHistory.slice(-50); // Last 50 gaze points
    const focusRegions = this.calculateFocusRegions(recentGazes);
    
    // Calculate eye contact with camera area
    const cameraGazes = recentGazes.filter(gaze => 
      this.isGazeInRegion(gaze, cameraPosition)
    );
    
    const eyeContactPercentage = (cameraGazes.length / recentGazes.length) * 100;
    
    // Calculate attention score
    const attentionScore = this.calculateAttentionScore(recentGazes);
    
    // Calculate gaze stability
    const gazeStability = this.calculateGazeStability(recentGazes);
    
    // Calculate distraction level
    const distractionLevel = this.calculateDistractionLevel(recentGazes, cameraPosition);

    return {
      gazePoints: recentGazes,
      focusRegions,
      attentionScore,
      gazeStability,
      eyeContactPercentage,
      distractionLevel
    };
  }

  private calculateFocusRegions(gazes: GazeData[]): EyeContactAnalysis['focusRegions'] {
    const regions = {
      center: 0,
      leftSide: 0,
      rightSide: 0,
      topSide: 0,
      bottomSide: 0
    };

    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight / 2;
    const centerRadius = Math.min(this.screenWidth, this.screenHeight) * 0.2;

    gazes.forEach(gaze => {
      const distanceFromCenter = Math.sqrt(
        Math.pow(gaze.x - centerX, 2) + Math.pow(gaze.y - centerY, 2)
      );

      if (distanceFromCenter < centerRadius) {
        regions.center++;
      } else if (gaze.x < centerX) {
        regions.leftSide++;
      } else {
        regions.rightSide++;
      }

      if (gaze.y < centerY) {
        regions.topSide++;
      } else {
        regions.bottomSide++;
      }
    });

    // Convert to percentages
    const total = gazes.length;
    return {
      center: (regions.center / total) * 100,
      leftSide: (regions.leftSide / total) * 100,
      rightSide: (regions.rightSide / total) * 100,
      topSide: (regions.topSide / total) * 100,
      bottomSide: (regions.bottomSide / total) * 100
    };
  }

  private calculateAttentionScore(gazes: GazeData[]): number {
    if (gazes.length === 0) return 0;

    // Calculate based on gaze consistency and focus
    const avgConfidence = gazes.reduce((sum, gaze) => sum + gaze.confidence, 0) / gazes.length;
    
    // Calculate focus consistency (less scattered = higher attention)
    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight / 2;
    
    const avgDistanceFromCenter = gazes.reduce((sum, gaze) => {
      return sum + Math.sqrt(Math.pow(gaze.x - centerX, 2) + Math.pow(gaze.y - centerY, 2));
    }, 0) / gazes.length;
    
    const maxDistance = Math.sqrt(Math.pow(this.screenWidth, 2) + Math.pow(this.screenHeight, 2));
    const focusScore = 1 - (avgDistanceFromCenter / maxDistance);
    
    return Math.round((avgConfidence * 50 + focusScore * 50));
  }

  private calculateGazeStability(gazes: GazeData[]): number {
    if (gazes.length < 2) return 0;

    let totalMovement = 0;
    for (let i = 1; i < gazes.length; i++) {
      const movement = Math.sqrt(
        Math.pow(gazes[i].x - gazes[i-1].x, 2) + 
        Math.pow(gazes[i].y - gazes[i-1].y, 2)
      );
      totalMovement += movement;
    }

    const avgMovement = totalMovement / (gazes.length - 1);
    const maxMovement = Math.sqrt(Math.pow(this.screenWidth, 2) + Math.pow(this.screenHeight, 2));
    
    // Lower movement = higher stability
    return Math.round((1 - Math.min(1, avgMovement / (maxMovement * 0.1))) * 100);
  }

  private calculateDistractionLevel(gazes: GazeData[], cameraPosition: { x: number; y: number; width: number; height: number }): number {
    if (gazes.length === 0) return 0;

    // Calculate time spent looking away from camera/center area
    const expandedCameraArea = {
      x: cameraPosition.x - cameraPosition.width,
      y: cameraPosition.y - cameraPosition.height,
      width: cameraPosition.width * 3,
      height: cameraPosition.height * 3
    };

    const distractedGazes = gazes.filter(gaze => 
      !this.isGazeInRegion(gaze, expandedCameraArea)
    );

    return Math.round((distractedGazes.length / gazes.length) * 100);
  }

  private isGazeInRegion(gaze: GazeData, region: { x: number; y: number; width: number; height: number }): boolean {
    return gaze.x >= region.x && 
           gaze.x <= region.x + region.width &&
           gaze.y >= region.y && 
           gaze.y <= region.y + region.height;
  }

  // Generate gaze heatmap
  generateGazeHeatmap(duration: number = 30000): GazeHeatmap {
    const cutoffTime = Date.now() - duration;
    const recentGazes = this.gazeHistory.filter(gaze => gaze.timestamp > cutoffTime);

    if (recentGazes.length === 0) {
      return this.getDefaultHeatmap();
    }

    // Create grid for heatmap
    const gridSize = 20;
    const cellWidth = this.screenWidth / gridSize;
    const cellHeight = this.screenHeight / gridSize;
    const regions: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

    // Populate grid
    recentGazes.forEach(gaze => {
      const gridX = Math.min(gridSize - 1, Math.floor(gaze.x / cellWidth));
      const gridY = Math.min(gridSize - 1, Math.floor(gaze.y / cellHeight));
      regions[gridY][gridX]++;
    });

    // Find hotspots
    const hotspots: { x: number; y: number; intensity: number }[] = [];
    const maxIntensity = Math.max(...regions.flat());
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (regions[y][x] > maxIntensity * 0.3) {
          hotspots.push({
            x: x * cellWidth + cellWidth / 2,
            y: y * cellHeight + cellHeight / 2,
            intensity: regions[y][x] / maxIntensity
          });
        }
      }
    }

    // Calculate center focus
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    const centerRegion = regions[centerY][centerX] + 
                        (regions[centerY-1]?.[centerX] || 0) +
                        (regions[centerY+1]?.[centerX] || 0) +
                        (regions[centerY]?.[centerX-1] || 0) +
                        (regions[centerY]?.[centerX+1] || 0);
    
    const centerFocus = (centerRegion / recentGazes.length) * 100;

    // Calculate peripheral distraction
    const peripheralGazes = recentGazes.filter(gaze => {
      const distanceFromCenter = Math.sqrt(
        Math.pow(gaze.x - this.screenWidth/2, 2) + 
        Math.pow(gaze.y - this.screenHeight/2, 2)
      );
      return distanceFromCenter > Math.min(this.screenWidth, this.screenHeight) * 0.3;
    });
    
    const peripheralDistraction = (peripheralGazes.length / recentGazes.length) * 100;

    return {
      regions,
      hotspots,
      centerFocus,
      peripheralDistraction
    };
  }

  // Set callback for real-time gaze data
  setGazeCallback(callback: (gazeData: GazeData) => void): void {
    this.onGazeCallback = callback;
  }

  // Get current gaze position
  getCurrentGaze(): GazeData | null {
    return this.gazeHistory.length > 0 ? this.gazeHistory[this.gazeHistory.length - 1] : null;
  }

  // Check if calibrated
  isCalibrationComplete(): boolean {
    return this.isCalibrated;
  }

  // Recalibrate
  async recalibrate(): Promise<void> {
    this.isCalibrated = false;
    await this.startCalibration();
  }

  private getDefaultEyeContactAnalysis(): EyeContactAnalysis {
    return {
      gazePoints: [],
      focusRegions: {
        center: 0,
        leftSide: 0,
        rightSide: 0,
        topSide: 0,
        bottomSide: 0
      },
      attentionScore: 0,
      gazeStability: 0,
      eyeContactPercentage: 0,
      distractionLevel: 0
    };
  }

  private getDefaultHeatmap(): GazeHeatmap {
    return {
      regions: [],
      hotspots: [],
      centerFocus: 0,
      peripheralDistraction: 0
    };
  }

  // Cleanup
  cleanup(): void {
    if (window.webgazer && this.isInitialized) {
      window.webgazer.end();
    }
    this.gazeHistory = [];
    this.isInitialized = false;
    this.isCalibrated = false;
  }
}