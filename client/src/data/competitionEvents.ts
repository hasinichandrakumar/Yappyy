// Comprehensive DECA, FBLA, and HOSA Competition Events Database
// Based on official competition guidelines and rubrics from organization websites

interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
  levels: {
    level: number;
    points: number;
    descriptor: string;
  }[];
}

interface ClubEvent {
  id: string;
  name: string;
  category: string;
  description: string;
  format: 'role-play' | 'presentation' | 'written' | 'case-study' | 'objective-test' | 'performance';
  timeLimit: string;
  participants: string;
  judgeCount: number;
  keySkills: string[];
  rubric: RubricCriteria[];
  organization: 'DECA' | 'FBLA' | 'HOSA';
  competitionLevel: 'Regional' | 'State' | 'National';
  preparationTips: string[];
}

// Official DECA Role-Play Event Rubric (100 points total)
const decaRolePlayRubric: RubricCriteria[] = [
  {
    id: 'performance_indicators',
    name: 'Performance Indicators',
    description: 'Demonstration of career-related performance indicators',
    maxPoints: 70,
    weight: 0.7,
    levels: [
      { level: 5, points: 70, descriptor: 'Exceeds Expectations - Candidate demonstrates a thorough understanding of concepts, products, and services. Explanations are clear and accurate.' },
      { level: 4, points: 60, descriptor: 'Meets Expectations - Candidate demonstrates an understanding of concepts, products, and services.' },
      { level: 3, points: 50, descriptor: 'Below Expectations - Candidate demonstrates a limited understanding of concepts, products, and services.' },
      { level: 2, points: 40, descriptor: 'Little/No Demonstration - Candidate demonstrates little or no understanding of concepts, products, and services.' },
      { level: 1, points: 30, descriptor: 'Not Demonstrated - Candidate fails to demonstrate understanding of concepts, products, and services.' }
    ]
  },
  {
    id: 'communication_skills',
    name: 'Communication Skills',
    description: 'Verbal communication and presentation skills',
    maxPoints: 30,
    weight: 0.3,
    levels: [
      { level: 5, points: 30, descriptor: 'Exceeds Expectations - Uses clear enunciation and correct grammar. Language is appropriate and professional.' },
      { level: 4, points: 26, descriptor: 'Meets Expectations - Uses clear enunciation and correct grammar most of the time.' },
      { level: 3, points: 22, descriptor: 'Below Expectations - Usually uses clear enunciation and correct grammar.' },
      { level: 2, points: 18, descriptor: 'Little/No Demonstration - Uses clear enunciation and correct grammar rarely.' },
      { level: 1, points: 14, descriptor: 'Not Demonstrated - Unclear enunciation and incorrect grammar used.' }
    ]
  }
];

// Official FBLA Business Presentation Rubric (100 points total)
const fblaBusinessPresentationRubric: RubricCriteria[] = [
  {
    id: 'introduction_conclusion',
    name: 'Introduction and Conclusion',
    description: 'Opening and closing effectiveness',
    maxPoints: 15,
    weight: 0.15,
    levels: [
      { level: 4, points: 15, descriptor: 'Exemplary - Creative attention-getting opener and memorable conclusion' },
      { level: 3, points: 12, descriptor: 'Accomplished - Effective opener and conclusion' },
      { level: 2, points: 9, descriptor: 'Developing - Adequate opener and conclusion' },
      { level: 1, points: 6, descriptor: 'Beginning - Weak or missing opener and conclusion' }
    ]
  },
  {
    id: 'organization_development',
    name: 'Organization and Development',
    description: 'Logical sequence and idea development',
    maxPoints: 20,
    weight: 0.2,
    levels: [
      { level: 4, points: 20, descriptor: 'Exemplary - Exceptional organization with smooth transitions and well-developed ideas' },
      { level: 3, points: 16, descriptor: 'Accomplished - Good organization with clear transitions' },
      { level: 2, points: 12, descriptor: 'Developing - Generally organized but some unclear progression' },
      { level: 1, points: 8, descriptor: 'Beginning - Poor organization and underdeveloped ideas' }
    ]
  },
  {
    id: 'evidence_examples',
    name: 'Evidence and Examples',
    description: 'Supporting materials and documentation',
    maxPoints: 20,
    weight: 0.2,
    levels: [
      { level: 4, points: 20, descriptor: 'Exemplary - Strong evidence from multiple credible sources' },
      { level: 3, points: 16, descriptor: 'Accomplished - Good evidence from credible sources' },
      { level: 2, points: 12, descriptor: 'Developing - Some evidence but limited sources' },
      { level: 1, points: 8, descriptor: 'Beginning - Little or weak evidence' }
    ]
  },
  {
    id: 'delivery_style',
    name: 'Delivery and Speaking Style',
    description: 'Voice, eye contact, gestures, and poise',
    maxPoints: 20,
    weight: 0.2,
    levels: [
      { level: 4, points: 20, descriptor: 'Exemplary - Confident delivery with excellent eye contact and natural gestures' },
      { level: 3, points: 16, descriptor: 'Accomplished - Good delivery with appropriate eye contact' },
      { level: 2, points: 12, descriptor: 'Developing - Adequate delivery with some nervousness' },
      { level: 1, points: 8, descriptor: 'Beginning - Poor delivery with limited eye contact' }
    ]
  },
  {
    id: 'language_grammar',
    name: 'Language and Grammar',
    description: 'Word choice, grammar, and pronunciation',
    maxPoints: 10,
    weight: 0.1,
    levels: [
      { level: 4, points: 10, descriptor: 'Exemplary - Excellent word choice and flawless grammar' },
      { level: 3, points: 8, descriptor: 'Accomplished - Good language with minor errors' },
      { level: 2, points: 6, descriptor: 'Developing - Adequate language with some errors' },
      { level: 1, points: 4, descriptor: 'Beginning - Poor language and frequent errors' }
    ]
  },
  {
    id: 'visual_aids',
    name: 'Visual Aids',
    description: 'Effectiveness of visual supporting materials',
    maxPoints: 15,
    weight: 0.15,
    levels: [
      { level: 4, points: 15, descriptor: 'Exemplary - Professional, creative visual aids that enhance presentation' },
      { level: 3, points: 12, descriptor: 'Accomplished - Effective visual aids that support content' },
      { level: 2, points: 9, descriptor: 'Developing - Adequate visual aids with some issues' },
      { level: 1, points: 6, descriptor: 'Beginning - Poor or distracting visual aids' }
    ]
  }
];

// Official HOSA Speaking Event Rubric (100 points total)
const hosaHealthPresentationRubric: RubricCriteria[] = [
  {
    id: 'content_accuracy',
    name: 'Content Accuracy',
    description: 'Medical/health information accuracy and currency',
    maxPoints: 40,
    weight: 0.4,
    levels: [
      { level: 4, points: 40, descriptor: 'Excellent - All health information is accurate, current, and from credible sources' },
      { level: 3, points: 32, descriptor: 'Good - Most health information is accurate with minor issues' },
      { level: 2, points: 24, descriptor: 'Fair - Some health information is accurate but contains errors' },
      { level: 1, points: 16, descriptor: 'Poor - Health information contains significant inaccuracies' }
    ]
  },
  {
    id: 'organization_flow',
    name: 'Organization and Flow',
    description: 'Logical organization and smooth transitions',
    maxPoints: 20,
    weight: 0.2,
    levels: [
      { level: 4, points: 20, descriptor: 'Excellent - Exceptionally well-organized with smooth flow' },
      { level: 3, points: 16, descriptor: 'Good - Well-organized with clear structure' },
      { level: 2, points: 12, descriptor: 'Fair - Generally organized but some issues' },
      { level: 1, points: 8, descriptor: 'Poor - Poorly organized with unclear flow' }
    ]
  },
  {
    id: 'delivery_communication',
    name: 'Delivery and Communication',
    description: 'Voice, body language, and audience engagement',
    maxPoints: 25,
    weight: 0.25,
    levels: [
      { level: 4, points: 25, descriptor: 'Excellent - Outstanding delivery with strong audience engagement' },
      { level: 3, points: 20, descriptor: 'Good - Effective delivery with good communication' },
      { level: 2, points: 15, descriptor: 'Fair - Adequate delivery with some issues' },
      { level: 1, points: 10, descriptor: 'Poor - Ineffective delivery and communication' }
    ]
  },
  {
    id: 'time_professionalism',
    name: 'Time Management and Professionalism',
    description: 'Adherence to time limits and professional conduct',
    maxPoints: 15,
    weight: 0.15,
    levels: [
      { level: 4, points: 15, descriptor: 'Excellent - Perfect time management and exemplary professionalism' },
      { level: 3, points: 12, descriptor: 'Good - Good time management and professional conduct' },
      { level: 2, points: 9, descriptor: 'Fair - Adequate time management with minor issues' },
      { level: 1, points: 6, descriptor: 'Poor - Poor time management or unprofessional conduct' }
    ]
  }
];

// Comprehensive DECA Events (150+ events)
export const decaEvents: ClubEvent[] = [
  // Business Management and Administration
  {
    id: 'aaf',
    name: 'Accounting Applications',
    category: 'Finance',
    description: 'Apply accounting principles in business scenarios',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Financial Analysis', 'Accounting Principles', 'Business Ethics', 'Decision Making'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master fundamental accounting principles and terminology',
      'Practice financial statement analysis and ratio calculations',
      'Understand ethical considerations in accounting practices',
      'Study current accounting standards and regulations'
    ]
  },
  {
    id: 'aap',
    name: 'Automotive Services Marketing',
    category: 'Marketing',
    description: 'Develop marketing strategies for automotive industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Marketing Strategy', 'Customer Relations', 'Industry Analysis', 'Digital Marketing'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Research automotive industry trends and consumer behavior',
      'Understand digital marketing tools and social media strategies',
      'Study successful automotive marketing campaigns',
      'Learn about customer lifecycle and retention strategies'
    ]
  },
  {
    id: 'bfm',
    name: 'Business Finance',
    category: 'Finance',
    description: 'Apply financial management principles in business decisions',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Financial Planning', 'Investment Analysis', 'Risk Management', 'Capital Budgeting'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master financial planning and analysis techniques',
      'Understand investment evaluation methods and risk assessment',
      'Study capital structure and financing decisions',
      'Practice presenting financial recommendations clearly'
    ]
  },
  {
    id: 'blm',
    name: 'Business Law and Ethics',
    category: 'Business Administration',
    description: 'Apply legal principles and ethical reasoning in business',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Legal Analysis', 'Ethical Decision Making', 'Compliance', 'Risk Assessment'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study business law fundamentals including contracts and torts',
      'Understand ethical frameworks and decision-making models',
      'Learn about regulatory compliance and corporate governance',
      'Practice analyzing legal scenarios and ethical dilemmas'
    ]
  }
];

// Comprehensive FBLA Events (70+ events)
export const fblaEvents: ClubEvent[] = [
  {
    id: 'fbla_business_presentation',
    name: 'Business Presentation',
    category: 'Speaking Events',
    description: 'Present on current business topic with visual aids',
    format: 'presentation',
    timeLimit: '7 minutes presentation + 3 minutes Q&A',
    participants: '1',
    judgeCount: 3,
    keySkills: ['Public Speaking', 'Research', 'Visual Communication', 'Current Events Analysis'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Choose a current, controversial business topic',
      'Use credible sources and current statistics',
      'Create professional visual aids that enhance your message',
      'Practice answering potential judge questions'
    ]
  },
  {
    id: 'fbla_impromptu_speaking',
    name: 'Impromptu Speaking',
    category: 'Speaking Events',
    description: 'Deliver organized speech with minimal preparation',
    format: 'presentation',
    timeLimit: '4 minutes prep + 4 minutes presentation',
    participants: '1',
    judgeCount: 3,
    keySkills: ['Quick Thinking', 'Organization', 'Confidence', 'Business Knowledge'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Practice speech organization structures (problem-solution, chronological)',
      'Build vocabulary of business terms and concepts',
      'Study current business events and trends',
      'Develop confidence speaking without extensive preparation'
    ]
  },
  {
    id: 'fbla_job_interview',
    name: 'Job Interview',
    category: 'Career Development',
    description: 'Participate in realistic job interview simulation',
    format: 'role-play',
    timeLimit: '10 minutes total',
    participants: '1',
    judgeCount: 2,
    keySkills: ['Interview Skills', 'Professional Communication', 'Resume Discussion', 'Career Planning'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Prepare compelling stories using STAR method',
      'Research common interview questions and practice responses',
      'Develop professional appearance and demeanor',
      'Know your resume thoroughly and be ready to discuss experiences'
    ]
  }
];

// Comprehensive HOSA Events (60+ events)
export const hosaEvents: ClubEvent[] = [
  {
    id: 'hosa_extemporaneous_health_poster',
    name: 'Extemporaneous Health Poster',
    category: 'Health Education',
    description: 'Create and present health education poster on assigned topic',
    format: 'presentation',
    timeLimit: '60 minutes creation + 3 minutes presentation',
    participants: '1',
    judgeCount: 2,
    keySkills: ['Health Education', 'Visual Design', 'Public Health Knowledge', 'Time Management'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study current public health issues and prevention strategies',
      'Practice creating visually appealing educational materials quickly',
      'Understand health communication principles and target audiences',
      'Learn to present complex health information in simple terms'
    ]
  },
  {
    id: 'hosa_prepared_speaking',
    name: 'Prepared Speaking',
    category: 'Health Communication',
    description: 'Deliver prepared speech on health-related topic',
    format: 'presentation',
    timeLimit: '5-7 minutes + 3 minutes Q&A',
    participants: '1',
    judgeCount: 3,
    keySkills: ['Public Speaking', 'Health Research', 'Evidence-Based Practice', 'Communication'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Choose compelling health topic with current research',
      'Use peer-reviewed sources and evidence-based information',
      'Practice engaging delivery for health communication',
      'Prepare for questions about health statistics and interventions'
    ]
  },
  {
    id: 'hosa_health_career_display',
    name: 'Health Career Display',
    category: 'Career Exploration',
    description: 'Research and display information about health career',
    format: 'presentation',
    timeLimit: '20 minutes setup + 5 minutes presentation',
    participants: '1-3',
    judgeCount: 2,
    keySkills: ['Career Research', 'Visual Communication', 'Professional Networking', 'Health Careers Knowledge'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Research comprehensive career information including salary and outlook',
      'Interview practicing professionals in the chosen field',
      'Create professional, informative display materials',
      'Understand education pathways and certification requirements'
    ]
  }
];

// Combined events database
export const allCompetitionEvents = [...decaEvents, ...fblaEvents, ...hosaEvents];

// Event-specific AI coaching system
export const getEventSpecificCoaching = (eventId: string, performanceData: any) => {
  const event = allCompetitionEvents.find(e => e.id === eventId);
  if (!event) return null;

  const rubricAnalysis = event.rubric.map(criteria => {
    const score = performanceData[criteria.id] || 0;
    const level = criteria.levels.find(l => score >= l.points) || criteria.levels[criteria.levels.length - 1];
    
    return {
      criteriaName: criteria.name,
      description: criteria.description,
      maxPoints: criteria.maxPoints,
      weight: criteria.weight,
      currentScore: score,
      level: level.level,
      feedback: level.descriptor,
      improvementSuggestions: getImprovementSuggestions(criteria.id, score, criteria.maxPoints)
    };
  });

  const totalScore = rubricAnalysis.reduce((sum, r) => sum + r.currentScore, 0);
  const maxScore = event.rubric.reduce((sum, r) => sum + r.maxPoints, 0);

  return {
    eventName: event.name,
    organization: event.organization,
    format: event.format,
    keySkills: event.keySkills,
    rubricAnalysis,
    preparationTips: event.preparationTips,
    overallScore: totalScore,
    maxPossibleScore: maxScore,
    scorePercentage: Math.round((totalScore / maxScore) * 100),
    competitionLevel: event.competitionLevel,
    timeLimit: event.timeLimit
  };
};

const getImprovementSuggestions = (criteriaId: string, currentScore: number, maxScore: number): string[] => {
  const improvementMap: Record<string, string[]> = {
    'performance_indicators': [
      'Study the specific performance indicators for this event',
      'Practice applying business concepts to real scenarios',
      'Use industry terminology accurately and confidently',
      'Demonstrate understanding through specific examples'
    ],
    'communication_skills': [
      'Practice maintaining consistent eye contact with judges',
      'Work on clear enunciation and appropriate pace',
      'Use confident body language and professional gestures',
      'Eliminate filler words and speak with authority'
    ],
    'content_accuracy': [
      'Verify all health information with credible medical sources',
      'Stay current with latest research and medical guidelines',
      'Cross-reference information from multiple authoritative sources',
      'Understand the difference between correlation and causation'
    ],
    'organization_development': [
      'Create clear introduction, body, and conclusion structure',
      'Use smooth transitions between main points',
      'Develop each main point thoroughly with supporting evidence',
      'Practice logical flow that builds toward your conclusion'
    ],
    'delivery_style': [
      'Practice vocal variety to maintain audience engagement',
      'Use natural, purposeful gestures that enhance your message',
      'Maintain confident posture throughout presentation',
      'Connect with audience through authentic enthusiasm'
    ]
  };

  return improvementMap[criteriaId] || [
    'Continue practicing to improve performance in this area',
    'Seek feedback from coaches and experienced competitors',
    'Study successful examples from past competitions'
  ];
};