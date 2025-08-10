import { pgTable, text, serial, integer, boolean, timestamp, real, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Magic link authentication table
export const magicLinks = pgTable("magic_links", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User storage table
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
  // Enhanced personalization fields for AI coach
  industryFocus: varchar("industry_focus"),
  practiceFrequency: varchar("practice_frequency"),
  communicationStyle: varchar("communication_style"),
  learningPreference: varchar("learning_preference"), 
  motivationStyle: varchar("motivation_style"),
  confidenceLevel: varchar("confidence_level"),
  specificChallenges: text("specific_challenges").array(),
  voiceChallenges: text("voice_challenges").array(),
  bodyLanguageFocus: text("body_language_focus").array(),
  preferredFeedbackStyle: varchar("preferred_feedback_style"),
  presentationContext: varchar("presentation_context"),
  timezone: varchar("timezone"),
  preferredLanguage: varchar("preferred_language").default("en"),
  notificationPreferences: jsonb("notification_preferences"),
  practiceReminders: boolean("practice_reminders").default(true),
  weeklyGoal: integer("weekly_goal").default(3),
  themePreference: varchar("theme_preference").default("light"),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  isNewUser: boolean("is_new_user").default(true),
  welcomeMessageShown: boolean("welcome_message_shown").default(false),
  firstLoginAt: timestamp("first_login_at"),
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

// AI Coach Neural Network Profile for each user
export const aiCoachProfiles = pgTable("ai_coach_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  // Neural network weights and learning patterns
  personalityVector: jsonb("personality_vector").notNull(), // Multi-dimensional personality analysis
  learningPatterns: jsonb("learning_patterns").notNull(), // How user learns best
  communicationPreferences: jsonb("communication_preferences").notNull(), // Coaching style preferences
  performanceMetrics: jsonb("performance_metrics").notNull(), // Historical performance data
  adaptiveStrategy: varchar("adaptive_strategy").notNull(), // Current coaching approach
  coachingStyle: varchar("coaching_style").notNull(), // AI personality for this user
  focusAreas: text("focus_areas").array().notNull(), // Priority improvement areas
  neuralConfidence: real("neural_confidence").default(0.6), // AI confidence in recommendations
  lastAnalysisDate: timestamp("last_analysis_date").defaultNow(),
  trainingIterations: integer("training_iterations").default(0), // How many sessions used for training
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Persistent coaching analytics - survives session deletion
export const coachingAnalytics = pgTable("coaching_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionId: varchar("session_id"), // Reference to original session (nullable if session deleted)
  sessionDate: timestamp("session_date").notNull(),
  sessionDuration: integer("session_duration"), // Duration in seconds
  sessionPurpose: varchar("session_purpose"), // Purpose/goal of the session
  
  // Voice analytics (preserved even after session deletion)
  voiceMetrics: jsonb("voice_metrics").notNull(), // Pace, clarity, confidence, filler words
  voiceImprovements: text("voice_improvements").array(), // Identified improvement areas
  voiceStrengths: text("voice_strengths").array(), // Identified strengths
  
  // Body language analytics (preserved)
  bodyLanguageMetrics: jsonb("body_language_metrics").notNull(), // Posture, gestures, eye contact
  bodyLanguageImprovements: text("body_language_improvements").array(),
  bodyLanguageStrengths: text("body_language_strengths").array(),
  
  // Content analytics (preserved)
  contentMetrics: jsonb("content_metrics").notNull(), // Structure, engagement, clarity
  contentImprovements: text("content_improvements").array(),
  contentStrengths: text("content_strengths").array(),
  
  // Overall performance scores (preserved for trend analysis)
  overallConfidence: real("overall_confidence"),
  overallClarity: real("overall_clarity"),
  overallEngagement: real("overall_engagement"),
  overallScore: real("overall_score"),
  
  // AI coaching insights (preserved)
  aiInsights: text("ai_insights").array(), // Key coaching insights
  aiRecommendations: text("ai_recommendations").array(), // Specific recommendations
  learningPatterns: jsonb("learning_patterns"), // What AI learned about user
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User progress snapshots - maintains progress history
export const userProgressSnapshots = pgTable("user_progress_snapshots", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  snapshotDate: timestamp("snapshot_date").defaultNow().notNull(),
  
  // Progress metrics at this point in time
  totalSessions: integer("total_sessions").default(0),
  averageConfidence: real("average_confidence").default(0),
  averageClarity: real("average_clarity").default(0),
  averageEngagement: real("average_engagement").default(0),
  
  // Improvement trends
  confidenceTrend: real("confidence_trend").default(0), // Rate of improvement
  clarityTrend: real("clarity_trend").default(0),
  engagementTrend: real("engagement_trend").default(0),
  
  // Current focus areas and achievements
  currentFocusAreas: text("current_focus_areas").array(),
  recentAchievements: text("recent_achievements").array(),
  challengeAreas: text("challenge_areas").array(),
  
  // Neural network learning state
  neuralConfidence: real("neural_confidence").default(0.6),
  trainingAccuracy: real("training_accuracy").default(0.7),
  adaptiveStrategy: varchar("adaptive_strategy"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User learning insights generated by AI
export const userLearningInsights = pgTable("user_learning_insights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionId: integer("session_id").references(() => practiceSessions.id),
  insightType: varchar("insight_type").notNull(), // 'strength', 'improvement', 'pattern', 'recommendation'
  category: varchar("category").notNull(), // 'voice', 'body_language', 'content', 'confidence'
  insight: text("insight").notNull(),
  confidence: real("confidence").notNull(), // AI confidence 0-1
  priority: varchar("priority").notNull(), // 'high', 'medium', 'low'
  actionable: boolean("actionable").default(true),
  metadata: jsonb("metadata"), // Additional context data
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  videoBlob: text("video_blob"), // Video data storage
  sessionName: varchar("session_name").notNull().default("Practice Session"),
  paceScore: real("pace_score").default(0),
  gestureScore: real("gesture_score").default(0),
  overallScore: real("overall_score").default(0),
  wordsPerMinute: integer("words_per_minute").default(0),
  fillerWordCount: integer("filler_word_count").default(0),
  facialAnalysis: jsonb("facial_analysis"),
  voiceMetrics: jsonb("voice_metrics"),
  
  // Session tracking for proper numbering
  sessionNumber: integer("session_number").notNull().default(1),
  
  // Analysis tab compatible fields
  clarityScore: real("clarity_score"),
  volumeConsistency: real("volume_consistency"),
  intonationScore: real("intonation_score"),
  postureScore: real("posture_score"),
  fillerWordsUh: integer("filler_words_uh").default(0),
  fillerWordsLike: integer("filler_words_like").default(0),
  fillerWordsSo: integer("filler_words_so").default(0),
  name: varchar("name"),
  purpose: text("purpose"),
  
  // Advanced AI analysis fields
  aiAnalysis: jsonb("ai_analysis"), // Comprehensive AI analysis results
  speechPatterns: jsonb("speech_patterns"), // Pause analysis, intonation, articulation
  bodyLanguageMetrics: jsonb("body_language_metrics"), // Posture, gestures, presence
  persuasivenessScore: real("persuasiveness_score"),
  emotionalIntelligence: jsonb("emotional_intelligence"), // Emotional range, audience connection
  rhetoricAnalysis: jsonb("rhetoric_analysis"), // Rhetorical devices, argument structure
  improvementPlan: jsonb("improvement_plan"), // Personalized development roadmap
  
  // Enhanced Analytics Integration
  enhancedContentAnalysis: jsonb("enhanced_content_analysis"), // VADER sentiment, readability, complexity
  webSpeechMetrics: jsonb("web_speech_metrics"), // Web Speech API results
  performanceMetrics: jsonb("performance_metrics"), // Browser performance data
  webrtcQualityData: jsonb("webrtc_quality_data"), // Connection quality metrics
  systemAnalytics: jsonb("system_analytics"), // Device, connection, browser metrics
  realTimeAnalytics: jsonb("real_time_analytics"), // Real-time analytics data (preserving existing data)
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userSessionIdx: index("user_session_idx").on(table.userId, table.sessionNumber),
  userIdIdx: index("user_id_idx").on(table.userId),
}));

export const coachingFeedback = pgTable("coaching_feedback", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => practiceSessions.id),
  type: text("type").notNull(), // "posture", "gesture", "pace", "volume", etc.
  message: text("message").notNull(),
  severity: text("severity").notNull(), // "good", "warning", "improvement"
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Custom templates table for user-created templates
export const customTemplates = pgTable("custom_templates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  category: varchar("category").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  difficulty: varchar("difficulty").default("Beginner"),
  duration: varchar("duration").default("5-10 minutes"),
  tags: text("tags").array().default([]),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

export const insertCustomTemplateSchema = createInsertSchema(customTemplates).omit({
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

export const speechPersona = pgTable("speech_persona", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  speakingStyle: text("speaking_style"),
  communicationPersonality: text("communication_personality"),
  strengthAreas: text("strength_areas").array().default([]),
  growthAreas: text("growth_areas").array().default([]),
  preferredPace: real("preferred_pace"),
  confidenceLevel: text("confidence_level"),
  personaDescription: text("persona_description"),
  progressInsights: jsonb("progress_insights"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertSpeechPersonaSchema = createInsertSchema(speechPersona).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Leaderboard and social features
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly', 'all-time'
  category: text("category").notNull(), // 'overall', 'practice-time', 'yapx-earned', 'streaks', 'goals-completed'
  score: integer("score").notNull().default(0),
  rank: integer("rank").notNull().default(0),
  metadata: jsonb("metadata"), // Additional stats like practice sessions, total time, etc.
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialInteractions = pgTable("social_interactions", {
  id: serial("id").primaryKey(),
  fromUserId: text("from_user_id").notNull(),
  toUserId: text("to_user_id").notNull(),
  type: text("type").notNull(), // 'follow', 'like', 'comment', 'challenge', 'cheer'
  entityType: text("entity_type"), // 'achievement', 'practice-session', 'goal-completion'
  entityId: text("entity_id"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  creatorId: text("creator_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'practice-streak', 'yapx-target', 'skill-focus', 'time-challenge'
  targetValue: integer("target_value").notNull(),
  unit: text("unit").notNull(), // 'days', 'minutes', 'yapx', 'sessions'
  duration: integer("duration").notNull(), // duration in days
  reward: integer("reward").notNull().default(0), // YapX reward
  participants: text("participants").array().default([]),
  isPublic: boolean("is_public").default(true),
  status: text("status").default("active"), // 'active', 'completed', 'expired'
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challengeParticipations = pgTable("challenge_participations", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull(),
  userId: text("user_id").notNull(),
  currentProgress: integer("current_progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).omit({
  id: true,
  createdAt: true,
  calculatedAt: true,
});

export const insertSocialInteractionSchema = createInsertSchema(socialInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export const insertChallengeParticipationSchema = createInsertSchema(challengeParticipations).omit({
  id: true,
  joinedAt: true,
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
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertSocialInteraction = z.infer<typeof insertSocialInteractionSchema>;
export type SocialInteraction = typeof socialInteractions.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallengeParticipation = z.infer<typeof insertChallengeParticipationSchema>;
export type ChallengeParticipation = typeof challengeParticipations.$inferSelect;
export type InsertSpeechPersona = z.infer<typeof insertSpeechPersonaSchema>;
export type SpeechPersona = typeof speechPersona.$inferSelect;

export type InsertCustomTemplate = z.infer<typeof insertCustomTemplateSchema>;
export type CustomTemplate = typeof customTemplates.$inferSelect;

// AI Coach Profile types
export type AiCoachProfile = typeof aiCoachProfiles.$inferSelect;
export const insertAiCoachProfileSchema = createInsertSchema(aiCoachProfiles);
export type InsertAiCoachProfile = z.infer<typeof insertAiCoachProfileSchema>;

// User Learning Insights types
export type UserLearningInsight = typeof userLearningInsights.$inferSelect;
export const insertUserLearningInsightSchema = createInsertSchema(userLearningInsights);
export type InsertUserLearningInsight = z.infer<typeof insertUserLearningInsightSchema>;

// Persistent Coaching Analytics types (survives session deletion)
export type CoachingAnalytics = typeof coachingAnalytics.$inferSelect;
export const insertCoachingAnalyticsSchema = createInsertSchema(coachingAnalytics).omit({
  id: true,
  createdAt: true,
});
export type InsertCoachingAnalytics = z.infer<typeof insertCoachingAnalyticsSchema>;

// User Progress Snapshots types
export type UserProgressSnapshot = typeof userProgressSnapshots.$inferSelect;
export const insertUserProgressSnapshotSchema = createInsertSchema(userProgressSnapshots).omit({
  id: true,
  createdAt: true,
});
export type InsertUserProgressSnapshot = z.infer<typeof insertUserProgressSnapshotSchema>;
