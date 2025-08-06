// Content Analysis API - Advanced AI-Powered Speech Content Analysis
import { Express } from 'express';

export async function createContentAnalysisEndpoint(app: Express) {
  app.post("/api/analyze-content", async (req, res) => {
    try {
      const { transcript, purpose, sessionData } = req.body;

      if (!transcript || !purpose) {
        return res.status(400).json({ 
          error: "Transcript and purpose are required" 
        });
      }

      console.log(`🧠 Analyzing content for purpose: ${purpose}`);

      // Perform comprehensive content analysis
      const analysis = await performContentAnalysis(transcript, purpose, sessionData);

      res.json(analysis);
    } catch (error: any) {
      console.error('❌ Content analysis failed:', error);
      res.status(500).json({ 
        error: "Content analysis failed", 
        message: error.message 
      });
    }
  });
}

async function performContentAnalysis(transcript: string, purpose: string, sessionData?: any) {
  const words = transcript.split(/\s+/).filter(word => word.length > 0);
  const sentences = transcript.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^\w]/g, '')));
  
  // Calculate basic metrics
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const vocabularyDiversity = wordCount > 0 ? (uniqueWords.size / wordCount) * 100 : 0;

  // Analyze purpose alignment
  const purposeKeywords = getPurposeKeywords(purpose);
  const purposeAlignment = calculatePurposeAlignment(transcript, purposeKeywords);

  // Analyze content structure
  const contentStructure = analyzeContentStructure(transcript, sentences);

  // Analyze vocabulary
  const vocabularyAnalysis = analyzeVocabulary(words, purpose);

  // Analyze rhetorical devices
  const rhetoricalDevices = analyzeRhetoricalDevices(transcript);

  // Analyze audience engagement
  const audienceEngagement = analyzeAudienceEngagement(transcript, purpose, vocabularyAnalysis);

  // Generate recommendations
  const recommendations = generateRecommendations(transcript, purpose, contentStructure, vocabularyAnalysis);

  // Generate vocabulary suggestions
  const vocabularySuggestions = generateVocabularySuggestions(purpose, words);

  return {
    purposeAlignment,
    contentStructure,
    vocabularyAnalysis,
    rhetoricalDevices,
    audienceEngagement,
    recommendations,
    vocabularySuggestions,
    keyMetrics: {
      wordCount,
      sentenceCount,
      averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
      uniqueWords: uniqueWords.size,
      vocabularyDiversity: Math.round(vocabularyDiversity)
    }
  };
}

function getPurposeKeywords(purpose: string): string[] {
  const purposeMap: { [key: string]: string[] } = {
    'business': ['strategy', 'growth', 'revenue', 'market', 'customer', 'product', 'service', 'team', 'leadership', 'profit', 'investment', 'scalability'],
    'sales': ['customer', 'benefit', 'value', 'solution', 'problem', 'need', 'offer', 'deal', 'close', 'pitch', 'conversion', 'prospect', 'qualification'],
    'presentation': ['inform', 'educate', 'explain', 'demonstrate', 'show', 'present', 'share', 'discuss', 'overview', 'summary', 'highlight'],
    'persuasion': ['convince', 'persuade', 'influence', 'change', 'believe', 'agree', 'support', 'action', 'compelling', 'evidence', 'argument'],
    'storytelling': ['story', 'narrative', 'experience', 'journey', 'character', 'plot', 'emotion', 'connection', 'personal', 'authentic', 'relatable'],
    'training': ['learn', 'teach', 'skill', 'knowledge', 'practice', 'improve', 'develop', 'master', 'technique', 'method', 'approach'],
    'motivation': ['inspire', 'motivate', 'encourage', 'energize', 'passion', 'drive', 'success', 'achievement', 'potential', 'transformation', 'breakthrough'],
    'technical': ['technical', 'system', 'process', 'implementation', 'architecture', 'framework', 'methodology', 'specification', 'configuration'],
    'academic': ['research', 'study', 'analysis', 'findings', 'methodology', 'conclusion', 'hypothesis', 'evidence', 'theory', 'data'],
    'creative': ['creative', 'innovative', 'unique', 'original', 'artistic', 'expressive', 'imaginative', 'visionary', 'breakthrough', 'revolutionary']
  };

  const lowerPurpose = purpose.toLowerCase();
  for (const [key, keywords] of Object.entries(purposeMap)) {
    if (lowerPurpose.includes(key)) {
      return keywords;
    }
  }
  return ['effective', 'clear', 'engaging', 'professional', 'compelling', 'impactful'];
}

function calculatePurposeAlignment(transcript: string, keywords: string[]): number {
  const lowerTranscript = transcript.toLowerCase();
  let matches = 0;
  let totalOccurrences = 0;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const occurrences = (transcript.match(regex) || []).length;
    if (occurrences > 0) {
      matches++;
      totalOccurrences += occurrences;
    }
  });

  // Score based on both keyword presence and frequency
  const presenceScore = (matches / keywords.length) * 60;
  const frequencyScore = Math.min(40, (totalOccurrences / keywords.length) * 10);
  
  return Math.min(100, Math.max(0, Math.round(presenceScore + frequencyScore)));
}

function analyzeContentStructure(transcript: string, sentences: string[]): any {
  const totalSentences = sentences.length;
  if (totalSentences === 0) {
    return {
      introduction: 0,
      body: 0,
      conclusion: 0,
      overall: 0
    };
  }

  // Simple structure analysis based on sentence distribution
  const introSentences = Math.max(1, Math.floor(totalSentences * 0.15));
  const conclusionSentences = Math.max(1, Math.floor(totalSentences * 0.15));
  const bodySentences = totalSentences - introSentences - conclusionSentences;

  // Check for structural indicators
  const hasIntroduction = sentences[0]?.length > 20 || 
    /^(hello|hi|good|welcome|today|i'm|my name)/i.test(sentences[0] || '');
  
  const hasConclusion = sentences[sentences.length - 1]?.length > 15 ||
    /(thank you|in conclusion|to summarize|finally|in summary)/i.test(sentences[sentences.length - 1] || '');

  return {
    introduction: hasIntroduction ? 85 : 60,
    body: Math.min(100, Math.max(0, (bodySentences / Math.max(1, Math.floor(totalSentences * 0.7))) * 100)),
    conclusion: hasConclusion ? 85 : 60,
    overall: Math.min(100, Math.max(0, ((introSentences + bodySentences + conclusionSentences) / totalSentences) * 100))
  };
}

function analyzeVocabulary(words: string[], purpose: string): any {
  const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^\w]/g, '')));
  
  // Calculate complexity based on word length and uniqueness
  const longWords = words.filter(word => word.length > 8);
  const complexity = Math.min(100, Math.max(0, 
    ((uniqueWords.size / words.length) * 60) + ((longWords.length / words.length) * 40)
  ));

  // Calculate variety
  const variety = Math.min(100, Math.max(0, (uniqueWords.size / words.length) * 150));
  
  // Count technical/sophisticated words
  const sophisticatedWords = words.filter(word => 
    word.length > 8 || 
    /[A-Z]/.test(word) || 
    ['therefore', 'however', 'furthermore', 'consequently', 'nevertheless', 'moreover', 'additionally'].includes(word.toLowerCase())
  );
  const technicalTerms = Math.min(100, Math.max(0, (sophisticatedWords.length / words.length) * 100));

  // Calculate appropriateness based on purpose
  const purposeKeywords = getPurposeKeywords(purpose);
  const purposeWordMatches = words.filter(word => 
    purposeKeywords.some(keyword => word.toLowerCase().includes(keyword))
  );
  const appropriateness = Math.min(100, Math.max(0, (purposeWordMatches.length / words.length) * 200));

  return {
    complexity: Math.round(complexity),
    appropriateness: Math.round(appropriateness),
    variety: Math.round(variety),
    technicalTerms: Math.round(technicalTerms)
  };
}

function analyzeRhetoricalDevices(transcript: string): any {
  const devices = {
    metaphors: (transcript.match(/like|as|similar to|reminds me of/gi) || []).length,
    questions: (transcript.match(/\?/g) || []).length,
    repetition: countRepetition(transcript),
    alliteration: countAlliteration(transcript),
    statistics: (transcript.match(/\d+%|\d+ percent|\d+ out of \d+/gi) || []).length
  };

  const totalDevices = Object.values(devices).reduce((sum, count) => sum + count, 0);
  const effectiveness = Math.min(100, Math.max(0, totalDevices * 10));

  return {
    count: totalDevices,
    effectiveness,
    types: Object.entries(devices)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${type}: ${count}`)
  };
}

function countRepetition(transcript: string): number {
  const words = transcript.toLowerCase().split(/\s+/);
  const wordCount: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (word.length > 3) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  return Object.values(wordCount).filter(count => count > 2).length;
}

function countAlliteration(transcript: string): number {
  const sentences = transcript.split(/[.!?]+/);
  let alliterationCount = 0;

  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/).filter(word => word.length > 2);
    for (let i = 0; i < words.length - 2; i++) {
      const first = words[i].toLowerCase()[0];
      const second = words[i + 1].toLowerCase()[0];
      const third = words[i + 2].toLowerCase()[0];
      
      if (first === second && second === third && first.match(/[a-z]/)) {
        alliterationCount++;
      }
    }
  });

  return alliterationCount;
}

function analyzeAudienceEngagement(transcript: string, purpose: string, vocabularyAnalysis: any): any {
  // Calculate clarity based on sentence structure and vocabulary
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
  const clarity = Math.max(0, Math.min(100, 100 - (avgSentenceLength - 15) * 2));

  // Calculate relevance based on purpose alignment
  const purposeKeywords = getPurposeKeywords(purpose);
  const relevance = calculatePurposeAlignment(transcript, purposeKeywords);

  // Calculate impact based on multiple factors
  const impact = Math.min(100, Math.max(0, 
    (clarity * 0.3) + (relevance * 0.4) + (vocabularyAnalysis.appropriateness * 0.3)
  ));

  return {
    clarity: Math.round(clarity),
    relevance: Math.round(relevance),
    impact: Math.round(impact)
  };
}

function generateRecommendations(transcript: string, purpose: string, structure: any, vocabulary: any): any {
  const recommendations = {
    structure: [] as string[],
    vocabulary: [] as string[],
    delivery: [] as string[],
    content: [] as string[]
  };

  // Structure recommendations
  if (structure.introduction < 70) {
    recommendations.structure.push("Strengthen your introduction with a clear hook and purpose statement");
    recommendations.structure.push("Start with an engaging opening that captures attention");
  }
  if (structure.body < 70) {
    recommendations.structure.push("Expand the main content with more detailed points and examples");
    recommendations.structure.push("Add supporting evidence and specific details");
  }
  if (structure.conclusion < 70) {
    recommendations.structure.push("Add a stronger conclusion that summarizes key points and calls to action");
    recommendations.structure.push("End with a memorable closing statement");
  }

  // Vocabulary recommendations
  if (vocabulary.complexity < 50) {
    recommendations.vocabulary.push("Consider using more sophisticated vocabulary to enhance credibility");
    recommendations.vocabulary.push("Incorporate industry-specific terminology");
  }
  if (vocabulary.variety < 60) {
    recommendations.vocabulary.push("Increase vocabulary variety to maintain audience engagement");
    recommendations.vocabulary.push("Avoid repetitive word choices");
  }
  if (vocabulary.technicalTerms < 30) {
    recommendations.vocabulary.push("Incorporate industry-specific terminology for professional impact");
    recommendations.vocabulary.push("Use technical terms appropriately for your audience");
  }
  if (vocabulary.appropriateness < 60) {
    recommendations.vocabulary.push("Align vocabulary more closely with your presentation purpose");
    recommendations.vocabulary.push("Use purpose-specific keywords and phrases");
  }

  // Content recommendations based on purpose
  if (purpose.toLowerCase().includes('business')) {
    recommendations.content.push("Include specific metrics and data points to support your business case");
    recommendations.content.push("Address potential objections and provide solutions");
    recommendations.content.push("Focus on ROI and business value");
  }
  if (purpose.toLowerCase().includes('sales')) {
    recommendations.content.push("Emphasize customer benefits and value proposition");
    recommendations.content.push("Include clear call-to-action statements");
    recommendations.content.push("Address customer pain points and solutions");
  }
  if (purpose.toLowerCase().includes('presentation')) {
    recommendations.content.push("Add visual cues and transition phrases for better flow");
    recommendations.content.push("Include examples and anecdotes to illustrate key points");
    recommendations.content.push("Structure information in digestible chunks");
  }
  if (purpose.toLowerCase().includes('persuasion')) {
    recommendations.content.push("Include compelling evidence and logical arguments");
    recommendations.content.push("Address counterarguments and provide rebuttals");
    recommendations.content.push("Use emotional appeals and storytelling elements");
  }

  // Delivery recommendations
  recommendations.delivery.push("Practice pacing and pauses for emphasis");
  recommendations.delivery.push("Use vocal variety to maintain engagement");
  recommendations.delivery.push("Incorporate gestures and body language");
  recommendations.delivery.push("Maintain eye contact with your audience");

  return recommendations;
}

function generateVocabularySuggestions(purpose: string, words: string[]): any {
  const suggestions = {
    advanced: [] as string[],
    alternatives: [] as string[],
    industrySpecific: [] as string[]
  };

  // Generate suggestions based on purpose
  if (purpose.toLowerCase().includes('business')) {
    suggestions.advanced.push('strategic', 'optimization', 'leverage', 'synergy', 'paradigm', 'scalable', 'sustainable');
    suggestions.industrySpecific.push('ROI', 'KPI', 'stakeholder', 'scalability', 'disruption', 'innovation', 'transformation');
    suggestions.alternatives.push('good → exceptional', 'important → crucial', 'big → substantial', 'help → facilitate');
  }
  if (purpose.toLowerCase().includes('sales')) {
    suggestions.advanced.push('compelling', 'transformative', 'innovative', 'premium', 'exclusive', 'revolutionary');
    suggestions.industrySpecific.push('conversion', 'pipeline', 'prospect', 'qualification', 'closing', 'deal', 'opportunity');
    suggestions.alternatives.push('good → outstanding', 'help → enable', 'show → demonstrate', 'tell → explain');
  }
  if (purpose.toLowerCase().includes('presentation')) {
    suggestions.advanced.push('comprehensive', 'systematic', 'methodical', 'analytical', 'strategic', 'thorough');
    suggestions.alternatives.push('excellent → outstanding', 'good → exceptional', 'important → crucial', 'show → illustrate');
  }
  if (purpose.toLowerCase().includes('persuasion')) {
    suggestions.advanced.push('compelling', 'convincing', 'persuasive', 'influential', 'powerful', 'impactful');
    suggestions.alternatives.push('good → compelling', 'important → critical', 'help → enable', 'show → prove');
  }
  if (purpose.toLowerCase().includes('storytelling')) {
    suggestions.advanced.push('captivating', 'engaging', 'immersive', 'authentic', 'relatable', 'memorable');
    suggestions.alternatives.push('good → remarkable', 'story → narrative', 'tell → share', 'show → reveal');
  }

  return suggestions;
}