import { Request, Response } from 'express';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SessionContext {
  sessionId: string;
  sessionNumber: number;
  userId: string;
  sessionName: string;
  purpose: string;
  transcript: string;
  duration: number;
  previousSessions: SessionHistory[];
  currentMetrics: LiveMetrics;
  userProfile: UserProfile;
}

interface SessionHistory {
  sessionNumber: number;
  date: string;
  purpose: string;
  keyMetrics: {
    wordsPerMinute: number;
    fillerWordRate: number;
    confidenceScore: number;
    eyeContactScore: number;
    gestureVariety: number;
  };
  improvements: string[];
  challenges: string[];
  breakthroughs: string[];
}

interface LiveMetrics {
  currentWPM: number;
  fillerWords: string[];
  eyeContact: number;
  posture: number;
  voiceClarity: number;
  gestureCount: number;
  emotionalTone: string;
  audienceEngagement: number;
}

interface UserProfile {
  speakingStyle: string;
  strengths: string[];
  growthAreas: string[];
  goals: string[];
  personalityInsights: string[];
  preferredFeedbackStyle: 'direct' | 'encouraging' | 'analytical';
}

export async function generateWorldClassCoaching(req: Request, res: Response) {
  try {
    const sessionContext: SessionContext = req.body;
    
    const systemPrompt = `You are Dr. Alexandra Sterling, a world-renowned speech pathologist, body language expert, and communication coach with 25+ years of experience. You've coached Fortune 500 CEOs, TED speakers, political leaders, and award-winning performers.

Your expertise spans:
- Advanced speech pathology and vocal technique
- Microexpression analysis and body language interpretation  
- Cognitive behavioral patterns in communication
- Cross-cultural communication dynamics
- Performance psychology and confidence building
- Neurolinguistic programming applications
- Dialectical behavior therapy for communication anxiety

Core Principles:
1. CONTEXTUAL INTELLIGENCE: Analyze patterns across sessions to identify deeper trends
2. EMPATHETIC GROWTH: Provide encouragement that acknowledges struggle and celebrates progress
3. PROGRESSIVE DEVELOPMENT: Build on previous insights to create personalized growth paths
4. HOLISTIC ASSESSMENT: Consider voice, body, content, and emotional intelligence together
5. ACTIONABLE WISDOM: Provide specific, implementable techniques

Analysis Framework:
- Identify micro-improvements and celebrate them
- Connect current performance to user's stated goals and speaking purpose
- Reference previous sessions to show growth trajectory
- Provide empathetic acknowledgment of challenges
- Offer specific, evidence-based improvement techniques`;

    const userPrompt = `SESSION ANALYSIS REQUEST

Current Session Context:
- Session ${sessionContext.sessionNumber}: "${sessionContext.sessionName}"
- Purpose: ${sessionContext.purpose}
- Duration: ${Math.round(sessionContext.duration / 60)} minutes
- Transcript Length: ${sessionContext.transcript.length} characters

Live Performance Metrics:
- Speaking Pace: ${sessionContext.currentMetrics.currentWPM} WPM
- Filler Words: ${sessionContext.currentMetrics.fillerWords.length} detected (${sessionContext.currentMetrics.fillerWords.join(', ')})
- Eye Contact: ${sessionContext.currentMetrics.eyeContact}%
- Posture Score: ${sessionContext.currentMetrics.posture}%
- Voice Clarity: ${sessionContext.currentMetrics.voiceClarity}%
- Gesture Variety: ${sessionContext.currentMetrics.gestureCount} unique gestures
- Emotional Tone: ${sessionContext.currentMetrics.emotionalTone}

User Profile:
- Speaking Style: ${sessionContext.userProfile.speakingStyle}
- Key Strengths: ${sessionContext.userProfile.strengths.join(', ')}
- Growth Areas: ${sessionContext.userProfile.growthAreas.join(', ')}
- Goals: ${sessionContext.userProfile.goals.join(', ')}

Previous Session Trends (Last ${sessionContext.previousSessions.length} sessions):
${sessionContext.previousSessions.map(session => `
Session ${session.sessionNumber} (${session.date}):
- Purpose: ${session.purpose}
- WPM: ${session.keyMetrics.wordsPerMinute}
- Filler Rate: ${session.keyMetrics.fillerWordRate}%
- Confidence: ${session.keyMetrics.confidenceScore}%
- Key Breakthrough: ${session.breakthroughs[0] || 'Steady progress'}
`).join('')}

Speech Transcript Sample:
"${sessionContext.transcript.substring(0, 500)}..."

COACHING REQUEST:
Provide a comprehensive, empathetic coaching analysis that:

1. CELEBRATES SPECIFIC PROGRESS: Identify and celebrate concrete improvements from previous sessions
2. CONTEXTUAL PATTERN ANALYSIS: Connect current performance to user's purpose and goals
3. EMPATHETIC GROWTH FEEDBACK: Acknowledge challenges with understanding and provide encouragement
4. INTELLIGENT TREND CONNECTIONS: Reference session history to show meaningful patterns
5. PERSONALIZED ACTION PLAN: Provide 3-4 specific, implementable improvement techniques
6. EMOTIONAL INTELLIGENCE: Address confidence, authenticity, and emotional connection with audience

Format your response as JSON:
{
  "sessionSummary": "Warm, encouraging summary of this session's performance",
  "progressCelebration": "Specific progress acknowledgment with empathy",
  "trendAnalysis": "Intelligent pattern recognition across sessions",
  "empathticGrowthFeedback": "Understanding and encouraging feedback about challenges",
  "personalizedInsights": ["Array of 4-5 personalized insights based on user's style and goals"],
  "actionPlan": [
    {
      "focus": "Area to work on",
      "technique": "Specific technique",
      "practiceExercise": "Concrete exercise to implement",
      "expectedOutcome": "What they'll achieve"
    }
  ],
  "encouragementMessage": "Personalized, empathetic message that builds confidence",
  "nextSessionGoals": ["Specific goals for next practice session"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const coaching = JSON.parse(response.choices[0].message.content || '{}');
    
    res.json({
      success: true,
      coaching,
      coachProfile: {
        name: "Dr. Alexandra Sterling",
        credentials: "Ph.D. Speech Pathology, Certified Body Language Expert",
        experience: "25+ years coaching world leaders and performers",
        specialties: ["Voice & Speech", "Body Language", "Performance Psychology", "Cross-Cultural Communication"]
      }
    });

  } catch (error) {
    console.error('World-class coaching generation failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate expert coaching analysis',
      fallback: {
        sessionSummary: "I'm experiencing a temporary connection issue, but I can see you're making excellent progress in your speaking journey.",
        encouragementMessage: "Every practice session builds your confidence and skills. Keep going - you're developing into a truly compelling speaker."
      }
    });
  }
}

export async function generateLiveEmpathicFeedback(req: Request, res: Response) {
  try {
    const { 
      currentMetrics, 
      sessionContext, 
      timeInSession, 
      userProfile,
      recentChallenges 
    } = req.body;

    const systemPrompt = `You are providing live, empathetic coaching feedback as Dr. Alexandra Sterling. Your feedback should be:
- Immediate and contextual to what's happening now
- Empathetic and encouraging
- Specific and actionable
- Brief but meaningful (1-2 sentences max)
- Adaptive to the user's emotional state and progress`;

    const userPrompt = `LIVE COACHING MOMENT

Current Situation:
- Time in session: ${timeInSession} seconds
- Speaking pace: ${currentMetrics.currentWPM} WPM (target: 140-160)
- Recent filler words: ${currentMetrics.recentFillers?.join(', ') || 'None'}
- Voice energy: ${currentMetrics.voiceEnergy}/10
- Posture confidence: ${currentMetrics.postureConfidence}%
- Purpose: ${sessionContext.purpose}

User's Recent Pattern:
${recentChallenges ? `Struggling with: ${recentChallenges}` : 'Showing good progress'}

Provide ONE encouraging, specific piece of live feedback (max 15 words) that:
1. Acknowledges what they're doing well
2. Gently guides improvement if needed
3. Maintains their confidence and flow

Response format: Just the feedback message, no JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 50
    });

    res.json({
      success: true,
      feedback: response.choices[0].message.content?.trim(),
      timestamp: Date.now(),
      category: 'live_encouragement'
    });

  } catch (error) {
    console.error('Live empathic feedback generation failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate live feedback' 
    });
  }
}

export async function updateUserSpeakingProfile(req: Request, res: Response) {
  try {
    const { userId, sessionData, currentProfile } = req.body;

    const systemPrompt = `You are analyzing speaking patterns to build a comprehensive user profile. Based on session data, identify:
1. Speaking style evolution
2. Consistent strengths and growth areas  
3. Personality insights from communication patterns
4. Preferred feedback style based on response patterns`;

    const userPrompt = `UPDATE SPEAKING PROFILE

Current Profile:
${JSON.stringify(currentProfile, null, 2)}

Latest Session Data:
- Performance metrics, challenges, breakthroughs
- Speaking patterns and preferences
- Response to different types of feedback

Provide updated profile as JSON with:
{
  "speakingStyle": "Updated style description",
  "strengths": ["evolved strengths"],
  "growthAreas": ["current focus areas"],
  "personalityInsights": ["communication personality traits"],
  "preferredFeedbackStyle": "direct|encouraging|analytical",
  "progressTrajectory": "overall growth pattern"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6
    });

    const updatedProfile = JSON.parse(response.choices[0].message.content || '{}');
    
    res.json({
      success: true,
      updatedProfile
    });

  } catch (error) {
    console.error('Profile update failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update speaking profile' 
    });
  }
}