// Authentic Data Validator - Ensures only real computer vision and speech data is stored
interface AuthenticSessionData {
  transcript: string;
  hasRealSpeech: boolean;
  hasRealVideo: boolean;
  duration: number;
  averageWPM: number;
  confidenceScore: number;
  voiceClarity: number;
  fillerWords: number;
  eyeContactScore: string;
  aiAnalysis?: any;
  bodyLanguageMetrics?: any;
  facialAnalysis?: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData: Partial<AuthenticSessionData>;
}

export class AuthenticDataValidator {
  
  static validateSessionData(sessionData: any): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: Partial<AuthenticSessionData> = {};

    // Validate transcript authenticity
    if (!sessionData.transcript || sessionData.transcript.length < 10) {
      sanitizedData.hasRealSpeech = false;
      sanitizedData.averageWPM = 0;
      sanitizedData.confidenceScore = 0;
      sanitizedData.voiceClarity = 0;
      sanitizedData.fillerWords = 0;
      sanitizedData.transcript = '';
    } else {
      sanitizedData.hasRealSpeech = true;
      sanitizedData.transcript = sessionData.transcript;
      
      // Calculate real WPM from transcript
      const words = sessionData.transcript.trim().split(/\s+/).length;
      const minutes = Math.max(1, sessionData.duration / 60);
      sanitizedData.averageWPM = Math.round(words / minutes);
      
      // Only accept authentic voice clarity scores
      if (sessionData.voiceClarity && sessionData.voiceClarity > 0) {
        sanitizedData.voiceClarity = Math.min(100, Math.max(0, sessionData.voiceClarity));
      } else {
        sanitizedData.voiceClarity = 0;
      }
      
      // Count real filler words from transcript
      sanitizedData.fillerWords = this.countFillerWords(sessionData.transcript);
    }

    // Validate computer vision data authenticity
    if (sessionData.aiAnalysis?.facialMetrics) {
      const facial = sessionData.aiAnalysis.facialMetrics;
      
      // Check if facial analysis has real computer vision confidence
      if (sessionData.aiAnalysis.confidence > 0 && 
          sessionData.aiAnalysis.mlAnalysis?.featureAccuracy > 0) {
        sanitizedData.hasRealVideo = true;
        sanitizedData.aiAnalysis = sessionData.aiAnalysis;
        
        // Use authentic eye contact from computer vision
        if (facial.communicationSignals?.eyeContactQuality) {
          sanitizedData.eyeContactScore = facial.communicationSignals.eyeContactQuality.toString();
        } else {
          sanitizedData.eyeContactScore = '0';
        }
        
        // Use authentic confidence from facial analysis
        if (facial.emotionalExpression?.confidence) {
          sanitizedData.confidenceScore = Math.min(100, Math.max(0, facial.emotionalExpression.confidence));
        } else {
          sanitizedData.confidenceScore = 0;
        }
        
      } else {
        // No real computer vision data available
        sanitizedData.hasRealVideo = false;
        sanitizedData.eyeContactScore = '0';
        sanitizedData.aiAnalysis = null;
        if (!sanitizedData.hasRealSpeech) {
          sanitizedData.confidenceScore = 0;
        }
      }
    } else {
      sanitizedData.hasRealVideo = false;
      sanitizedData.eyeContactScore = '0';
      sanitizedData.aiAnalysis = null;
    }

    // Validate body language metrics authenticity
    if (sessionData.bodyLanguageMetrics && sanitizedData.hasRealVideo) {
      sanitizedData.bodyLanguageMetrics = sessionData.bodyLanguageMetrics;
    } else {
      sanitizedData.bodyLanguageMetrics = null;
    }

    // Set duration (always authentic as it's measured by timer)
    sanitizedData.duration = Math.max(0, sessionData.duration || 0);

    // Validation result
    const isValid = sanitizedData.hasRealSpeech || sanitizedData.hasRealVideo;
    
    if (!isValid) {
      errors.push('Session contains no authentic speech or video data');
    }

    console.log('🔍 Data Validation Result:', {
      hasRealSpeech: sanitizedData.hasRealSpeech,
      hasRealVideo: sanitizedData.hasRealVideo,
      transcriptLength: sanitizedData.transcript?.length || 0,
      wpm: sanitizedData.averageWPM,
      errors: errors.length
    });

    return {
      isValid,
      errors,
      sanitizedData
    };
  }

  private static countFillerWords(transcript: string): number {
    if (!transcript) return 0;
    
    const fillerPatterns = [
      'um', 'uh', 'uhm', 'umm', 'er', 'err', 'ah', 'eh',
      'like', 'so', 'well', 'okay', 'ok', 'right', 'actually', 
      'basically', 'literally', 'obviously', 'totally', 'really'
    ];
    
    let count = 0;
    const words = transcript.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      const cleanWord = word.replace(/[.,!?;:'"()[\]]/g, '');
      if (fillerPatterns.includes(cleanWord)) {
        count++;
      }
    });
    
    return count;
  }

  static validateFacialAnalysis(facialData: any): boolean {
    if (!facialData) return false;
    
    // Check for authentic computer vision markers
    const hasRealLandmarks = facialData.landmarkPoints && facialData.landmarkPoints.length > 0;
    const hasConfidence = facialData.confidence && facialData.confidence > 0;
    const hasMLAnalysis = facialData.mlAnalysis && facialData.mlAnalysis.featureAccuracy > 0;
    
    return hasRealLandmarks || (hasConfidence && hasMLAnalysis);
  }

  static sanitizeMetrics(metrics: any): any {
    // Ensure all metrics are within valid ranges or zero
    return {
      confidence: this.sanitizeScore(metrics.confidence),
      eyeContact: this.sanitizeScore(metrics.eyeContact),
      posture: this.sanitizeScore(metrics.posture),
      gesture: this.sanitizeScore(metrics.gesture),
      clarity: this.sanitizeScore(metrics.clarity),
      engagement: this.sanitizeScore(metrics.engagement)
    };
  }

  private static sanitizeScore(score: any): number {
    if (typeof score !== 'number' || isNaN(score)) return 0;
    return Math.min(100, Math.max(0, score));
  }
}