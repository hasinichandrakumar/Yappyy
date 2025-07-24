// Persistent AI Analytics Service - Survives Session Deletion
import { storage } from './storage';
import type { 
  InsertCoachingAnalytics, 
  InsertUserProgressSnapshot,
  PracticeSession 
} from '@shared/schema';

export class PersistentAIAnalyticsService {
  
  /**
   * Extract and save coaching analytics from a practice session
   * This data persists even if the original session is deleted
   */
  async saveSessionAnalytics(session: PracticeSession): Promise<void> {
    try {
      console.log('💾 Saving persistent coaching analytics for session:', session.id);

      // Extract voice metrics
      const voiceMetrics = {
        averageWPM: session.averageWPM || 0,
        voiceClarity: session.voiceClarity || 0,
        confidenceScore: session.confidenceScore || 0,
        fillerWordCount: session.fillerWords || 0,
        pauseCount: session.pauseCount || 0,
        paceScore: session.paceScore || 0,
        volumeConsistency: session.volumeConsistency || 0,
        intonationScore: session.intonationScore || 0,
        fillerWordsUh: session.fillerWordsUh || 0,
        fillerWordsLike: session.fillerWordsLike || 0,
        fillerWordsSo: session.fillerWordsSo || 0,
        voiceMetrics: session.voiceMetrics || {}
      };

      // Extract body language metrics
      const bodyLanguageMetrics = {
        eyeContactScore: parseFloat(session.eyeContactScore) || 0,
        gestureScore: session.gestureScore || 0,
        postureScore: session.postureScore || 0,
        bodyLanguageMetrics: session.bodyLanguageMetrics || {},
        facialAnalysis: session.facialAnalysis || {}
      };

      // Extract content metrics
      const contentMetrics = {
        overallScore: session.overallScore || 0,
        clarityScore: session.clarityScore || 0,
        persuasivenessScore: session.persuasivenessScore || 0,
        transcriptLength: session.transcript?.length || 0,
        aiAnalysis: session.aiAnalysis || {},
        speechPatterns: session.speechPatterns || {},
        rhetoricAnalysis: session.rhetoricAnalysis || {}
      };

      // Identify strengths and improvements using AI analysis
      const { strengths, improvements, insights } = this.analyzeSessionPerformance(session);

      // Create persistent coaching analytics
      const analyticsData: InsertCoachingAnalytics = {
        userId: session.userId,
        sessionId: session.id.toString(),
        sessionDate: session.createdAt || new Date(),
        sessionDuration: session.duration,
        sessionPurpose: session.purpose || 'general_practice',

        // Voice analytics
        voiceMetrics,
        voiceImprovements: improvements.voice,
        voiceStrengths: strengths.voice,

        // Body language analytics
        bodyLanguageMetrics,
        bodyLanguageImprovements: improvements.bodyLanguage,
        bodyLanguageStrengths: strengths.bodyLanguage,

        // Content analytics
        contentMetrics,
        contentImprovements: improvements.content,
        contentStrengths: strengths.content,

        // Overall performance scores
        overallConfidence: session.confidenceScore || 0,
        overallClarity: session.voiceClarity || 0,
        overallEngagement: this.calculateEngagementScore(session),
        overallScore: session.overallScore || 0,

        // AI insights
        aiInsights: insights,
        aiRecommendations: this.generateRecommendations(session),
        learningPatterns: this.extractLearningPatterns(session)
      };

      await storage.createCoachingAnalytics(analyticsData);
      console.log('✅ Persistent coaching analytics saved successfully');

    } catch (error) {
      console.error('❌ Error saving persistent coaching analytics:', error);
    }
  }

  /**
   * Create progress snapshot for user
   * Maintains progress history even when individual sessions are deleted
   */
  async createProgressSnapshot(userId: string): Promise<void> {
    try {
      console.log('📊 Creating progress snapshot for user:', userId);

      // Get recent coaching analytics
      const recentAnalytics = await storage.getUserCoachingAnalytics(userId);
      const last30Days = recentAnalytics.filter(
        analytics => analytics.sessionDate && 
        new Date(analytics.sessionDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      if (last30Days.length === 0) {
        console.log('No recent analytics found for progress snapshot');
        return;
      }

      // Calculate averages and trends
      const averageConfidence = this.calculateAverage(last30Days, 'overallConfidence');
      const averageClarity = this.calculateAverage(last30Days, 'overallClarity');
      const averageEngagement = this.calculateAverage(last30Days, 'overallEngagement');

      // Calculate improvement trends
      const confidenceTrend = this.calculateTrend(last30Days, 'overallConfidence');
      const clarityTrend = this.calculateTrend(last30Days, 'overallClarity');
      const engagementTrend = this.calculateTrend(last30Days, 'overallEngagement');

      // Get current AI coach profile for neural data
      const aiProfile = await storage.getAiCoachProfile(userId);

      const snapshotData: InsertUserProgressSnapshot = {
        userId,
        totalSessions: last30Days.length,
        averageConfidence,
        averageClarity,
        averageEngagement,
        confidenceTrend,
        clarityTrend,
        engagementTrend,
        currentFocusAreas: this.identifyFocusAreas(last30Days),
        recentAchievements: this.identifyAchievements(last30Days),
        challengeAreas: this.identifyChallengeAreas(last30Days),
        neuralConfidence: aiProfile?.neuralConfidence || 0.6,
        trainingAccuracy: 0.7 + (last30Days.length * 0.01), // Increases with more data
        adaptiveStrategy: aiProfile?.adaptiveStrategy || 'balanced_development'
      };

      await storage.createUserProgressSnapshot(snapshotData);
      console.log('✅ Progress snapshot created successfully');

    } catch (error) {
      console.error('❌ Error creating progress snapshot:', error);
    }
  }

  /**
   * Get comprehensive coaching data for AI analysis
   * Used by AI coach even when original sessions are deleted
   */
  async getCoachingDataForAnalysis(userId: string): Promise<any> {
    try {
      const [analytics, snapshots, aiProfile] = await Promise.all([
        storage.getUserCoachingAnalytics(userId),
        storage.getUserProgressSnapshots(userId),
        storage.getAiCoachProfile(userId)
      ]);

      return {
        totalSessions: analytics.length,
        recentAnalytics: analytics.slice(0, 10), // Last 10 sessions
        progressHistory: snapshots.slice(0, 5), // Last 5 snapshots
        aiProfile,
        trends: this.calculateOverallTrends(analytics),
        patterns: this.identifyLearningPatterns(analytics),
        recommendations: this.generatePersonalizedRecommendations(analytics, aiProfile)
      };
    } catch (error) {
      console.error('Error getting coaching data for analysis:', error);
      return null;
    }
  }

  // Private helper methods for analysis

  private analyzeSessionPerformance(session: PracticeSession) {
    const strengths = {
      voice: [] as string[],
      bodyLanguage: [] as string[],
      content: [] as string[]
    };

    const improvements = {
      voice: [] as string[],
      bodyLanguage: [] as string[],
      content: [] as string[]
    };

    // Voice analysis
    if ((session.voiceClarity || 0) > 0.7) {
      strengths.voice.push('Clear and articulate speech');
    } else if ((session.voiceClarity || 0) < 0.5) {
      improvements.voice.push('Focus on clearer articulation');
    }

    if ((session.averageWPM || 0) >= 120 && (session.averageWPM || 0) <= 180) {
      strengths.voice.push('Optimal speaking pace');
    } else if ((session.averageWPM || 0) < 120) {
      improvements.voice.push('Increase speaking pace slightly');
    } else {
      improvements.voice.push('Slow down speaking pace');
    }

    // Body language analysis
    const eyeContact = parseFloat(session.eyeContactScore) || 0;
    if (eyeContact > 0.7) {
      strengths.bodyLanguage.push('Excellent eye contact');
    } else if (eyeContact < 0.5) {
      improvements.bodyLanguage.push('Improve eye contact with audience');
    }

    // Content analysis
    if ((session.overallScore || 0) > 0.8) {
      strengths.content.push('Strong overall presentation');
    } else if ((session.overallScore || 0) < 0.6) {
      improvements.content.push('Focus on content structure and delivery');
    }

    const insights = [
      `Session duration: ${Math.round((session.duration || 0) / 60)} minutes`,
      `Words spoken: ${session.transcript?.split(' ').length || 0}`,
      `Speaking confidence: ${Math.round((session.confidenceScore || 0) * 100)}%`
    ];

    return { strengths, improvements, insights };
  }

  private calculateEngagementScore(session: PracticeSession): number {
    const eyeContact = parseFloat(session.eyeContactScore) || 0;
    const gestureScore = session.gestureScore || 0;
    const confidenceScore = session.confidenceScore || 0;
    
    return (eyeContact + gestureScore + confidenceScore) / 3;
  }

  private generateRecommendations(session: PracticeSession): string[] {
    const recommendations = [];

    if ((session.fillerWords || 0) > 5) {
      recommendations.push('Practice reducing filler words by pausing instead');
    }

    if ((session.averageWPM || 0) > 200) {
      recommendations.push('Slow down your speaking pace for better comprehension');
    }

    if (parseFloat(session.eyeContactScore) < 0.5) {
      recommendations.push('Practice maintaining eye contact with your audience');
    }

    return recommendations;
  }

  private extractLearningPatterns(session: PracticeSession): any {
    return {
      sessionLength: session.duration,
      engagementLevel: this.calculateEngagementScore(session),
      improvementAreas: session.coachingTips?.length || 0,
      consistencyPattern: 'building' // Will be enhanced with multiple sessions
    };
  }

  private calculateAverage(analytics: any[], field: string): number {
    const validValues = analytics
      .map(item => item[field])
      .filter(val => val != null && !isNaN(val));
    
    return validValues.length > 0 
      ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
      : 0;
  }

  private calculateTrend(analytics: any[], field: string): number {
    if (analytics.length < 2) return 0;
    
    const recent = analytics.slice(0, Math.ceil(analytics.length / 2));
    const older = analytics.slice(Math.ceil(analytics.length / 2));
    
    const recentAvg = this.calculateAverage(recent, field);
    const olderAvg = this.calculateAverage(older, field);
    
    return recentAvg - olderAvg; // Positive = improving, negative = declining
  }

  private identifyFocusAreas(analytics: any[]): string[] {
    const areas = [];
    
    const avgConfidence = this.calculateAverage(analytics, 'overallConfidence');
    const avgClarity = this.calculateAverage(analytics, 'overallClarity');
    const avgEngagement = this.calculateAverage(analytics, 'overallEngagement');
    
    if (avgConfidence < 0.6) areas.push('Confidence Building');
    if (avgClarity < 0.6) areas.push('Voice Clarity');
    if (avgEngagement < 0.6) areas.push('Audience Engagement');
    
    return areas;
  }

  private identifyAchievements(analytics: any[]): string[] {
    const achievements = [];
    
    if (analytics.length >= 5) achievements.push('Practice Consistency');
    if (this.calculateAverage(analytics, 'overallScore') > 0.8) {
      achievements.push('High Performance');
    }
    
    return achievements;
  }

  private identifyChallengeAreas(analytics: any[]): string[] {
    const challenges = [];
    
    const avgFillerWords = this.calculateAverage(analytics, 'voiceMetrics');
    if (avgFillerWords > 0.3) challenges.push('Filler Word Reduction');
    
    return challenges;
  }

  private calculateOverallTrends(analytics: any[]): any {
    return {
      confidenceTrend: this.calculateTrend(analytics, 'overallConfidence'),
      clarityTrend: this.calculateTrend(analytics, 'overallClarity'),
      engagementTrend: this.calculateTrend(analytics, 'overallEngagement'),
      improvementVelocity: analytics.length > 0 ? 0.1 * analytics.length : 0
    };
  }

  private identifyLearningPatterns(analytics: any[]): any {
    return {
      practiceFrequency: analytics.length,
      consistencyScore: analytics.length > 3 ? 0.8 : 0.5,
      learningVelocity: 'moderate',
      engagementPattern: 'consistent'
    };
  }

  private generatePersonalizedRecommendations(analytics: any[], aiProfile: any): string[] {
    const recommendations = [];
    
    if (analytics.length > 0) {
      const latestSession = analytics[0];
      
      if (latestSession.overallConfidence < 0.6) {
        recommendations.push('Focus on confidence-building exercises');
      }
      
      if (latestSession.overallClarity < 0.6) {
        recommendations.push('Practice voice clarity and articulation');
      }
    }
    
    if (aiProfile?.adaptiveStrategy === 'confidence_building') {
      recommendations.push('Continue with supportive coaching approach');
    }
    
    return recommendations;
  }
}

export const persistentAIAnalytics = new PersistentAIAnalyticsService();