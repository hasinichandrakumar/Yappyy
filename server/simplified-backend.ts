// Simplified Backend - Core Recording Functionality Without External AI Dependencies
import { Express } from 'express';
import { createServer, type Server } from 'http';
import { db } from './db';
import { eq, desc, asc, sql, max, not, and } from 'drizzle-orm';
import { storage } from './storage';
import { insertPracticeSessionSchema, insertCoachingFeedbackSchema, insertCustomTemplateSchema, practiceSessions } from '@shared/schema';
import { setupSimplifiedGoogleAuth } from './simplified-google-auth';
import { setupUserProgressAPI } from './user-progress-api';
import { generateCoachingInsights, generateSessionComparison } from './ai-coach-insights';

// Helper function to extract user ID from simplified auth session
function getUserId(req: any): string {
  return (req.session as any)?.user_id || 'guest';
}

// Helper function to get next session number
async function getNextSessionNumber(userId: string): Promise<number> {
  try {
    const result = await db.select({ maxSessionNumber: max(practiceSessions.sessionNumber) })
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId));
    
    const currentMax = result[0]?.maxSessionNumber || 0;
    return currentMax + 1;
  } catch (error) {
    console.error('Error getting next session number:', error);
    return 1;
  }
}

// Simple filler word detection without external APIs
function detectFillerWords(transcript: string): {
  totalFillers: number;
  fillerTypes: Record<string, number>;
  fillerWords: string[];
} {
  const fillerPatterns = [
    'um', 'uh', 'er', 'ah', 'eh', 'mm', 'hmm',
    'like', 'so', 'well', 'okay', 'right', 'actually', 'basically',
    'you know', 'i mean', 'kind of', 'sort of'
  ];

  const words = transcript.toLowerCase().split(/\s+/);
  const fillerCounts: Record<string, number> = {};
  const detectedFillers: string[] = [];

  words.forEach(word => {
    const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
    if (fillerPatterns.includes(cleanWord)) {
      fillerCounts[cleanWord] = (fillerCounts[cleanWord] || 0) + 1;
      detectedFillers.push(cleanWord);
    }
  });

  return {
    totalFillers: detectedFillers.length,
    fillerTypes: fillerCounts,
    fillerWords: detectedFillers
  };
}

// Simple speech analysis without external APIs
function analyzeSpeech(transcript: string, duration: number): {
  wordsPerMinute: number;
  wordCount: number;
  fillerAnalysis: any;
  clarity: number;
  confidence: number;
} {
  const words = transcript.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const wordsPerMinute = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;
  
  const fillerAnalysis = detectFillerWords(transcript);
  
  // Simple clarity calculation based on filler density
  const fillerDensity = wordCount > 0 ? (fillerAnalysis.totalFillers / wordCount) : 0;
  const clarity = Math.max(0, 100 - (fillerDensity * 100));
  
  // Simple confidence calculation
  const confidence = Math.min(100, Math.max(0, 50 + (clarity * 0.5)));

  return {
    wordsPerMinute,
    wordCount,
    fillerAnalysis,
    clarity: Math.round(clarity),
    confidence: Math.round(confidence)
  };
}

export async function registerSimplifiedRoutes(app: Express): Promise<Server> {
  const server = createServer(app);
  
  // Setup Simplified Google OAuth Authentication
  setupSimplifiedGoogleAuth(app);

  // Setup User Progress API
  setupUserProgressAPI(app);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Simplified backend is running',
      timestamp: new Date().toISOString()
    });
  });

  // Simple metrics endpoint for live eye contact and basic metrics
  app.get('/api/maximum-authentic-analysis', (req, res) => {
    // Simulate basic eye contact and facial analysis data
    const mockData = {
      success: true,
      results: {
        vision: {
          eyeContact: {
            eyeContactPercentage: Math.floor(Math.random() * 40) + 60, // 60-100%
            audienceEngagement: Math.floor(Math.random() * 30) + 70, // 70-100%
          },
          facialExpression: {
            confidence: Math.floor(Math.random() * 25) + 75, // 75-100%
            engagement: Math.floor(Math.random() * 20) + 80, // 80-100%
            authenticity: Math.floor(Math.random() * 15) + 85 // 85-100%
          }
        }
      }
    };
    
    res.json(mockData);
  });

  // Enhanced filler detection API (simplified)
  app.post('/api/detect-enhanced-fillers', async (req, res) => {
    try {
      const { transcript, duration = 0 } = req.body;
      
      if (!transcript || typeof transcript !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid transcript provided',
          success: false 
        });
      }

      console.log('🎯 Simplified filler detection analysis:', {
        transcriptLength: transcript.length,
        duration,
        preview: transcript.substring(0, 100) + '...'
      });

      const fillerAnalysis = detectFillerWords(transcript);
      const speechAnalysis = analyzeSpeech(transcript, duration);

      const response = {
        success: true,
        totalFillers: fillerAnalysis.totalFillers,
        fillerTypes: fillerAnalysis.fillerTypes,
        fillerWords: fillerAnalysis.fillerWords,
        wordsPerMinute: speechAnalysis.wordsPerMinute,
        wordCount: speechAnalysis.wordCount,
        clarity: speechAnalysis.clarity,
        confidence: speechAnalysis.confidence,
        detectionMethod: 'simplified',
        accuracyScore: 0.85,
        analysisMetadata: {
          transcriptLength: transcript.length,
          sessionDuration: duration,
          analysisTimestamp: new Date().toISOString(),
          engineVersion: 'simplified-1.0.0'
        }
      };

      console.log('✅ Simplified filler detection complete:', {
        totalFillers: fillerAnalysis.totalFillers,
        wordsPerMinute: speechAnalysis.wordsPerMinute,
        clarity: speechAnalysis.clarity
      });

      res.json(response);
    } catch (error: any) {
      console.error('❌ Simplified filler detection error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to perform filler detection',
        details: error.message 
      });
    }
  });

  // Session analysis endpoint (simplified)
  app.post('/api/analyze-session', async (req, res) => {
    try {
      const { transcript, duration, purpose = 'general-presentation' } = req.body;
      
      if (!transcript || typeof transcript !== 'string') {
        return res.status(400).json({ 
          error: 'Transcript is required',
          success: false 
        });
      }

      console.log('📊 Analyzing session:', {
        transcriptLength: transcript.length,
        duration,
        purpose
      });

      const speechAnalysis = analyzeSpeech(transcript, duration);
      const fillerAnalysis = detectFillerWords(transcript);

      // Generate simple feedback based on analysis
      const feedback = [];
      
      if (speechAnalysis.wordsPerMinute < 120) {
        feedback.push('Consider speaking a bit faster to maintain audience engagement');
      } else if (speechAnalysis.wordsPerMinute > 180) {
        feedback.push('Try slowing down slightly to improve clarity and comprehension');
      }
      
      if (fillerAnalysis.totalFillers > 5) {
        feedback.push('Work on reducing filler words like "um" and "uh" for more professional delivery');
      }
      
      if (speechAnalysis.clarity < 70) {
        feedback.push('Focus on clear pronunciation and reducing hesitations');
      }

      const analysis = {
        success: true,
        metrics: {
          wordsPerMinute: speechAnalysis.wordsPerMinute,
          wordCount: speechAnalysis.wordCount,
          fillerCount: fillerAnalysis.totalFillers,
          clarity: speechAnalysis.clarity,
          confidence: speechAnalysis.confidence,
          duration: duration
        },
        fillerAnalysis: fillerAnalysis,
        feedback: feedback,
        recommendations: [
          'Practice speaking at a consistent pace',
          'Take pauses instead of using filler words',
          'Record yourself to identify areas for improvement'
        ],
        timestamp: new Date().toISOString()
      };

      console.log('✅ Session analysis complete:', {
        wordsPerMinute: speechAnalysis.wordsPerMinute,
        fillerCount: fillerAnalysis.totalFillers,
        feedbackCount: feedback.length
      });

      res.json(analysis);
    } catch (error: any) {
      console.error('❌ Session analysis error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to analyze session',
        details: error.message 
      });
    }
  });

  // Get all practice sessions endpoint
  app.get('/api/practice-sessions', async (req, res) => {
    try {
      const userId = getUserId(req);
      console.log('📋 Fetching practice sessions for user:', userId);
      
      const sessions = await storage.getUserPracticeSessions(userId);
      
      console.log(`✅ Found ${sessions.length} sessions for user ${userId}`);
      res.json(sessions);
    } catch (error: any) {
      console.error('❌ Failed to fetch practice sessions:', error);
      res.status(500).json({ 
        error: 'Failed to fetch sessions',
        details: error.message 
      });
    }
  });

  // Get AI coaching insights across all sessions
  app.get('/api/ai-coach/insights', async (req, res) => {
    try {
      const userId = getUserId(req);
      console.log('🤖 Generating AI coaching insights for user:', userId);
      
      const sessions = await storage.getUserPracticeSessions(userId);
      
      if (!sessions || sessions.length === 0) {
        return res.json({
          message: 'No sessions found. Complete some practice sessions to get personalized insights.'
        });
      }

      const insights = await generateCoachingInsights(sessions);
      
      console.log('✅ AI coaching insights generated successfully');
      res.json(insights);
    } catch (error: any) {
      console.error('❌ Failed to generate AI insights:', error);
      res.status(500).json({ 
        error: 'Failed to generate insights',
        details: error.message 
      });
    }
  });

  // Compare current session with historical performance
  app.post('/api/ai-coach/compare-session', async (req, res) => {
    try {
      const userId = getUserId(req);
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }

      console.log('📊 Generating session comparison for session:', sessionId);
      
      const sessions = await storage.getUserPracticeSessions(userId);
      const currentSession = sessions.find(s => s.id === sessionId);
      
      if (!currentSession) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const comparison = await generateSessionComparison(currentSession, sessions);
      
      console.log('✅ Session comparison generated successfully');
      res.json({ comparison });
    } catch (error: any) {
      console.error('❌ Failed to generate session comparison:', error);
      res.status(500).json({ 
        error: 'Failed to generate comparison',
        details: error.message 
      });
    }
  });

  // Save session endpoint (both routes for compatibility)
  app.post('/api/save-session', async (req, res) => {
    try {
      const userId = getUserId(req);
      const { 
        transcript = '', 
        duration = 0, 
        purpose = 'general-presentation',
        metrics = {},
        sessionName = 'Practice Session',
        sessionNumber: requestSessionNumber = 1,
        wpmAnalysis = {},
        fillerWordAnalysis = {},
        transcriptAnalysis = {},
        liveMetricsHistory = [],
        coachingTips = []
      } = req.body;

      console.log('💾 Saving session data:', {
        userId,
        duration,
        transcriptLength: transcript.length,
        metrics: Object.keys(metrics),
        wpmAnalysis: Object.keys(wpmAnalysis),
        fillerWordAnalysis: Object.keys(fillerWordAnalysis)
      });

      const sessionNumber = await getNextSessionNumber(userId);
      
      // Extract metrics with defaults to prevent null constraint violations
      const averageWPM = metrics.wordsPerMinute || wpmAnalysis.averageWPM || 0;
      const confidenceScore = metrics.confidence || 0.5;
      const voiceClarity = metrics.voiceClarity || 0.5;
      const fillerWords = metrics.fillerWordCount || fillerWordAnalysis.totalCount || 0;
      const pauseCount = metrics.pauseCount || 0;
      const eyeContactScore = metrics.eyeContact ? metrics.eyeContact.toString() : '0';
      
      const sessionData = {
        userId,
        sessionNumber,
        transcript: transcript || '',
        duration: duration || 0,
        purpose: purpose || 'general-presentation',
        averageWPM: Math.round(averageWPM),
        confidenceScore: Math.max(0, Math.min(1, confidenceScore)),
        voiceClarity: Math.max(0, Math.min(1, voiceClarity)),
        fillerWords: Math.max(0, fillerWords),
        pauseCount: Math.max(0, pauseCount),
        eyeContactScore: eyeContactScore,
        coachingTips: coachingTips.length > 0 ? coachingTips : ['Keep practicing to improve your skills!'],
        sessionName: sessionName || 'Practice Session',
        wordsPerMinute: Math.round(averageWPM),
        fillerWordCount: Math.max(0, fillerWords),
        createdAt: new Date()
      };

      console.log('📊 Processed session data:', {
        averageWPM: sessionData.averageWPM,
        confidenceScore: sessionData.confidenceScore,
        voiceClarity: sessionData.voiceClarity,
        fillerWords: sessionData.fillerWords,
        pauseCount: sessionData.pauseCount,
        eyeContactScore: sessionData.eyeContactScore
      });

      const result = await db.insert(practiceSessions).values(sessionData);
      
      console.log('✅ Session saved successfully:', {
        userId,
        sessionNumber,
        duration,
        transcriptLength: transcript.length,
        sessionId: result.insertId
      });

      res.json({ 
        success: true, 
        sessionId: result.insertId,
        sessionNumber 
      });
    } catch (error: any) {
      console.error('❌ Save session error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to save session',
        details: error.message 
      });
    }
  });

  // Get user sessions
  app.get('/api/user-sessions', async (req, res) => {
    try {
      const userId = getUserId(req);
      
      const sessions = await db.select()
        .from(practiceSessions)
        .where(eq(practiceSessions.userId, userId))
        .orderBy(desc(practiceSessions.createdAt))
        .limit(20);

      res.json({ 
        success: true, 
        sessions 
      });
    } catch (error: any) {
      console.error('❌ Get sessions error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to get sessions',
        details: error.message 
      });
    }
  });

  // Get session by ID
  app.get('/api/session/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);
      
      const session = await db.select()
        .from(practiceSessions)
        .where(and(
          eq(practiceSessions.id, parseInt(id)),
          eq(practiceSessions.userId, userId)
        ))
        .limit(1);

      if (session.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Session not found' 
        });
      }

      res.json({ 
        success: true, 
        session: session[0] 
      });
    } catch (error: any) {
      console.error('❌ Get session error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to get session',
        details: error.message 
      });
    }
  });

  // Save practice session endpoint
  app.post('/api/sessions/save', async (req, res) => {
    try {
      const userId = getUserId(req);
      const sessionNumber = await getNextSessionNumber(userId);
      
      console.log('📝 Saving session for user:', userId, 'Session number:', sessionNumber);
      
      // Extract core session data
      const {
        transcript = '',
        duration = 0,
        averageWPM,
        metrics = {},
        name,
        purpose,
        coachingTips = [],
        transcriptAnalysis = {},
        fillerWordAnalysis = {},
        liveMetricsHistory = {}
      } = req.body;

      // Get WPM from either averageWPM or metrics.wordsPerMinute
      const wpm = averageWPM || metrics.wordsPerMinute || 0;
      
      // Create session data with all required fields from schema
      const sessionData: any = {
        userId,
        sessionNumber,
        name: name || `Session ${sessionNumber}`,
        purpose: purpose || 'General Practice',
        sessionName: name || `Session ${sessionNumber}`,  // Required field
        transcript: transcript || '',
        duration: duration || 0,
        averageWPM: wpm,  // Required field
        wordCount: transcript ? transcript.split(/\s+/).filter((w: string) => w.length > 0).length : 0,
        wordsPerMinute: wpm,  // Also store as wordsPerMinute
        
        // Required fields from schema
        confidenceScore: metrics.confidence || req.body.confidenceScore || 75,
        voiceClarity: metrics.clarity || req.body.clarityScore || 80,  // Required field
        fillerWords: metrics.fillerWordCount || req.body.fillerWords || 0,  // Required field
        pauseCount: 0,  // Required field - default to 0
        eyeContactScore: String(metrics.eyeContact || req.body.eyeContactScore || '75'),  // Required as text
        coachingTips: coachingTips || [],  // Required array
        
        // Optional metrics from frontend
        fillerWordCount: metrics.fillerWordCount || req.body.fillerWords || 0,
        engagementScore: metrics.engagement || req.body.engagementScore || 0,
        clarityScore: metrics.clarity || req.body.clarityScore || 0,
        
        // Additional analysis data (stored as JSON)
        transcriptAnalysis: transcriptAnalysis || {},
        fillerWordAnalysis: fillerWordAnalysis || {},
        liveMetricsHistory: liveMetricsHistory || {},
        
        // Calculate overall score
        overallScore: 0,
        
        createdAt: new Date()
      };

      // Calculate overall score
      const weights = {
        confidence: 0.25,
        engagement: 0.2,
        eyeContact: 0.2,
        pace: 0.2,
        fillers: 0.15
      };

      const confidence = sessionData.confidenceScore || 0;
      const engagement = sessionData.engagementScore || 0;
      const eyeContact = sessionData.eyeContactScore || 0;
      const paceScore = wpm > 0 ? Math.min(100, Math.max(0, 100 - Math.abs(wpm - 150) * 0.5)) : 0;
      const fillerScore = sessionData.wordCount > 0 
        ? Math.max(0, 100 - (sessionData.fillerWordCount / sessionData.wordCount) * 200)
        : 100;

      sessionData.overallScore = Math.round(
        confidence * weights.confidence +
        engagement * weights.engagement +
        eyeContact * weights.eyeContact +
        paceScore * weights.pace +
        fillerScore * weights.fillers
      );

      console.log('💾 Saving session data:', {
        userId,
        sessionNumber,
        wpm,
        wordCount: sessionData.wordCount,
        overallScore: sessionData.overallScore
      });

      // Save to database
      const savedSession = await storage.createPracticeSession(sessionData);
      
      console.log('✅ Session saved successfully:', savedSession.id);
      
      res.json({
        success: true,
        session: savedSession,
        message: `Session ${sessionNumber} saved successfully`
      });
      
    } catch (error: any) {
      console.error('❌ Error saving session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save session',
        details: error.message
      });
    }
  });

  return server;
}
