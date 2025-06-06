import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema, insertCoachingFeedbackSchema } from "@shared/schema";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Get specific session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Create new session
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data", error: error.message });
    }
  });

  // Add coaching feedback
  app.post("/api/coaching-feedback", async (req, res) => {
    try {
      const validatedData = insertCoachingFeedbackSchema.parse(req.body);
      const feedback = await storage.addCoachingFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(400).json({ message: "Invalid feedback data", error: error.message });
    }
  });

  // Get coaching feedback for session
  app.get("/api/sessions/:id/feedback", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const feedback = await storage.getSessionFeedback(sessionId);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Analyze speech for coaching tips
  app.post("/api/analyze-speech", async (req, res) => {
    try {
      const { transcript, metrics } = req.body;
      
      if (!transcript || !metrics) {
        return res.status(400).json({ message: "Transcript and metrics are required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert public speaking coach. Analyze the speech transcript and metrics to provide actionable coaching tips. Respond with JSON in this format: { 'tips': [{ 'type': 'posture|gesture|pace|volume|clarity|eye_contact', 'message': 'tip message', 'severity': 'good|warning|improvement' }] }"
          },
          {
            role: "user",
            content: `Analyze this speech:
            
Transcript: ${transcript}

Metrics:
- Speaking pace: ${metrics.speakingPace} WPM
- Voice clarity: ${metrics.voiceClarity}%
- Confidence: ${metrics.confidenceScore}%
- Filler words: ${metrics.fillerWords}
- Pauses: ${metrics.pauseCount}

Provide specific, actionable coaching tips to improve this presentation.`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze speech", error: error.message });
    }
  });

  // Analyze posture from image
  app.post("/api/analyze-posture", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ message: "Image data is required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this person's posture and body language for public speaking. Focus on: posture, hand gestures, eye contact direction, and overall presence. Respond with JSON in this format: { 'posture': 'good|needs_improvement', 'gesture': 'open|closed|neutral', 'eyeContact': 'good|poor', 'feedback': 'specific feedback message' }"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze posture", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
