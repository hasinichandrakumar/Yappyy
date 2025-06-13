import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ContentAnalysisRequest {
  transcript: string;
  purpose: string;
  analysisType: 'strengths' | 'improvements';
}

export async function analyzeContent(req: Request, res: Response) {
  try {
    const { transcript, purpose, analysisType }: ContentAnalysisRequest = req.body;

    if (!transcript || transcript.trim().length < 10) {
      return res.json({
        [analysisType]: ["Session too short for meaningful content analysis"]
      });
    }

    const systemPrompt = `You are an expert public speaking coach analyzing a practice session transcript. 
    Provide specific, actionable feedback based on the actual content spoken.
    
    Session Purpose: ${purpose || 'General practice'}
    
    Analyze the following aspects:
    - Content structure and organization
    - Clarity of message and key points
    - Use of examples and supporting evidence
    - Alignment with stated purpose
    - Logical flow and transitions
    - Audience engagement techniques
    
    Respond with exactly 3-4 specific points in JSON format.`;

    let userPrompt = '';
    if (analysisType === 'strengths') {
      userPrompt = `Analyze this transcript and identify specific STRENGTHS in the content and delivery:

"${transcript}"

Return JSON format: { "strengths": ["strength 1", "strength 2", "strength 3"] }

Focus on what the speaker did well - specific techniques, good examples, clear explanations, strong openings/closings, effective transitions, etc.`;
    } else {
      userPrompt = `Analyze this transcript and identify specific IMPROVEMENTS for the content and delivery:

"${transcript}"

Return JSON format: { "improvements": ["improvement 1", "improvement 2", "improvement 3"] }

Focus on specific, actionable suggestions - add examples, improve structure, clarify points, strengthen conclusions, etc.`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.7
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    res.json(analysis);

  } catch (error: any) {
    console.error('Content analysis error:', error);
    
    // Provide fallback analysis based on transcript content
    const words = req.body.transcript?.split(' ').filter((w: string) => w.trim().length > 0) || [];
    const fallback = req.body.analysisType === 'strengths' 
      ? { strengths: words.length > 50 ? ["Provided substantial content depth", "Maintained clear communication"] : ["Session completed successfully"] }
      : { improvements: words.length < 50 ? ["Develop ideas with more depth and examples"] : ["Continue practicing to refine delivery"] };
    
    res.json(fallback);
  }
}