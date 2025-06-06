import { apiRequest } from "./queryClient";

export interface PostureAnalysisResult {
  posture: 'good' | 'needs_improvement';
  gesture: 'open' | 'closed' | 'neutral';
  eyeContact: 'good' | 'poor';
  feedback: string;
}

export interface CoachingTip {
  type: string;
  message: string;
  severity: 'good' | 'warning' | 'improvement';
}

export interface SpeechAnalysisResult {
  tips: CoachingTip[];
}

export async function analyzePosture(imageBase64: string): Promise<PostureAnalysisResult> {
  try {
    const response = await apiRequest('POST', '/api/analyze-posture', {
      imageBase64
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to analyze posture:', error);
    throw new Error('Failed to analyze posture');
  }
}

export async function analyzeSpeech(transcript: string, metrics: any): Promise<SpeechAnalysisResult> {
  try {
    const response = await apiRequest('POST', '/api/analyze-speech', {
      transcript,
      metrics
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to analyze speech:', error);
    throw new Error('Failed to analyze speech');
  }
}
