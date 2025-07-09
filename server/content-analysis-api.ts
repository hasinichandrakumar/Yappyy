// Content Analysis API - Advanced AI-Powered Speech Content Analysis
import { Request, Response } from 'express';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ContentAnalysisRequest {
  transcript: string;
  speechPurpose: {
    type: string;
    description: string;
    audience: string;
    objectives: string[];
    keyElements: string[];
  };
  sessionDuration: number;
  sessionId: string;
}

interface ContentAnalysisResponse {
  success: boolean;
  analysis: {
    overallScore: number;
    structureScore: number;
    persuasivenessScore: number;
    coherenceScore: number;
    audienceAlignmentScore: number;
    purposeAlignment: number;
    keyInsights: string[];
    improvementAreas: string[];
    strengths: string[];
    specificFeedback: Array<{
      category: string;
      severity: string;
      feedback: string;
      suggestion: string;
      confidence: number;
    }>;
    recommendations: string[];
  };
  processingTime: number;
  error?: string;
}

export async function processContentAnalysis(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  
  try {
    const { transcript, speechPurpose, sessionDuration, sessionId }: ContentAnalysisRequest = req.body;
    
    if (!transcript || transcript.trim().length < 10) {
      res.status(400).json({
        success: false,
        error: 'Transcript is required and must be at least 10 characters long'
      });
      return;
    }

    if (!speechPurpose) {
      res.status(400).json({
        success: false,
        error: 'Speech purpose is required'
      });
      return;
    }

    // Perform advanced content analysis using both OpenAI and Anthropic
    const [openaiAnalysis, anthropicAnalysis] = await Promise.all([
      analyzeWithOpenAI(transcript, speechPurpose),
      analyzeWithAnthropic(transcript, speechPurpose)
    ]);

    // Combine and synthesize results
    const synthesizedAnalysis = synthesizeAnalysis(openaiAnalysis, anthropicAnalysis, speechPurpose);

    const processingTime = Date.now() - startTime;

    const response: ContentAnalysisResponse = {
      success: true,
      analysis: synthesizedAnalysis,
      processingTime
    };

    res.json(response);

  } catch (error) {
    console.error('Content analysis error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error during content analysis',
      processingTime: Date.now() - startTime
    });
  }
}

async function analyzeWithOpenAI(transcript: string, speechPurpose: any) {
  const prompt = `
    Analyze the following speech transcript for a ${speechPurpose.type} targeting ${speechPurpose.audience}.
    
    Transcript: "${transcript}"
    
    Speech Purpose: ${speechPurpose.description}
    Key Elements Expected: ${speechPurpose.keyElements.join(', ')}
    Objectives: ${speechPurpose.objectives.join(', ')}
    
    Please provide a comprehensive analysis in JSON format with the following structure:
    {
      "structureScore": number (0-100),
      "persuasivenessScore": number (0-100),
      "coherenceScore": number (0-100),
      "audienceAlignmentScore": number (0-100),
      "purposeAlignment": number (0-100),
      "keyInsights": ["insight1", "insight2", ...],
      "improvementAreas": ["area1", "area2", ...],
      "strengths": ["strength1", "strength2", ...],
      "recommendations": ["rec1", "rec2", ...]
    }
    
    Focus on:
    1. Speech structure (introduction, body, conclusion)
    2. Persuasive elements and rhetoric
    3. Coherence and flow
    4. Audience engagement and alignment
    5. Purpose-specific effectiveness
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function analyzeWithAnthropic(transcript: string, speechPurpose: any) {
  const prompt = `
    Please analyze this speech transcript for content quality and effectiveness.
    
    Speech Type: ${speechPurpose.type}
    Target Audience: ${speechPurpose.audience}
    Expected Elements: ${speechPurpose.keyElements.join(', ')}
    
    Transcript: "${transcript}"
    
    Provide detailed analysis focusing on:
    1. Content structure and organization
    2. Persuasive techniques and effectiveness
    3. Clarity and coherence
    4. Audience connection and engagement
    5. Purpose alignment and achievement
    
    Return analysis as JSON with specific scores (0-100) and detailed feedback.
  `;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  // Extract JSON from Anthropic response
  const content = response.content[0].text;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error parsing Anthropic JSON:', error);
      return {};
    }
  }
  
  return {};
}

function synthesizeAnalysis(openaiResult: any, anthropicResult: any, speechPurpose: any) {
  // Combine and average scores from both AI models
  const averageScore = (openaiScore: number, anthropicScore: number) => {
    return Math.round((openaiScore + anthropicScore) / 2);
  };

  const synthesized = {
    structureScore: averageScore(
      openaiResult.structureScore || 0,
      anthropicResult.structureScore || 0
    ),
    persuasivenessScore: averageScore(
      openaiResult.persuasivenessScore || 0,
      anthropicResult.persuasivenessScore || 0
    ),
    coherenceScore: averageScore(
      openaiResult.coherenceScore || 0,
      anthropicResult.coherenceScore || 0
    ),
    audienceAlignmentScore: averageScore(
      openaiResult.audienceAlignmentScore || 0,
      anthropicResult.audienceAlignmentScore || 0
    ),
    purposeAlignment: averageScore(
      openaiResult.purposeAlignment || 0,
      anthropicResult.purposeAlignment || 0
    ),
    keyInsights: [
      ...(openaiResult.keyInsights || []),
      ...(anthropicResult.keyInsights || [])
    ].slice(0, 5), // Top 5 insights
    improvementAreas: [
      ...(openaiResult.improvementAreas || []),
      ...(anthropicResult.improvementAreas || [])
    ].slice(0, 4), // Top 4 improvement areas
    strengths: [
      ...(openaiResult.strengths || []),
      ...(anthropicResult.strengths || [])
    ].slice(0, 4), // Top 4 strengths
    recommendations: [
      ...(openaiResult.recommendations || []),
      ...(anthropicResult.recommendations || [])
    ].slice(0, 5), // Top 5 recommendations
    specificFeedback: generateSpecificFeedback(openaiResult, anthropicResult, speechPurpose)
  };

  // Calculate overall score
  const overallScore = Math.round(
    (synthesized.structureScore * 0.25) +
    (synthesized.persuasivenessScore * 0.25) +
    (synthesized.coherenceScore * 0.2) +
    (synthesized.audienceAlignmentScore * 0.15) +
    (synthesized.purposeAlignment * 0.15)
  );

  return {
    overallScore,
    ...synthesized
  };
}

function generateSpecificFeedback(openaiResult: any, anthropicResult: any, speechPurpose: any) {
  const feedback = [];

  // Structure feedback
  const structureScore = Math.round((openaiResult.structureScore + anthropicResult.structureScore) / 2);
  if (structureScore < 60) {
    feedback.push({
      category: 'structure',
      severity: 'warning',
      feedback: 'Speech structure needs improvement',
      suggestion: 'Focus on clear introduction, body, and conclusion',
      confidence: 0.8
    });
  } else if (structureScore >= 80) {
    feedback.push({
      category: 'structure',
      severity: 'excellent',
      feedback: 'Excellent speech structure',
      suggestion: 'Maintain this clear organizational pattern',
      confidence: 0.9
    });
  }

  // Persuasiveness feedback
  const persuasivenessScore = Math.round((openaiResult.persuasivenessScore + anthropicResult.persuasivenessScore) / 2);
  if (persuasivenessScore < 50) {
    feedback.push({
      category: 'persuasiveness',
      severity: 'warning',
      feedback: 'Limited persuasive impact',
      suggestion: 'Include more compelling arguments and evidence',
      confidence: 0.7
    });
  }

  // Purpose alignment feedback
  const purposeScore = Math.round((openaiResult.purposeAlignment + anthropicResult.purposeAlignment) / 2);
  if (purposeScore >= 80) {
    feedback.push({
      category: 'purpose',
      severity: 'excellent',
      feedback: `Excellent alignment with ${speechPurpose.type} objectives`,
      suggestion: 'Continue focusing on your defined purpose',
      confidence: 0.9
    });
  }

  return feedback;
}