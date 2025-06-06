import { 
  users,
  practiceSessions, 
  coachingFeedback, 
  userProgress,
  aiInsights,
  type User, 
  type UpsertUser,
  type PracticeSession,
  type InsertPracticeSession, 
  type CoachingFeedback, 
  type InsertCoachingFeedback,
  type UserProgress,
  type InsertUserProgress,
  type AiInsight,
  type InsertAiInsight
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for authentication)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
}

export const storage = new DatabaseStorage();
