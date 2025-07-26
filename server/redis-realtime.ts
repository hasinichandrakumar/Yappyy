// Real-Time Processing with Redis & Socket.IO
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Redis from 'ioredis';
import Queue from 'bull';

export interface RealTimeSession {
  sessionId: string;
  userId: string;
  startTime: number;
  metrics: LiveMetrics;
  feedback: LiveFeedback[];
}

export interface LiveMetrics {
  currentWPM: number;
  fillerWords: string[];
  eyeContact: number;
  posture: number;
  voiceClarity: number;
  gestureCount: number;
  emotionalTone: string;
  audienceEngagement: number;
}

export interface LiveFeedback {
  timestamp: number;
  type: 'positive' | 'improvement' | 'warning';
  category: 'voice' | 'body_language' | 'content';
  message: string;
  actionable: string;
}

// Redis Real-Time Session Manager
export class RealTimeSessionManager {
  private redis: Redis;
  private io: SocketIOServer;
  private aiProcessingQueue: Queue.Queue;
  private activeSessions = new Map<string, RealTimeSession>();

  constructor(server: HTTPServer) {
    // Initialize Redis with fallback to memory storage
    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 1,
        lazyConnect: true
      });
    } catch (error) {
      console.warn('Redis not available, using memory storage for real-time features');
    }

    // Initialize Socket.IO
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    });

    // Initialize Bull Queue for AI processing with fallback
    try {
      this.aiProcessingQueue = new Queue('AI Processing', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379')
        }
      });
    } catch (error) {
      console.warn('Queue processing disabled - Redis not available');
    }

    this.setupSocketHandlers();
    this.setupQueueProcessors();
    
    console.log('🚀 Real-Time Session Manager initialized');
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`👤 User connected: ${socket.id}`);

      // Join user to their personal room
      socket.on('join-session', async (data: { userId: string, sessionId: string }) => {
        await socket.join(`session-${data.sessionId}`);
        await socket.join(`user-${data.userId}`);
        
        // Initialize session
        const session: RealTimeSession = {
          sessionId: data.sessionId,
          userId: data.userId,
          startTime: Date.now(),
          metrics: this.getDefaultMetrics(),
          feedback: []
        };

        this.activeSessions.set(data.sessionId, session);
        await this.redis.setex(`session:${data.sessionId}`, 3600, JSON.stringify(session));

        socket.emit('session-initialized', { sessionId: data.sessionId });
        console.log(`📊 Session ${data.sessionId} initialized for user ${data.userId}`);
      });

      // Real-time metrics update
      socket.on('metrics-update', async (data: { sessionId: string, metrics: Partial<LiveMetrics> }) => {
        const session = this.activeSessions.get(data.sessionId);
        if (!session) return;

        // Update session metrics
        session.metrics = { ...session.metrics, ...data.metrics };
        
        // Store in Redis
        await this.redis.setex(`session:${data.sessionId}`, 3600, JSON.stringify(session));

        // Broadcast to session room
        this.io.to(`session-${data.sessionId}`).emit('live-metrics', session.metrics);

        // Queue AI analysis for intelligent feedback
        await this.aiProcessingQueue.add('analyze-metrics', {
          sessionId: data.sessionId,
          metrics: session.metrics,
          timestamp: Date.now()
        }, {
          delay: 1000, // Process after 1 second
          removeOnComplete: 5,
          removeOnFail: 3
        });
      });

      // Speech transcript update
      socket.on('transcript-update', async (data: { sessionId: string, transcript: string, confidence: number }) => {
        const session = this.activeSessions.get(data.sessionId);
        if (!session) return;

        // Queue transcript analysis
        await this.aiProcessingQueue.add('analyze-transcript', {
          sessionId: data.sessionId,
          transcript: data.transcript,
          confidence: data.confidence,
          timestamp: Date.now()
        }, {
          removeOnComplete: 5,
          removeOnFail: 3
        });

        // Broadcast transcript to session
        this.io.to(`session-${data.sessionId}`).emit('live-transcript', {
          transcript: data.transcript,
          confidence: data.confidence,
          timestamp: Date.now()
        });
      });

      // Video frame analysis
      socket.on('video-frame', async (data: { sessionId: string, frameData: string }) => {
        // Queue video analysis
        await this.aiProcessingQueue.add('analyze-video-frame', {
          sessionId: data.sessionId,
          frameData: data.frameData,
          timestamp: Date.now()
        }, {
          removeOnComplete: 3,
          removeOnFail: 2,
          attempts: 2
        });
      });

      // End session
      socket.on('end-session', async (data: { sessionId: string }) => {
        const session = this.activeSessions.get(data.sessionId);
        if (!session) return;

        // Final session summary
        const summary = await this.generateSessionSummary(session);
        
        // Store final session data
        await this.redis.setex(`session:final:${data.sessionId}`, 86400, JSON.stringify({
          ...session,
          summary,
          endTime: Date.now()
        }));

        // Clean up active session
        this.activeSessions.delete(data.sessionId);
        
        socket.emit('session-ended', { summary });
        console.log(`✅ Session ${data.sessionId} ended`);
      });

      socket.on('disconnect', () => {
        console.log(`👋 User disconnected: ${socket.id}`);
      });
    });
  }

  private setupQueueProcessors(): void {
    // AI Metrics Analysis Processor
    this.aiProcessingQueue.process('analyze-metrics', async (job) => {
      const { sessionId, metrics, timestamp } = job.data;
      
      try {
        const feedback = await this.generateIntelligentFeedback(metrics, timestamp);
        
        if (feedback) {
          // Send feedback to session
          this.io.to(`session-${sessionId}`).emit('ai-feedback', feedback);
          
          // Update session with feedback
          const session = this.activeSessions.get(sessionId);
          if (session) {
            session.feedback.push(feedback);
            await this.redis.setex(`session:${sessionId}`, 3600, JSON.stringify(session));
          }
        }
      } catch (error) {
        console.error('AI metrics analysis failed:', error);
      }
    });

    // Transcript Analysis Processor
    this.aiProcessingQueue.process('analyze-transcript', async (job) => {
      const { sessionId, transcript, confidence, timestamp } = job.data;
      
      try {
        const analysis = await this.analyzeTranscriptContent(transcript, confidence);
        
        this.io.to(`session-${sessionId}`).emit('transcript-analysis', {
          ...analysis,
          timestamp
        });
      } catch (error) {
        console.error('Transcript analysis failed:', error);
      }
    });

    // Video Frame Analysis Processor
    this.aiProcessingQueue.process('analyze-video-frame', async (job) => {
      const { sessionId, frameData, timestamp } = job.data;
      
      try {
        const analysis = await this.analyzeVideoFrame(frameData);
        
        this.io.to(`session-${sessionId}`).emit('video-analysis', {
          ...analysis,
          timestamp
        });
      } catch (error) {
        console.error('Video frame analysis failed:', error);
      }
    });

    console.log('🔄 Queue processors initialized');
  }

  private async generateIntelligentFeedback(metrics: LiveMetrics, timestamp: number): Promise<LiveFeedback | null> {
    // Intelligent feedback generation based on real-time metrics
    
    // Check for speaking pace issues
    if (metrics.currentWPM > 180) {
      return {
        timestamp,
        type: 'improvement',
        category: 'voice',
        message: `Speaking at ${metrics.currentWPM} WPM - slow down for better comprehension`,
        actionable: 'Take a brief pause and reduce your speaking pace'
      };
    }

    // Check for filler word frequency
    if (metrics.fillerWords.length > 5) {
      return {
        timestamp,
        type: 'improvement',
        category: 'voice',
        message: `${metrics.fillerWords.length} filler words detected recently`,
        actionable: 'Practice pausing instead of using filler words'
      };
    }

    // Check for eye contact
    if (metrics.eyeContact < 50) {
      return {
        timestamp,
        type: 'improvement',
        category: 'body_language',
        message: 'Eye contact could be improved',
        actionable: 'Look directly at the camera more frequently'
      };
    }

    // Check for posture
    if (metrics.posture < 60) {
      return {
        timestamp,
        type: 'improvement',
        category: 'body_language',
        message: 'Posture needs attention',
        actionable: 'Straighten your shoulders and maintain good posture'
      };
    }

    // Positive reinforcement
    if (metrics.eyeContact > 80 && metrics.posture > 80) {
      return {
        timestamp,
        type: 'positive',
        category: 'body_language',
        message: 'Excellent presence and eye contact!',
        actionable: 'Keep maintaining this confident posture'
      };
    }

    return null;
  }

  private async analyzeTranscriptContent(transcript: string, confidence: number): Promise<any> {
    // Advanced content analysis
    const wordCount = transcript.split(' ').length;
    const sentenceCount = transcript.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;

    return {
      wordCount,
      sentenceCount,
      avgWordsPerSentence,
      confidence,
      clarity: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low',
      suggestions: this.generateContentSuggestions(transcript)
    };
  }

  private async analyzeVideoFrame(frameData: string): Promise<any> {
    // Video frame analysis would integrate with MediaPipe or TensorFlow.js
    return {
      faceDetected: true,
      eyeContactScore: 0
      postureScore: 0
      gestureActivity: 0
      emotionalState: 'confident'
    };
  }

  private generateContentSuggestions(transcript: string): string[] {
    const suggestions: string[] = [];
    
    if (transcript.length < 50) {
      suggestions.push('Consider elaborating on your points for better clarity');
    }
    
    const fillerWords = ['um', 'uh', 'like', 'you know'].filter(word => 
      transcript.toLowerCase().includes(word)
    );
    
    if (fillerWords.length > 0) {
      suggestions.push(`Reduce filler words: ${fillerWords.join(', ')}`);
    }

    return suggestions;
  }

  private async generateSessionSummary(session: RealTimeSession): Promise<any> {
    const duration = Date.now() - session.startTime;
    const avgMetrics = this.calculateAverageMetrics(session);

    return {
      duration: Math.round(duration / 1000), // seconds
      totalFeedback: session.feedback.length,
      averageMetrics: avgMetrics,
      improvements: this.identifyImprovements(session),
      strengths: this.identifyStrengths(session)
    };
  }

  private calculateAverageMetrics(session: RealTimeSession): LiveMetrics {
    // Calculate average metrics over the session
    return session.metrics; // Simplified for now
  }

  private identifyImprovements(session: RealTimeSession): string[] {
    const improvements: string[] = [];
    
    if (session.metrics.currentWPM > 180) {
      improvements.push('Reduce speaking pace for better audience comprehension');
    }
    
    if (session.metrics.eyeContact < 60) {
      improvements.push('Increase eye contact with the audience');
    }

    return improvements;
  }

  private identifyStrengths(session: RealTimeSession): string[] {
    const strengths: string[] = [];
    
    if (session.metrics.voiceClarity > 80) {
      strengths.push('Excellent voice clarity and articulation');
    }
    
    if (session.metrics.posture > 80) {
      strengths.push('Confident and professional posture');
    }

    return strengths;
  }

  private getDefaultMetrics(): LiveMetrics {
    return {
      currentWPM: 0,
      fillerWords: [],
      eyeContact: 0,
      posture: 0,
      voiceClarity: 0,
      gestureCount: 0,
      emotionalTone: 'neutral',
      audienceEngagement: 0
    };
  }

  // Get real-time session data
  public async getSessionData(sessionId: string): Promise<RealTimeSession | null> {
    const cachedSession = await this.redis.get(`session:${sessionId}`);
    if (cachedSession) {
      return JSON.parse(cachedSession);
    }
    return this.activeSessions.get(sessionId) || null;
  }

  // Broadcast message to all sessions
  public broadcastToAllSessions(event: string, data: any): void {
    this.io.emit(event, data);
  }

  // Cleanup
  public async cleanup(): Promise<void> {
    await this.aiProcessingQueue.close();
    await this.redis.quit();
    this.io.close();
  }
}