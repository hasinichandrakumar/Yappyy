import { OpenAI } from 'openai';
import { SpeechPurpose } from '../types/analysis';

interface ContentAnalysisResult {
  overallScore: number;
  purposeAlignment: {
    score: number;
    feedback: string[];
  };
  audienceEngagement: {
    score: number;
    feedback: string[];
  };
  contentStructure: {
    score: number;
    feedback: string[];
  };
  persuasiveness: {
    score: number;
    feedback: string[];
  };
  insights: Array<{
    category: string;
    message: string;
    suggestion?: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  strengths: Array<{
    category: string;
    message: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  improvements: Array<{
    category: string;
    message: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  purposeSpecificFeedback: Array<{
    title: string;
    description: string;
  }>;
}

export class EnhancedContentAnalyzer {
  private openai: OpenAI;
  private purposeTemplates: Map<string, any>;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.initializePurposeTemplates();
  }

  private initializePurposeTemplates() {
    this.purposeTemplates = new Map([
      ['sales-pitch', {
        keyElements: ['value proposition', 'market opportunity', 'competitive advantage', 'call to action'],
        objectives: ['persuade investors', 'demonstrate potential', 'establish credibility'],
        evaluationCriteria: ['clarity of business model', 'market understanding', 'financial projections']
      }],
      ['technical-presentation', {
        keyElements: ['problem statement', 'methodology', 'results', 'implications'],
        objectives: ['explain complex concepts', 'demonstrate expertise', 'present findings'],
        evaluationCriteria: ['technical accuracy', 'clarity of explanation', 'data presentation']
      }],
      ['motivational-speech', {
        keyElements: ['personal story', 'emotional connection', 'inspiring message', 'call to action'],
        objectives: ['inspire audience', 'create emotional impact', 'drive action'],
        evaluationCriteria: ['emotional resonance', 'authenticity', 'audience engagement']
      }]
    ]);
  }

  public async analyzeContent(
    transcript: string,
    purpose: string,
    sessionDuration: number
  ): Promise<ContentAnalysisResult> {
    try {
      // Get purpose-specific criteria
      const purposeTemplate = this.purposeTemplates.get(purpose) || this.getDefaultTemplate();

      // Generate analysis prompt
      const analysisPrompt = this.generateAnalysisPrompt(
        transcript,
        purpose,
        purposeTemplate,
        sessionDuration
      );

      // Get AI analysis
      const analysis = await this.getAIAnalysis(analysisPrompt);

      // Process and structure the analysis
      return this.processAnalysis(analysis, purpose, purposeTemplate);

    } catch (error) {
      console.error('Content analysis error:', error);
      throw error;
    }
  }

  private getDefaultTemplate() {
    return {
      keyElements: ['clear structure', 'engaging content', 'effective delivery'],
      objectives: ['inform audience', 'maintain engagement', 'deliver message clearly'],
      evaluationCriteria: ['clarity', 'engagement', 'effectiveness']
    };
  }

  private generateAnalysisPrompt(
    transcript: string,
    purpose: string,
    template: any,
    duration: number
  ): string {
    return `
Analyze this speech transcript in the context of a ${purpose} presentation:

TRANSCRIPT:
${transcript}

CONTEXT:
- Purpose: ${purpose}
- Duration: ${duration} seconds
- Key Elements Expected: ${template.keyElements.join(', ')}
- Main Objectives: ${template.objectives.join(', ')}

Please provide a comprehensive analysis including:

1. Purpose Alignment
- How well does the content align with the intended purpose?
- Are key elements effectively incorporated?
- Score (0-100) and specific feedback

2. Audience Engagement
- How engaging is the content?
- Is it appropriate for the target audience?
- Score (0-100) and specific feedback

3. Content Structure
- How well is the content organized?
- Is there a clear flow of ideas?
- Score (0-100) and specific feedback

4. Persuasiveness
- How convincing are the arguments?
- Is evidence used effectively?
- Score (0-100) and specific feedback

5. Key Insights
- What are the most important observations?
- What patterns or techniques are notable?

6. Strengths
- What aspects are particularly effective?
- What should be maintained?

7. Areas for Improvement
- What could be enhanced?
- Specific suggestions for improvement

8. Purpose-Specific Analysis
- Analysis based on the specific purpose (${purpose})
- How well does it meet the objectives?

Format the response as a structured JSON object with scores and detailed feedback.
`;
  }

  private async getAIAnalysis(prompt: string) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert speech and content analyst. Provide detailed, actionable analysis with specific examples from the transcript."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private processAnalysis(
    aiResponse: any,
    purpose: string,
    template: any
  ): ContentAnalysisResult {
    // Calculate overall score
    const overallScore = Math.round(
      (aiResponse.purposeAlignment.score +
        aiResponse.audienceEngagement.score +
        aiResponse.contentStructure.score +
        aiResponse.persuasiveness.score) / 4
    );

    // Structure the response
    return {
      overallScore,
      purposeAlignment: {
        score: aiResponse.purposeAlignment.score,
        feedback: aiResponse.purposeAlignment.feedback
      },
      audienceEngagement: {
        score: aiResponse.audienceEngagement.score,
        feedback: aiResponse.audienceEngagement.feedback
      },
      contentStructure: {
        score: aiResponse.contentStructure.score,
        feedback: aiResponse.contentStructure.feedback
      },
      persuasiveness: {
        score: aiResponse.persuasiveness.score,
        feedback: aiResponse.persuasiveness.feedback
      },
      insights: this.processInsights(aiResponse.insights),
      strengths: this.processStrengths(aiResponse.strengths),
      improvements: this.processImprovements(aiResponse.improvements),
      purposeSpecificFeedback: this.processPurposeSpecificFeedback(
        aiResponse.purposeSpecificFeedback,
        purpose,
        template
      )
    };
  }

  private processInsights(insights: any[]): any[] {
    return insights.map(insight => ({
      category: insight.category,
      message: insight.message,
      suggestion: insight.suggestion,
      impact: this.determineImpact(insight.importance || 'medium')
    }));
  }

  private processStrengths(strengths: any[]): any[] {
    return strengths.map(strength => ({
      category: strength.category,
      message: strength.message,
      impact: this.determineImpact(strength.importance || 'medium')
    }));
  }

  private processImprovements(improvements: any[]): any[] {
    return improvements.map(improvement => ({
      category: improvement.category,
      message: improvement.message,
      suggestion: improvement.suggestion,
      impact: this.determineImpact(improvement.importance || 'medium')
    }));
  }

  private processPurposeSpecificFeedback(
    feedback: any[],
    purpose: string,
    template: any
  ): any[] {
    return feedback.map(item => ({
      title: item.title,
      description: item.description
    }));
  }

  private determineImpact(importance: string): 'high' | 'medium' | 'low' {
    const importanceMap: { [key: string]: 'high' | 'medium' | 'low' } = {
      critical: 'high',
      important: 'high',
      significant: 'high',
      moderate: 'medium',
      normal: 'medium',
      minor: 'low',
      suggestion: 'low'
    };

    return importanceMap[importance.toLowerCase()] || 'medium';
  }
}