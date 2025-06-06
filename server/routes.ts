import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPracticeSessionSchema, insertCoachingFeedbackSchema } from "@shared/schema";
import { setupGoogleAuth, requireAuth } from "./googleAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Setup Google Authentication
  await setupGoogleAuth(app);

  // Auth routes - simplified for demo without requiring authentication
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For demo purposes, return a mock user when not authenticated
      const user = req.user || {
        id: 'demo-user',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        profileImageUrl: 'https://via.placeholder.com/150'
      };
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user practice sessions
  app.get("/api/practice-sessions", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessions = await storage.getUserPracticeSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Get specific practice session
  app.get("/api/practice-sessions/:id", requireAuth, async (req, res) => {
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

  // Create new practice session
  app.post("/api/practice-sessions", requireAuth, async (req: any, res) => {
    try {
      const validatedData = insertPracticeSessionSchema.parse({
        ...req.body,
        userId: req.user.id
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

  // Analyze speech for coaching tips
  app.post("/api/analyze-speech", async (req, res) => {
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
              content: "You are an expert public speaking coach. Analyze the speech transcript and metrics to provide actionable coaching tips. Respond with JSON in this format: { \"tips\": [{ \"type\": \"posture|gesture|pace|volume|clarity|eye_contact\", \"message\": \"tip message\", \"severity\": \"good|warning|improvement\" }] }"
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

Provide specific, actionable coaching tips to improve this presentation. Respond with valid JSON.`
            }
          ],
          temperature: 0.2,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to analyze speech", error: error.message });
    }
  });

  // Analyze posture from image (simplified text-based analysis)
  app.post("/api/analyze-posture", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ message: "Image data is required" });
      }

      // Since Perplexity doesn't support image analysis, we'll provide basic posture feedback
      // In a real implementation, you would use computer vision or MediaPipe for posture analysis
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
              content: "You are a public speaking coach. Provide general posture and body language advice for presentations. Respond with JSON in this format: { \"posture\": \"good|needs_improvement\", \"gesture\": \"open|closed|neutral\", \"eyeContact\": \"good|poor\", \"feedback\": \"specific feedback message\" }"
            },
            {
              role: "user",
              content: "Provide general advice for good posture and body language during a presentation. Focus on maintaining good posture, using open gestures, and maintaining eye contact."
            }
          ],
          temperature: 0.2,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
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
              content: `You are an expert speech coach. Analyze the speech transcript for format and structure based on the specified purpose. Provide specific, actionable feedback on how to improve the speech format.`
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
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      res.json({ feedback: data.choices[0].message.content });
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
              content: `${contextMessage} Provide helpful, specific advice to improve their speech. Be encouraging but constructive. Focus on practical tips they can implement immediately.`
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.4,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
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

  const httpServer = createServer(app);
  return httpServer;
}
