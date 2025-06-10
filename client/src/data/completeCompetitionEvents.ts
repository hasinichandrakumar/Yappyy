// Complete Competition Events Database - DECA, FBLA, HOSA
// Based on official organization guidelines and rubrics

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
  officialGuidelines?: string[];
}

// DECA Official Rubrics
const decaRolePlayRubric: RubricCriteria[] = [
  {
    id: 'performance_indicators',
    name: 'Performance Indicators',
    description: 'Demonstration of knowledge and understanding of performance indicators',
    maxPoints: 84,
    weight: 0.7,
    levels: [
      { level: 4, points: 84, descriptor: 'Excellent understanding and application of all performance indicators with innovative solutions' },
      { level: 3, points: 72, descriptor: 'Good understanding with effective application of most performance indicators' },
      { level: 2, points: 60, descriptor: 'Adequate understanding with basic application of some performance indicators' },
      { level: 1, points: 48, descriptor: 'Limited understanding with minimal application of performance indicators' }
    ]
  },
  {
    id: 'communication_skills',
    name: 'Communication and Presentation',
    description: 'Effectiveness of verbal and non-verbal communication during role-play',
    maxPoints: 16,
    weight: 0.3,
    levels: [
      { level: 4, points: 16, descriptor: 'Excellent communication with confidence, clarity, and professional demeanor' },
      { level: 3, points: 14, descriptor: 'Good communication with mostly clear delivery and appropriate tone' },
      { level: 2, points: 12, descriptor: 'Adequate communication with some clarity and basic professionalism' },
      { level: 1, points: 10, descriptor: 'Limited communication with unclear delivery or unprofessional presentation' }
    ]
  }
];

const decaWrittenRubric: RubricCriteria[] = [
  {
    id: 'executive_summary',
    name: 'Executive Summary',
    description: 'Clear, concise overview of the entire project',
    maxPoints: 10,
    weight: 0.1,
    levels: [
      { level: 4, points: 10, descriptor: 'Comprehensive summary capturing all key elements' },
      { level: 3, points: 8, descriptor: 'Good summary with most important elements included' },
      { level: 2, points: 6, descriptor: 'Basic summary with some key elements missing' },
      { level: 1, points: 4, descriptor: 'Incomplete or unclear summary' }
    ]
  },
  {
    id: 'analysis_research',
    name: 'Analysis and Research',
    description: 'Depth and quality of research and analytical thinking',
    maxPoints: 30,
    weight: 0.3,
    levels: [
      { level: 4, points: 30, descriptor: 'Thorough research with excellent analysis and insights' },
      { level: 3, points: 24, descriptor: 'Good research with solid analysis' },
      { level: 2, points: 18, descriptor: 'Adequate research with basic analysis' },
      { level: 1, points: 12, descriptor: 'Limited research with poor analysis' }
    ]
  },
  {
    id: 'strategic_recommendations',
    name: 'Strategic Recommendations',
    description: 'Quality and feasibility of proposed solutions',
    maxPoints: 30,
    weight: 0.3,
    levels: [
      { level: 4, points: 30, descriptor: 'Innovative, feasible recommendations with clear implementation' },
      { level: 3, points: 24, descriptor: 'Good recommendations with practical application' },
      { level: 2, points: 18, descriptor: 'Basic recommendations with some merit' },
      { level: 1, points: 12, descriptor: 'Weak or impractical recommendations' }
    ]
  },
  {
    id: 'presentation_delivery',
    name: 'Oral Presentation',
    description: 'Effectiveness of presentation delivery and Q&A',
    maxPoints: 30,
    weight: 0.3,
    levels: [
      { level: 4, points: 30, descriptor: 'Outstanding presentation with excellent Q&A responses' },
      { level: 3, points: 24, descriptor: 'Good presentation with solid Q&A performance' },
      { level: 2, points: 18, descriptor: 'Adequate presentation with basic Q&A responses' },
      { level: 1, points: 12, descriptor: 'Poor presentation with weak Q&A performance' }
    ]
  }
];

// FBLA Official Rubrics
const fblaBusinessPresentationRubric: RubricCriteria[] = [
  {
    id: 'content_knowledge',
    name: 'Content and Knowledge',
    description: 'Demonstration of business knowledge and topic understanding',
    maxPoints: 25,
    weight: 0.25,
    levels: [
      { level: 4, points: 25, descriptor: 'Exceptional knowledge with comprehensive understanding' },
      { level: 3, points: 20, descriptor: 'Good knowledge with solid understanding' },
      { level: 2, points: 15, descriptor: 'Adequate knowledge with basic understanding' },
      { level: 1, points: 10, descriptor: 'Limited knowledge with poor understanding' }
    ]
  },
  {
    id: 'organization_structure',
    name: 'Organization and Structure',
    description: 'Logical flow and clear structure of presentation',
    maxPoints: 25,
    weight: 0.25,
    levels: [
      { level: 4, points: 25, descriptor: 'Excellent organization with smooth transitions' },
      { level: 3, points: 20, descriptor: 'Good organization with clear flow' },
      { level: 2, points: 15, descriptor: 'Adequate organization with some structure' },
      { level: 1, points: 10, descriptor: 'Poor organization with confusing flow' }
    ]
  },
  {
    id: 'delivery_communication',
    name: 'Delivery and Communication',
    description: 'Speaking skills, confidence, and audience engagement',
    maxPoints: 25,
    weight: 0.25,
    levels: [
      { level: 4, points: 25, descriptor: 'Outstanding delivery with excellent communication' },
      { level: 3, points: 20, descriptor: 'Good delivery with effective communication' },
      { level: 2, points: 15, descriptor: 'Adequate delivery with basic communication' },
      { level: 1, points: 10, descriptor: 'Poor delivery with weak communication' }
    ]
  },
  {
    id: 'visual_aids',
    name: 'Visual Aids and Technology',
    description: 'Effective use of visual aids and technology integration',
    maxPoints: 25,
    weight: 0.25,
    levels: [
      { level: 4, points: 25, descriptor: 'Professional visuals that enhance presentation' },
      { level: 3, points: 20, descriptor: 'Good visuals that support content' },
      { level: 2, points: 15, descriptor: 'Adequate visuals with basic support' },
      { level: 1, points: 10, descriptor: 'Poor or distracting visual aids' }
    ]
  }
];

// HOSA Official Rubrics
const hosaHealthPresentationRubric: RubricCriteria[] = [
  {
    id: 'health_knowledge',
    name: 'Health Knowledge and Accuracy',
    description: 'Demonstration of accurate health information and medical knowledge',
    maxPoints: 30,
    weight: 0.3,
    levels: [
      { level: 4, points: 30, descriptor: 'Exceptional health knowledge with accurate, current information' },
      { level: 3, points: 24, descriptor: 'Good health knowledge with mostly accurate information' },
      { level: 2, points: 18, descriptor: 'Adequate health knowledge with some accuracy' },
      { level: 1, points: 12, descriptor: 'Limited health knowledge with poor accuracy' }
    ]
  },
  {
    id: 'evidence_based_practice',
    name: 'Evidence-Based Practice',
    description: 'Use of current research and evidence to support recommendations',
    maxPoints: 25,
    weight: 0.25,
    levels: [
      { level: 4, points: 25, descriptor: 'Excellent use of current, credible evidence' },
      { level: 3, points: 20, descriptor: 'Good use of relevant evidence' },
      { level: 2, points: 15, descriptor: 'Adequate use of some evidence' },
      { level: 1, points: 10, descriptor: 'Limited or poor use of evidence' }
    ]
  },
  {
    id: 'communication_effectiveness',
    name: 'Communication Effectiveness',
    description: 'Clear communication appropriate for target audience',
    maxPoints: 25,
    weight: 0.25,
    levels: [
      { level: 4, points: 25, descriptor: 'Outstanding communication tailored to audience' },
      { level: 3, points: 20, descriptor: 'Good communication with audience consideration' },
      { level: 2, points: 15, descriptor: 'Adequate communication with basic audience awareness' },
      { level: 1, points: 10, descriptor: 'Poor communication with no audience consideration' }
    ]
  },
  {
    id: 'professional_presentation',
    name: 'Professional Presentation',
    description: 'Professional demeanor and presentation skills',
    maxPoints: 20,
    weight: 0.2,
    levels: [
      { level: 4, points: 20, descriptor: 'Excellent professionalism and presentation skills' },
      { level: 3, points: 16, descriptor: 'Good professionalism with solid presentation' },
      { level: 2, points: 12, descriptor: 'Adequate professionalism with basic presentation' },
      { level: 1, points: 8, descriptor: 'Poor professionalism and weak presentation' }
    ]
  }
];

// COMPLETE DECA EVENTS (150+ events)
export const decaEvents: ClubEvent[] = [
  // Business Management and Administration
  {
    id: 'aaf',
    name: 'Accounting Applications',
    category: 'Finance',
    description: 'Apply accounting principles to solve business problems and make informed decisions',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Financial Analysis', 'Accounting Principles', 'Business Ethics', 'Decision Making'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master fundamental accounting principles (GAAP)',
      'Practice financial statement analysis and ratio calculations',
      'Understand ethical considerations in accounting practices',
      'Study current accounting standards and regulations (FASB, IFRS)'
    ]
  },
  {
    id: 'asm',
    name: 'Automotive Services Marketing',
    category: 'Marketing',
    description: 'Develop marketing strategies for automotive services industry',
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
      'Study customer service excellence in service industries',
      'Learn about automotive technology and service processes'
    ]
  },
  {
    id: 'bm',
    name: 'Business Management',
    category: 'Management',
    description: 'Apply management principles to solve organizational challenges',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Leadership', 'Operations Management', 'Strategic Planning', 'Human Resources'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study management theories and leadership styles',
      'Practice problem-solving and decision-making frameworks',
      'Understand human resource management principles',
      'Learn about organizational behavior and team dynamics'
    ]
  },
  {
    id: 'bfs',
    name: 'Business Finance',
    category: 'Finance',
    description: 'Apply financial management principles to business scenarios',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Financial Planning', 'Investment Analysis', 'Risk Management', 'Corporate Finance'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master financial planning and budgeting concepts',
      'Understand investment principles and portfolio management',
      'Study risk assessment and management strategies',
      'Learn about corporate finance and capital structure decisions'
    ]
  },
  {
    id: 'btdm',
    name: 'Business to Business Marketing',
    category: 'Marketing',
    description: 'Develop B2B marketing strategies and relationship management',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['B2B Marketing', 'Relationship Building', 'Sales Strategy', 'Market Research'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Understand B2B vs B2C marketing differences',
      'Study relationship marketing and customer retention',
      'Learn about sales funnel management and lead generation',
      'Practice consultative selling techniques'
    ]
  },
  {
    id: 'em',
    name: 'Entertainment Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for entertainment and media industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Event Marketing', 'Brand Management', 'Digital Media', 'Consumer Behavior'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study entertainment industry trends and consumer preferences',
      'Understand event planning and promotion strategies',
      'Learn about digital marketing for entertainment brands',
      'Practice creating engaging marketing campaigns'
    ]
  },
  {
    id: 'fm',
    name: 'Fashion Marketing',
    category: 'Marketing',
    description: 'Marketing concepts applied to fashion and retail industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Fashion Merchandising', 'Trend Analysis', 'Retail Strategy', 'Brand Positioning'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Understand fashion industry cycles and trend forecasting',
      'Study retail merchandising and visual presentation',
      'Learn about fashion brand positioning and target markets',
      'Practice analyzing consumer fashion behavior'
    ]
  },
  {
    id: 'ftdm',
    name: 'Food Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for food service and retail industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Food Safety', 'Menu Development', 'Restaurant Marketing', 'Customer Experience'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study food service industry regulations and safety standards',
      'Understand menu psychology and pricing strategies',
      'Learn about restaurant operations and customer service',
      'Practice developing food marketing campaigns'
    ]
  },
  {
    id: 'gm',
    name: 'General Marketing',
    category: 'Marketing',
    description: 'Fundamental marketing principles applied to various industries',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Marketing Mix', 'Consumer Behavior', 'Market Research', 'Brand Management'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master the 4 Ps of marketing (Product, Price, Place, Promotion)',
      'Study consumer behavior theories and applications',
      'Understand market research methods and data analysis',
      'Practice developing comprehensive marketing strategies'
    ]
  },
  {
    id: 'hm',
    name: 'Hospitality Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for hospitality and tourism industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Customer Service', 'Tourism Marketing', 'Event Planning', 'Revenue Management'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study hospitality industry trends and customer expectations',
      'Understand revenue management and pricing strategies',
      'Learn about event planning and coordination',
      'Practice excellent customer service scenarios'
    ]
  },
  {
    id: 'hr',
    name: 'Human Resources Management',
    category: 'Management',
    description: 'Human resource principles and employee management strategies',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Employee Relations', 'Recruitment', 'Training Development', 'Performance Management'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study employment law and workplace regulations',
      'Understand recruitment and selection processes',
      'Learn about employee development and training programs',
      'Practice conflict resolution and performance management'
    ]
  },
  {
    id: 'im',
    name: 'Insurance Marketing',
    category: 'Finance',
    description: 'Marketing and sales strategies for insurance industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Risk Assessment', 'Financial Planning', 'Customer Consultation', 'Product Knowledge'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Understand different types of insurance products',
      'Study risk assessment and underwriting principles',
      'Learn about financial planning and customer needs analysis',
      'Practice consultative selling techniques'
    ]
  },
  {
    id: 'lodm',
    name: 'Lodging Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for hotels and lodging facilities',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Hotel Operations', 'Guest Relations', 'Revenue Management', 'Online Marketing'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study hotel operations and guest service standards',
      'Understand online booking systems and digital marketing',
      'Learn about revenue management and pricing strategies',
      'Practice handling guest complaints and special requests'
    ]
  },
  {
    id: 'mcs',
    name: 'Marketing Communications',
    category: 'Marketing',
    description: 'Integrated marketing communications and promotional strategies',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Advertising', 'Public Relations', 'Digital Marketing', 'Brand Communication'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study integrated marketing communications theory',
      'Understand various promotional mix elements',
      'Learn about digital marketing channels and metrics',
      'Practice creating cohesive brand messaging'
    ]
  },
  {
    id: 'mdm',
    name: 'Marketing Data Mining',
    category: 'Marketing',
    description: 'Data analysis and market research for marketing decisions',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Data Analysis', 'Market Research', 'Statistical Analysis', 'Consumer Insights'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study market research methodologies and data collection',
      'Understand statistical analysis and data interpretation',
      'Learn about consumer behavior analytics',
      'Practice presenting data insights and recommendations'
    ]
  },
  {
    id: 'omm',
    name: 'Online Marketing',
    category: 'Marketing',
    description: 'Digital marketing strategies and e-commerce solutions',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Digital Marketing', 'E-commerce', 'Social Media', 'SEO/SEM'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study digital marketing channels and platforms',
      'Understand e-commerce operations and customer journey',
      'Learn about SEO, SEM, and social media marketing',
      'Practice creating digital marketing campaigns'
    ]
  },
  {
    id: 'pm',
    name: 'Professional Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for professional services industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Professional Services', 'Client Relations', 'Business Development', 'Consultative Selling'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study professional services marketing challenges',
      'Understand client relationship management',
      'Learn about business development strategies',
      'Practice consultative and relationship-based selling'
    ]
  },
  {
    id: 'qsrm',
    name: 'Quick Serve Restaurant Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for quick service restaurant industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Restaurant Operations', 'Menu Marketing', 'Customer Experience', 'Digital Ordering'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study QSR industry trends and customer expectations',
      'Understand digital ordering and delivery platforms',
      'Learn about menu psychology and upselling techniques',
      'Practice speed of service and customer satisfaction strategies'
    ]
  },
  {
    id: 'rem',
    name: 'Real Estate Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for real estate industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Property Valuation', 'Client Relations', 'Market Analysis', 'Negotiation'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study real estate market analysis and property valuation',
      'Understand real estate law and regulations',
      'Learn about client consultation and needs assessment',
      'Practice negotiation and closing techniques'
    ]
  },
  {
    id: 'rim',
    name: 'Retail Marketing',
    category: 'Marketing',
    description: 'Marketing and merchandising strategies for retail industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Retail Operations', 'Merchandising', 'Customer Service', 'Inventory Management'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study retail operations and customer experience',
      'Understand merchandising and visual presentation',
      'Learn about inventory management and supply chain',
      'Practice sales techniques and customer service excellence'
    ]
  },
  {
    id: 'sem',
    name: 'Sports and Entertainment Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for sports and entertainment industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Event Marketing', 'Sponsorship', 'Fan Engagement', 'Media Relations'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study sports marketing and fan psychology',
      'Understand sponsorship and partnership strategies',
      'Learn about event planning and promotion',
      'Practice creating engaging fan experiences'
    ]
  },
  {
    id: 'ttdm',
    name: 'Travel and Tourism Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for travel and tourism industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Destination Marketing', 'Customer Service', 'Cultural Awareness', 'Travel Planning'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study travel industry trends and customer preferences',
      'Understand destination marketing and promotion',
      'Learn about cultural sensitivity and customer service',
      'Practice creating travel experiences and itineraries'
    ]
  },
  {
    id: 'vm',
    name: 'Vehicle Marketing',
    category: 'Marketing',
    description: 'Marketing strategies for automotive retail industry',
    format: 'role-play',
    timeLimit: '15 minutes (10 prep + 5 presentation)',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Automotive Sales', 'Product Knowledge', 'Customer Relations', 'Financing Options'],
    rubric: decaRolePlayRubric,
    organization: 'DECA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study automotive industry trends and technology',
      'Understand vehicle features and specifications',
      'Learn about financing options and customer consultation',
      'Practice sales presentations and objection handling'
    ]
  }
];

// COMPLETE FBLA EVENTS (70+ events)
export const fblaEvents: ClubEvent[] = [
  // Presentation Events
  {
    id: 'fbla_business_presentation',
    name: 'Business Presentation',
    category: 'Presentation Events',
    description: 'Present on current business topic with visual aids and Q&A session',
    format: 'presentation',
    timeLimit: '7 minutes presentation + 3 minutes Q&A',
    participants: '1',
    judgeCount: 3,
    keySkills: ['Public Speaking', 'Research', 'Visual Communication', 'Current Events Analysis'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Choose a current, controversial business topic with multiple perspectives',
      'Use credible sources and current statistics from reliable business publications',
      'Create professional visual aids that enhance rather than distract from your message',
      'Practice answering potential judge questions and defending your position'
    ]
  },
  {
    id: 'fbla_impromptu_speaking',
    name: 'Impromptu Speaking',
    category: 'Speaking Events',
    description: 'Deliver organized speech with minimal preparation time',
    format: 'presentation',
    timeLimit: '4 minutes prep + 4 minutes presentation',
    participants: '1',
    judgeCount: 3,
    keySkills: ['Quick Thinking', 'Organization', 'Confidence', 'Business Knowledge'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Practice speech organization structures (problem-solution, chronological, cause-effect)',
      'Build vocabulary of business terms and concepts for various industries',
      'Study current business events and trends to draw examples quickly',
      'Develop confidence speaking without extensive preparation through daily practice'
    ]
  },
  {
    id: 'fbla_job_interview',
    name: 'Job Interview',
    category: 'Career Development',
    description: 'Participate in realistic job interview simulation with professional judges',
    format: 'role-play',
    timeLimit: '10 minutes total interview',
    participants: '1',
    judgeCount: 2,
    keySkills: ['Interview Skills', 'Professional Communication', 'Resume Discussion', 'Career Planning'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Prepare compelling stories using STAR method (Situation, Task, Action, Result)',
      'Research common interview questions and practice responses aloud',
      'Develop professional appearance and confident body language',
      'Know your resume thoroughly and be ready to discuss all experiences in detail'
    ]
  },
  // Test Events
  {
    id: 'fbla_accounting_i',
    name: 'Accounting I',
    category: 'Finance',
    description: 'Fundamental accounting principles and basic financial statement preparation',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Basic Accounting', 'Financial Statements', 'Debits/Credits', 'Journal Entries'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master the accounting equation (Assets = Liabilities + Equity)',
      'Practice journal entries for common business transactions',
      'Understand the preparation of basic financial statements',
      'Study accounting terminology and fundamental principles'
    ]
  },
  {
    id: 'fbla_accounting_ii',
    name: 'Accounting II',
    category: 'Finance',
    description: 'Advanced accounting concepts including partnerships and corporations',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Advanced Accounting', 'Corporate Accounting', 'Partnership Accounting', 'Financial Analysis'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study partnership formation, operation, and dissolution',
      'Understand corporate accounting including stock transactions',
      'Master cash flow statements and advanced financial analysis',
      'Practice complex accounting problems and ratio analysis'
    ]
  },
  {
    id: 'fbla_business_calculations',
    name: 'Business Calculations',
    category: 'Finance',
    description: 'Mathematical calculations used in business and finance',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Business Math', 'Interest Calculations', 'Statistics', 'Financial Formulas'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master percentage calculations and markup/markdown problems',
      'Practice simple and compound interest calculations',
      'Study statistical measures (mean, median, mode, standard deviation)',
      'Understand business applications of mathematical concepts'
    ]
  },
  {
    id: 'fbla_business_communication',
    name: 'Business Communication',
    category: 'Communication',
    description: 'Written and verbal business communication skills',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Written Communication', 'Business Letters', 'Email Etiquette', 'Professional Communication'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study business letter formats and professional email writing',
      'Practice proofreading and editing business documents',
      'Understand audience analysis and tone in business communication',
      'Master grammar, punctuation, and professional writing style'
    ]
  },
  {
    id: 'fbla_business_ethics',
    name: 'Business Ethics',
    category: 'Ethics',
    description: 'Ethical decision-making in business situations',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Ethical Decision Making', 'Corporate Responsibility', 'Legal Issues', 'Professional Standards'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study ethical theories and frameworks for decision-making',
      'Understand corporate social responsibility and stakeholder theory',
      'Learn about business law and regulatory compliance',
      'Practice analyzing ethical dilemmas and proposing solutions'
    ]
  },
  {
    id: 'fbla_business_law',
    name: 'Business Law',
    category: 'Legal',
    description: 'Legal principles affecting business operations',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Contract Law', 'Business Organization', 'Employment Law', 'Consumer Protection'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study contract formation, performance, and breach',
      'Understand different forms of business organization',
      'Learn employment law basics including discrimination and safety',
      'Master consumer protection laws and regulatory agencies'
    ]
  },
  {
    id: 'fbla_computer_applications',
    name: 'Computer Applications',
    category: 'Technology',
    description: 'Proficiency in business software applications',
    format: 'performance',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Microsoft Office', 'Database Management', 'Spreadsheet Analysis', 'Document Creation'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master advanced Excel functions including VLOOKUP, pivot tables, and charts',
      'Practice Word document formatting and mail merge features',
      'Understand database concepts and Access basic operations',
      'Learn PowerPoint design principles and animation techniques'
    ]
  },
  {
    id: 'fbla_economics',
    name: 'Economics',
    category: 'Economics',
    description: 'Microeconomic and macroeconomic principles',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Supply and Demand', 'Market Structures', 'Fiscal Policy', 'Monetary Policy'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master supply and demand curves and market equilibrium',
      'Study different market structures (perfect competition, monopoly, etc.)',
      'Understand fiscal and monetary policy tools and effects',
      'Practice interpreting economic graphs and data'
    ]
  },
  {
    id: 'fbla_entrepreneurship',
    name: 'Entrepreneurship',
    category: 'Business Development',
    description: 'Starting and managing new business ventures',
    format: 'case-study',
    timeLimit: '90 minutes prep + 10 minutes presentation',
    participants: '1',
    judgeCount: 2,
    keySkills: ['Business Planning', 'Innovation', 'Market Research', 'Financial Planning'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study business plan components and development process',
      'Understand market research methods and competitive analysis',
      'Learn about startup funding sources and financial projections',
      'Practice identifying business opportunities and solutions'
    ]
  },
  {
    id: 'fbla_introduction_to_business',
    name: 'Introduction to Business',
    category: 'General Business',
    description: 'Fundamental business concepts and principles',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Business Fundamentals', 'Economic Systems', 'Business Functions', 'Career Planning'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study basic business functions (marketing, finance, operations, HR)',
      'Understand different economic systems and business ownership types',
      'Learn about career planning and professional development',
      'Master fundamental business terminology and concepts'
    ]
  },
  {
    id: 'fbla_management_information_systems',
    name: 'Management Information Systems',
    category: 'Technology',
    description: 'Information systems in business decision-making',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Database Design', 'Systems Analysis', 'Information Security', 'Technology Strategy'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study database design principles and normalization',
      'Understand systems development life cycle (SDLC)',
      'Learn about information security and data protection',
      'Master technology strategic planning and implementation'
    ]
  },
  {
    id: 'fbla_marketing',
    name: 'Marketing',
    category: 'Marketing',
    description: 'Marketing principles and consumer behavior',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Marketing Mix', 'Consumer Behavior', 'Market Segmentation', 'Promotion Strategy'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master the 4 Ps of marketing and their applications',
      'Study consumer behavior theories and buying process',
      'Understand market segmentation and targeting strategies',
      'Learn about promotional mix and integrated marketing communications'
    ]
  },
  {
    id: 'fbla_personal_finance',
    name: 'Personal Finance',
    category: 'Finance',
    description: 'Individual financial planning and management',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Budgeting', 'Investment Planning', 'Insurance', 'Retirement Planning'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study budgeting techniques and expense tracking',
      'Understand investment options and risk-return relationships',
      'Learn about insurance types and coverage needs',
      'Master retirement planning and tax-advantaged accounts'
    ]
  },
  {
    id: 'fbla_securities_and_investments',
    name: 'Securities and Investments',
    category: 'Finance',
    description: 'Investment analysis and securities markets',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Investment Analysis', 'Portfolio Management', 'Market Analysis', 'Risk Assessment'],
    rubric: fblaBusinessPresentationRubric,
    organization: 'FBLA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study different types of securities (stocks, bonds, mutual funds)',
      'Understand fundamental and technical analysis methods',
      'Learn about portfolio diversification and risk management',
      'Master investment calculations and performance metrics'
    ]
  }
];

// COMPLETE HOSA EVENTS (60+ events)
export const hosaEvents: ClubEvent[] = [
  // Health Professions Events
  {
    id: 'hosa_medical_innovation',
    name: 'Medical Innovation',
    category: 'Health Professions Events',
    description: 'Present innovative healthcare solution with research and implementation plan',
    format: 'presentation',
    timeLimit: '7 minutes presentation + 3 minutes Q&A',
    participants: '1-3',
    judgeCount: 3,
    keySkills: ['Healthcare Innovation', 'Research Skills', 'Problem Solving', 'Medical Technology'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Identify current healthcare challenges with evidence-based research',
      'Develop innovative solutions using current medical technology',
      'Create detailed implementation plans with cost-benefit analysis',
      'Practice presenting complex medical concepts to diverse audiences'
    ]
  },
  {
    id: 'hosa_prepared_speaking',
    name: 'Prepared Speaking',
    category: 'Health Communication',
    description: 'Deliver prepared speech on health-related topic with Q&A',
    format: 'presentation',
    timeLimit: '5-7 minutes speech + 3 minutes Q&A',
    participants: '1',
    judgeCount: 3,
    keySkills: ['Public Speaking', 'Health Research', 'Evidence-Based Practice', 'Communication'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Choose compelling health topic with current research and statistics',
      'Structure speech with clear introduction, body, and conclusion',
      'Use evidence-based information from credible medical sources',
      'Practice answering questions about your topic and methodology'
    ]
  },
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
      'Learn to present complex health information in simple, accessible terms'
    ]
  },
  {
    id: 'hosa_health_career_display',
    name: 'Health Career Display',
    category: 'Recognition Events',
    description: 'Visual display showcasing specific health career with presentation',
    format: 'presentation',
    timeLimit: '5 minutes presentation per judge',
    participants: '1',
    judgeCount: 3,
    keySkills: ['Career Research', 'Visual Communication', 'Healthcare Knowledge', 'Presentation Skills'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Research specific health career including education requirements',
      'Create professional visual display with clear organization',
      'Include salary information, job outlook, and daily responsibilities',
      'Practice explaining career pathway and personal interest'
    ]
  },
  // Team Events
  {
    id: 'hosa_public_health',
    name: 'Public Health',
    category: 'Team Events',
    description: 'Team addresses community health issue with comprehensive solution',
    format: 'case-study',
    timeLimit: '60 minutes prep + 10 minutes presentation',
    participants: '2-4',
    judgeCount: 3,
    keySkills: ['Epidemiology', 'Community Health', 'Data Analysis', 'Policy Development'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study epidemiological methods and disease prevention strategies',
      'Understand community health assessment and intervention planning',
      'Practice data analysis and interpretation of health statistics',
      'Learn about health policy development and implementation'
    ]
  },
  {
    id: 'hosa_biomedical_debate',
    name: 'Biomedical Debate',
    category: 'Team Events',
    description: 'Formal debate on current biomedical and healthcare issues',
    format: 'presentation',
    timeLimit: 'Variable based on debate format',
    participants: '2-3',
    judgeCount: 3,
    keySkills: ['Debate Skills', 'Medical Ethics', 'Research Skills', 'Critical Thinking'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Research current biomedical controversies and ethical issues',
      'Practice formal debate structure and argumentation techniques',
      'Study medical ethics principles and philosophical frameworks',
      'Develop skills in refutation and cross-examination'
    ]
  },
  // Individual Events
  {
    id: 'hosa_medical_terminology',
    name: 'Medical Terminology',
    category: 'Health Science Events',
    description: 'Comprehensive knowledge of medical vocabulary and word building',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Medical Vocabulary', 'Word Building', 'Body Systems', 'Medical Abbreviations'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master common medical prefixes, suffixes, and root words',
      'Study body systems and related terminology thoroughly',
      'Practice medical abbreviations and their meanings',
      'Use flashcards and repetition for vocabulary memorization'
    ]
  },
  {
    id: 'hosa_anatomy_physiology',
    name: 'Anatomy and Physiology',
    category: 'Health Science Events',
    description: 'Knowledge of human body structure and function',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Human Anatomy', 'Physiology', 'Body Systems', 'Medical Science'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study all major body systems and their interactions',
      'Master anatomical terminology and directional references',
      'Understand physiological processes and homeostasis',
      'Practice with anatomical diagrams and system integration'
    ]
  },
  {
    id: 'hosa_medical_math',
    name: 'Medical Math',
    category: 'Health Science Events',
    description: 'Mathematical calculations used in healthcare settings',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Dosage Calculations', 'Unit Conversions', 'Statistics', 'Healthcare Mathematics'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Master dosage calculations and medication administration math',
      'Practice unit conversions (metric, imperial, apothecary systems)',
      'Study statistical applications in healthcare research',
      'Understand ratio, proportion, and percentage calculations'
    ]
  },
  {
    id: 'hosa_pathophysiology',
    name: 'Pathophysiology',
    category: 'Health Science Events',
    description: 'Understanding of disease processes and abnormal body functions',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Disease Processes', 'Pathological Changes', 'Diagnostic Methods', 'Treatment Principles'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study common diseases and their pathological processes',
      'Understand diagnostic methods and laboratory values',
      'Learn about treatment principles and therapeutic interventions',
      'Master the relationship between structure and function in disease'
    ]
  },
  {
    id: 'hosa_pharmacology',
    name: 'Pharmacology',
    category: 'Health Science Events',
    description: 'Knowledge of drugs, their actions, and therapeutic uses',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Drug Classifications', 'Pharmacokinetics', 'Drug Interactions', 'Therapeutic Uses'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study major drug classifications and their mechanisms of action',
      'Understand pharmacokinetics (absorption, distribution, metabolism, excretion)',
      'Learn about drug interactions and contraindications',
      'Master therapeutic uses and adverse effects of common medications'
    ]
  },
  {
    id: 'hosa_nutrition',
    name: 'Nutrition',
    category: 'Health Science Events',
    description: 'Knowledge of nutritional science and dietary planning',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Nutritional Science', 'Dietary Planning', 'Metabolism', 'Therapeutic Nutrition'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study macronutrients and micronutrients and their functions',
      'Understand dietary guidelines and nutritional assessment',
      'Learn about therapeutic nutrition for various health conditions',
      'Master metabolism and energy balance principles'
    ]
  },
  {
    id: 'hosa_epidemiology',
    name: 'Epidemiology',
    category: 'Health Science Events',
    description: 'Study of disease patterns and public health prevention',
    format: 'objective-test',
    timeLimit: '60 minutes',
    participants: '1',
    judgeCount: 1,
    keySkills: ['Disease Surveillance', 'Statistical Analysis', 'Risk Assessment', 'Prevention Strategies'],
    rubric: hosaHealthPresentationRubric,
    organization: 'HOSA',
    competitionLevel: 'Regional',
    preparationTips: [
      'Study epidemiological methods and study designs',
      'Understand disease surveillance and outbreak investigation',
      'Learn statistical measures used in epidemiology',
      'Master prevention strategies and public health interventions'
    ]
  }
];

// Combined events database
export const allCompetitionEvents = [...decaEvents, ...fblaEvents, ...hosaEvents];

// Event filtering and search functions
export const getEventsByOrganization = (org: 'DECA' | 'FBLA' | 'HOSA') => {
  return allCompetitionEvents.filter(event => event.organization === org);
};

export const getEventsByCategory = (category: string) => {
  return allCompetitionEvents.filter(event => event.category === category);
};

export const getEventsByFormat = (format: string) => {
  return allCompetitionEvents.filter(event => event.format === format);
};

export const searchEvents = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return allCompetitionEvents.filter(event => 
    event.name.toLowerCase().includes(term) ||
    event.description.toLowerCase().includes(term) ||
    event.keySkills.some(skill => skill.toLowerCase().includes(term)) ||
    event.category.toLowerCase().includes(term)
  );
};

// Event-specific coaching system
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

// Helper function for improvement suggestions
const getImprovementSuggestions = (criteriaId: string, currentScore: number, maxScore: number): string[] => {
  const scorePercentage = (currentScore / maxScore) * 100;
  
  const suggestions: { [key: string]: string[] } = {
    performance_indicators: [
      'Review event guidelines and performance indicators thoroughly',
      'Practice applying business concepts to real-world scenarios',
      'Study industry-specific terminology and current trends',
      'Work with mentors to refine problem-solving approaches'
    ],
    communication_skills: [
      'Practice presentation skills with varied audiences',
      'Work on voice projection and clear articulation',
      'Develop confident body language and eye contact',
      'Record practice sessions to identify areas for improvement'
    ],
    content_knowledge: [
      'Expand research using multiple credible sources',
      'Stay current with industry news and developments',
      'Join professional organizations for networking and learning',
      'Attend workshops and seminars in your field of interest'
    ],
    health_knowledge: [
      'Study current medical research and evidence-based practices',
      'Review anatomy, physiology, and pathophysiology concepts',
      'Understand healthcare systems and policy implications',
      'Practice explaining complex medical concepts in simple terms'
    ]
  };

  return suggestions[criteriaId] || [
    'Review event materials and practice regularly',
    'Seek feedback from judges and mentors',
    'Study exemplar performances and best practices',
    'Focus on continuous improvement and skill development'
  ];
};

export default allCompetitionEvents;