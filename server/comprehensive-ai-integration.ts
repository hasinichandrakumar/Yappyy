/**
 * Comprehensive AI Integration Layer
 * Orchestrates all AI/CV/Audio systems to provide authentic analytics
 */

import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { HfInference } from '@huggingface/inference';
import { RoboflowVisionEngine } from './roboflow-computer-vision';
import { MediaPipeVisionEngine } from './mediapipe-computer-vision';
import { OpenCVVisionEngine } from './opencv-computer-vision';
import { authenticFacialAnalysis } from './authentic-facial-analysis';
import { facialExpressionAnalysis } from './facial-expression-analysis';
import { freeVoiceAnalysis } from './free-voice-analysis';
import { speechEmotionRecognition } from './speech-emotion-recognition';
import { advancedFillerDetectionEngine } from './advanced-filler-detection';
import { processUltraAdvancedAnalysis } from './ultra-advanced-ai-engine';
import { enhancedNeuralPipeline } from './enhanced-neural-pipeline';
import { worldClassNeuralAICoach } from './world-class-neural-ai-coach';

// Core analysis result interfaces
export interface ComprehensiveAnalysisResult {
  // Computer Vision Data
  bodyLanguage: {
    posture: {
      score: number;
      confidence: number;
      details: string;
      rawData: any;
    };
    gestures: {
      score: number;
      openness: number;
      engagement: number;
      rawData: any;
    };
    eyeContact: {
      percentage: number;
      quality: number;
      patterns: string[];
      rawData: any;
    };
    facialExpressions: {
      dominantEmotion: string;
      emotionScores: Record<string, number>;
      microExpressions: string[];
      authenticity: number;
      rawData: any;
    };
  };
  
  // Audio Analysis Data
  voice: {
    tone: {
      pitch: number;
      variability: number;
      emotion: string;
      confidence: number;
    };
    pace: {
      wordsPerMinute: number;
      pauseAnalysis: {
        count: number;
        averageDuration: number;
        strategic: boolean;
      };
    };
    clarity: {
      articulation: number;
      volumeConsistency: number;
      pronunciation: number;
    };
    fillerWords: {
      count: number;
      types: Record<string, number>;
      perMinute: number;
      locations: number[];
    };
  };
  
  // Content Analysis Data
  content: {
    structure: {
      score: number;
      hasIntro: boolean;
      hasConclusion: boolean;
      logicalFlow: number;
    };
    vocabulary: {
      diversity: number;
      complexity: number;
      appropriateness: number;
    };
    persuasiveness: {
      score: number;
      techniques: string[];
      callsToAction: number;
    };
    clarity: {
      score: number;
      jargonUsage: number;
      sentenceComplexity: number;
    };
  };
  
  // Overall Metrics
  overall: {
    confidenceScore: number;
    engagementScore: number;
    authenticityScore: number;
    improvementAreas: string[];
    strengths: string[];
  };
  
  // Metadata
  metadata: {
    processingTime: number;
    enginesUsed: string[];
    dataQuality: number;
    timestamp: Date;
  };
}

export class ComprehensiveAIIntegration {
  private openai: OpenAI;
  private anthropic: Anthropic | null;
  private huggingface: HfInference;
  
  // Computer Vision Engines
  private roboflowEngine: RoboflowVisionEngine | null;
  private mediaPipeEngine: MediaPipeVisionEngine;
  private openCVEngine: OpenCVVisionEngine;
  private facialAnalysisEngine: typeof authenticFacialAnalysis;
  private expressionEngine: typeof facialExpressionAnalysis;
  
  // Audio Analysis Engines
  private voiceAnalysisEngine: typeof freeVoiceAnalysis;
  private speechEmotionEngine: typeof speechEmotionRecognition;
  
  // Processing metrics
  private processingMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    averageResponseTime: 0,
    lastProcessingTime: 0
  };

  constructor() {
    console.log('🚀 Initializing Comprehensive AI Integration Layer...');
    
    // Initialize primary AI services
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.anthropic = process.env.ANTHROPIC_API_KEY 
      ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      : null;
      
    this.huggingface = new HfInference(process.env.HUGGING_FACE_API_KEY || '');
    
    // Initialize Computer Vision Stack
    this.initializeComputerVision();
    
    // Initialize Audio Processing Stack
    this.initializeAudioProcessing();
    
    console.log('✅ Comprehensive AI Integration Layer initialized');
  }
  
  private initializeComputerVision(): void {
    console.log('📸 Initializing Computer Vision Stack...');
    
    // Roboflow (with fallback handling)
    try {
      this.roboflowEngine = new RoboflowVisionEngine();
    } catch (error) {
      console.log('⚠️ Roboflow unavailable, using fallback engines');
      this.roboflowEngine = null;
    }
    
    // MediaPipe (always available)
    this.mediaPipeEngine = new MediaPipeVisionEngine();
    
    // OpenCV (always available)
    this.openCVEngine = new OpenCVVisionEngine();
    
    // Facial Analysis Engines
    this.facialAnalysisEngine = authenticFacialAnalysis;
    this.expressionEngine = facialExpressionAnalysis;
    
    console.log('✅ Computer Vision Stack initialized');
  }
  
  private initializeAudioProcessing(): void {
    console.log('🎤 Initializing Audio Processing Stack...');
    
    // Voice Analysis (NLP.js, HuggingFace)
    this.voiceAnalysisEngine = freeVoiceAnalysis;
    
    // Speech Emotion Recognition
    this.speechEmotionEngine = speechEmotionRecognition;
    
    console.log('✅ Audio Processing Stack initialized');
  }
  
  /**
   * Main analysis method - coordinates all engines
   */
  public async analyzeSession(data: {
    videoFrames?: string[];
    audioData?: ArrayBuffer;
    transcript: string;
    duration: number;
    purpose: string;
  }): Promise<ComprehensiveAnalysisResult> {
    const startTime = Date.now();
    const enginesUsed: string[] = [];
    
    console.log('🔬 Starting comprehensive analysis...');
    
    try {
      // Parallel processing for all modalities
      const [
        bodyLanguageData,
        voiceData,
        contentData,
        emotionData
      ] = await Promise.all([
        this.analyzeBodyLanguage(data.videoFrames || [], enginesUsed),
        this.analyzeVoice(data.audioData, data.transcript, data.duration, enginesUsed),
        this.analyzeContent(data.transcript, data.purpose, enginesUsed),
        this.analyzeEmotions(data.videoFrames || [], data.transcript, enginesUsed)
      ]);
      
      // Combine all analysis results
      const result = this.combineAnalysisResults(
        bodyLanguageData,
        voiceData,
        contentData,
        emotionData,
        enginesUsed,
        startTime
      );
      
      // Update metrics
      this.updateProcessingMetrics(Date.now() - startTime, true);
      
      console.log('✅ Comprehensive analysis complete');
      return result;
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      this.updateProcessingMetrics(Date.now() - startTime, false);
      throw error;
    }
  }
  
  /**
   * Analyze body language using multiple CV engines
   */
  private async analyzeBodyLanguage(
    frames: string[], 
    enginesUsed: string[]
  ): Promise<any> {
    if (!frames || frames.length === 0) {
      return this.getDefaultBodyLanguageData();
    }
    
    const analyses = [];
    
    // Try Roboflow first (if available)
    if (this.roboflowEngine) {
      try {
        const roboflowAnalysis = await this.roboflowEngine.analyzeBodyLanguage(frames[0]);
        if (roboflowAnalysis) {
          analyses.push(roboflowAnalysis);
          enginesUsed.push('Roboflow');
        }
      } catch (error) {
        console.log('⚠️ Roboflow analysis failed, falling back');
      }
    }
    
    // Always use MediaPipe as backup/complement
    const mediaPipeAnalysis = await this.mediaPipeEngine.analyzeFrame(frames[0]);
    analyses.push(mediaPipeAnalysis);
    enginesUsed.push('MediaPipe');
    
    // OpenCV for gesture analysis
    const openCVAnalysis = await this.openCVEngine.analyzeBodyLanguage(frames[0]);
    analyses.push(openCVAnalysis);
    enginesUsed.push('OpenCV');
    
    // Facial analysis
    const facialMetrics = await this.facialAnalysisEngine.analyzeFacialExpressions(frames[0]);
    const expressions = await this.expressionEngine.analyzeEmotions(frames[0]);
    
    return this.mergeBodyLanguageAnalyses(analyses, facialMetrics, expressions);
  }
  
  /**
   * Analyze voice characteristics
   */
  private async analyzeVoice(
    audioData: ArrayBuffer | undefined,
    transcript: string,
    duration: number,
    enginesUsed: string[]
  ): Promise<any> {
    const voiceAnalysis = {
      tone: { pitch: 0, variability: 0, emotion: 'neutral', confidence: 0 },
      pace: { wordsPerMinute: 0, pauseAnalysis: { count: 0, averageDuration: 0, strategic: false } },
      clarity: { articulation: 0, volumeConsistency: 0, pronunciation: 0 },
      fillerWords: { count: 0, types: {}, perMinute: 0, locations: [] }
    };
    
    // Calculate basic metrics from transcript
    const words = transcript.split(' ').filter(w => w.length > 0);
    voiceAnalysis.pace.wordsPerMinute = duration > 0 ? Math.round((words.length / duration) * 60) : 0;
    
    // Filler word detection
    const fillerAnalysis = await advancedFillerDetectionEngine.detectFillers(transcript);
    voiceAnalysis.fillerWords = {
      count: fillerAnalysis.totalCount,
      types: fillerAnalysis.fillerCounts,
      perMinute: duration > 0 ? fillerAnalysis.totalCount / (duration / 60) : 0,
      locations: fillerAnalysis.locations
    };
    
    // Voice emotion analysis (if audio available)
    if (audioData) {
      try {
        const emotionAnalysis = await this.speechEmotionEngine.analyzeEmotions(audioData);
        if (emotionAnalysis) {
          voiceAnalysis.tone.emotion = emotionAnalysis.primary || emotionAnalysis.emotion || 'neutral';
          voiceAnalysis.tone.confidence = emotionAnalysis.confidence || 0;
          enginesUsed.push('SpeechEmotionRecognition');
        }
      } catch (error) {
        console.log('⚠️ Speech emotion analysis unavailable');
      }
    }
    
    // Free voice analysis from transcript
    const freeAnalysis = await this.voiceAnalysisEngine.analyzeVoiceEmotions(transcript);
    if (freeAnalysis) {
      voiceAnalysis.tone = { ...voiceAnalysis.tone, ...freeAnalysis };
      enginesUsed.push('FreeVoiceAnalysis');
    }
    
    return voiceAnalysis;
  }
  
  /**
   * Analyze content quality using NLP
   */
  private async analyzeContent(
    transcript: string,
    purpose: string,
    enginesUsed: string[]
  ): Promise<any> {
    // Use advanced content analysis via OpenAI/Anthropic
    const contentAnalysis = await processUltraAdvancedAnalysis({
      transcript,
      purpose,
      duration: 0,
      metrics: {}
    });
    
    enginesUsed.push('UltraAdvancedAI', 'OpenAI');
    
    return {
      structure: {
        score: contentAnalysis.contentQuality || 0,
        hasIntro: transcript.toLowerCase().includes('hello') || transcript.toLowerCase().includes('hi'),
        hasConclusion: transcript.toLowerCase().includes('thank') || transcript.toLowerCase().includes('conclusion'),
        logicalFlow: contentAnalysis.persuasivenessScore || 0
      },
      vocabulary: {
        diversity: this.calculateVocabularyDiversity(transcript),
        complexity: this.calculateComplexity(transcript),
        appropriateness: contentAnalysis.contentQuality || 0
      },
      persuasiveness: {
        score: contentAnalysis.persuasivenessScore || 0,
        techniques: contentAnalysis.enhancedInsights?.persuasionTechniques || [],
        callsToAction: this.countCallsToAction(transcript)
      },
      clarity: {
        score: contentAnalysis.clarityScore || 0,
        jargonUsage: this.detectJargon(transcript),
        sentenceComplexity: this.calculateSentenceComplexity(transcript)
      }
    };
  }
  
  /**
   * Analyze emotions across modalities
   */
  private async analyzeEmotions(
    frames: string[],
    transcript: string,
    enginesUsed: string[]
  ): Promise<any> {
    const emotions = {
      facial: {},
      voice: {},
      content: {}
    };
    
    // Facial emotions
    if (frames.length > 0) {
      const facialEmotions = await this.expressionEngine.analyzeFacialExpression(frames[0]);
      emotions.facial = facialEmotions;
    }
    
    // Content sentiment
    const sentiment = await this.voiceAnalysisEngine.analyzeVoice(transcript);
    emotions.content = sentiment;
    
    return emotions;
  }
  
  /**
   * Combine all analysis results into comprehensive output
   */
  private combineAnalysisResults(
    bodyLanguage: any,
    voice: any,
    content: any,
    emotions: any,
    enginesUsed: string[],
    startTime: number
  ): ComprehensiveAnalysisResult {
    // Calculate overall scores based on authentic data
    const overallConfidence = this.calculateOverallScore([
      bodyLanguage.posture?.score || 0,
      bodyLanguage.eyeContact?.percentage || 0,
      voice.clarity?.articulation || 0,
      content.clarity?.score || 0
    ]);
    
    const overallEngagement = this.calculateOverallScore([
      bodyLanguage.gestures?.engagement || 0,
      bodyLanguage.facialExpressions?.authenticity || 0,
      voice.tone?.variability || 0,
      content.persuasiveness?.score || 0
    ]);
    
    const overallAuthenticity = this.calculateOverallScore([
      bodyLanguage.facialExpressions?.authenticity || 0,
      emotions.facial?.authenticity || 0,
      voice.tone?.confidence || 0
    ]);
    
    // Identify strengths and improvements
    const strengths = this.identifyStrengths({
      bodyLanguage,
      voice,
      content,
      overallConfidence,
      overallEngagement
    });
    
    const improvements = this.identifyImprovements({
      bodyLanguage,
      voice,
      content,
      overallConfidence,
      overallEngagement
    });
    
    return {
      bodyLanguage,
      voice,
      content,
      overall: {
        confidenceScore: overallConfidence,
        engagementScore: overallEngagement,
        authenticityScore: overallAuthenticity,
        improvementAreas: improvements,
        strengths: strengths
      },
      metadata: {
        processingTime: Date.now() - startTime,
        enginesUsed: [...new Set(enginesUsed)],
        dataQuality: this.assessDataQuality(bodyLanguage, voice, content),
        timestamp: new Date()
      }
    };
  }
  
  // Helper methods
  private getDefaultBodyLanguageData(): any {
    return {
      posture: { score: 0, confidence: 0, details: 'No video data', rawData: null },
      gestures: { score: 0, openness: 0, engagement: 0, rawData: null },
      eyeContact: { percentage: 0, quality: 0, patterns: [], rawData: null },
      facialExpressions: {
        dominantEmotion: 'neutral',
        emotionScores: {},
        microExpressions: [],
        authenticity: 0,
        rawData: null
      }
    };
  }
  
  private mergeBodyLanguageAnalyses(analyses: any[], facialMetrics: any, expressions: any): any {
    // Merge multiple CV engine results, prioritizing non-zero values
    const merged = {
      posture: { score: 0, confidence: 0, details: '', rawData: {} },
      gestures: { score: 0, openness: 0, engagement: 0, rawData: {} },
      eyeContact: { percentage: 0, quality: 0, patterns: [], rawData: {} },
      facialExpressions: {
        dominantEmotion: 'neutral',
        emotionScores: {},
        microExpressions: [],
        authenticity: 0,
        rawData: {}
      }
    };
    
    // Aggregate scores from all engines
    for (const analysis of analyses) {
      if (analysis?.posture?.score > 0) {
        merged.posture.score = Math.max(merged.posture.score, analysis.posture.score);
      }
      if (analysis?.eyeContact?.score > 0) {
        merged.eyeContact.percentage = Math.max(merged.eyeContact.percentage, analysis.eyeContact.score);
      }
      if (analysis?.gestures?.openness > 0) {
        merged.gestures.openness = Math.max(merged.gestures.openness, analysis.gestures.openness);
      }
    }
    
    // Add facial analysis
    if (facialMetrics) {
      merged.facialExpressions = {
        ...merged.facialExpressions,
        ...facialMetrics
      };
    }
    
    if (expressions) {
      merged.facialExpressions.emotionScores = expressions.emotions || {};
      merged.facialExpressions.dominantEmotion = expressions.dominantEmotion || 'neutral';
    }
    
    return merged;
  }
  
  private calculateOverallScore(scores: number[]): number {
    const validScores = scores.filter(s => s > 0);
    if (validScores.length === 0) return 0;
    return Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
  }
  
  private calculateVocabularyDiversity(transcript: string): number {
    const words = transcript.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    return words.length > 0 ? Math.round((uniqueWords.size / words.length) * 100) : 0;
  }
  
  private calculateComplexity(transcript: string): number {
    const words = transcript.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    return Math.min(100, Math.round(avgWordLength * 10));
  }
  
  private countCallsToAction(transcript: string): number {
    const ctaPatterns = [
      /\b(please|kindly|i urge|i encourage|let's|join|sign up|register|buy|purchase|donate|support)\b/gi,
      /\b(act now|don't wait|limited time|today only|special offer)\b/gi
    ];
    
    let count = 0;
    for (const pattern of ctaPatterns) {
      const matches = transcript.match(pattern);
      if (matches) count += matches.length;
    }
    return count;
  }
  
  private detectJargon(transcript: string): number {
    // Simple jargon detection - can be enhanced with domain-specific dictionaries
    const jargonPatterns = /\b(synergy|paradigm|leverage|bandwidth|circle back|touch base|drill down|take offline)\b/gi;
    const matches = transcript.match(jargonPatterns);
    return matches ? matches.length : 0;
  }
  
  private calculateSentenceComplexity(transcript: string): number {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    const avgWordsPerSentence = sentences.reduce((sum, sentence) => {
      return sum + sentence.trim().split(/\s+/).length;
    }, 0) / sentences.length;
    
    // Simple complexity: < 10 words = simple, > 20 words = complex
    return Math.min(100, Math.round(avgWordsPerSentence * 5));
  }
  
  private identifyStrengths(data: any): string[] {
    const strengths = [];
    
    if (data.bodyLanguage?.eyeContact?.percentage > 60) {
      strengths.push('Strong eye contact');
    }
    if (data.voice?.pace?.wordsPerMinute >= 120 && data.voice?.pace?.wordsPerMinute <= 180) {
      strengths.push('Good speaking pace');
    }
    if (data.voice?.fillerWords?.perMinute < 2) {
      strengths.push('Minimal filler words');
    }
    if (data.content?.clarity?.score > 70) {
      strengths.push('Clear communication');
    }
    if (data.overallConfidence > 70) {
      strengths.push('Confident delivery');
    }
    
    return strengths;
  }
  
  private identifyImprovements(data: any): string[] {
    const improvements = [];
    
    if (data.bodyLanguage?.eyeContact?.percentage < 40) {
      improvements.push('Increase eye contact with camera');
    }
    if (data.voice?.pace?.wordsPerMinute < 100) {
      improvements.push('Speak with more energy and pace');
    }
    if (data.voice?.pace?.wordsPerMinute > 200) {
      improvements.push('Slow down speaking pace');
    }
    if (data.voice?.fillerWords?.perMinute > 5) {
      improvements.push('Reduce filler word usage');
    }
    if (data.content?.structure?.score < 50) {
      improvements.push('Improve speech structure');
    }
    
    return improvements;
  }
  
  private assessDataQuality(bodyLanguage: any, voice: any, content: any): number {
    let quality = 0;
    let factors = 0;
    
    // Check which data sources provided valid data
    if (bodyLanguage?.posture?.score > 0) { quality += 25; factors++; }
    if (bodyLanguage?.eyeContact?.percentage > 0) { quality += 25; factors++; }
    if (voice?.pace?.wordsPerMinute > 0) { quality += 25; factors++; }
    if (content?.structure?.score > 0) { quality += 25; factors++; }
    
    return factors > 0 ? Math.round(quality) : 0;
  }
  
  private updateProcessingMetrics(processingTime: number, success: boolean): void {
    this.processingMetrics.totalRequests++;
    if (success) {
      this.processingMetrics.successfulRequests++;
    }
    this.processingMetrics.lastProcessingTime = processingTime;
    
    // Update average response time
    const currentAvg = this.processingMetrics.averageResponseTime;
    const totalRequests = this.processingMetrics.totalRequests;
    this.processingMetrics.averageResponseTime = 
      Math.round((currentAvg * (totalRequests - 1) + processingTime) / totalRequests);
  }
  
  /**
   * Get processing metrics for monitoring
   */
  public getMetrics() {
    return {
      ...this.processingMetrics,
      successRate: this.processingMetrics.totalRequests > 0 
        ? Math.round((this.processingMetrics.successfulRequests / this.processingMetrics.totalRequests) * 100)
        : 0
    };
  }
}

// Export singleton instance
export const comprehensiveAI = new ComprehensiveAIIntegration();