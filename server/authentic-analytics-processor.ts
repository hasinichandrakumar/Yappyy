// Authentic Analytics Processor - Extracts real metrics from session data
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import real analysis libraries
const vader = require('vader-sentiment');
const textstat = require('textstat');
const syllable = require('syllable');

interface SessionData {
  transcript: string;
  duration: number;
  videoBlob?: string;
  audioData?: ArrayBuffer;
}

interface AuthenticMetrics {
  confidence: number;
  eyeContact: number;
  clarity: number;
  engagement: number;
  voiceConsistency: number;
  voiceQuality: number;
  contentQuality: number;
  deliveryPresence: number;
}

export class AuthenticAnalyticsProcessor {
  constructor() {
    console.log('🔬 Authentic Analytics Processor initialized');
  }

  async processSession(sessionData: SessionData): Promise<AuthenticMetrics> {
    const { transcript, duration } = sessionData;
    
    if (!transcript || transcript.trim().length === 0) {
      return this.getEmptyMetrics();
    }

    try {
      // Voice Quality Analysis from transcript patterns
      const voiceQuality = this.analyzeVoiceFromTranscript(transcript);
      
      // Content Quality Analysis using real NLP
      const contentQuality = await this.analyzeContentQuality(transcript);
      
      // Speech Pattern Analysis
      const speechPatterns = this.analyzeSpeechPatterns(transcript, duration);
      
      // Confidence Analysis from linguistic markers
      const confidence = this.analyzeConfidenceMarkers(transcript);
      
      // Engagement Analysis from content structure
      const engagement = this.analyzeEngagementLevel(transcript);
      
      // Clarity Analysis from readability metrics
      const clarity = this.analyzeClarity(transcript);
      
      // Voice Consistency from speech flow
      const voiceConsistency = this.analyzeVoiceConsistency(transcript, duration);
      
      // Eye Contact estimation from speech flow (pauses/hesitations)
      const eyeContact = this.estimateEyeContactFromSpeech(transcript);
      
      // Delivery & Presence from overall patterns
      const deliveryPresence = this.analyzeDeliveryPresence(transcript, duration);

      return {
        confidence: Math.round(confidence),
        eyeContact: Math.round(eyeContact),
        clarity: Math.round(clarity),
        engagement: Math.round(engagement),
        voiceConsistency: Math.round(voiceConsistency),
        voiceQuality: Math.round(voiceQuality),
        contentQuality: Math.round(contentQuality),
        deliveryPresence: Math.round(deliveryPresence)
      };

    } catch (error) {
      console.error('❌ Authentic analytics processing error:', error);
      return this.getEmptyMetrics();
    }
  }

  private analyzeVoiceFromTranscript(transcript: string): number {
    // Analyze voice quality indicators from transcript
    const words = transcript.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    if (totalWords === 0) return 0;
    
    // Count filler words (negative indicators)
    const fillerWords = ['um', 'uh', 'like', 'so', 'you know', 'basically', 'actually'].reduce((count, filler) => {
      return count + (transcript.toLowerCase().split(filler).length - 1);
    }, 0);
    
    // Count positive indicators
    const strongWords = words.filter(word => 
      ['definitely', 'clearly', 'specifically', 'exactly', 'precisely'].includes(word)
    ).length;
    
    // Calculate voice quality score
    const fillerRatio = fillerWords / totalWords;
    const strongWordRatio = strongWords / totalWords;
    
    const baseScore = Math.max(0, 100 - (fillerRatio * 200));
    const bonusScore = strongWordRatio * 50;
    
    return Math.min(100, baseScore + bonusScore);
  }

  private async analyzeContentQuality(transcript: string): Promise<number> {
    if (!transcript || transcript.trim().length === 0) return 0;
    
    try {
      // Use VADER sentiment analysis for emotional content
      const sentimentResult = vader.SentimentIntensityAnalyzer.polarity_scores(transcript);
      const sentimentScore = (sentimentResult.compound + 1) * 50; // Convert -1,1 to 0,100
      
      // Use TextStat for readability
      const readabilityScore = textstat.fleschReadingEase(transcript);
      const normalizedReadability = Math.max(0, Math.min(100, readabilityScore));
      
      // Analyze content structure
      const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const averageSentenceLength = transcript.split(/\s+/).length / Math.max(sentences.length, 1);
      
      // Optimal sentence length score (15-20 words is ideal)
      const sentenceLengthScore = averageSentenceLength >= 15 && averageSentenceLength <= 20 ? 100 :
                                 averageSentenceLength >= 10 && averageSentenceLength <= 25 ? 80 :
                                 averageSentenceLength >= 5 && averageSentenceLength <= 30 ? 60 : 40;
      
      // Combined content quality score
      return Math.round((sentimentScore * 0.4 + normalizedReadability * 0.4 + sentenceLengthScore * 0.2));
      
    } catch (error) {
      console.log('Content analysis fallback to basic metrics');
      return this.basicContentAnalysis(transcript);
    }
  }

  private basicContentAnalysis(transcript: string): number {
    const words = transcript.split(/\s+/).filter(w => w.length > 0);
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (words.length === 0) return 0;
    
    // Basic quality indicators
    const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const sentenceVariety = sentences.length > 1 ? 
      Math.abs(sentences[0].length - sentences[sentences.length - 1].length) > 10 ? 20 : 10 : 0;
    
    const wordLengthScore = averageWordLength >= 4 && averageWordLength <= 6 ? 80 : 60;
    
    return Math.min(100, wordLengthScore + sentenceVariety);
  }

  private analyzeSpeechPatterns(transcript: string, duration: number): any {
    const words = transcript.split(/\s+/).filter(w => w.length > 0);
    const wordsPerMinute = duration > 0 ? (words.length / duration) * 60 : 0;
    
    return {
      wpm: Math.round(wordsPerMinute),
      optimalPace: wordsPerMinute >= 140 && wordsPerMinute <= 180 ? 100 : 
                   wordsPerMinute >= 120 && wordsPerMinute <= 200 ? 80 : 60
    };
  }

  private analyzeConfidenceMarkers(transcript: string): number {
    const confidenceWords = [
      'confident', 'sure', 'certain', 'definitely', 'absolutely', 'clearly',
      'obviously', 'undoubtedly', 'precisely', 'exactly', 'specifically'
    ];
    
    const uncertaintyWords = [
      'maybe', 'perhaps', 'possibly', 'might', 'could', 'sort of',
      'kind of', 'i think', 'i guess', 'probably', 'hopefully'
    ];
    
    const words = transcript.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    if (totalWords === 0) return 0;
    
    const confidenceCount = confidenceWords.reduce((count, word) => 
      count + words.filter(w => w.includes(word)).length, 0);
    
    const uncertaintyCount = uncertaintyWords.reduce((count, word) => 
      count + words.filter(w => w.includes(word)).length, 0);
    
    const confidenceRatio = confidenceCount / totalWords;
    const uncertaintyRatio = uncertaintyCount / totalWords;
    
    const baseScore = 70; // Neutral confidence
    const confidenceBonus = confidenceRatio * 200;
    const uncertaintyPenalty = uncertaintyRatio * 150;
    
    return Math.max(0, Math.min(100, baseScore + confidenceBonus - uncertaintyPenalty));
  }

  private analyzeEngagementLevel(transcript: string): number {
    const engagementWords = [
      'you', 'your', 'we', 'us', 'together', 'imagine', 'think about',
      'consider', 'what if', 'how', 'why', 'when', 'where', 'question'
    ];
    
    const words = transcript.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    if (totalWords === 0) return 0;
    
    const engagementCount = engagementWords.reduce((count, word) => 
      count + words.filter(w => w.includes(word)).length, 0);
    
    const questionMarks = (transcript.match(/\?/g) || []).length;
    const exclamationMarks = (transcript.match(/!/g) || []).length;
    
    const engagementRatio = engagementCount / totalWords;
    const punctuationEngagement = (questionMarks + exclamationMarks) / Math.max(1, transcript.split(/[.!?]/).length);
    
    const baseScore = engagementRatio * 300;
    const punctuationBonus = punctuationEngagement * 100;
    
    return Math.min(100, baseScore + punctuationBonus);
  }

  private analyzeClarity(transcript: string): number {
    if (!transcript || transcript.trim().length === 0) return 0;
    
    try {
      // Use syllable counting for pronunciation complexity
      const syllableCount = syllable(transcript);
      const wordCount = transcript.split(/\s+/).length;
      
      if (wordCount === 0) return 0;
      
      const averageSyllablesPerWord = syllableCount / wordCount;
      
      // Optimal syllables per word is 1.5-2.0 for clarity
      const clarityScore = averageSyllablesPerWord >= 1.5 && averageSyllablesPerWord <= 2.0 ? 100 :
                          averageSyllablesPerWord >= 1.2 && averageSyllablesPerWord <= 2.5 ? 80 :
                          averageSyllablesPerWord >= 1.0 && averageSyllablesPerWord <= 3.0 ? 60 : 40;
      
      return clarityScore;
      
    } catch (error) {
      // Fallback to basic word length analysis
      const words = transcript.split(/\s+/);
      const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / Math.max(words.length, 1);
      
      return averageWordLength >= 4 && averageWordLength <= 6 ? 80 : 60;
    }
  }

  private analyzeVoiceConsistency(transcript: string, duration: number): number {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2) return 70; // Default for short content
    
    // Analyze sentence length consistency
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower deviation = higher consistency
    const consistencyScore = Math.max(0, 100 - (standardDeviation * 5));
    
    return Math.min(100, consistencyScore);
  }

  private estimateEyeContactFromSpeech(transcript: string): number {
    // Estimate eye contact from speech fluency indicators
    const fillerWords = ['um', 'uh', 'er', 'ah'].reduce((count, filler) => {
      return count + (transcript.toLowerCase().split(filler).length - 1);
    }, 0);
    
    const totalWords = transcript.split(/\s+/).length;
    
    if (totalWords === 0) return 0;
    
    const fluencyRatio = 1 - (fillerWords / totalWords);
    
    // More fluent speech often correlates with better eye contact
    return Math.min(100, Math.max(0, fluencyRatio * 120));
  }

  private analyzeDeliveryPresence(transcript: string, duration: number): number {
    const words = transcript.split(/\s+/).filter(w => w.length > 0);
    const wordsPerMinute = duration > 0 ? (words.length / duration) * 60 : 0;
    
    // Strong delivery indicators
    const strongDeliveryWords = [
      'important', 'crucial', 'essential', 'significant', 'key', 'vital',
      'remember', 'focus', 'attention', 'listen', 'understand'
    ];
    
    const strongWordCount = strongDeliveryWords.reduce((count, word) => 
      count + (transcript.toLowerCase().split(word).length - 1), 0);
    
    const totalWords = words.length;
    
    if (totalWords === 0) return 0;
    
    const strongWordRatio = strongWordCount / totalWords;
    const paceScore = wordsPerMinute >= 140 && wordsPerMinute <= 180 ? 100 : 
                     wordsPerMinute >= 120 && wordsPerMinute <= 200 ? 80 : 60;
    
    const presenceScore = (strongWordRatio * 200) + (paceScore * 0.5);
    
    return Math.min(100, presenceScore);
  }

  private getEmptyMetrics(): AuthenticMetrics {
    return {
      confidence: 0,
      eyeContact: 0,
      clarity: 0,
      engagement: 0,
      voiceConsistency: 0,
      voiceQuality: 0,
      contentQuality: 0,
      deliveryPresence: 0
    };
  }
}