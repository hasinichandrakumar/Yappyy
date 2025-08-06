import * as tf from '@tensorflow/tfjs';

interface FeedbackContext {
  userProfile: {
    learningStyle: string;
    personalityType: string;
    preferredTone: 'direct' | 'encouraging' | 'analytical' | 'casual';
    experienceLevel: number;
    goals: string[];
    challengeAreas: string[];
    feedbackPreferences: {
      detail: number;
      frequency: number;
      focusAreas: string[];
    };
  };
  sessionHistory: SessionData[];
  currentSession: SessionData;
  progressTrends: ProgressTrend[];
}

interface SessionData {
  id: string;
  date: string;
  metrics: {
    wpm: number;
    eyeContact: number;
    confidence: number;
    fillerWords: { word: string; count: number }[];
    posture: number;
    voiceModulation: number;
  };
  transcript: string;
  duration: number;
}

interface ProgressTrend {
  metric: string;
  value: number;
  trend: 'improving' | 'stable' | 'declining';
  percentageChange: number;
}

interface GeneratedFeedback {
  immediate: {
    quickTips: string[];
    corrections: string[];
    encouragement: string;
  };
  detailed: {
    strengths: string[];
    improvements: string[];
    technicalAnalysis: string[];
    personalizedExercises: Exercise[];
  };
  longTerm: {
    goals: string[];
    milestones: Milestone[];
    developmentPath: string[];
  };
  emotional: {
    supportiveMessage: string;
    confidenceBooster: string;
    challengeAcknowledgment: string;
  };
}

interface Exercise {
  type: string;
  difficulty: number;
  description: string;
  targetMetric: string;
  personalizedInstructions: string;
  estimatedDuration: number;
  prerequisites: string[];
}

interface Milestone {
  goal: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  estimatedTimeframe: string;
  checkpoints: string[];
}

export class FeedbackGenerator {
  private readonly feedbackTemplates: Map<string, string[]>;
  private model: tf.LayersModel | null = null;

  constructor() {
    this.feedbackTemplates = new Map([
      ['quickTips', [
        'Try maintaining more consistent eye contact',
        'Consider pausing briefly between main points',
        'Focus on speaking at a steady pace',
        'Use gestures to emphasize key points'
      ]],
      ['improvements', [
        'Your speaking pace could be more consistent',
        'Try to reduce filler words like "um" and "uh"',
        'Consider varying your tone more for emphasis',
        'Work on maintaining a confident posture'
      ]],
      ['encouragement', [
        'You\'re making great progress with {metric}!',
        'Your dedication to improvement is showing in {area}',
        'Keep up the excellent work on {skill}',
        'You\'ve shown significant growth in {aspect}'
      ]]
    ]);
  }

  async initialize(): Promise<void> {
    try {
      // Load the model
      this.model = await tf.loadLayersModel('/models/feedback_model/model.json');
    } catch (error) {
      console.error('Failed to load feedback model:', error);
      // Fallback to template-based feedback
      this.model = null;
    }
  }

  async generateFeedback(context: FeedbackContext): Promise<GeneratedFeedback> {
    try {
      return {
        immediate: await this.generateImmediateFeedback(context),
        detailed: await this.generateDetailedFeedback(context),
        longTerm: await this.generateLongTermGuidance(context),
        emotional: await this.generateEmotionalSupport(context)
      };
    } catch (error) {
      console.error('Error generating feedback:', error);
      return this.generateFallbackFeedback(context);
    }
  }

  private async generateImmediateFeedback(context: FeedbackContext) {
    const { currentSession, userProfile } = context;
    
    const quickTips = this.generateQuickTips(currentSession, userProfile);
    const corrections = this.generateCorrections(currentSession, userProfile);
    const encouragement = this.generateEncouragement(context);

    return {
      quickTips,
      corrections,
      encouragement
    };
  }

  private generateQuickTips(session: SessionData, userProfile: FeedbackContext['userProfile']): string[] {
    const tips: string[] = [];
    
    // Check WPM
    if (session.metrics.wpm < 120 || session.metrics.wpm > 160) {
      tips.push(session.metrics.wpm < 120 
        ? 'Try speaking a bit faster to maintain audience engagement'
        : 'Consider slowing down slightly for better clarity');
    }

    // Check eye contact
    if (session.metrics.eyeContact < 0.7) {
      tips.push('Try to maintain more consistent eye contact with your audience');
    }

    // Check confidence
    if (session.metrics.confidence < 0.7) {
      tips.push('Stand tall and speak with conviction to project more confidence');
    }

    // Check filler words
    if (session.metrics.fillerWords.length > 5) {
      tips.push('Work on reducing filler words by pausing instead of saying "um" or "uh"');
    }

    return this.personalizeTips(tips, userProfile);
  }

  private generateCorrections(session: SessionData, userProfile: FeedbackContext['userProfile']): string[] {
    const corrections: string[] = [];
    
    // Immediate issues that need correction
    if (session.metrics.posture < 0.6) {
      corrections.push('Straighten your posture to appear more confident');
    }

    if (session.metrics.voiceModulation < 0.5) {
      corrections.push('Vary your tone more to keep the audience engaged');
    }

    return this.personalizeCorrections(corrections, userProfile);
  }

  private generateEncouragement(context: FeedbackContext): string {
    const { currentSession, sessionHistory } = context;
    
    // Find improvements
    const improvements = this.findImprovements(currentSession, sessionHistory);
    
    if (improvements.length > 0) {
      const improvement = improvements[0];
      return `Great job improving your ${improvement}! Keep up the excellent work!`;
    }

    return 'You\'re putting in great effort. Keep practicing and you\'ll see improvements!';
  }

  private async generateDetailedFeedback(context: FeedbackContext) {
    return {
      strengths: this.analyzeStrengths(context),
      improvements: this.analyzeImprovements(context),
      technicalAnalysis: this.generateTechnicalAnalysis(context),
      personalizedExercises: this.generateExercises(context)
    };
  }

  private analyzeStrengths(context: FeedbackContext): string[] {
    const strengths: string[] = [];
    const { currentSession } = context;

    if (currentSession.metrics.wpm >= 120 && currentSession.metrics.wpm <= 160) {
      strengths.push('Your speaking pace is excellent, maintaining good engagement while staying clear');
    }

    if (currentSession.metrics.eyeContact >= 0.7) {
      strengths.push('You maintain strong eye contact, effectively engaging with your audience');
    }

    if (currentSession.metrics.confidence >= 0.7) {
      strengths.push('Your confident delivery helps convey your message effectively');
    }

    if (currentSession.metrics.fillerWords.length <= 5) {
      strengths.push('You use minimal filler words, keeping your speech clear and professional');
    }

    return strengths;
  }

  private analyzeImprovements(context: FeedbackContext): string[] {
    const improvements: string[] = [];
    const { currentSession } = context;

    if (currentSession.metrics.wpm < 120) {
      improvements.push({
        area: 'Speaking Pace',
        suggestion: 'Try increasing your speaking pace slightly to better engage your audience',
        exercise: 'Practice with a timer, aiming for 120-160 words per minute'
      });
    }

    if (currentSession.metrics.eyeContact < 0.7) {
      improvements.push({
        area: 'Eye Contact',
        suggestion: 'Work on maintaining more consistent eye contact',
        exercise: 'Practice speaking while focusing on fixed points in the room'
      });
    }

    return improvements.map(imp => 
      `${imp.area}: ${imp.suggestion}. Exercise: ${imp.exercise}`
    );
  }

  private generateTechnicalAnalysis(context: FeedbackContext): string[] {
    const analysis: string[] = [];
    const { currentSession } = context;

    // Analyze voice modulation
    analysis.push(`Voice Modulation: ${
      this.analyzeVoiceModulation(currentSession.metrics.voiceModulation)
    }`);

    // Analyze posture
    analysis.push(`Posture: ${
      this.analyzePosture(currentSession.metrics.posture)
    }`);

    // Analyze speaking patterns
    analysis.push(`Speaking Pattern: ${
      this.analyzeSpeakingPattern(currentSession.metrics)
    }`);

    return analysis;
  }

  private generateExercises(context: FeedbackContext): Exercise[] {
    const exercises: Exercise[] = [];
    const { currentSession, userProfile } = context;

    // Generate exercises based on areas needing improvement
    if (currentSession.metrics.wpm < 120) {
      exercises.push(this.createPaceExercise(currentSession.metrics.wpm));
    }

    if (currentSession.metrics.eyeContact < 0.7) {
      exercises.push(this.createEyeContactExercise());
    }

    if (currentSession.metrics.confidence < 0.7) {
      exercises.push(this.createConfidenceExercise());
    }

    return this.personalizeExercises(exercises, userProfile);
  }

  private async generateLongTermGuidance(context: FeedbackContext) {
    return {
      goals: this.generateGoals(context),
      milestones: this.generateMilestones(context),
      developmentPath: this.generateDevelopmentPath(context)
    };
  }

  private generateGoals(context: FeedbackContext): string[] {
    const goals: string[] = [];
    const { currentSession, userProfile } = context;

    // Generate goals based on current performance and user preferences
    Object.entries(currentSession.metrics).forEach(([metric, value]) => {
      if (this.needsImprovement(metric, value)) {
        goals.push(this.createGoal(metric, value, userProfile));
      }
    });

    return goals;
  }

  private generateMilestones(context: FeedbackContext): Milestone[] {
    const milestones: Milestone[] = [];
    const { currentSession, progressTrends } = context;

    // Create milestones for each metric needing improvement
    Object.entries(currentSession.metrics).forEach(([metric, value]) => {
      if (this.needsImprovement(metric, value)) {
        milestones.push(this.createMilestone(metric, value, progressTrends));
      }
    });

    return milestones;
  }

  private generateDevelopmentPath(context: FeedbackContext): string[] {
    const { currentSession, userProfile, progressTrends } = context;
    const path: string[] = [];

    // Create personalized development steps
    const metrics = Object.entries(currentSession.metrics);
    metrics.sort((a, b) => this.getPriority(a[0], a[1]) - this.getPriority(b[0], b[1]));

    metrics.forEach(([metric, value]) => {
      if (this.needsImprovement(metric, value)) {
        path.push(...this.createDevelopmentSteps(metric, value, userProfile, progressTrends));
      }
    });

    return path;
  }

  private async generateEmotionalSupport(context: FeedbackContext) {
    return {
      supportiveMessage: this.generateSupportiveMessage(context),
      confidenceBooster: this.generateConfidenceBooster(context),
      challengeAcknowledgment: this.generateChallengeAcknowledgment(context)
    };
  }

  private generateSupportiveMessage(context: FeedbackContext): string {
    const { currentSession, sessionHistory } = context;
    const improvement = this.calculateImprovement(currentSession, sessionHistory);

    if (improvement > 0.1) {
      return 'You\'re making excellent progress! Your dedication is really showing in your performance.';
    } else if (improvement > 0) {
      return 'Keep pushing forward! Every small improvement adds up to significant progress.';
    } else {
      return 'Remember that learning is a journey. Focus on small improvements and stay persistent.';
    }
  }

  private generateConfidenceBooster(context: FeedbackContext): string {
    const { currentSession } = context;
    const strengths = this.findTopStrengths(currentSession);

    if (strengths.length > 0) {
      return `You excel at ${strengths.join(' and ')}. Build on these strengths as you continue to improve.`;
    }

    return 'Every practice session makes you stronger. Keep building your skills!';
  }

  private generateChallengeAcknowledgment(context: FeedbackContext): string {
    const { currentSession, userProfile } = context;
    const challenges = this.identifyChallenges(currentSession);

    if (challenges.length > 0) {
      return `I understand that ${challenges[0]} can be challenging. Let's work on this together with a personalized approach.`;
    }

    return 'You\'re handling challenges well. Keep approaching them with the same determination.';
  }

  // Helper methods
  private needsImprovement(metric: string, value: number): boolean {
    // Dynamic thresholds based on empirical data and research
    const thresholds: { [key: string]: number } = {
      wpm: {
        min: 120, // Minimum effective speaking rate
        max: 160, // Maximum effective speaking rate
        target: 140 // Optimal speaking rate
      },
      eyeContact: {
        min: 0.6, // Minimum effective eye contact
        target: 0.8 // Optimal eye contact
      },
      confidence: {
        min: 0.65, // Minimum effective confidence
        target: 0.85 // Optimal confidence
      },
      posture: {
        min: 0.7, // Minimum effective posture
        target: 0.9 // Optimal posture
      },
      voiceModulation: {
        min: 0.6, // Minimum effective modulation
        target: 0.8 // Optimal modulation
      }
    };

    if (metric === 'wpm') {
      return value < thresholds.wpm.min || value > thresholds.wpm.max;
    }

    return value < thresholds[metric]?.min || false;
  }

  private getPriority(metric: string, value: number): number {
    const priorities: { [key: string]: number } = {
      confidence: 1,
      eyeContact: 2,
      wpm: 3,
      posture: 4,
      voiceModulation: 5
    };

    return priorities[metric] || 99;
  }

  private calculateImprovement(current: SessionData, history: SessionData[]): number {
    if (history.length === 0) return 0;

    const previousSession = history[history.length - 1];
    const metrics = ['wpm', 'eyeContact', 'confidence', 'posture', 'voiceModulation'];

    return metrics.reduce((sum, metric) => {
      return sum + (current.metrics[metric] - previousSession.metrics[metric]);
    }, 0) / metrics.length;
  }

  private findTopStrengths(session: SessionData): string[] {
    const strengths: string[] = [];

    if (session.metrics.wpm >= 120 && session.metrics.wpm <= 160) strengths.push('speaking pace');
    if (session.metrics.eyeContact >= 0.7) strengths.push('eye contact');
    if (session.metrics.confidence >= 0.7) strengths.push('confident delivery');
    if (session.metrics.posture >= 0.7) strengths.push('posture');
    if (session.metrics.voiceModulation >= 0.7) strengths.push('voice modulation');

    return strengths;
  }

  private identifyChallenges(session: SessionData): string[] {
    const challenges: string[] = [];

    if (session.metrics.wpm < 120) challenges.push('maintaining an engaging pace');
    if (session.metrics.eyeContact < 0.7) challenges.push('maintaining eye contact');
    if (session.metrics.confidence < 0.7) challenges.push('building confidence');
    if (session.metrics.posture < 0.7) challenges.push('maintaining good posture');
    if (session.metrics.voiceModulation < 0.7) challenges.push('varying your tone');

    return challenges;
  }

  private generateFallbackFeedback(context: FeedbackContext): GeneratedFeedback {
    return {
      immediate: {
        quickTips: this.generateQuickTips(context.currentSession, context.userProfile),
        corrections: this.generateCorrections(context.currentSession, context.userProfile),
        encouragement: this.generateEncouragement(context)
      },
      detailed: {
        strengths: this.analyzeStrengths(context),
        improvements: this.analyzeImprovements(context),
        technicalAnalysis: this.generateTechnicalAnalysis(context),
        personalizedExercises: this.generateExercises(context)
      },
      longTerm: {
        goals: this.generateGoals(context),
        milestones: this.generateMilestones(context),
        developmentPath: this.generateDevelopmentPath(context)
      },
      emotional: {
        supportiveMessage: this.generateSupportiveMessage(context),
        confidenceBooster: this.generateConfidenceBooster(context),
        challengeAcknowledgment: this.generateChallengeAcknowledgment(context)
      }
    };
  }
}