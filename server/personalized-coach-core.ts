// Core Personalized AI Coach Service
import { storage } from './storage';
import type { PracticeSession } from '@shared/schema';

interface PersonalizedInsight {
  type: 'pace' | 'confidence' | 'filler' | 'progress' | 'strength';
  message: string;
  actionable: boolean;
  personalContext: string;
}

interface CoachingRecommendation {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'week' | 'month';
  description: string;
  specificTip: string;
}

export class PersonalizedCoachCore {
  
  /**
   * Generate personalized coaching insights based on user's unique patterns
   */
  async generatePersonalizedInsights(userId: string, currentSession?: PracticeSession): Promise<PersonalizedInsight[]> {
    try {
      const userSessions = await storage.getUserPracticeSessions(userId, 15);
      const userBaseline = this.calculateUserBaseline(userSessions);
      
      const insights: PersonalizedInsight[] = [];

      if (currentSession) {
        // Compare current session to user's personal baseline
        insights.push(...this.analyzeAgainstPersonalBaseline(currentSession, userBaseline, userSessions));
      }

      // Add historical pattern insights
      insights.push(...this.generateHistoricalPatternInsights(userSessions, userBaseline));

      return insights.slice(0, 5); // Return top 5 most relevant
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      return [];
    }
  }

  /**
   * Generate practice recommendations tailored to user's specific needs
   */
  async generatePersonalizedRecommendations(userId: string): Promise<CoachingRecommendation[]> {
    try {
      const userSessions = await storage.getUserPracticeSessions(userId, 20);
      const userBaseline = this.calculateUserBaseline(userSessions);
      
      const recommendations: CoachingRecommendation[] = [];

      // Analyze areas needing improvement
      const weakAreas = this.identifyWeakAreas(userSessions, userBaseline);
      const strongAreas = this.identifyStrongAreas(userSessions, userBaseline);

      // Generate targeted recommendations
      for (const area of weakAreas) {
        recommendations.push(this.createPersonalizedRecommendation(area, userBaseline, 'improvement'));
      }

      // Leverage strengths for growth
      for (const area of strongAreas.slice(0, 2)) {
        recommendations.push(this.createPersonalizedRecommendation(area, userBaseline, 'leverage'));
      }

      return recommendations.sort((a, b) => this.priorityScore(a.priority) - this.priorityScore(b.priority));
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  /**
   * Generate personalized practice exercises
   */
  async generatePersonalizedExercises(userId: string): Promise<any[]> {
    try {
      const userSessions = await storage.getUserPracticeSessions(userId, 10);
      const userBaseline = this.calculateUserBaseline(userSessions);
      
      const exercises = [];

      // Pace exercise based on user's natural rhythm
      if (userBaseline.naturalPace) {
        exercises.push({
          id: 'personal_pace_control',
          title: 'Your Natural Pace Training',
          description: `Practice speaking at your optimal ${Math.round(userBaseline.naturalPace)} WPM`,
          instructions: [
            `Your natural speaking pace is ${Math.round(userBaseline.naturalPace)} words per minute`,
            'Practice reading a 150-word passage in exactly 60 seconds',
            'Focus on maintaining this pace during conversations',
            'This pace feels natural because it matches your thinking speed'
          ],
          duration: 10,
          difficulty: 2
        });
      }

      // Confidence exercise based on user's confidence patterns
      if (userBaseline.confidenceRange) {
        const [minConf, maxConf] = userBaseline.confidenceRange;
        exercises.push({
          id: 'personal_confidence_building',
          title: 'Confidence Range Expansion',
          description: `Build on your ${Math.round(minConf)}-${Math.round(maxConf)}% confidence range`,
          instructions: [
            `Your confidence typically ranges from ${Math.round(minConf)}% to ${Math.round(maxConf)}%`,
            'Practice topics that naturally boost you to your higher range',
            'Gradually introduce more challenging topics while maintaining high confidence',
            'Use breathing techniques when you feel confidence dropping below your baseline'
          ],
          duration: 15,
          difficulty: 3
        });
      }

      // Filler word exercise based on user's specific patterns
      const fillerPatterns = this.analyzeFillerWords(userSessions);
      if (fillerPatterns.length > 0) {
        const primaryFiller = fillerPatterns[0];
        exercises.push({
          id: 'personal_filler_reduction',
          title: `"${primaryFiller.word}" Pattern Breaking`,
          description: `Target your specific "${primaryFiller.word}" usage pattern`,
          instructions: [
            `You use "${primaryFiller.word}" an average of ${primaryFiller.frequency} times per session`,
            'Practice the "strategic pause" technique when you feel the urge to use this filler',
            'Count to 2 silently instead of saying the filler word',
            'Your audience will perceive these pauses as thoughtful, not awkward'
          ],
          duration: 12,
          difficulty: 3
        });
      }

      return exercises;
    } catch (error) {
      console.error('Error generating exercises:', error);
      return [];
    }
  }

  private calculateUserBaseline(sessions: PracticeSession[]) {
    if (sessions.length === 0) return {};

    const validWPM = sessions.map(s => s.averageWPM).filter(wpm => wpm && wpm > 50 && wpm < 300);
    const validConfidence = sessions.map(s => s.confidenceScore).filter(c => c && c > 0);
    const validClarity = sessions.map(s => s.voiceClarity).filter(c => c && c > 0);

    return {
      naturalPace: validWPM.length > 0 ? validWPM.reduce((sum, wpm) => sum + wpm, 0) / validWPM.length : 150,
      confidenceRange: validConfidence.length > 0 ? [Math.min(...validConfidence), Math.max(...validConfidence)] : [60, 85],
      clarityAverage: validClarity.length > 0 ? validClarity.reduce((sum, c) => sum + c, 0) / validClarity.length : 0.7,
      sessionCount: sessions.length,
      avgDuration: sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length,
      recentTrend: this.calculateRecentTrend(sessions)
    };
  }

  private analyzeAgainstPersonalBaseline(
    currentSession: PracticeSession, 
    baseline: any, 
    historicalSessions: PracticeSession[]
  ): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = [];

    // Pace analysis
    if (currentSession.averageWPM && baseline.naturalPace) {
      const paceDeviation = currentSession.averageWPM - baseline.naturalPace;
      if (Math.abs(paceDeviation) > 20) {
        insights.push({
          type: 'pace',
          message: paceDeviation > 0 
            ? `You're speaking ${Math.round(paceDeviation)} WPM faster than your natural ${Math.round(baseline.naturalPace)} WPM pace. This energy is great for engaging content!`
            : `You're speaking ${Math.round(Math.abs(paceDeviation))} WPM slower than your natural ${Math.round(baseline.naturalPace)} WPM pace. This works well for complex or important topics.`,
          actionable: true,
          personalContext: `Your natural speaking rhythm is ${Math.round(baseline.naturalPace)} WPM based on your ${baseline.sessionCount} practice sessions.`
        });
      }
    }

    // Confidence analysis
    if (currentSession.confidenceScore && baseline.confidenceRange) {
      const [minConf, maxConf] = baseline.confidenceRange;
      const confPercentile = ((currentSession.confidenceScore - minConf) / (maxConf - minConf)) * 100;
      
      if (confPercentile > 80) {
        insights.push({
          type: 'confidence',
          message: `Your confidence is in the top 20% of your personal range at ${Math.round(currentSession.confidenceScore)}%! This vocal certainty really comes through.`,
          actionable: false,
          personalContext: `Your confidence typically ranges from ${Math.round(minConf)}% to ${Math.round(maxConf)}% based on your speaking history.`
        });
      } else if (confPercentile < 20) {
        insights.push({
          type: 'confidence',
          message: `Your confidence at ${Math.round(currentSession.confidenceScore)}% is lower than usual for you. Consider starting with topics that naturally boost your confidence.`,
          actionable: true,
          personalContext: `You typically perform best in the ${Math.round(maxConf * 0.8)}-${Math.round(maxConf)}% confidence range.`
        });
      }
    }

    return insights;
  }

  private generateHistoricalPatternInsights(sessions: PracticeSession[], baseline: any): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = [];

    if (sessions.length >= 5) {
      // Progress insight
      const recentAvgScore = this.getRecentAverage(sessions.slice(0, 5), 'overallScore');
      const olderAvgScore = this.getRecentAverage(sessions.slice(5, 10), 'overallScore');
      
      if (recentAvgScore > olderAvgScore + 5) {
        insights.push({
          type: 'progress',
          message: `You've improved your overall score by ${Math.round(recentAvgScore - olderAvgScore)} points in recent sessions! Your consistent practice is paying off.`,
          actionable: false,
          personalContext: `Based on analysis of your ${sessions.length} practice sessions, you show clear upward trajectory.`
        });
      }

      // Strength identification
      const strongestMetric = this.identifyStrongestMetric(sessions);
      if (strongestMetric) {
        insights.push({
          type: 'strength',
          message: `Your ${strongestMetric.name} consistently scores ${Math.round(strongestMetric.average)}%. This is a real strength you can leverage!`,
          actionable: true,
          personalContext: `${strongestMetric.name} has been your most consistent strength across ${sessions.length} sessions.`
        });
      }
    }

    return insights;
  }

  private identifyWeakAreas(sessions: PracticeSession[], baseline: any): string[] {
    const areas = [];
    const recentSessions = sessions.slice(0, 5);

    const avgConfidence = this.getRecentAverage(recentSessions, 'confidenceScore');
    const avgClarity = this.getRecentAverage(recentSessions, 'voiceClarity');
    const avgFillers = this.getRecentAverage(recentSessions, 'fillerWords');

    if (avgConfidence < 70) areas.push('confidence');
    if (avgClarity < 0.7) areas.push('voice_clarity');
    if (avgFillers > 5) areas.push('filler_words');

    return areas;
  }

  private identifyStrongAreas(sessions: PracticeSession[], baseline: any): string[] {
    const areas = [];
    const recentSessions = sessions.slice(0, 5);

    const avgConfidence = this.getRecentAverage(recentSessions, 'confidenceScore');
    const avgClarity = this.getRecentAverage(recentSessions, 'voiceClarity');
    const avgPace = this.getRecentAverage(recentSessions, 'averageWPM');

    if (avgConfidence > 80) areas.push('confidence');
    if (avgClarity > 0.8) areas.push('voice_clarity');
    if (avgPace >= 120 && avgPace <= 180) areas.push('speaking_pace');

    return areas;
  }

  private createPersonalizedRecommendation(
    area: string, 
    baseline: any, 
    type: 'improvement' | 'leverage'
  ): CoachingRecommendation {
    const recommendations = {
      confidence: {
        improvement: {
          skill: 'Confidence Building',
          priority: 'high' as const,
          timeframe: 'week' as const,
          description: 'Build vocal confidence through targeted practice',
          specificTip: `Practice with topics you're passionate about first, then gradually expand to new areas. Your baseline confidence range suggests you perform best when you feel prepared.`
        },
        leverage: {
          skill: 'Confidence Leverage',
          priority: 'medium' as const,
          timeframe: 'immediate' as const,
          description: 'Use your natural confidence to tackle challenging topics',
          specificTip: 'Your strong confidence can be your foundation for more advanced speaking challenges.'
        }
      },
      voice_clarity: {
        improvement: {
          skill: 'Voice Clarity Enhancement',
          priority: 'high' as const,
          timeframe: 'week' as const,
          description: 'Improve voice projection and articulation',
          specificTip: 'Focus on breathing exercises and articulation drills. Practice speaking from your diaphragm.'
        },
        leverage: {
          skill: 'Clarity Strength',
          priority: 'low' as const,
          timeframe: 'month' as const,
          description: 'Leverage your clear voice for leadership speaking',
          specificTip: 'Your natural clarity makes you perfect for instructional or explanatory speaking roles.'
        }
      },
      filler_words: {
        improvement: {
          skill: 'Filler Word Reduction',
          priority: 'medium' as const,
          timeframe: 'week' as const,
          description: 'Replace filler words with strategic pauses',
          specificTip: 'Practice the "2-second rule" - count to 2 instead of using filler words.'
        },
        leverage: {
          skill: 'Fluency Mastery',
          priority: 'low' as const,
          timeframe: 'month' as const,
          description: 'Build on your natural fluency',
          specificTip: 'Your minimal filler word usage shows natural fluency - perfect for formal presentations.'
        }
      }
    };

    const areaKey = area as keyof typeof recommendations;
    return recommendations[areaKey]?.[type] || recommendations.confidence.improvement;
  }

  private analyzeFillerWords(sessions: PracticeSession[]) {
    const patterns = new Map();
    
    sessions.forEach(session => {
      if (session.fillerWordsUh) {
        patterns.set('um/uh', (patterns.get('um/uh') || 0) + session.fillerWordsUh);
      }
      if (session.fillerWordsLike) {
        patterns.set('like', (patterns.get('like') || 0) + session.fillerWordsLike);
      }
      if (session.fillerWordsSo) {
        patterns.set('so', (patterns.get('so') || 0) + session.fillerWordsSo);
      }
    });

    return Array.from(patterns.entries()).map(([word, count]) => ({
      word,
      frequency: count / sessions.length
    })).sort((a, b) => b.frequency - a.frequency);
  }

  private getRecentAverage(sessions: PracticeSession[], field: keyof PracticeSession): number {
    const values = sessions.map(s => s[field] as number).filter(v => v && v > 0);
    return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  }

  private calculateRecentTrend(sessions: PracticeSession[]): 'improving' | 'stable' | 'declining' {
    if (sessions.length < 4) return 'stable';
    
    const recent = sessions.slice(0, 2);
    const older = sessions.slice(2, 4);
    
    const recentAvg = this.getRecentAverage(recent, 'overallScore');
    const olderAvg = this.getRecentAverage(older, 'overallScore');
    
    if (recentAvg > olderAvg + 3) return 'improving';
    if (recentAvg < olderAvg - 3) return 'declining';
    return 'stable';
  }

  private identifyStrongestMetric(sessions: PracticeSession[]) {
    const metrics = [
      { name: 'confidence', field: 'confidenceScore' as keyof PracticeSession },
      { name: 'voice clarity', field: 'voiceClarity' as keyof PracticeSession },
      { name: 'pace control', field: 'paceScore' as keyof PracticeSession }
    ];

    const averages = metrics.map(metric => ({
      ...metric,
      average: this.getRecentAverage(sessions, metric.field)
    })).filter(m => m.average > 0);

    return averages.sort((a, b) => b.average - a.average)[0];
  }

  private priorityScore(priority: string): number {
    const scores = { high: 1, medium: 2, low: 3 };
    return scores[priority as keyof typeof scores] || 2;
  }
}

export const personalizedCoachCore = new PersonalizedCoachCore();


