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

// Fast session insights with minimal processing
export async function generateFastSessionInsights(req: Request, res: Response) {
  try {
    const sessionData = req.body.sessionData || req.body;
    
    // Quick analysis without heavy AI processing
    const quickInsights = {
      success: true,
      analysis: {
        strengths: generateQuickStrengths(sessionData),
        improvements: generateQuickImprovements(sessionData),
        insights: generateQuickInsights(sessionData)
      },
      overallAssessment: generateQuickAssessment(sessionData),
      progressSummary: generateQuickProgress(sessionData)
    };
    
    res.json(quickInsights);
  } catch (error) {
    console.error('Error generating fast insights:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate insights' 
    });
  }
}

function generateQuickStrengths(sessionData: any): string[] {
  const strengths = [];
  
  if (sessionData.overallPerformance > 70) strengths.push("Strong overall performance");
  if (sessionData.clarityScore > 75) strengths.push("Clear and articulate speech");
  if (sessionData.eyeContactScore > 70) strengths.push("Good eye contact engagement");
  if (sessionData.confidenceLevel > 75) strengths.push("Confident delivery");
  if (sessionData.fillerWordCount < 5) strengths.push("Minimal filler word usage");
  if (sessionData.wordsPerMinute >= 120 && sessionData.wordsPerMinute <= 180) strengths.push("Optimal speaking pace");
  
  return strengths.length > 0 ? strengths : ["Completed practice session successfully"];
}

function generateQuickImprovements(sessionData: any): string[] {
  const improvements = [];
  
  if (sessionData.clarityScore < 60) improvements.push("Focus on clearer articulation");
  if (sessionData.eyeContactScore < 50) improvements.push("Improve eye contact with audience");
  if (sessionData.confidenceLevel < 60) improvements.push("Build confidence through more practice");
  if (sessionData.fillerWordCount > 10) improvements.push("Reduce filler words (um, uh, like)");
  if (sessionData.wordsPerMinute < 120) improvements.push("Increase speaking pace slightly");
  if (sessionData.wordsPerMinute > 200) improvements.push("Slow down speaking pace");
  
  return improvements.length > 0 ? improvements : ["Continue practicing regularly"];
}

function generateQuickInsights(sessionData: any): string[] {
  const insights = [];
  
  if (sessionData.duration > 300) insights.push("Good session length for skill development");
  if (sessionData.transcript && sessionData.transcript.length > 500) insights.push("Substantial content coverage");
  if (sessionData.purpose === 'job-interview') insights.push("Interview preparation showing progress");
  if (sessionData.purpose === 'sales-presentation') insights.push("Sales skills developing well");
  
  return insights.length > 0 ? insights : ["Session data recorded for progress tracking"];
}

function generateQuickAssessment(sessionData: any): string {
  const score = sessionData.overallPerformance || 0;
  if (score > 80) return "Excellent session with strong performance across multiple areas.";
  if (score > 60) return "Good session with solid progress. Continue building on these foundations."; 
  return "Practice session completed. Focus on consistent improvement.";
}

function generateQuickProgress(sessionData: any): string {
  return `Session completed in ${Math.round(sessionData.duration / 60)} minutes with meaningful practice time.`;
}

export async function generateSessionInsights(req: Request, res: Response) {
  try {
    const { sessionId, userId, analysisType = 'single' } = req.body;
    
    // Import storage to get session data
    const { storage } = await import('./storage');
    
    let sessions;
    if (analysisType === 'all' || !sessionId) {
      sessions = await storage.getUserPracticeSessions(userId);
    } else {
      const singleSession = await storage.getPracticeSession(parseInt(sessionId));
      sessions = singleSession ? [singleSession] : [];
    }

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No sessions found' });
    }

    const analysisPrompt = `
    You are an expert AI speech coach. Analyze the following practice session(s) and provide comprehensive insights.

    Sessions Data:
    ${sessions.map((session: any, index: number) => `
    Session ${index + 1}:
    - Name: ${session.name || 'Untitled Session'}
    - Purpose: ${session.purpose || 'General Practice'}
    - Date: ${new Date(session.createdAt).toLocaleDateString()}
    - Duration: ${session.duration || 0} seconds
    - Volume Score: ${session.volumeScore || 0}/100
    - Clarity Score: ${session.clarityScore || 0}/100
    - Pace Score: ${session.paceScore || 0}/100
    - Filler Words: ${session.fillerWordCount || 0}
    - Words Spoken: ${session.wordCount || 0}
    - Transcript: ${session.transcript || 'No transcript available'}
    `).join('\n')}

    Analysis Type: ${analysisType === 'all' ? 'Multi-session trend analysis' : 'Single session deep dive'}

    Provide comprehensive insights in this JSON structure:
    {
      "overallScore": 85,
      "voiceAnalysis": {
        "score": 88,
        "strengths": ["Clear articulation", "Good pace control"],
        "improvements": ["Reduce filler words", "Improve volume consistency"],
        "insights": "Detailed paragraph about voice quality, pace, clarity trends"
      },
      "contentAnalysis": {
        "score": 82,
        "strengths": ["Well-structured", "Engaging examples"],
        "improvements": ["Stronger conclusions", "Better transitions"],
        "insights": "Detailed paragraph about content structure and effectiveness"
      },
      "bodyLanguageAnalysis": {
        "score": 78,
        "strengths": ["Good posture", "Natural gestures"],
        "improvements": ["More eye contact", "Confident stance"],
        "insights": "Detailed paragraph about presence and non-verbal communication"
      },
      "trends": {
        "improving": ["voice clarity", "pace control"],
        "declining": [],
        "stable": ["content structure"]
      },
      "recommendations": [
        {
          "priority": "high",
          "area": "voice",
          "title": "Reduce Filler Words",
          "description": "Practice pausing instead of using 'um' and 'uh'. Try the 3-second pause technique."
        }
      ],
      "progressSummary": "Overall progress summary with encouraging insights based on actual session data"
    }

    Be specific, actionable, and focus on patterns observed in the actual session data.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert AI speech coach providing detailed analysis and insights." },
        { role: "user", content: analysisPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    res.json({
      success: true,
      analysis,
      sessionCount: sessions.length,
      analysisType
    });

  } catch (error) {
    console.error('Error generating session insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function generateComprehensiveAnalysis(req: Request, res: Response) {
  try {
    const sessionData: SessionData = req.body;

    const analysisPrompt = `
    You are an expert speech coach analyzing a practice session. Provide comprehensive analysis in JSON format.

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
      "bodyLanguage": "Detailed paragraph about body language observations",
      "content": "Detailed paragraph about content structure and effectiveness",
      "voice": "Detailed paragraph about voice quality and delivery",
      "overall": "Overall assessment focusing on session purpose achievement",
      "purposeAlignment": 85,
      "improvements": ["specific improvement 1", "improvement 2"],
      "strengths": ["specific strength 1", "strength 2"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert speech coach." },
        { role: "user", content: analysisPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    res.json(analysis);

  } catch (error) {
    console.error('Error generating analysis:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
}

export async function generateSpeechPersona(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    const { storage } = await import('./storage');
    
    const sessions = await storage.getUserPracticeSessions(userId);

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No sessions found' });
    }

    const personaPrompt = `
    Based on practice sessions, create a personalized speech persona for this user:

    Sessions Data:
    ${sessions.map((session: any, index: number) => `
    Session ${index + 1}: ${session.name || 'Untitled'} - ${new Date(session.createdAt).toLocaleDateString()}
    Purpose: ${session.purpose || 'General Practice'}
    Duration: ${session.duration || 0}s
    Scores - Volume: ${session.volumeScore || 0}, Clarity: ${session.clarityScore || 0}, Pace: ${session.paceScore || 0}
    `).join('\n')}

    Create a speech persona in this JSON format:
    {
      "speakerType": "The Confident Presenter",
      "strengths": ["Natural storyteller", "Clear articulation"],
      "challenges": ["Pacing consistency", "Volume control"],
      "communicationStyle": "Detailed description of their unique speaking style",
      "recommendations": ["Personalized tip 1", "Personalized tip 2"],
      "confidenceLevel": 78,
      "personalityTraits": ["Enthusiastic", "Detail-oriented"]
    }

    Make it personal, encouraging, and based on actual session patterns.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a speech coach creating personalized profiles." },
        { role: "user", content: personaPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const persona = JSON.parse(response.choices[0].message.content || '{}');
    res.json(persona);

  } catch (error) {
    console.error('Error generating speech persona:', error);
    res.status(500).json({ error: 'Failed to generate speech persona' });
  }
}

export async function generateCoachingInsights(req: Request, res: Response) {
  try {
    const { userId, sessionId } = req.body;
    const { storage } = await import('./storage');
    
    let sessions;
    if (sessionId) {
      const session = await storage.getPracticeSession(parseInt(sessionId));
      sessions = session ? [session] : [];
    } else {
      sessions = await storage.getUserPracticeSessions(userId);
    }

    const insightsPrompt = `
    Generate coaching insights based on these practice sessions:

    ${sessions.map((session: any) => `
    Session: ${session.name || 'Untitled'} (${new Date(session.createdAt).toLocaleDateString()})
    Purpose: ${session.purpose || 'General Practice'}
    Transcript: ${session.transcript || 'No transcript'}
    Metrics: Volume ${session.volumeScore || 0}, Clarity ${session.clarityScore || 0}, Pace ${session.paceScore || 0}
    `).join('\n')}

    Provide insights in JSON format:
    {
      "insights": [
        {
          "category": "voice_control",
          "title": "Voice Control Analysis",
          "description": "Specific insights about voice patterns",
          "recommendations": ["Actionable tip 1", "Actionable tip 2"]
        }
      ],
      "overallFeedback": "Comprehensive feedback paragraph",
      "nextSteps": ["Next step 1", "Next step 2"]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI speech coach providing actionable insights." },
        { role: "user", content: insightsPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const insights = JSON.parse(response.choices[0].message.content || '{}');
    res.json(insights);

  } catch (error) {
    console.error('Error generating coaching insights:', error);
    res.status(500).json({ error: 'Failed to generate coaching insights' });
  }
}

export async function generateLiveFeedback(req: Request, res: Response) {
  try {
    const { metrics, transcript, timestamp } = req.body;

    const feedbackPrompt = `
    Provide real-time coaching feedback:
    
    Current metrics:
    - Volume: ${metrics.volume}%
    - Clarity: ${metrics.clarity}%
    - Pace: ${metrics.pace} WPM
    - Recent transcript: "${transcript}"
    
    Give specific, immediate feedback in JSON:
    {
      "feedback": "Specific feedback message",
      "type": "encouragement|correction|tip",
      "priority": "high|medium|low"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a real-time speech coach." },
        { role: "user", content: feedbackPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const feedback = JSON.parse(response.choices[0].message.content || '{}');
    res.json({ ...feedback, timestamp });

  } catch (error) {
    console.error('Error generating live feedback:', error);
    res.status(500).json({ error: 'Failed to generate live feedback' });
  }
}

export async function personalizeTemplate(req: Request, res: Response) {
  try {
    const { templateContent, userContext, personalizationRequest } = req.body;

    const personalizationPrompt = `
    Personalize this speech template:
    
    Original Template: ${templateContent}
    User Context: ${userContext}
    Personalization Request: ${personalizationRequest}
    
    Provide the personalized template in JSON:
    {
      "personalizedContent": "Fully personalized template content",
      "changes": ["Change 1", "Change 2"],
      "explanation": "Brief explanation of personalization approach"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a speech writing assistant." },
        { role: "user", content: personalizationPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    res.json(result);

  } catch (error) {
    console.error('Error personalizing template:', error);
    res.status(500).json({ error: 'Failed to personalize template' });
  }
}