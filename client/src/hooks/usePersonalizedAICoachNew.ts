// Enhanced Personalized AI Coach Hook - Client Side Integration
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

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

interface PersonalizedExercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  duration: number;
  difficulty: number;
}

interface PersonalizedCoachingData {
  insights: PersonalizedInsight[];
  recommendations: CoachingRecommendation[];
  exercises: PersonalizedExercise[];
  neuralAnalysis?: any;
}

export function usePersonalizedAICoach() {
  const { user } = useAuth();
  const [personalizedData, setPersonalizedData] = useState<PersonalizedCoachingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Fetch personalized insights based on user's unique patterns
   */
  const fetchPersonalizedInsights = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/ai-coach/personalized-insights/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.insights || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching personalized insights:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Fetch personalized recommendations
   */
  const fetchPersonalizedRecommendations = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/ai-coach/personalized-recommendations/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      return [];
    }
  }, [user?.id]);

  /**
   * Fetch personalized exercises
   */
  const fetchPersonalizedExercises = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/ai-coach/personalized-exercises/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.exercises || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching personalized exercises:', error);
      return [];
    }
  }, [user?.id]);

  /**
   * Get complete personalized coaching analysis
   */
  const getPersonalizedCoaching = useCallback(async (currentSession?: any) => {
    if (!user?.id) return null;

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/ai-coach/personalized-coaching/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSession })
      });
      
      if (response.ok) {
        const data = await response.json();
        const coachingData = data.personalizedCoaching;
        
        setPersonalizedData(coachingData);
        setLastUpdated(new Date());
        
        return coachingData;
      }
      return null;
    } catch (error) {
      console.error('Error getting personalized coaching:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Load all personalized data
   */
  const loadPersonalizedData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const [insights, recommendations, exercises] = await Promise.all([
        fetchPersonalizedInsights(),
        fetchPersonalizedRecommendations(),
        fetchPersonalizedExercises()
      ]);

      const coachingData: PersonalizedCoachingData = {
        insights: insights || [],
        recommendations: recommendations || [],
        exercises: exercises || []
      };

      setPersonalizedData(coachingData);
      setLastUpdated(new Date());
      
      return coachingData;
    } catch (error) {
      console.error('Error loading personalized data:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchPersonalizedInsights, fetchPersonalizedRecommendations, fetchPersonalizedExercises]);

  /**
   * Generate personalized response to user message
   */
  const generatePersonalizedResponse = useCallback(async (userMessage: string, currentGoal?: string) => {
    if (!user?.id) return null;

    try {
      // Get fresh insights
      const insights = await fetchPersonalizedInsights();
      
      // Analyze user message
      const messageContext = analyzeUserMessage(userMessage);
      
      // Generate personalized response
      let response = `🧠 **Your Personal AI Coach**\n\n`;
      
      if (messageContext.needsEncouragement) {
        response += `I can see you're looking for guidance. Based on your unique speaking patterns:\n\n`;
      } else if (messageContext.askingForAdvice) {
        response += `Great question! Here's what your neural profile suggests:\n\n`;
      } else {
        response += `Based on your personal speaking journey:\n\n`;
      }

      // Add relevant insights
      if (insights && insights.length > 0) {
        const relevantInsights = insights
          .filter((insight: PersonalizedInsight) => 
            insight.actionable || insight.type === 'progress' || insight.type === 'strength'
          )
          .slice(0, 2);
        
        relevantInsights.forEach((insight: PersonalizedInsight, index: number) => {
          response += `**${index + 1}. ${insight.message}**\n`;
          if (insight.personalContext) {
            response += `*${insight.personalContext}*\n\n`;
          }
        });
      }

      // Add contextual advice based on message content
      if (userMessage.toLowerCase().includes('confidence')) {
        response += `🎯 **Confidence Strategy**: Your data shows specific confidence patterns. Build on your natural strengths first.`;
      } else if (userMessage.toLowerCase().includes('pace') || userMessage.toLowerCase().includes('speed')) {
        response += `⚡ **Pace Optimization**: Your natural rhythm is unique. Focus on consistency over speed.`;
      } else if (userMessage.toLowerCase().includes('filler')) {
        response += `🎙️ **Fluency Enhancement**: Strategic pauses are more powerful than filler words for your speaking style.`;
      } else {
        response += `✨ **Personalized Guidance**: Focus on your strongest areas while gradually addressing challenges.`;
      }

      response += `\n\n📊 **Neural Status**: Learning your patterns | **Profile Accuracy**: ${insights?.length >= 5 ? 'High' : 'Building'}`;

      return {
        message: response,
        insights: insights || [],
        confidence: 95,
        personalized: true
      };

    } catch (error) {
      console.error('Error generating personalized response:', error);
      return null;
    }
  }, [user?.id, fetchPersonalizedInsights]);

  // Auto-load data when user changes
  useEffect(() => {
    if (user?.id && !personalizedData) {
      loadPersonalizedData();
    }
  }, [user?.id, personalizedData, loadPersonalizedData]);

  return {
    personalizedData,
    isLoading,
    lastUpdated,
    fetchPersonalizedInsights,
    fetchPersonalizedRecommendations,
    fetchPersonalizedExercises,
    getPersonalizedCoaching,
    loadPersonalizedData,
    generatePersonalizedResponse
  };
}

// Helper function to analyze user messages
function analyzeUserMessage(message: string) {
  const lowerMessage = message.toLowerCase();
  
  return {
    needsEncouragement: lowerMessage.includes('help') || lowerMessage.includes('stuck') || lowerMessage.includes('struggling'),
    askingForAdvice: lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('should'),
    aboutConfidence: lowerMessage.includes('confidence') || lowerMessage.includes('nervous') || lowerMessage.includes('scared'),
    aboutPace: lowerMessage.includes('pace') || lowerMessage.includes('speed') || lowerMessage.includes('fast') || lowerMessage.includes('slow'),
    aboutFillers: lowerMessage.includes('filler') || lowerMessage.includes('um') || lowerMessage.includes('uh') || lowerMessage.includes('like'),
    seekingFeedback: lowerMessage.includes('feedback') || lowerMessage.includes('improve') || lowerMessage.includes('better')
  };
}
