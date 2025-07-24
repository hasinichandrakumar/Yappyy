import { db } from "./db";
import { users, dailyGoals, practiceSessions } from "@shared/schema";
import { eq, and, gte, desc } from "drizzle-orm";

export interface OnboardingResult {
  isNewUser: boolean;
  shouldShowWelcome: boolean;
  shouldShowDailyGoals: boolean;
  sessionCount: number;
  dailyGoals?: any[];
}

export class UserOnboardingService {
  
  async checkUserOnboardingStatus(userId: string): Promise<OnboardingResult> {
    try {
      // Get user data
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user) {
        throw new Error('User not found');
      }

      // Count user's practice sessions
      const sessionCount = await db.$count(practiceSessions, eq(practiceSessions.userId, userId));
      
      // Determine user status
      const isNewUser = sessionCount === 0;
      const shouldShowWelcome = isNewUser && !user.welcomeMessageShown;
      
      // Get today's daily goals for returning users
      let dailyGoalsData = [];
      let shouldShowDailyGoals = false;
      
      if (!isNewUser) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        dailyGoalsData = await db.select().from(dailyGoals)
          .where(and(
            eq(dailyGoals.userId, userId),
            gte(dailyGoals.dateAssigned, today),
            gte(tomorrow, dailyGoals.dateAssigned)
          ))
          .orderBy(desc(dailyGoals.createdAt));
          
        // Show daily goals if user has goals and hasn't seen them today
        shouldShowDailyGoals = dailyGoalsData.length > 0;
      }

      return {
        isNewUser,
        shouldShowWelcome,
        shouldShowDailyGoals,
        sessionCount,
        dailyGoals: dailyGoalsData
      };
      
    } catch (error) {
      console.error('Onboarding check error:', error);
      // Fallback for errors
      return {
        isNewUser: true,
        shouldShowWelcome: false,
        shouldShowDailyGoals: false,
        sessionCount: 0
      };
    }
  }

  async markWelcomeMessageShown(userId: string): Promise<void> {
    try {
      await db.update(users)
        .set({ 
          welcomeMessageShown: true,
          firstLoginAt: new Date()
        })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error marking welcome message shown:', error);
    }
  }

  async createDailyGoals(userId: string): Promise<any[]> {
    try {
      // Get user's session count to personalize goals
      const sessionCount = await db.$count(practiceSessions, eq(practiceSessions.userId, userId));
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Check if user already has goals for today
      const existingGoals = await db.select().from(dailyGoals)
        .where(and(
          eq(dailyGoals.userId, userId),
          gte(dailyGoals.dateAssigned, today)
        ));
        
      if (existingGoals.length > 0) {
        return existingGoals;
      }

      // Create personalized daily goals based on experience
      const goals = this.generatePersonalizedGoals(sessionCount);
      
      const goalPromises = goals.map(goal => 
        db.insert(dailyGoals).values({
          userId,
          ...goal,
          expiresAt: tomorrow
        }).returning()
      );
      
      const createdGoals = await Promise.all(goalPromises);
      return createdGoals.map(result => result[0]);
      
    } catch (error) {
      console.error('Error creating daily goals:', error);
      return [];
    }
  }

  private generatePersonalizedGoals(sessionCount: number) {
    const baseGoals = [
      {
        goalType: 'practice_session',
        title: 'Complete a Practice Session',
        description: 'Start building your speaking confidence with a focused practice session',
        targetValue: 1,
        currentValue: 0,
        unit: 'session',
        points: 50,
        difficulty: 'Easy',
        category: 'Practice'
      },
      {
        goalType: 'speaking_time',
        title: 'Speak for 3 Minutes',
        description: 'Practice speaking continuously for at least 3 minutes to build fluency',
        targetValue: 180,
        currentValue: 0,
        unit: 'seconds',
        points: 75,
        difficulty: 'Medium',
        category: 'Voice'
      }
    ];

    // Add experience-based goals
    if (sessionCount > 5) {
      baseGoals.push({
        goalType: 'confidence_score',
        title: 'Achieve 80% Confidence',
        description: 'Demonstrate strong confidence in your speaking delivery',
        targetValue: 80,
        currentValue: 0,
        unit: 'percentage',
        points: 100,
        difficulty: 'Hard',
        category: 'Performance'
      });
    }

    if (sessionCount > 10) {
      baseGoals.push({
        goalType: 'filler_words',
        title: 'Minimize Filler Words',
        description: 'Keep filler words under 5 in a single session',
        targetValue: 5,
        currentValue: 0,
        unit: 'count',
        points: 125,
        difficulty: 'Hard',
        category: 'Speech Quality'
      });
    }

    return baseGoals.slice(0, 2); // Return max 2 goals per day
  }

  async updateGoalProgress(userId: string, goalType: string, value: number): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [goal] = await db.select().from(dailyGoals)
        .where(and(
          eq(dailyGoals.userId, userId),
          eq(dailyGoals.goalType, goalType),
          gte(dailyGoals.dateAssigned, today),
          eq(dailyGoals.isCompleted, false)
        ))
        .limit(1);

      if (!goal) return;

      const newCurrentValue = Math.min(goal.currentValue + value, goal.targetValue);
      const isCompleted = newCurrentValue >= goal.targetValue;

      await db.update(dailyGoals)
        .set({
          currentValue: newCurrentValue,
          isCompleted,
          completedAt: isCompleted ? new Date() : null
        })
        .where(eq(dailyGoals.id, goal.id));

    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  }
}

export const userOnboardingService = new UserOnboardingService();