import { useState, useCallback } from 'react';

interface SessionMetrics {
  sessionId: string;
  timestamp: number;
  voiceClarity: number;
  confidence: number;
  eyeContact: number;
  pacing: number;
  engagement: number;
  contentQuality: number;
  improvementAreas: string[];
  userResponse?: 'helpful' | 'neutral' | 'unhelpful';
  coachingStyle?: string;
}

interface DeepLearningCoachResponse {
  immediateCoaching: string[];
  personalizedTips: string[];
  motivationalMessage: string;
  nextStepRecommendation: string;
  confidenceLevel: number;
  adaptationReason: string;
  learningInsights: string[];
}

interface UserLearningProgress {
  currentLevel: number;
  strengths: string[];
  weaknesses: string[];
  learningVelocity: number;
  nextMilestone: string;
  modelConfidence: number;
}

export function useDeepLearningCoach(userId: string = 'demo-user-123') {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentCoaching, setCurrentCoaching] = useState<DeepLearningCoachResponse | null>(null);
  const [userProgress, setUserProgress] = useState<UserLearningProgress | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  const getAdaptiveCoaching = useCallback(async (
    sessionMetrics: SessionMetrics,
    userFeedback?: string
  ): Promise<DeepLearningCoachResponse | null> => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/deep-learning-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionMetrics,
          userFeedback
        })
      });

      if (!response.ok) {
        throw new Error(`Deep learning coach error: ${response.status}`);
      }

      const coaching = await response.json();
      setCurrentCoaching(coaching);
      return coaching;
    } catch (error) {
      console.error('Deep learning coach error:', error);
      
      // Fallback coaching response
      const fallbackCoaching: DeepLearningCoachResponse = {
        immediateCoaching: [
          "Focus on clear articulation and steady pacing",
          "Maintain eye contact with your audience",
          "Use purposeful gestures to emphasize points"
        ],
        personalizedTips: [
          "Practice daily with recording playback",
          "Work on your strongest areas first to build confidence",
          "Set specific, measurable goals for each session"
        ],
        motivationalMessage: "Every expert was once a beginner. Your consistent practice is building real skills!",
        nextStepRecommendation: "Continue with regular practice sessions focusing on your identified improvement areas",
        confidenceLevel: 0.75,
        adaptationReason: "Using foundational coaching approach",
        learningInsights: [
          "Consistency in practice leads to measurable improvement",
          "Focus on one skill area at a time for faster progress"
        ]
      };
      
      setCurrentCoaching(fallbackCoaching);
      return fallbackCoaching;
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId]);

  const getUserLearningProgress = useCallback(async (): Promise<UserLearningProgress | null> => {
    setIsLoadingProgress(true);
    try {
      const response = await fetch(`/api/user-learning-progress/${userId}`);

      if (!response.ok) {
        throw new Error(`Progress fetch error: ${response.status}`);
      }

      const progress = await response.json();
      setUserProgress(progress);
      return progress;
    } catch (error) {
      console.error('User progress error:', error);
      
      // Fallback progress data
      const fallbackProgress: UserLearningProgress = {
        currentLevel: 1,
        strengths: ['clear voice', 'good pacing'],
        weaknesses: ['eye contact', 'confidence'],
        learningVelocity: 0.5,
        nextMilestone: "Complete 5 practice sessions",
        modelConfidence: 0.6
      };
      
      setUserProgress(fallbackProgress);
      return fallbackProgress;
    } finally {
      setIsLoadingProgress(false);
    }
  }, [userId]);

  const submitFeedback = useCallback(async (
    sessionMetrics: SessionMetrics,
    feedback: string
  ): Promise<void> => {
    try {
      await getAdaptiveCoaching(sessionMetrics, feedback);
    } catch (error) {
      console.error('Feedback submission error:', error);
    }
  }, [getAdaptiveCoaching]);

  const convertToSessionMetrics = useCallback((
    sessionId: string,
    practiceMetrics: any
  ): SessionMetrics => {
    return {
      sessionId,
      timestamp: Date.now(),
      voiceClarity: practiceMetrics.voice?.clarity || 75,
      confidence: practiceMetrics.emotion?.confidence || 70,
      eyeContact: practiceMetrics.bodyLanguage?.eyeContactScore || 65,
      pacing: practiceMetrics.voice?.pace || 75,
      engagement: practiceMetrics.emotion?.engagement || 70,
      contentQuality: practiceMetrics.content?.coherenceRating || 75,
      improvementAreas: practiceMetrics.insights?.improvementAreas || []
    };
  }, []);

  return {
    // State
    isAnalyzing,
    currentCoaching,
    userProgress,
    isLoadingProgress,
    
    // Actions
    getAdaptiveCoaching,
    getUserLearningProgress,
    submitFeedback,
    convertToSessionMetrics,
    
    // Helpers
    clearCurrentCoaching: () => setCurrentCoaching(null),
    refreshProgress: getUserLearningProgress
  };
}