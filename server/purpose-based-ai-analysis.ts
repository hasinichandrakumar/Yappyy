// Purpose-Based AI Analysis - Provides detailed, context-specific feedback based on practice purpose
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Purpose-specific analysis templates
const purposeAnalysisTemplates = {
  business: {
    focusAreas: ['authority', 'structure', 'persuasion', 'professional_presence'],
    idealWPM: [130, 160],
    keyElements: ['clear value propositions', 'executive presence', 'data-driven insights', 'strategic thinking'],
    feedbackCriteria: {
      content: 'Professional terminology, strategic insights, problem-solution structure',
      delivery: 'Confident pace, authoritative tone, clear articulation',
      bodyLanguage: 'Executive presence, purposeful gestures, direct eye contact'
    }
  },
  academic: {
    focusAreas: ['clarity', 'examples', 'engagement', 'educational_flow'],
    idealWPM: [110, 140],
    keyElements: ['clear explanations', 'relevant examples', 'logical progression', 'student engagement'],
    feedbackCriteria: {
      content: 'Educational structure, clear concepts, practical examples',
      delivery: 'Measured pace, clear articulation, engaging tone',
      bodyLanguage: 'Open gestures, inclusive eye contact, approachable presence'
    }
  },
  interview: {
    focusAreas: ['confidence', 'examples', 'structure', 'authenticity'],
    idealWPM: [120, 150],
    keyElements: ['STAR method answers', 'specific achievements', 'authentic personality', 'professional competence'],
    feedbackCriteria: {
      content: 'Specific examples, quantified achievements, relevant skills',
      delivery: 'Confident but not aggressive, thoughtful pauses, clear responses',
      bodyLanguage: 'Professional posture, engaged eye contact, authentic expressions'
    }
  },
  presentation: {
    focusAreas: ['engagement', 'structure', 'authority', 'audience_connection'],
    idealWPM: [130, 160],
    keyElements: ['compelling opening', 'clear structure', 'audience engagement', 'memorable closing'],
    feedbackCriteria: {
      content: 'Engaging narratives, clear transitions, audience-focused benefits',
      delivery: 'Dynamic pace, expressive intonation, confident projection',
      bodyLanguage: 'Dynamic gestures, inclusive eye contact, commanding presence'
    }
  },
  leadership: {
    focusAreas: ['vision', 'inspiration', 'authority', 'emotional_connection'],
    idealWPM: [120, 150],
    keyElements: ['inspiring vision', 'emotional resonance', 'team motivation', 'authentic leadership'],
    feedbackCriteria: {
      content: 'Visionary language, inclusive messaging, motivational elements',
      delivery: 'Inspiring tone, strategic pauses, emotional modulation',
      bodyLanguage: 'Authoritative posture, inclusive gestures, authentic presence'
    }
  },
  personal: {
    focusAreas: ['emotion', 'storytelling', 'connection', 'heartfelt_delivery'],
    idealWPM: [110, 140],
    keyElements: ['personal stories', 'emotional connection', 'heartfelt delivery', 'memorable moments'],
    feedbackCriteria: {
      content: 'Personal anecdotes, emotional depth, celebratory tone',
      delivery: 'Heartfelt pace, emotional expression, genuine warmth',
      bodyLanguage: 'Open gestures, warm eye contact, authentic expressions'
    }
  },
  sales: {
    focusAreas: ['persuasion', 'energy', 'benefits', 'value_proposition'],
    idealWPM: [140, 170],
    keyElements: ['customer benefits', 'value propositions', 'objection handling', 'compelling call-to-action'],
    feedbackCriteria: {
      content: 'Benefit-focused language, customer pain points, ROI emphasis',
      delivery: 'Energetic pace, persuasive tone, confident closing',
      bodyLanguage: 'Engaging gestures, direct eye contact, enthusiastic presence'
    }
  },
  storytelling: {
    focusAreas: ['emotion', 'creativity', 'connection', 'narrative_flow'],
    idealWPM: [110, 140],
    keyElements: ['engaging narratives', 'emotional expression', 'creative language', 'personal connection'],
    feedbackCriteria: {
      content: 'Compelling stories, emotional depth, creative expression, relatable themes',
      delivery: 'Expressive tone, dramatic pauses, varied pace, emotional modulation',
      bodyLanguage: 'Expressive gestures, engaging eye contact, animated expressions'
    }
  },
  confidence: {
    focusAreas: ['self_assurance', 'voice_strength', 'courage', 'overcoming_shyness'],
    idealWPM: [120, 150],
    keyElements: ['bold statements', 'clear voice projection', 'assertive language', 'personal empowerment'],
    feedbackCriteria: {
      content: 'Confident language, personal empowerment themes, assertive messaging',
      delivery: 'Strong voice projection, steady pace, clear articulation, confident tone',
      bodyLanguage: 'Upright posture, direct eye contact, steady stance, open gestures'
    }
  },
  conversation: {
    focusAreas: ['natural_flow', 'listening', 'connection', 'social_comfort'],
    idealWPM: [130, 160],
    keyElements: ['natural dialogue', 'responsive communication', 'social awareness', 'authentic connection'],
    feedbackCriteria: {
      content: 'Conversational tone, relatable language, authentic expression, social awareness',
      delivery: 'Natural rhythm, responsive pace, warm tone, comfortable delivery',
      bodyLanguage: 'Relaxed posture, natural gestures, approachable demeanor, attentive presence'
    }
  },
  general: {
    focusAreas: ['clarity', 'confidence', 'pace', 'overall_improvement'],
    idealWPM: [120, 160],
    keyElements: ['clear communication', 'confident delivery', 'engaging presence', 'effective messaging'],
    feedbackCriteria: {
      content: 'Clear messaging, logical flow, audience awareness',
      delivery: 'Consistent pace, clear articulation, appropriate volume',
      bodyLanguage: 'Natural gestures, steady eye contact, confident posture'
    }
  }
};

export interface PurposeBasedAnalysis {
  overallAssessment: string;
  purposeSpecificFeedback: string;
  strengthsInContext: string[];
  improvementAreas: string[];
  nextSteps: string[];
  paceAnalysis: string;
  contentStructure: string;
  deliveryStyle: string;
  progressSummary: string;
}

export async function generatePurposeBasedAnalysis(
  transcript: string,
  practiceCategory: string,
  sessionData: any
): Promise<PurposeBasedAnalysis> {
  try {
    const template = purposeAnalysisTemplates[practiceCategory as keyof typeof purposeAnalysisTemplates] || purposeAnalysisTemplates.general;
    const wordCount = transcript.split(' ').filter(w => w.length > 0).length;
    const actualWPM = sessionData.duration > 0 ? Math.round((wordCount / sessionData.duration) * 60) : 0;
    
    // Generate purpose-specific system prompt
    const systemPrompt = `You are an expert speaking coach specializing in ${practiceCategory} communication. 

PURPOSE CONTEXT:
- Category: ${practiceCategory.charAt(0).toUpperCase() + practiceCategory.slice(1)}
- Focus Areas: ${template.focusAreas.join(', ')}
- Ideal Speaking Pace: ${template.idealWPM[0]}-${template.idealWPM[1]} WPM
- Key Elements: ${template.keyElements.join(', ')}

ANALYSIS CRITERIA:
- Content: ${template.feedbackCriteria.content}
- Delivery: ${template.feedbackCriteria.delivery}
- Body Language: ${template.feedbackCriteria.bodyLanguage}

Provide detailed, actionable feedback specifically tailored to ${practiceCategory} speaking contexts. Focus on the unique requirements and success factors for this type of communication.`;

    const userPrompt = `Analyze this ${practiceCategory} practice session:

TRANSCRIPT: "${transcript}"

SESSION METRICS:
- Duration: ${sessionData.duration} seconds
- Actual WPM: ${actualWPM}
- Filler Words: ${sessionData.fillerWordCount}
- Eye Contact: ${sessionData.eyeContactScore}%
- Confidence: ${sessionData.confidenceScore * 100}%
- Voice Clarity: ${sessionData.voiceClarity * 100}%

Provide purpose-specific analysis in this exact JSON format:
{
  "overallAssessment": "Brief overall assessment for ${practiceCategory} context",
  "purposeSpecificFeedback": "Detailed feedback specific to ${practiceCategory} requirements and standards",
  "strengthsInContext": ["strength1", "strength2", "strength3"],
  "improvementAreas": ["area1", "area2", "area3"],
  "nextSteps": ["step1", "step2", "step3"],
  "paceAnalysis": "WPM analysis specific to ${practiceCategory} expectations",
  "contentStructure": "Analysis of content organization for ${practiceCategory}",
  "deliveryStyle": "Evaluation of delivery style for ${practiceCategory}",
  "progressSummary": "Summary of progress and recommendations"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure all required fields are present with defaults
    return {
      overallAssessment: analysis.overallAssessment || `Good ${practiceCategory} practice session completed.`,
      purposeSpecificFeedback: analysis.purposeSpecificFeedback || `Continue developing your ${practiceCategory} communication skills.`,
      strengthsInContext: analysis.strengthsInContext || ['Clear communication', 'Good effort', 'Engaged delivery'],
      improvementAreas: analysis.improvementAreas || ['Pace consistency', 'Filler reduction', 'Confidence building'],
      nextSteps: analysis.nextSteps || ['Practice regularly', 'Focus on clarity', 'Record more sessions'],
      paceAnalysis: analysis.paceAnalysis || `Speaking at ${actualWPM} WPM - aim for ${template.idealWPM[0]}-${template.idealWPM[1]} WPM for ${practiceCategory}.`,
      contentStructure: analysis.contentStructure || `Content structure appropriate for ${practiceCategory} context.`,
      deliveryStyle: analysis.deliveryStyle || `Delivery style suitable for ${practiceCategory} communication.`,
      progressSummary: analysis.progressSummary || `Making progress in ${practiceCategory} speaking skills.`
    };

  } catch (error) {
    console.error('Purpose-based analysis error:', error);
    
    // Provide category-specific fallback
    const template = purposeAnalysisTemplates[practiceCategory as keyof typeof purposeAnalysisTemplates] || purposeAnalysisTemplates.general;
    
    return {
      overallAssessment: `Completed ${practiceCategory} practice session. Focus on ${template.focusAreas.slice(0, 2).join(' and ')}.`,
      purposeSpecificFeedback: `For ${practiceCategory} speaking, emphasize ${template.keyElements.slice(0, 2).join(' and ')}.`,
      strengthsInContext: [`Good ${practiceCategory} practice effort`, 'Engaged in session', 'Committed to improvement'],
      improvementAreas: template.focusAreas.slice(0, 3),
      nextSteps: [
        `Practice ${practiceCategory}-specific content regularly`,
        `Focus on ${template.focusAreas[0]} improvement`,
        'Record more sessions for comparison'
      ],
      paceAnalysis: `Aim for ${template.idealWPM[0]}-${template.idealWPM[1]} WPM for effective ${practiceCategory} communication.`,
      contentStructure: `Structure content according to ${practiceCategory} best practices.`,
      deliveryStyle: `Adapt delivery style to ${practiceCategory} audience expectations.`,
      progressSummary: `Continue developing ${practiceCategory} communication skills through regular practice.`
    };
  }
}

// Enhanced session insights with purpose context
export async function generateEnhancedSessionInsights(
  sessionData: any,
  fillerCount: number,
  practiceCategory: string = 'general'
): Promise<any> {
  try {
    const template = purposeAnalysisTemplates[practiceCategory as keyof typeof purposeAnalysisTemplates] || purposeAnalysisTemplates.general;
    
    const systemPrompt = `You are an expert ${practiceCategory} speaking coach. Provide comprehensive insights tailored specifically to ${practiceCategory} communication standards and expectations.

Focus on ${template.focusAreas.join(', ')} as key evaluation criteria for ${practiceCategory} speaking.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Analyze this ${practiceCategory} practice session:

Duration: ${sessionData.duration}s
WPM: ${sessionData.wpm}
Filler Words: ${fillerCount}
Practice Category: ${practiceCategory}

Provide insights specifically for ${practiceCategory} speaking contexts in this format:
{
  "overallAssessment": "Assessment tailored to ${practiceCategory} standards",
  "progressSummary": "Progress summary for ${practiceCategory} development"
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Enhanced session insights error:', error);
    return {
      overallAssessment: `Good ${practiceCategory} practice session. Continue focusing on key areas.`,
      progressSummary: `Making steady progress in ${practiceCategory} communication skills.`
    };
  }
}