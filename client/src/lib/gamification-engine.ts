// Advanced Gamification Engine with VR Integration
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'voice' | 'body_language' | 'content' | 'consistency' | 'improvement';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirements: {
    metric: string;
    operator: '>=' | '<=' | '==' | 'streak';
    value: number;
    sessions?: number;
  };
  reward: {
    points: number;
    badge: string;
    unlock?: string[];
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  unlocked?: boolean;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  currentExp: number;
  expToNextLevel: number;
  achievements: Achievement[];
  streaks: {
    dailyPractice: number;
    weeklyGoals: number;
    perfectSessions: number;
  };
  stats: {
    totalSessions: number;
    totalMinutes: number;
    averageScore: number;
    improvementRate: number;
  };
  ranks: {
    global: number;
    weekly: number;
    category: { [key: string]: number };
  };
}

export interface CompetitiveRanking {
  leaderboard: {
    daily: LeaderboardEntry[];
    weekly: LeaderboardEntry[];
    monthly: LeaderboardEntry[];
    allTime: LeaderboardEntry[];
  };
  userRank: {
    position: number;
    percentile: number;
    category: string;
  };
  challenges: ActiveChallenge[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  improvement: number;
  streak: number;
  badges: string[];
}

export interface ActiveChallenge {
  id: string;
  name: string;
  description: string;
  type: 'solo' | 'community' | 'competitive';
  duration: number; // days
  startDate: Date;
  endDate: Date;
  requirements: any[];
  rewards: {
    points: number;
    badges: string[];
    special?: string;
  };
  participants: number;
  userProgress: number;
}

export interface AIPersonality {
  id: string;
  name: string;
  type: 'mentor' | 'coach' | 'celebrity' | 'expert';
  personality: {
    encouragement: number;
    directness: number;
    humor: number;
    expertise: number;
  };
  specialties: string[];
  avatar: string;
  voiceProfile?: string;
  unlockRequirements?: {
    level: number;
    achievements: string[];
    points: number;
  };
}

// Advanced Gamification System
export class GamificationEngine {
  private achievements: Achievement[] = [];
  private aiPersonalities: AIPersonality[] = [];
  private userProgress: UserProgress;

  constructor() {
    this.initializeAchievements();
    this.initializeAIPersonalities();
    this.userProgress = this.getDefaultProgress();
  }

  private initializeAchievements(): void {
    this.achievements = [
      // Voice Achievements
      {
        id: 'first_words',
        name: 'First Words',
        description: 'Complete your first practice session',
        category: 'voice',
        tier: 'bronze',
        requirements: { metric: 'sessions_completed', operator: '>=', value: 1 },
        reward: { points: 100, badge: '🎤' },
        rarity: 'common'
      },
      {
        id: 'smooth_talker',
        name: 'Smooth Talker',
        description: 'Complete a session with less than 5 filler words',
        category: 'voice',
        tier: 'silver',
        requirements: { metric: 'filler_words', operator: '<=', value: 5 },
        reward: { points: 250, badge: '🗣️' },
        rarity: 'rare'
      },
      {
        id: 'speed_demon',
        name: 'Perfect Pace',
        description: 'Maintain optimal speaking pace (150-180 WPM) for entire session',
        category: 'voice',
        tier: 'gold',
        requirements: { metric: 'optimal_pace_duration', operator: '>=', value: 100 },
        reward: { points: 500, badge: '⚡' },
        rarity: 'epic'
      },
      {
        id: 'crystal_clear',
        name: 'Crystal Clear',
        description: 'Achieve 95%+ voice clarity in a session',
        category: 'voice',
        tier: 'platinum',
        requirements: { metric: 'voice_clarity', operator: '>=', value: 95 },
        reward: { points: 750, badge: '💎', unlock: ['expert_coach'] },
        rarity: 'legendary'
      },

      // Body Language Achievements
      {
        id: 'eye_contact_master',
        name: 'Eye Contact Master',
        description: 'Maintain 80%+ eye contact for entire session',
        category: 'body_language',
        tier: 'gold',
        requirements: { metric: 'eye_contact', operator: '>=', value: 80 },
        reward: { points: 600, badge: '👁️' },
        rarity: 'epic'
      },
      {
        id: 'posture_perfect',
        name: 'Posture Perfect',
        description: 'Maintain excellent posture (90%+) throughout session',
        category: 'body_language',
        tier: 'silver',
        requirements: { metric: 'posture_score', operator: '>=', value: 90 },
        reward: { points: 400, badge: '🏛️' },
        rarity: 'rare'
      },
      {
        id: 'gesture_guru',
        name: 'Gesture Guru',
        description: 'Use 10+ effective gestures in a single session',
        category: 'body_language',
        tier: 'gold',
        requirements: { metric: 'gesture_count', operator: '>=', value: 10 },
        reward: { points: 550, badge: '🤲' },
        rarity: 'epic'
      },

      // Content Achievements
      {
        id: 'storyteller',
        name: 'Master Storyteller',
        description: 'Achieve 90%+ coherence rating in narrative session',
        category: 'content',
        tier: 'platinum',
        requirements: { metric: 'coherence_rating', operator: '>=', value: 90 },
        reward: { points: 800, badge: '📚', unlock: ['celebrity_coach'] },
        rarity: 'legendary'
      },
      {
        id: 'persuasion_expert',
        name: 'Persuasion Expert',
        description: 'Score 85%+ on persuasiveness index',
        category: 'content',
        tier: 'gold',
        requirements: { metric: 'persuasiveness_index', operator: '>=', value: 85 },
        reward: { points: 650, badge: '🎭' },
        rarity: 'epic'
      },

      // Consistency Achievements
      {
        id: 'daily_dedication',
        name: 'Daily Dedication',
        description: 'Practice for 7 consecutive days',
        category: 'consistency',
        tier: 'silver',
        requirements: { metric: 'daily_streak', operator: 'streak', value: 7 },
        reward: { points: 350, badge: '🔥' },
        rarity: 'rare'
      },
      {
        id: 'monthly_master',
        name: 'Monthly Master',
        description: 'Practice for 30 consecutive days',
        category: 'consistency',
        tier: 'platinum',
        requirements: { metric: 'daily_streak', operator: 'streak', value: 30 },
        reward: { points: 1500, badge: '👑', unlock: ['vr_scenarios'] },
        rarity: 'legendary'
      },

      // Improvement Achievements
      {
        id: 'rapid_improver',
        name: 'Rapid Improver',
        description: 'Improve overall score by 20 points in one week',
        category: 'improvement',
        tier: 'gold',
        requirements: { metric: 'weekly_improvement', operator: '>=', value: 20 },
        reward: { points: 700, badge: '📈' },
        rarity: 'epic'
      },
      {
        id: 'transformation',
        name: 'Complete Transformation',
        description: 'Improve from beginner to expert level',
        category: 'improvement',
        tier: 'diamond',
        requirements: { metric: 'level_progression', operator: '>=', value: 50 },
        reward: { points: 2000, badge: '🦋', unlock: ['all_personalities'] },
        rarity: 'legendary'
      }
    ];
  }

  private initializeAIPersonalities(): void {
    this.aiPersonalities = [
      {
        id: 'encouraging_mentor',
        name: 'Alex Thompson',
        type: 'mentor',
        personality: { encouragement: 90, directness: 40, humor: 60, expertise: 75 },
        specialties: ['confidence building', 'nervousness reduction', 'beginner guidance'],
        avatar: '👨‍🏫'
      },
      {
        id: 'direct_coach',
        name: 'Sarah Chen',
        type: 'coach',
        personality: { encouragement: 60, directness: 95, humor: 30, expertise: 90 },
        specialties: ['performance optimization', 'professional development', 'advanced techniques'],
        avatar: '👩‍💼'
      },
      {
        id: 'expert_coach',
        name: 'Dr. Michael Roberts',
        type: 'expert',
        personality: { encouragement: 70, directness: 85, humor: 45, expertise: 98 },
        specialties: ['technical presentations', 'academic speaking', 'research communication'],
        avatar: '👨‍🔬',
        unlockRequirements: { level: 10, achievements: ['crystal_clear'], points: 2000 }
      },
      {
        id: 'celebrity_coach',
        name: 'Jordan Williams',
        type: 'celebrity',
        personality: { encouragement: 85, directness: 70, humor: 90, expertise: 80 },
        specialties: ['entertainment', 'storytelling', 'audience engagement'],
        avatar: '🌟',
        unlockRequirements: { level: 15, achievements: ['storyteller'], points: 3000 }
      },
      {
        id: 'ted_expert',
        name: 'Dr. Elena Rodriguez',
        type: 'expert',
        personality: { encouragement: 80, directness: 80, humor: 70, expertise: 95 },
        specialties: ['TED talks', 'inspirational speaking', 'thought leadership'],
        avatar: '🎯',
        unlockRequirements: { level: 20, achievements: ['persuasion_expert', 'eye_contact_master'], points: 5000 }
      }
    ];
  }

  // Check and award achievements
  checkAchievements(sessionMetrics: any, userStats: any): Achievement[] {
    const newAchievements: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (!achievement.unlocked && this.isAchievementMet(achievement, sessionMetrics, userStats)) {
        achievement.unlocked = true;
        achievement.progress = 100;
        newAchievements.push(achievement);
        
        // Award points
        this.userProgress.totalPoints += achievement.reward.points;
        
        // Unlock special features
        if (achievement.reward.unlock) {
          this.unlockFeatures(achievement.reward.unlock);
        }
      } else if (!achievement.unlocked) {
        // Update progress
        achievement.progress = this.calculateAchievementProgress(achievement, sessionMetrics, userStats);
      }
    });

    return newAchievements;
  }

  private isAchievementMet(achievement: Achievement, sessionMetrics: any, userStats: any): boolean {
    const { metric, operator, value } = achievement.requirements;
    const actualValue = this.getMetricValue(metric, sessionMetrics, userStats);

    switch (operator) {
      case '>=':
        return actualValue >= value;
      case '<=':
        return actualValue <= value;
      case '==':
        return actualValue === value;
      case 'streak':
        return this.userProgress.streaks.dailyPractice >= value;
      default:
        return false;
    }
  }

  private calculateAchievementProgress(achievement: Achievement, sessionMetrics: any, userStats: any): number {
    const { metric, operator, value } = achievement.requirements;
    const actualValue = this.getMetricValue(metric, sessionMetrics, userStats);

    if (operator === 'streak') {
      return Math.min(100, (this.userProgress.streaks.dailyPractice / value) * 100);
    }

    switch (operator) {
      case '>=':
        return Math.min(100, (actualValue / value) * 100);
      case '<=':
        return actualValue <= value ? 100 : Math.max(0, 100 - ((actualValue - value) / value) * 100);
      default:
        return 0;
    }
  }

  private getMetricValue(metric: string, sessionMetrics: any, userStats: any): number {
    // Map metric names to actual values
    const metricMap: { [key: string]: number } = {
      'sessions_completed': userStats.totalSessions || 0,
      'filler_words': sessionMetrics.fillerWords?.length || 0,
      'optimal_pace_duration': sessionMetrics.optimalPaceDuration || 0,
      'voice_clarity': sessionMetrics.clarity || 0,
      'eye_contact': sessionMetrics.eyeContactScore || 0,
      'posture_score': sessionMetrics.postureScore || 0,
      'gesture_count': sessionMetrics.gestureCount || 0,
      'coherence_rating': sessionMetrics.coherenceRating || 0,
      'persuasiveness_index': sessionMetrics.persuasivenessIndex || 0,
      'daily_streak': this.userProgress.streaks.dailyPractice,
      'weekly_improvement': userStats.weeklyImprovement || 0,
      'level_progression': this.userProgress.level || 0
    };

    return metricMap[metric] || 0;
  }

  private unlockFeatures(features: string[]): void {
    features.forEach(feature => {
      console.log(`🔓 Unlocked feature: ${feature}`);
      // Implement feature unlocking logic
    });
  }

  // Level system
  calculateLevel(totalPoints: number): { level: number; currentExp: number; expToNextLevel: number } {
    // Exponential level progression
    let level = 1;
    let expRequired = 0;
    let nextLevelExp = 1000;

    while (totalPoints >= nextLevelExp) {
      expRequired = nextLevelExp;
      level++;
      nextLevelExp = Math.floor(nextLevelExp * 1.5); // 50% increase per level
    }

    const currentExp = totalPoints - expRequired;
    const expToNextLevel = nextLevelExp - totalPoints;

    return { level, currentExp, expToNextLevel };
  }

  // Generate personalized challenges
  generatePersonalizedChallenges(userStats: any): ActiveChallenge[] {
    const challenges: ActiveChallenge[] = [];
    const now = new Date();

    // Identify weak areas and create targeted challenges
    if (userStats.averageFillerWords > 10) {
      challenges.push({
        id: 'filler_reduction',
        name: 'Filler Word Elimination',
        description: 'Reduce filler words by 50% over the next week',
        type: 'solo',
        duration: 7,
        startDate: now,
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        requirements: [{ metric: 'filler_words', target: Math.max(5, userStats.averageFillerWords * 0.5) }],
        rewards: { points: 500, badges: ['🎯'], special: 'Advanced Speech Patterns Course' },
        participants: 1,
        userProgress: 0
      });
    }

    if (userStats.averageEyeContact < 60) {
      challenges.push({
        id: 'eye_contact_mastery',
        name: 'Eye Contact Mastery',
        description: 'Achieve 80%+ eye contact in 5 sessions',
        type: 'solo',
        duration: 14,
        startDate: now,
        endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        requirements: [{ metric: 'eye_contact_sessions', target: 5 }],
        rewards: { points: 750, badges: ['👁️‍🗨️'], special: 'VR Confidence Training' },
        participants: 1,
        userProgress: 0
      });
    }

    return challenges;
  }

  // Social features
  generateLeaderboard(timeframe: 'daily' | 'weekly' | 'monthly' | 'allTime'): LeaderboardEntry[] {
    // Mock leaderboard data - in real app, this would come from backend
    return [
      {
        userId: 'user1',
        username: 'SpeechMaster2024',
        avatar: '🏆',
        score: 15420,
        improvement: 23,
        streak: 45,
        badges: ['💎', '👑', '🔥']
      },
      {
        userId: 'user2',
        username: 'EloquentSpeaker',
        avatar: '🎭',
        score: 14890,
        improvement: 18,
        streak: 32,
        badges: ['⚡', '🎯', '📈']
      },
      {
        userId: 'user3',
        username: 'ConfidentVoice',
        avatar: '🌟',
        score: 13200,
        improvement: 15,
        streak: 28,
        badges: ['🗣️', '👁️', '🎤']
      }
    ];
  }

  // AI Personality System
  selectOptimalPersonality(userProfile: any, sessionType: string): AIPersonality {
    // AI selection based on user needs and preferences
    let bestMatch = this.aiPersonalities[0];
    let bestScore = 0;

    this.aiPersonalities.forEach(personality => {
      if (this.isPersonalityUnlocked(personality)) {
        const score = this.calculatePersonalityMatch(personality, userProfile, sessionType);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = personality;
        }
      }
    });

    return bestMatch;
  }

  private isPersonalityUnlocked(personality: AIPersonality): boolean {
    if (!personality.unlockRequirements) return true;

    const req = personality.unlockRequirements;
    return this.userProgress.level >= req.level &&
           this.userProgress.totalPoints >= req.points &&
           req.achievements.every(achievement => 
             this.achievements.find(a => a.id === achievement)?.unlocked
           );
  }

  private calculatePersonalityMatch(personality: AIPersonality, userProfile: any, sessionType: string): number {
    let score = 0;

    // Match based on user confidence level
    if (userProfile.confidenceLevel === 'low' && personality.personality.encouragement > 80) {
      score += 30;
    }
    if (userProfile.confidenceLevel === 'high' && personality.personality.directness > 80) {
      score += 25;
    }

    // Match based on session type
    if (personality.specialties.some(specialty => 
      sessionType.toLowerCase().includes(specialty.toLowerCase())
    )) {
      score += 40;
    }

    return score;
  }

  // VR Integration Features
  getVRScenarios(userLevel: number): any[] {
    const baseScenarios = [
      {
        id: 'boardroom',
        name: 'Corporate Boardroom',
        description: 'Present to senior executives',
        difficulty: 'intermediate',
        unlockLevel: 5
      },
      {
        id: 'auditorium',
        name: 'Large Auditorium',
        description: 'Address 500+ audience members',
        difficulty: 'advanced',
        unlockLevel: 15
      },
      {
        id: 'ted_stage',
        name: 'TED Talk Stage',
        description: 'Deliver an inspiring TED presentation',
        difficulty: 'expert',
        unlockLevel: 25
      }
    ];

    return baseScenarios.filter(scenario => userLevel >= scenario.unlockLevel);
  }

  // Progress tracking
  updateProgress(sessionMetrics: any): void {
    this.userProgress.stats.totalSessions++;
    this.userProgress.stats.totalMinutes += sessionMetrics.duration || 0;
    
    // Update streaks
    this.updateStreaks();
    
    // Update level based on points
    const levelInfo = this.calculateLevel(this.userProgress.totalPoints);
    this.userProgress.level = levelInfo.level;
    this.userProgress.currentExp = levelInfo.currentExp;
    this.userProgress.expToNextLevel = levelInfo.expToNextLevel;
    
    // Check for new achievements
    const newAchievements = this.checkAchievements(sessionMetrics, this.userProgress.stats);
    
    if (newAchievements.length > 0) {
      this.celebrateAchievements(newAchievements);
    }
  }

  private updateStreaks(): void {
    // Update daily practice streak
    this.userProgress.streaks.dailyPractice++;
    
    // Check weekly goals completion
    if (this.userProgress.stats.totalSessions % 7 === 0) {
      this.userProgress.streaks.weeklyGoals++;
    }
  }

  private celebrateAchievements(achievements: Achievement[]): void {
    achievements.forEach(achievement => {
      console.log(`🎉 Achievement Unlocked: ${achievement.name}`);
      // Trigger achievement animation/notification
    });
  }

  private getDefaultProgress(): UserProgress {
    return {
      totalPoints: 0,
      level: 1,
      currentExp: 0,
      expToNextLevel: 1000,
      achievements: [],
      streaks: {
        dailyPractice: 0,
        weeklyGoals: 0,
        perfectSessions: 0
      },
      stats: {
        totalSessions: 0,
        totalMinutes: 0,
        averageScore: 0,
        improvementRate: 0
      },
      ranks: {
        global: 0,
        weekly: 0,
        category: {}
      }
    };
  }

  // Public getters
  getUserProgress(): UserProgress {
    return this.userProgress;
  }

  getAvailablePersonalities(): AIPersonality[] {
    return this.aiPersonalities.filter(p => this.isPersonalityUnlocked(p));
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }
}