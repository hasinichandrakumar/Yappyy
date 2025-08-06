import * as tf from '@tensorflow/tfjs';

interface SessionData {
  metrics: any;
  transcript: string;
  duration: number;
}

// Create embeddings for session data
export async function createSessionEmbedding(sessionData: SessionData): Promise<tf.Tensor> {
  // Normalize metrics
  const normalizedMetrics = normalizeMetrics(sessionData.metrics);
  
  // Extract text features from transcript
  const textFeatures = await extractTextFeatures(sessionData.transcript);
  
  // Combine features
  const combinedFeatures = tf.concat([
    normalizedMetrics,
    textFeatures,
    tf.scalar(sessionData.duration).expandDims()
  ]);
  
  return combinedFeatures;
}

// Create embeddings for user profile and history
export async function createUserEmbedding(
  userProfile: any,
  sessionHistory: SessionData[]
): Promise<tf.Tensor> {
  // Extract user preferences and learning style
  const profileFeatures = extractProfileFeatures(userProfile);
  
  // Calculate historical performance trends
  const historyFeatures = calculateHistoricalTrends(sessionHistory);
  
  // Create learning pattern features
  const learningFeatures = extractLearningPatterns(sessionHistory);
  
  // Combine all features
  return tf.concat([profileFeatures, historyFeatures, learningFeatures]);
}

// Normalize metrics to consistent ranges
function normalizeMetrics(metrics: any): tf.Tensor {
  const normalizedValues = [
    // WPM (normalize to 0-1 range assuming 50-200 WPM range)
    metrics.wpm.map((w: number) => (w - 50) / 150),
    
    // Eye contact (already 0-1)
    metrics.eyeContact,
    
    // Confidence (already 0-1)
    metrics.confidence,
    
    // Filler words (normalize by duration)
    metrics.fillerWords.map((fw: any) => fw.count).reduce((a: number, b: number) => a + b, 0) / metrics.duration,
    
    // Voice modulation (already 0-1)
    metrics.voiceModulation,
    
    // Posture (already 0-1)
    metrics.posture
  ];
  
  return tf.tensor(normalizedValues);
}

// Extract features from transcript text
async function extractTextFeatures(transcript: string): Promise<tf.Tensor> {
  // Text preprocessing
  const cleanText = transcript.toLowerCase().trim();
  
  // Calculate basic text statistics
  const features = [
    // Average word length
    cleanText.split(' ').reduce((acc, word) => acc + word.length, 0) / cleanText.split(' ').length,
    
    // Sentence complexity (words per sentence)
    cleanText.split(/[.!?]+/).reduce((acc, sent) => acc + sent.trim().split(' ').length, 0) / 
    cleanText.split(/[.!?]+/).length,
    
    // Vocabulary diversity (unique words / total words)
    new Set(cleanText.split(' ')).size / cleanText.split(' ').length,
    
    // Punctuation ratio
    (transcript.match(/[.,!?;]/g) || []).length / transcript.length,
    
    // Question frequency
    (transcript.match(/\?/g) || []).length / transcript.split(/[.!?]+/).length
  ];
  
  return tf.tensor(features);
}

// Extract features from user profile
function extractProfileFeatures(profile: any): tf.Tensor {
  const features = [
    // Learning style preferences (normalized to 0-1)
    profile.learningStyle.visual / 100,
    profile.learningStyle.auditory / 100,
    profile.learningStyle.kinesthetic / 100,
    
    // Experience level (normalized to 0-1)
    profile.experienceLevel / 5,
    
    // Goals priority (normalized to 0-1)
    profile.goals.confidence / 100,
    profile.goals.clarity / 100,
    profile.goals.pace / 100,
    
    // Feedback preferences (normalized to 0-1)
    profile.feedbackPreferences.frequency / 10,
    profile.feedbackPreferences.detail / 10,
    profile.feedbackPreferences.tone / 10
  ];
  
  return tf.tensor(features);
}

// Calculate historical performance trends
function calculateHistoricalTrends(sessions: SessionData[]): tf.Tensor {
  if (sessions.length < 2) {
    return tf.zeros([10]); // Return zero tensor if not enough history
  }

  const trends = [
    // WPM trend
    calculateMetricTrend(sessions, 'wpm'),
    
    // Eye contact improvement
    calculateMetricTrend(sessions, 'eyeContact'),
    
    // Confidence progression
    calculateMetricTrend(sessions, 'confidence'),
    
    // Filler word reduction
    calculateMetricTrend(sessions, 'fillerWords'),
    
    // Voice modulation improvement
    calculateMetricTrend(sessions, 'voiceModulation'),
    
    // Overall progress rate
    calculateOverallProgress(sessions),
    
    // Consistency score
    calculateConsistency(sessions),
    
    // Learning velocity
    calculateLearningVelocity(sessions),
    
    // Plateau detection
    detectPlateau(sessions),
    
    // Recovery from setbacks
    calculateRecoveryRate(sessions)
  ];
  
  return tf.tensor(trends);
}

// Extract learning patterns from session history
function extractLearningPatterns(sessions: SessionData[]): tf.Tensor {
  if (sessions.length < 3) {
    return tf.zeros([8]); // Return zero tensor if not enough history
  }

  const patterns = [
    // Practice frequency
    calculatePracticeFrequency(sessions),
    
    // Session duration trend
    calculateSessionDurationTrend(sessions),
    
    // Improvement rate by time of day
    calculateTimeOfDayEffect(sessions),
    
    // Rest period effectiveness
    calculateRestPeriodEffect(sessions),
    
    // Skill retention
    calculateSkillRetention(sessions),
    
    // Learning style effectiveness
    calculateLearningStyleEffectiveness(sessions),
    
    // Adaptation rate
    calculateAdaptationRate(sessions),
    
    // Feedback implementation success
    calculateFeedbackSuccess(sessions)
  ];
  
  return tf.tensor(patterns);
}

// Helper functions for trend calculations
function calculateMetricTrend(sessions: SessionData[], metric: string): number {
  const values = sessions.map(s => getAverageMetricValue(s, metric));
  const trend = linearRegression(values);
  return normalizeValue(trend, -1, 1);
}

function calculateOverallProgress(sessions: SessionData[]): number {
  const metrics = ['wpm', 'eyeContact', 'confidence', 'fillerWords'];
  const trends = metrics.map(m => calculateMetricTrend(sessions, m));
  return trends.reduce((a, b) => a + b, 0) / trends.length;
}

function calculateConsistency(sessions: SessionData[]): number {
  const metrics = ['wpm', 'eyeContact', 'confidence'];
  const variances = metrics.map(m => {
    const values = sessions.map(s => getAverageMetricValue(s, m));
    return calculateVariance(values);
  });
  return 1 - (variances.reduce((a, b) => a + b, 0) / variances.length);
}

function calculateLearningVelocity(sessions: SessionData[]): number {
  const recentProgress = calculateOverallProgress(sessions.slice(-5));
  const earlierProgress = calculateOverallProgress(sessions.slice(-10, -5));
  return normalizeValue(recentProgress - earlierProgress, -1, 1);
}

function detectPlateau(sessions: SessionData[]): number {
  const recentProgress = calculateLearningVelocity(sessions.slice(-5));
  return recentProgress < 0.1 ? 1 : 0;
}

function calculateRecoveryRate(sessions: SessionData[]): number {
  let recoveries = 0;
  let setbacks = 0;
  
  for (let i = 1; i < sessions.length; i++) {
    const prevScore = calculateOverallProgress([sessions[i-1]]);
    const currScore = calculateOverallProgress([sessions[i]]);
    
    if (prevScore > currScore) {
      setbacks++;
      if (i < sessions.length - 1) {
        const nextScore = calculateOverallProgress([sessions[i+1]]);
        if (nextScore > currScore) recoveries++;
      }
    }
  }
  
  return setbacks > 0 ? recoveries / setbacks : 1;
}

// Utility functions
function getAverageMetricValue(session: SessionData, metric: string): number {
  const values = session.metrics[metric];
  return Array.isArray(values) 
    ? values.reduce((a, b) => a + b, 0) / values.length
    : values;
}

function linearRegression(values: number[]): number {
  const n = values.length;
  const x = Array.from({length: n}, (_, i) => i);
  const y = values;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, curr, i) => acc + curr * y[i], 0);
  const sumXX = x.reduce((acc, curr) => acc + curr * curr, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  return slope;
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(v => Math.pow(v - mean, 2));
  return squareDiffs.reduce((a, b) => a + b, 0) / values.length;
}

function normalizeValue(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

// Additional pattern analysis functions
function calculatePracticeFrequency(sessions: SessionData[]): number {
  const daysBetweenSessions = [];
  for (let i = 1; i < sessions.length; i++) {
    const days = (new Date(sessions[i].date).getTime() - 
                 new Date(sessions[i-1].date).getTime()) / (1000 * 60 * 60 * 24);
    daysBetweenSessions.push(days);
  }
  return 1 / (daysBetweenSessions.reduce((a, b) => a + b, 0) / daysBetweenSessions.length);
}

function calculateSessionDurationTrend(sessions: SessionData[]): number {
  const durations = sessions.map(s => s.duration);
  return linearRegression(durations);
}

function calculateTimeOfDayEffect(sessions: SessionData[]): number {
  const timePerformance: {[key: string]: number[]} = {
    morning: [],
    afternoon: [],
    evening: []
  };
  
  sessions.forEach(session => {
    const hour = new Date(session.date).getHours();
    const performance = calculateOverallProgress([session]);
    
    if (hour < 12) timePerformance.morning.push(performance);
    else if (hour < 18) timePerformance.afternoon.push(performance);
    else timePerformance.evening.push(performance);
  });
  
  const averages = Object.values(timePerformance)
    .map(scores => scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
  
  return Math.max(...averages);
}

function calculateRestPeriodEffect(sessions: SessionData[]): number {
  const performanceByRest: {[key: string]: number[]} = {
    short: [], // 1-2 days
    medium: [], // 3-7 days
    long: [] // >7 days
  };
  
  for (let i = 1; i < sessions.length; i++) {
    const days = (new Date(sessions[i].date).getTime() - 
                 new Date(sessions[i-1].date).getTime()) / (1000 * 60 * 60 * 24);
    const performance = calculateOverallProgress([sessions[i]]);
    
    if (days <= 2) performanceByRest.short.push(performance);
    else if (days <= 7) performanceByRest.medium.push(performance);
    else performanceByRest.long.push(performance);
  }
  
  const averages = Object.values(performanceByRest)
    .map(scores => scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
  
  return Math.max(...averages);
}

function calculateSkillRetention(sessions: SessionData[]): number {
  if (sessions.length < 4) return 1;
  
  const retentionScores = [];
  for (let i = 3; i < sessions.length; i++) {
    const previousBest = Math.max(
      ...sessions.slice(i-3, i).map(s => calculateOverallProgress([s]))
    );
    const current = calculateOverallProgress([sessions[i]]);
    retentionScores.push(current / previousBest);
  }
  
  return retentionScores.reduce((a, b) => a + b, 0) / retentionScores.length;
}

function calculateLearningStyleEffectiveness(sessions: SessionData[]): number {
  // Analyze which types of exercises led to the most improvement
  const improvements = sessions.map((s, i) => {
    if (i === 0) return 0;
    return calculateOverallProgress([sessions[i]]) - calculateOverallProgress([sessions[i-1]]);
  });
  
  return Math.max(0, improvements.reduce((a, b) => a + b, 0) / improvements.length);
}

function calculateAdaptationRate(sessions: SessionData[]): number {
  // Measure how quickly the user improves after receiving feedback
  const adaptationScores = [];
  for (let i = 1; i < sessions.length; i++) {
    const prevPerformance = calculateOverallProgress([sessions[i-1]]);
    const currPerformance = calculateOverallProgress([sessions[i]]);
    adaptationScores.push(Math.max(0, (currPerformance - prevPerformance) / prevPerformance));
  }
  
  return adaptationScores.reduce((a, b) => a + b, 0) / adaptationScores.length;
}

function calculateFeedbackSuccess(sessions: SessionData[]): number {
  // Measure how successfully the user implements feedback
  const successScores = [];
  for (let i = 1; i < sessions.length; i++) {
    const targetMetrics = sessions[i-1].metrics.improvementTargets || [];
    const improvements = targetMetrics.map(metric => 
      calculateMetricTrend([sessions[i-1], sessions[i]], metric)
    );
    successScores.push(improvements.filter(imp => imp > 0).length / improvements.length);
  }
  
  return successScores.reduce((a, b) => a + b, 0) / successScores.length;
}