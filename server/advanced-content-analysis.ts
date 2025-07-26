/**
 * Advanced Content Analysis Engine
 * 
 * Provides comprehensive content quality assessment including:
 * - Persuasiveness scoring
 * - Clarity and readability analysis  
 * - Content structure evaluation
 * - Linguistic sophistication metrics
 * - Professional communication assessment
 */

// Using dynamic imports to handle module compatibility
let nlp: any;
let natural: any;
let Sentiment: any;
let franc: any;

async function initializeModules() {
  if (!nlp) {
    try {
      nlp = (await import('compromise')).default;
      natural = await import('natural');
      const SentimentModule = await import('sentiment');
      Sentiment = SentimentModule.default;
      const francModule = await import('franc');
      franc = francModule.franc;
    } catch (error) {
      console.error('Failed to initialize NLP modules:', error);
      throw error;
    }
  }
}

interface ContentAnalysisResult {
  overall: {
    score: number;
    grade: 'poor' | 'fair' | 'good' | 'excellent';
    confidence: number;
  };
  persuasiveness: {
    score: number;
    techniques: string[];
    rhetoricalDevices: string[];
    credibilityScore: number;
    emotionalAppeal: number;
    logicalStructure: number;
  };
  clarity: {
    score: number;
    readabilityGrade: number;
    fleschScore: number;
    ariScore: number;
    averageWordsPerSentence: number;
    complexWordRatio: number;
  };
  structure: {
    score: number;
    sentenceVariety: number;
    paragraphCoherence: number;
    logicalFlow: number;
    transitionQuality: number;
  };
  professionalism: {
    score: number;
    formalityLevel: number;
    technicalAccuracy: number;
    vocabularyLevel: number;
    grammarScore: number;
  };
  engagement: {
    score: number;
    attentionHooks: string[];
    storytellingElements: number;
    interactiveLanguage: number;
    urgencyLevel: number;
  };
  lexicalAnalysis: {
    uniqueWords: number;
    totalWords: number;
    lexicalDiversity: number;
    vocabularyRichness: number;
    wordComplexity: number;
  };
  sentimentProfile: {
    overall: number;
    confidence: number;
    positive: number;
    negative: number;
    neutral: number;
    emotions: {
      joy: number;
      anger: number;
      fear: number;
      sadness: number;
      surprise: number;
      trust: number;
    };
  };
  language: {
    detectedLanguage: string;
    confidence: number;
    multilingualElements: string[];
  };
}

export class AdvancedContentAnalyzer {
  private persuasiveTechniques = [
    'social proof', 'authority', 'scarcity', 'reciprocity', 'commitment',
    'urgency', 'credibility', 'emotional appeal', 'logical reasoning',
    'storytelling', 'statistics', 'testimonials', 'comparisons'
  ];

  private rhetoricalDevices = [
    'metaphor', 'simile', 'repetition', 'alliteration', 'rhetorical question',
    'parallel structure', 'contrast', 'emphasis', 'call to action'
  ];

  private transitionWords = [
    'however', 'therefore', 'furthermore', 'moreover', 'nevertheless',
    'consequently', 'meanwhile', 'specifically', 'particularly', 'finally'
  ];

  private attentionHooks = [
    'question', 'statistic', 'quote', 'story', 'provocative statement',
    'analogy', 'contradiction', 'preview', 'mystery', 'problem statement'
  ];

  /**
   * Comprehensive content analysis
   */
  public async analyzeContent(text: string): Promise<ContentAnalysisResult> {
    await initializeModules();
    if (!text || text.trim().length === 0) {
      return this.getEmptyAnalysis();
    }

    const doc = nlp(text);
    const sentences = doc.sentences().out('array');
    const words = doc.terms().out('array');
    const sentimentAnalyzer = new Sentiment();
    const sentimentResult = sentimentAnalyzer.analyze(text);
    const detectedLanguage = franc(text);

    // Core analysis components
    const persuasivenessAnalysis = this.analyzePersuasiveness(text, doc);
    const clarityAnalysis = this.analyzeClarityAndReadability(text, sentences, words);
    const structureAnalysis = this.analyzeStructure(text, doc, sentences);
    const professionalismAnalysis = this.analyzeProfessionalism(text, doc);
    const engagementAnalysis = this.analyzeEngagement(text, doc);
    const lexicalAnalysis = this.analyzeLexicalFeatures(text, doc, words);
    const sentimentProfile = this.createSentimentProfile(sentimentResult, text);
    const languageAnalysis = this.analyzeLanguage(detectedLanguage, text);

    // Calculate overall score
    const overallScore = this.calculateOverallScore(
      persuasivenessAnalysis.score,
      clarityAnalysis.score,
      structureAnalysis.score,
      professionalismAnalysis.score,
      engagementAnalysis.score
    );

    return {
      overall: {
        score: Math.round(overallScore),
        grade: this.getGrade(overallScore),
        confidence: Math.min(95, 60 + Math.floor(text.length / 50))
      },
      persuasiveness: persuasivenessAnalysis,
      clarity: clarityAnalysis,
      structure: structureAnalysis,
      professionalism: professionalismAnalysis,
      engagement: engagementAnalysis,
      lexicalAnalysis: lexicalAnalysis,
      sentimentProfile: sentimentProfile,
      language: languageAnalysis
    };
  }

  /**
   * Analyze persuasiveness using rhetorical techniques
   */
  private analyzePersuasiveness(text: string, doc: any): any {
    const lowerText = text.toLowerCase();
    const sentences = doc.sentences().out('array');
    
    // Detect persuasive techniques
    const detectedTechniques: string[] = [];
    const detectedRhetorical: string[] = [];

    // Social proof indicators
    if (lowerText.includes('many people') || lowerText.includes('everyone') || 
        lowerText.includes('most') || lowerText.includes('proven')) {
      detectedTechniques.push('social proof');
    }

    // Authority indicators
    if (lowerText.includes('expert') || lowerText.includes('research') || 
        lowerText.includes('study') || lowerText.includes('according to')) {
      detectedTechniques.push('authority');
    }

    // Urgency indicators
    if (lowerText.includes('now') || lowerText.includes('immediate') || 
        lowerText.includes('quickly') || lowerText.includes('urgent')) {
      detectedTechniques.push('urgency');
    }

    // Scarcity indicators
    if (lowerText.includes('limited') || lowerText.includes('exclusive') || 
        lowerText.includes('rare') || lowerText.includes('only')) {
      detectedTechniques.push('scarcity');
    }

    // Rhetorical devices
    const questionCount = (text.match(/\?/g) || []).length;
    if (questionCount > 0) {
      detectedRhetorical.push('rhetorical question');
    }

    // Repetition detection
    const wordCounts = new Map<string, number>();
    doc.terms().forEach((term: any) => {
      const word = term.text().toLowerCase();
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
    
    const repeatedWords = Array.from(wordCounts.entries())
      .filter(([word, count]) => count >= 3 && word.length > 4);
    
    if (repeatedWords.length > 0) {
      detectedRhetorical.push('repetition');
    }

    // Calculate scores
    const credibilityScore = this.calculateCredibilityScore(text, detectedTechniques);
    const emotionalAppeal = this.calculateEmotionalAppeal(text);
    const logicalStructure = this.calculateLogicalStructure(sentences);

    const persuasivenessScore = Math.round(
      (credibilityScore * 0.4) + 
      (emotionalAppeal * 0.3) + 
      (logicalStructure * 0.3)
    );

    return {
      score: persuasivenessScore,
      techniques: detectedTechniques,
      rhetoricalDevices: detectedRhetorical,
      credibilityScore: Math.round(credibilityScore),
      emotionalAppeal: Math.round(emotionalAppeal),
      logicalStructure: Math.round(logicalStructure)
    };
  }

  /**
   * Analyze clarity and readability
   */
  private analyzeClarityAndReadability(text: string, sentences: string[], words: string[]): any {
    const totalWords = words.length;
    const totalSentences = sentences.length;
    const totalSyllables = this.countSyllables(text);

    // Flesch Reading Ease Score
    const fleschScore = totalSentences > 0 && totalWords > 0 ? 
      206.835 - (1.015 * (totalWords / totalSentences)) - (84.6 * (totalSyllables / totalWords)) : 0;

    // Automated Readability Index
    const characters = text.replace(/\s/g, '').length;
    const ariScore = totalSentences > 0 && totalWords > 0 ?
      4.71 * (characters / totalWords) + 0.5 * (totalWords / totalSentences) - 21.43 : 0;

    // Complex words (3+ syllables)
    const complexWords = words.filter(word => this.countWordSyllables(word) >= 3).length;
    const complexWordRatio = totalWords > 0 ? (complexWords / totalWords) * 100 : 0;

    // Average words per sentence
    const averageWordsPerSentence = totalSentences > 0 ? totalWords / totalSentences : 0;

    // Overall clarity score (0-100)
    const clarityScore = Math.max(0, Math.min(100, 
      (fleschScore + (100 - ariScore) + (100 - complexWordRatio * 2)) / 3
    ));

    return {
      score: Math.round(clarityScore),
      readabilityGrade: this.fleschToGrade(fleschScore),
      fleschScore: Math.round(fleschScore),
      ariScore: Math.round(ariScore),
      averageWordsPerSentence: Math.round(averageWordsPerSentence * 10) / 10,
      complexWordRatio: Math.round(complexWordRatio * 10) / 10
    };
  }

  /**
   * Analyze content structure
   */
  private analyzeStructure(text: string, doc: any, sentences: string[]): any {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Sentence variety (length variance)
    const sentenceLengths = sentences.map(s => s.split(' ').length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length || 0;
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length || 0;
    const sentenceVariety = Math.min(100, variance * 2);

    // Transition quality
    const transitionCount = this.transitionWords.reduce((count, word) => 
      count + (text.toLowerCase().split(word).length - 1), 0);
    const transitionQuality = Math.min(100, (transitionCount / sentences.length) * 200);

    // Paragraph coherence
    const paragraphCoherence = paragraphs.length > 1 ? 
      Math.min(100, (paragraphs.length * 20) + (transitionCount * 10)) : 50;

    // Logical flow (based on connectors and structure)
    const logicalFlow = this.calculateLogicalFlow(text, sentences);

    const structureScore = Math.round(
      (sentenceVariety * 0.25) + 
      (paragraphCoherence * 0.25) + 
      (logicalFlow * 0.25) + 
      (transitionQuality * 0.25)
    );

    return {
      score: structureScore,
      sentenceVariety: Math.round(sentenceVariety),
      paragraphCoherence: Math.round(paragraphCoherence),
      logicalFlow: Math.round(logicalFlow),
      transitionQuality: Math.round(transitionQuality)
    };
  }

  /**
   * Analyze professionalism
   */
  private analyzeProfessionalism(text: string, doc: any): any {
    const words = doc.terms().out('array');
    const totalWords = words.length;

    // Formality level (based on word choice and structure)
    const formalWords = ['therefore', 'furthermore', 'consequently', 'however', 'nevertheless'];
    const formalCount = formalWords.reduce((count, word) => 
      count + (text.toLowerCase().split(word).length - 1), 0);
    const formalityLevel = Math.min(100, (formalCount / totalWords) * 500);

    // Technical accuracy (proper grammar patterns)
    const technicalAccuracy = this.assessTechnicalAccuracy(text, doc);

    // Vocabulary level (word sophistication)
    const vocabularyLevel = this.assessVocabularyLevel(words);

    // Grammar score (basic assessment)
    const grammarScore = this.assessGrammar(text, doc);

    const professionalismScore = Math.round(
      (formalityLevel * 0.25) + 
      (technicalAccuracy * 0.25) + 
      (vocabularyLevel * 0.25) + 
      (grammarScore * 0.25)
    );

    return {
      score: professionalismScore,
      formalityLevel: Math.round(formalityLevel),
      technicalAccuracy: Math.round(technicalAccuracy),
      vocabularyLevel: Math.round(vocabularyLevel),
      grammarScore: Math.round(grammarScore)
    };
  }

  /**
   * Analyze engagement factors
   */
  private analyzeEngagement(text: string, doc: any): any {
    const lowerText = text.toLowerCase();
    
    // Detect attention hooks
    const detectedHooks: string[] = [];
    
    // Question hooks
    if (text.includes('?')) {
      detectedHooks.push('question');
    }
    
    // Statistic hooks
    if (/\d+%|\d+\.\d+%|\d+ percent/g.test(text)) {
      detectedHooks.push('statistic');
    }
    
    // Story indicators
    if (lowerText.includes('imagine') || lowerText.includes('story') || 
        lowerText.includes('once') || lowerText.includes('example')) {
      detectedHooks.push('story');
    }

    // Storytelling elements
    const storytellingWords = ['imagine', 'picture', 'story', 'example', 'experience', 'journey'];
    const storytellingCount = storytellingWords.reduce((count, word) => 
      count + (lowerText.split(word).length - 1), 0);
    const storytellingElements = Math.min(100, storytellingCount * 20);

    // Interactive language
    const interactiveWords = ['you', 'your', 'we', 'us', 'together', 'let\'s'];
    const interactiveCount = interactiveWords.reduce((count, word) => 
      count + (lowerText.split(word).length - 1), 0);
    const interactiveLanguage = Math.min(100, (interactiveCount / doc.terms().length) * 200);

    // Urgency level
    const urgencyWords = ['now', 'today', 'immediately', 'urgent', 'quickly', 'fast'];
    const urgencyCount = urgencyWords.reduce((count, word) => 
      count + (lowerText.split(word).length - 1), 0);
    const urgencyLevel = Math.min(100, urgencyCount * 25);

    const engagementScore = Math.round(
      (detectedHooks.length * 20) + 
      (storytellingElements * 0.25) + 
      (interactiveLanguage * 0.35) + 
      (urgencyLevel * 0.2)
    );

    return {
      score: Math.min(100, engagementScore),
      attentionHooks: detectedHooks,
      storytellingElements: Math.round(storytellingElements),
      interactiveLanguage: Math.round(interactiveLanguage),
      urgencyLevel: Math.round(urgencyLevel)
    };
  }

  /**
   * Analyze lexical features
   */
  private analyzeLexicalFeatures(text: string, doc: any, words: string[]): any {
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const totalWords = words.length;
    
    const lexicalDiversity = totalWords > 0 ? (uniqueWords / totalWords) * 100 : 0;
    
    // Vocabulary richness (sophisticated words)
    const sophisticatedWords = words.filter(word => 
      word.length > 6 && this.countWordSyllables(word) >= 3).length;
    const vocabularyRichness = totalWords > 0 ? (sophisticatedWords / totalWords) * 100 : 0;

    // Word complexity average
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / totalWords || 0;
    const wordComplexity = Math.min(100, avgWordLength * 15);

    return {
      uniqueWords,
      totalWords,
      lexicalDiversity: Math.round(lexicalDiversity * 10) / 10,
      vocabularyRichness: Math.round(vocabularyRichness * 10) / 10,
      wordComplexity: Math.round(wordComplexity)
    };
  }

  /**
   * Create comprehensive sentiment profile
   */
  private createSentimentProfile(sentimentResult: any, text: string): any {
    const normalizedScore = Math.max(-100, Math.min(100, sentimentResult.score * 10));
    
    // Calculate emotion scores based on text content
    const emotions = this.calculateEmotionScores(text);
    
    // Determine positive, negative, neutral percentages
    const total = Math.abs(sentimentResult.score) + 5; // Base neutral
    const positive = sentimentResult.score > 0 ? (sentimentResult.score / total) * 100 : 0;
    const negative = sentimentResult.score < 0 ? (Math.abs(sentimentResult.score) / total) * 100 : 0;
    const neutral = 100 - positive - negative;

    return {
      overall: Math.round(normalizedScore),
      confidence: Math.min(95, 60 + Math.abs(sentimentResult.score) * 5),
      positive: Math.round(positive),
      negative: Math.round(negative),
      neutral: Math.round(neutral),
      emotions
    };
  }

  /**
   * Analyze language characteristics
   */
  private analyzeLanguage(detectedLanguage: string, text: string): any {
    const languageMap: { [key: string]: string } = {
      'eng': 'English',
      'spa': 'Spanish',
      'fra': 'French',
      'deu': 'German',
      'ita': 'Italian',
      'por': 'Portuguese',
      'rus': 'Russian',
      'jpn': 'Japanese',
      'kor': 'Korean',
      'ara': 'Arabic',
      'cmn': 'Chinese (Mandarin)',
      'hin': 'Hindi'
    };

    const language = languageMap[detectedLanguage] || 'Unknown';
    const confidence = detectedLanguage !== 'und' ? 85 : 20;

    // Detect multilingual elements (very basic)
    const multilingualElements: string[] = [];
    if (text.includes('español') || text.includes('français')) {
      multilingualElements.push('multilingual references');
    }

    return {
      detectedLanguage: language,
      confidence,
      multilingualElements
    };
  }

  // Helper methods
  private countSyllables(text: string): number {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    return words.reduce((total, word) => total + this.countWordSyllables(word), 0);
  }

  private countWordSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = word.match(/[aeiouy]+/g) || [];
    let syllables = vowels.length;
    
    if (word.endsWith('e')) syllables--;
    if (syllables === 0) syllables = 1;
    
    return syllables;
  }

  private fleschToGrade(score: number): number {
    if (score >= 90) return 5;
    if (score >= 80) return 6;
    if (score >= 70) return 7;
    if (score >= 60) return 8;
    if (score >= 50) return 9;
    if (score >= 30) return 10;
    return 12;
  }

  private calculateCredibilityScore(text: string, techniques: string[]): number {
    const credibilityWords = ['research', 'study', 'proven', 'evidence', 'data', 'expert', 'authority'];
    const lowerText = text.toLowerCase();
    
    const credibilityCount = credibilityWords.reduce((count, word) => 
      count + (lowerText.split(word).length - 1), 0);
    
    return Math.min(100, (credibilityCount * 15) + (techniques.length * 10) + 30);
  }

  private calculateEmotionalAppeal(text: string): number {
    const emotionalWords = ['amazing', 'incredible', 'fantastic', 'wonderful', 'exciting', 'powerful', 'revolutionary'];
    const lowerText = text.toLowerCase();
    
    const emotionalCount = emotionalWords.reduce((count, word) => 
      count + (lowerText.split(word).length - 1), 0);
    
    return Math.min(100, (emotionalCount * 20) + 40);
  }

  private calculateLogicalStructure(sentences: string[]): number {
    if (sentences.length === 0) return 0;
    
    // Check for logical connectors
    const logicalWords = ['because', 'therefore', 'however', 'consequently', 'furthermore'];
    const logicalCount = sentences.reduce((count, sentence) => {
      const lowerSentence = sentence.toLowerCase();
      return count + logicalWords.filter(word => lowerSentence.includes(word)).length;
    }, 0);
    
    return Math.min(100, (logicalCount / sentences.length) * 200 + 30);
  }

  private calculateLogicalFlow(text: string, sentences: string[]): number {
    if (sentences.length === 0) return 0;
    
    const flowIndicators = ['first', 'second', 'finally', 'next', 'then', 'also', 'additionally'];
    const lowerText = text.toLowerCase();
    
    const flowCount = flowIndicators.reduce((count, indicator) => 
      count + (lowerText.split(indicator).length - 1), 0);
    
    return Math.min(100, (flowCount / sentences.length) * 150 + 25);
  }

  private assessTechnicalAccuracy(text: string, doc: any): number {
    // Basic assessment - in a real implementation, this would be more sophisticated
    const properNouns = doc.match('#ProperNoun').length;
    const totalWords = doc.terms().length;
    
    // Simple heuristic: proper capitalization, punctuation, etc.
    const capitalizedSentences = (text.match(/[.!?]\s*[A-Z]/g) || []).length;
    const totalSentences = (text.match(/[.!?]/g) || []).length;
    
    const capitalizationScore = totalSentences > 0 ? (capitalizedSentences / totalSentences) * 100 : 50;
    const properNounScore = totalWords > 0 ? Math.min(100, (properNouns / totalWords) * 200) : 50;
    
    return Math.round((capitalizationScore + properNounScore) / 2);
  }

  private assessVocabularyLevel(words: string[]): number {
    if (words.length === 0) return 0;
    
    const advancedWords = words.filter(word => 
      word.length > 7 && this.countWordSyllables(word) >= 3).length;
    
    return Math.min(100, (advancedWords / words.length) * 300);
  }

  private assessGrammar(text: string, doc: any): number {
    // Basic grammar assessment
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const verbs = doc.verbs().length;
    const totalWords = doc.terms().length;
    
    // Heuristic: sentences should have verbs
    const verbRatio = totalWords > 0 ? verbs / totalWords : 0;
    const grammarScore = Math.min(100, (verbRatio * 200) + 50);
    
    return Math.round(grammarScore);
  }

  private calculateEmotionScores(text: string): any {
    const lowerText = text.toLowerCase();
    
    // Simple emotion word detection
    const emotionWords = {
      joy: ['happy', 'excited', 'amazing', 'wonderful', 'great', 'fantastic'],
      anger: ['angry', 'frustrated', 'annoyed', 'furious', 'outraged'],
      fear: ['afraid', 'scared', 'worried', 'nervous', 'anxious'],
      sadness: ['sad', 'disappointed', 'depressed', 'unhappy', 'tragic'],
      surprise: ['surprised', 'amazed', 'shocked', 'unexpected', 'sudden'],
      trust: ['trust', 'reliable', 'confident', 'certain', 'secure']
    };

    const scores: any = {};
    
    Object.entries(emotionWords).forEach(([emotion, words]) => {
      const count = words.reduce((total, word) => 
        total + (lowerText.split(word).length - 1), 0);
      scores[emotion] = Math.min(100, count * 25);
    });

    return scores;
  }

  private calculateOverallScore(...scores: number[]): number {
    const validScores = scores.filter(score => !isNaN(score) && score >= 0);
    return validScores.length > 0 ? 
      validScores.reduce((sum, score) => sum + score, 0) / validScores.length : 0;
  }

  private getGrade(score: number): 'poor' | 'fair' | 'good' | 'excellent' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'fair';
    return 'poor';
  }

  private getEmptyAnalysis(): ContentAnalysisResult {
    return {
      overall: { score: 0, grade: 'poor', confidence: 0 },
      persuasiveness: { score: 0, techniques: [], rhetoricalDevices: [], credibilityScore: 0, emotionalAppeal: 0, logicalStructure: 0 },
      clarity: { score: 0, readabilityGrade: 0, fleschScore: 0, ariScore: 0, averageWordsPerSentence: 0, complexWordRatio: 0 },
      structure: { score: 0, sentenceVariety: 0, paragraphCoherence: 0, logicalFlow: 0, transitionQuality: 0 },
      professionalism: { score: 0, formalityLevel: 0, technicalAccuracy: 0, vocabularyLevel: 0, grammarScore: 0 },
      engagement: { score: 0, attentionHooks: [], storytellingElements: 0, interactiveLanguage: 0, urgencyLevel: 0 },
      lexicalAnalysis: { uniqueWords: 0, totalWords: 0, lexicalDiversity: 0, vocabularyRichness: 0, wordComplexity: 0 },
      sentimentProfile: { overall: 0, confidence: 0, positive: 0, negative: 0, neutral: 0, emotions: { joy: 0, anger: 0, fear: 0, sadness: 0, surprise: 0, trust: 0 } },
      language: { detectedLanguage: 'Unknown', confidence: 0, multilingualElements: [] }
    };
  }
}

export const advancedContentAnalyzer = new AdvancedContentAnalyzer();