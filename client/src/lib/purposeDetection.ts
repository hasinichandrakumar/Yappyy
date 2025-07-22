export interface PurposeContext {
  category: string;
  subcategory: string;
  idealWPM: [number, number];
  keyPhrases: string[];
  feedbackFocus: string[];
}

export const detectSessionPurpose = (purpose: string): PurposeContext => {
  const purposeLower = purpose.toLowerCase();

  // Sales & Business Development
  if (purposeLower.includes('sales') || purposeLower.includes('pitch') || 
      purposeLower.includes('persuade') || purposeLower.includes('convince') ||
      purposeLower.includes('sell') || purposeLower.includes('client')) {
    return {
      category: 'sales',
      subcategory: 'business_pitch',
      idealWPM: [140, 160],
      keyPhrases: ['benefit', 'value', 'roi', 'save', 'profit', 'solution', 'problem'],
      feedbackFocus: ['energy', 'benefits', 'confidence', 'value_proposition']
    };
  }

  // Job Interviews & Career
  if (purposeLower.includes('interview') || purposeLower.includes('job') ||
      purposeLower.includes('career') || purposeLower.includes('hiring') ||
      purposeLower.includes('application') || purposeLower.includes('behavioral')) {
    return {
      category: 'interview',
      subcategory: 'job_interview',
      idealWPM: [120, 150],
      keyPhrases: ['example', 'experience', 'situation', 'challenge', 'achievement', 'skills'],
      feedbackFocus: ['eye_contact', 'examples', 'structure', 'confidence']
    };
  }

  // Presentations & Public Speaking
  if (purposeLower.includes('presentation') || purposeLower.includes('keynote') ||
      purposeLower.includes('conference') || purposeLower.includes('speaking') ||
      purposeLower.includes('audience') || purposeLower.includes('slides')) {
    return {
      category: 'presentation',
      subcategory: 'public_speaking',
      idealWPM: [130, 160],
      keyPhrases: ['first', 'second', 'next', 'finally', 'imagine', 'consider', 'today'],
      feedbackFocus: ['structure', 'engagement', 'clarity', 'minimal_fillers']
    };
  }

  // Leadership & Management
  if (purposeLower.includes('leadership') || purposeLower.includes('team') ||
      purposeLower.includes('meeting') || purposeLower.includes('management') ||
      purposeLower.includes('executive') || purposeLower.includes('strategy')) {
    return {
      category: 'leadership',
      subcategory: 'management_communication',
      idealWPM: [130, 150],
      keyPhrases: ['we', 'our team', 'together', 'vision', 'goals', 'strategy', 'collaborate'],
      feedbackFocus: ['authority', 'inclusivity', 'clarity', 'confidence']
    };
  }

  // Training & Education
  if (purposeLower.includes('training') || purposeLower.includes('workshop') ||
      purposeLower.includes('lesson') || purposeLower.includes('teach') ||
      purposeLower.includes('explain') || purposeLower.includes('course')) {
    return {
      category: 'education',
      subcategory: 'training',
      idealWPM: [110, 140],
      keyPhrases: ['example', 'let me show', 'imagine', 'understand', 'learn', 'practice'],
      feedbackFocus: ['clarity', 'examples', 'pacing', 'engagement']
    };
  }

  // Networking & Social
  if (purposeLower.includes('networking') || purposeLower.includes('elevator') ||
      purposeLower.includes('introduction') || purposeLower.includes('social') ||
      purposeLower.includes('meet') || purposeLower.includes('connect')) {
    return {
      category: 'networking',
      subcategory: 'social_connection',
      idealWPM: [140, 170],
      keyPhrases: ['help', 'connect', 'collaborate', 'opportunity', 'passion', 'excited'],
      feedbackFocus: ['energy', 'authenticity', 'connection', 'enthusiasm']
    };
  }

  // Storytelling & Narrative
  if (purposeLower.includes('story') || purposeLower.includes('narrative') ||
      purposeLower.includes('anecdote') || purposeLower.includes('experience') ||
      purposeLower.includes('journey') || purposeLower.includes('tale')) {
    return {
      category: 'storytelling',
      subcategory: 'narrative',
      idealWPM: [120, 150],
      keyPhrases: ['then', 'suddenly', 'moment', 'felt', 'realized', 'discovered', 'journey'],
      feedbackFocus: ['emotional_connection', 'pacing', 'drama', 'engagement']
    };
  }

  // Customer Service & Support
  if (purposeLower.includes('customer') || purposeLower.includes('service') ||
      purposeLower.includes('support') || purposeLower.includes('complaint') ||
      purposeLower.includes('help desk') || purposeLower.includes('assistance')) {
    return {
      category: 'service',
      subcategory: 'customer_support',
      idealWPM: [120, 140],
      keyPhrases: ['understand', 'help', 'solution', 'sorry', 'resolve', 'appreciate'],
      feedbackFocus: ['empathy', 'clarity', 'patience', 'professionalism']
    };
  }

  // Technical Explanations
  if (purposeLower.includes('technical') || purposeLower.includes('demo') ||
      purposeLower.includes('product') || purposeLower.includes('feature') ||
      purposeLower.includes('system') || purposeLower.includes('process')) {
    return {
      category: 'technical',
      subcategory: 'explanation',
      idealWPM: [110, 130],
      keyPhrases: ['step', 'process', 'function', 'feature', 'benefit', 'how it works'],
      feedbackFocus: ['clarity', 'step_by_step', 'examples', 'simplification']
    };
  }

  // Default: General speaking
  return {
    category: 'general',
    subcategory: 'public_speaking',
    idealWPM: [130, 160],
    keyPhrases: ['point', 'important', 'think', 'believe', 'understand'],
    feedbackFocus: ['clarity', 'engagement', 'confidence', 'structure']
  };
};

export const generateContextualFeedback = (
  purposeContext: PurposeContext,
  transcript: string,
  wpm: number,
  eyeContact: number,
  fillerCount: number,
  sessionTime: number
): { message: string; severity: 'good' | 'warning' | 'improvement'; category: string } | null => {
  const recentWords = transcript.split(' ').slice(-20).join(' ').toLowerCase();
  const [minWPM, maxWPM] = purposeContext.idealWPM;

  // Check for purpose-specific key phrases
  const foundKeyPhrase = purposeContext.keyPhrases.find(phrase => recentWords.includes(phrase));
  
  if (foundKeyPhrase) {
    const messages: Record<string, string> = {
      sales: `Excellent focus on "${foundKeyPhrase}" - key element for persuasive business pitches`,
      interview: `Great use of "${foundKeyPhrase}" - provides concrete evidence of your capabilities`,
      presentation: `Perfect signposting with "${foundKeyPhrase}" - helps audience follow your structure`,
      leadership: `Strong leadership language using "${foundKeyPhrase}" - builds team connection`,
      education: `Excellent teaching technique with "${foundKeyPhrase}" - makes concepts accessible`,
      networking: `Great networking approach with "${foundKeyPhrase}" - builds authentic connections`,
      storytelling: `Perfect narrative element "${foundKeyPhrase}" - draws listeners into your story`,
      service: `Excellent customer service language "${foundKeyPhrase}" - shows empathy and care`,
      technical: `Good technical communication with "${foundKeyPhrase}" - helps clarity`,
      general: `Good communication using "${foundKeyPhrase}" - engages your audience`
    };

    return {
      message: messages[purposeContext.category] || messages.general,
      severity: 'good',
      category: 'content'
    };
  }

  // WPM feedback based on purpose
  if (wpm < minWPM && wpm > 0) {
    const adjustments: Record<string, string> = {
      sales: 'For sales presentations, increase energy and pace to build excitement',
      interview: 'For interviews, this pace is good - shows thoughtfulness',
      presentation: 'For presentations, slightly increase pace to maintain audience engagement',
      leadership: 'For leadership communication, add more authority and energy',
      education: 'For training, this slower pace is perfect for learning',
      networking: 'For networking, increase energy to show enthusiasm and passion',
      storytelling: 'For storytelling, vary your pace - slow for drama, faster for excitement',
      service: 'For customer service, this calm pace shows patience and care',
      technical: 'For technical explanations, this measured pace aids comprehension',
      general: 'Consider increasing your pace slightly for better engagement'
    };

    return {
      message: adjustments[purposeContext.category] || adjustments.general,
      severity: purposeContext.category === 'education' || purposeContext.category === 'service' ? 'good' : 'improvement',
      category: 'voice'
    };
  }

  if (wmp > maxWPM) {
    const slowDownMessages: Record<string, string> = {
      sales: 'Slow down slightly - give prospects time to absorb your value proposition',
      interview: 'Reduce pace for interviews - measured speech shows control and confidence',
      presentation: 'Slow down for presentations - ensure audience can follow complex ideas',
      leadership: 'Moderate your pace - authoritative leaders speak with measured control',
      education: 'Slow down for training - learners need time to process information',
      networking: 'Good energy, but slow down slightly to build genuine connections',
      storytelling: 'Vary your pace - slow down for dramatic moments and key revelations',
      service: 'Slow down for customer service - shows care and ensures understanding',
      technical: 'Reduce pace for technical explanations - complex topics need time',
      general: 'Slow down slightly for better audience comprehension'
    };

    return {
      message: slowDownMessages[purposeContext.category] || slowDownMessages.general,
      severity: 'warning',
      category: 'voice'
    };
  }

  return null;
};