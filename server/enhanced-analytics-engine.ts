// Enhanced Analytics using popular NPM packages for authentic analysis
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import analytics libraries with proper CommonJS handling
const vader = require('vader-sentiment');
const textstat = require('textstat');
const syllable = require('syllable');
const fleschKincaid = require('flesch-kincaid');

interface AdvancedAnalytics {
  content: {
    readabilityScore: number;
    fleschKincaidLevel: number;
    sentimentScore: number;
    sentimentLabel: string;
    complexityScore: number;
    syllableCount: number;
    wordComplexity: number;
    averageSentenceLength: number;
    lexicalDiversity: number;
    formalityScore: number;
  };
  performance: {
    processingTime: number;
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
  };
}

export class EnhancedAnalyticsEngine {
  constructor() {
    console.log('🔬 Enhanced Analytics Engine initialized with authentic analysis');
  }

  async analyzeContent(text: string): Promise<AdvancedAnalytics> {
    const startTime = performance.now();
    
    if (!text || text.trim().length === 0) {
      return this.getEmptyAnalytics();
    }

    try {
      // Basic text metrics
      const wordCount = this.countWords(text);
      const sentenceCount = this.countSentences(text);
      const characterCount = text.length;
      const syllableCount = syllable(text);

      // Sentiment analysis using VADER
      const sentimentAnalysis = vader ? vader.SentimentIntensityAnalyzer.polarity_scores(text) : { compound: 0 };
      const sentimentScore = sentimentAnalysis.compound; // Range: -1 to 1
      const sentimentLabel = this.getSentimentLabel(sentimentScore);

      // Readability analysis  
      const fleschReadingEase = textstat ? textstat.fleschReadingEase(text) : 50;
      const fleschKincaidGrade = fleschKincaid ? fleschKincaid(text) : 8;
      
      // Advanced metrics
      const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
      const lexicalDiversity = this.calculateLexicalDiversity(text);
      const wordComplexity = syllableCount / Math.max(wordCount, 1);
      const complexityScore = this.calculateComplexityScore(text);
      const formalityScore = this.calculateFormalityScore(text);

      const processingTime = performance.now() - startTime;

      return {
        content: {
          readabilityScore: Math.round(fleschReadingEase),
          fleschKincaidLevel: Math.round(fleschKincaidGrade * 10) / 10,
          sentimentScore: Math.round(sentimentScore * 100) / 100,
          sentimentLabel,
          complexityScore: Math.round(complexityScore),
          syllableCount,
          wordComplexity: Math.round(wordComplexity * 100) / 100,
          averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
          lexicalDiversity: Math.round(lexicalDiversity * 100) / 100,
          formalityScore: Math.round(formalityScore)
        },
        performance: {
          processingTime: Math.round(processingTime * 100) / 100,
          wordCount,
          characterCount,
          sentenceCount
        }
      };

    } catch (error) {
      console.error('❌ Analytics processing error:', error);
      return this.getEmptyAnalytics();
    }
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private countSentences(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length;
  }

  private getSentimentLabel(score: number): string {
    if (score >= 0.05) return 'Positive';
    if (score <= -0.05) return 'Negative';
    return 'Neutral';
  }

  private calculateLexicalDiversity(text: string): number {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const uniqueWords = new Set(words);
    return words.length > 0 ? uniqueWords.size / words.length : 0;
  }

  private calculateComplexityScore(text: string): number {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const complexWords = words.filter(word => word.length > 6);
    const complexityRatio = words.length > 0 ? complexWords.length / words.length : 0;
    return Math.min(100, complexityRatio * 200); // Scale to 0-100
  }

  private calculateFormalityScore(text: string): number {
    const formalIndicators = [
      /\b(therefore|furthermore|consequently|nevertheless|moreover)\b/gi,
      /\b(analysis|investigation|examination|evaluation)\b/gi,
      /\b(significant|substantial|considerable|comprehensive)\b/gi
    ];
    
    const informalIndicators = [
      /\b(like|really|pretty|super|totally|awesome)\b/gi,
      /\b(gonna|wanna|gotta|yeah|ok|okay)\b/gi,
      /[!]{2,}|[?]{2,}/g
    ];

    let formalCount = 0;
    let informalCount = 0;

    formalIndicators.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) formalCount += matches.length;
    });

    informalIndicators.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) informalCount += matches.length;
    });

    const totalWords = this.countWords(text);
    if (totalWords === 0) return 50;

    const formalRatio = formalCount / totalWords;
    const informalRatio = informalCount / totalWords;
    
    // Base formality of 50, adjust based on indicators
    return Math.max(0, Math.min(100, 50 + (formalRatio * 100) - (informalRatio * 50)));
  }

  private getEmptyAnalytics(): AdvancedAnalytics {
    return {
      content: {
        readabilityScore: 0,
        fleschKincaidLevel: 0,
        sentimentScore: 0,
        sentimentLabel: 'Neutral',
        complexityScore: 0,
        syllableCount: 0,
        wordComplexity: 0,
        averageSentenceLength: 0,
        lexicalDiversity: 0,
        formalityScore: 50
      },
      performance: {
        processingTime: 0,
        wordCount: 0,
        characterCount: 0,
        sentenceCount: 0
      }
    };
  }
}

export const enhancedAnalytics = new EnhancedAnalyticsEngine();