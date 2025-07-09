// Content Analysis Engine - AI-Powered Speech Analysis Based on Purpose
export interface ContentAnalysisResult {
  overallScore: number;
  structureScore: number;
  persuasivenessScore: number;
  coherenceScore: number;
  audienceAlignmentScore: number;
  purposeAlignment: number;
  keyInsights: string[];
  improvementAreas: string[];
  strengths: string[];
  specificFeedback: SpecificFeedback[];
  recommendations: string[];
  
  // Detailed analysis
  structure: {
    clarity: number;
    organization: number;
    flow: number;
  };
  persuasiveness: {
    impact: number;
    conviction: number;
    callToAction: number;
  };
  coherence: {
    consistency: number;
    logicalFlow: number;
    topicRelevance: number;
  };
  audienceAlignment: {
    appropriateness: number;
    engagement: number;
    relatability: number;
  };
  
  // Metadata
  wordCount?: number;
  sentenceCount?: number;
  avgWordsPerSentence?: number;
  analysisTimestamp?: string;
  feedback?: string[];
  improvements?: string[];
}

export interface SpecificFeedback {
  category: 'structure' | 'persuasiveness' | 'coherence' | 'audience' | 'purpose';
  severity: 'excellent' | 'good' | 'warning' | 'critical';
  feedback: string;
  suggestion: string;
  confidence: number;
}

export interface SpeechPurpose {
  type: 'presentation' | 'pitch' | 'educational' | 'persuasive' | 'informational' | 'motivational' | 'debate' | 'interview' | 'meeting' | 'custom';
  description: string;
  audience: string;
  objectives: string[];
  keyElements: string[];
}

export class ContentAnalysisEngine {
  private purposeTemplates: Map<string, SpeechPurpose> = new Map();
  private analysisHistory: ContentAnalysisResult[] = [];

  constructor() {
    this.initializePurposeTemplates();
  }

  private initializePurposeTemplates(): void {
    // Business Presentation
    this.purposeTemplates.set('presentation', {
      type: 'presentation',
      description: 'Professional business presentation with clear structure and data insights',
      audience: 'Colleagues, clients, or stakeholders',
      objectives: ['Inform', 'Persuade', 'Engage'],
      keyElements: ['Clear structure', 'Data-driven insights', 'Call to action', 'Professional tone']
    });

    // Sales Pitch
    this.purposeTemplates.set('pitch', {
      type: 'pitch',
      description: 'Compelling sales or investment pitch focused on value creation',
      audience: 'Potential clients or investors',
      objectives: ['Persuade', 'Generate interest', 'Close deals'],
      keyElements: ['Problem-solution fit', 'Value proposition', 'Compelling narrative', 'Strong close']
    });

    // Educational Content
    this.purposeTemplates.set('educational', {
      type: 'educational',
      description: 'Teaching or training session with clear learning objectives',
      audience: 'Students or trainees',
      objectives: ['Educate', 'Explain concepts', 'Facilitate learning'],
      keyElements: ['Clear explanations', 'Examples', 'Logical progression', 'Engagement techniques']
    });

    // Persuasive Speech
    this.purposeTemplates.set('persuasive', {
      type: 'persuasive',
      description: 'Persuasive speech designed to change minds and inspire action',
      audience: 'General audience or specific group',
      objectives: ['Change minds', 'Inspire action', 'Build consensus'],
      keyElements: ['Strong arguments', 'Emotional appeal', 'Evidence', 'Compelling conclusion']
    });

    // Motivational Speech
    this.purposeTemplates.set('motivational', {
      type: 'motivational',
      description: 'Inspirational speech to energize and motivate audience',
      audience: 'Team members or general audience',
      objectives: ['Inspire', 'Motivate', 'Energize'],
      keyElements: ['Emotional connection', 'Personal stories', 'Positive messaging', 'Action-oriented']
    });

    // General/Informational
    this.purposeTemplates.set('informational', {
      type: 'informational',
      description: 'Informational speech to share knowledge and insights',
      audience: 'General audience',
      objectives: ['Inform', 'Share knowledge', 'Explain concepts'],
      keyElements: ['Clear information', 'Logical structure', 'Relevant examples', 'Accessible language']
    });
  }

  async analyzeContent(transcript: string, purpose: SpeechPurpose, sessionDuration: number): Promise<ContentAnalysisResult> {
    console.log('🔍 Content Analysis Engine - Starting comprehensive analysis:', { 
      transcriptLength: transcript.length, 
      purpose: purpose.type,
      duration: sessionDuration
    });

    if (!transcript || transcript.trim().length < 10) {
      return this.getDefaultAnalysis();
    }

    try {
      // Basic metrics calculation
      const words = transcript.split(/\s+/).filter(w => w.length > 0);
      const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const wordCount = words.length;
      const sentenceCount = sentences.length;
      const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

      // Perform comprehensive analysis
      const structureAnalysis = this.analyzeStructure(transcript, purpose);
      const persuasivenessAnalysis = this.analyzePersuasiveness(transcript, purpose);
      const coherenceAnalysis = this.analyzeCoherence(transcript);
      const audienceAlignmentAnalysis = this.analyzeAudienceAlignment(transcript, purpose);
      const purposeAlignmentAnalysis = this.analyzePurposeAlignment(transcript, purpose);

      // Calculate weighted overall score
      const overallScore = Math.round(
        (structureAnalysis.score * 0.25 + 
         persuasivenessAnalysis.score * 0.25 + 
         coherenceAnalysis.score * 0.25 + 
         audienceAlignmentAnalysis.score * 0.15 + 
         purposeAlignmentAnalysis * 0.1)
      );

      // Generate insights and feedback
      const keyInsights = this.generateKeyInsights(transcript, purpose, overallScore);
      const improvementAreas = this.identifyImprovementAreas([]);
      const strengths = this.identifyStrengths(structureAnalysis, persuasivenessAnalysis, coherenceAnalysis);
      const recommendations = this.generateRecommendations([], purpose);
      const specificFeedback = this.generateSpecificFeedback(
        structureAnalysis, persuasivenessAnalysis, coherenceAnalysis, audienceAlignmentAnalysis
      );

      const result: ContentAnalysisResult = {
        overallScore,
        structureScore: structureAnalysis.score,
        persuasivenessScore: persuasivenessAnalysis.score,
        coherenceScore: coherenceAnalysis.score,
        audienceAlignmentScore: audienceAlignmentAnalysis.score,
        purposeAlignment: purposeAlignmentAnalysis,
        
        structure: {
          clarity: structureAnalysis.clarity,
          organization: structureAnalysis.organization,
          flow: structureAnalysis.flow
        },
        persuasiveness: {
          impact: persuasivenessAnalysis.impact,
          conviction: persuasivenessAnalysis.conviction,
          callToAction: persuasivenessAnalysis.callToAction
        },
        coherence: {
          consistency: coherenceAnalysis.consistency,
          logicalFlow: coherenceAnalysis.logicalFlow,
          topicRelevance: coherenceAnalysis.topicRelevance
        },
        audienceAlignment: {
          appropriateness: audienceAlignmentAnalysis.appropriateness,
          engagement: audienceAlignmentAnalysis.engagement,
          relatability: audienceAlignmentAnalysis.relatability
        },
        
        keyInsights,
        improvementAreas,
        strengths,
        recommendations,
        specificFeedback,
        
        // Metadata
        wordCount,
        sentenceCount,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        analysisTimestamp: new Date().toISOString(),
        
        // Quick feedback arrays
        feedback: this.generateQuickFeedback(overallScore, structureAnalysis, persuasivenessAnalysis),
        improvements: this.generateQuickImprovements(structureAnalysis, persuasivenessAnalysis, coherenceAnalysis)
      };

      console.log('✅ Content analysis completed:', result);
      this.analysisHistory.push(result);
      return result;

    } catch (error) {
      console.error('Content analysis error:', error);
      return this.getDefaultAnalysis();
    }
  }

  private analyzeStructure(transcript: string, purpose: SpeechPurpose): any {
    const words = transcript.split(/\s+/).filter(w => w.length > 0);
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let score = 60; // Base score
    let clarity = 65;
    let organization = 60;
    let flow = 70;

    // Length appropriateness
    if (words.length > 50) score += 10;
    if (words.length > 100) score += 5;
    if (words.length > 200) clarity += 10;

    // Sentence structure quality
    const avgWordsPerSentence = words.length / sentences.length;
    if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 20) {
      score += 10;
      clarity += 15;
    }

    // Structural indicators
    const structureWords = ['first', 'second', 'third', 'finally', 'conclusion', 'therefore', 'however', 'moreover', 'furthermore', 'additionally'];
    const structureCount = structureWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    
    const structureBonus = Math.min(20, structureCount * 4);
    score += structureBonus;
    organization += structureBonus;

    // Opening and closing
    const hasOpening = transcript.toLowerCase().includes('today') || 
                      transcript.toLowerCase().includes('welcome') ||
                      transcript.toLowerCase().includes('hello');
    const hasClosing = transcript.toLowerCase().includes('thank') ||
                      transcript.toLowerCase().includes('conclusion') ||
                      transcript.toLowerCase().includes('summary');
    
    if (hasOpening) {
      score += 8;
      organization += 10;
    }
    if (hasClosing) {
      score += 12;
      organization += 15;
    }

    // Purpose-specific adjustments
    switch (purpose.type) {
      case 'presentation':
        if (transcript.toLowerCase().includes('agenda')) score += 10;
        if (transcript.toLowerCase().includes('overview')) organization += 10;
        break;
      case 'pitch':
        if (transcript.toLowerCase().includes('problem') || transcript.toLowerCase().includes('solution')) {
          score += 15;
          clarity += 10;
        }
        break;
      case 'educational':
        if (transcript.toLowerCase().includes('example') || transcript.toLowerCase().includes('for instance')) {
          clarity += 15;
          flow += 10;
        }
        break;
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      clarity: Math.min(100, Math.max(0, clarity)),
      organization: Math.min(100, Math.max(0, organization)),
      flow: Math.min(100, Math.max(0, flow))
    };
  }

  private analyzePersuasiveness(transcript: string, purpose: SpeechPurpose): any {
    let score = 55;
    let impact = 60;
    let conviction = 65;
    let callToAction = 50;

    // Power words and phrases
    const powerWords = ['important', 'crucial', 'essential', 'significant', 'proven', 'guaranteed', 'effective', 'successful', 'opportunity', 'results'];
    const powerWordCount = powerWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    
    const powerBonus = Math.min(20, powerWordCount * 3);
    score += powerBonus;
    impact += powerBonus;

    // Emotional language
    const emotionalWords = ['excited', 'passionate', 'confident', 'believe', 'trust', 'amazing', 'incredible', 'outstanding'];
    const emotionalCount = emotionalWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    
    conviction += Math.min(20, emotionalCount * 4);

    // Action words
    const actionWords = ['act', 'start', 'begin', 'join', 'commit', 'decide', 'choose', 'take action'];
    const actionCount = actionWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    
    callToAction += Math.min(30, actionCount * 6);

    // Questions for engagement
    const questionCount = (transcript.match(/\?/g) || []).length;
    if (questionCount > 0) {
      score += Math.min(15, questionCount * 5);
      impact += Math.min(20, questionCount * 7);
    }

    // Purpose-specific adjustments
    if (purpose.type === 'persuasive' || purpose.type === 'pitch') {
      score += 10;
      if (transcript.toLowerCase().includes('because') || transcript.toLowerCase().includes('reason')) {
        conviction += 15;
      }
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      impact: Math.min(100, Math.max(0, impact)),
      conviction: Math.min(100, Math.max(0, conviction)),
      callToAction: Math.min(100, Math.max(0, callToAction))
    };
  }

  private analyzeCoherence(transcript: string): any {
    let score = 65;
    let consistency = 70;
    let logicalFlow = 65;
    let topicRelevance = 75;

    const words = transcript.split(/\s+/).filter(w => w.length > 0);
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Transition words
    const transitions = ['however', 'therefore', 'furthermore', 'moreover', 'consequently', 'meanwhile', 'thus', 'hence'];
    const transitionCount = transitions.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    
    const transitionBonus = Math.min(20, transitionCount * 5);
    score += transitionBonus;
    logicalFlow += transitionBonus;

    // Repetition analysis (consistency)
    const wordFrequency = new Map<string, number>();
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        wordFrequency.set(cleanWord, (wordFrequency.get(cleanWord) || 0) + 1);
      }
    });

    const keyThemes = Array.from(wordFrequency.entries())
      .filter(([word, count]) => count > 1)
      .length;
    
    if (keyThemes > 0) {
      consistency += Math.min(20, keyThemes * 3);
    }

    // Sentence length variation (good for flow)
    if (sentences.length > 2) {
      const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
      const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
      const variation = this.calculateVariation(sentenceLengths);
      
      if (variation > 0.2 && variation < 0.8) {
        logicalFlow += 15;
      }
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      consistency: Math.min(100, Math.max(0, consistency)),
      logicalFlow: Math.min(100, Math.max(0, logicalFlow)),
      topicRelevance: Math.min(100, Math.max(0, topicRelevance))
    };
  }

  private analyzeAudienceAlignment(transcript: string, purpose: SpeechPurpose): any {
    let score = 60;
    let appropriateness = 65;
    let engagement = 55;
    let relatability = 60;

    // Audience-focused language
    const audienceWords = ['you', 'your', 'we', 'us', 'our', 'together'];
    const audienceCount = audienceWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    
    engagement += Math.min(25, audienceCount * 2);

    // Professional vs casual tone based on purpose
    const professionalWords = ['professional', 'business', 'industry', 'strategy', 'analysis'];
    const casualWords = ['guys', 'awesome', 'cool', 'great', 'amazing'];
    
    const professionalCount = professionalWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    const casualCount = casualWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;

    // Adjust based on purpose
    if (['presentation', 'pitch', 'educational'].includes(purpose.type)) {
      appropriateness += Math.min(20, professionalCount * 5);
      if (casualCount > professionalCount) appropriateness -= 10;
    } else if (['motivational', 'persuasive'].includes(purpose.type)) {
      relatability += Math.min(20, casualCount * 4);
    }

    // Inclusive language
    const inclusiveWords = ['everyone', 'all', 'together', 'community', 'team'];
    const inclusiveCount = inclusiveWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;
    
    relatability += Math.min(15, inclusiveCount * 5);

    score = Math.round((appropriateness + engagement + relatability) / 3);

    return {
      score: Math.min(100, Math.max(0, score)),
      appropriateness: Math.min(100, Math.max(0, appropriateness)),
      engagement: Math.min(100, Math.max(0, engagement)),
      relatability: Math.min(100, Math.max(0, relatability))
    };
  }

  private analyzePurposeAlignment(transcript: string, purpose: SpeechPurpose): number {
    let score = 60;

    // Check for purpose-specific elements
    purpose.keyElements.forEach(element => {
      const keywords = this.getKeywordsForElement(element);
      const hasElement = keywords.some(keyword => 
        transcript.toLowerCase().includes(keyword.toLowerCase())
      );
      if (hasElement) score += 10;
    });

    // Check for purpose-specific objectives
    purpose.objectives.forEach(objective => {
      const keywords = this.getKeywordsForObjective(objective);
      const hasObjective = keywords.some(keyword => 
        transcript.toLowerCase().includes(keyword.toLowerCase())
      );
      if (hasObjective) score += 8;
    });

    return Math.min(100, Math.max(0, score));
  }

  private getKeywordsForElement(element: string): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'Clear structure': ['first', 'second', 'next', 'finally', 'conclusion'],
      'Data-driven insights': ['data', 'statistics', 'research', 'study', 'evidence'],
      'Call to action': ['action', 'act', 'start', 'begin', 'commit', 'decide'],
      'Professional tone': ['professional', 'business', 'industry', 'strategic'],
      'Problem-solution fit': ['problem', 'solution', 'solve', 'address', 'challenge'],
      'Value proposition': ['value', 'benefit', 'advantage', 'worth', 'return'],
      'Clear explanations': ['explain', 'because', 'reason', 'example', 'means'],
      'Examples': ['example', 'instance', 'case', 'illustration'],
      'Strong arguments': ['evidence', 'proof', 'research', 'fact', 'study'],
      'Emotional appeal': ['feel', 'emotion', 'heart', 'passion', 'care'],
      'Personal stories': ['story', 'experience', 'personal', 'happened', 'when'],
      'Positive messaging': ['positive', 'optimistic', 'hope', 'future', 'success']
    };
    
    return keywordMap[element] || [];
  }

  private getKeywordsForObjective(objective: string): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'Inform': ['information', 'facts', 'data', 'knowledge', 'learn'],
      'Persuade': ['convince', 'believe', 'trust', 'should', 'must'],
      'Engage': ['you', 'your', 'question', 'think', 'imagine'],
      'Educate': ['teach', 'learn', 'understand', 'explain', 'knowledge'],
      'Inspire': ['inspire', 'motivate', 'dream', 'possible', 'achieve'],
      'Motivate': ['motivate', 'energy', 'action', 'drive', 'passion']
    };
    
    return keywordMap[objective] || [];
  }

  private generateKeyInsights(transcript: string, purpose: SpeechPurpose, overallScore: number): string[] {
    const insights: string[] = [];
    const wordCount = transcript.split(/\s+/).filter(w => w.length > 0).length;

    if (overallScore > 80) {
      insights.push('Excellent content quality with strong structure and purpose alignment');
    } else if (overallScore > 60) {
      insights.push('Good content foundation with opportunities for enhancement');
    } else {
      insights.push('Content needs significant improvement in structure and clarity');
    }

    if (wordCount < 50) {
      insights.push('Consider expanding your content for better depth and impact');
    } else if (wordCount > 300) {
      insights.push('Well-developed content with comprehensive coverage');
    }

    // Purpose-specific insights
    switch (purpose.type) {
      case 'presentation':
        insights.push('Professional presentation style detected');
        break;
      case 'pitch':
        insights.push('Sales-oriented language and structure identified');
        break;
      case 'educational':
        insights.push('Educational content with learning-focused approach');
        break;
      case 'persuasive':
        insights.push('Persuasive elements and argumentation present');
        break;
      case 'motivational':
        insights.push('Inspirational tone and motivational messaging detected');
        break;
    }

    return insights;
  }

  private generateSpecificFeedback(
    structure: any, 
    persuasiveness: any, 
    coherence: any, 
    audience: any
  ): SpecificFeedback[] {
    const feedback: SpecificFeedback[] = [];

    // Structure feedback
    if (structure.organization < 60) {
      feedback.push({
        category: 'structure',
        severity: 'warning',
        feedback: 'Content organization needs improvement',
        suggestion: 'Add clear transitions and logical flow indicators',
        confidence: 0.8
      });
    } else if (structure.organization > 80) {
      feedback.push({
        category: 'structure',
        severity: 'excellent',
        feedback: 'Excellent content organization and structure',
        suggestion: 'Maintain this level of structural clarity',
        confidence: 0.9
      });
    }

    // Persuasiveness feedback
    if (persuasiveness.impact < 60) {
      feedback.push({
        category: 'persuasiveness',
        severity: 'warning',
        feedback: 'Limited persuasive impact detected',
        suggestion: 'Include more compelling evidence and emotional appeals',
        confidence: 0.75
      });
    }

    // Coherence feedback
    if (coherence.logicalFlow < 60) {
      feedback.push({
        category: 'coherence',
        severity: 'warning',
        feedback: 'Logical flow could be improved',
        suggestion: 'Use more transition words and connect ideas clearly',
        confidence: 0.8
      });
    }

    // Audience feedback
    if (audience.engagement < 60) {
      feedback.push({
        category: 'audience',
        severity: 'warning',
        feedback: 'Limited audience engagement elements',
        suggestion: 'Include more direct audience address and interactive elements',
        confidence: 0.7
      });
    }

    return feedback;
  }

  private generateQuickFeedback(overallScore: number, structure: any, persuasiveness: any): string[] {
    const feedback: string[] = [];

    if (overallScore > 80) {
      feedback.push('Excellent content quality and structure');
      feedback.push('Strong persuasive elements and clarity');
    } else if (overallScore > 60) {
      feedback.push('Good content foundation established');
      if (structure.score < 70) feedback.push('Focus on improving content organization');
      if (persuasiveness.score < 70) feedback.push('Enhance persuasive language and impact');
    } else {
      feedback.push('Significant improvements needed in content structure');
      feedback.push('Work on clarity and logical flow');
    }

    return feedback;
  }

  private generateQuickImprovements(structure: any, persuasiveness: any, coherence: any): string[] {
    const improvements: string[] = [];

    if (structure.score < 70) {
      improvements.push('Add clear introduction and conclusion');
      improvements.push('Use transition words between main points');
    }

    if (persuasiveness.score < 70) {
      improvements.push('Include more compelling evidence');
      improvements.push('Strengthen call to action');
    }

    if (coherence.score < 70) {
      improvements.push('Improve logical flow between ideas');
      improvements.push('Maintain consistent theme throughout');
    }

    return improvements;
  }

  private identifyImprovementAreas(feedback: SpecificFeedback[]): string[] {
    return [
      'Strengthen content organization',
      'Enhance persuasive elements',
      'Improve audience engagement',
      'Clarify key messages'
    ];
  }

  private identifyStrengths(structure: any, persuasiveness: any, coherence: any): string[] {
    const strengths: string[] = [];

    if (structure.score > 70) strengths.push('Well-organized content structure');
    if (persuasiveness.score > 70) strengths.push('Strong persuasive elements');
    if (coherence.score > 70) strengths.push('Good logical flow and coherence');

    if (strengths.length === 0) {
      strengths.push('Clear communication foundation');
    }

    return strengths;
  }

  private generateRecommendations(feedback: SpecificFeedback[], purpose: SpeechPurpose): string[] {
    const recommendations: string[] = [];

    // Purpose-specific recommendations
    switch (purpose.type) {
      case 'presentation':
        recommendations.push('Use data visualization to support key points');
        recommendations.push('Practice smooth transitions between sections');
        break;
      case 'pitch':
        recommendations.push('Quantify benefits with specific metrics');
        recommendations.push('Address potential objections proactively');
        break;
      case 'educational':
        recommendations.push('Include interactive elements and examples');
        recommendations.push('Check for understanding throughout');
        break;
      case 'persuasive':
        recommendations.push('Build emotional connection with audience');
        recommendations.push('Provide clear next steps for action');
        break;
      case 'motivational':
        recommendations.push('Share personal stories and experiences');
        recommendations.push('End with inspiring call to action');
        break;
      default:
        recommendations.push('Maintain clear and engaging communication');
        recommendations.push('Focus on audience needs and interests');
    }

    return recommendations;
  }

  private calculateVariation(numbers: number[]): number {
    if (numbers.length < 2) return 0;
    
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length;
    const standardDeviation = Math.sqrt(variance);
    
    return standardDeviation / mean;
  }

  private getDefaultAnalysis(): ContentAnalysisResult {
    return {
      overallScore: 0,
      structureScore: 0,
      persuasivenessScore: 0,
      coherenceScore: 0,
      audienceAlignmentScore: 0,
      purposeAlignment: 0,
      keyInsights: ['No content to analyze yet'],
      improvementAreas: ['Start speaking to generate analysis'],
      strengths: ['Ready to analyze your content'],
      specificFeedback: [],
      recommendations: ['Begin your speech to receive AI-powered insights'],
      
      structure: { clarity: 0, organization: 0, flow: 0 },
      persuasiveness: { impact: 0, conviction: 0, callToAction: 0 },
      coherence: { consistency: 0, logicalFlow: 0, topicRelevance: 0 },
      audienceAlignment: { appropriateness: 0, engagement: 0, relatability: 0 },
      
      wordCount: 0,
      sentenceCount: 0,
      avgWordsPerSentence: 0,
      analysisTimestamp: new Date().toISOString(),
      feedback: ['Start speaking to receive AI feedback'],
      improvements: ['Content analysis will appear as you speak']
    };
  }

  getPurposeTemplate(type: string): SpeechPurpose | null {
    return this.purposeTemplates.get(type) || null;
  }

  getAllPurposeTemplates(): SpeechPurpose[] {
    return Array.from(this.purposeTemplates.values());
  }
}

export const contentAnalysisEngine = new ContentAnalysisEngine();