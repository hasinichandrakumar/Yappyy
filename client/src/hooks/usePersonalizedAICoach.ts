import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createUserEmbedding } from '../utils/embeddingUtils';

interface CoachingMetrics {
  wpm: number[];
  eyeContact: number[];
  confidence: number[];
  fillerWords: { word: string; count: number }[];
  posture: number[];
  voiceModulation: number[];
  speakingPatterns: {
    pauseFrequency: number;
    sentenceLength: number;
    toneVariation: number;
  };
}

interface SessionData {
  id: string;
  date: string;
  metrics: CoachingMetrics;
  transcript: string;
  duration: number;
}

interface CoachingFeedback {
  strengths: string[];
  improvements: string[];
  personalizedTips: string[];
  longTermGoals: string[];
  prioritizedFocus: string;
  adaptiveExercises: {
    type: string;
    description: string;
    difficulty: number;
    targetMetric: string;
  }[];
}

interface ProgressTrend {
  metric: string;
  trend: 'improving' | 'declining' | 'stable';
  percentageChange: number;
  consistencyScore: number;
}

export function usePersonalizedAICoach(userId: string) {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<CoachingFeedback | null>(null);
  const [progressTrends, setProgressTrends] = useState<ProgressTrend[]>([]);

  // Initialize or load the personalized model for the user
  useEffect(() => {
    const initializeCoach = async () => {
      try {
        // Try to load existing personalized model
        const savedModel = await tf.loadLayersModel(`indexeddb://user_${userId}_model`);
        if (savedModel) {
          setModel(savedModel);
        } else {
          // Create new personalized model if none exists
          await createPersonalizedModel(userId);
        }

        // Load user profile and session history
        await Promise.all([
          loadUserProfile(userId),
          loadSessionHistory(userId)
        ]);

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing AI coach:', error);
      }
    };

    initializeCoach();
  }, [userId]);

  // Create new personalized model for user
  const createPersonalizedModel = async (userId: string) => {
    // Base model architecture
    const newModel = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [384], // Embedding dimension
          units: 256,
          activation: 'relu'
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        // Multiple output heads for different aspects of feedback
        tf.layers.dense({ units: 16, activation: 'softmax', name: 'feedback_type' }),
        tf.layers.dense({ units: 8, activation: 'sigmoid', name: 'improvement_priority' }),
        tf.layers.dense({ units: 4, activation: 'tanh', name: 'learning_rate' })
      ]
    });

    // Compile model with custom loss functions
    newModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: {
        feedback_type: 'categoricalCrossentropy',
        improvement_priority: 'binaryCrossentropy',
        learning_rate: 'meanSquaredError'
      },
      metrics: ['accuracy']
    });

    setModel(newModel);
    await newModel.save(`indexeddb://user_${userId}_model`);
  };

  // Load user profile including preferences and learning style
  const loadUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`);
      const profile = await response.json();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Load historical session data
  const loadSessionHistory = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/sessions`);
      const history = await response.json();
      setSessionHistory(history);
      analyzeProgressTrends(history);
    } catch (error) {
      console.error('Error loading session history:', error);
    }
  };

  // Analyze user's progress trends
  const analyzeProgressTrends = (sessions: SessionData[]) => {
    if (sessions.length < 2) return;

    const trends: ProgressTrend[] = [];
    const metrics = ['wpm', 'eyeContact', 'confidence', 'fillerWords'];

    metrics.forEach(metric => {
      const values = sessions.map(s => getMetricValue(s.metrics, metric));
      const trend = calculateTrend(values);
      const percentageChange = calculatePercentageChange(values);
      const consistencyScore = calculateConsistencyScore(values);

      trends.push({
        metric,
        trend,
        percentageChange,
        consistencyScore
      });
    });

    setProgressTrends(trends);
  };

  // Generate personalized feedback based on latest session
  const generateFeedback = useCallback(async (sessionData: SessionData) => {
    if (!model || !userProfile || sessionHistory.length === 0) return;

    try {
      // Create session embedding
      const sessionEmbedding = await createSessionEmbedding(sessionData);
      
      // Get user context embedding
      const userEmbedding = await createUserEmbedding(userProfile, sessionHistory);
      
      // Combine embeddings
      const combinedInput = tf.concat([sessionEmbedding, userEmbedding]);
      
      // Generate predictions
      const predictions = await model.predict(combinedInput) as tf.Tensor;
      
      // Process predictions into structured feedback
      const feedback = await processPredictions(predictions, sessionData, userProfile);
      
      // Update the model with new data
      await updateModel(sessionData, feedback);
      
      setCurrentFeedback(feedback);
      return feedback;
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
  }, [model, userProfile, sessionHistory]);

  // Update model with new session data
  const updateModel = async (sessionData: SessionData, feedback: CoachingFeedback) => {
    if (!model) return;

    try {
      // Prepare training data
      const embedding = await createSessionEmbedding(sessionData);
      const labels = createLabelsFromFeedback(feedback);

      // Fine-tune model
      await model.fit(embedding, labels, {
        epochs: 1,
        batchSize: 1,
        callbacks: {
          onTrainEnd: async () => {
            // Save updated model
            await model.save(`indexeddb://user_${userId}_model`);
          }
        }
      });
    } catch (error) {
      console.error('Error updating model:', error);
    }
  };

  // Helper functions
  const getMetricValue = (metrics: CoachingMetrics, metric: string) => {
    switch (metric) {
      case 'wpm':
        return metrics.wpm.reduce((a, b) => a + b, 0) / metrics.wpm.length;
      case 'eyeContact':
        return metrics.eyeContact.reduce((a, b) => a + b, 0) / metrics.eyeContact.length;
      case 'confidence':
        return metrics.confidence.reduce((a, b) => a + b, 0) / metrics.confidence.length;
      case 'fillerWords':
        return metrics.fillerWords.reduce((acc, curr) => acc + curr.count, 0);
      default:
        return 0;
    }
  };

  const calculateTrend = (values: number[]): 'improving' | 'declining' | 'stable' => {
    if (values.length < 2) return 'stable';
    
    const recentAvg = values.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previousAvg = values.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    
    if (recentAvg > previousAvg * 1.05) return 'improving';
    if (recentAvg < previousAvg * 0.95) return 'declining';
    return 'stable';
  };

  const calculatePercentageChange = (values: number[]): number => {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return ((last - first) / first) * 100;
  };

  const calculateConsistencyScore = (values: number[]): number => {
    if (values.length < 2) return 1;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Normalize to 0-1 range where 1 is most consistent
    return 1 - Math.min(standardDeviation / mean, 1);
  };

  return {
    isInitialized,
    generateFeedback,
    currentFeedback,
    progressTrends,
    sessionHistory,
    userProfile
  };
}