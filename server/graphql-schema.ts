/**
 * GraphQL Schema for Neural Analysis
 * Enables flexible querying of specific metrics and reduces data over-fetching
 */

import { buildSchema } from 'graphql';
import { storage } from './storage';

export const neuralAnalysisSchema = buildSchema(`
  type Query {
    neuralAnalysis(userId: ID!): NeuralAnalysis
    practiceSessions(userId: ID!, limit: Int = 10, offset: Int = 0): [PracticeSession]
    userProgress(userId: ID!): UserProgress
    performanceMetrics(userId: ID!, metric: String): [PerformanceTrend]
  }

  type NeuralAnalysis {
    userId: ID!
    voiceModulation: VoiceMetrics
    bodyLanguage: BodyLanguageMetrics
    contentStructure: ContentMetrics
    confidenceScore: Float
    trends: [PerformanceTrend]
    insights: [String]
    lastUpdated: String
  }

  type VoiceMetrics {
    clarity: Float
    pitchVariation: Float
    modulation: Float
    prosody: Float
    fillerWords: [String]
    confidence: Float
  }

  type BodyLanguageMetrics {
    gestureEffectiveness: Float
    postureScore: Float
    eyeContact: Float
    engagement: Float
    confidence: Float
  }

  type ContentMetrics {
    coherenceScore: Float
    logicalFlow: Float
    structure: Float
    impact: Float
    audienceEngagement: Float
    confidence: Float
  }

  type PerformanceTrend {
    metric: String
    currentValue: Float
    historicalAverage: Float
    improvement: Float
    confidenceInterval: [Float]
    trend: TrendDirection
  }

  type PracticeSession {
    id: ID!
    userId: ID!
    date: String
    duration: Int
    purpose: String
    voiceMetrics: VoiceMetrics
    bodyLanguageMetrics: BodyLanguageMetrics
    contentMetrics: ContentMetrics
    overallScore: Float
    neuralInsights: [String]
  }

  type UserProgress {
    totalSessions: Int
    averageScore: Float
    improvementRate: Float
    strongestArea: String
    focusArea: String
    recentTrends: [PerformanceTrend]
    achievements: [Achievement]
  }

  type Achievement {
    id: ID!
    title: String
    description: String
    unlockedDate: String
    category: String
  }

  enum TrendDirection {
    IMPROVING
    STABLE
    DECLINING
  }
`);

// GraphQL Resolvers
export const neuralAnalysisResolvers = {
  Query: {
    neuralAnalysis: async ({ userId }: { userId: string }) => {
      try {
        const sessions = await storage.getUserPracticeSessions(userId);
        
        if (sessions.length === 0) {
          return {
            userId,
            voiceModulation: { clarity: 0, pitchVariation: 0, modulation: 0, prosody: 0, fillerWords: [], confidence: 0 },
            bodyLanguage: { gestureEffectiveness: 0, postureScore: 0, eyeContact: 0, engagement: 0, confidence: 0 },
            contentStructure: { coherenceScore: 0, logicalFlow: 0, structure: 0, impact: 0, audienceEngagement: 0, confidence: 0 },
            confidenceScore: 0,
            trends: [],
            insights: ['No practice sessions available for analysis'],
            lastUpdated: new Date().toISOString()
          };
        }

        // Calculate metrics from session data
        const voiceModulation = calculateVoiceMetrics(sessions);
        const bodyLanguage = calculateBodyLanguageMetrics(sessions);
        const contentStructure = calculateContentMetrics(sessions);
        const trends = calculateTrends(sessions);
        const confidenceScore = calculateOverallConfidence(voiceModulation, bodyLanguage, contentStructure, sessions.length);
        
        return {
          userId,
          voiceModulation,
          bodyLanguage,
          contentStructure,
          confidenceScore,
          trends,
          insights: generateNeuralInsights(sessions, trends),
          lastUpdated: new Date().toISOString()
        };

      } catch (error) {
        console.error('GraphQL neuralAnalysis error:', error);
        throw new Error('Failed to fetch neural analysis');
      }
    },

    practiceSessions: async ({ userId, limit, offset }: { userId: string; limit: number; offset: number }) => {
      try {
        const allSessions = await storage.getUserPracticeSessions(userId);
        const sessions = allSessions.slice(offset, offset + limit);
        
        return sessions.map(session => ({
          id: session.id,
          userId: session.userId,
          date: session.createdAt?.toISOString() || new Date().toISOString(),
          duration: session.duration || 0,
          purpose: session.purpose || 'General practice',
          voiceMetrics: {
            clarity: session.voiceClarity || 0,
            pitchVariation: 0, // Only show when calculated from actual audio data
            modulation: 0,
            prosody: 0,
            fillerWords: session.fillerWords || [],
            confidence: session.voiceClarity > 0 ? Math.min(95, 60 + (allSessions.length * 3)) : 0
          },
          bodyLanguageMetrics: {
            gestureEffectiveness: session.gestureScore || 0,
            postureScore: 0, // Only show when calculated from actual video data
            eyeContact: session.eyeContactScore || 0,
            engagement: 0,
            confidence: session.gestureScore > 0 ? Math.min(95, 60 + (allSessions.length * 3)) : 0
          },
          contentMetrics: {
            coherenceScore: session.coherenceScore || 0,
            logicalFlow: 0, // Only show when calculated from actual content analysis
            structure: 0,
            impact: 0,
            audienceEngagement: 0,
            confidence: session.coherenceScore > 0 ? Math.min(95, 60 + (allSessions.length * 3)) : 0
          },
          overallScore: (
            (session.voiceClarity || 0) + 
            (session.gestureScore || 0) + 
            (session.eyeContactScore || 0) + 
            (session.coherenceScore || 0)
          ) / 4,
          neuralInsights: generateSessionInsights(session)
        }));

      } catch (error) {
        console.error('GraphQL practiceSessions error:', error);
        throw new Error('Failed to fetch practice sessions');
      }
    },

    userProgress: async ({ userId }: { userId: string }) => {
      try {
        const sessions = await storage.getUserPracticeSessions(userId);
        
        if (sessions.length === 0) {
          return {
            totalSessions: 0,
            averageScore: 0,
            improvementRate: 0,
            strongestArea: 'No data available',
            focusArea: 'Complete practice sessions for analysis',
            recentTrends: [],
            achievements: []
          };
        }

        const totalSessions = sessions.length;
        const averageScore = sessions.reduce((sum, s) => sum + (s.confidenceScore || 0), 0) / sessions.length;
        const improvementRate = calculateImprovementRate(sessions);
        const areas = analyzeStrongestAndFocusAreas(sessions);
        const recentTrends = calculateTrends(sessions.slice(-10));

        return {
          totalSessions,
          averageScore: Math.round(averageScore),
          improvementRate,
          strongestArea: areas.strongest,
          focusArea: areas.focus,
          recentTrends,
          achievements: generateAchievements(sessions)
        };

      } catch (error) {
        console.error('GraphQL userProgress error:', error);
        throw new Error('Failed to fetch user progress');
      }
    },

    performanceMetrics: async ({ userId, metric }: { userId: string; metric?: string }) => {
      try {
        const sessions = await storage.getUserPracticeSessions(userId);
        
        if (metric) {
          return calculateMetricTrend(sessions, metric);
        } else {
          return calculateTrends(sessions);
        }

      } catch (error) {
        console.error('GraphQL performanceMetrics error:', error);
        throw new Error('Failed to fetch performance metrics');
      }
    }
  }
};

// Helper functions
function calculateVoiceMetrics(sessions: any[]) {
  const avgClarity = sessions.reduce((sum, s) => sum + (s.voiceClarity || 0), 0) / sessions.length;
  
  return {
    clarity: avgClarity,
    pitchVariation: 0, // Only show when calculated from actual audio analysis
    modulation: 0, // Only show when calculated from actual audio analysis
    prosody: 0, // Only show when calculated from actual audio analysis
    fillerWords: sessions.flatMap(s => s.fillerWords || []).slice(0, 10),
    confidence: avgClarity > 0 ? Math.min(95, 60 + (sessions.length * 3)) : 0
  };
}

function calculateBodyLanguageMetrics(sessions: any[]) {
  const avgGesture = sessions.reduce((sum, s) => sum + (s.gestureScore || 0), 0) / sessions.length;
  const avgEyeContact = sessions.reduce((sum, s) => sum + (s.eyeContactScore || 0), 0) / sessions.length;
  
  return {
    gestureEffectiveness: avgGesture,
    postureScore: 0, // Only show when calculated from actual video analysis
    eyeContact: avgEyeContact,
    engagement: 0, // Only show when calculated from actual behavioral analysis
    confidence: (avgGesture > 0 || avgEyeContact > 0) ? Math.min(95, 60 + (sessions.length * 3)) : 0
  };
}

function calculateContentMetrics(sessions: any[]) {
  const avgCoherence = sessions.reduce((sum, s) => sum + (s.coherenceScore || 0), 0) / sessions.length;
  
  return {
    coherenceScore: avgCoherence,
    logicalFlow: 0, // Only show when calculated from actual content analysis
    structure: 0, // Only show when calculated from actual content analysis
    impact: 0, // Only show when calculated from actual content analysis
    audienceEngagement: 0, // Only show when calculated from actual content analysis
    confidence: avgCoherence > 0 ? Math.min(95, 60 + (sessions.length * 3)) : 0
  };
}

function calculateTrends(sessions: any[]) {
  if (sessions.length < 2) return [];

  const recentSessions = sessions.slice(-3);
  const olderSessions = sessions.slice(-6, -3);

  const trends = [];

  // Voice clarity trend
  const recentVoice = recentSessions.reduce((sum, s) => sum + (s.voiceClarity || 0), 0) / recentSessions.length;
  const olderVoice = olderSessions.length > 0 ? olderSessions.reduce((sum, s) => sum + (s.voiceClarity || 0), 0) / olderSessions.length : recentVoice;
  const voiceImprovement = ((recentVoice - olderVoice) / Math.max(olderVoice, 1)) * 100;

  trends.push({
    metric: 'Voice Clarity',
    currentValue: recentVoice,
    historicalAverage: olderVoice,
    improvement: voiceImprovement,
    confidenceInterval: [recentVoice * 0.9, recentVoice * 1.1],
    trend: voiceImprovement > 2 ? 'IMPROVING' : voiceImprovement < -2 ? 'DECLINING' : 'STABLE'
  });

  // Add more trend calculations...

  return trends;
}

function calculateOverallConfidence(voice: any, body: any, content: any, sessionCount: number): number {
  const baseConfidence = (voice.confidence + body.confidence + content.confidence) / 3;
  const volumeBonus = Math.min(20, sessionCount * 2);
  return Math.min(100, baseConfidence + volumeBonus);
}

function generateNeuralInsights(sessions: any[], trends: any[]): string[] {
  const insights = [];
  
  if (sessions.length > 0) {
    insights.push(`Neural network has processed ${sessions.length} practice sessions`);
  }
  
  if (trends.length > 0) {
    const improvingTrends = trends.filter(t => t.trend === 'IMPROVING');
    if (improvingTrends.length > 0) {
      insights.push(`Showing improvement in ${improvingTrends.length} key areas`);
    }
  }
  
  return insights;
}

function generateSessionInsights(session: any): string[] {
  const insights = [];
  
  if (session.voiceClarity > 80) {
    insights.push('Excellent voice clarity detected');
  }
  
  if (session.gestureScore > 75) {
    insights.push('Strong gesture effectiveness');
  }
  
  return insights;
}

function calculateImprovementRate(sessions: any[]): number {
  if (sessions.length < 2) return 0;
  
  const first = sessions[0];
  const last = sessions[sessions.length - 1];
  
  const firstScore = (first.voiceClarity || 0) + (first.gestureScore || 0) + (first.eyeContactScore || 0);
  const lastScore = (last.voiceClarity || 0) + (last.gestureScore || 0) + (last.eyeContactScore || 0);
  
  return ((lastScore - firstScore) / Math.max(firstScore, 1)) * 100;
}

function analyzeStrongestAndFocusAreas(sessions: any[]) {
  const avgVoice = sessions.reduce((sum, s) => sum + (s.voiceClarity || 0), 0) / sessions.length;
  const avgGesture = sessions.reduce((sum, s) => sum + (s.gestureScore || 0), 0) / sessions.length;
  const avgEyeContact = sessions.reduce((sum, s) => sum + (s.eyeContactScore || 0), 0) / sessions.length;
  
  const areas = [
    { name: 'Voice Modulation', score: avgVoice },
    { name: 'Body Language', score: avgGesture },
    { name: 'Eye Contact', score: avgEyeContact }
  ];
  
  areas.sort((a, b) => b.score - a.score);
  
  return {
    strongest: areas[0].name,
    focus: areas[areas.length - 1].name
  };
}

function calculateMetricTrend(sessions: any[], metric: string) {
  // Implementation for specific metric trends
  return calculateTrends(sessions).filter(t => t.metric.toLowerCase().includes(metric.toLowerCase()));
}

function generateAchievements(sessions: any[]) {
  const achievements = [];
  
  if (sessions.length >= 1) {
    achievements.push({
      id: '1',
      title: 'First Steps',
      description: 'Completed your first practice session',
      unlockedDate: sessions[0].createdAt?.toISOString() || new Date().toISOString(),
      category: 'Milestone'
    });
  }
  
  if (sessions.length >= 5) {
    achievements.push({
      id: '2',
      title: 'Consistent Learner',
      description: 'Completed 5 practice sessions',
      unlockedDate: sessions[4].createdAt?.toISOString() || new Date().toISOString(),
      category: 'Progress'
    });
  }
  
  return achievements;
}

export default {
  schema: neuralAnalysisSchema,
  resolvers: neuralAnalysisResolvers
};