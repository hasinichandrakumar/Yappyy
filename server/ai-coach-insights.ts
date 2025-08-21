import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = 'gpt-4o';

export interface SessionData {
  sessionNumber: number;
  transcript: string;
  duration: number;
  averageWPM: number;
  fillerWords: number;
  confidenceScore: number;
  voiceClarity: number;
  eyeContactScore: string;
  pauseCount: number;
  createdAt: string;
  purpose?: string;
  name?: string;
}

export interface CoachingInsights {
  overallProgress: {
    trend: 'improving' | 'steady' | 'declining';
    summary: string;
    scoreImprovement: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  personalizedTips: string[];
  patterns: {
    speaking: string[];
    bodyLanguage: string[];
    content: string[];
  };
  nextSteps: string[];
  motivationalMessage: string;
}

export async function generateCoachingInsights(sessions: SessionData[]): Promise<CoachingInsights> {
  try {
    if (!sessions || sessions.length === 0) {
      return getDefaultInsights();
    }
    
    // Check if OpenAI API key is available and valid
    if (!process.env.OPENAI_API_KEY) {
      console.log('Using pattern-based analysis (no OpenAI API key)');
      return generatePatternBasedInsights(sessions);
    }

    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Calculate trends
    const recentSessions = sortedSessions.slice(-5);
    const olderSessions = sortedSessions.slice(0, Math.max(0, sortedSessions.length - 5));
    
    const recentAvgConfidence = calculateAverage(recentSessions.map(s => s.confidenceScore));
    const olderAvgConfidence = olderSessions.length > 0 
      ? calculateAverage(olderSessions.map(s => s.confidenceScore))
      : recentAvgConfidence;

    const recentAvgWPM = calculateAverage(recentSessions.map(s => s.averageWPM));
    const recentAvgFillers = calculateAverage(recentSessions.map(s => s.fillerWords));

    // Prepare session summary for AI
    const sessionSummary = sortedSessions.map(s => ({
      session: s.sessionNumber,
      wpm: s.averageWPM,
      fillers: s.fillerWords,
      confidence: Math.round(s.confidenceScore),
      clarity: Math.round(s.voiceClarity * 100),
      eyeContact: parseInt(s.eyeContactScore) || 0,
      duration: s.duration,
      purpose: s.purpose || 'general'
    }));

    const prompt = `You are an expert public speaking coach analyzing a student's practice sessions. 
    Analyze the following data from ${sessions.length} practice sessions and provide personalized coaching insights.

    Session Data:
    ${JSON.stringify(sessionSummary, null, 2)}

    Recent Trends:
    - Average confidence: ${Math.round(recentAvgConfidence)}% (was ${Math.round(olderAvgConfidence)}%)
    - Average WPM: ${Math.round(recentAvgWPM)}
    - Average filler words: ${Math.round(recentAvgFillers)}

    Provide coaching insights in JSON format with these fields:
    {
      "overallProgress": {
        "trend": "improving" | "steady" | "declining",
        "summary": "Brief summary of overall progress",
        "scoreImprovement": number (percentage change)
      },
      "strengths": ["3-4 specific strengths observed"],
      "areasForImprovement": ["3-4 specific areas to work on"],
      "personalizedTips": ["4-5 actionable tips based on their specific patterns"],
      "patterns": {
        "speaking": ["2-3 patterns noticed in speaking pace/clarity"],
        "bodyLanguage": ["2-3 patterns in eye contact/confidence"],
        "content": ["2-3 patterns in content delivery"]
      },
      "nextSteps": ["3-4 specific next steps for improvement"],
      "motivationalMessage": "Personalized encouragement based on their progress"
    }

    Be specific, actionable, and encouraging. Reference actual data points when possible.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert public speaking coach providing personalized insights based on practice session data. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500
    });

    const insights = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure all required fields exist
    return {
      overallProgress: insights.overallProgress || {
        trend: 'steady',
        summary: 'Keep practicing to see improvement',
        scoreImprovement: 0
      },
      strengths: insights.strengths || [],
      areasForImprovement: insights.areasForImprovement || [],
      personalizedTips: insights.personalizedTips || [],
      patterns: insights.patterns || {
        speaking: [],
        bodyLanguage: [],
        content: []
      },
      nextSteps: insights.nextSteps || [],
      motivationalMessage: insights.motivationalMessage || 'Keep up the great work!'
    };

  } catch (error: any) {
    console.error('Error generating AI coaching insights:', error.message || error);
    // Fallback to pattern-based analysis if API fails
    console.log('Falling back to pattern-based analysis');
    return generatePatternBasedInsights(sessions);
  }
}

export async function generateSessionComparison(currentSession: SessionData, allSessions: SessionData[]): Promise<string> {
  try {
    const otherSessions = allSessions.filter(s => s.sessionNumber !== currentSession.sessionNumber);
    if (otherSessions.length === 0) {
      return 'This is your first session. Keep practicing to see progress trends!';
    }

    const avgWPM = calculateAverage(otherSessions.map(s => s.averageWPM));
    const avgFillers = calculateAverage(otherSessions.map(s => s.fillerWords));
    const avgConfidence = calculateAverage(otherSessions.map(s => s.confidenceScore));

    const prompt = `Compare this session to the speaker's average performance:

    Current Session:
    - WPM: ${currentSession.averageWPM} (avg: ${Math.round(avgWPM)})
    - Filler words: ${currentSession.fillerWords} (avg: ${Math.round(avgFillers)})
    - Confidence: ${Math.round(currentSession.confidenceScore)}% (avg: ${Math.round(avgConfidence)}%)
    - Duration: ${currentSession.duration} seconds

    Provide a brief, encouraging comparison (2-3 sentences) highlighting what improved and what to focus on next.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a supportive speaking coach. Provide brief, specific, and encouraging feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content || 'Keep practicing to improve your skills!';

  } catch (error) {
    console.error('Error generating session comparison:', error);
    return 'Keep practicing to see improvement over time!';
  }
}

function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

// Generate insights based on data patterns without API
function generatePatternBasedInsights(sessions: SessionData[]): CoachingInsights {
  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Calculate metrics
  const recentSessions = sortedSessions.slice(-5);
  const olderSessions = sortedSessions.slice(0, Math.max(0, sortedSessions.length - 5));
  
  const avgConfidence = calculateAverage(sessions.map(s => s.confidenceScore));
  const avgWPM = calculateAverage(sessions.map(s => s.averageWPM));
  const avgFillers = calculateAverage(sessions.map(s => s.fillerWords));
  const avgClarity = calculateAverage(sessions.map(s => s.voiceClarity * 100));
  const avgEyeContact = calculateAverage(sessions.map(s => parseInt(s.eyeContactScore) || 0));
  
  const recentAvgConfidence = calculateAverage(recentSessions.map(s => s.confidenceScore));
  const olderAvgConfidence = olderSessions.length > 0 
    ? calculateAverage(olderSessions.map(s => s.confidenceScore))
    : recentAvgConfidence;
    
  const recentAvgWPM = calculateAverage(recentSessions.map(s => s.averageWPM));
  const olderAvgWPM = olderSessions.length > 0
    ? calculateAverage(olderSessions.map(s => s.averageWPM))
    : recentAvgWPM;

  const scoreImprovement = Math.round(recentAvgConfidence - olderAvgConfidence);
  const wpmImprovement = recentAvgWPM - olderAvgWPM;
  
  // Determine trend
  let trend: 'improving' | 'steady' | 'declining' = 'steady';
  if (scoreImprovement > 5) trend = 'improving';
  else if (scoreImprovement < -5) trend = 'declining';
  
  // Generate strengths
  const strengths: string[] = [];
  if (avgConfidence > 80) strengths.push(`Excellent confidence level averaging ${Math.round(avgConfidence)}%`);
  if (avgWPM >= 120 && avgWPM <= 160) strengths.push(`Optimal speaking pace at ${Math.round(avgWPM)} words per minute`);
  if (avgFillers < 5) strengths.push(`Minimal filler words with only ${Math.round(avgFillers)} per session`);
  if (avgClarity > 75) strengths.push(`Clear voice articulation at ${Math.round(avgClarity)}% clarity`);
  if (avgEyeContact > 70) strengths.push(`Strong eye contact maintained at ${Math.round(avgEyeContact)}%`);
  if (sessions.length >= 10) strengths.push(`Consistent practice with ${sessions.length} sessions completed`);
  
  // Generate areas for improvement
  const improvements: string[] = [];
  if (avgConfidence < 70) improvements.push(`Build confidence - currently at ${Math.round(avgConfidence)}%`);
  if (avgWPM < 100) improvements.push(`Increase speaking pace from ${Math.round(avgWPM)} to 120-140 WPM`);
  if (avgWPM > 180) improvements.push(`Slow down pace from ${Math.round(avgWPM)} to 140-160 WPM for clarity`);
  if (avgFillers > 10) improvements.push(`Reduce filler words from ${Math.round(avgFillers)} per session`);
  if (avgClarity < 70) improvements.push(`Improve voice clarity from ${Math.round(avgClarity)}%`);
  if (avgEyeContact < 60) improvements.push(`Increase eye contact from ${Math.round(avgEyeContact)}%`);
  
  // Generate personalized tips based on data
  const tips: string[] = [];
  
  if (avgFillers > 5) {
    tips.push('Practice pausing instead of using filler words - silence is more powerful than "um" or "uh"');
  }
  
  if (avgWPM < 120 || avgWPM > 160) {
    tips.push(`Aim for 120-160 words per minute - you're currently at ${Math.round(avgWPM)} WPM`);
  }
  
  if (avgEyeContact < 70) {
    tips.push('Look directly at the camera as if speaking to a friend - this builds connection');
  }
  
  if (recentAvgConfidence > olderAvgConfidence) {
    tips.push('Your confidence is improving! Keep building on this momentum');
  }
  
  if (sessions.some(s => s.duration < 60)) {
    tips.push('Try longer practice sessions (2-3 minutes) to build stamina and flow');
  }
  
  tips.push('Record yourself in different lighting and backgrounds to prepare for various scenarios');
  
  // Generate patterns
  const patterns = {
    speaking: [],
    bodyLanguage: [],
    content: []
  };
  
  // Speaking patterns
  if (avgWPM > 0) {
    const wpmVariance = Math.max(...sessions.map(s => s.averageWPM)) - Math.min(...sessions.map(s => s.averageWPM));
    if (wpmVariance > 50) {
      patterns.speaking.push('Your speaking pace varies significantly between sessions');
    } else {
      patterns.speaking.push('You maintain a consistent speaking pace across sessions');
    }
  }
  
  if (avgFillers < 5) {
    patterns.speaking.push('You rarely use filler words, showing good speech preparation');
  } else if (avgFillers > 10) {
    patterns.speaking.push('Filler words appear frequently - practice deliberate pauses');
  }
  
  patterns.speaking.push(`Average clarity level of ${Math.round(avgClarity)}% across all sessions`);
  
  // Body language patterns
  patterns.bodyLanguage.push(`Eye contact averages ${Math.round(avgEyeContact)}% across sessions`);
  
  if (avgConfidence > 75) {
    patterns.bodyLanguage.push('Your body language conveys confidence consistently');
  } else {
    patterns.bodyLanguage.push('Focus on power poses and open gestures to boost confidence');
  }
  
  // Content patterns
  const avgDuration = calculateAverage(sessions.map(s => s.duration));
  if (avgDuration < 60) {
    patterns.content.push('Sessions are brief - consider expanding your content');
  } else if (avgDuration > 180) {
    patterns.content.push('You deliver comprehensive content in your sessions');
  }
  
  patterns.content.push(`Average session length: ${Math.round(avgDuration)} seconds`);
  
  // Next steps
  const nextSteps: string[] = [];
  
  if (sessions.length < 10) {
    nextSteps.push(`Complete ${10 - sessions.length} more sessions to establish solid patterns`);
  }
  
  if (avgFillers > 10) {
    nextSteps.push('Focus your next session on eliminating filler words');
  } else if (avgWPM < 120) {
    nextSteps.push('Practice speaking slightly faster to increase energy');
  } else if (avgEyeContact < 70) {
    nextSteps.push('Make eye contact your primary focus in the next session');
  } else {
    nextSteps.push('Challenge yourself with a new speaking topic or style');
  }
  
  nextSteps.push('Record a 3-minute impromptu speech to test adaptability');
  nextSteps.push('Practice with different emotional tones (enthusiastic, serious, inspiring)');
  
  // Motivational message
  let motivationalMessage = '';
  if (trend === 'improving') {
    motivationalMessage = `Outstanding progress! You've improved ${Math.abs(scoreImprovement)}% recently. Your dedication is paying off - keep up this excellent momentum!`;
  } else if (trend === 'declining') {
    motivationalMessage = `Every speaker has ups and downs. Use this as a learning opportunity. Focus on one area at a time and you'll bounce back stronger!`;
  } else {
    motivationalMessage = `You're building a solid foundation with ${sessions.length} sessions. Consistency is key to mastery - keep practicing regularly!`;
  }
  
  return {
    overallProgress: {
      trend,
      summary: `Based on ${sessions.length} sessions, your average confidence is ${Math.round(avgConfidence)}% with ${Math.round(avgWPM)} WPM speaking pace`,
      scoreImprovement
    },
    strengths: strengths.length > 0 ? strengths : ['Consistent practice and tracking', 'Building a strong foundation'],
    areasForImprovement: improvements.length > 0 ? improvements : ['Continue practicing to identify improvement areas'],
    personalizedTips: tips,
    patterns,
    nextSteps,
    motivationalMessage
  };
}

function getDefaultInsights(): CoachingInsights {
  return {
    overallProgress: {
      trend: 'steady',
      summary: 'Complete more sessions to see detailed progress analysis',
      scoreImprovement: 0
    },
    strengths: [
      'You\'re actively practicing and recording sessions',
      'You\'re tracking your progress consistently'
    ],
    areasForImprovement: [
      'Complete more practice sessions for detailed analysis',
      'Try different speaking scenarios to build versatility'
    ],
    personalizedTips: [
      'Record at least 3-5 sessions to see meaningful patterns',
      'Practice for at least 2-3 minutes per session',
      'Focus on one improvement area per session'
    ],
    patterns: {
      speaking: ['More data needed for pattern analysis'],
      bodyLanguage: ['More data needed for pattern analysis'],
      content: ['More data needed for pattern analysis']
    },
    nextSteps: [
      'Complete your next practice session',
      'Try a different speaking topic or style',
      'Focus on maintaining consistent pace'
    ],
    motivationalMessage: 'Great start! Keep practicing regularly to see improvement.'
  };
}