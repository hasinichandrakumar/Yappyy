import { 
  users,
  practiceSessions, 
  coachingFeedback, 
  userProgress,
  aiInsights,
  userPreferences,
  userAchievements,
  userStreaks,
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
  type InsertUserStreak
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for authentication)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(userId: string, updates: Partial<UpsertUser>): Promise<User>;
  
  // Practice session operations
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;
  getPracticeSession(id: number): Promise<PracticeSession | undefined>;
  getUserPracticeSessions(userId: string): Promise<PracticeSession[]>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
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
    return await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.createdAt));
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
}

export const storage = new DatabaseStorage();
