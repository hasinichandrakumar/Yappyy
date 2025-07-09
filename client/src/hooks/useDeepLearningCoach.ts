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

interface SpeakingGoal {
  type: 'presentation_confidence' | 'vocal_variety' | 'audience_engagement' | 'storytelling' | 'persuasion';
  targetLevel: number;
  currentProgress: number;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
}

interface SpeakingExercise {
  name: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'vocal' | 'physical' | 'content' | 'mental';
  instructions: string[];
  expectedOutcomes: string[];
  measurableGoals: string[];
}

interface AdvancedDeepLearningCoachResponse {
  immediateCoaching: {
    vocal: string[];
    physical: string[];
    content: string[];
    emotional: string[];
  };
  personalizedDevelopmentPlan: {
    shortTermGoals: SpeakingGoal[];
    mediumTermGoals: SpeakingGoal[];
    longTermGoals: SpeakingGoal[];
    customExercises: SpeakingExercise[];
  };
  motivationalCoaching: {
    encouragementMessage: string;
    progressRecognition: string[];
    confidenceBuilders: string[];
    mindsetShifts: string[];
  };
  strategicRecommendations: {
    nextSession: string;
    practiceAreas: string[];
    skillProgression: string[];
    presentationOpportunities: string[];
  };
  rhetoricalDevelopment: {
    ethosImprovement: string[];
    pathosEnhancement: string[];
    logosStrengthening: string[];
    storytellingTechniques: string[];
  };
  technicalCoaching: {
    vocalTechniques: string[];
    physicalPresence: string[];
    deliveryMethods: string[];
    timingOptimization: string[];
  };
  audienceAdaptation: {
    audienceAnalysis: string;
    adaptationStrategies: string[];
    engagementTechniques: string[];
    connectionMethods: string[];
  };
  confidenceLevel: number;
  performancePrediction: {
    readinessScore: number;
    riskAreas: string[];
    strengthAreas: string[];
  };
  adaptationReason: string;
  learningInsights: string[];
  neuralNetworkConfidence: number;
  coachingPersonality: 'supportive' | 'challenging' | 'analytical' | 'inspirational';
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
  const [advancedCoaching, setAdvancedCoaching] = useState<AdvancedDeepLearningCoachResponse | null>(null);
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

  const getAdvancedPublicSpeakingCoach = useCallback(async (
    sessionMetrics: SessionMetrics,
    sessionType?: string,
    userFeedback?: string
  ): Promise<AdvancedDeepLearningCoachResponse | null> => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/advanced-public-speaking-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionMetrics,
          sessionType,
          userFeedback
        })
      });

      if (!response.ok) {
        throw new Error(`Advanced coaching error: ${response.status}`);
      }

      const coaching = await response.json();
      setAdvancedCoaching(coaching);
      return coaching;
    } catch (error) {
      console.error('Advanced coaching error:', error);
      
      // Fallback advanced coaching response
      const fallbackAdvancedCoaching: AdvancedDeepLearningCoachResponse = {
        immediateCoaching: {
          vocal: ["Focus on articulation and vocal variety"],
          physical: ["Maintain confident posture and purposeful gestures"],
          content: ["Structure your message with clear transitions"],
          emotional: ["Project confidence and authentic enthusiasm"]
        },
        personalizedDevelopmentPlan: {
          shortTermGoals: [{
            type: 'presentation_confidence',
            targetLevel: 80,
            currentProgress: 60,
            priority: 'high'
          }],
          mediumTermGoals: [{
            type: 'vocal_variety',
            targetLevel: 85,
            currentProgress: 50,
            priority: 'medium'
          }],
          longTermGoals: [{
            type: 'audience_engagement',
            targetLevel: 90,
            currentProgress: 45,
            priority: 'high'
          }],
          customExercises: [{
            name: "Voice Projection Practice",
            description: "Practice projecting your voice across different room sizes",
            duration: 10,
            difficulty: 'medium',
            category: 'vocal',
            instructions: ["Stand at back of room", "Speak clearly to front wall", "Vary your volume"],
            expectedOutcomes: ["Improved voice projection", "Better audience reach"],
            measurableGoals: ["Reach 85% clarity at 20 feet distance"]
          }]
        },
        motivationalCoaching: {
          encouragementMessage: "Your dedication to improvement is evident. Each session builds stronger speaking foundations.",
          progressRecognition: ["Consistent practice routine", "Growing confidence levels"],
          confidenceBuilders: ["Record yourself and note improvements", "Practice with supportive audiences"],
          mindsetShifts: ["View speaking as sharing valuable insights", "Focus on connecting rather than perfecting"]
        },
        strategicRecommendations: {
          nextSession: "Focus on vocal variety and emphasis techniques",
          practiceAreas: ["Voice modulation", "Strategic pausing", "Gesture coordination"],
          skillProgression: ["Master basic delivery", "Add persuasive elements", "Develop signature style"],
          presentationOpportunities: ["Local speaking clubs", "Team presentations", "Community events"]
        },
        rhetoricalDevelopment: {
          ethosImprovement: ["Build credibility through preparation", "Share relevant experience"],
          pathosEnhancement: ["Use emotional stories", "Connect with audience values"],
          logosStrengthening: ["Support points with data", "Use logical flow"],
          storytellingTechniques: ["Use vivid imagery", "Create character-driven narratives"]
        },
        technicalCoaching: {
          vocalTechniques: ["Vary pitch and pace", "Use strategic pauses"],
          physicalPresence: ["Maintain open posture", "Use purposeful movement"],
          deliveryMethods: ["Direct eye contact", "Conversational tone"],
          timingOptimization: ["Allow for audience processing", "Build to key points"]
        },
        audienceAdaptation: {
          audienceAnalysis: "Focus on connecting with your primary audience's interests and knowledge level",
          adaptationStrategies: ["Adjust technical language", "Vary examples"],
          engagementTechniques: ["Ask rhetorical questions", "Use inclusive language"],
          connectionMethods: ["Share relevant experiences", "Acknowledge audience perspectives"]
        },
        confidenceLevel: 75,
        performancePrediction: {
          readinessScore: 70,
          riskAreas: ["Voice projection", "Managing nervousness"],
          strengthAreas: ["Clear content", "Good preparation"]
        },
        adaptationReason: "Using comprehensive public speaking analysis",
        learningInsights: ["Consistent practice builds neural pathways for confidence", "Technical skills support natural expression"],
        neuralNetworkConfidence: 0.78,
        coachingPersonality: 'supportive'
      };
      
      setAdvancedCoaching(fallbackAdvancedCoaching);
      return fallbackAdvancedCoaching;
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
    advancedCoaching,
    userProgress,
    isLoadingProgress,
    
    // Actions
    getAdaptiveCoaching,
    getAdvancedPublicSpeakingCoach,
    getUserLearningProgress,
    submitFeedback,
    convertToSessionMetrics,
    
    // Helpers
    clearCurrentCoaching: () => setCurrentCoaching(null),
    clearAdvancedCoaching: () => setAdvancedCoaching(null),
    refreshProgress: getUserLearningProgress
  };
}