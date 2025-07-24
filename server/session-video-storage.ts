// Comprehensive Video and Transcript Storage System
import { storage } from "./storage";
import type { InsertPracticeSession, PracticeSession } from "@shared/schema";

export interface SessionVideoData {
  sessionId: number;
  videoBlob: Buffer;
  transcript: string;
  duration: number;
  metadata: {
    resolution?: string;
    fileSize: number;
    mimeType: string;
    recordingDate: string;
  };
  facialAnalysis?: any;
  voiceMetrics?: any;
}

export class SessionVideoStorage {
  
  // Save complete session with video and transcript
  async saveSessionWithVideo(sessionData: {
    userId: string;
    sessionName: string;
    sessionPurpose: string;
    transcript: string;
    videoBlob: Buffer;
    duration: number;
    metrics: any;
    facialAnalysis?: any;
    voiceMetrics?: any;
    mimeType: string;
  }): Promise<number> {
    try {
      console.log('💾 Saving session with video and transcript:', sessionData.sessionName);
      
      // Create session record with video blob and transcript
      const session = await storage.createPracticeSession({
        userId: sessionData.userId,
        sessionName: sessionData.sessionName,
        purpose: sessionData.sessionPurpose,
        transcript: sessionData.transcript,
        videoBlob: sessionData.videoBlob.toString('base64'),
        duration: sessionData.duration,
        // Parse and store metrics as individual fields
        confidenceScore: this.extractMetric(sessionData.metrics, 'confidence', 0),
        clarityScore: this.extractMetric(sessionData.metrics, 'clarity', 0),
        paceScore: this.extractMetric(sessionData.metrics, 'pace', 0),
        eyeContactScore: this.extractMetric(sessionData.metrics, 'eyeContact', 0).toString(),
        gestureScore: this.extractMetric(sessionData.metrics, 'gesture', 0),
        overallScore: this.calculateOverallScore(sessionData.metrics),
        fillerWordCount: this.extractMetric(sessionData.metrics, 'fillerWordCount', 0),
        wordsPerMinute: this.extractMetric(sessionData.metrics, 'wordsPerMinute', 0),
        // Store facial analysis if available
        facialAnalysis: sessionData.facialAnalysis ? JSON.stringify(sessionData.facialAnalysis) : null,
        // Store voice metrics if available
        voiceMetrics: sessionData.voiceMetrics ? JSON.stringify(sessionData.voiceMetrics) : null,
        createdAt: new Date()
      });

      console.log('✅ Session saved successfully with ID:', session.id);
      return session.id;
      
    } catch (error) {
      console.error('❌ Failed to save session with video:', error);
      throw error;
    }
  }

  // Get session with video for playback
  async getSessionWithVideo(sessionId: number): Promise<{
    session: any;
    videoUrl?: string;
    hasVideo: boolean;
  }> {
    try {
      const session = await storage.getPracticeSession(sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }

      // Create video URL if video blob exists
      let videoUrl = undefined;
      if (session.videoBlob) {
        // Convert buffer to base64 for video playback  
        const base64Video = session.videoBlob.toString('base64');
        videoUrl = `data:video/webm;base64,${base64Video}`;
      }

      return {
        session,
        videoUrl,
        hasVideo: !!session.videoBlob
      };
      
    } catch (error) {
      console.error('❌ Failed to get session with video:', error);
      throw error;
    }
  }

  // Get all sessions with video metadata for user
  async getUserSessionsWithVideoInfo(userId: string): Promise<Array<{
    id: number;
    sessionName: string;
    transcript: string;
    duration: number;
    hasVideo: boolean;
    videoSize?: number;
    createdAt: Date;
    confidenceScore: number;
    overallScore: number;
  }>> {
    try {
      const sessions = await storage.getUserPracticeSessions(userId);
      
      return sessions.map(session => ({
        id: session.id,
        sessionName: session.name || session.sessionName || "Practice Session",
        transcript: session.transcript,
        duration: session.duration,
        hasVideo: !!session.videoBlob,
        videoSize: session.videoBlob ? session.videoBlob.length : undefined,
        createdAt: session.createdAt,
        confidenceScore: session.confidenceScore,
        overallScore: session.overallScore || 0
      }));
      
    } catch (error) {
      console.error('❌ Failed to get user sessions with video info:', error);
      return [];
    }
  }

  // Helper methods
  private extractMetric(metrics: any, key: string, defaultValue: number): number {
    if (!metrics) return defaultValue;
    
    // Try different possible locations for the metric
    const possiblePaths = [
      metrics[key],
      metrics.voice?.[key],
      metrics.bodyLanguage?.[key],
      metrics[key + 'Score'],
      metrics[key + 'Percentage']
    ];
    
    for (const value of possiblePaths) {
      if (typeof value === 'number' && !isNaN(value)) {
        return Math.max(0, Math.min(100, value));
      }
    }
    
    return defaultValue;
  }

  private calculateOverallScore(metrics: any): number {
    if (!metrics) return 0;
    
    const scores = [
      this.extractMetric(metrics, 'confidence', 0),
      this.extractMetric(metrics, 'clarity', 0),
      this.extractMetric(metrics, 'eyeContact', 0),
      this.extractMetric(metrics, 'engagement', 0)
    ];
    
    const validScores = scores.filter(score => score > 0);
    return validScores.length > 0 
      ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
      : 0;
  }
}

// Global instance
export const sessionVideoStorage = new SessionVideoStorage();