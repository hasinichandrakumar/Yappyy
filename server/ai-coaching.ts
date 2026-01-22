import { Request, Response } from 'express';

interface ClubCoachingRequest {
  club: 'DECA' | 'FBLA' | 'HOSA';
  event: {
    name: string;
    category: string;
    description: string;
    keySkills: string[];
  };
  presentationTranscript?: string;
  duration?: number;
  practiceNotes?: string;
}

export async function generateClubCoaching(req: Request, res: Response) {
  try {
    const { club, event, presentationTranscript, duration, practiceNotes }: ClubCoachingRequest = req.body;

    if (!club || !event) {
      return res.status(400).json({ error: 'Club and event information required' });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(club, event)
          },
          {
            role: 'user',
            content: getUserPrompt(club, event, presentationTranscript, duration, practiceNotes)
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the structured JSON response from OpenAI
    const feedback = JSON.parse(aiResponse);
    
    res.json(feedback);
  } catch (error) {
    console.error('AI Coaching Error:', error);
    res.status(500).json({ error: 'Failed to generate coaching feedback' });
  }
}

function getSystemPrompt(club: string, event: any): string {
  const clubDetails = {
    DECA: {
      focus: 'business management, marketing, finance, hospitality, and entrepreneurship',
      criteria: 'business acumen, decision-making, professional communication, problem-solving',
      standards: 'DECA competitive event guidelines and business industry standards'
    },
    FBLA: {
      focus: 'business leadership, professional development, and career preparation',
      criteria: 'leadership qualities, business communication, practical application, professional presence',
      standards: 'FBLA competitive event guidelines and business leadership principles'
    },
    HOSA: {
      focus: 'health science education and healthcare career preparation',
      criteria: 'health knowledge, patient communication, evidence-based practice, healthcare professionalism',
      standards: 'HOSA competitive event guidelines and healthcare industry standards'
    }
  };

  const details = clubDetails[club as keyof typeof clubDetails];

  return `You are an expert ${club} competitive event judge with extensive experience in ${details.focus}. 

Your role is to evaluate student presentations based on official ${club} judging criteria, focusing on ${details.criteria}. 

Always provide feedback that:
1. Follows ${details.standards}
2. Is constructive and educational
3. Includes specific, actionable improvements
4. Recognizes strengths and areas for growth
5. Uses current industry knowledge and best practices

Event Context: ${event.name} - ${event.category}
Event Description: ${event.description}
Key Skills Being Evaluated: ${event.keySkills.join(', ')}

You must respond with valid JSON in this exact format:
{
  "overallScore": number (0-100),
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "categoryScores": {
    "content": number (0-100),
    "delivery": number (0-100),
    "professionalism": number (0-100)
  },
  "nextSteps": ["step1", "step2", "step3"],
  "judgeComments": "detailed feedback paragraph"
}`;
}

function getUserPrompt(club: string, event: any, transcript?: string, duration?: number, notes?: string): string {
  let prompt = `Please evaluate this ${club} competitive event presentation for "${event.name}".

Event Details:
- Category: ${event.category}
- Key Skills: ${event.keySkills.join(', ')}
- Description: ${event.description}

`;

  if (transcript) {
    prompt += `Presentation Content/Transcript:
${transcript}

`;
  }

  if (duration) {
    prompt += `Presentation Duration: ${Math.round(duration / 60)} minutes ${duration % 60} seconds

`;
  }

  if (notes) {
    prompt += `Student's Practice Notes:
${notes}

`;
  }

  prompt += `Please provide a comprehensive evaluation including:

1. Overall Score (0-100) based on ${club} standards
2. Specific Strengths (4-5 points)
3. Areas for Improvement (4-5 points)
4. ${club}-Specific Feedback based on official criteria
5. Actionable Next Steps for improvement
6. Industry-relevant advice for competitive success

Focus on authentic ${club} judging criteria and current best practices in the field.`;

  return prompt;
}

function parseAIResponse(response: string, club: string): any {
  // Extract structured feedback from AI response
  const lines = response.split('\n').filter(line => line.trim());
  
  let overallScore = 75; // Default if not found
  const strengths: string[] = [];
  const improvements: string[] = [];
  const nextSteps: string[] = [];
  let clubSpecificFeedback: any = {};

  let currentSection = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Extract overall score
    const scoreMatch = trimmed.match(/overall score[:\s]*(\d+)/i) || 
                     trimmed.match(/score[:\s]*(\d+)\/100/i) ||
                     trimmed.match(/(\d+)\/100/i);
    if (scoreMatch) {
      overallScore = Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
    }
    
    // Identify sections
    if (trimmed.toLowerCase().includes('strength')) {
      currentSection = 'strengths';
      continue;
    } else if (trimmed.toLowerCase().includes('improvement') || trimmed.toLowerCase().includes('areas for')) {
      currentSection = 'improvements';
      continue;
    } else if (trimmed.toLowerCase().includes('next step') || trimmed.toLowerCase().includes('recommend')) {
      currentSection = 'nextSteps';
      continue;
    } else if (trimmed.toLowerCase().includes(club.toLowerCase())) {
      currentSection = 'clubSpecific';
      continue;
    }
    
    // Extract bullet points or numbered items
    if (trimmed.match(/^[\d\-\*\•]/)) {
      const content = trimmed.replace(/^[\d\-\*\•\)\.\s]+/, '');
      if (content.length > 10) {
        switch (currentSection) {
          case 'strengths':
            if (strengths.length < 5) strengths.push(content);
            break;
          case 'improvements':
            if (improvements.length < 5) improvements.push(content);
            break;
          case 'nextSteps':
            if (nextSteps.length < 5) nextSteps.push(content);
            break;
        }
      }
    }
  }

  // Generate club-specific feedback based on response content
  clubSpecificFeedback = generateClubSpecificFeedback(club, response, overallScore);

  // Ensure minimum content
  if (strengths.length === 0) {
    strengths.push(
      'Demonstrated understanding of the topic',
      'Clear communication style',
      'Professional presentation approach',
      'Good organization of content'
    );
  }

  if (improvements.length === 0) {
    improvements.push(
      'Enhance specific examples and evidence',
      'Improve transitions between main points',
      'Strengthen conclusion with clear call-to-action',
      'Practice timing to maximize impact'
    );
  }

  if (nextSteps.length === 0) {
    nextSteps.push(
      'Practice with a timer to perfect pacing',
      'Research additional supporting evidence',
      'Record practice sessions for self-evaluation',
      'Seek feedback from mentors and peers'
    );
  }

  return {
    overallScore,
    strengths,
    improvements,
    clubSpecificFeedback,
    nextSteps,
    aiGenerated: true,
    evaluationSource: `${club} AI Judge powered by OpenAI`
  };
}

function generateClubSpecificFeedback(club: string, response: string, score: number): any {
  const feedback: any = {};
  
  switch (club) {
    case 'DECA':
      feedback.businessAcumen = score >= 80 ? 'Excellent grasp of business concepts and practical application' :
                               score >= 65 ? 'Good understanding with room for deeper business insight' :
                               'Develop stronger foundation in business principles';
      feedback.decisionMaking = score >= 80 ? 'Confident and well-reasoned decision-making process' :
                               score >= 65 ? 'Solid decisions with opportunity for stronger justification' :
                               'Work on analytical thinking and decision confidence';
      feedback.professionalPresence = score >= 80 ? 'Outstanding professional demeanor and communication' :
                                     score >= 65 ? 'Professional approach with minor refinements needed' :
                                     'Focus on developing executive presence and confidence';
      break;
      
    case 'FBLA':
      feedback.businessCommunication = score >= 80 ? 'Exceptional business communication skills demonstrated' :
                                      score >= 65 ? 'Strong communication with opportunities for enhancement' :
                                      'Develop clearer, more persuasive business language';
      feedback.leadershipQualities = score >= 80 ? 'Natural leadership presence and inspiring delivery' :
                                    score >= 65 ? 'Good leadership potential with room for growth' :
                                    'Focus on building confidence and leadership voice';
      feedback.practicalApplication = score >= 80 ? 'Excellent real-world relevance and practical solutions' :
                                     score >= 65 ? 'Good practical connections with more examples needed' :
                                     'Strengthen ties between theory and practical application';
      break;
      
    case 'HOSA':
      feedback.healthKnowledge = score >= 80 ? 'Comprehensive understanding of health concepts and current research' :
                                score >= 65 ? 'Solid health knowledge foundation with room for expansion' :
                                'Deepen understanding of health science principles and evidence';
      feedback.patientCommunication = score >= 80 ? 'Compassionate and effective healthcare communication style' :
                                     score >= 65 ? 'Good bedside manner with opportunity for improvement' :
                                     'Practice empathetic and clear patient communication';
      feedback.evidenceBased = score >= 80 ? 'Outstanding use of current research and evidence-based practice' :
                              score >= 65 ? 'Good evidence integration with more sources needed' :
                              'Strengthen evidence-based reasoning and citation of sources';
      break;
  }
  
  return feedback;
}