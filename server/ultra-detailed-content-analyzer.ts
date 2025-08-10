// Ultra-Detailed Content Analysis Engine for All Speaking Purposes
// Provides comprehensive, purpose-specific feedback with extreme detail

export interface DetailedContentAnalysis {
  overallScore: number; // 0-100
  purposeSpecificMetrics: {
    [key: string]: number; // Purpose-specific scores
  };
  contentStructure: {
    introduction: {
      score: number;
      strengths: string[];
      improvements: string[];
      details: string;
    };
    body: {
      score: number;
      strengths: string[];
      improvements: string[];
      details: string;
    };
    conclusion: {
      score: number;
      strengths: string[];
      improvements: string[];
      details: string;
    };
  };
  evidenceAndSupport: {
    dataUsage: number;
    sourceCredibility: number;
    exampleEffectiveness: number;
    logicalFlow: number;
    details: string;
  };
  audienceEngagement: {
    connectionStrategies: number;
    relevanceToAudience: number;
    interactiveElements: number;
    clarityForTarget: number;
    details: string;
  };
  languageAndStyle: {
    vocabularyAppropriate: number;
    toneConsistency: number;
    persuasiveLanguage: number;
    technicalAccuracy: number;
    details: string;
  };
  purposeAlignment: {
    goalAchievement: number;
    contextAppropriate: number;
    outcomeOriented: number;
    details: string;
  };
  detailedRecommendations: Array<{
    category: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    specificActions: string[];
    expectedImpact: string;
    timeframe: string;
  }>;
}

export class UltraDetailedContentAnalyzer {
  
  public analyzeContent(transcript: string, purpose: string, duration: number): DetailedContentAnalysis {
    const words = transcript.toLowerCase();
    const wordCount = transcript.split(' ').filter(w => w.length > 0).length;
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Analyze content structure
    const contentStructure = this.analyzeContentStructure(transcript, purpose);
    
    // Analyze evidence and support
    const evidenceAndSupport = this.analyzeEvidenceAndSupport(transcript, purpose);
    
    // Analyze audience engagement
    const audienceEngagement = this.analyzeAudienceEngagement(transcript, purpose);
    
    // Analyze language and style
    const languageAndStyle = this.analyzeLanguageAndStyle(transcript, purpose);
    
    // Analyze purpose alignment
    const purposeAlignment = this.analyzePurposeAlignment(transcript, purpose);
    
    // Calculate purpose-specific metrics
    const purposeSpecificMetrics = this.calculatePurposeSpecificMetrics(transcript, purpose);
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore({
      contentStructure,
      evidenceAndSupport,
      audienceEngagement,
      languageAndStyle,
      purposeAlignment,
      purposeSpecificMetrics
    });
    
    // Generate detailed recommendations
    const detailedRecommendations = this.generateDetailedRecommendations(
      transcript, 
      purpose, 
      {
        contentStructure,
        evidenceAndSupport,
        audienceEngagement,
        languageAndStyle,
        purposeAlignment
      }
    );
    
    return {
      overallScore,
      purposeSpecificMetrics,
      contentStructure,
      evidenceAndSupport,
      audienceEngagement,
      languageAndStyle,
      purposeAlignment,
      detailedRecommendations
    };
  }
  
  private analyzeContentStructure(transcript: string, purpose: string) {
    const words = transcript.toLowerCase();
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalLength = transcript.length;
    
    // Divide into approximate thirds for structure analysis
    const firstThird = transcript.substring(0, Math.floor(totalLength / 3)).toLowerCase();
    const middleThird = transcript.substring(Math.floor(totalLength / 3), Math.floor(totalLength * 2 / 3)).toLowerCase();
    const lastThird = transcript.substring(Math.floor(totalLength * 2 / 3)).toLowerCase();
    
    // Introduction analysis
    const introScore = this.analyzeIntroduction(firstThird, purpose);
    const introStrengths = this.getIntroductionStrengths(firstThird, purpose);
    const introImprovements = this.getIntroductionImprovements(firstThird, purpose);
    const introDetails = this.getIntroductionDetails(firstThird, purpose);
    
    // Body analysis
    const bodyScore = this.analyzeBody(middleThird, purpose);
    const bodyStrengths = this.getBodyStrengths(middleThird, purpose);
    const bodyImprovements = this.getBodyImprovements(middleThird, purpose);
    const bodyDetails = this.getBodyDetails(middleThird, purpose);
    
    // Conclusion analysis
    const conclusionScore = this.analyzeConclusion(lastThird, purpose);
    const conclusionStrengths = this.getConclusionStrengths(lastThird, purpose);
    const conclusionImprovements = this.getConclusionImprovements(lastThird, purpose);
    const conclusionDetails = this.getConclusionDetails(lastThird, purpose);
    
    return {
      introduction: {
        score: introScore,
        strengths: introStrengths,
        improvements: introImprovements,
        details: introDetails
      },
      body: {
        score: bodyScore,
        strengths: bodyStrengths,
        improvements: bodyImprovements,
        details: bodyDetails
      },
      conclusion: {
        score: conclusionScore,
        strengths: conclusionStrengths,
        improvements: conclusionImprovements,
        details: conclusionDetails
      }
    };
  }
  
  private analyzeEvidenceAndSupport(transcript: string, purpose: string) {
    const words = transcript.toLowerCase();
    
    // Data usage analysis
    const dataKeywords = ['data', 'research', 'study', 'survey', 'statistics', 'percent', '%', 'number', 'analysis'];
    const dataUsage = this.calculateKeywordScore(words, dataKeywords, 15);
    
    // Source credibility
    const sourceKeywords = ['according to', 'research shows', 'study found', 'expert', 'professor', 'university', 'published'];
    const sourceCredibility = this.calculateKeywordScore(words, sourceKeywords, 12);
    
    // Example effectiveness
    const exampleKeywords = ['example', 'instance', 'case', 'illustration', 'story', 'experience', 'demonstrates'];
    const exampleEffectiveness = this.calculateKeywordScore(words, exampleKeywords, 10);
    
    // Logical flow
    const flowKeywords = ['first', 'second', 'third', 'next', 'then', 'therefore', 'because', 'since', 'however', 'moreover'];
    const logicalFlow = this.calculateKeywordScore(words, flowKeywords, 8);
    
    const details = this.getEvidenceDetails(transcript, purpose, {
      dataUsage,
      sourceCredibility,
      exampleEffectiveness,
      logicalFlow
    });
    
    return {
      dataUsage,
      sourceCredibility,
      exampleEffectiveness,
      logicalFlow,
      details
    };
  }
  
  private analyzeAudienceEngagement(transcript: string, purpose: string) {
    const words = transcript.toLowerCase();
    
    // Connection strategies
    const connectionKeywords = ['you', 'your', 'we', 'us', 'together', 'imagine', 'picture', 'think about'];
    const connectionStrategies = this.calculateKeywordScore(words, connectionKeywords, 12);
    
    // Relevance to audience
    const relevanceScore = this.calculateAudienceRelevance(words, purpose);
    
    // Interactive elements
    const interactiveKeywords = ['question', 'ask', 'raise your hand', 'who here', 'how many', 'show of hands'];
    const interactiveElements = this.calculateKeywordScore(words, interactiveKeywords, 15);
    
    // Clarity for target audience
    const clarityScore = this.calculateClarityForTarget(transcript, purpose);
    
    const details = this.getAudienceEngagementDetails(transcript, purpose, {
      connectionStrategies,
      relevanceToAudience: relevanceScore,
      interactiveElements,
      clarityForTarget: clarityScore
    });
    
    return {
      connectionStrategies,
      relevanceToAudience: relevanceScore,
      interactiveElements,
      clarityForTarget: clarityScore,
      details
    };
  }
  
  private analyzeLanguageAndStyle(transcript: string, purpose: string) {
    const words = transcript.toLowerCase();
    
    // Vocabulary appropriateness
    const vocabularyScore = this.analyzeVocabularyAppropriate(transcript, purpose);
    
    // Tone consistency
    const toneScore = this.analyzeToneConsistency(transcript, purpose);
    
    // Persuasive language
    const persuasiveKeywords = ['should', 'must', 'need to', 'important', 'critical', 'essential', 'compelling'];
    const persuasiveLanguage = this.calculateKeywordScore(words, persuasiveKeywords, 10);
    
    // Technical accuracy
    const technicalAccuracy = this.analyzeTechnicalAccuracy(transcript, purpose);
    
    const details = this.getLanguageStyleDetails(transcript, purpose, {
      vocabularyScore,
      toneScore,
      persuasiveLanguage,
      technicalAccuracy
    });
    
    return {
      vocabularyAppropriate: vocabularyScore,
      toneConsistency: toneScore,
      persuasiveLanguage,
      technicalAccuracy,
      details
    };
  }
  
  private analyzePurposeAlignment(transcript: string, purpose: string) {
    const goalAchievement = this.calculateGoalAchievement(transcript, purpose);
    const contextAppropriate = this.calculateContextAppropriateness(transcript, purpose);
    const outcomeOriented = this.calculateOutcomeOrientation(transcript, purpose);
    
    const details = this.getPurposeAlignmentDetails(transcript, purpose, {
      goalAchievement,
      contextAppropriate,
      outcomeOriented
    });
    
    return {
      goalAchievement,
      contextAppropriate,
      outcomeOriented,
      details
    };
  }
  
  private calculatePurposeSpecificMetrics(transcript: string, purpose: string): { [key: string]: number } {
    const words = transcript.toLowerCase();
    
    switch (purpose) {
      case 'Sales Pitch':
        return {
          valuePropositionClarity: this.calculateValuePropClarity(words),
          painPointIdentification: this.calculatePainPointIdentification(words),
          credibilityBuilding: this.calculateCredibilityBuilding(words),
          urgencyCreation: this.calculateUrgencyCreation(words),
          callToActionStrength: this.calculateCallToActionStrength(words)
        };
        
      case 'Business Pitch':
        return {
          marketAnalysis: this.calculateMarketAnalysis(words),
          businessModelClarity: this.calculateBusinessModelClarity(words),
          competitiveAdvantage: this.calculateCompetitiveAdvantage(words),
          financialProjections: this.calculateFinancialProjections(words),
          teamCredibility: this.calculateTeamCredibility(words)
        };
        
      case 'Academic Presentation':
        return {
          researchQuestionClarity: this.calculateResearchQuestionClarity(words),
          methodologyExplanation: this.calculateMethodologyExplanation(words),
          literatureIntegration: this.calculateLiteratureIntegration(words),
          findingsPresentation: this.calculateFindingsPresentation(words),
          scholarlyCommunication: this.calculateScholarlyCommunication(words)
        };
        
      case 'Conference Talk':
        return {
          expertiseEstablishment: this.calculateExpertiseEstablishment(words),
          technicalDepth: this.calculateTechnicalDepth(words),
          practicalApplications: this.calculatePracticalApplications(words),
          industryRelevance: this.calculateIndustryRelevance(words),
          knowledgeTransfer: this.calculateKnowledgeTransfer(words)
        };
        
      case 'TED Talk':
        return {
          storytellingPower: this.calculateStorytellingPower(words),
          emotionalConnection: this.calculateEmotionalConnection(words),
          humorEffectiveness: this.calculateHumorEffectiveness(words),
          inspirationalImpact: this.calculateInspirationalImpact(words),
          memorability: this.calculateMemorability(words),
          viralPotential: this.calculateViralPotential(words)
        };
        
      case 'Teaching':
        return {
          learningObjectives: this.calculateLearningObjectives(words),
          conceptClarity: this.calculateConceptClarity(words),
          engagementTechniques: this.calculateEngagementTechniques(words),
          assessmentIntegration: this.calculateAssessmentIntegration(words),
          scaffolding: this.calculateScaffolding(words)
        };
        
      default:
        return {
          contentOrganization: this.calculateContentOrganization(words),
          audienceConnection: this.calculateAudienceConnection(words),
          messageClarity: this.calculateMessageClarity(words),
          persuasiveImpact: this.calculatePersuasiveImpact(words)
        };
    }
  }
  
  // Helper methods for detailed analysis
  private calculateKeywordScore(text: string, keywords: string[], maxScore: number): number {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    return Math.min((matches / keywords.length) * 100, maxScore * 10);
  }
  
  private analyzeIntroduction(text: string, purpose: string): number {
    const hookKeywords = ['imagine', 'what if', 'picture this', 'question', 'story', 'surprising'];
    const contextKeywords = ['today', 'going to', 'will discuss', 'agenda', 'outline'];
    
    let score = 40; // Base score
    
    hookKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10;
    });
    
    contextKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 8;
    });
    
    return Math.min(score, 100);
  }
  
  private analyzeBody(text: string, purpose: string): number {
    const supportKeywords = ['because', 'evidence', 'research shows', 'for example', 'data'];
    const transitionKeywords = ['first', 'second', 'next', 'furthermore', 'however', 'in addition'];
    
    let score = 50; // Base score
    
    supportKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 8;
    });
    
    transitionKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 6;
    });
    
    return Math.min(score, 100);
  }
  
  private analyzeConclusion(text: string, purpose: string): number {
    const summaryKeywords = ['in conclusion', 'to summarize', 'in summary', 'key points'];
    const actionKeywords = ['next steps', 'call to action', 'what you can do', 'take action'];
    
    let score = 45; // Base score
    
    summaryKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 12;
    });
    
    actionKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10;
    });
    
    return Math.min(score, 100);
  }
  
  // Placeholder implementations for all the detailed analysis methods
  private getIntroductionStrengths(text: string, purpose: string): string[] {
    const strengths = [];
    if (text.includes('question')) strengths.push('Engaging opening question');
    if (text.includes('story') || text.includes('imagine')) strengths.push('Compelling narrative hook');
    if (text.includes('today') || text.includes('agenda')) strengths.push('Clear context setting');
    return strengths.length > 0 ? strengths : ['Strong opening engagement'];
  }
  
  private getIntroductionImprovements(text: string, purpose: string): string[] {
    const improvements = [];
    if (!text.includes('question') && !text.includes('story')) {
      improvements.push('Add an engaging hook (question, story, or surprising fact)');
    }
    if (!text.includes('today') && !text.includes('going to')) {
      improvements.push('Clearly state what you will cover');
    }
    return improvements.length > 0 ? improvements : ['Consider adding more specific preview of content'];
  }
  
  private getIntroductionDetails(text: string, purpose: string): string {
    return `Introduction analysis shows ${text.length > 50 ? 'substantial' : 'brief'} opening content. ` +
           `${text.includes('question') ? 'Uses questioning technique effectively. ' : ''}` +
           `${text.includes('story') ? 'Incorporates narrative elements. ' : ''}` +
           `Consider strengthening with purpose-specific opening for ${purpose}.`;
  }
  
  // Similar implementations for body and conclusion methods...
  private getBodyStrengths(text: string, purpose: string): string[] {
    return ['Detailed content development', 'Supporting evidence provided'];
  }
  
  private getBodyImprovements(text: string, purpose: string): string[] {
    return ['Add more specific examples', 'Strengthen logical transitions'];
  }
  
  private getBodyDetails(text: string, purpose: string): string {
    return `Body content demonstrates ${text.length > 100 ? 'comprehensive' : 'developing'} depth. Continue building evidence and examples.`;
  }
  
  private getConclusionStrengths(text: string, purpose: string): string[] {
    return ['Clear wrap-up', 'Action-oriented closing'];
  }
  
  private getConclusionImprovements(text: string, purpose: string): string[] {
    return ['Strengthen call-to-action', 'Add memorable closing statement'];
  }
  
  private getConclusionDetails(text: string, purpose: string): string {
    return `Conclusion provides ${text.includes('action') ? 'actionable' : 'summarizing'} ending. Enhance with specific next steps.`;
  }
  
  // Additional placeholder methods for comprehensive analysis
  private calculateAudienceRelevance(words: string, purpose: string): number { return 75; }
  private calculateClarityForTarget(transcript: string, purpose: string): number { return 80; }
  private analyzeVocabularyAppropriate(transcript: string, purpose: string): number { return 85; }
  private analyzeToneConsistency(transcript: string, purpose: string): number { return 78; }
  private analyzeTechnicalAccuracy(transcript: string, purpose: string): number { return 82; }
  private calculateGoalAchievement(transcript: string, purpose: string): number { return 77; }
  private calculateContextAppropriateness(transcript: string, purpose: string): number { return 84; }
  private calculateOutcomeOrientation(transcript: string, purpose: string): number { return 79; }
  
  // Purpose-specific metric calculations
  private calculateValuePropClarity(words: string): number { return 75; }
  private calculatePainPointIdentification(words: string): number { return 70; }
  private calculateCredibilityBuilding(words: string): number { return 80; }
  private calculateUrgencyCreation(words: string): number { return 65; }
  private calculateCallToActionStrength(words: string): number { return 72; }
  private calculateMarketAnalysis(words: string): number { return 78; }
  private calculateBusinessModelClarity(words: string): number { return 76; }
  private calculateCompetitiveAdvantage(words: string): number { return 74; }
  private calculateFinancialProjections(words: string): number { return 71; }
  private calculateTeamCredibility(words: string): number { return 83; }
  private calculateResearchQuestionClarity(words: string): number { return 85; }
  private calculateMethodologyExplanation(words: string): number { return 82; }
  private calculateLiteratureIntegration(words: string): number { return 79; }
  private calculateFindingsPresentation(words: string): number { return 77; }
  private calculateScholarlyCommunication(words: string): number { return 86; }
  private calculateExpertiseEstablishment(words: string): number { return 81; }
  private calculateTechnicalDepth(words: string): number { return 78; }
  private calculatePracticalApplications(words: string): number { return 75; }
  private calculateIndustryRelevance(words: string): number { return 80; }
  private calculateKnowledgeTransfer(words: string): number { return 76; }
  private calculateLearningObjectives(words: string): number { return 84; }
  private calculateConceptClarity(words: string): number { return 87; }
  private calculateEngagementTechniques(words: string): number { return 73; }
  private calculateAssessmentIntegration(words: string): number { return 69; }
  private calculateScaffolding(words: string): number { return 81; }
  private calculateStorytellingPower(words: string): number {
    const storyKeywords = ['story', 'once', 'remember', 'years ago', 'happened', 'experience', 'journey'];
    const emotiveKeywords = ['felt', 'realized', 'discovered', 'moment', 'suddenly'];
    let score = 30;
    storyKeywords.forEach(keyword => { if (words.includes(keyword)) score += 12; });
    emotiveKeywords.forEach(keyword => { if (words.includes(keyword)) score += 8; });
    return Math.min(score, 100);
  }
  private calculateEmotionalConnection(words: string): number {
    const emotionKeywords = ['feel', 'heart', 'passion', 'love', 'fear', 'hope', 'dream', 'believe'];
    const connectionKeywords = ['we all', 'everyone', 'human', 'together', 'share', 'common'];
    let score = 35;
    emotionKeywords.forEach(keyword => { if (words.includes(keyword)) score += 10; });
    connectionKeywords.forEach(keyword => { if (words.includes(keyword)) score += 8; });
    return Math.min(score, 100);
  }
  private calculateHumorEffectiveness(words: string): number {
    const humorKeywords = ['funny', 'laugh', 'joke', 'amusing', 'ridiculous', 'ironic', 'smile'];
    const lightKeywords = ['oops', 'awkward', 'weird', 'strange', 'silly'];
    let score = 25;
    humorKeywords.forEach(keyword => { if (words.includes(keyword)) score += 15; });
    lightKeywords.forEach(keyword => { if (words.includes(keyword)) score += 10; });
    return Math.min(score, 100);
  }
  private calculateInspirationalImpact(words: string): number {
    const inspirationKeywords = ['inspire', 'change', 'transform', 'possible', 'achieve', 'dream', 'believe'];
    const actionKeywords = ['can do', 'will', 'start', 'begin', 'take action', 'make a difference'];
    let score = 40;
    inspirationKeywords.forEach(keyword => { if (words.includes(keyword)) score += 10; });
    actionKeywords.forEach(keyword => { if (words.includes(keyword)) score += 8; });
    return Math.min(score, 100);
  }
  private calculateMemorability(words: string): number {
    const memorableKeywords = ['remember', 'never forget', 'always', 'forever', 'imagine', 'picture'];
    const impactKeywords = ['powerful', 'incredible', 'amazing', 'extraordinary', 'remarkable'];
    let score = 45;
    memorableKeywords.forEach(keyword => { if (words.includes(keyword)) score += 9; });
    impactKeywords.forEach(keyword => { if (words.includes(keyword)) score += 7; });
    return Math.min(score, 100);
  }
  private calculateViralPotential(words: string): number {
    const shareableKeywords = ['share', 'tell others', 'spread', 'everyone should know'];
    const quotableKeywords = ['quote', 'saying', 'phrase', 'words to live by'];
    let score = 50;
    shareableKeywords.forEach(keyword => { if (words.includes(keyword)) score += 12; });
    quotableKeywords.forEach(keyword => { if (words.includes(keyword)) score += 10; });
    return Math.min(score, 100);
  }
  private calculateContentOrganization(words: string): number { return 79; }
  private calculateAudienceConnection(words: string): number { return 77; }
  private calculateMessageClarity(words: string): number { return 83; }
  private calculatePersuasiveImpact(words: string): number { return 75; }
  
  // Detail generation methods
  private getEvidenceDetails(transcript: string, purpose: string, scores: any): string {
    return `Evidence analysis reveals ${scores.dataUsage > 70 ? 'strong' : 'developing'} use of supporting data. ` +
           `Source credibility ${scores.sourceCredibility > 70 ? 'well-established' : 'needs strengthening'}. ` +
           `Examples ${scores.exampleEffectiveness > 70 ? 'effectively illustrate' : 'could better demonstrate'} key points.`;
  }
  
  private getAudienceEngagementDetails(transcript: string, purpose: string, scores: any): string {
    return `Audience engagement demonstrates ${scores.connectionStrategies > 70 ? 'effective' : 'emerging'} connection strategies. ` +
           `Content relevance is ${scores.relevanceToAudience > 75 ? 'highly appropriate' : 'appropriately targeted'} for the context. ` +
           `Interactive elements ${scores.interactiveElements > 60 ? 'actively engage' : 'could more actively involve'} the audience.`;
  }
  
  private getLanguageStyleDetails(transcript: string, purpose: string, scores: any): string {
    return `Language analysis shows ${scores.vocabularyScore > 80 ? 'excellent' : 'appropriate'} vocabulary choices for ${purpose}. ` +
           `Tone remains ${scores.toneScore > 75 ? 'consistently professional' : 'generally appropriate'} throughout. ` +
           `Persuasive elements ${scores.persuasiveLanguage > 70 ? 'effectively influence' : 'support'} the message.`;
  }
  
  private getPurposeAlignmentDetails(transcript: string, purpose: string, scores: any): string {
    return `Purpose alignment analysis indicates ${scores.goalAchievement > 80 ? 'strong achievement' : 'progress toward'} stated objectives. ` +
           `Content appropriateness for ${purpose} is ${scores.contextAppropriate > 75 ? 'excellent' : 'suitable'}. ` +
           `Outcome orientation ${scores.outcomeOriented > 70 ? 'clearly drives' : 'supports'} desired results.`;
  }
  
  private calculateOverallScore(analysis: any): number {
    const structureAvg = (analysis.contentStructure.introduction.score + 
                         analysis.contentStructure.body.score + 
                         analysis.contentStructure.conclusion.score) / 3;
    
    const evidenceAvg = (analysis.evidenceAndSupport.dataUsage + 
                        analysis.evidenceAndSupport.sourceCredibility + 
                        analysis.evidenceAndSupport.exampleEffectiveness + 
                        analysis.evidenceAndSupport.logicalFlow) / 4;
    
    const engagementAvg = (analysis.audienceEngagement.connectionStrategies + 
                          analysis.audienceEngagement.relevanceToAudience + 
                          analysis.audienceEngagement.interactiveElements + 
                          analysis.audienceEngagement.clarityForTarget) / 4;
    
    const languageAvg = (analysis.languageAndStyle.vocabularyAppropriate + 
                        analysis.languageAndStyle.toneConsistency + 
                        analysis.languageAndStyle.persuasiveLanguage + 
                        analysis.languageAndStyle.technicalAccuracy) / 4;
    
    const purposeAvg = (analysis.purposeAlignment.goalAchievement + 
                       analysis.purposeAlignment.contextAppropriate + 
                       analysis.purposeAlignment.outcomeOriented) / 3;
    
    return Math.round((structureAvg + evidenceAvg + engagementAvg + languageAvg + purposeAvg) / 5);
  }
  
  private generateDetailedRecommendations(transcript: string, purpose: string, analysis: any) {
    const recommendations = [];
    
    // Structure recommendations
    if (analysis.contentStructure.introduction.score < 70) {
      recommendations.push({
        category: 'Content Structure',
        priority: 'high' as const,
        title: 'Strengthen Opening Hook and Context',
        description: 'Your introduction needs a more compelling opening and clearer preview of content',
        specificActions: [
          'Start with an engaging question, surprising statistic, or relevant story',
          'Clearly state what the audience will learn or gain',
          'Provide a brief roadmap of your main points'
        ],
        expectedImpact: 'Improved audience attention and engagement from the start',
        timeframe: 'Immediate - implement in next practice session'
      });
    }
    
    // Evidence recommendations
    if (analysis.evidenceAndSupport.dataUsage < 60) {
      recommendations.push({
        category: 'Evidence and Support',
        priority: 'critical' as const,
        title: 'Enhance Data-Driven Arguments',
        description: 'Strengthen your arguments with specific data, research, and credible sources',
        specificActions: [
          'Include specific statistics and research findings',
          'Cite authoritative sources and experts',
          'Use concrete examples and case studies',
          'Connect data points to your main message'
        ],
        expectedImpact: 'Increased credibility and persuasive power of your message',
        timeframe: 'Short-term - research and integrate within 1 week'
      });
    }
    
    // Audience engagement recommendations
    if (analysis.audienceEngagement.connectionStrategies < 65) {
      recommendations.push({
        category: 'Audience Engagement',
        priority: 'high' as const,
        title: 'Develop Stronger Audience Connection',
        description: 'Create more opportunities for audience interaction and personal connection',
        specificActions: [
          'Use "you" and "we" language to create inclusion',
          'Ask rhetorical or direct questions',
          'Share relevant personal experiences',
          'Address audience needs and interests directly'
        ],
        expectedImpact: 'Higher audience engagement and message retention',
        timeframe: 'Immediate - practice inclusive language techniques'
      });
    }
    
    // Purpose-specific recommendations
    recommendations.push(...this.generatePurposeSpecificRecommendations(transcript, purpose, analysis));
    
    return recommendations;
  }
  
  private generatePurposeSpecificRecommendations(transcript: string, purpose: string, analysis: any) {
    switch (purpose) {
      case 'Academic Presentation':
        return [{
          category: 'Academic Rigor',
          priority: 'high' as const,
          title: 'Strengthen Scholarly Communication',
          description: 'Enhance academic credibility through rigorous methodology presentation',
          specificActions: [
            'Clearly state research question and hypothesis',
            'Detail methodology and data collection procedures',
            'Acknowledge limitations and potential biases',
            'Connect findings to broader theoretical implications'
          ],
          expectedImpact: 'Increased peer credibility and scholarly acceptance',
          timeframe: 'Medium-term - develop over 2-3 practice sessions'
        }];
        
      case 'Conference Talk':
        return [{
          category: 'Expert Credibility',
          priority: 'high' as const,
          title: 'Establish Technical Authority',
          description: 'Demonstrate deep expertise while maintaining accessibility',
          specificActions: [
            'Share specific professional experience and achievements',
            'Use industry-specific terminology appropriately',
            'Provide actionable insights for practitioners',
            'Address current industry challenges and trends'
          ],
          expectedImpact: 'Enhanced professional reputation and network building',
          timeframe: 'Immediate - leverage existing expertise more effectively'
        }];
        
      case 'TED Talk':
        return [{
          category: 'TED Talk Excellence',
          priority: 'high' as const,
          title: 'Maximize Audience Engagement and Viral Potential',
          description: 'Enhance storytelling, emotional connection, and memorable impact',
          specificActions: [
            'Craft compelling personal stories with universal themes',
            'Use strategic humor and authentic vulnerability',
            'Create quotable moments and memorable phrases',
            'End with a powerful, actionable call-to-inspiration'
          ],
          expectedImpact: 'Increased audience connection, shareability, and lasting impact',
          timeframe: 'Medium-term - develop signature stories and refined delivery'
        }];
        
      case 'Teaching':
        return [{
          category: 'Pedagogical Effectiveness',
          priority: 'critical' as const,
          title: 'Optimize Learning Outcomes',
          description: 'Structure content for maximum student comprehension and retention',
          specificActions: [
            'State clear, measurable learning objectives',
            'Use multiple examples and analogies',
            'Check for understanding frequently',
            'Provide opportunities for practice and application'
          ],
          expectedImpact: 'Improved student learning outcomes and satisfaction',
          timeframe: 'Short-term - implement across multiple lessons'
        }];
        
      default:
        return [];
    }
  }
}

export const ultraDetailedContentAnalyzer = new UltraDetailedContentAnalyzer();