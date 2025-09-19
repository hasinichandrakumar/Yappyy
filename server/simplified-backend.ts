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
  
  // Add CORS middleware for frontend communication
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
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
        sessionId: 'saved'
      });

      res.json({ 
        success: true, 
        sessionId: 'saved',
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
        liveMetricsHistory = {},
        videoData = null,
        audioData = null,
        imageData = null
      } = req.body;

      // 🔍 TEMPORARY LOGGING: Check what data we're receiving
      console.log('🔍 SESSION DATA DEBUG:', {
        hasTranscript: !!transcript,
        hasVideoData: !!videoData,
        hasAudioData: !!audioData,
        hasImageData: !!imageData,
        transcriptLength: transcript?.length || 0,
        duration: duration,
        metricsKeys: Object.keys(metrics),
        videoDataType: typeof videoData,
        videoDataLength: videoData?.length || 0,
        videoDataPreview: videoData ? videoData.substring(0, 100) + '...' : 'null'
      });

      // Get WPM from either averageWPM or metrics.wordsPerMinute
      const wpm = averageWPM || metrics.wordsPerMinute || 0;
      
      // 🤖 AI MODEL PROCESSING: Call models if we have data
      let facialAnalysisResult = null;
      let voiceAnalysisResult = null;
      let postureAnalysisResult = null;

      console.log('🚀 STARTING AI MODEL PROCESSING PIPELINE');
      console.log('📊 Input Data Summary:', {
        hasImageData: !!imageData,
        hasAudioData: !!audioData,
        hasVideoData: !!videoData,
        hasTranscript: !!transcript,
        imageDataLength: imageData?.length || 0,
        audioDataLength: audioData?.length || 0,
        videoDataLength: videoData?.length || 0,
        transcriptLength: transcript?.length || 0
      });

      try {
        // Process facial expression analysis if we have image data
        if (imageData) {
          console.log('🎭 Processing facial expression analysis...');
          console.log('🔍 Image data type:', typeof imageData, 'Length:', imageData?.length);
          console.log('🔍 Image data preview:', imageData?.substring(0, 100) + '...');
          try {
            const { FacialAnalysisEngine } = await import('./facial-analysis-engine.js');
            console.log('✅ FacialAnalysisEngine imported successfully');
            const facialEngine = new FacialAnalysisEngine();
            console.log('✅ FacialAnalysisEngine instantiated successfully');
            
            console.log('🚀 Starting facial analysis with image data...');
            facialAnalysisResult = await facialEngine.analyzeFacialFrame(imageData);
            
            console.log('✅ Facial analysis result - Full Structure:', {
              hasResult: !!facialAnalysisResult,
              resultType: typeof facialAnalysisResult,
              resultKeys: facialAnalysisResult ? Object.keys(facialAnalysisResult) : [],
              confidence: facialAnalysisResult?.facialMetrics?.emotionalExpression?.confidence,
              engagement: facialAnalysisResult?.facialMetrics?.emotionalExpression?.engagement,
              eyeContact: facialAnalysisResult?.facialMetrics?.communicationSignals?.eyeContactQuality,
              facialMetricsKeys: facialAnalysisResult?.facialMetrics ? Object.keys(facialAnalysisResult.facialMetrics) : [],
              emotionalExpressionKeys: facialAnalysisResult?.facialMetrics?.emotionalExpression ? Object.keys(facialAnalysisResult.facialMetrics.emotionalExpression) : []
            });
          } catch (facialError) {
            console.error('❌ Facial analysis failed with detailed error:', {
              error: facialError,
              errorMessage: (facialError as Error)?.message,
              errorStack: (facialError as Error)?.stack,
              imageDataType: typeof imageData,
              imageDataLength: imageData?.length
            });
            facialAnalysisResult = null;
          }
        } else {
          console.log('⚠️ No image data provided for facial analysis - imageData is:', {
            hasImageData: !!imageData,
            imageDataType: typeof imageData,
            imageDataValue: imageData
          });
        }

        // Process voice analysis if we have audio data
        if (audioData && transcript) {
          console.log('🎵 Processing voice analysis...');
          console.log('🔍 Audio data type:', typeof audioData, 'Transcript length:', transcript?.length);
          console.log('🔍 Audio data preview:', audioData?.substring(0, 100) + '...');
          console.log('🔍 Transcript preview:', transcript?.substring(0, 200) + '...');
          try {
            const { FreeVoiceAnalysisEngine } = await import('./free-voice-analysis.js');
            console.log('✅ FreeVoiceAnalysisEngine imported successfully');
            const voiceEngine = new FreeVoiceAnalysisEngine();
            console.log('✅ FreeVoiceAnalysisEngine instantiated successfully');
            
            console.log('🚀 Starting voice analysis with transcript...');
            voiceAnalysisResult = await voiceEngine.analyzeTranscript(transcript);
            
            console.log('✅ Voice analysis result - Full Structure:', {
              hasResult: !!voiceAnalysisResult,
              resultType: typeof voiceAnalysisResult,
              resultKeys: voiceAnalysisResult ? Object.keys(voiceAnalysisResult) : [],
              clarity: voiceAnalysisResult?.clarity,
              confidence: voiceAnalysisResult?.confidence,
              professionalism: voiceAnalysisResult?.professionalism,
              sentiment: voiceAnalysisResult?.sentiment,
              sentimentType: typeof voiceAnalysisResult?.sentiment,
              sentimentKeys: voiceAnalysisResult?.sentiment ? Object.keys(voiceAnalysisResult.sentiment) : [],
              sentimentScore: voiceAnalysisResult?.sentiment?.score,
              sentimentLabel: voiceAnalysisResult?.sentiment?.label
            });
          } catch (voiceError) {
            console.error('❌ Voice analysis failed with detailed error:', {
              error: voiceError,
              errorMessage: (voiceError as Error)?.message,
              errorStack: (voiceError as Error)?.stack,
              audioDataType: typeof audioData,
              audioDataLength: audioData?.length,
              transcriptLength: transcript?.length
            });
            voiceAnalysisResult = null;
          }
        } else {
          console.log('⚠️ No audio data or transcript provided for voice analysis:', {
            hasAudioData: !!audioData,
            hasTranscript: !!transcript,
            audioDataType: typeof audioData,
            transcriptType: typeof transcript,
            audioDataLength: audioData?.length || 0,
            transcriptLength: transcript?.length || 0
          });
        }

        // Process posture analysis if we have image data
        if (imageData) {
          console.log('🏃 Processing posture analysis...');
          try {
            const { RoboflowVisionEngine } = await import('./roboflow-computer-vision.js');
            console.log('✅ RoboflowVisionEngine imported successfully');
            const postureEngine = new RoboflowVisionEngine();
            console.log('✅ RoboflowVisionEngine instantiated successfully');
            postureAnalysisResult = await postureEngine.analyzeFrame(imageData);
            console.log('✅ Posture analysis result:', {
              posture: postureAnalysisResult?.posture?.confidence,
              gestures: postureAnalysisResult?.gestures?.effectiveness,
              overall: postureAnalysisResult?.overall?.presence
            });
          } catch (postureError) {
            console.error('❌ Posture analysis failed:', postureError);
          }
        } else {
          console.log('⚠️ No image data provided for posture analysis');
        }
      } catch (modelError) {
        console.error('❌ AI model processing failed:', modelError);
        // Continue with session saving even if AI processing fails
      }

      // 📊 AI MODEL RESULTS SUMMARY
      console.log('📊 AI MODEL PROCESSING COMPLETE - Results Summary:', {
        facialAnalysis: {
          hasResult: !!facialAnalysisResult,
          confidence: facialAnalysisResult?.confidence || 0,
          hasMetrics: !!facialAnalysisResult?.facialMetrics,
          hasInsights: !!facialAnalysisResult?.insights?.length
        },
        voiceAnalysis: {
          hasResult: !!voiceAnalysisResult,
          confidence: voiceAnalysisResult?.confidence || 0,
          clarity: voiceAnalysisResult?.clarity || 0,
          hasSentiment: !!voiceAnalysisResult?.sentiment
        },
        postureAnalysis: {
          hasResult: !!postureAnalysisResult,
          hasPosture: !!postureAnalysisResult?.posture,
          hasGestures: !!postureAnalysisResult?.gestures,
          hasOverall: !!postureAnalysisResult?.overall
        }
      });

      // 🎭 EMOTIONAL SCORE CALCULATION
      let emotionalScore = 0;
      let emotionalScoreCalculationMethod = 'none';
      
      console.log('🔍 EMOTIONAL SCORE DEBUG - Input Data Check:', {
        hasVoiceAnalysisResult: !!voiceAnalysisResult,
        hasFacialAnalysisResult: !!facialAnalysisResult,
        voiceAnalysisType: typeof voiceAnalysisResult,
        facialAnalysisType: typeof facialAnalysisResult,
        voiceAnalysisKeys: voiceAnalysisResult ? Object.keys(voiceAnalysisResult) : [],
        facialAnalysisKeys: facialAnalysisResult ? Object.keys(facialAnalysisResult) : []
      });

      if (voiceAnalysisResult && facialAnalysisResult) {
        emotionalScoreCalculationMethod = 'ai_engines';
        
        // Calculate emotional score based on voice sentiment and facial expressions
        const voiceSentiment = voiceAnalysisResult.sentiment?.score || 0;
        const voiceConfidence = voiceAnalysisResult.confidence || 0;
        const facialEngagement = facialAnalysisResult.facialMetrics?.emotionalExpression?.engagement || 0;
        const facialConfidence = facialAnalysisResult.facialMetrics?.emotionalExpression?.confidence || 0;
        
        console.log('🔍 EMOTIONAL SCORE DEBUG - Raw Values:', {
          voiceSentiment: voiceSentiment,
          voiceConfidence: voiceConfidence,
          facialEngagement: facialEngagement,
          facialConfidence: facialConfidence,
          voiceSentimentType: typeof voiceSentiment,
          voiceConfidenceType: typeof voiceConfidence,
          facialEngagementType: typeof facialEngagement,
          facialConfidenceType: typeof facialConfidence
        });
        
        // Normalize sentiment score (-1 to 1) to 0-100 scale
        const normalizedSentiment = Math.max(0, Math.min(100, (voiceSentiment + 1) * 50));
        
        // Calculate emotional score as weighted average
        emotionalScore = Math.round(
          (normalizedSentiment * 0.4) +           // Voice sentiment (40%)
          (voiceConfidence * 0.3) +               // Voice confidence (30%)
          (facialEngagement * 0.2) +              // Facial engagement (20%)
          (facialConfidence * 0.1)                // Facial confidence (10%)
        );
        
        console.log('🎭 EMOTIONAL SCORE CALCULATION (AI ENGINES):', {
          voiceSentiment: voiceSentiment,
          normalizedSentiment: normalizedSentiment,
          voiceConfidence: voiceConfidence,
          facialEngagement: facialEngagement,
          facialConfidence: facialConfidence,
          calculatedEmotionalScore: emotionalScore,
          calculationMethod: emotionalScoreCalculationMethod
        });
      } else if (voiceAnalysisResult) {
        emotionalScoreCalculationMethod = 'voice_only';
        
        // Fallback: Calculate emotional score using only voice data
        const voiceSentiment = voiceAnalysisResult.sentiment?.score || 0;
        const voiceConfidence = voiceAnalysisResult.confidence || 0;
        const normalizedSentiment = Math.max(0, Math.min(100, (voiceSentiment + 1) * 50));
        
        emotionalScore = Math.round(
          (normalizedSentiment * 0.7) +           // Voice sentiment (70%)
          (voiceConfidence * 0.3)                 // Voice confidence (30%)
        );
        
        console.log('🎭 EMOTIONAL SCORE CALCULATION (VOICE ONLY):', {
          voiceSentiment: voiceSentiment,
          normalizedSentiment: normalizedSentiment,
          voiceConfidence: voiceConfidence,
          calculatedEmotionalScore: emotionalScore,
          calculationMethod: emotionalScoreCalculationMethod,
          reason: 'Facial analysis data not available'
        });
      } else if (facialAnalysisResult) {
        emotionalScoreCalculationMethod = 'facial_only';
        
        // Fallback: Calculate emotional score using only facial data
        const facialEngagement = facialAnalysisResult.facialMetrics?.emotionalExpression?.engagement || 0;
        const facialConfidence = facialAnalysisResult.facialMetrics?.emotionalExpression?.confidence || 0;
        
        emotionalScore = Math.round(
          (facialEngagement * 0.7) +              // Facial engagement (70%)
          (facialConfidence * 0.3)                // Facial confidence (30%)
        );
        
        console.log('🎭 EMOTIONAL SCORE CALCULATION (FACIAL ONLY):', {
          facialEngagement: facialEngagement,
          facialConfidence: facialConfidence,
          calculatedEmotionalScore: emotionalScore,
          calculationMethod: emotionalScoreCalculationMethod,
          reason: 'Voice analysis data not available'
        });
      } else {
        emotionalScoreCalculationMethod = 'transcript_fallback';
        
        // Final fallback: Calculate emotional score based on transcript analysis
        if (transcript && transcript.length > 0) {
          const words = transcript.split(/\s+/).filter((word: string) => word.length > 0);
          const wordCount = words.length;
          
          // Simple emotional indicators in transcript
          const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'good', 'best', 'love', 'enjoy', 'happy'];
          const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'worst', 'horrible', 'sad', 'angry', 'frustrated'];
          
          const positiveCount = words.filter((word: string) => 
            positiveWords.some(pos => word.toLowerCase().includes(pos))
          ).length;
          const negativeCount = words.filter((word: string) => 
            negativeWords.some(neg => word.toLowerCase().includes(neg))
          ).length;
          
          // Calculate emotional score based on sentiment ratio
          const sentimentRatio = wordCount > 0 ? (positiveCount - negativeCount) / wordCount : 0;
          const baseScore = 50; // Neutral starting point
          emotionalScore = Math.max(0, Math.min(100, Math.round(baseScore + (sentimentRatio * 50))));
          
          console.log('🎭 EMOTIONAL SCORE CALCULATION (TRANSCRIPT FALLBACK):', {
            wordCount: wordCount,
            positiveCount: positiveCount,
            negativeCount: negativeCount,
            sentimentRatio: sentimentRatio,
            calculatedEmotionalScore: emotionalScore,
            calculationMethod: emotionalScoreCalculationMethod,
            reason: 'AI engines not available, using transcript analysis'
          });
        } else {
          emotionalScore = 50; // Default neutral score
          console.log('🎭 EMOTIONAL SCORE CALCULATION (DEFAULT):', {
            calculatedEmotionalScore: emotionalScore,
            calculationMethod: emotionalScoreCalculationMethod,
            reason: 'No data available, using default neutral score'
          });
        }
      }
      
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
        
        // 🤖 AI MODEL RESULTS: Store processed metrics
        facialAnalysis: facialAnalysisResult ? JSON.stringify(facialAnalysisResult) : null,
        voiceMetrics: voiceAnalysisResult ? JSON.stringify(voiceAnalysisResult) : null,
        bodyLanguageMetrics: postureAnalysisResult ? JSON.stringify(postureAnalysisResult) : null,
        
        // Enhanced metrics from AI processing
        postureScore: postureAnalysisResult?.posture?.confidence || metrics.posture || null,
        volumeConsistency: voiceAnalysisResult?.confidence || metrics.volume || null,
        intonationScore: voiceAnalysisResult?.professionalism || metrics.intonation || null,
        paceScore: voiceAnalysisResult?.clarity || metrics.pace || null,
        
        // 🎭 EMOTIONAL SCORE - Will be added to AI insights instead
        // emotionalScore: emotionalScore || null, // TODO: Add to database schema
        
        // Additional analysis data (stored as JSON)
        transcriptAnalysis: transcriptAnalysis || {},
        fillerWordAnalysis: fillerWordAnalysis || {},
        liveMetricsHistory: liveMetricsHistory || {},
        
        // 🎥 VIDEO DATA STORAGE
        videoBlob: videoData ? (typeof videoData === 'string' ? videoData : Buffer.from(videoData as any).toString('base64')) : null,
        
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
        overallScore: sessionData.overallScore,
        hasVideoData: !!videoData,
        videoDataLength: videoData?.length || 0,
        hasVideoBlob: !!sessionData.videoBlob,
        videoBlobLength: sessionData.videoBlob?.length || 0
      });

      // 🔍 DATABASE STORAGE VERIFICATION
      console.log('🔍 DATABASE STORAGE - AI Results Being Saved:', {
        facialAnalysis: {
          willSave: !!facialAnalysisResult,
          dataType: typeof facialAnalysisResult,
          hasData: facialAnalysisResult ? Object.keys(facialAnalysisResult).length : 0
        },
        voiceMetrics: {
          willSave: !!voiceAnalysisResult,
          dataType: typeof voiceAnalysisResult,
          hasData: voiceAnalysisResult ? Object.keys(voiceAnalysisResult).length : 0
        },
        bodyLanguageMetrics: {
          willSave: !!postureAnalysisResult,
          dataType: typeof postureAnalysisResult,
          hasData: postureAnalysisResult ? Object.keys(postureAnalysisResult).length : 0
        }
      });

      // Save to database
      const savedSession = await storage.createPracticeSession(sessionData);
      
      console.log('✅ Session saved successfully:', savedSession.id);
      
      // 🎭 Add emotional score to AI insights for frontend
      const aiInsights = {
        emotionalScore: emotionalScore || 0,
        emotionalScoreCalculationMethod: emotionalScoreCalculationMethod,
        facialAnalysis: facialAnalysisResult,
        voiceMetrics: voiceAnalysisResult,
        bodyLanguageMetrics: postureAnalysisResult,
        emotionalScoreDebug: {
          hasVoiceData: !!voiceAnalysisResult,
          hasFacialData: !!facialAnalysisResult,
          hasTranscript: !!transcript,
          transcriptLength: transcript?.length || 0,
          calculationMethod: emotionalScoreCalculationMethod,
          finalScore: emotionalScore
        }
      };

      res.json({
        success: true,
        session: savedSession,
        aiInsights: aiInsights,
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

  // 🎥 VIDEO SERVING ENDPOINTS FOR SIMPLIFIED BACKEND
  
  // Get session with video for playback
  app.get('/api/sessions/:id/video', async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const userId = getUserId(req);
      
      console.log('🎥 Fetching video for session:', sessionId, 'User:', userId);
      
      const session = await storage.getPracticeSession(sessionId);
      
      if (!session) {
        console.log('❌ Session not found:', sessionId);
        return res.status(404).json({ 
          success: false,
          message: "Session not found" 
        });
      }
      
      if (session.userId !== userId && userId !== 'guest') {
        console.log('❌ Access denied for session:', sessionId, 'User:', userId);
        return res.status(403).json({ 
          success: false,
          message: "Access denied" 
        });
      }

      console.log('🔍 Session video data check:', {
        sessionId: session.id,
        hasVideoBlob: !!session.videoBlob,
        videoBlobType: typeof session.videoBlob,
        videoBlobLength: session.videoBlob?.length || 0,
        hasTranscript: !!session.transcript,
        transcriptLength: session.transcript?.length || 0
      });

      // Convert videoBlob to data URL for video playback
      const hasVideo = !!session.videoBlob;
      let videoUrl = null;
      
      if (hasVideo) {
        try {
          // Handle both base64 string and buffer formats
          let base64Video;
          if (typeof session.videoBlob === 'string') {
            base64Video = session.videoBlob;
          } else if (Buffer.isBuffer(session.videoBlob)) {
            base64Video = (session.videoBlob as Buffer).toString('base64');
          } else {
            console.error('❌ Unknown video blob format:', typeof session.videoBlob);
            base64Video = null;
          }
          
          if (base64Video) {
            videoUrl = `data:video/webm;base64,${base64Video}`;
            console.log('✅ Video URL created successfully, length:', videoUrl.length);
          }
        } catch (videoError) {
          console.error('❌ Failed to create video URL:', videoError);
        }
      }

      // Return session data with video URL if available
      const response = {
        success: true,
        session: {
          id: session.id,
          sessionName: session.sessionName || session.name || "Practice Session",
          transcript: session.transcript,
          duration: session.duration,
          confidenceScore: session.confidenceScore,
          overallScore: session.overallScore || 0,
          createdAt: session.createdAt
        },
        hasVideo: hasVideo,
        videoUrl: videoUrl,
        hasTranscript: !!session.transcript,
        videoDebug: {
          hasVideoBlob: hasVideo,
          videoBlobType: typeof session.videoBlob,
          videoBlobLength: session.videoBlob?.length || 0,
          videoUrlCreated: !!videoUrl,
          videoUrlLength: videoUrl?.length || 0
        }
      };
      
      console.log('✅ Video session data retrieved:', {
        sessionId: session.id,
        hasVideo: hasVideo,
        hasVideoUrl: !!videoUrl,
        hasTranscript: !!session.transcript
      });
      
      res.json(response);
      
    } catch (error: any) {
      console.error('❌ Failed to get session video:', error);
      res.status(500).json({ 
        success: false,
        message: "Failed to retrieve session", 
        error: error.message 
      });
    }
  });

  // Get all user sessions with video info for history viewer
  app.get('/api/sessions/video-history', async (req, res) => {
    try {
      const userId = getUserId(req);
      console.log('📹 Fetching video history for user:', userId);
      
      const sessions = await storage.getUserPracticeSessions(userId);
      
      const sessionsWithVideoInfo = sessions.map(session => ({
        id: session.id,
        sessionName: session.sessionName || session.name || "Practice Session",
        transcript: session.transcript,
        duration: session.duration,
        hasVideo: !!session.videoBlob,
        videoSize: session.videoBlob?.length || 0,
        createdAt: session.createdAt,
        confidenceScore: session.confidenceScore,
        overallScore: session.overallScore || 0
      }));

      console.log('✅ Video history retrieved:', {
        userId,
        totalSessions: sessions.length,
        sessionsWithVideo: sessionsWithVideoInfo.filter(s => s.hasVideo).length
      });

      res.json({
        success: true,
        sessions: sessionsWithVideoInfo
      });
      
    } catch (error: any) {
      console.error('❌ Failed to get video history:', error);
      res.status(500).json({ 
        success: false,
        message: "Failed to retrieve video history", 
        error: error.message 
      });
    }
  });

  // Direct video stream endpoint (for better performance)
  app.get('/api/sessions/:id/video-stream', async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const userId = getUserId(req);
      
      console.log('🎬 Streaming video for session:', sessionId);
      
      const session = await storage.getPracticeSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      if (session.userId !== userId && userId !== 'guest') {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!session.videoBlob) {
        return res.status(404).json({ message: "No video available for this session" });
      }

      // Set appropriate headers for video streaming
      res.setHeader('Content-Type', 'video/webm');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      
      // Handle CORS for video streaming
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Range');

      // Convert video blob to buffer and send
      let videoBuffer;
      if (typeof session.videoBlob === 'string') {
        videoBuffer = Buffer.from(session.videoBlob, 'base64');
      } else if (Buffer.isBuffer(session.videoBlob)) {
        videoBuffer = session.videoBlob;
      } else {
        return res.status(500).json({ message: "Invalid video format" });
      }

      console.log('✅ Streaming video buffer:', {
        sessionId,
        bufferSize: videoBuffer.length,
        bufferType: typeof videoBuffer
      });

      res.send(videoBuffer);
      
    } catch (error: any) {
      console.error('❌ Failed to stream video:', error);
      res.status(500).json({ 
        message: "Failed to stream video", 
        error: error.message 
      });
    }
  });

  return server;
}
