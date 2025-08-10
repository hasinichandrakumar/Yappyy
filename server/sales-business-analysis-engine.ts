// Advanced Sales & Business Pitch Analysis Engine for Adult Professional Cohorts
// Designed for Fortune 500 executives, enterprise sales teams, and funding presentations

export interface BusinessAnalysisResult {
  salesEffectiveness: {
    valuePropositionClarity: number; // 0-100
    painPointTargeting: number; // 0-100
    objectionHandling: number; // 0-100
    closingStrength: number; // 0-100
    credibilityFactors: number; // 0-100
  };
  businessPitchQuality: {
    marketAnalysis: number; // 0-100
    businessModelClarity: number; // 0-100
    competitiveAdvantage: number; // 0-100
    financialCredibility: number; // 0-100
    investmentReadiness: number; // 0-100
  };
  executivePresence: {
    authorityLevel: number; // 0-100
    stakeholderEngagement: number; // 0-100
    industryExpertise: number; // 0-100
    leadershipCommunication: number; // 0-100
  };
  recommendations: Array<{
    category: 'revenue_impact' | 'deal_closing' | 'executive_presence' | 'funding_readiness';
    priority: 'critical' | 'high' | 'medium';
    title: string;
    description: string;
    expectedImpact: string; // Quantified business impact
  }>;
}

export class SalesBusinessAnalysisEngine {
  
  // Analyze sales pitch effectiveness for B2B enterprise contexts
  public analyzeSalesPitch(transcript: string, metrics: any): BusinessAnalysisResult {
    const words = transcript.toLowerCase();
    const wordCount = transcript.split(' ').length;
    
    // Advanced sales effectiveness analysis
    const valuePropositionClarity = this.calculateValuePropClarity(words);
    const painPointTargeting = this.calculatePainPointEffectiveness(words);
    const objectionHandling = this.calculateObjectionHandling(words);
    const closingStrength = this.calculateClosingEffectiveness(words, wordCount);
    const credibilityFactors = this.calculateCredibilityFactors(words);
    
    // Executive presence assessment
    const authorityLevel = this.calculateAuthorityLevel(words, metrics);
    const stakeholderEngagement = this.calculateStakeholderAwareness(words);
    const industryExpertise = this.calculateIndustryExpertise(words);
    const leadershipCommunication = this.calculateLeadershipCommunication(words, metrics);
    
    const recommendations = this.generateSalesRecommendations({
      valuePropositionClarity,
      painPointTargeting,
      objectionHandling,
      closingStrength,
      credibilityFactors,
      authorityLevel,
      stakeholderEngagement,
      industryExpertise,
      transcript
    });
    
    return {
      salesEffectiveness: {
        valuePropositionClarity,
        painPointTargeting,
        objectionHandling,
        closingStrength,
        credibilityFactors
      },
      businessPitchQuality: {
        marketAnalysis: 0, // Not applicable for sales pitch
        businessModelClarity: 0,
        competitiveAdvantage: this.calculateCompetitiveDifferentiation(words),
        financialCredibility: this.calculateROIPresentation(words),
        investmentReadiness: 0
      },
      executivePresence: {
        authorityLevel,
        stakeholderEngagement,
        industryExpertise,
        leadershipCommunication
      },
      recommendations
    };
  }
  
  // Analyze business pitch for investor/stakeholder presentations
  public analyzeBusinessPitch(transcript: string, metrics: any): BusinessAnalysisResult {
    const words = transcript.toLowerCase();
    const wordCount = transcript.split(' ').length;
    
    // Business pitch specific analysis
    const marketAnalysis = this.calculateMarketAnalysisQuality(words);
    const businessModelClarity = this.calculateBusinessModelClarity(words);
    const competitiveAdvantage = this.calculateCompetitiveAdvantage(words);
    const financialCredibility = this.calculateFinancialCredibility(words);
    const investmentReadiness = this.calculateInvestmentReadiness(words);
    
    // Executive presence for business context
    const authorityLevel = this.calculateAuthorityLevel(words, metrics);
    const stakeholderEngagement = this.calculateInvestorEngagement(words);
    const industryExpertise = this.calculateIndustryExpertise(words);
    const leadershipCommunication = this.calculateLeadershipCommunication(words, metrics);
    
    const recommendations = this.generateBusinessPitchRecommendations({
      marketAnalysis,
      businessModelClarity,
      competitiveAdvantage,
      financialCredibility,
      investmentReadiness,
      authorityLevel,
      transcript
    });
    
    return {
      salesEffectiveness: {
        valuePropositionClarity: this.calculateValuePropClarity(words),
        painPointTargeting: this.calculateMarketPainPoints(words),
        objectionHandling: this.calculateRiskMitigation(words),
        closingStrength: this.calculateInvestmentAsk(words),
        credibilityFactors: this.calculateTeamCredibility(words)
      },
      businessPitchQuality: {
        marketAnalysis,
        businessModelClarity,
        competitiveAdvantage,
        financialCredibility,
        investmentReadiness
      },
      executivePresence: {
        authorityLevel,
        stakeholderEngagement,
        industryExpertise,
        leadershipCommunication
      },
      recommendations
    };
  }
  
  // Sales pitch analysis methods
  private calculateValuePropClarity(words: string): number {
    const roiKeywords = ['roi', 'return on investment', 'save', 'cost reduction', 'revenue', 'profit', 'efficiency', 'productivity'];
    const benefitKeywords = ['benefit', 'advantage', 'value', 'improvement', 'solution', 'results', 'outcomes'];
    const quantificationKeywords = ['percent', '%', 'times', 'fold', 'million', 'thousand', 'hours', 'days'];
    
    let score = 40; // Base score
    
    // Check for ROI articulation
    const roiMentions = roiKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(roiMentions * 8, 25);
    
    // Check for benefit articulation
    const benefitMentions = benefitKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(benefitMentions * 5, 20);
    
    // Check for quantification
    const quantMentions = quantificationKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(quantMentions * 7, 15);
    
    return Math.min(score, 100);
  }
  
  private calculatePainPointEffectiveness(words: string): number {
    const painKeywords = ['problem', 'challenge', 'issue', 'difficulty', 'struggle', 'pain', 'frustration', 'inefficiency'];
    const specificityKeywords = ['specifically', 'exactly', 'precisely', 'particular', 'unique', 'industry', 'sector'];
    const urgencyKeywords = ['urgent', 'critical', 'immediate', 'now', 'quickly', 'deadline', 'pressure'];
    
    let score = 30;
    
    const painMentions = painKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(painMentions * 10, 30);
    
    const specificityMentions = specificityKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(specificityMentions * 8, 25);
    
    const urgencyMentions = urgencyKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(urgencyMentions * 9, 15);
    
    return Math.min(score, 100);
  }
  
  private calculateObjectionHandling(words: string): number {
    const objectionKeywords = ['concern', 'worry', 'risk', 'doubt', 'hesitation', 'budget', 'cost', 'price', 'competition'];
    const responseKeywords = ['however', 'actually', 'fact', 'proven', 'guarantee', 'ensure', 'studies show', 'research'];
    const proofKeywords = ['case study', 'testimonial', 'reference', 'example', 'evidence', 'data', 'metrics'];
    
    let score = 25;
    
    const objectionMentions = objectionKeywords.filter(keyword => words.includes(keyword)).length;
    if (objectionMentions > 0) {
      score += 20; // Bonus for acknowledging objections
    }
    
    const responseMentions = responseKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(responseMentions * 8, 30);
    
    const proofMentions = proofKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(proofMentions * 10, 25);
    
    return Math.min(score, 100);
  }
  
  private calculateClosingEffectiveness(words: string, wordCount: number): number {
    const closingKeywords = ['next step', 'schedule', 'meeting', 'demo', 'trial', 'proposal', 'contract', 'sign', 'commit'];
    const urgencyKeywords = ['today', 'this week', 'limited time', 'deadline', 'expires', 'act now'];
    const specificityKeywords = ['15 minutes', '30 minutes', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    let score = 20;
    
    // Must be in latter part of presentation
    const lastThird = words.substring(Math.floor(words.length * 0.66));
    
    const closingMentions = closingKeywords.filter(keyword => lastThird.includes(keyword)).length;
    score += Math.min(closingMentions * 15, 40);
    
    const urgencyMentions = urgencyKeywords.filter(keyword => lastThird.includes(keyword)).length;
    score += Math.min(urgencyMentions * 12, 25);
    
    const specificityMentions = specificityKeywords.filter(keyword => lastThird.includes(keyword)).length;
    score += Math.min(specificityMentions * 10, 15);
    
    return Math.min(score, 100);
  }
  
  // Business pitch analysis methods
  private calculateMarketAnalysisQuality(words: string): number {
    const marketKeywords = ['market', 'industry', 'sector', 'tam', 'sam', 'addressable market', 'billion', 'million'];
    const growthKeywords = ['growth', 'growing', 'expanding', 'increasing', 'trends', 'forecast', 'projection'];
    const dataKeywords = ['research', 'study', 'report', 'analysis', 'data', 'statistics', 'survey'];
    
    let score = 25;
    
    const marketMentions = marketKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(marketMentions * 10, 35);
    
    const growthMentions = growthKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(growthMentions * 8, 25);
    
    const dataMentions = dataKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(dataMentions * 7, 15);
    
    return Math.min(score, 100);
  }
  
  private calculateBusinessModelClarity(words: string): number {
    const modelKeywords = ['revenue', 'model', 'subscription', 'pricing', 'customers', 'users', 'recurring'];
    const metricsKeywords = ['margin', 'ltv', 'cac', 'arpu', 'churn', 'retention', 'unit economics'];
    const scalabilityKeywords = ['scale', 'scalable', 'growth', 'expand', 'international', 'platform'];
    
    let score = 30;
    
    const modelMentions = modelKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(modelMentions * 8, 30);
    
    const metricsMentions = metricsKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(metricsMentions * 12, 25);
    
    const scalabilityMentions = scalabilityKeywords.filter(keyword => words.includes(keyword)).length;
    score += Math.min(scalabilityMentions * 9, 15);
    
    return Math.min(score, 100);
  }
  
  // Helper methods for other calculations
  private calculateCredibilityFactors(words: string): number {
    const credibilityKeywords = ['proven', 'tested', 'validated', 'certified', 'award', 'recognized', 'leader'];
    return Math.min(40 + credibilityKeywords.filter(k => words.includes(k)).length * 10, 100);
  }
  
  private calculateAuthorityLevel(words: string, metrics: any): number {
    const confidenceScore = metrics?.emotion?.confidence || 70;
    const authorityKeywords = ['experience', 'expert', 'years', 'proven', 'successful', 'led', 'managed'];
    const keywordScore = Math.min(authorityKeywords.filter(k => words.includes(k)).length * 8, 40);
    return Math.min(confidenceScore + keywordScore, 100);
  }
  
  private calculateStakeholderAwareness(words: string): number {
    const stakeholderKeywords = ['decision maker', 'cfo', 'ceo', 'board', 'stakeholder', 'approval', 'budget'];
    return Math.min(30 + stakeholderKeywords.filter(k => words.includes(k)).length * 12, 100);
  }
  
  private calculateIndustryExpertise(words: string): number {
    const expertiseKeywords = ['industry', 'sector', 'domain', 'specialized', 'vertical', 'niche', 'expertise'];
    return Math.min(35 + expertiseKeywords.filter(k => words.includes(k)).length * 10, 100);
  }
  
  private calculateLeadershipCommunication(words: string, metrics: any): number {
    const leadershipKeywords = ['vision', 'strategy', 'future', 'transform', 'innovate', 'lead', 'drive'];
    const presenceScore = metrics?.bodyLanguage?.postureScore || 70;
    const keywordScore = Math.min(leadershipKeywords.filter(k => words.includes(k)).length * 8, 30);
    return Math.min(presenceScore + keywordScore, 100);
  }
  
  // Additional business pitch methods (implement similar pattern for other calculations)
  private calculateCompetitiveAdvantage(words: string): number {
    const competitiveKeywords = ['unique', 'differentiated', 'competitive', 'advantage', 'moat', 'barrier', 'proprietary'];
    return Math.min(30 + competitiveKeywords.filter(k => words.includes(k)).length * 10, 100);
  }
  
  private calculateCompetitiveDifferentiation(words: string): number {
    return this.calculateCompetitiveAdvantage(words);
  }
  
  private calculateROIPresentation(words: string): number {
    const roiKeywords = ['roi', 'return', 'investment', 'payback', 'savings', 'revenue', 'profit'];
    return Math.min(25 + roiKeywords.filter(k => words.includes(k)).length * 12, 100);
  }
  
  // Placeholder methods for business pitch analysis
  private calculateFinancialCredibility(words: string): number {
    const financialKeywords = ['revenue', 'profit', 'margin', 'forecast', 'projection', 'financial', 'model'];
    return Math.min(35 + financialKeywords.filter(k => words.includes(k)).length * 9, 100);
  }
  
  private calculateInvestmentReadiness(words: string): number {
    const investmentKeywords = ['funding', 'investment', 'capital', 'round', 'series', 'valuation', 'exit'];
    return Math.min(30 + investmentKeywords.filter(k => words.includes(k)).length * 11, 100);
  }
  
  private calculateInvestorEngagement(words: string): number {
    const engagementKeywords = ['investor', 'partner', 'funding', 'equity', 'return', 'upside', 'opportunity'];
    return Math.min(40 + engagementKeywords.filter(k => words.includes(k)).length * 9, 100);
  }
  
  private calculateMarketPainPoints(words: string): number {
    return this.calculatePainPointEffectiveness(words);
  }
  
  private calculateRiskMitigation(words: string): number {
    const riskKeywords = ['risk', 'mitigation', 'backup', 'alternative', 'contingency', 'plan b'];
    return Math.min(25 + riskKeywords.filter(k => words.includes(k)).length * 12, 100);
  }
  
  private calculateInvestmentAsk(words: string): number {
    const askKeywords = ['seeking', 'raise', 'funding', 'investment', 'capital', 'million', 'series'];
    return Math.min(20 + askKeywords.filter(k => words.includes(k)).length * 13, 100);
  }
  
  private calculateTeamCredibility(words: string): number {
    const teamKeywords = ['team', 'founder', 'ceo', 'cto', 'experience', 'background', 'expertise'];
    return Math.min(35 + teamKeywords.filter(k => words.includes(k)).length * 8, 100);
  }
  
  // Recommendation generators
  private generateSalesRecommendations(analysis: any): Array<any> {
    const recommendations = [];
    
    if (analysis.valuePropositionClarity < 70) {
      recommendations.push({
        category: 'revenue_impact',
        priority: 'critical',
        title: 'Strengthen Value Proposition with Quantified ROI',
        description: 'Articulate specific financial benefits with concrete numbers (e.g., "Save $100K annually" or "Increase revenue by 25%")',
        expectedImpact: 'Could improve deal closure rate by 35-50%'
      });
    }
    
    if (analysis.objectionHandling < 60) {
      recommendations.push({
        category: 'deal_closing',
        priority: 'high',
        title: 'Proactively Address Common Objections',
        description: 'Include responses to budget, timing, and competitive concerns with supporting evidence',
        expectedImpact: 'Reduces sales cycle length by 20-30%'
      });
    }
    
    if (analysis.closingStrength < 65) {
      recommendations.push({
        category: 'deal_closing',
        priority: 'critical',
        title: 'Develop Urgent, Specific Call-to-Action',
        description: 'End with time-bound next steps: "Let\'s schedule a 15-minute demo this Thursday to show the $X impact"',
        expectedImpact: 'Increases follow-up rate by 40-60%'
      });
    }
    
    if (analysis.authorityLevel < 75) {
      recommendations.push({
        category: 'executive_presence',
        priority: 'high',
        title: 'Enhance Executive Authority and Credibility',
        description: 'Reference specific industry experience, successful case studies, and domain expertise',
        expectedImpact: 'Improves stakeholder confidence and decision-making speed'
      });
    }
    
    return recommendations;
  }
  
  private generateBusinessPitchRecommendations(analysis: any): Array<any> {
    const recommendations = [];
    
    if (analysis.marketAnalysis < 70) {
      recommendations.push({
        category: 'funding_readiness',
        priority: 'critical',
        title: 'Quantify Market Opportunity with Credible Data',
        description: 'Include TAM/SAM analysis with growth rates and cite authoritative market research',
        expectedImpact: 'Essential for Series A+ funding consideration'
      });
    }
    
    if (analysis.businessModelClarity < 65) {
      recommendations.push({
        category: 'funding_readiness',
        priority: 'critical',
        title: 'Clarify Unit Economics and Revenue Model',
        description: 'Detail pricing strategy, customer acquisition costs, lifetime value, and path to profitability',
        expectedImpact: 'Required for institutional investor interest'
      });
    }
    
    if (analysis.competitiveAdvantage < 60) {
      recommendations.push({
        category: 'funding_readiness',
        priority: 'high',
        title: 'Articulate Defensible Competitive Moats',
        description: 'Explain proprietary technology, network effects, or barriers to entry that protect market position',
        expectedImpact: 'Critical for achieving premium valuations'
      });
    }
    
    if (analysis.authorityLevel < 80) {
      recommendations.push({
        category: 'executive_presence',
        priority: 'high',
        title: 'Establish Founder-Market Fit and Team Credibility',
        description: 'Highlight relevant industry experience, previous exits, and advisory board strength',
        expectedImpact: 'Significantly influences investor confidence and check size'
      });
    }
    
    return recommendations;
  }
}

export const salesBusinessAnalysisEngine = new SalesBusinessAnalysisEngine();