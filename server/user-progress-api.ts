import type { Express } from "express";
import { db } from "./db";
import { users, practiceSessions, userProgress, aiInsights, coachingAnalytics } from "@shared/schema";
import { eq, desc, asc, avg, count, sum, and, gte, sql } from "drizzle-orm";
import { isAuthenticated } from "./googleAuth";

export function setupUserProgressAPI(app: Express) {
  // Get comprehensive user progress dashboard
  app.get('/api/user/progress/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get overall progress stats
      const progressStats = await db
        .select({
          skillArea: userProgress.skillArea,
          currentLevel: userProgress.currentLevel,
          totalSessions: userProgress.totalSessions,
          averageScore: userProgress.averageScore,
          improvementRate: userProgress.improvementRate,
          lastPracticed: userProgress.lastPracticed,
          personalizedGoals: userProgress.personalizedGoals
        })
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .orderBy(desc(userProgress.lastPracticed));

      // Get recent practice sessions (last 10)
      const recentSessions = await db
        .select({
          id: practiceSessions.id,
          sessionNumber: practiceSessions.sessionNumber,
          sessionName: practiceSessions.sessionName,
          overallScore: practiceSessions.overallScore,
          confidenceScore: practiceSessions.confidenceScore,
          voiceClarity: practiceSessions.voiceClarity,
          duration: practiceSessions.duration,
          createdAt: practiceSessions.createdAt,
          averageWPM: practiceSessions.averageWPM,
          fillerWords: practiceSessions.fillerWords,
        })
        .from(practiceSessions)
        .where(eq(practiceSessions.userId, userId))
        .orderBy(desc(practiceSessions.createdAt))
        .limit(10);

      // Get improvement trends (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const improvementTrends = await db
        .select({
          date: sql`DATE(${practiceSessions.createdAt})`.as('date'),
          avgOverallScore: avg(practiceSessions.overallScore).as('avgOverallScore'),
          avgConfidenceScore: avg(practiceSessions.confidenceScore).as('avgConfidenceScore'),
          avgVoiceClarity: avg(practiceSessions.voiceClarity).as('avgVoiceClarity'),
          sessionCount: count(practiceSessions.id).as('sessionCount')
        })
        .from(practiceSessions)
        .where(and(
          eq(practiceSessions.userId, userId),
          gte(practiceSessions.createdAt, thirtyDaysAgo)
        ))
        .groupBy(sql`DATE(${practiceSessions.createdAt})`)
        .orderBy(asc(sql`DATE(${practiceSessions.createdAt})`));

      // Get total statistics
      const totalStats = await db
        .select({
          totalSessions: count(practiceSessions.id),
          totalDuration: sum(practiceSessions.duration),
          avgOverallScore: avg(practiceSessions.overallScore),
          avgConfidenceScore: avg(practiceSessions.confidenceScore),
          avgVoiceClarity: avg(practiceSessions.voiceClarity)
        })
        .from(practiceSessions)
        .where(eq(practiceSessions.userId, userId));

      // Get latest AI insights
      const latestInsights = await db
        .select()
        .from(aiInsights)
        .where(eq(aiInsights.userId, userId))
        .orderBy(desc(aiInsights.createdAt))
        .limit(5);

      res.json({
        success: true,
        data: {
          progressStats,
          recentSessions,
          improvementTrends,
          totalStats: totalStats[0] || {
            totalSessions: 0,
            totalDuration: 0,
            avgOverallScore: 0,
            avgConfidenceScore: 0,
            avgVoiceClarity: 0
          },
          latestInsights
        }
      });

    } catch (error) {
      console.error('Error fetching user progress dashboard:', error);
      res.status(500).json({ error: 'Failed to fetch progress data' });
    }
  });

  // Get detailed progress for a specific skill area
  app.get('/api/user/progress/skill/:skillArea', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const { skillArea } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get skill-specific progress
      const skillProgress = await db
        .select()
        .from(userProgress)
        .where(and(
          eq(userProgress.userId, userId),
          eq(userProgress.skillArea, skillArea)
        ));

      // Get recent sessions related to this skill
      const skillSessions = await db
        .select()
        .from(practiceSessions)
        .where(eq(practiceSessions.userId, userId))
        .orderBy(desc(practiceSessions.createdAt))
        .limit(20);

      res.json({
        success: true,
        data: {
          skillProgress: skillProgress[0] || null,
          relatedSessions: skillSessions
        }
      });

    } catch (error) {
      console.error('Error fetching skill progress:', error);
      res.status(500).json({ error: 'Failed to fetch skill progress' });
    }
  });

  // Update user progress for a skill area
  app.post('/api/user/progress/update', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const { skillArea, sessionScore, sessionData } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get existing progress
      const existingProgress = await db
        .select()
        .from(userProgress)
        .where(and(
          eq(userProgress.userId, userId),
          eq(userProgress.skillArea, skillArea)
        ));

      if (existingProgress.length > 0) {
        // Update existing progress
        const current = existingProgress[0];
        const newTotalSessions = current.totalSessions + 1;
        const newAverageScore = ((current.averageScore * current.totalSessions) + sessionScore) / newTotalSessions;
        const improvementRate = sessionScore > current.averageScore ? 
          ((sessionScore - current.averageScore) / current.averageScore) * 100 : 0;

        await db
          .update(userProgress)
          .set({
            totalSessions: newTotalSessions,
            averageScore: newAverageScore,
            improvementRate: improvementRate,
            lastPracticed: new Date(),
            updatedAt: new Date()
          })
          .where(and(
            eq(userProgress.userId, userId),
            eq(userProgress.skillArea, skillArea)
          ));

      } else {
        // Create new progress entry
        await db
          .insert(userProgress)
          .values({
            userId,
            skillArea,
            currentLevel: 1,
            totalSessions: 1,
            averageScore: sessionScore,
            improvementRate: 0,
            lastPracticed: new Date()
          });
      }

      res.json({ success: true, message: 'Progress updated successfully' });

    } catch (error) {
      console.error('Error updating user progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  });

  // Get user's achievement milestones
  app.get('/api/user/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Calculate achievements based on practice data
      const totalStats = await db
        .select({
          totalSessions: count(practiceSessions.id),
          totalDuration: sum(practiceSessions.duration),
          avgOverallScore: avg(practiceSessions.overallScore),
          bestScore: sql`MAX(${practiceSessions.overallScore})`.as('bestScore'),
          firstSession: sql`MIN(${practiceSessions.createdAt})`.as('firstSession')
        })
        .from(practiceSessions)
        .where(eq(practiceSessions.userId, userId));

      const stats = totalStats[0];
      
      // Define achievement criteria
      const achievements = [
        {
          id: 'first_session',
          title: 'First Steps',
          description: 'Complete your first practice session',
          unlocked: (stats?.totalSessions || 0) >= 1,
          icon: '🎯'
        },
        {
          id: 'session_streak_5',
          title: 'Consistency Builder',
          description: 'Complete 5 practice sessions',
          unlocked: (stats?.totalSessions || 0) >= 5,
          icon: '🔥'
        },
        {
          id: 'session_streak_25',
          title: 'Dedicated Learner',
          description: 'Complete 25 practice sessions',
          unlocked: (stats?.totalSessions || 0) >= 25,
          icon: '⭐'
        },
        {
          id: 'high_score_80',
          title: 'Excellence Achieved',
          description: 'Score 80% or higher in a session',
          unlocked: (stats?.bestScore || 0) >= 0.8,
          icon: '🏆'
        },
        {
          id: 'total_time_60min',
          title: 'Time Investment',
          description: 'Practice for over 1 hour total',
          unlocked: (stats?.totalDuration || 0) >= 3600,
          icon: '⏰'
        },
        {
          id: 'avg_score_70',
          title: 'Consistent Performer',
          description: 'Maintain 70% average score',
          unlocked: (stats?.avgOverallScore || 0) >= 0.7,
          icon: '📈'
        }
      ];

      res.json({
        success: true,
        data: {
          achievements,
          stats,
          unlockedCount: achievements.filter(a => a.unlocked).length,
          totalCount: achievements.length
        }
      });

    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  });

  // Get user's practice streak information
  app.get('/api/user/streak', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get recent sessions to calculate streak
      const recentSessions = await db
        .select({
          date: sql`DATE(${practiceSessions.createdAt})`.as('date'),
          sessionCount: count(practiceSessions.id).as('sessionCount')
        })
        .from(practiceSessions)
        .where(eq(practiceSessions.userId, userId))
        .groupBy(sql`DATE(${practiceSessions.createdAt})`)
        .orderBy(desc(sql`DATE(${practiceSessions.createdAt})`))
        .limit(30);

      // Calculate current streak
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < recentSessions.length; i++) {
        const sessionDate = new Date(recentSessions[i].date as string);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (sessionDate.getTime() === expectedDate.getTime()) {
          if (i === 0 || currentStreak > 0) {
            currentStreak++;
          }
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
          if (i === 0) {
            currentStreak = 0;
          }
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);

      res.json({
        success: true,
        data: {
          currentStreak,
          longestStreak,
          lastPracticeDate: recentSessions.length > 0 ? recentSessions[0].date : null,
          recentActivity: recentSessions.slice(0, 7) // Last 7 days
        }
      });

    } catch (error) {
      console.error('Error fetching practice streak:', error);
      res.status(500).json({ error: 'Failed to fetch streak data' });
    }
  });
}