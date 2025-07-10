import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Simple demo authentication middleware
export const demoAuth: RequestHandler = async (req: any, res, next) => {
  // Check if user is already authenticated
  if (req.user) {
    return next();
  }

  // For demo purposes, automatically authenticate as demo user
  try {
    const demoUser = await storage.getUser("demo-user-123");
    if (demoUser) {
      req.user = demoUser;
      return next();
    }
  } catch (error) {
    console.error("Demo auth error:", error);
  }
  
  res.status(401).json({ message: "Authentication required" });
};

export function setupDemoAuth(app: Express) {
  // Demo login route that mirrors main sign-in
  app.get("/api/auth/demo", async (req: any, res) => {
    try {
      // Enhanced demo user with more realistic profile data
      const demoUser = {
        id: "demo-user-123",
        email: "demo@yappyy.com",
        firstName: "Alex",
        lastName: "Demo",
        profileImageUrl: "",
        bio: "Aspiring public speaker looking to improve communication skills",
        jobTitle: "Marketing Manager",
        company: "Tech Startup Inc.",
        speakingGoals: ["Improve presentation skills", "Better quarterly reviews", "Confident client pitches"],
        experienceLevel: "intermediate",
        timezone: "America/New_York",
        preferredLanguage: "en",
        notificationPreferences: { email: true, push: true, sms: false },
        practiceReminders: true,
        weeklyGoal: 3,
        themePreference: "light",
        hasCompletedOnboarding: true,
        onboardingCompletedAt: new Date()
      };

      const user = await storage.upsertUser(demoUser);
      
      // Set user in session with proper session management
      if (req.session) {
        req.session.userId = user.id;
        req.session.save((err: any) => {
          if (err) {
            console.error("Session save error:", err);
          }
        });
      }
      req.user = user;
      
      // Create sample practice sessions for demo using correct schema
      try {
        const demoSessions = [
          {
            userId: user.id,
            duration: 180,
            averageWPM: 145,
            confidenceScore: 85,
            voiceClarity: 88,
            fillerWords: 8,
            pauseCount: 12,
            eyeContactScore: "good",
            transcript: "Sample interview practice transcript discussing marketing experience and career goals.",
            coachingTips: ["Reduce filler words", "More confident body language", "Stronger conclusion"],
            sessionName: "Job Interview Practice",
            sessionPurpose: "Prepare for senior marketing manager position interview",
            feedbackSummary: "Strong overall performance with room for improvement in confidence delivery",
            improvementAreas: ["filler_words", "body_language", "conclusion_strength"]
          },
          {
            userId: user.id,
            duration: 240,
            averageWPM: 135,
            confidenceScore: 88,
            voiceClarity: 91,
            fillerWords: 5,
            pauseCount: 8,
            eyeContactScore: "excellent",
            transcript: "Quarterly presentation covering Q3 marketing metrics, ROI analysis, and strategic recommendations.",
            coachingTips: ["Increase volume slightly", "Add more engaging examples", "Maintain eye contact"],
            sessionName: "Quarterly Presentation",
            sessionPurpose: "Present Q3 marketing metrics to executive team",
            feedbackSummary: "Excellent data-driven presentation with clear structure and confident delivery",
            improvementAreas: ["volume_control", "storytelling", "audience_engagement"]
          }
        ];

        for (const sessionData of demoSessions) {
          await storage.createPracticeSession(sessionData);
        }
      } catch (sessionError) {
        console.log("Demo sessions already exist or creation skipped");
      }

      // Create user progress data for demo
      try {
        await storage.updateUserProgress({
          userId: user.id,
          metric: "sessions_completed",
          value: 2,
          improvementPercentage: 15.5
        });

        await storage.updateUserProgress({
          userId: user.id,
          metric: "total_practice_time",
          value: 420, // 7 minutes total
          improvementPercentage: 0
        });

        await storage.updateUserProgress({
          userId: user.id,
          metric: "average_confidence",
          value: 86.5,
          improvementPercentage: 8.2
        });
      } catch (progressError) {
        console.log("Demo progress data already exists");
      }

      // Create achievements for demo
      try {
        await storage.addUserAchievement({
          userId: user.id,
          achievementType: "first_session",
          achievementName: "First Steps",
          description: "Completed your first practice session",
          metadata: { points: 10, rarity: "common" }
        });
      } catch (achievementError) {
        console.log("Demo achievements already exist");
      }

      // Create streak data for demo
      try {
        await storage.upsertUserStreak(user.id, "daily_practice", {
          currentStreak: 3,
          longestStreak: 5,
          lastActivityDate: new Date()
        });
      } catch (streakError) {
        console.log("Demo streak data already exists");
      }

      console.log("Demo user authenticated with complete profile and realistic data");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Demo auth setup error:", error);
      res.redirect("/?error=demo_auth_error");
    }
  });

  // Simple auth check route
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      // Check session first
      if (req.session?.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          req.user = user;
          return res.json(user);
        }
      }
      
      // Check if user is authenticated via passport (Google OAuth)
      if (req.user) {
        return res.json(req.user);
      }
      
      // Return 401 if no authentication found - don't auto-login demo user
      res.status(401).json({ message: "Authentication required" });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(401).json({ message: "Authentication required" });
    }
  });

  // Logout route
  app.get("/api/auth/logout", (req: any, res) => {
    if (req.session) {
      req.session.destroy();
    }
    req.user = null;
    res.redirect("/");
  });
}