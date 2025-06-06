import { sessions, coachingFeedback, type Session, type InsertSession, type CoachingFeedback, type InsertCoachingFeedback } from "@shared/schema";

export interface IStorage {
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: number): Promise<Session | undefined>;
  getAllSessions(): Promise<Session[]>;
  addCoachingFeedback(feedback: InsertCoachingFeedback): Promise<CoachingFeedback>;
  getSessionFeedback(sessionId: number): Promise<CoachingFeedback[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<number, Session>;
  private coachingFeedback: Map<number, CoachingFeedback>;
  private currentSessionId: number;
  private currentFeedbackId: number;

  constructor() {
    this.sessions = new Map();
    this.coachingFeedback = new Map();
    this.currentSessionId = 1;
    this.currentFeedbackId = 1;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
      videoBlob: insertSession.videoBlob || null,
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async addCoachingFeedback(insertFeedback: InsertCoachingFeedback): Promise<CoachingFeedback> {
    const id = this.currentFeedbackId++;
    const feedback: CoachingFeedback = {
      type: insertFeedback.type,
      message: insertFeedback.message,
      severity: insertFeedback.severity,
      sessionId: insertFeedback.sessionId || null,
      id,
      timestamp: new Date(),
    };
    this.coachingFeedback.set(id, feedback);
    return feedback;
  }

  async getSessionFeedback(sessionId: number): Promise<CoachingFeedback[]> {
    return Array.from(this.coachingFeedback.values())
      .filter(feedback => feedback.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}

export const storage = new MemStorage();
