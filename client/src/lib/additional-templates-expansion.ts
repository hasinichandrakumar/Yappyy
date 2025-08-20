import { Template } from '@/types/templates';
import { 
  TrendingUp, Users, Rocket, Award, Building2, Handshake, DollarSign, Zap, 
  Lightbulb, Crown, MessageSquare, GraduationCap, Heart, Video, Brain,
  Megaphone, Trophy, Home, Star, Scale, Leaf, Palette, Music, Camera
} from 'lucide-react';

// Additional templates to expand the collection to 150+
export const additionalTemplatesExpansion: Template[] = [
  // FINANCE & INVESTMENT TEMPLATES (12 templates)
  {
    id: 'investment-portfolio-review',
    title: 'Investment Portfolio Review',
    category: 'business',
    description: 'Comprehensive portfolio analysis and recommendations',
    duration: '30-45 minutes',
    difficulty: 'Advanced',
    icon: TrendingUp,
    color: 'text-emerald-600',
    content: `[Portfolio Overview - 5 minutes]
• Current asset allocation
• Performance summary
• Risk assessment
• Investment objectives review

[Market Analysis - 8 minutes]
• Economic environment overview
• Sector performance analysis
• Global market trends
• Interest rate impact

[Performance Attribution - 10 minutes]
• Return decomposition
• Risk-adjusted metrics
• Benchmark comparison
• Factor analysis results

[Risk Assessment - 7 minutes]
• Portfolio risk metrics
• Stress testing results
• Correlation analysis
• Diversification assessment

[Recommendations - 10 minutes]
• Rebalancing suggestions
• New investment opportunities
• Risk management strategies
• Implementation timeline

[Q&A Session - 5 minutes]
• Client questions
• Strategy clarification
• Next steps discussion
• Follow-up planning`,
    tags: ['investment', 'portfolio', 'finance', 'wealth-management'],
    contentAdvice: 'Use clear data visualization. Explain complex concepts simply. Focus on actionable recommendations.',
    voiceAdvice: 'Maintain professional authority. Use measured pace for financial data. Show confidence in analysis.',
    bodyLanguageAdvice: 'Use precise gestures for data points. Maintain professional presence. Show expertise confidence.'
  },

  // EDUCATION & TRAINING TEMPLATES (15 templates)
  {
    id: 'workshop-facilitation',
    title: 'Interactive Workshop Facilitation',
    category: 'academic',
    description: 'Lead engaging educational workshops and training sessions',
    duration: '60-90 minutes',
    difficulty: 'Intermediate',
    icon: Users,
    color: 'text-blue-600',
    content: `[Workshop Introduction - 5 minutes]
• Welcome and icebreaker
• Learning objectives overview
• Agenda and timeline
• Participant expectations

[Content Delivery - 30 minutes]
• Key concepts presentation
• Interactive demonstrations
• Real-world examples
• Best practices sharing

[Group Activities - 20 minutes]
• Hands-on exercises
• Collaborative projects
• Peer learning opportunities
• Skill practice sessions

[Discussion & Q&A - 10 minutes]
• Participant questions
• Group discussions
• Knowledge sharing
• Clarification opportunities

[Application & Practice - 15 minutes]
• Practical applications
• Role-playing scenarios
• Case study analysis
• Skill reinforcement

[Wrap-up & Next Steps - 10 minutes]
• Key takeaways summary
• Action planning
• Resource sharing
• Follow-up commitments`,
    tags: ['workshop', 'training', 'education', 'facilitation'],
    contentAdvice: 'Balance content delivery with interaction. Use varied teaching methods. Encourage participation.',
    voiceAdvice: 'Maintain energy throughout. Use clear, engaging tone. Vary pace for different activities.',
    bodyLanguageAdvice: 'Move around the room. Use inclusive gestures. Maintain eye contact with participants.'
  },

  // CONSULTING & ADVISORY TEMPLATES (10 templates)
  {
    id: 'consulting-recommendations',
    title: 'Consulting Recommendations Presentation',
    category: 'business',
    description: 'Present strategic consulting findings and recommendations',
    duration: '45-60 minutes',
    difficulty: 'Advanced',
    icon: Lightbulb,
    color: 'text-amber-600',
    content: `[Executive Summary - 5 minutes]
• Key findings overview
• Strategic recommendations
• Expected outcomes
• Implementation timeline

[Current State Analysis - 10 minutes]
• Situation assessment
• Problem identification
• Root cause analysis
• Impact assessment

[Strategic Options - 15 minutes]
• Alternative approaches
• Pros and cons analysis
• Risk assessment
• Cost-benefit analysis

[Recommended Solution - 10 minutes]
• Preferred approach
• Implementation strategy
• Resource requirements
• Success metrics

[Implementation Plan - 10 minutes]
• Phase-by-phase approach
• Timeline and milestones
• Resource allocation
• Risk mitigation

[Next Steps - 5 minutes]
• Immediate actions
• Decision requirements
• Follow-up process
• Success measurement`,
    tags: ['consulting', 'strategy', 'recommendations', 'implementation'],
    contentAdvice: 'Focus on actionable insights. Use data to support recommendations. Address implementation challenges.',
    voiceAdvice: 'Project expertise and confidence. Use clear, authoritative tone. Emphasize strategic value.',
    bodyLanguageAdvice: 'Use confident, professional gestures. Maintain executive presence. Show strategic thinking.'
  },

  // STARTUP & ENTREPRENEURSHIP TEMPLATES (12 templates)
  {
    id: 'startup-pitch-deck',
    title: 'Startup Pitch Deck Presentation',
    category: 'business',
    description: 'Comprehensive startup pitch for investors and stakeholders',
    duration: '15-20 minutes',
    difficulty: 'Advanced',
    icon: Rocket,
    color: 'text-purple-600',
    content: `[Problem Statement - 2 minutes]
• Market pain point identification
• Problem magnitude
• Current solutions gap
• Opportunity size

[Solution Overview - 3 minutes]
• Product/service description
• Unique value proposition
• Competitive advantages
• Technology innovation

[Market Opportunity - 3 minutes]
• Market size analysis
• Target customer segments
• Growth potential
• Market timing

[Business Model - 3 minutes]
• Revenue streams
• Pricing strategy
• Customer acquisition
• Unit economics

[Traction & Validation - 3 minutes]
• Key metrics
• Customer testimonials
• Partnerships
• Achievements

[Team & Execution - 2 minutes]
• Team background
• Execution capability
• Advisory board
• Hiring plan

[Financial Projections - 2 minutes]
• Revenue projections
• Funding requirements
• Use of funds
• Exit strategy

[Ask & Closing - 1 minute]
• Investment ask
• Next steps
• Contact information
• Compelling close`,
    tags: ['startup', 'pitch-deck', 'entrepreneurship', 'fundraising'],
    contentAdvice: 'Tell a compelling story. Focus on market opportunity. Show clear path to success.',
    voiceAdvice: 'Show passion and confidence. Use dynamic delivery. Emphasize key metrics.',
    bodyLanguageAdvice: 'Use energetic, confident gestures. Maintain high energy. Show entrepreneurial spirit.'
  },

  // DIVERSITY & INCLUSION TEMPLATES (6 templates)
  {
    id: 'diversity-training-workshop',
    title: 'Diversity & Inclusion Training Workshop',
    category: 'leadership',
    description: 'Conduct comprehensive diversity and inclusion training sessions',
    duration: '30-40 minutes',
    difficulty: 'Intermediate',
    icon: Users,
    color: 'text-purple-600',
    content: `[Workshop Introduction - 3 minutes]
• Training objectives
• Ground rules
• Safe space guidelines
• Participant expectations

[Unconscious Bias Training - 8 minutes]
• Bias awareness
• Impact on decision-making
• Self-reflection exercises
• Mitigation strategies

[Inclusive Communication - 10 minutes]
• Language awareness
• Cultural sensitivity
• Active listening skills
• Respectful dialogue

[Building Inclusive Teams - 8 minutes]
• Team dynamics
• Psychological safety
• Valuing differences
• Collaboration strategies

[Action Planning - 6 minutes]
• Personal commitments
• Team initiatives
• Organizational goals
• Accountability measures

[Resources & Follow-up - 5 minutes]
• Additional training
• Support systems
• Measurement tools
• Resource groups
• Recognition programs

[Measurement & Progress - 2 minutes]
• Progress tracking
• Regular reporting
• Continuous improvement
• Long-term commitment`,
    tags: ['diversity', 'inclusion', 'organizational-culture', 'leadership'],
    contentAdvice: 'Show genuine commitment. Use inclusive language. Address challenges honestly.',
    voiceAdvice: 'Show authentic commitment. Use inclusive, welcoming tone. Emphasize collective responsibility.',
    bodyLanguageAdvice: 'Use inclusive, welcoming gestures. Show genuine commitment. Maintain approachable presence.'
  },

  // CREATIVE & ARTS TEMPLATES (8 templates)
  {
    id: 'art-gallery-opening',
    title: 'Art Gallery Opening Speech',
    category: 'creative',
    description: 'Present at art gallery openings and exhibitions',
    duration: '8-10 minutes',
    difficulty: 'Intermediate',
    icon: Palette,
    color: 'text-pink-600',
    content: `[Welcome & Introduction - 2 minutes]
• Welcome guests and artists
• Exhibition overview
• Gallery mission
• Cultural significance

[Artist Introduction - 3 minutes]
• Artist background
• Creative journey
• Inspiration sources
• Artistic philosophy

[Exhibition Overview - 3 minutes]
• Theme and concept
• Featured works
• Artistic techniques
• Cultural context

[Artistic Impact - 2 minutes]
• Cultural significance
• Social commentary
• Emotional resonance
• Community impact

[Closing & Celebration - 1 minute]
• Thank you to supporters
• Exhibition details
• Future events
• Celebration invitation`,
    tags: ['art', 'gallery', 'creative', 'cultural'],
    contentAdvice: 'Show passion for art. Connect with audience emotionally. Highlight cultural significance.',
    voiceAdvice: 'Use expressive, passionate tone. Vary pace for dramatic effect. Show artistic appreciation.',
    bodyLanguageAdvice: 'Use expressive gestures. Show genuine enthusiasm. Connect with audience personally.'
  },

  // MUSIC & PERFORMANCE TEMPLATES (6 templates)
  {
    id: 'concert-introduction',
    title: 'Concert Introduction Speech',
    category: 'creative',
    description: 'Introduce musical performances and concerts',
    duration: '3-5 minutes',
    difficulty: 'Beginner',
    icon: Music,
    color: 'text-indigo-600',
    content: `[Welcome & Atmosphere - 1 minute]
• Welcome audience
• Set performance mood
• Venue appreciation
• Excitement building

[Artist/Group Introduction - 2 minutes]
• Artist background
• Musical journey
• Performance highlights
• Special achievements

[Performance Preview - 1 minute]
• Set list overview
• Musical highlights
• Special moments
• Audience participation

[Closing & Performance - 1 minute]
• Performance introduction
• Audience engagement
• Enjoyment wishes
• Performance start`,
    tags: ['music', 'concert', 'performance', 'entertainment'],
    contentAdvice: 'Build excitement. Connect with audience. Keep it concise and engaging.',
    voiceAdvice: 'Use energetic, enthusiastic tone. Build excitement. Connect with audience energy.',
    bodyLanguageAdvice: 'Use dynamic gestures. Show enthusiasm. Match audience energy level.'
  },

  // PHOTOGRAPHY & VISUAL ARTS TEMPLATES (6 templates)
  {
    id: 'photography-exhibition',
    title: 'Photography Exhibition Presentation',
    category: 'creative',
    description: 'Present photography exhibitions and visual storytelling',
    duration: '10-15 minutes',
    difficulty: 'Intermediate',
    icon: Camera,
    color: 'text-gray-600',
    content: `[Exhibition Overview - 2 minutes]
• Theme and concept
• Photographer introduction
• Exhibition journey
• Visual storytelling

[Technical Approach - 3 minutes]
• Photography techniques
• Equipment and process
• Artistic choices
• Technical innovation

[Storytelling Elements - 4 minutes]
• Narrative structure
• Emotional impact
• Cultural significance
• Personal connection

[Visual Impact - 3 minutes]
• Composition analysis
• Lighting techniques
• Color and mood
• Viewer experience

[Closing & Reflection - 2 minutes]
• Artistic vision
• Impact assessment
• Future projects
• Thank you message`,
    tags: ['photography', 'visual-arts', 'exhibition', 'storytelling'],
    contentAdvice: 'Connect visual elements with narrative. Show technical understanding. Emphasize storytelling.',
    voiceAdvice: 'Use descriptive, engaging tone. Vary pace for visual impact. Show artistic appreciation.',
    bodyLanguageAdvice: 'Use descriptive gestures. Point to visual elements. Show genuine appreciation.'
  }
];

export default additionalTemplatesExpansion; 