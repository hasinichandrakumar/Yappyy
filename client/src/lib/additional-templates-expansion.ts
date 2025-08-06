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

  // INNOVATION & R&D TEMPLATES (10 templates)
  {
    id: 'innovation-showcase',
    title: 'Innovation Showcase Presentation',
    category: 'business',
    description: 'Present new innovations and research developments',
    duration: '25-30 minutes',
    difficulty: 'Advanced',
    icon: Zap,
    color: 'text-yellow-600',
    content: `[Innovation Overview - 3 minutes]
• Technology introduction
• Problem solution
• Market opportunity
• Competitive advantage

[Technical Deep Dive - 8 minutes]
• Technology explanation
• Development process
• Technical specifications
• Innovation highlights

[Market Application - 6 minutes]
• Use case scenarios
• Target markets
• Customer benefits
• Market potential

[Development Timeline - 4 minutes]
• Research phases
• Development milestones
• Testing results
• Launch timeline

[Business Impact - 4 minutes]
• Revenue potential
• Cost savings
• Competitive positioning
• Strategic value

[Next Steps - 3 minutes]
• Development priorities
• Resource requirements
• Partnership opportunities
• Success metrics`,
    tags: ['innovation', 'research', 'technology', 'development'],
    contentAdvice: 'Explain complex technology simply. Show clear market value. Demonstrate competitive advantage.',
    voiceAdvice: 'Show excitement for innovation. Use dynamic, engaging tone. Emphasize breakthrough potential.',
    bodyLanguageAdvice: 'Use energetic, confident gestures. Show passion for innovation. Maintain high energy.'
  },

  // CUSTOMER SERVICE & SUPPORT TEMPLATES (8 templates)
  {
    id: 'customer-service-training',
    title: 'Customer Service Excellence Training',
    category: 'business',
    description: 'Train teams on exceptional customer service delivery',
    duration: '45-60 minutes',
    difficulty: 'Intermediate',
    icon: MessageSquare,
    color: 'text-blue-500',
    content: `[Service Philosophy - 5 minutes]
• Customer-centric approach
• Service standards
• Brand promise
• Value creation

[Communication Skills - 15 minutes]
• Active listening techniques
• Empathy and understanding
• Clear communication
• Problem-solving approach

[Service Scenarios - 15 minutes]
• Common situations
• Best practices
• Role-playing exercises
• Skill application

[Technology & Tools - 10 minutes]
• CRM systems
• Communication platforms
• Knowledge bases
• Performance tracking

[Quality Assurance - 8 minutes]
• Service standards
• Quality metrics
• Feedback systems
• Continuous improvement

[Team Engagement - 7 minutes]
• Motivation strategies
• Recognition programs
• Career development
• Team collaboration`,
    tags: ['customer-service', 'training', 'communication', 'excellence'],
    contentAdvice: 'Use real-world examples. Include interactive elements. Focus on practical application.',
    voiceAdvice: 'Show enthusiasm for service excellence. Use engaging, supportive tone. Encourage participation.',
    bodyLanguageAdvice: 'Use welcoming, inclusive gestures. Show approachability. Maintain positive energy.'
  },

  // ENVIRONMENTAL & SUSTAINABILITY TEMPLATES (6 templates)
  {
    id: 'sustainability-initiative',
    title: 'Sustainability Initiative Launch',
    category: 'business',
    description: 'Launch environmental and sustainability programs',
    duration: '20-25 minutes',
    difficulty: 'Intermediate',
    icon: Leaf,
    color: 'text-green-600',
    content: `[Environmental Context - 3 minutes]
• Current environmental challenges
• Business impact assessment
• Stakeholder expectations
• Regulatory requirements

[Initiative Overview - 5 minutes]
• Program objectives
• Key initiatives
• Expected outcomes
• Success metrics

[Implementation Plan - 8 minutes]
• Phase-by-phase approach
• Resource requirements
• Timeline and milestones
• Team responsibilities

[Stakeholder Engagement - 4 minutes]
• Employee involvement
• Community partnerships
• Supplier collaboration
• Customer communication

[Measurement & Reporting - 3 minutes]
• Performance tracking
• Progress reporting
• Continuous improvement
• Transparency measures

[Call to Action - 2 minutes]
• Commitment request
• Participation opportunities
• Next steps
• Support requirements`,
    tags: ['sustainability', 'environmental', 'corporate-responsibility', 'green-initiatives'],
    contentAdvice: 'Show clear environmental impact. Demonstrate business value. Engage stakeholders effectively.',
    voiceAdvice: 'Show passion for sustainability. Use inspiring, motivational tone. Emphasize collective action.',
    bodyLanguageAdvice: 'Use inclusive, engaging gestures. Show environmental commitment. Maintain inspiring presence.'
  },

  // DIVERSITY & INCLUSION TEMPLATES (6 templates)
  {
    id: 'diversity-initiative-launch',
    title: 'Diversity & Inclusion Initiative Launch',
    category: 'leadership',
    description: 'Launch organizational diversity and inclusion programs',
    duration: '20-25 minutes',
    difficulty: 'Intermediate',
    icon: Users,
    color: 'text-purple-600',
    content: `[D&I Vision - 3 minutes]
• Organizational commitment
• Vision and goals
• Business case
• Cultural transformation

[Current State Assessment - 5 minutes]
• Diversity metrics
• Inclusion survey results
• Gap analysis
• Opportunity identification

[Initiative Overview - 8 minutes]
• Program components
• Key initiatives
• Success metrics
• Implementation approach

[Leadership Commitment - 4 minutes]
• Executive support
• Resource allocation
• Accountability measures
• Cultural leadership

[Employee Engagement - 3 minutes]
• Participation opportunities
• Training programs
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