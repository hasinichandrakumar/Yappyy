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
      description: 'Professional business presentation',
      audience: 'Colleagues, clients, or stakeholders',
      objectives: ['Inform', 'Persuade', 'Engage'],
      keyElements: ['Clear structure', 'Data-driven insights', 'Call to action', 'Professional tone']
    });
    
    // Sales Pitch
    this.purposeTemplates.set('pitch', {
      type: 'pitch',
      description: 'Sales or investment pitch',
      audience: 'Potential clients or investors',
      objectives: ['Persuade', 'Generate interest', 'Close deals'],
      keyElements: ['Problem-solution fit', 'Value proposition', 'Compelling narrative', 'Strong close']
    });
    
    // Educational Content
    this.purposeTemplates.set('educational', {
      type: 'educational',
      description: 'Teaching or training session',
      audience: 'Students or trainees',
      objectives: ['Educate', 'Explain concepts', 'Facilitate learning'],
      keyElements: ['Clear explanations', 'Examples', 'Logical progression', 'Engagement techniques']
    });
    
    // Persuasive Speech
    this.purposeTemplates.set('persuasive', {
      type: 'persuasive',
      description: 'Persuasive or advocacy speech',
      audience: 'General audience or specific group',
      objectives: ['Change minds', 'Inspire action', 'Build consensus'],
      keyElements: ['Strong arguments', 'Emotional appeal', 'Evidence', 'Compelling conclusion']
    });
    
    // Motivational Speech
    this.purposeTemplates.set('motivational', {
      type: 'motivational',
      description: 'Inspirational or motivational speech',
      audience: 'Team members or general audience',
      objectives: ['Inspire', 'Motivate', 'Energize'],
      keyElements: ['Emotional connection', 'Personal stories', 'Positive messaging', 'Action-oriented']
    });
  }
  
  async analyzeContent(transcript: string, purpose: SpeechPurpose, sessionDuration: number): Promise<ContentAnalysisResult> {
    if (!transcript || transcript.trim().length < 10) {
      return this.getDefaultAnalysis();
    }
    
    // Perform comprehensive analysis
    const [
      structureAnalysis,
      persuasivenessAnalysis,
      coherenceAnalysis,
      audienceAlignmentAnalysis,
      purposeAlignmentAnalysis
    ] = await Promise.all([
      this.analyzeStructure(transcript, purpose),
      this.analyzePersuasiveness(transcript, purpose),
      this.analyzeCoherence(transcript),
      this.analyzeAudienceAlignment(transcript, purpose),
      this.analyzePurposeAlignment(transcript, purpose)
    ]);
    
    // Calculate overall score
    const overallScore = Math.round(
      (structureAnalysis.score * 0.25) +
      (persuasivenessAnalysis.score * 0.25) +
      (coherenceAnalysis.score * 0.2) +
      (audienceAlignmentAnalysis.score * 0.15) +
      (purposeAlignmentAnalysis.score * 0.15)
    );
    
    // Combine feedback
    const specificFeedback: SpecificFeedback[] = [
      ...structureAnalysis.feedback,
      ...persuasivenessAnalysis.feedback,
      ...coherenceAnalysis.feedback,
      ...audienceAlignmentAnalysis.feedback,
      ...purposeAlignmentAnalysis.feedback
    ];
    
    // Generate insights and recommendations
    const keyInsights = this.generateKeyInsights(transcript, purpose, overallScore);
    const improvementAreas = this.identifyImprovementAreas(specificFeedback);
    const strengths = this.identifyStrengths(specificFeedback);
    const recommendations = this.generateRecommendations(specificFeedback, purpose);
    
    const result: ContentAnalysisResult = {
      overallScore,
      structureScore: structureAnalysis.score,
      persuasivenessScore: persuasivenessAnalysis.score,
      coherenceScore: coherenceAnalysis.score,
      audienceAlignmentScore: audienceAlignmentAnalysis.score,
      purposeAlignment: purposeAlignmentAnalysis.score,
      keyInsights,
      improvementAreas,
      strengths,
      specificFeedback,
      recommendations
    };
    
    // Store in history
    this.analysisHistory.push(result);
    if (this.analysisHistory.length > 10) {
      this.analysisHistory.shift();
    }
    
    return result;
  }
  
  private async analyzeStructure(transcript: string, purpose: SpeechPurpose): Promise<{score: number, feedback: SpecificFeedback[]}> {
    const words = transcript.split(/\s+/);
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Analyze introduction
    const hasIntroduction = this.detectIntroduction(transcript);
    
    // Analyze conclusion
    const hasConclusion = this.detectConclusion(transcript);
    
    // Analyze flow and transitions
    const hasGoodTransitions = this.detectTransitions(transcript);
    
    // Calculate structure score
    let structureScore = 0;
    if (hasIntroduction) structureScore += 30;
    if (hasConclusion) structureScore += 30;
    if (hasGoodTransitions) structureScore += 25;
    if (sentences.length > 3) structureScore += 15; // Adequate length
    
    const feedback: SpecificFeedback[] = [];
    
    if (!hasIntroduction) {
      feedback.push({
        category: 'structure',
        severity: 'warning',
        feedback: 'Missing clear introduction',
        suggestion: 'Start with a compelling hook and preview your main points',
        confidence: 0.8
      });
    }
    
    if (!hasConclusion) {
      feedback.push({
        category: 'structure',
        severity: 'warning',
        feedback: 'Missing strong conclusion',
        suggestion: 'End with a memorable summary and call to action',
        confidence: 0.8
      });
    }
    
    if (structureScore >= 80) {
      feedback.push({
        category: 'structure',
        severity: 'excellent',
        feedback: 'Excellent speech structure with clear beginning, middle, and end',
        suggestion: 'Maintain this logical flow in future presentations',
        confidence: 0.9
      });
    }
    
    return { score: Math.min(100, structureScore), feedback };
  }
  
  private async analyzePersuasiveness(transcript: string, purpose: SpeechPurpose): Promise<{score: number, feedback: SpecificFeedback[]}> {
    const persuasiveWords = ['because', 'therefore', 'however', 'moreover', 'furthermore', 'consequently', 'thus', 'hence'];
    const emotionalWords = ['exciting', 'amazing', 'incredible', 'powerful', 'essential', 'crucial', 'vital', 'important'];
    const actionWords = ['should', 'must', 'need to', 'will', 'can', 'let\'s', 'together', 'action'];
    
    const lowerTranscript = transcript.toLowerCase();
    
    // Count persuasive elements
    const persuasiveCount = persuasiveWords.filter(word => lowerTranscript.includes(word)).length;
    const emotionalCount = emotionalWords.filter(word => lowerTranscript.includes(word)).length;
    const actionCount = actionWords.filter(word => lowerTranscript.includes(word)).length;
    
    // Calculate persuasiveness score
    const persuasivenessScore = Math.min(100, (persuasiveCount * 15) + (emotionalCount * 10) + (actionCount * 20));
    
    const feedback: SpecificFeedback[] = [];
    
    if (persuasivenessScore < 40) {
      feedback.push({
        category: 'persuasiveness',
        severity: 'warning',
        feedback: 'Limited persuasive language detected',
        suggestion: 'Use more compelling arguments and emotional appeals',
        confidence: 0.7
      });
    }
    
    if (actionCount === 0) {
      feedback.push({
        category: 'persuasiveness',
        severity: 'warning',
        feedback: 'No clear call to action identified',
        suggestion: 'Include specific actions you want your audience to take',
        confidence: 0.8
      });
    }
    
    return { score: persuasivenessScore, feedback };
  }
  
  private async analyzeCoherence(transcript: string): Promise<{score: number, feedback: SpecificFeedback[]}> {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Analyze sentence length variation
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const lengthVariation = this.calculateVariation(sentenceLengths);
    
    // Analyze repetition and filler words
    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally'];
    const fillerCount = fillerWords.reduce((count, word) => 
      count + (transcript.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);
    
    // Calculate coherence score
    let coherenceScore = 80; // Base score
    
    // Penalize excessive filler words
    if (fillerCount > sentences.length * 0.1) {
      coherenceScore -= 20;
    }
    
    // Reward good sentence variety
    if (lengthVariation > 0.3) {
      coherenceScore += 10;
    }
    
    const feedback: SpecificFeedback[] = [];
    
    if (fillerCount > sentences.length * 0.15) {
      feedback.push({
        category: 'coherence',
        severity: 'warning',
        feedback: `High filler word usage detected (${fillerCount} instances)`,
        suggestion: 'Practice speaking with more deliberate pauses instead of filler words',
        confidence: 0.9
      });
    }
    
    return { score: Math.max(0, Math.min(100, coherenceScore)), feedback };
  }
  
  private async analyzeAudienceAlignment(transcript: string, purpose: SpeechPurpose): Promise<{score: number, feedback: SpecificFeedback[]}> {
    const audienceWords = ['you', 'your', 'we', 'us', 'together', 'everyone', 'colleagues', 'team'];
    const inclusiveWords = ['let\'s', 'together', 'we can', 'our', 'shared', 'common'];
    
    const lowerTranscript = transcript.toLowerCase();
    
    // Count audience-focused language
    const audienceCount = audienceWords.filter(word => lowerTranscript.includes(word)).length;
    const inclusiveCount = inclusiveWords.filter(word => lowerTranscript.includes(word)).length;
    
    // Calculate audience alignment score
    const alignmentScore = Math.min(100, (audienceCount * 8) + (inclusiveCount * 15));
    
    const feedback: SpecificFeedback[] = [];
    
    if (alignmentScore < 50) {
      feedback.push({
        category: 'audience',
        severity: 'warning',
        feedback: 'Limited audience engagement language',
        suggestion: 'Use more "you" and "we" language to connect with your audience',
        confidence: 0.7
      });
    }
    
    return { score: alignmentScore, feedback };
  }
  
  private async analyzePurposeAlignment(transcript: string, purpose: SpeechPurpose): Promise<{score: number, feedback: SpecificFeedback[]}> {
    const keyElements = purpose.keyElements;
    let alignmentScore = 70; // Base score
    
    const feedback: SpecificFeedback[] = [];
    
    // Check for purpose-specific elements
    if (purpose.type === 'pitch') {
      if (transcript.toLowerCase().includes('problem') || transcript.toLowerCase().includes('solution')) {
        alignmentScore += 15;
      }
      if (transcript.toLowerCase().includes('value') || transcript.toLowerCase().includes('benefit')) {
        alignmentScore += 15;
      }
    }
    
    if (purpose.type === 'educational') {
      if (transcript.toLowerCase().includes('example') || transcript.toLowerCase().includes('for instance')) {
        alignmentScore += 10;
      }
      if (transcript.toLowerCase().includes('learn') || transcript.toLowerCase().includes('understand')) {
        alignmentScore += 10;
      }
    }
    
    return { score: Math.min(100, alignmentScore), feedback };
  }
  
  private detectIntroduction(transcript: string): boolean {
    const introWords = ['hello', 'welcome', 'today', 'going to', 'talk about', 'discuss', 'begin', 'start'];
    const firstSentence = transcript.split(/[.!?]/)[0].toLowerCase();
    return introWords.some(word => firstSentence.includes(word));
  }
  
  private detectConclusion(transcript: string): boolean {
    const conclusionWords = ['conclusion', 'finally', 'in summary', 'to summarize', 'thank you', 'questions'];
    const lastSentence = transcript.split(/[.!?]/).slice(-2)[0]?.toLowerCase() || '';
    return conclusionWords.some(word => lastSentence.includes(word));
  }
  
  private detectTransitions(transcript: string): boolean {
    const transitionWords = ['next', 'furthermore', 'however', 'therefore', 'additionally', 'moreover', 'first', 'second'];
    const lowerTranscript = transcript.toLowerCase();
    return transitionWords.filter(word => lowerTranscript.includes(word)).length >= 2;
  }
  
  private calculateVariation(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance) / mean;
  }
  
  private generateKeyInsights(transcript: string, purpose: SpeechPurpose, overallScore: number): string[] {
    const insights = [];
    
    if (overallScore >= 80) {
      insights.push('Strong overall content structure and delivery');
    }
    
    if (transcript.length > 500) {
      insights.push('Good speech length with substantial content');
    }
    
    if (purpose.type === 'pitch' && transcript.toLowerCase().includes('roi')) {
      insights.push('Effective use of business metrics and ROI focus');
    }
    
    return insights;
  }
  
  private identifyImprovementAreas(feedback: SpecificFeedback[]): string[] {
    return feedback
      .filter(f => f.severity === 'warning' || f.severity === 'critical')
      .map(f => f.feedback)
      .slice(0, 3);
  }
  
  private identifyStrengths(feedback: SpecificFeedback[]): string[] {
    return feedback
      .filter(f => f.severity === 'excellent' || f.severity === 'good')
      .map(f => f.feedback)
      .slice(0, 3);
  }
  
  private generateRecommendations(feedback: SpecificFeedback[], purpose: SpeechPurpose): string[] {
    const recommendations = feedback
      .filter(f => f.severity === 'warning' || f.severity === 'critical')
      .map(f => f.suggestion)
      .slice(0, 3);
    
    // Add purpose-specific recommendations
    if (purpose.type === 'pitch') {
      recommendations.push('Include specific metrics and ROI projections');
    }
    
    return recommendations;
  }
  
  private getDefaultAnalysis(): ContentAnalysisResult {
    return {
      overallScore: 0,
      structureScore: 0,
      persuasivenessScore: 0,
      coherenceScore: 0,
      audienceAlignmentScore: 0,
      purposeAlignment: 0,
      keyInsights: [],
      improvementAreas: ['Start speaking to generate analysis'],
      strengths: [],
      specificFeedback: [],
      recommendations: ['Choose your speech purpose and begin recording']
    };
  }
  
  getPurposeTemplate(type: string): SpeechPurpose | null {
    return this.purposeTemplates.get(type) || null;
  }
  
  getAllPurposeTemplates(): SpeechPurpose[] {
    return Array.from(this.purposeTemplates.values());
  }
}

// Export singleton
export const contentAnalysisEngine = new ContentAnalysisEngine();