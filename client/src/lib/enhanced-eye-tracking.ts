// Enhanced Eye Tracking Library
interface EyeMetricsInput {
  eyeContactPercentage: number;
  gazeStability: number;
  attentionScore: number;
  distractionLevel: number;
  confidenceScore: number;
}

class EnhancedEyeTracking {
  updateMetrics(metrics: EyeMetricsInput): EyeMetricsInput {
    // Apply stability filters and return enhanced metrics
    return {
      eyeContactPercentage: Math.min(100, Math.max(0, metrics.eyeContactPercentage)),
      gazeStability: Math.min(100, Math.max(0, metrics.gazeStability)),
      attentionScore: Math.min(100, Math.max(0, metrics.attentionScore)),
      distractionLevel: Math.min(100, Math.max(0, metrics.distractionLevel)),
      confidenceScore: Math.min(100, Math.max(0, metrics.confidenceScore))
    };
  }
}

export const enhancedEyeTracking = new EnhancedEyeTracking();