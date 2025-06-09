import { pgTable, text, serial, integer, boolean, timestamp, real, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Google Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Google Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  jobTitle: varchar("job_title"),
  company: varchar("company"),
  speakingGoals: text("speaking_goals").array(),
  experienceLevel: varchar("experience_level"),
  timezone: varchar("timezone"),
  preferredLanguage: varchar("preferred_language").default("en"),
  notificationPreferences: jsonb("notification_preferences"),
  practiceReminders: boolean("practice_reminders").default(true),
  weeklyGoal: integer("weekly_goal").default(3),
  themePreference: varchar("theme_preference").default("light"),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  category: varchar("category").notNull(),
  setting: varchar("setting").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementType: varchar("achievement_type").notNull(),
  achievementName: varchar("achievement_name").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

export const userStreaks = pgTable("user_streaks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  streakType: varchar("streak_type").notNull(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastPracticeDate: timestamp("last_practice_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Practice sessions table with enhanced AI analysis
export const practiceSessions = pgTable("practice_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  duration: integer("duration").notNull(), // in seconds
  averageWPM: integer("average_wpm").notNull(),
  confidenceScore: real("confidence_score").notNull(),
  voiceClarity: real("voice_clarity").notNull(),
  fillerWords: integer("filler_words").notNull(),
  pauseCount: integer("pause_count").notNull(),
  eyeContactScore: text("eye_contact_score").notNull(),
  transcript: text("transcript").notNull(),
  coachingTips: text("coaching_tips").array().notNull(),
  videoBlob: text("video_blob"), // base64 encoded video data
  // Advanced AI analysis fields
  aiAnalysis: jsonb("ai_analysis"), // Comprehensive AI analysis results
  speechPatterns: jsonb("speech_patterns"), // Pause analysis, intonation, articulation
  bodyLanguageMetrics: jsonb("body_language_metrics"), // Posture, gestures, presence
  persuasivenessScore: real("persuasiveness_score"),
  emotionalIntelligence: jsonb("emotional_intelligence"), // Emotional range, audience connection
  rhetoricAnalysis: jsonb("rhetoric_analysis"), // Rhetorical devices, argument structure
  improvementPlan: jsonb("improvement_plan"), // Personalized development roadmap
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coachingFeedback = pgTable("coaching_feedback", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => practiceSessions.id),
  type: text("type").notNull(), // "posture", "gesture", "pace", "volume", etc.
  message: text("message").notNull(),
  severity: text("severity").notNull(), // "good", "warning", "improvement"
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// User progress tracking for advanced AI features
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  skillArea: varchar("skill_area", { length: 100 }).notNull(), // voice_control, body_language, content_structure, etc.
  currentLevel: integer("current_level").notNull().default(1),
  totalSessions: integer("total_sessions").notNull().default(0),
  averageScore: real("average_score").notNull().default(0),
  improvementRate: real("improvement_rate").notNull().default(0),
  lastPracticed: timestamp("last_practiced").defaultNow(),
  personalizedGoals: jsonb("personalized_goals"), // AI-generated development goals
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI coaching insights
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  insightType: varchar("insight_type", { length: 50 }).notNull(), // speaking_pattern, improvement_trend, strength_area
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  actionItems: jsonb("action_items"), // Specific recommendations
  priority: integer("priority").notNull().default(1), // 1-5 priority level
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertPracticeSessionSchema = createInsertSchema(practiceSessions).omit({
  id: true,
  createdAt: true,
});

export const insertCoachingFeedbackSchema = createInsertSchema(coachingFeedback).omit({
  id: true,
  timestamp: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastPracticed: true,
  updatedAt: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

export const insertUserStreakSchema = createInsertSchema(userStreaks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const dailyGoals = pgTable("daily_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  goalType: varchar("goal_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0),
  unit: varchar("unit").notNull(),
  points: integer("points").default(0),
  difficulty: varchar("difficulty").notNull(),
  category: varchar("category").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  dateAssigned: timestamp("date_assigned").defaultNow(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDailyGoalSchema = createInsertSchema(dailyGoals).omit({
  id: true,
  dateAssigned: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type PracticeSession = typeof practiceSessions.$inferSelect;
export type InsertCoachingFeedback = z.infer<typeof insertCoachingFeedbackSchema>;
export type CoachingFeedback = typeof coachingFeedback.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;
export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;
export type UserStreak = typeof userStreaks.$inferSelect;
export type InsertDailyGoal = z.infer<typeof insertDailyGoalSchema>;
export type DailyGoal = typeof dailyGoals.$inferSelect;
