import { Template } from '@/types/templates';
import { Briefcase, TrendingUp, Target, LineChart, PieChart, Users, ShoppingCart, Rocket, Award, Building2, Handshake, DollarSign, Zap, Globe, Shield, Lightbulb, Crown, Phone, MessageSquare, UserPlus, Layers } from 'lucide-react';

export const businessPitchTemplates: Template[] = [
  {
    id: 'venture-capital-pitch',
    title: 'Venture Capital Pitch Deck',
    category: 'business',
    description: 'A comprehensive pitch template for presenting to venture capital investors',
    duration: '10-12 minutes',
    difficulty: 'Advanced',
    icon: TrendingUp,
    color: 'text-blue-600',
    content: `[Opening - The Vision]
• "Imagine a world where [compelling future vision]..."
• Brief personal story connecting you to the problem
• Attention-grabbing market statistic

[Problem Statement - 60 seconds]
• Clear articulation of the problem
• Market size and pain points
• Cost of the problem (time/money/resources)
• Why now is the right time to solve it

[Solution - 90 seconds]
• Your unique solution
• Key features and benefits
• Product demo or visualization
• Competitive advantages
• Patents or proprietary technology

[Market Opportunity - 60 seconds]
• Total Addressable Market (TAM)
• Serviceable Addressable Market (SAM)
• Serviceable Obtainable Market (SOM)
• Market growth rate and trends
• Customer segmentation

[Business Model - 60 seconds]
• Revenue streams
• Pricing strategy
• Customer acquisition strategy
• Unit economics
• Path to profitability

[Traction & Milestones - 90 seconds]
• Key metrics and growth
• Customer testimonials
• Strategic partnerships
• Awards and recognition
• Future roadmap

[Team - 45 seconds]
• Key team members
• Relevant experience
• Advisory board
• Key hires needed

[Financial Projections - 60 seconds]
• 3-5 year projections
• Key assumptions
• Use of funds
• Expected ROI
• Exit strategy

[Competitive Analysis - 45 seconds]
• Competitive landscape
• Your unique positioning
• Barriers to entry
• Sustainable advantages

[Ask & Closing - 30 seconds]
• Investment amount needed
• Use of funds
• Timeline
• Call to action
• Compelling closing statement`,
    tags: ['venture capital', 'startup', 'investment', 'pitch deck'],
    contentAdvice: 'Focus on storytelling while maintaining professionalism. Use data to support claims but keep emotional connection. Practice transitioning smoothly between sections.',
    voiceAdvice: 'Project confidence and authority. Vary pace to maintain engagement. Slow down for key metrics and speed up for market excitement.',
    bodyLanguageAdvice: 'Stand tall, use purposeful gestures. Make strong eye contact during key statements. Move deliberately between sections.'
  },
  {
    id: 'saas-sales-pitch',
    title: 'SaaS Solution Sales Pitch',
    category: 'sales',
    description: 'Perfect for B2B software sales presentations',
    duration: '15-20 minutes',
    difficulty: 'Intermediate',
    icon: LineChart,
    color: 'text-purple-600',
    content: `[Opening Pattern Interrupt - 30 seconds]
• Industry-specific challenge statement
• Surprising statistic or trend
• Question to engage audience

[Current Landscape - 2 minutes]
• Industry overview
• Common challenges
• Cost of status quo
• Market trends
• Regulatory pressures

[Solution Introduction - 3 minutes]
• High-level solution overview
• Key differentiators
• Core benefits
• Integration capabilities
• Security & compliance

[Feature Demonstration - 5 minutes]
• Live demo or walkthrough
• Key features in action
• User experience highlights
• Administrative capabilities
• Customization options

[ROI Analysis - 3 minutes]
• Cost savings calculation
• Efficiency improvements
• Resource optimization
• Time to value
• Expected outcomes

[Implementation & Support - 2 minutes]
• Onboarding process
• Training resources
• Technical support
• Success team
• SLA commitments

[Social Proof - 2 minutes]
• Case studies
• Client testimonials
• Industry recognition
• Performance metrics
• Success stories

[Investment & Next Steps - 3 minutes]
• Pricing structure
• Package options
• Implementation timeline
• Trial/POC opportunity
• Immediate action items

[Q&A Preparation]
• Technical questions
• Integration queries
• Security concerns
• Pricing clarifications
• Timeline discussions`,
    tags: ['saas', 'software', 'b2b', 'sales'],
    contentAdvice: 'Focus on value proposition and ROI. Use concrete examples and case studies. Address common objections proactively.',
    voiceAdvice: 'Maintain professional enthusiasm. Use strategic pauses after key benefits. Emphasize customer success stories.',
    bodyLanguageAdvice: 'Stay engaged during technical demonstrations. Use hand gestures to illustrate points. Mirror customer energy levels.'
  },
  {
    id: 'product-launch-pitch',
    title: 'Product Launch Presentation',
    category: 'business',
    description: 'Template for introducing a new product to market',
    duration: '20-25 minutes',
    difficulty: 'Intermediate',
    icon: Rocket,
    color: 'text-green-600',
    content: `[Opening Impact - 2 minutes]
• Dramatic product reveal
• Market-changing statement
• Customer pain point story
• Industry transformation vision

[Market Analysis - 3 minutes]
• Market size and growth
• Customer segments
• Buying behaviors
• Competition analysis
• Market gaps

[Product Overview - 5 minutes]
• Key features
• Unique benefits
• Technical specifications
• Design philosophy
• User experience

[Value Proposition - 3 minutes]
• Customer benefits
• Cost savings
• Performance improvements
• Competitive advantages
• Market positioning

[Go-to-Market Strategy - 4 minutes]
• Launch timeline
• Marketing campaigns
• Distribution channels
• Partnership strategy
• Sales approach

[Product Demonstration - 5 minutes]
• Live showcase
• Key features in action
• Use cases
• Customer scenarios
• Integration examples

[Pricing & Packaging - 2 minutes]
• Price points
• Package options
• Volume discounts
• Support tiers
• Special offers

[Success Metrics - 3 minutes]
• KPI targets
• Revenue projections
• Market share goals
• Customer adoption
• Growth timeline

[Call to Action - 3 minutes]
• Next steps
• Early adopter program
• Partner opportunities
• Launch event details
• Contact information`,
    tags: ['product launch', 'go-to-market', 'presentation'],
    contentAdvice: 'Build excitement while maintaining credibility. Use visual aids effectively. Include interactive elements when possible.',
    voiceAdvice: 'Show genuine enthusiasm. Use dynamic vocal range. Create anticipation with strategic pauses.',
    bodyLanguageAdvice: 'Own the stage during product demos. Use expansive gestures for key reveals. Stay high-energy throughout.'
  },
  {
    id: 'investor-update-pitch',
    title: 'Investor Update Presentation',
    category: 'business',
    description: 'Quarterly/Annual update presentation for investors',
    duration: '30-40 minutes',
    difficulty: 'Advanced',
    icon: PieChart,
    color: 'text-indigo-600',
    content: `[Executive Summary - 3 minutes]
• Key achievements
• Financial highlights
• Strategic wins
• Market position
• Growth trajectory

[Financial Performance - 8 minutes]
• Revenue growth
• Profit margins
• Cash flow
• Burn rate
• Unit economics
• Key ratios

[Operational Updates - 5 minutes]
• Team growth
• Product development
• Operational efficiency
• Infrastructure improvements
• Process optimization

[Market & Competition - 5 minutes]
• Market trends
• Competitive landscape
• Market share
• Industry changes
• Regulatory updates

[Customer Metrics - 5 minutes]
• Customer acquisition
• Retention rates
• Satisfaction scores
• Usage statistics
• Success stories

[Strategic Initiatives - 5 minutes]
• Current projects
• Innovation pipeline
• Partnership updates
• Geographic expansion
• New markets

[Risk Management - 4 minutes]
• Key challenges
• Mitigation strategies
• Contingency plans
• Resource allocation
• Risk assessment

[Future Outlook - 5 minutes]
• Growth projections
• Strategic roadmap
• Investment needs
• Expansion plans
• Exit strategy`,
    tags: ['investor relations', 'financial presentation', 'business update'],
    contentAdvice: 'Be transparent with data. Address challenges proactively. Focus on strategic narrative and future opportunities.',
    voiceAdvice: 'Maintain professional tone. Use confident, measured pace. Emphasize key metrics clearly.',
    bodyLanguageAdvice: 'Project confidence during financial discussions. Use precise gestures for data points. Maintain composed presence.'
  },
  {
    id: 'sales-team-pitch',
    title: 'Sales Team Training Pitch',
    category: 'sales',
    description: 'Template for training sales teams on pitch delivery',
    duration: '25-30 minutes',
    difficulty: 'Intermediate',
    icon: Users,
    color: 'text-orange-600',
    content: `[Opening Techniques - 3 minutes]
• Pattern interrupts
• Problem statements
• Engagement questions
• Industry insights
• Value propositions

[Customer Profiling - 4 minutes]
• Ideal customer profile
• Pain points
• Decision criteria
• Buying process
• Common objections

[Solution Positioning - 5 minutes]
• Value proposition
• Key differentiators
• Competitive advantages
• Use cases
• Success stories

[Discovery Questions - 4 minutes]
• Qualification questions
• Need assessment
• Budget discussion
• Timeline exploration
• Decision process

[Demonstration Flow - 5 minutes]
• Demo structure
• Key features
• Benefit articulation
• Customization points
• Technical details

[Handling Objections - 4 minutes]
• Common objections
• Response frameworks
• Evidence points
• Customer testimonials
• ROI calculations

[Closing Techniques - 3 minutes]
• Trial close methods
• Commitment steps
• Next actions
• Follow-up process
• Deal momentum

[Role-Play Scenarios - 2 minutes]
• Customer types
• Situation examples
• Challenge handling
• Success metrics
• Best practices`,
    tags: ['sales training', 'pitch practice', 'team development'],
    contentAdvice: 'Use real examples throughout. Include interactive elements. Build in practice opportunities.',
    voiceAdvice: 'Demonstrate different tones for different situations. Show enthusiasm variation. Practice active listening.',
    bodyLanguageAdvice: 'Model professional presence. Demonstrate rapport-building body language. Show confidence signals.'
  }
];

export const salesPitchTemplates: Template[] = [
  {
    id: 'enterprise-solution-pitch',
    title: 'Enterprise Solution Pitch',
    category: 'sales',
    description: 'High-stakes enterprise sales presentation',
    duration: '45-60 minutes',
    difficulty: 'Advanced',
    icon: Building2,
    color: 'text-slate-600',
    content: `[Executive Introduction - 5 minutes]
• Company overview
• Market leadership
• Enterprise experience
• Notable clients
• Industry expertise

[Problem Landscape - 7 minutes]
• Industry challenges
• Current inefficiencies
• Cost implications
• Risk factors
• Market pressures

[Solution Architecture - 10 minutes]
• Platform overview
• Technical architecture
• Security framework
• Integration capabilities
• Scalability features

[Implementation Approach - 8 minutes]
• Project methodology
• Timeline overview
• Resource requirements
• Risk mitigation
• Change management

[ROI Analysis - 7 minutes]
• Cost-benefit analysis
• Efficiency gains
• Resource optimization
• Revenue impact
• Long-term value

[Security & Compliance - 5 minutes]
• Security features
• Compliance standards
• Data protection
• Audit capabilities
• Privacy measures

[Support & Services - 5 minutes]
• Service levels
• Support structure
• Training program
• Account management
• Success metrics

[Partnership Vision - 5 minutes]
• Strategic alignment
• Growth opportunities
• Innovation roadmap
• Joint success
• Long-term value

[Next Steps - 8 minutes]
• Evaluation process
• Timeline alignment
• Resource planning
• Success criteria
• Action items`,
    tags: ['enterprise', 'solution selling', 'complex sales'],
    contentAdvice: 'Focus on enterprise value and risk mitigation. Use industry-specific examples. Address security and compliance thoroughly.',
    voiceAdvice: 'Maintain executive presence. Use measured, authoritative tone. Demonstrate deep expertise.',
    bodyLanguageAdvice: 'Project senior-level confidence. Use precise, measured gestures. Maintain strong but approachable presence.'
  },
  {
    id: 'retail-buyer-pitch',
    title: 'Retail Buyer Presentation',
    category: 'sales',
    description: 'Pitch template for presenting products to retail buyers',
    duration: '20-25 minutes',
    difficulty: 'Intermediate',
    icon: ShoppingCart,
    color: 'text-pink-600',
    content: `[Product Introduction - 3 minutes]
• Brand story
• Product line overview
• Unique features
• Target customer
• Market positioning

[Market Analysis - 4 minutes]
• Category trends
• Consumer insights
• Market size
• Growth potential
• Competitive landscape

[Product Details - 5 minutes]
• Product specifications
• Materials/ingredients
• Packaging details
• Pricing structure
• Margins analysis

[Sales Performance - 4 minutes]
• Current distribution
• Sales velocity
• Customer feedback
• Market tests
• Success metrics

[Marketing Support - 3 minutes]
• Marketing strategy
• Promotional plans
• Social media presence
• Influencer partnerships
• Brand ambassadors

[Operations & Logistics - 3 minutes]
• Production capacity
• Inventory management
• Shipping logistics
• Lead times
• Minimum orders

[Category Growth - 3 minutes]
• Category impact
• Cross-merchandising
• Seasonal planning
• Display options
• Category innovation

[Partnership Proposal - 5 minutes]
• Terms and conditions
• Pricing structure
• Promotional support
• Launch timeline
• Success metrics`,
    tags: ['retail', 'buyer presentation', 'product pitch'],
    contentAdvice: 'Focus on retail metrics and category growth. Use visual merchandising examples. Address operational details clearly.',
    voiceAdvice: 'Balance professional tone with product enthusiasm. Use clear, concise language. Emphasize key selling points.',
    bodyLanguageAdvice: 'Show product handling confidence. Use engaging product demonstrations. Maintain retail buyer rapport.'
  },
  {
    id: 'partnership-pitch',
    title: 'Strategic Partnership Proposal',
    category: 'business',
    description: 'Template for proposing strategic business partnerships',
    duration: '30-35 minutes',
    difficulty: 'Advanced',
    icon: Handshake,
    color: 'text-cyan-600',
    content: `[Partnership Vision - 5 minutes]
• Shared opportunity
• Market potential
• Combined strengths
• Innovation potential
• Growth vision

[Company Synergies - 5 minutes]
• Complementary capabilities
• Market presence
• Technical expertise
• Customer base
• Resource alignment

[Partnership Structure - 5 minutes]
• Collaboration model
• Roles and responsibilities
• Resource commitment
• Governance structure
• Decision framework

[Market Opportunity - 5 minutes]
• Market analysis
• Growth potential
• Competitive advantage
• Customer benefits
• Revenue potential

[Implementation Plan - 5 minutes]
• Project phases
• Timeline overview
• Resource requirements
• Key milestones
• Success metrics

[Risk Management - 3 minutes]
• Risk assessment
• Mitigation strategies
• Compliance requirements
• Exit provisions
• Contingency plans

[Financial Model - 4 minutes]
• Revenue sharing
• Cost structure
• Investment needs
• ROI projections
• Financial targets

[Next Steps - 3 minutes]
• Agreement process
• Timeline alignment
• Team integration
• Launch planning
• Action items`,
    tags: ['partnership', 'strategic alliance', 'collaboration'],
    contentAdvice: 'Emphasize mutual benefits and synergies. Use clear partnership structure examples. Address risk and reward balance.',
    voiceAdvice: 'Project collaborative tone. Use inclusive language. Demonstrate strategic thinking.',
    bodyLanguageAdvice: 'Show open, collaborative body language. Use inclusive gestures. Maintain professional warmth.'
  },

  // New Business & Sales Pitch Templates
  {
    id: 'elevator-pitch',
    title: 'Elevator Pitch (30-60 seconds)',
    category: 'business',
    description: 'A concise, compelling pitch for networking and quick business introductions',
    duration: '30-60 seconds',
    difficulty: 'Beginner',
    icon: Zap,
    color: 'text-yellow-600',
    content: `[Hook - 5 seconds]
• Start with an intriguing question or surprising statistic
• "Did you know that [relevant statistic]?"
• OR "Have you ever experienced [relatable problem]?"

[Problem/Opportunity - 10 seconds]
• Briefly state the problem you solve
• Make it relatable to your audience
• "Many businesses struggle with [specific issue]..."

[Solution - 15 seconds]
• Your unique solution in simple terms
• Key benefit or value proposition
• "We help [target audience] achieve [specific outcome] by [your method]"

[Credibility - 10 seconds]
• Brief credential or proof point
• "We've already helped [number] companies achieve [specific result]"
• OR mention key clients/achievements

[Call to Action - 10 seconds]
• Clear next step
• "I'd love to show you how this could work for your business"
• "Can we schedule 15 minutes next week to discuss?"
• Ask for their business card or contact information

[Tips for Delivery]
• Speak with confidence and enthusiasm
• Maintain eye contact
• Use gestures naturally
• Practice until it feels conversational
• Adapt based on the listener's interest level`,
    tags: ['networking', 'introduction', 'quick-pitch', 'business-development'],
    contentAdvice: 'Keep it conversational and memorable. Focus on one clear value proposition. Always end with a specific call to action.',
    voiceAdvice: 'Speak with energy and enthusiasm. Vary your pace to maintain interest. Use pauses for emphasis.',
    bodyLanguageAdvice: 'Maintain confident posture. Use open gestures. Make genuine eye contact throughout.'
  },

  {
    id: 'cold-call-sales-pitch',
    title: 'Cold Call Sales Script',
    category: 'sales',
    description: 'Structured approach for effective cold calling and lead generation',
    duration: '2-3 minutes',
    difficulty: 'Intermediate',
    icon: Phone,
    color: 'text-green-600',
    content: `[Opening - 15 seconds]
• "Hi [Name], this is [Your Name] from [Company]"
• "I hope I'm not catching you at a bad time?"
• "I'm calling because [specific reason/trigger event]"

[Permission to Continue - 10 seconds]
• "Do you have 60 seconds for me to explain why I'm calling?"
• "I promise to be brief and respectful of your time"
• Wait for permission before continuing

[Value Proposition - 30 seconds]
• "We help [target audience] [achieve specific outcome]"
• "Specifically, we [unique solution/method]"
• "This typically results in [quantifiable benefit]"

[Credibility Statement - 20 seconds]
• "We recently helped [similar company] achieve [specific result]"
• "In fact, [relevant case study or statistic]"
• Build trust with social proof

[Discovery Question - 15 seconds]
• "How are you currently handling [relevant process/challenge]?"
• "What's your biggest challenge with [relevant area]?"
• Listen actively to their response

[Bridge to Meeting - 30 seconds]
• "Based on what you've shared, I think we could help"
• "I'd like to show you exactly how [specific benefit]"
• "Could we schedule 15 minutes next week for a brief demonstration?"

[Handle Objections - 30 seconds]
• If "Not interested": "I understand. Can I ask what makes you say that?"
• If "No time": "I appreciate your honesty. When would be a better time?"
• If "Already have solution": "That's great. How well is it working for you?"

[Close - 15 seconds]
• "Perfect. I have [specific times] available"
• "I'll send you a calendar invite right after our call"
• "Thank you for your time, [Name]. I look forward to speaking with you"

[Key Success Tips]
• Research the prospect beforehand
• Practice your tone and pacing
• Have your calendar ready
• Follow up immediately with promised materials`,
    tags: ['cold-calling', 'lead-generation', 'phone-sales', 'prospecting'],
    contentAdvice: 'Research prospects thoroughly. Personalize your approach. Focus on value, not features. Always ask permission to continue.',
    voiceAdvice: 'Speak clearly and at moderate pace. Sound friendly but professional. Use the prospect\'s name frequently.',
    bodyLanguageAdvice: 'Even on phone calls, good posture affects your voice. Smile while speaking. Use hand gestures to stay animated.'
  },

  {
    id: 'funding-request-pitch',
    title: 'Bank/Investor Funding Request',
    category: 'business',
    description: 'Professional pitch for securing business loans or investment capital',
    duration: '8-10 minutes',
    difficulty: 'Advanced',
    icon: DollarSign,
    color: 'text-emerald-600',
    content: `[Executive Summary - 60 seconds]
• Brief overview of your business
• Amount of funding requested
• How the funds will be used
• Expected return or repayment timeline

[Business Overview - 90 seconds]
• Company history and background
• Mission and vision statements
• Legal structure and ownership
• Key team members and their qualifications

[Market Analysis - 90 seconds]
• Industry overview and size
• Target market demographics
• Market trends and growth projections
• Competitive landscape analysis

[Business Model & Strategy - 90 seconds]
• Revenue streams and pricing model
• Sales and marketing strategy
• Operations and production plan
• Growth strategy and expansion plans

[Financial Projections - 120 seconds]
• Historical financial performance (if applicable)
• 3-5 year financial projections
• Break-even analysis
• Cash flow projections
• Revenue and profit forecasts

[Funding Request Details - 90 seconds]
• Specific amount needed
• Detailed use of funds breakdown
• Timeline for fund deployment
• Expected impact on business growth

[Risk Assessment - 60 seconds]
• Potential risks and challenges
• Mitigation strategies
• Contingency plans
• Market risks and competition

[ROI and Exit Strategy - 60 seconds]
• Expected return on investment
• Repayment schedule (for loans)
• Exit strategy (for equity investments)
• Potential for future funding rounds

[Team & Management - 60 seconds]
• Key leadership qualifications
• Advisory board members
• Organizational structure
• Succession planning

[Q&A Preparation - 30 seconds]
• "I'm happy to answer any questions"
• "Thank you for considering our funding request"
• Have detailed financial statements ready`,
    tags: ['funding', 'investment', 'loan-application', 'financial-planning'],
    contentAdvice: 'Present realistic financial projections. Address risks honestly. Emphasize team strength. Have backup slides for detailed questions.',
    voiceAdvice: 'Project confidence and competence. Be prepared to defend your numbers. Speak with conviction about your vision.',
    bodyLanguageAdvice: 'Maintain professional demeanor. Use data visualization effectively. Show passion for your business.'
  },

  {
    id: 'customer-retention-pitch',
    title: 'Customer Retention & Upsell Pitch',
    category: 'sales',
    description: 'Strategy for retaining existing customers and expanding account value',
    duration: '5-7 minutes',
    difficulty: 'Intermediate',
    icon: Crown,
    color: 'text-purple-600',
    content: `[Relationship Acknowledgment - 30 seconds]
• "Thank you for being a valued customer for [time period]"
• "I wanted to personally reach out to discuss your experience"
• "Your success is our top priority"

[Performance Review - 90 seconds]
• Review their current results and achievements
• "Since implementing our solution, you've achieved [specific results]"
• Highlight ROI and value delivered
• Compare to their initial goals

[Market Changes & Opportunities - 60 seconds]
• "The industry has evolved since we first worked together"
• "New opportunities have emerged in [relevant area]"
• "Companies like yours are capitalizing on [trend/opportunity]"

[Enhanced Solution Presentation - 120 seconds]
• "We've developed new capabilities that could benefit you"
• "Specifically, [new feature/service] would help you [achieve goal]"
• Present upgraded or additional services
• Focus on incremental value and ROI

[Competitive Advantage - 60 seconds]
• "While competitors are offering [basic solution]"
• "We're providing [advanced capability]"
• "This gives you a significant advantage because [specific benefit]"

[Social Proof - 45 seconds]
• "Other customers in your industry have seen [specific results]"
• Share relevant case studies
• "Companies similar to yours report [improvement metrics]"

[Customized Recommendation - 60 seconds]
• "Based on your specific situation, I recommend [solution]"
• "This would integrate seamlessly with your current setup"
• "Implementation would take [timeframe] with [expected results]"

[Investment Discussion - 45 seconds]
• Present pricing options
• "The investment for this enhancement is [amount]"
• "Based on your current ROI, this should pay for itself in [timeframe]"

[Risk Mitigation - 30 seconds]
• "We're so confident in the results, we offer [guarantee/trial period]"
• "If you don't see [specific improvement] in [timeframe], we'll [remedy]"

[Next Steps - 30 seconds]
• "Shall we schedule a technical review with your team?"
• "I can have our implementation specialist contact you this week"
• "When would be the best time to begin the upgrade process?"`,
    tags: ['customer-retention', 'upselling', 'account-management', 'relationship-building'],
    contentAdvice: 'Start with their success story. Focus on incremental value. Use data to justify expansion. Address implementation concerns.',
    voiceAdvice: 'Speak as a trusted advisor, not a salesperson. Use collaborative language. Show genuine interest in their success.',
    bodyLanguageAdvice: 'Demonstrate partnership through body language. Use inclusive gestures. Lean in during important points.'
  },

  {
    id: 'international-expansion-pitch',
    title: 'International Market Expansion',
    category: 'business',
    description: 'Pitch for expanding business operations into global markets',
    duration: '12-15 minutes',
    difficulty: 'Advanced',
    icon: Globe,
    color: 'text-blue-500',
    content: `[Market Opportunity Overview - 90 seconds]
• Global market size and growth potential
• "The [target region] market for [product/service] is valued at [amount]"
• Growth rate and future projections
• Currency and economic stability factors

[Market Research & Analysis - 120 seconds]
• Demographics and consumer behavior
• Cultural considerations and preferences
• Regulatory environment and compliance requirements
• Distribution channels and market entry barriers

[Competitive Landscape - 90 seconds]
• Current market leaders and their strategies
• Market gaps and opportunities
• Competitive advantages in the new market
• Pricing strategies and positioning

[Entry Strategy - 120 seconds]
• Recommended market entry method (direct, partnership, acquisition)
• Timeline for market entry
• Resource requirements and allocation
• Risk mitigation strategies

[Localization Strategy - 90 seconds]
• Product/service adaptation requirements
• Marketing and branding localization
• Language and cultural considerations
• Local partnerships and hiring needs

[Financial Projections - 120 seconds]
• Investment requirements for expansion
• Revenue projections for Years 1-5
• Break-even timeline
• ROI analysis and profitability metrics

[Implementation Plan - 90 seconds]
• Phase 1: Market entry and setup
• Phase 2: Initial operations and customer acquisition
• Phase 3: Scale and optimization
• Key milestones and success metrics

[Risk Assessment - 90 seconds]
• Political and economic risks
• Currency fluctuation impact
• Regulatory and compliance challenges
• Mitigation strategies and contingency plans

[Resource Requirements - 60 seconds]
• Human resources and hiring plan
• Technology and infrastructure needs
• Marketing and sales budget
• Operational and logistics requirements

[Success Metrics & KPIs - 60 seconds]
• Market share targets
• Revenue and profitability goals
• Customer acquisition metrics
• Timeline for achieving profitability

[ROI and Business Case - 60 seconds]
• Expected return on investment
• Payback period analysis
• Impact on overall business growth
• Strategic long-term benefits

[Next Steps - 30 seconds]
• "I recommend we proceed with [specific action]"
• "Let's schedule a follow-up to discuss implementation details"
• "I'll prepare a detailed market entry plan for your review"`,
    tags: ['international-business', 'market-expansion', 'global-strategy', 'growth-planning'],
    contentAdvice: 'Research cultural nuances thoroughly. Present realistic timelines. Address regulatory complexity. Show understanding of local market dynamics.',
    voiceAdvice: 'Demonstrate global perspective. Use confident, strategic tone. Acknowledge complexity while showing capability.',
    bodyLanguageAdvice: 'Project international business competence. Use maps and visuals effectively. Show cultural sensitivity.'
  },

  {
    id: 'technology-solution-pitch',
    title: 'Technology Solution Sales Pitch',
    category: 'sales',
    description: 'Comprehensive pitch for selling technology products or software solutions',
    duration: '10-12 minutes',
    difficulty: 'Advanced',
    icon: Layers,
    color: 'text-indigo-600',
    content: `[Problem Identification - 90 seconds]
• "Most companies in your industry struggle with [specific tech challenge]"
• Quantify the problem with statistics
• "This typically costs businesses [amount] annually in [lost productivity/revenue]"
• "Have you experienced similar challenges with [relevant process]?"

[Current State Analysis - 60 seconds]
• Review their existing technology stack
• Identify gaps and inefficiencies
• "Your current solution handles [functions] well, but struggles with [limitations]"
• Acknowledge what's working before highlighting problems

[Solution Overview - 120 seconds]
• Introduce your technology solution
• "Our platform addresses these challenges by [core functionality]"
• Key features and capabilities
• Architecture and integration capabilities
• Scalability and future-proofing benefits

[Live Demonstration - 180 seconds]
• "Let me show you exactly how this works"
• Focus on features that solve their specific problems
• Use their data or relevant examples
• Highlight user interface and ease of use
• Show integration with existing systems

[ROI and Business Impact - 90 seconds]
• Quantify the benefits: "Companies typically see [percentage] improvement in [metric]"
• Cost savings analysis: "This usually saves [amount] annually through [specific benefits]"
• Productivity gains and efficiency improvements
• Revenue impact and growth opportunities

[Technical Specifications - 60 seconds]
• Security features and compliance standards
• Performance metrics and reliability statistics
• Integration capabilities and API documentation
• Scalability and customization options

[Implementation Process - 90 seconds]
• Step-by-step implementation timeline
• "Implementation typically takes [timeframe] with these phases"
• Training and onboarding process
• Support and maintenance included
• Migration strategy from current solution

[Customer Success Stories - 90 seconds]
• "Similar companies have achieved [specific results]"
• Relevant case studies with quantified outcomes
• Testimonials from comparable clients
• Before and after metrics

[Pricing and Investment - 60 seconds]
• Transparent pricing structure
• "The investment for your organization would be [amount]"
• Compare to cost of status quo
• "This typically pays for itself in [timeframe] through [savings/gains]"

[Risk Mitigation - 45 seconds]
• "We offer a [trial period/guarantee] to ensure your success"
• Support and training included
• "If you don't see [specific improvement] in [timeframe], we'll [remedy]"

[Competitive Differentiation - 45 seconds]
• "Unlike [competitor], our solution provides [unique advantage]"
• Technology differentiators
• Support and service advantages

[Next Steps - 30 seconds]
• "Based on what we've discussed, I recommend [specific next action]"
• "Shall we schedule a technical evaluation with your IT team?"
• "I can provide a customized proposal by [specific date]"`,
    tags: ['technology-sales', 'software-solution', 'B2B-tech', 'solution-selling'],
    contentAdvice: 'Focus on business outcomes, not just features. Use live demos effectively. Quantify ROI clearly. Address technical concerns proactively.',
    voiceAdvice: 'Balance technical knowledge with business acumen. Speak their language, not tech jargon. Show expertise without overwhelming.',
    bodyLanguageAdvice: 'Use technology confidently during demos. Maintain engagement during technical sections. Show comfort with complexity.'
  },

  {
    id: 'crisis-management-pitch',
    title: 'Crisis Management & Recovery Plan',
    category: 'business',
    description: 'Strategic pitch for navigating business crises and implementing recovery plans',
    duration: '8-10 minutes',
    difficulty: 'Advanced',
    icon: Shield,
    color: 'text-red-600',
    content: `[Crisis Assessment - 90 seconds]
• Current situation analysis
• "We're facing [specific crisis] which has resulted in [impact]"
• Immediate risks and potential consequences
• Timeline and urgency factors

[Stakeholder Impact Analysis - 60 seconds]
• Impact on customers and customer satisfaction
• Employee morale and retention concerns
• Investor and financial market implications
• Supplier and partner relationship effects

[Immediate Action Plan - 90 seconds]
• Critical actions required in next 24-48 hours
• "Our immediate priorities are [list top 3 actions]"
• Resource allocation and team responsibilities
• Communication strategy for stakeholders

[Root Cause Analysis - 60 seconds]
• Identify underlying causes of the crisis
• "This situation arose due to [specific factors]"
• Systemic issues that need addressing
• Lessons learned and prevention strategies

[Recovery Strategy - 120 seconds]
• Short-term stabilization plan (1-3 months)
• Medium-term recovery initiatives (3-12 months)
• Long-term strengthening measures (1-3 years)
• Key milestones and success metrics

[Financial Impact & Recovery - 90 seconds]
• Quantify financial impact of the crisis
• "We estimate [amount] in immediate costs and [amount] in lost revenue"
• Recovery budget and resource requirements
• Timeline for return to profitability

[Communication Plan - 60 seconds]
• Internal communication strategy
• External stakeholder messaging
• Media relations and public statements
• Regular update schedule and transparency measures

[Risk Mitigation - 60 seconds]
• Identify and address remaining risks
• Contingency plans for potential setbacks
• Early warning systems for future crises
• Insurance and legal considerations

[Team & Leadership - 45 seconds]
• Crisis management team structure
• Leadership roles and responsibilities
• External advisors and consultants needed
• Decision-making processes and authority

[Monitoring & Evaluation - 45 seconds]
• Key performance indicators for recovery
• Regular review and adjustment processes
• Success metrics and benchmarks
• Reporting and accountability measures

[Long-term Strengthening - 60 seconds]
• Organizational improvements and resilience building
• Process and system upgrades
• Culture and training enhancements
• Competitive positioning post-recovery

[Call to Action - 30 seconds]
• "I need your support and commitment to this plan"
• "Let's begin implementation immediately with [specific first step]"
• "Together, we'll emerge from this crisis stronger than before"`,
    tags: ['crisis-management', 'business-recovery', 'strategic-planning', 'leadership'],
    contentAdvice: 'Be honest about the situation. Present clear action plans. Focus on recovery and prevention. Show strong leadership.',
    voiceAdvice: 'Project calm confidence and authority. Acknowledge difficulty while inspiring confidence. Use decisive language.',
    bodyLanguageAdvice: 'Demonstrate strong, steady leadership. Use commanding presence. Show resolve and determination.'
  }
];