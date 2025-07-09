// Enhanced Eye Tracking System with Glitch Prevention
export interface StableEyeContactMetrics {
  eyeContactPercentage: number;
  gazeStability: number;
  attentionScore: number;
  distractionLevel: number;
  confidenceScore: number;
  lastUpdate: number;
}

export class EnhancedEyeTrackingSystem {
  private metricsHistory: StableEyeContactMetrics[] = [];
  private stabilityThreshold = 0.1; // 10% change threshold for stability
  private historyLength = 10; // Keep last 10 measurements
  
  constructor() {
    this.initializeStableMetrics();
  }
  
  private initializeStableMetrics(): void {
    // Initialize with stable baseline metrics
    const baseline: StableEyeContactMetrics = {
      eyeContactPercentage: 75,
      gazeStability: 80,
      attentionScore: 75,
      distractionLevel: 20,
      confidenceScore: 85,
      lastUpdate: Date.now()
    };
    
    this.metricsHistory.push(baseline);
  }
  
  updateMetrics(rawMetrics: Partial<StableEyeContactMetrics>): StableEyeContactMetrics {
    const now = Date.now();
    const previousMetrics = this.metricsHistory[this.metricsHistory.length - 1];
    
    // Apply stability filtering to prevent glitches
    const stableMetrics: StableEyeContactMetrics = {
      eyeContactPercentage: this.stabilizeValue(
        rawMetrics.eyeContactPercentage || previousMetrics.eyeContactPercentage,
        previousMetrics.eyeContactPercentage,
        0.15 // 15% max change per update
      ),
      gazeStability: this.stabilizeValue(
        rawMetrics.gazeStability || previousMetrics.gazeStability,
        previousMetrics.gazeStability,
        0.1
      ),
      attentionScore: this.stabilizeValue(
        rawMetrics.attentionScore || previousMetrics.attentionScore,
        previousMetrics.attentionScore,
        0.12
      ),
      distractionLevel: this.stabilizeValue(
        rawMetrics.distractionLevel || previousMetrics.distractionLevel,
        previousMetrics.distractionLevel,
        0.15
      ),
      confidenceScore: this.stabilizeValue(
        rawMetrics.confidenceScore || previousMetrics.confidenceScore,
        previousMetrics.confidenceScore,
        0.08
      ),
      lastUpdate: now
    };
    
    // Add to history
    this.metricsHistory.push(stableMetrics);
    
    // Maintain history size
    if (this.metricsHistory.length > this.historyLength) {
      this.metricsHistory.shift();
    }
    
    return stableMetrics;
  }
  
  private stabilizeValue(newValue: number, previousValue: number, maxChangeRatio: number): number {
    // Ensure values are within valid range
    newValue = Math.max(0, Math.min(100, newValue));
    previousValue = Math.max(0, Math.min(100, previousValue));
    
    // Calculate maximum allowed change
    const maxChange = 100 * maxChangeRatio;
    const difference = newValue - previousValue;
    
    // Limit the change to prevent glitches
    if (Math.abs(difference) > maxChange) {
      return previousValue + (difference > 0 ? maxChange : -maxChange);
    }
    
    return newValue;
  }
  
  getSmoothedMetrics(): StableEyeContactMetrics {
    if (this.metricsHistory.length === 0) {
      return this.metricsHistory[0];
    }
    
    // Calculate weighted average with recent values having more weight
    const weights = this.metricsHistory.map((_, index) => Math.pow(1.5, index));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    const smoothedMetrics: StableEyeContactMetrics = {
      eyeContactPercentage: this.calculateWeightedAverage('eyeContactPercentage', weights, totalWeight),
      gazeStability: this.calculateWeightedAverage('gazeStability', weights, totalWeight),
      attentionScore: this.calculateWeightedAverage('attentionScore', weights, totalWeight),
      distractionLevel: this.calculateWeightedAverage('distractionLevel', weights, totalWeight),
      confidenceScore: this.calculateWeightedAverage('confidenceScore', weights, totalWeight),
      lastUpdate: this.metricsHistory[this.metricsHistory.length - 1].lastUpdate
    };
    
    return smoothedMetrics;
  }
  
  private calculateWeightedAverage(metric: keyof StableEyeContactMetrics, weights: number[], totalWeight: number): number {
    if (metric === 'lastUpdate') return Date.now();
    
    const weightedSum = this.metricsHistory.reduce((sum, metrics, index) => {
      return sum + (metrics[metric] as number) * weights[index];
    }, 0);
    
    return Math.round(weightedSum / totalWeight);
  }
  
  isStable(): boolean {
    if (this.metricsHistory.length < 3) return false;
    
    const recent = this.metricsHistory.slice(-3);
    const variations = recent.map(metrics => 
      Math.abs(metrics.eyeContactPercentage - recent[0].eyeContactPercentage)
    );
    
    return Math.max(...variations) < 10; // Stable if variation is less than 10%
  }
  
  reset(): void {
    this.metricsHistory = [];
    this.initializeStableMetrics();
  }
}

// Export singleton for consistent usage
export const enhancedEyeTracking = new EnhancedEyeTrackingSystem();