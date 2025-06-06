import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coachingFeedback = pgTable("coaching_feedback", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id),
  type: text("type").notNull(), // "posture", "gesture", "pace", "volume", etc.
  message: text("message").notNull(),
  severity: text("severity").notNull(), // "good", "warning", "improvement"
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertCoachingFeedbackSchema = createInsertSchema(coachingFeedback).omit({
  id: true,
  timestamp: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertCoachingFeedback = z.infer<typeof insertCoachingFeedbackSchema>;
export type CoachingFeedback = typeof coachingFeedback.$inferSelect;
