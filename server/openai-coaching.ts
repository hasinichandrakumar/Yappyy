import OpenAI from 'openai';
import { Request, Response } from 'express';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SessionData {
  name: string;
  purpose: string;
  duration: number;
  metrics: {
    volume: number;
    clarity: number;
    pace: number;
    wordsSpoken: number;
    fillerWords: number;
  };
  liveFeedback: Array<{
    timestamp: number;
    type: string;
    feedback: string;
  }>;
}

export async function generateComprehensiveAnalysis(req: Request, res: Response) {
  try {
    const sessionData: SessionData = req.body;

    const analysisPrompt = `
    You are an expert speech coach analyzing a practice session. Provide a comprehensive analysis in JSON format.

    Session Details:
    - Name: ${sessionData.name}
    - Purpose: ${sessionData.purpose}
    - Duration: ${sessionData.duration} seconds
    - Volume: ${sessionData.metrics.volume}%
    - Clarity: ${sessionData.metrics.clarity}%
    - Pace: ${sessionData.metrics.pace} WPM
    - Words Spoken: ${sessionData.metrics.wordsSpoken}
    - Filler Words: ${sessionData.metrics.fillerWords}

    Live Feedback Given:
    ${sessionData.liveFeedback.map(f => `${f.timestamp}s: ${f.feedback}`).join('\n')}

    Provide analysis in this JSON structure:
    {
      "bodyLanguage": "Detailed paragraph about body language observations and improvements",
      "content": "Detailed paragraph about content structure, clarity, and effectiveness",
      "voice": "Detailed paragraph about voice quality, modulation, pace, and delivery",
      "overall": "Overall assessment focusing on how well the session achieved its stated purpose",
      "purposeAlignment": number (0-100),
      "improvements": ["specific actionable improvement 1", "improvement 2", "improvement 3"],
      "strengths": ["specific strength 1", "strength 2", "strength 3"]
    }

    Be specific, actionable, and focus on how the performance relates to the stated session purpose.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are an expert speech coach providing detailed, actionable feedback." },
        { role: "user", content: analysisPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content received');
    }
    
    const analysis = JSON.parse(content);
    res.json({ success: true, analysis });

  } catch (error) {
    console.error('Error generating comprehensive analysis:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
}

export async function generateSpeechPersona(req: Request, res: Response) {
  try {
    const { userId, sessions } = req.body;

    const personaPrompt = `
    Based on multiple practice sessions, create a personalized speech persona for this user.

    Session Data:
    ${sessions.map((s: any, i: number) => `
    Session ${i + 1}: ${s.name}
    Purpose: ${s.purpose}
    Metrics: Clarity ${s.metrics.clarity}%, Pace ${s.metrics.pace} WPM, Filler Words: ${s.metrics.fillerWords}
    `).join('\n')}

    Create a speech persona in JSON format:
    {
      "type": "persona_type_key",
      "title": "The [Persona Name]",
      "description": "2-3 sentence description of their speaking style and natural strengths",
      "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
      "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3", "characteristic 4"],
      "communicationStyle": "Detailed paragraph about their unique communication approach",
      "recommendations": ["personalized recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"],
      "avatar": "single emoji that represents their persona",
      "dnaInsights": [
        {
          "category": "Voice & Delivery",
          "trait": "trait name",
          "score": number (0-100),
          "description": "what this score means for them",
          "developmentTip": "specific tip for improvement"
        }
      ]
    }

    Make it personal, encouraging, and based on actual patterns from their sessions.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a speech coach creating personalized speaking personas based on performance data." },
        { role: "user", content: personaPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content received');
    }
    
    const persona = JSON.parse(content);
    res.json({ success: true, persona });

  } catch (error) {
    console.error('Error generating speech persona:', error);
    res.status(500).json({ error: 'Failed to generate persona' });
  }
}

export async function generateCoachingInsights(req: Request, res: Response) {
  try {
    const { userId, sessions } = req.body;

    const insightsPrompt = `
    As an AI speech coach, analyze this user's progress across multiple sessions and provide coaching insights.

    Sessions:
    ${sessions.map((s: any, i: number) => `
    Session ${i + 1}: ${s.name} (${s.date})
    Purpose: ${s.purpose}
    Duration: ${s.duration}s
    Metrics: Clarity ${s.metrics.clarity}%, Pace ${s.metrics.pace}WPM, Volume ${s.metrics.volume}%
    Filler Words: ${s.metrics.fillerWords}
    Purpose Alignment: ${s.purposeAlignment}%
    `).join('\n')}

    Provide coaching insights in JSON format:
    {
      "insights": [
        {
          "category": "purpose_alignment|skill_development|behavioral_patterns|progress_tracking",
          "title": "Insight title",
          "description": "Detailed observation about their progress or patterns",
          "recommendation": "Specific actionable recommendation",
          "priority": "high|medium|low",
          "sessionsAnalyzed": number
        }
      ],
      "progressTrends": [
        {
          "skill": "skill name",
          "trend": "improving|declining|stable",
          "change": number (percentage change),
          "sessions": number,
          "recommendation": "specific recommendation"
        }
      ]
    }

    Focus on genuine patterns, progress tracking, and actionable coaching advice.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert speech coach analyzing long-term progress and providing strategic guidance." },
        { role: "user", content: insightsPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content received');
    }
    
    const insights = JSON.parse(content);
    res.json({ success: true, insights });

  } catch (error) {
    console.error('Error generating coaching insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
}

export async function generateLiveFeedback(req: Request, res: Response) {
  try {
    const { sessionPurpose, currentMetrics, transcript, timestamp } = req.body;

    const feedbackPrompt = `
    Provide real-time coaching feedback for an ongoing speech practice session.

    Session Purpose: ${sessionPurpose}
    Current Time: ${timestamp} seconds
    Current Metrics:
    - Volume: ${currentMetrics.volume}%
    - Clarity: ${currentMetrics.clarity}%
    - Pace: ${currentMetrics.pace} WPM
    - Filler Words: ${currentMetrics.fillerWords}

    Recent Transcript: "${transcript}"

    Generate 1-2 pieces of live feedback in JSON format:
    {
      "feedback": [
        {
          "type": "content|voice|body_language|voice_modulation",
          "message": "Brief, actionable feedback (max 15 words)",
          "severity": "info|warning|success",
          "timestamp": ${timestamp}
        }
      ]
    }

    Focus on immediate, actionable advice related to their session purpose.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a real-time speech coach providing brief, actionable feedback during practice sessions." },
        { role: "user", content: feedbackPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content received');
    }
    
    const feedback = JSON.parse(content);
    res.json({ success: true, feedback: feedback.feedback });

  } catch (error) {
    console.error('Error generating live feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
}

export async function personalizeTemplate(req: Request, res: Response) {
  try {
    const { templateContent, userContext, personalizationRequest } = req.body;

    const personalizationPrompt = `
    Personalize this speech template based on the user's request.

    Original Template:
    ${templateContent}

    User Context: ${userContext}
    Personalization Request: ${personalizationRequest}

    Provide the personalized template in JSON format:
    {
      "personalizedContent": "The complete personalized template text",
      "changes": ["description of change 1", "description of change 2"],
      "suggestions": {
        "voice": "Voice modulation advice for this content",
        "body": "Body language suggestions",
        "structure": "Content structure recommendations"
      }
    }

    Make it natural, relevant, and maintain the original template's effectiveness.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a speech writing expert helping personalize presentation templates." },
        { role: "user", content: personalizationPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content received');
    }
    
    const personalization = JSON.parse(content);
    res.json({ success: true, ...personalization });

  } catch (error) {
    console.error('Error personalizing template:', error);
    res.status(500).json({ error: 'Failed to personalize template' });
  }
}