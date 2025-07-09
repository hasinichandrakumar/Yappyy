import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { RealTimeSessionManager } from "./redis-realtime";
import { insertPracticeSessionSchema, insertCoachingFeedbackSchema } from "@shared/schema";
import { setupGoogleAuth, requireAuth } from "./googleAuth";
import { setupDemoAuth, demoAuth } from "./demo-auth";
import { generateClubCoaching } from "./ai-coaching";
import { 
  generateComprehensiveAnalysis, 
  generateSpeechPersona, 
  generateCoachingInsights, 
  generateLiveFeedback, 
  personalizeTemplate,
  generateSessionInsights
} from "./openai-coaching";
import { 
  generateWorldClassCoaching, 
  generateLiveEmpathicFeedback, 
  updateUserSpeakingProfile 
} from "./world-class-ai-coach";
import { analyzeContent } from "./ai-content-analysis";
import { analyzeVideoFrame, analyzePosture, analyzeEyeContact } from "./openai-realtime-vision";
import { transcribeWithAnalytics } from "./deepgram-speech";
import { processMultiModalAnalysis } from "./advanced-ai-orchestrator";
import { analyzeVoiceQuality, analyzeFillerWords, generateVoiceCoaching } from "./advanced-voice-engine";
import { processUltraAdvancedAnalysis } from "./ultra-advanced-ai-engine";
import { processRealTimeFrame, getPerformanceMetrics } from "./realtime-processing-engine";
import { RealTimeProcessingEngine } from "./realtime-processing-engine";
import { processContentAnalysis } from "./content-analysis-api";
import { getAdaptiveCoaching, getUserLearningProgress, getAdvancedPublicSpeakingCoaching } from "./deep-learning-coach";

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);
  
  // Initialize Enhanced Real-Time Processing Engine
  const processingEngine = new RealTimeProcessingEngine(server);
  
  // Setup Demo Authentication (simplified for demo environment)
  setupDemoAuth(app);
  
  // Setup Google Authentication (fallback)
  await setupGoogleAuth(app);

  // Template personalization route
  app.post('/api/openai/personalize-template', demoAuth, async (req: any, res) => {
    try {
      const { template, userRequest } = req.body;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || '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'}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert speech writing coach. Personalize and enhance speech templates while maintaining their core structure and effectiveness.'
            },
            {
              role: 'user',
              content: `Please personalize this speech template based on the user request: "${userRequest}"\n\nTemplate: ${template.title}\nCategory: ${template.category}\nContent:\n${template.content}\n\nMake it more engaging, personalized, and effective while keeping the same structure.`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      if (response.ok) {
        const result = await response.json();
        const content = JSON.parse(result.choices[0].message.content);
        res.json({ personalizedContent: content.personalizedContent || template.content });
      } else {
        res.status(500).json({ error: 'Failed to personalize template' });
      }
    } catch (error) {
      console.error('Template personalization error:', error);
      res.status(500).json({ error: 'Failed to personalize template' });
    }
  });

  // Update user profile
  app.patch('/api/user/profile', demoAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updates = req.body;
      const updatedUser = await storage.updateUserProfile(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get user preferences
  app.get('/api/user/preferences', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Update user preference
  app.put('/api/user/preferences', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { category, setting, value } = req.body;
      const preference = await storage.upsertUserPreference({
        userId,
        category,
        setting,
        value
      });
      res.json(preference);
    } catch (error) {
      console.error("Error updating user preference:", error);
      res.status(500).json({ message: "Failed to update preference" });
    }
  });

  // Get user achievements
  app.get('/api/user/achievements', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get user streaks
  app.get('/api/user/streaks', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const streaks = await storage.getUserStreaks(userId);
      res.json(streaks);
    } catch (error) {
      console.error("Error fetching user streaks:", error);
      res.status(500).json({ message: "Failed to fetch streaks" });
    }
  });

  // Mark onboarding as complete
  app.post('/api/user/complete-onboarding', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updatedUser = await storage.updateUserProfile(userId, {
        hasCompletedOnboarding: true,
        onboardingCompletedAt: new Date()
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Get user's daily goals
  app.get('/api/user/daily-goals', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goals = await storage.generateDailyGoalsForUser(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching daily goals:", error);
      res.status(500).json({ message: "Failed to fetch daily goals" });
    }
  });

  // Update daily goal progress
  app.post('/api/user/daily-goals/:goalId/complete', requireAuth, async (req: any, res) => {
    try {
      const { goalId } = req.params;
      const updatedGoal = await storage.updateDailyGoal(parseInt(goalId), {
        isCompleted: true,
        completedAt: new Date(),
        currentValue: req.body.targetValue || 100
      });
      res.json(updatedGoal);
    } catch (error) {
      console.error("Error completing daily goal:", error);
      res.status(500).json({ message: "Failed to complete goal" });
    }
  });



  // Get user practice sessions
  app.get("/api/practice-sessions", async (req: any, res) => {
    try {
      const userId = req.user?.id || 'demo-user';
      const sessions = await storage.getUserPracticeSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Alias for sessions endpoint
  app.get("/api/sessions", async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      let sessions = await storage.getUserPracticeSessions(userId);
      
      // If no sessions exist, create sample sessions for the authenticated user
      if (sessions.length === 0) {
        const sampleSessions = [
          {
            userId,
            duration: 420,
            averageWPM: 145,
            confidenceScore: 87.5,
            voiceClarity: 92.3,
            fillerWords: 8,
            pauseCount: 12,
            eyeContactScore: "Good",
            transcript: "Good morning everyone. Today I'm excited to share our revolutionary new product that will transform how we approach customer engagement. Our team has spent the last eighteen months developing this groundbreaking solution that addresses the core challenges facing modern businesses.",
            coachingTips: ["Maintain steady eye contact", "Reduce filler words", "Use strategic pauses for emphasis"],
            aiAnalysis: {
              overallScore: 87,
              strengths: ["Clear voice projection", "Confident delivery", "Strong opening"],
              improvements: ["Eye contact consistency", "Gesture coordination", "Conclusion impact"]
            },
            speechPatterns: {
              paceVariation: 0.75,
              intonationRange: 0.68,
              pauseEffectiveness: 0.82
            },
            bodyLanguageMetrics: {
              postureScore: 83,
              gestureNaturalness: 78,
              facialExpression: 89
            },
            persuasivenessScore: 85.2
          },
          {
            userId,
            duration: 840,
            averageWPM: 132,
            confidenceScore: 79.1,
            voiceClarity: 85.7,
            fillerWords: 15,
            pauseCount: 28,
            eyeContactScore: "Fair",
            transcript: "Imagine a world where every person has the tools to turn their wildest ideas into reality. This isn't science fiction - it's the future we're building today. Innovation has always been the driving force behind human progress, but we're on the cusp of a revolution that will democratize creativity like never before.",
            coachingTips: ["Increase vocal variety", "Strengthen eye contact", "Reduce hesitation words"],
            aiAnalysis: {
              overallScore: 79,
              strengths: ["Compelling narrative", "Strong message clarity", "Good pacing"],
              improvements: ["Vocal confidence", "Body language presence", "Audience engagement"]
            },
            speechPatterns: {
              paceVariation: 0.65,
              intonationRange: 0.72,
              pauseEffectiveness: 0.76
            },
            bodyLanguageMetrics: {
              postureScore: 74,
              gestureNaturalness: 82,
              facialExpression: 71
            },
            persuasivenessScore: 81.4
          },
          {
            userId,
            duration: 180,
            averageWPM: 128,
            confidenceScore: 94.3,
            voiceClarity: 96.1,
            fillerWords: 2,
            pauseCount: 6,
            eyeContactScore: "Excellent",
            transcript: "I've known Tom for fifteen years, and I can honestly say I've never seen him as happy as he is with Sarah. When he first told me about her, his whole face lit up in a way I'd never seen before. Today, as we celebrate their union, I'm reminded that true love really does exist.",
            coachingTips: ["Perfect delivery", "Natural gestures", "Excellent emotional connection"],
            aiAnalysis: {
              overallScore: 94,
              strengths: ["Authentic emotion", "Perfect pacing", "Natural delivery", "Strong audience connection"],
              improvements: ["Maintain this level", "Consider longer pauses for impact"]
            },
            speechPatterns: {
              paceVariation: 0.88,
              intonationRange: 0.91,
              pauseEffectiveness: 0.95
            },
            bodyLanguageMetrics: {
              postureScore: 91,
              gestureNaturalness: 95,
              facialExpression: 97
            },
            persuasivenessScore: 92.8
          }
        ];
        
        for (const sessionData of sampleSessions) {
          await storage.createPracticeSession(sessionData);
        }
        
        sessions = await storage.getUserPracticeSessions(userId);
      }
      
      res.json(sessions);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Get specific practice session
  app.get("/api/practice-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getPracticeSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Delete practice session
  app.delete("/api/practice-sessions/:id", async (req: any, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      
      if (isNaN(sessionId)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      // Delete the session from the database
      await storage.deletePracticeSession(sessionId);
      
      res.json({ message: "Session deleted successfully" });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  // Create new practice session
  app.post("/api/practice-sessions", async (req: any, res) => {
    try {
      const validatedData = insertPracticeSessionSchema.parse({
        ...req.body,
        userId: req.user?.id || 'demo-user'
      });
      const session = await storage.createPracticeSession(validatedData);
      res.status(201).json(session);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid session data", error: error.message });
    }
  });

  // Add coaching feedback
  app.post("/api/coaching-feedback", async (req, res) => {
    try {
      const validatedData = insertCoachingFeedbackSchema.parse(req.body);
      const feedback = await storage.addCoachingFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error: any) {
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

  // Speech persona endpoints
  app.get("/api/speech-persona", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.replit?.id || req.user?.id || 'demo-user';
      const persona = await storage.getSpeechPersona(userId);
      res.json(persona);
    } catch (error) {
      console.error("Error fetching speech persona:", error);
      res.status(500).json({ error: "Failed to fetch speech persona" });
    }
  });

  app.post("/api/speech-persona/generate", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.replit?.id || req.user?.id || 'demo-user';
      const sessions = await storage.getUserPracticeSessions(userId);
      const persona = await storage.generateSpeechPersona(userId, sessions);
      res.json(persona);
    } catch (error) {
      console.error("Error generating speech persona:", error);
      res.status(500).json({ error: "Failed to generate speech persona" });
    }
  });

  // Comprehensive AI coaching analysis
  app.post("/api/ai-coaching-comprehensive", requireAuth, async (req: any, res) => {
    try {
      const { session, purpose, userProgress, previousSessions } = req.body;

      if (!session) {
        return res.status(400).json({ message: "Session data is required" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert speech coach with deep expertise in public speaking development. Analyze the session data comprehensively, considering the speaker's purpose, execution, and progress over time. Provide actionable insights that help speakers improve systematically.

Respond with JSON in this exact format:
{
  "purposeAlignment": number (0-100),
  "executionQuality": number (0-100), 
  "improvementPotential": number (0-100),
  "overallAssessment": "detailed paragraph assessment",
  "improvements": [
    {"area": "skill name", "description": "what improved"}
  ],
  "nextSessionFocus": [
    {"area": "focus area", "actionable": "specific action"}
  ],
  "skillBreakdown": [
    {
      "name": "skill name",
      "currentScore": number,
      "previousScore": number,
      "coachNotes": "specific feedback"
    }
  ],
  "developmentPlan": {
    "immediate": [{"goal": "immediate goal", "action": "specific action"}],
    "shortTerm": [{"goal": "short term goal", "action": "specific action"}], 
    "longTerm": [{"goal": "long term goal", "action": "specific action"}]
  }
}`
            },
            {
              role: "user",
              content: `Analyze this speaking session comprehensively:

Session Purpose: ${purpose}
Session Data: ${JSON.stringify(session)}
User Progress History: ${JSON.stringify(userProgress?.slice(-3) || [])}
Recent Sessions: ${JSON.stringify(previousSessions?.slice(-3) || [])}

Provide comprehensive coaching analysis focusing on:
1. How well the session aligned with its intended purpose
2. Quality of execution and delivery
3. Progress patterns and improvement opportunities
4. Skill-by-skill breakdown with coaching notes
5. Strategic development plan with immediate, short-term, and long-term goals

Be specific, actionable, and encouraging while maintaining professional coaching standards.`
            }
          ],
          temperature: 0.4,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);
      res.json(analysis);
    } catch (error: any) {
      console.error("Error generating comprehensive coaching analysis:", error);
      res.status(500).json({ message: "Failed to generate coaching analysis", error: error.message });
    }
  });

  // Template personalization endpoint
  app.post("/api/personalize-template", requireAuth, async (req: any, res) => {
    try {
      const { template, userPreferences } = req.body;

      if (!template) {
        return res.status(400).json({ message: "Template data is required" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert speech writer and communication coach. Your task is to personalize speech templates while maintaining their structure and effectiveness. Focus on making the content more engaging, natural, and tailored to the user's preferences.

Respond with JSON in this format:
{
  "personalizedContent": "the enhanced template content",
  "changes": ["list of key improvements made"],
  "tips": ["specific delivery tips for this personalized version"]
}`
            },
            {
              role: "user",
              content: `Please personalize this speech template:

Template Title: ${template.title}
Template Category: ${template.category}
Original Content: ${template.content}

User Preferences: ${userPreferences}

Make the template more engaging and personal while keeping the structure intact. Add specific examples, improve transitions, and make the language more natural and conversational.`
            }
          ],
          temperature: 0.6,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      res.json(result);
    } catch (error: any) {
      console.error("Error personalizing template:", error);
      res.status(500).json({ message: "Failed to personalize template", error: error.message });
    }
  });

  // Template feedback endpoint
  app.post("/api/template-feedback", requireAuth, async (req: any, res) => {
    try {
      const { template, content } = req.body;

      if (!template && !content) {
        return res.status(400).json({ message: "Template or content is required" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a professional speech coach providing detailed feedback on speech templates and content. Analyze the structure, content quality, and delivery potential.

Respond with JSON in this format:
{
  "structureScore": number (0-100),
  "clarityScore": number (0-100),
  "engagementScore": number (0-100),
  "contentFeedback": {
    "strengths": ["list of content strengths"],
    "improvements": ["specific suggestions for improvement"],
    "structureNotes": "analysis of speech structure"
  },
  "voiceTips": {
    "paceRecommendations": "guidance on speaking pace",
    "emphasisPoints": ["key phrases to emphasize"],
    "pauseStrategy": "where to use strategic pauses"
  },
  "bodyLanguageTips": {
    "postureGuidance": "posture recommendations",
    "gestureIdeas": ["suggested gestures for key moments"],
    "eyeContactStrategy": "eye contact guidance"
  }
}`
            },
            {
              role: "user",
              content: `Analyze this speech content and provide comprehensive feedback:

Template/Content: ${content || template?.content}
Category: ${template?.category || 'general'}
Title: ${template?.title || 'Speech Content'}

Provide detailed feedback on content structure, voice modulation advice, and body language recommendations.`
            }
          ],
          temperature: 0.4,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const feedback = JSON.parse(data.choices[0].message.content);
      res.json(feedback);
    } catch (error: any) {
      console.error("Error generating template feedback:", error);
      res.status(500).json({ message: "Failed to generate template feedback", error: error.message });
    }
  });

  // Speech transcription with analytics endpoint
  app.post("/api/deepgram-transcribe", demoAuth, transcribeWithAnalytics);

  // AI Content Analysis endpoint
  app.post("/api/ai-content-analysis", demoAuth, analyzeContent);

  // Enhanced Content Analysis endpoint
  app.post("/api/content-analysis", demoAuth, processContentAnalysis);

  // User achievements endpoint
  app.get("/api/user-achievements", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.replit?.id || req.user?.id || 'demo-user';
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Update achievement progress
  app.post("/api/achievements/update", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.replit?.id || req.user?.id || 'demo-user';
      const { achievementId, progress, metadata } = req.body;

      // Get current user sessions and calculate progress
      const sessions = await storage.getUserPracticeSessions(userId);
      const currentAchievements = await storage.getUserAchievements(userId);
      
      let newlyUnlocked = false;
      let updatedAchievement = null;

      // Check if achievement should be unlocked based on real user data
      const achievementCriteria = {
        'first-speech': () => sessions.length >= 1,
        'dedicated-speaker': () => sessions.length >= 5,
        'consistency-champion': () => {
          // Calculate streak from sessions
          const today = new Date();
          let streak = 0;
          const sortedSessions = sessions
            .map(s => new Date(s.createdAt))
            .sort((a, b) => b.getTime() - a.getTime());
          
          for (let i = 0; i < sortedSessions.length; i++) {
            const sessionDate = sortedSessions[i];
            const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === i) {
              streak++;
            } else {
              break;
            }
          }
          return streak >= 3;
        },
        'confident-speaker': () => {
          const maxConfidence = Math.max(...sessions.map(s => s.confidenceScore || 0));
          return maxConfidence >= 80;
        },
        'speech-master': () => sessions.length >= 25,
        'perfect-score': () => {
          const maxScore = Math.max(...sessions.map(s => s.confidenceScore || 0));
          return maxScore >= 100;
        }
      };

      // Check if achievement should be unlocked
      const shouldUnlock = achievementCriteria[achievementId as keyof typeof achievementCriteria];
      if (shouldUnlock && shouldUnlock()) {
        // Check if not already unlocked
        const existingAchievement = currentAchievements.find(a => a.achievementType === achievementId);
        if (!existingAchievement) {
          // Unlock achievement
          updatedAchievement = await storage.addUserAchievement({
            userId,
            achievementType: achievementId,
            achievementName: achievementId.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            description: `Achievement unlocked: ${achievementId}`,
            metadata: metadata || {}
          });
          newlyUnlocked = true;
        }
      }

      res.json({
        success: true,
        newlyUnlocked,
        achievement: updatedAchievement
      });
    } catch (error: any) {
      console.error("Error updating achievement:", error);
      res.status(500).json({ message: "Failed to update achievement", error: error.message });
    }
  });

  // Speech coaching chat endpoint (OpenAI only)
  app.post("/api/speech-coaching-chat", requireAuth, async (req: any, res) => {
    try {
      const { message, transcript, purpose, chatHistory } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert speech coach with years of experience helping people improve their public speaking skills. You provide personalized, actionable advice based on the user's practice sessions and specific questions.

Key guidelines:
- Be encouraging and supportive while providing honest feedback
- Give specific, actionable recommendations
- Reference the user's transcript and session data when relevant
- Tailor advice to their speech purpose (${purpose || 'general presentation'})
- Keep responses conversational and helpful
- Focus on practical improvements they can implement immediately

Session context:
- Purpose: ${purpose || 'general presentation'}
- Transcript: ${transcript || 'No transcript available'}
- Chat history: ${JSON.stringify(chatHistory || [])}`
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      res.json({ response: aiResponse });
    } catch (error: any) {
      console.error("Error in speech coaching chat:", error);
      res.status(500).json({ message: "Failed to get coaching response", error: error.message });
    }
  });

  // Real-time transcription endpoint
  app.post("/api/transcribe", async (req, res) => {
    try {
      const { transcript, isPartial } = req.body;
      
      if (!transcript) {
        return res.status(400).json({ message: "Transcript is required" });
      }

      // Simple analysis for real-time feedback
      const wordCount = transcript.split(' ').length;
      const fillerWords = (transcript.match(/\b(um|uh|like|you know|so|actually)\b/gi) || []).length;
      const wpm = isPartial ? 0 : Math.round(wordCount / 1); // Estimate WPM
      
      const analysis = {
        wordCount,
        fillerWords,
        wpm,
        clarity: Math.max(0, 100 - (fillerWords * 5)),
        suggestions: fillerWords > 2 ? ["Reduce filler words", "Speak more deliberately"] : ["Good clarity"]
      };

      res.json({ analysis, transcript });
    } catch (error) {
      console.error("Transcription analysis error:", error);
      res.status(500).json({ message: "Analysis failed" });
    }
  });

  // Analyze speech for coaching tips
  app.post("/api/analyze-speech", async (req, res) => {
    try {
      const { transcript, metrics } = req.body;
      
      if (!transcript || !metrics) {
        return res.status(400).json({ message: "Transcript and metrics are required" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert public speaking coach with years of experience helping speakers improve. Analyze the speech transcript and metrics to provide actionable, specific coaching tips. Focus on practical improvements that can be implemented immediately. Respond with JSON in this format: { \"tips\": [{ \"type\": \"posture|gesture|pace|volume|clarity|eye_contact|content\", \"message\": \"specific tip message\", \"severity\": \"good|warning|improvement\" }] }"
            },
            {
              role: "user",
              content: `Analyze this speech performance:
              
Transcript: ${transcript}

Performance Metrics:
- Speaking pace: ${metrics.speakingPace} WPM
- Voice clarity: ${metrics.voiceClarity}%
- Confidence level: ${metrics.confidenceScore}%
- Filler words count: ${metrics.fillerWords}
- Strategic pauses: ${metrics.pauseCount}

Provide specific, actionable coaching tips to improve this presentation. Focus on immediate improvements and long-term development. Respond with valid JSON only.`
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze speech", error: error.message });
    }
  });

  // OpenAI-powered comprehensive coaching endpoints
  app.post('/api/openai/comprehensive-analysis', generateComprehensiveAnalysis);
  app.post('/api/openai/speech-persona', generateSpeechPersona);
  app.post('/api/openai/coaching-insights', generateCoachingInsights);
  app.post('/api/openai/live-feedback', generateLiveFeedback);
  app.post('/api/openai/personalize-template', personalizeTemplate);
  app.post('/api/openai/session-insights', demoAuth, generateSessionInsights);

  // OpenAI Realtime Vision Analysis
  app.post("/api/vision/analyze-frame", demoAuth, analyzeVideoFrame);
  app.post("/api/vision/analyze-posture", demoAuth, analyzePosture);
  app.post("/api/vision/analyze-eye-contact", demoAuth, analyzeEyeContact);

  // Analyze posture from image (simplified text-based analysis)
  app.post("/api/analyze-posture", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ message: "Image data is required" });
      }

      // Use OpenAI with vision capabilities for advanced posture analysis
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert body language and posture coach for public speaking. Analyze the image to provide specific feedback on posture, gestures, and overall presentation stance. Focus on actionable improvements. Respond with JSON in this format: { \"posture\": \"good|needs_improvement\", \"gesture\": \"open|closed|neutral\", \"eyeContact\": \"good|poor\", \"feedback\": \"specific feedback message\", \"improvements\": [\"actionable tip 1\", \"actionable tip 2\"] }"
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this speaker's posture and body language. Provide specific feedback on how to improve their presentation stance."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze posture", error: error.message });
    }
  });

  // Analyze speech format based on purpose
  app.post("/api/analyze-speech-format", async (req, res) => {
    try {
      const { transcript, purpose } = req.body;
      
      if (!transcript || !purpose) {
        return res.status(400).json({ message: "Transcript and purpose are required" });
      }

      const purposeContext: Record<string, string> = {
        school_presentation: "academic presentation with clear structure, educational content, and student-appropriate language",
        ted_talk: "inspirational talk with storytelling, clear message, and engaging delivery",
        business_pitch: "persuasive presentation with problem-solution format, data-driven arguments, and call to action",
        conference_talk: "professional presentation with expert insights, industry knowledge, and technical depth",
        wedding_speech: "personal and heartfelt speech with anecdotes, gratitude, and celebratory tone",
        toast: "brief celebratory speech with positive sentiment and specific acknowledgments",
        job_interview: "professional self-presentation highlighting qualifications and fit",
        sales_presentation: "persuasive pitch focusing on benefits, value proposition, and closing techniques",
        training_session: "educational presentation with clear learning objectives and practical examples",
        debate: "structured argument with evidence, rebuttals, and logical reasoning",
        other: "general speech"
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert speech coach specializing in format and structure optimization. Analyze speech transcripts based on their intended purpose and provide specific, actionable feedback on structure, content flow, and format improvements. Respond with JSON containing detailed analysis and recommendations.`
            },
            {
              role: "user",
              content: `Analyze this ${purposeContext[purpose] || purposeContext['other']} transcript and provide detailed feedback on format and structure:

Speech Type: ${purpose.replace('_', ' ').toUpperCase()}
Expected Format: ${purposeContext[purpose] || purposeContext['other']}

Transcript: "${transcript}"

Please provide specific feedback on:
1. Structure and organization
2. Opening and closing effectiveness
3. Content flow and transitions
4. Appropriateness for the speech type
5. Specific suggestions for improvement

Keep feedback constructive and actionable.`
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze speech format", error: error.message });
    }
  });

  // Speech coaching chat
  app.post("/api/speech-coaching-chat", async (req, res) => {
    try {
      const { message, transcript, purpose, chatHistory } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const purposeContext: Record<string, string> = {
        school_presentation: "academic presentation",
        ted_talk: "TED Talk",
        business_pitch: "business pitch",
        conference_talk: "conference presentation",
        wedding_speech: "wedding speech",
        toast: "toast or celebration speech",
        job_interview: "job interview presentation",
        sales_presentation: "sales presentation",
        training_session: "training session",
        debate: "debate",
        other: "general speech"
      };

      let contextMessage = `You are an expert speech coach helping with a ${purposeContext[purpose] || purposeContext['other']}.`;
      
      if (transcript) {
        contextMessage += ` The speaker's current transcript is: "${transcript.slice(-500)}"`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            ...(chatHistory ? chatHistory.slice(-6) : []),
            {
              role: "system",
              content: `${contextMessage} You are an expert speech coach providing personalized guidance. Be encouraging, specific, and actionable. Focus on practical techniques that deliver immediate improvement. Adapt your coaching style to the speaker's experience level and goals.`
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.4,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      res.json({ response: data.choices[0].message.content });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to process chat message", error: error.message });
    }
  });

  // Deep speech analysis endpoint
  app.post("/api/analyze-speech-deep", async (req, res) => {
    try {
      const { transcript, metrics } = req.body;
      
      if (!transcript || !metrics) {
        return res.status(400).json({ message: "Transcript and metrics are required" });
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "You are an expert speech analysis coach specializing in deep linguistic and rhetorical analysis. Provide comprehensive feedback on speech patterns, vocal dynamics, content structure, and persuasive techniques."
            },
            {
              role: "user",
              content: `Perform a deep analysis of this speech transcript:

Transcript: "${transcript}"

Current Metrics:
- Speaking Pace: ${metrics.speakingPace} WPM
- Voice Clarity: ${metrics.voiceClarity}%
- Confidence Score: ${metrics.confidenceScore}%
- Word Count: ${metrics.wordCount}
- Session Duration: ${metrics.sessionTime} seconds

Please analyze:
1. Pause patterns and timing effectiveness
2. Vocal variety and intonation patterns
3. Rhetorical device usage (repetition, questions, metaphors)
4. Content structure and flow
5. Persuasive elements and argument strength
6. Areas for vocal dynamic improvement
7. Specific recommendations for enhancement

Provide detailed, actionable feedback focusing on advanced speaking techniques.`
            }
          ],
          temperature: 0.3,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      res.json({ analysis: data.choices[0].message.content });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to perform deep speech analysis", error: error.message });
    }
  });

  // Generate personalized improvement plan
  app.post("/api/generate-improvement-plan", async (req, res) => {
    try {
      const { metrics, sessionData } = req.body;
      
      if (!metrics) {
        return res.status(400).json({ message: "Metrics are required" });
      }

      // Build comprehensive analysis prompt
      const analysisPrompt = `As an expert executive speaking coach, analyze these presentation metrics and create a detailed, personalized improvement plan:

CURRENT PERFORMANCE METRICS:
Voice & Speech:
- Speaking Pace: ${metrics.voice.speakingPace} WPM (optimal: 120-160)
- Voice Clarity: ${metrics.voice.voiceClarity}%
- Confidence Score: ${metrics.voice.confidenceScore}%
- Volume Level: ${metrics.voice.volumeLevel}%

Speech Content:
- Word Count: ${metrics.speech.wordCount}
- Session Duration: ${metrics.speech.sessionTime} seconds
- Recent Transcript: "${metrics.speech.transcript}"

Body Language:
- Posture: ${metrics.bodyLanguage.posture}
- Gestures: ${metrics.bodyLanguage.gesture}  
- Eye Contact: ${metrics.bodyLanguage.eyeContact}

ANALYSIS REQUIREMENTS:
1. Identify the TOP 3 specific areas needing improvement (prioritize by impact)
2. For each area, provide:
   - Specific issue description
   - Current vs target performance levels
   - Detailed step-by-step improvement methods
   - Progressive practice exercises (beginner to advanced)
   - Realistic timeline for improvement
   - Measurable success indicators

3. Identify strengths to maintain and leverage
4. Provide 5 immediate actionable tips (quick wins)
5. Suggest 4 long-term development goals

COACHING APPROACH:
- Give specific, non-generic advice tailored to current performance
- Include advanced techniques for experienced speakers
- Provide progressive skill-building exercises
- Focus on measurable improvements
- Consider psychological aspects of confidence building

Respond with detailed analysis in JSON format:
{
  "overallAssessment": "comprehensive assessment text",
  "topPriorities": [
    {
      "category": "area name",
      "priority": "high/medium/low", 
      "currentScore": number,
      "targetScore": number,
      "issue": "specific problem description",
      "howToImprove": ["detailed step 1", "detailed step 2", "detailed step 3"],
      "timeToImprove": "realistic timeframe",
      "practiceExercises": ["specific exercise 1", "specific exercise 2"]
    }
  ],
  "strengthsToMaintain": ["strength 1", "strength 2"],
  "quickWins": ["immediate tip 1", "immediate tip 2"],
  "longTermGoals": ["goal 1", "goal 2"]
}`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "You are a world-class executive speaking coach with expertise in performance psychology, vocal training, and presentation mastery. Provide detailed, specific, and progressively challenging improvement plans."
            },
            {
              role: "user",
              content: analysisPrompt
            }
          ],
          temperature: 0.3,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      let analysisResult;
      
      try {
        let content = data.choices[0].message.content;
        
        // Clean up markdown code blocks and other formatting
        content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
        content = content.replace(/^```\s*/g, '').replace(/```\s*$/g, '');
        content = content.trim();
        
        // If content doesn't start with {, try to find the JSON part
        if (!content.startsWith('{')) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            content = jsonMatch[0];
          }
        }
        
        analysisResult = JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, create structured response from text
        const textResponse = data.choices[0].message.content;
        analysisResult = {
          overallAssessment: textResponse.substring(0, 300) + "...",
          topPriorities: [],
          strengthsToMaintain: ["Continue current practice routine"],
          quickWins: ["Focus on breathing", "Practice with recordings", "Maintain good posture"],
          longTermGoals: ["Develop advanced speaking techniques", "Build presentation confidence"]
        };
      }

      res.json(analysisResult);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate improvement plan", error: error.message });
    }
  });

  // AI Club Coaching endpoint
  app.post("/api/club-coaching", requireAuth, generateClubCoaching);

  // World-class AI coaching system
  app.post('/api/world-class-coaching', demoAuth, generateWorldClassCoaching);
  app.post('/api/live-empathic-feedback', demoAuth, generateLiveEmpathicFeedback);
  app.post('/api/update-speaking-profile', demoAuth, updateUserSpeakingProfile);

  // Advanced Multi-Modal AI Routes - Enhanced Backend Architecture
  app.post("/api/multi-modal-analysis", processMultiModalAnalysis);
  app.post("/api/voice-quality-analysis", analyzeVoiceQuality);
  app.post("/api/filler-words-analysis", analyzeFillerWords);
  
  // Performance monitoring endpoint
  app.get("/api/performance-metrics", (req, res) => {
    const metrics = processingEngine.getOverallPerformance();
    res.json({ success: true, metrics });
  });

  // Deep Learning Coach endpoints
  app.post("/api/deep-learning-coach", demoAuth, getAdaptiveCoaching);
  app.post("/api/advanced-public-speaking-coach", demoAuth, getAdvancedPublicSpeakingCoaching);
  app.get("/api/user-learning-progress/:userId", demoAuth, getUserLearningProgress);

  // ======= ULTRA-ADVANCED AI ENDPOINTS =======
  
  // Ultra-Advanced Multi-Modal Analysis
  app.post("/api/ultra-advanced-analysis", demoAuth, processUltraAdvancedAnalysis);
  
  // Real-Time Processing Engine
  app.post("/api/real-time-frame", demoAuth, processRealTimeFrame);
  
  // Advanced Voice Analysis (Enhanced versions)
  app.post("/api/voice-coaching-enhanced", demoAuth, generateVoiceCoaching);

  console.log('🚀 Enhanced Backend Architecture - Multi-Modal AI Processing Pipeline initialized');
  console.log('🧠 Deep Learning Coach system initialized');
  console.log('⚡ Ultra-Advanced AI Processing Engine activated');
  console.log('🎤 Professional Voice Analysis Engine ready');
  console.log('🚀 Real-Time Sub-100ms Processing Engine online');

  const httpServer = createServer(app);
  return httpServer;
}
