import { 
  users,
  practiceSessions, 
  coachingFeedback, 
  userProgress,
  aiInsights,
  userPreferences,
  userAchievements,
  userStreaks,
  dailyGoals,
  speechPersona,
  leaderboardEntries,
  socialInteractions,
  challenges,
  challengeParticipations,
  type User, 
  type UpsertUser,
  type PracticeSession,
  type InsertPracticeSession, 
  type CoachingFeedback, 
  type InsertCoachingFeedback,
  type UserProgress,
  type InsertUserProgress,
  type AiInsight,
  type InsertAiInsight,
  type UserPreference,
  type InsertUserPreference,
  type UserAchievement,
  type InsertUserAchievement,
  type UserStreak,
  type InsertUserStreak,
  type DailyGoal,
  type InsertDailyGoal,
  type LeaderboardEntry,
  type InsertLeaderboardEntry,
  type SocialInteraction,
  type InsertSocialInteraction,
  type Challenge,
  type InsertChallenge,
  type ChallengeParticipation,
  type InsertChallengeParticipation
} from "@shared/schema";
import { db, resilientQuery } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Database operation wrapper with retry logic
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.error(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError!;
}

export interface IStorage {
  // User operations (required for authentication)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(userId: string, updates: Partial<UpsertUser>): Promise<User>;
  
  // Practice session operations
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;
  getPracticeSession(id: number): Promise<PracticeSession | undefined>;
  getUserPracticeSessions(userId: string): Promise<PracticeSession[]>;
  deletePracticeSession(id: number): Promise<void>;
  
  // Coaching feedback operations
  addCoachingFeedback(feedback: InsertCoachingFeedback): Promise<CoachingFeedback>;
  getSessionFeedback(sessionId: number): Promise<CoachingFeedback[]>;
  
  // User progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // AI insights operations
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  getUserAiInsights(userId: string): Promise<AiInsight[]>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreference[]>;
  upsertUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
  deleteUserPreference(userId: string, category: string, setting: string): Promise<void>;
  
  // User achievements operations
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // User streaks operations
  getUserStreaks(userId: string): Promise<UserStreak[]>;
  updateUserStreak(streak: InsertUserStreak): Promise<UserStreak>;
  upsertUserStreak(userId: string, streakType: string, updates: Partial<InsertUserStreak>): Promise<UserStreak>;
  
  // Daily goals operations
  getUserDailyGoals(userId: string, date?: Date): Promise<DailyGoal[]>;
  createDailyGoal(goal: InsertDailyGoal): Promise<DailyGoal>;
  updateDailyGoal(goalId: number, updates: Partial<InsertDailyGoal>): Promise<DailyGoal>;
  generateDailyGoalsForUser(userId: string): Promise<DailyGoal[]>;

  // Speech persona operations
  getSpeechPersona(userId: string): Promise<any>;
  generateSpeechPersona(userId: string, sessions: any[]): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      return await resilientQuery(async () => {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Practice session operations
  async createPracticeSession(sessionData: InsertPracticeSession): Promise<PracticeSession> {
    const [session] = await db
      .insert(practiceSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getPracticeSession(id: number): Promise<PracticeSession | undefined> {
    const [session] = await db.select().from(practiceSessions).where(eq(practiceSessions.id, id));
    return session;
  }

  async getUserPracticeSessions(userId: string): Promise<PracticeSession[]> {
    try {
      return await resilientQuery(async () => {
        return await db
          .select()
          .from(practiceSessions)
          .where(eq(practiceSessions.userId, userId))
          .orderBy(desc(practiceSessions.createdAt));
      });
    } catch (error) {
      console.error('Error fetching user practice sessions:', error);
      return [];
    }
  }

  async deletePracticeSession(id: number): Promise<void> {
    await db
      .delete(practiceSessions)
      .where(eq(practiceSessions.id, id));
  }

  // Coaching feedback operations
  async addCoachingFeedback(feedbackData: InsertCoachingFeedback): Promise<CoachingFeedback> {
    const [feedback] = await db
      .insert(coachingFeedback)
      .values(feedbackData)
      .returning();
    return feedback;
  }

  async getSessionFeedback(sessionId: number): Promise<CoachingFeedback[]> {
    return await db
      .select()
      .from(coachingFeedback)
      .where(eq(coachingFeedback.sessionId, sessionId))
      .orderBy(desc(coachingFeedback.timestamp));
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values({
        ...progressData,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.skillArea],
        set: {
          ...progressData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  // AI insights operations
  async createAiInsight(insightData: InsertAiInsight): Promise<AiInsight> {
    const [insight] = await db
      .insert(aiInsights)
      .values(insightData)
      .returning();
    return insight;
  }

  async getUserAiInsights(userId: string): Promise<AiInsight[]> {
    return await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.userId, userId))
      .orderBy(desc(aiInsights.createdAt));
  }

  // User profile operations
  async updateUserProfile(userId: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreference[]> {
    const preferences = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async upsertUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    const existingPrefs = await db
      .select()
      .from(userPreferences)
      .where(and(
        eq(userPreferences.userId, preference.userId),
        eq(userPreferences.category, preference.category),
        eq(userPreferences.setting, preference.setting)
      ));

    if (existingPrefs.length > 0) {
      const [updated] = await db
        .update(userPreferences)
        .set({ value: preference.value, updatedAt: new Date() })
        .where(eq(userPreferences.id, existingPrefs[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userPreferences)
        .values(preference)
        .returning();
      return created;
    }
  }

  async deleteUserPreference(userId: string, category: string, setting: string): Promise<void> {
    await db
      .delete(userPreferences)
      .where(and(
        eq(userPreferences.userId, userId),
        eq(userPreferences.category, category),
        eq(userPreferences.setting, setting)
      ));
  }

  // User achievements operations
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const achievements = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));
    return achievements;
  }

  async addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const [created] = await db
      .insert(userAchievements)
      .values(achievement)
      .returning();
    return created;
  }

  // User streaks operations
  async getUserStreaks(userId: string): Promise<UserStreak[]> {
    const streaks = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId));
    return streaks;
  }

  async updateUserStreak(streak: InsertUserStreak): Promise<UserStreak> {
    const [updated] = await db
      .insert(userStreaks)
      .values(streak)
      .returning();
    return updated;
  }

  async upsertUserStreak(userId: string, streakType: string, updates: Partial<InsertUserStreak>): Promise<UserStreak> {
    const existingStreaks = await db
      .select()
      .from(userStreaks)
      .where(and(
        eq(userStreaks.userId, userId),
        eq(userStreaks.streakType, streakType)
      ));

    if (existingStreaks.length > 0) {
      const [updated] = await db
        .update(userStreaks)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userStreaks.id, existingStreaks[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userStreaks)
        .values({ userId, streakType, ...updates })
        .returning();
      return created;
    }
  }

  // Daily goals operations
  async getUserDailyGoals(userId: string, date?: Date): Promise<DailyGoal[]> {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const goals = await db
      .select()
      .from(dailyGoals)
      .where(
        and(
          eq(dailyGoals.userId, userId),
          gte(dailyGoals.dateAssigned, startOfDay),
          lte(dailyGoals.dateAssigned, endOfDay)
        )
      )
      .orderBy(desc(dailyGoals.createdAt));
    
    return goals;
  }

  async createDailyGoal(goalData: InsertDailyGoal): Promise<DailyGoal> {
    const [goal] = await db
      .insert(dailyGoals)
      .values(goalData)
      .returning();
    return goal;
  }

  async updateDailyGoal(goalId: number, updates: Partial<InsertDailyGoal>): Promise<DailyGoal> {
    const [goal] = await db
      .update(dailyGoals)
      .set(updates)
      .where(eq(dailyGoals.id, goalId))
      .returning();
    return goal;
  }

  async generateDailyGoalsForUser(userId: string): Promise<DailyGoal[]> {
    // Check if user already has goals for today
    const existingGoals = await this.getUserDailyGoals(userId);
    if (existingGoals.length > 0) {
      return existingGoals;
    }

    // Generate new goals based on user's progress and preferences
    const goalTemplates = [
      {
        goalType: 'practice',
        title: 'Voice Clarity Challenge',
        description: 'Practice speaking with crystal clear articulation',
        targetValue: 3,
        unit: 'minutes',
        points: 25,
        difficulty: 'easy',
        category: 'voice'
      },
      {
        goalType: 'improvement',
        title: 'Eye Contact Mastery',
        description: 'Maintain steady eye contact throughout your speech',
        targetValue: 85,
        unit: '% eye contact',
        points: 30,
        difficulty: 'medium',
        category: 'body'
      },
      {
        goalType: 'challenge',
        title: 'Confident Posture Power',
        description: 'Stand tall and command attention with your presence',
        targetValue: 90,
        unit: '% good posture',
        points: 35,
        difficulty: 'medium',
        category: 'body'
      }
    ];

    // Select 2 random goals for the day
    const selectedTemplates = goalTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const newGoals: DailyGoal[] = [];
    for (const template of selectedTemplates) {
      const goal = await this.createDailyGoal({
        userId,
        ...template,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
      });
      newGoals.push(goal);
    }

    return newGoals;
  }

  // Speech persona operations
  async getSpeechPersona(userId: string): Promise<any> {
    return withRetry(async () => {
      const [persona] = await db
        .select()
        .from(speechPersona)
        .where(eq(speechPersona.userId, userId));
      return persona || null;
    });
  }

  async generateSpeechPersona(userId: string, sessions: any[]): Promise<any> {
    return withRetry(async () => {
      if (sessions.length === 0) {
        return null;
      }

      // Calculate persona characteristics
      const avgWpm = sessions.reduce((sum: number, s: any) => sum + (s.wpm || 0), 0) / sessions.length;
      const avgClarity = sessions.reduce((sum: number, s: any) => sum + (s.voiceClarity || 0), 0) / sessions.length;
      const avgOverall = sessions.reduce((sum: number, s: any) => sum + (s.overallScore || 0), 0) / sessions.length;
      const totalFillers = sessions.reduce((sum: number, s: any) => sum + (s.fillerWords?.length || 0), 0);
      const avgFillerRate = totalFillers / Math.max(1, sessions.reduce((sum: number, s: any) => sum + (s.wordCount || 0), 0)) * 100;

      // Determine speaking style
      const speakingStyle = (() => {
        if (avgWpm > 160) return avgClarity > 80 ? "Dynamic Presenter" : "Rapid Fire Communicator";
        if (avgWpm < 110) return avgClarity > 80 ? "Thoughtful Narrator" : "Deliberate Speaker";
        return avgClarity > 85 ? "Balanced Communicator" : "Steady Speaker";
      })();

      // Determine personality
      const communicationPersonality = (() => {
        if (avgOverall > 85) return "Natural Leader";
        if (avgOverall > 75) return "Confident Communicator";
        if (avgOverall > 65) return "Developing Professional";
        if (avgOverall > 55) return "Emerging Speaker";
        return "Foundation Builder";
      })();

      // Identify strengths and growth areas
      const strengthAreas = [];
      if (avgClarity > 80) strengthAreas.push("Clear Articulation");
      if (avgWpm >= 120 && avgWpm <= 150) strengthAreas.push("Optimal Pacing");
      if (avgFillerRate < 3) strengthAreas.push("Fluent Delivery");

      const growthAreas = [];
      if (avgClarity < 70) growthAreas.push("Voice Clarity");
      if (avgWpm < 100) growthAreas.push("Speaking Energy");
      if (avgFillerRate > 5) growthAreas.push("Verbal Fluency");

      const confidenceLevel = avgOverall > 80 ? "High Confidence" : avgOverall > 65 ? "Growing Confidence" : "Building Confidence";
      const personaDescription = `You're a ${speakingStyle.toLowerCase()} with ${confidenceLevel.toLowerCase()}.`;

      const personaData = {
        userId,
        speakingStyle,
        communicationPersonality,
        strengthAreas,
        growthAreas,
        preferredPace: Math.round(avgWpm),
        confidenceLevel,
        personaDescription,
        progressInsights: {
          totalSessions: sessions.length,
          avgOverallScore: Math.round(avgOverall),
          lastUpdated: new Date()
        }
      };

      // Upsert persona
      const [persona] = await db
        .insert(speechPersona)
        .values(personaData)
        .onConflictDoUpdate({
          target: speechPersona.userId,
          set: {
            ...personaData,
            updatedAt: new Date()
          }
        })
        .returning();

      return persona;
    });
  }
}

export const storage = new DatabaseStorage();
