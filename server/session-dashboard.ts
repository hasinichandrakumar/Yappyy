import { eq, desc, sql } from "drizzle-orm";
import { db } from "./db";
import { practiceSessions } from "@shared/schema";

export async function createSessionDashboardEndpoint(app: any, getUserId: (req: any) => string) {
  // Session Dashboard with proper numbering
  app.get("/api/sessions/dashboard", async (req: any, res: any) => {
    try {
      const userId = getUserId(req);
      
      // Get all sessions for the user with proper ordering by session number
      const sessions = await db
        .select({
          id: practiceSessions.id,
          sessionNumber: practiceSessions.sessionNumber,
          sessionName: practiceSessions.sessionName,
          transcript: practiceSessions.transcript,
          duration: practiceSessions.duration,
          confidenceScore: practiceSessions.confidenceScore,
          voiceClarity: practiceSessions.voiceClarity,
          overallScore: practiceSessions.overallScore,
          hasVideo: sql<boolean>`CASE WHEN ${practiceSessions.videoBlob} IS NOT NULL THEN true ELSE false END`,
          createdAt: practiceSessions.createdAt
        })
        .from(practiceSessions)
        .where(eq(practiceSessions.userId, userId))
        .orderBy(desc(practiceSessions.sessionNumber));
      
      // Get user stats - Values are already stored as percentages in the database
      const stats = {
        totalSessions: sessions.length,
        averageConfidence: sessions.length > 0 ? 
          Math.round(sessions.reduce((sum, s) => sum + (s.confidenceScore || 0), 0) / sessions.length) : 0,
        averageClarity: sessions.length > 0 ? 
          Math.round(sessions.reduce((sum, s) => sum + (s.voiceClarity || 0), 0) / sessions.length) : 0,
        totalDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        sessionsWithVideo: sessions.filter(s => s.hasVideo).length
      };
      
      // Determine if user is new (no sessions)
      const isNewUser = sessions.length === 0;
      const nextSessionNumber = sessions.length > 0 ? Math.max(...sessions.map(s => s.sessionNumber || 1)) + 1 : 1;
      
      console.log(`📊 Session dashboard for ${userId}: ${sessions.length} sessions, next: ${nextSessionNumber}`);
      
      res.json({
        sessions: sessions.map(session => ({
          ...session,
          confidenceScore: Math.round(session.confidenceScore || 0),
          voiceClarity: Math.round(session.voiceClarity || 0),
          overallScore: Math.round(session.overallScore || 0),
          hasTranscript: !!session.transcript
        })),
        stats,
        isNewUser,
        nextSessionNumber,
        userType: userId === 'guest' ? 'guest' : 'authenticated'
      });
      
    } catch (error: any) {
      console.error('❌ Failed to get session dashboard:', error);
      res.status(500).json({ 
        error: "Failed to get session dashboard", 
        message: error.message 
      });
    }
  });
}

// Helper function to get next session number for a user
export async function getNextSessionNumber(userId: string): Promise<number> {
  try {
    const result = await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.sessionNumber))
      .limit(1);
    
    const lastSessionNumber = result[0]?.sessionNumber || 0;
    return lastSessionNumber + 1;
  } catch (error) {
    console.error("Error getting next session number:", error);
    return 1;
  }
}