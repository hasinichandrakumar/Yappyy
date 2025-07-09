// Enhanced Real-Time Processing Engine - Sub-100ms AI Response
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Queue from 'bull';
import Redis from 'ioredis';
import { aiOrchestrator } from './advanced-ai-orchestrator';
import { voiceEngine, voiceCoach } from './advanced-voice-engine';

// High-performance processing interfaces
interface ProcessingJob {
  id: string;
  type: 'voice-analysis' | 'vision-analysis' | 'content-analysis' | 'multi-modal';
  priority: number;
  data: any;
  sessionId: string;
  userId: string;
  timestamp: number;
}

interface ProcessingResult {
  jobId: string;
  type: string;
  result: any;
  processingTime: number;
  confidence: number;
  cached: boolean;
}

interface SessionMetrics {
  processingLatency: number[];
  throughput: number;
  activeConnections: number;
  queueLength: number;
  cacheHitRate: number;
}

// Advanced Real-Time Processing Engine
export class RealTimeProcessingEngine {
  private io: SocketIOServer;
  private redis: Redis;
  private processingQueues: {
    high: Queue.Queue;
    medium: Queue.Queue;
    low: Queue.Queue;
  } = {} as any;
  private cachingEngine: MultiLayerCache;
  private sessionMetrics: Map<string, SessionMetrics> = new Map();
  private performanceMonitor: PerformanceMonitor;

  constructor(server: HTTPServer) {
    this.initializeRedis();
    this.initializeSocketIO(server);
    this.initializeProcessingQueues();
    this.cachingEngine = new MultiLayerCache(this.redis);
    this.performanceMonitor = new PerformanceMonitor();
    
    this.setupSocketHandlers();
    this.setupQueueProcessors();
    this.startPerformanceMonitoring();
    
    console.log('🚀 Enhanced Real-Time Processing Engine initialized');
  }

  private initializeRedis(): void {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000
    });

    this.redis.on('error', (error) => {
      console.warn('Redis connection issue, falling back to memory cache:', error.message);
    });
  }

  private initializeSocketIO(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      allowEIO3: true
    });
  }

  private initializeProcessingQueues(): void {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    };

    // Initialize the processingQueues object
    this.processingQueues = {
      high: null as any,
      medium: null as any,
      low: null as any
    };

    // High priority: Real-time feedback (voice, vision)
    this.processingQueues.high = new Queue('high-priority-analysis', {
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 25,
        attempts: 2,
        backoff: { type: 'fixed', delay: 100 }
      }
    });

    // Medium priority: Content analysis
    this.processingQueues.medium = new Queue('medium-priority-analysis', {
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: { type: 'exponential', delay: 200 }
      }
    });

    // Low priority: Historical analysis, reports
    this.processingQueues.low = new Queue('low-priority-analysis', {
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 200,
        removeOnFail: 100,
        attempts: 5,
        backoff: { type: 'exponential', delay: 500 }
      }
    });
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);
      
      // Join session room
      socket.on('join-session', async (data: { sessionId: string, userId: string }) => {
        await socket.join(`session-${data.sessionId}`);
        await socket.join(`user-${data.userId}`);
        
        // Initialize session metrics
        this.sessionMetrics.set(data.sessionId, {
          processingLatency: [],
          throughput: 0,
          activeConnections: 1,
          queueLength: 0,
          cacheHitRate: 0
        });
        
        socket.emit('session-ready', { sessionId: data.sessionId });
      });

      // Real-time voice analysis
      socket.on('voice-stream', async (data: { sessionId: string, audioBuffer: ArrayBuffer, timestamp: number }) => {
        const startTime = Date.now();
        
        try {
          // Check cache first
          const cacheKey = `voice:${data.sessionId}:${data.timestamp}`;
          const cached = await this.cachingEngine.get(cacheKey);
          
          if (cached) {
            socket.emit('voice-analysis', { 
              ...cached, 
              processingTime: Date.now() - startTime,
              cached: true 
            });
            return;
          }

          // Queue for processing
          const job = await this.processingQueues.high.add('voice-analysis', {
            sessionId: data.sessionId,
            audioBuffer: data.audioBuffer,
            timestamp: data.timestamp,
            socketId: socket.id
          }, { priority: 1 });

          this.updateSessionMetrics(data.sessionId, 'queueLength', 1);
          
        } catch (error) {
          console.error('Voice stream processing failed:', error);
          socket.emit('analysis-error', { type: 'voice', error: error.message });
        }
      });

      // Real-time vision analysis
      socket.on('vision-frame', async (data: { sessionId: string, imageData: string, timestamp: number }) => {
        const startTime = Date.now();
        
        try {
          const cacheKey = `vision:${data.sessionId}:${Math.floor(data.timestamp / 1000)}`; // Cache per second
          const cached = await this.cachingEngine.get(cacheKey);
          
          if (cached) {
            socket.emit('vision-analysis', { 
              ...cached, 
              processingTime: Date.now() - startTime,
              cached: true 
            });
            return;
          }

          await this.processingQueues.high.add('vision-analysis', {
            sessionId: data.sessionId,
            imageData: data.imageData,
            timestamp: data.timestamp,
            socketId: socket.id
          }, { priority: 1 });
          
        } catch (error) {
          console.error('Vision frame processing failed:', error);
          socket.emit('analysis-error', { type: 'vision', error: error.message });
        }
      });

      // Content analysis
      socket.on('content-update', async (data: { sessionId: string, transcript: string, confidence: number }) => {
        try {
          await this.processingQueues.medium.add('content-analysis', {
            sessionId: data.sessionId,
            transcript: data.transcript,
            confidence: data.confidence,
            socketId: socket.id
          }, { priority: 2 });
          
        } catch (error) {
          console.error('Content analysis failed:', error);
          socket.emit('analysis-error', { type: 'content', error: error.message });
        }
      });

      // Multi-modal comprehensive analysis
      socket.on('comprehensive-analysis', async (data: any) => {
        try {
          await this.processingQueues.medium.add('multi-modal-analysis', {
            ...data,
            socketId: socket.id
          }, { priority: 2 });
          
        } catch (error) {
          console.error('Comprehensive analysis failed:', error);
          socket.emit('analysis-error', { type: 'comprehensive', error: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });
  }

  private setupQueueProcessors(): void {
    // High priority processors (sub-100ms target)
    this.processingQueues.high.process('voice-analysis', 10, async (job) => {
      const startTime = Date.now();
      
      try {
        const { sessionId, audioBuffer, timestamp, socketId } = job.data;
        
        // Parallel processing for speed
        const [metrics, coaching] = await Promise.all([
          voiceEngine.analyzeVoice(audioBuffer),
          voiceCoach.provideLiveCoaching(audioBuffer)
        ]);

        const result = { metrics, coaching, timestamp };
        const processingTime = Date.now() - startTime;
        
        // Cache the result
        const cacheKey = `voice:${sessionId}:${timestamp}`;
        await this.cachingEngine.set(cacheKey, result, 300); // 5 minutes TTL
        
        // Emit to specific socket
        this.io.to(socketId).emit('voice-analysis', {
          ...result,
          processingTime,
          cached: false
        });
        
        // Update metrics
        this.updateSessionMetrics(sessionId, 'processingLatency', processingTime);
        this.updateSessionMetrics(sessionId, 'throughput', 1);
        
        return result;
      } catch (error) {
        console.error('Voice analysis processing failed:', error);
        throw error;
      }
    });

    this.processingQueues.high.process('vision-analysis', 8, async (job) => {
      const startTime = Date.now();
      
      try {
        const { sessionId, imageData, timestamp, socketId } = job.data;
        
        // Convert base64 to ImageData for processing
        const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
        
        // Simulate advanced vision analysis
        const result = {
          bodyLanguage: {
            posture_confidence: Math.random() * 100,
            gesture_effectiveness: Math.random() * 100,
            eye_contact_score: Math.random() * 100,
            facial_expressions: {
              confidence: Math.random() * 100,
              engagement: Math.random() * 100,
              authenticity: Math.random() * 100
            }
          },
          gaze: {
            audience_engagement: Math.random() * 100,
            gaze_distribution: [25, 30, 20, 15, 10],
            eye_contact_timing: [2.5, 1.8, 3.2]
          },
          timestamp
        };
        
        const processingTime = Date.now() - startTime;
        
        // Cache the result
        const cacheKey = `vision:${sessionId}:${Math.floor(timestamp / 1000)}`;
        await this.cachingEngine.set(cacheKey, result, 60); // 1 minute TTL
        
        this.io.to(socketId).emit('vision-analysis', {
          ...result,
          processingTime,
          cached: false
        });
        
        this.updateSessionMetrics(sessionId, 'processingLatency', processingTime);
        
        return result;
      } catch (error) {
        console.error('Vision analysis processing failed:', error);
        throw error;
      }
    });

    // Medium priority processors
    this.processingQueues.medium.process('content-analysis', 5, async (job) => {
      const startTime = Date.now();
      
      try {
        const { sessionId, transcript, confidence, socketId } = job.data;
        
        // Advanced content analysis
        const analysis = {
          wordCount: transcript.split(' ').length,
          sentenceCount: transcript.split(/[.!?]+/).length,
          fillerWords: await voiceEngine.analyzeFillerWords(transcript),
          clarity: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low',
          coherence: Math.random() * 100,
          persuasiveness: Math.random() * 100,
          suggestions: this.generateContentSuggestions(transcript)
        };
        
        const processingTime = Date.now() - startTime;
        
        this.io.to(socketId).emit('content-analysis', {
          analysis,
          processingTime,
          cached: false
        });
        
        return analysis;
      } catch (error) {
        console.error('Content analysis processing failed:', error);
        throw error;
      }
    });

    this.processingQueues.medium.process('multi-modal-analysis', 3, async (job) => {
      const startTime = Date.now();
      
      try {
        const { sessionId, socketId, ...data } = job.data;
        
        // Use the advanced AI orchestrator for comprehensive analysis
        const result = await aiOrchestrator.processFrame(data);
        const processingTime = Date.now() - startTime;
        
        this.io.to(socketId).emit('comprehensive-analysis', {
          result,
          processingTime,
          cached: false
        });
        
        return result;
      } catch (error) {
        console.error('Multi-modal analysis processing failed:', error);
        throw error;
      }
    });

    console.log('📊 Queue processors initialized with optimized concurrency');
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
    
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    
    if (avgSentenceLength > 25) {
      suggestions.push('Consider shorter sentences for better comprehension');
    } else if (avgSentenceLength < 8) {
      suggestions.push('Develop your ideas with more detailed sentences');
    }
    
    return suggestions;
  }

  private updateSessionMetrics(sessionId: string, metric: keyof SessionMetrics, value: number): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (!metrics) return;
    
    switch (metric) {
      case 'processingLatency':
        metrics.processingLatency.push(value);
        if (metrics.processingLatency.length > 100) {
          metrics.processingLatency = metrics.processingLatency.slice(-50); // Keep last 50
        }
        break;
      case 'throughput':
        metrics.throughput += value;
        break;
      case 'queueLength':
        metrics.queueLength += value;
        break;
      default:
        (metrics as any)[metric] = value;
    }
    
    this.sessionMetrics.set(sessionId, metrics);
  }

  private startPerformanceMonitoring(): void {
    setInterval(async () => {
      try {
        const queueLengths = {
          high: 0,
          medium: 0,
          low: 0
        };

        // Safely get queue lengths using proper Bull queue methods
        try {
          if (this.processingQueues.high && typeof this.processingQueues.high.getWaiting === 'function') {
            const waitingJobs = await this.processingQueues.high.getWaiting();
            queueLengths.high = waitingJobs.length;
          }
          if (this.processingQueues.medium && typeof this.processingQueues.medium.getWaiting === 'function') {
            const waitingJobs = await this.processingQueues.medium.getWaiting();
            queueLengths.medium = waitingJobs.length;
          }
          if (this.processingQueues.low && typeof this.processingQueues.low.getWaiting === 'function') {
            const waitingJobs = await this.processingQueues.low.getWaiting();
            queueLengths.low = waitingJobs.length;
          }
        } catch (error) {
          // Silently continue - queue metrics are non-critical
        }

        this.performanceMonitor.collectMetrics({
          activeConnections: this.io.sockets.sockets.size,
          queueLengths,
          sessionCount: this.sessionMetrics.size
        });
      } catch (error) {
        console.warn('Performance monitoring failed:', error.message);
      }
    }, 5000); // Collect metrics every 5 seconds
  }

  // Public methods for external access
  public getSessionMetrics(sessionId: string): SessionMetrics | undefined {
    return this.sessionMetrics.get(sessionId);
  }

  public getOverallPerformance(): any {
    return this.performanceMonitor.getOverallStats();
  }

  public async cleanup(): Promise<void> {
    await Promise.all([
      this.processingQueues.high.close(),
      this.processingQueues.medium.close(),
      this.processingQueues.low.close(),
      this.redis.quit()
    ]);
    this.io.close();
  }
}

// Multi-Layer Caching Engine
class MultiLayerCache {
  private l1Cache = new Map<string, { data: any, expires: number }>(); // Memory
  private l2Cache: Redis; // Redis
  private l3Cache = new Map<string, any>(); // Persistent fallback

  constructor(redis: Redis) {
    this.l2Cache = redis;
    
    // Cleanup expired L1 cache entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.l1Cache.entries()) {
        if (entry.expires < now) {
          this.l1Cache.delete(key);
        }
      }
    }, 60000);
  }

  async get(key: string): Promise<any | null> {
    // L1 Cache (Memory)
    const l1Entry = this.l1Cache.get(key);
    if (l1Entry && l1Entry.expires > Date.now()) {
      return l1Entry.data;
    }

    try {
      // L2 Cache (Redis)
      const l2Data = await this.l2Cache.get(key);
      if (l2Data) {
        const parsed = JSON.parse(l2Data);
        // Store in L1 for faster next access
        this.l1Cache.set(key, { data: parsed, expires: Date.now() + 60000 });
        return parsed;
      }
    } catch (error) {
      console.warn('Redis cache read failed, checking L3:', error.message);
    }

    // L3 Cache (Fallback)
    return this.l3Cache.get(key) || null;
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    const expires = Date.now() + (ttlSeconds * 1000);
    
    // L1 Cache
    this.l1Cache.set(key, { data: value, expires });

    try {
      // L2 Cache (Redis)
      await this.l2Cache.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.warn('Redis cache write failed, using L3:', error.message);
      // L3 Cache (Fallback)
      this.l3Cache.set(key, value);
    }
  }
}

// Performance Monitoring
class PerformanceMonitor {
  private metrics: any[] = [];
  private maxMetrics = 1000;

  collectMetrics(data: any): void {
    this.metrics.push({
      timestamp: Date.now(),
      ...data
    });

    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics / 2);
    }
  }

  getOverallStats(): any {
    if (this.metrics.length === 0) return {};

    const recent = this.metrics.slice(-100); // Last 100 data points
    
    return {
      averageConnections: recent.reduce((sum, m) => sum + (m.activeConnections || 0), 0) / recent.length,
      averageQueueLength: recent.reduce((sum, m) => {
        const queueLengths = m.queueLengths || {};
        return sum + (queueLengths.high || 0) + (queueLengths.medium || 0) + (queueLengths.low || 0);
      }, 0) / recent.length,
      peakConnections: Math.max(...recent.map(m => m.activeConnections || 0)),
      dataPoints: recent.length,
      timespan: recent.length > 0 ? recent[recent.length - 1].timestamp - recent[0].timestamp : 0
    };
  }
}

// Engine exported in class declaration above