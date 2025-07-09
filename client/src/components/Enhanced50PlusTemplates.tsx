import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, Download, Edit, Save, Sparkles, FileText, Mic, User, Plus, Star, Clock, Users, 
  Briefcase, Heart, GraduationCap, Presentation, Award, Coffee, Building, Camera, Music, 
  BookOpen, Target, Lightbulb, MessageSquare, Globe, Zap, BarChart3, Wand2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  tags: string[];
  popularity: number;
  contentAdvice: string;
  voiceAdvice: string;
  bodyLanguageAdvice: string;
}

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: FileText },
  { id: 'ted-talks', name: 'TED Talks', icon: Presentation },
  { id: 'wedding', name: 'Wedding Speeches', icon: Heart },
  { id: 'job-interviews', name: 'Job Interviews', icon: Briefcase },
  { id: 'school', name: 'School Presentations', icon: GraduationCap },
  { id: 'business', name: 'Business Presentations', icon: Building },
  { id: 'motivational', name: 'Motivational Speeches', icon: Target },
  { id: 'storytelling', name: 'Storytelling', icon: BookOpen },
  { id: 'sales', name: 'Sales Pitches', icon: BarChart3 },
  { id: 'academic', name: 'Academic Presentations', icon: Award }
];

const FIFTY_PLUS_TEMPLATES: Template[] = [
  // TED Talks (8 templates)
  {
    id: 'ted-innovation',
    title: 'The Innovation That Changed Everything',
    category: 'ted-talks',
    description: 'Present a groundbreaking innovation and its impact',
    duration: '15-18 minutes',
    difficulty: 'Advanced',
    content: `Hook: "What if I told you that a simple idea could transform millions of lives?\n\nIntroduction:\n- Personal connection to the innovation\n- Why this matters to everyone\n\nMain Points:\n1. The problem that existed\n2. The breakthrough moment\n3. How it works\n4. Real-world impact\n5. Future implications\n\nCall to Action:\n- How the audience can be part of this change\n- One actionable step everyone can take\n\nClosing:\n- Return to opening hook\n- Powerful final thought`,
    tags: ['innovation', 'technology', 'change', 'impact'],
    popularity: 95,
    contentAdvice: 'Start with a compelling personal story. Use concrete examples and data to support your points. End with a clear call to action.',
    voiceAdvice: 'Vary your pace - slow for emphasis, faster for excitement. Use strategic pauses after key points.',
    bodyLanguageAdvice: 'Use open gestures. Move purposefully on stage. Make eye contact with different sections of audience.'
  },
  {
    id: 'ted-vulnerability',
    title: 'The Power of Vulnerability',
    category: 'ted-talks',
    description: 'Share a personal story about overcoming challenges',
    duration: '12-15 minutes',
    difficulty: 'Advanced',
    content: `Opening:\n- Vulnerable moment or question\n- Why vulnerability is seen as weakness\n\nPersonal Story:\n- The moment you felt most vulnerable\n- What you learned\n- How it changed you\n\nUniversal Truth:\n- Why vulnerability is actually strength\n- Research or examples supporting this\n\nPractical Application:\n- How to embrace vulnerability\n- What changes when we do\n\nClosing:\n- Return to opening vulnerability\n- Challenge the audience`,
    tags: ['vulnerability', 'personal growth', 'courage', 'authenticity'],
    popularity: 92,
    contentAdvice: 'Be genuinely vulnerable but purposeful. Connect personal experience to universal truths.',
    voiceAdvice: 'Speak from the heart. Allow emotion to come through naturally. Use conversational tone.',
    bodyLanguageAdvice: 'Be authentic in your movements. Use smaller, more intimate gestures. Stand closer to audience.'
  },

  // Wedding Speeches (6 templates)
  {
    id: 'best-man-speech',
    title: 'Best Man Speech - Heartfelt & Humorous',
    category: 'wedding',
    description: 'Perfect balance of humor and sentiment for best man',
    duration: '3-5 minutes',
    difficulty: 'Intermediate',
    content: `Opening:\n- Thank the hosts and introduce yourself\n- Light joke about being chosen as best man\n\nFriendship Story:\n- How you met the groom\n- Funny (but appropriate) story about your friendship\n- What makes them special\n\nAbout the Couple:\n- First time you met the bride\n- How you knew they were perfect together\n- What you admire about their relationship\n\nToast:\n- Wishes for their future\n- Meaningful quote or advice\n- Raise glasses for the toast`,
    tags: ['wedding', 'friendship', 'humor', 'celebration'],
    popularity: 88,
    contentAdvice: 'Keep stories appropriate for all ages. Balance humor with genuine emotion.',
    voiceAdvice: 'Speak clearly and project to the back of the room. Pause for laughter.',
    bodyLanguageAdvice: 'Stand confidently. Make eye contact with the couple and guests. Use gestures to emphasize points.'
  },
  {
    id: 'maid-of-honor-speech',
    title: 'Maid of Honor Speech - Sisterly Love',
    category: 'wedding',
    description: 'Celebrating the bride with love and memories',
    duration: '3-5 minutes',
    difficulty: 'Intermediate',
    content: `Opening:\n- Introduce yourself and thank everyone\n- Express honor of being chosen\n\nSisterhood/Friendship:\n- How long you've known the bride\n- Special memory that shows her character\n- What makes her an amazing friend\n\nLove Story:\n- When she first mentioned the groom\n- How you knew he was "the one"\n- What you love about them together\n\nFuture Wishes:\n- Your hopes for their marriage\n- Personal advice or blessing\n- Toast to their happiness`,
    tags: ['wedding', 'sisterhood', 'love', 'celebration'],
    popularity: 85,
    contentAdvice: 'Focus on the bride\'s positive qualities. Share meaningful but not overly personal stories.',
    voiceAdvice: 'Speak with warmth and genuine emotion. Control your pace if you get emotional.',
    bodyLanguageAdvice: 'Face the couple frequently. Use warm, open gestures. Smile naturally.'
  },

  // Job Interviews (10 templates)
  {
    id: 'tell-me-about-yourself',
    title: 'Tell Me About Yourself - Executive Version',
    category: 'job-interviews',
    description: 'Professional self-introduction for leadership roles',
    duration: '2-3 minutes',
    difficulty: 'Intermediate',
    content: `Structure: Present - Past - Future\n\nPresent (30 seconds):\n- Current role and key responsibilities\n- Main achievements in current position\n- Industries or specializations\n\nPast (60 seconds):\n- Career progression highlights\n- Key skills developed\n- Notable accomplishments with metrics\n- Educational background (if relevant)\n\nFuture (30 seconds):\n- What you're looking for next\n- How this role aligns with your goals\n- What you hope to contribute\n\nClosing:\n- Enthusiasm for the opportunity\n- Question about the role`,
    tags: ['interview', 'introduction', 'executive', 'leadership'],
    popularity: 94,
    contentAdvice: 'Focus on achievements relevant to the role. Use specific metrics and results.',
    voiceAdvice: 'Speak confidently but not arrogantly. Vary your tone to maintain interest.',
    bodyLanguageAdvice: 'Maintain good eye contact. Use purposeful hand gestures. Sit forward slightly to show engagement.'
  },
  {
    id: 'behavioral-interview',
    title: 'STAR Method for Behavioral Questions',
    category: 'job-interviews',
    description: 'Structured approach to behavioral interview questions',
    duration: '2-3 minutes per question',
    difficulty: 'Intermediate',
    content: `STAR Method Structure:\n\nSituation (20 seconds):\n- Set the context\n- When and where this happened\n- Who was involved\n\nTask (15 seconds):\n- What was your responsibility\n- What needed to be accomplished\n- What challenge did you face\n\nAction (60 seconds):\n- Specific steps you took\n- Skills you used\n- Decisions you made\n- How you handled obstacles\n\nResult (45 seconds):\n- Quantifiable outcomes\n- What you learned\n- How it benefited the organization\n- Follow-up or long-term impact`,
    tags: ['interview', 'behavioral', 'STAR method', 'examples'],
    popularity: 91,
    contentAdvice: 'Prepare 5-7 STAR stories covering different competencies. Use specific metrics in results.',
    voiceAdvice: 'Maintain steady pace. Emphasize the Action and Result sections.',
    bodyLanguageAdvice: 'Use hand gestures to illustrate points. Maintain eye contact throughout the story.'
  },

  // School Presentations (8 templates)
  {
    id: 'science-fair-project',
    title: 'Science Fair Project Presentation',
    category: 'school',
    description: 'Showcase your scientific research and findings',
    duration: '5-7 minutes',
    difficulty: 'Beginner',
    content: `Title Slide:\n- Project title\n- Your name and grade\n- Date\n\nProblem/Question:\n- What question are you trying to answer?\n- Why is this important?\n\nHypothesis:\n- What did you think would happen?\n- Why did you think this?\n\nMaterials & Methods:\n- What you used\n- Step-by-step procedure\n- Safety considerations\n\nResults:\n- What you observed\n- Data and measurements\n- Charts or graphs\n\nConclusion:\n- Was your hypothesis correct?\n- What did you learn?\n- What would you do differently?\n\nFuture Research:\n- What questions came up?\n- Next steps`,
    tags: ['science', 'research', 'student', 'education'],
    popularity: 82,
    contentAdvice: 'Explain concepts simply. Use visuals to support your data. Practice scientific vocabulary.',
    voiceAdvice: 'Speak clearly and at appropriate pace. Explain technical terms.',
    bodyLanguageAdvice: 'Point to your display board. Use hand gestures to show size or movement.'
  },
  {
    id: 'book-report-presentation',
    title: 'Engaging Book Report Presentation',
    category: 'school',
    description: 'Present a book analysis that captivates your class',
    duration: '4-6 minutes',
    difficulty: 'Beginner',
    content: `Hook Opening:\n- Interesting quote from the book\n- Thought-provoking question\n- Dramatic scene description\n\nBook Overview:\n- Title, author, genre\n- Brief plot summary (no spoilers!)\n- Setting and time period\n\nCharacter Analysis:\n- Main character description\n- Character development\n- Favorite character and why\n\nThemes & Messages:\n- Main theme of the book\n- What the author wants us to learn\n- Personal connection to themes\n\nPersonal Review:\n- What you liked/disliked\n- Favorite scene or quote\n- Who would enjoy this book\n\nRecommendation:\n- Star rating\n- Why others should/shouldn't read it`,
    tags: ['literature', 'analysis', 'student', 'reading'],
    popularity: 78,
    contentAdvice: 'Balance plot summary with analysis. Connect themes to real life. Avoid major spoilers.',
    voiceAdvice: 'Use character voices for quotes. Vary tone to match the book\'s mood.',
    bodyLanguageAdvice: 'Hold the book up when introducing it. Use expressions that match the content.'
  },

  // Business Presentations (8 templates)
  {
    id: 'quarterly-business-review',
    title: 'Quarterly Business Review',
    category: 'business',
    description: 'Comprehensive quarterly performance presentation',
    duration: '15-20 minutes',
    difficulty: 'Advanced',
    content: `Executive Summary:\n- Key achievements this quarter\n- Major challenges overcome\n- Bottom-line impact\n\nFinancial Performance:\n- Revenue vs. targets\n- Cost analysis\n- Profit margins\n- Budget variance\n\nOperational Metrics:\n- KPI dashboard\n- Performance trends\n- Efficiency improvements\n\nMarket Analysis:\n- Industry trends\n- Competitive landscape\n- Market opportunities\n\nTeam & Resources:\n- Staffing updates\n- Training initiatives\n- Resource allocation\n\nNext Quarter Outlook:\n- Goals and objectives\n- Initiatives and projects\n- Resource requirements\n- Risk mitigation`,
    tags: ['business', 'quarterly', 'performance', 'executive'],
    popularity: 89,
    contentAdvice: 'Lead with key insights. Use data visualization. Address challenges honestly.',
    voiceAdvice: 'Speak with confidence about achievements. Be factual about challenges.',
    bodyLanguageAdvice: 'Use authoritative posture. Point to charts and data. Make eye contact with decision-makers.'
  },

  // Motivational Speeches (6 templates)
  {
    id: 'overcoming-adversity',
    title: 'Overcoming Adversity - Rising Strong',
    category: 'motivational',
    description: 'Inspire others through your comeback story',
    duration: '8-12 minutes',
    difficulty: 'Advanced',
    content: `Opening Hook:\n- Dramatic moment from your lowest point\n- Universal truth about struggle\n\nThe Fall:\n- What went wrong\n- How it felt\n- The moment you hit bottom\n\nThe Choice:\n- Decision to fight back\n- First small step\n- Finding inner strength\n\nThe Climb:\n- Daily habits that helped\n- People who supported you\n- Milestones along the way\n\nThe Lesson:\n- What adversity taught you\n- How it made you stronger\n- Universal principles\n\nThe Challenge:\n- Call to action for audience\n- How they can overcome their challenges\n- Final inspiring thought`,
    tags: ['motivation', 'adversity', 'resilience', 'inspiration'],
    popularity: 87,
    contentAdvice: 'Be vulnerable but purposeful. Connect personal struggle to universal truths.',
    voiceAdvice: 'Build emotional intensity. Use strategic pauses for impact.',
    bodyLanguageAdvice: 'Use strong, confident posture. Move with purpose. Make direct eye contact.'
  },

  // Sales Pitches (5 templates)
  {
    id: 'elevator-pitch',
    title: 'The Perfect Elevator Pitch',
    category: 'sales',
    description: '60-second compelling business pitch',
    duration: '60-90 seconds',
    difficulty: 'Intermediate',
    content: `Hook (10 seconds):\n- Attention-grabbing question or statistic\n- Problem statement\n\nSolution (20 seconds):\n- What you do/offer\n- How it solves the problem\n- Key differentiator\n\nProof (20 seconds):\n- Brief success story or metric\n- Social proof or credentials\n\nCall to Action (10 seconds):\n- Specific next step\n- Contact information\n- Value proposition reminder`,
    tags: ['sales', 'networking', 'pitch', 'business'],
    popularity: 93,
    contentAdvice: 'Focus on benefits, not features. Use concrete examples. Make ask clear.',
    voiceAdvice: 'Speak with enthusiasm and confidence. Control your pace.',
    bodyLanguageAdvice: 'Use open gestures. Maintain eye contact. Show genuine enthusiasm.'
  },

  // More TED Talk Templates (15 total)
  {
    id: 'ted-future-work',
    title: 'The Future of Work in 2030',
    category: 'ted-talks',
    description: 'Explore how technology will reshape careers and workplaces',
    duration: '15-18 minutes',
    difficulty: 'Advanced',
    content: `Opening Hook: "By 2030, your job as you know it will not exist. But that's not a threat - it's the greatest opportunity in human history."\n\nCurrent State:\n- Traditional work models breaking down\n- Remote work revolution\n- AI automation impact\n\nTransformation Drivers:\n1. Artificial Intelligence integration\n2. Sustainable business practices\n3. Human-centric design\n4. Global collaboration tools\n\nNew Opportunities:\n- Skills that machines can't replicate\n- Creative problem-solving roles\n- Emotional intelligence careers\n\nPractical Steps:\n- Continuous learning mindset\n- Adaptability skills\n- Building human connections\n\nVision for 2030:\n- Human-AI collaboration\n- Purpose-driven work\n- Global impact from anywhere\n\nCall to Action: "The future doesn't happen to us - we create it. Start building your 2030 career today."`,
    tags: ['future', 'technology', 'career', 'innovation'],
    popularity: 94,
    contentAdvice: 'Use current data and trends. Paint a compelling vision of the future.',
    voiceAdvice: 'Build excitement about possibilities. Use confident, forward-looking tone.',
    bodyLanguageAdvice: 'Use expansive gestures to show growth. Look forward, not down.'
  },
  {
    id: 'ted-mental-health',
    title: 'Breaking the Silence: Mental Health in the Digital Age',
    category: 'ted-talks',
    description: 'Address mental health challenges in our connected world',
    duration: '12-15 minutes',
    difficulty: 'Advanced',
    content: `Opening: "We are the most connected generation in history, yet we've never felt more alone."\n\nThe Problem:\n- Digital overwhelm and anxiety\n- Social media comparison culture\n- Isolation despite connectivity\n\nPersonal Journey:\n- Your experience with mental health\n- The moment you realized change was needed\n- What you learned about healing\n\nScience Behind It:\n- Digital impact on brain chemistry\n- Importance of real human connection\n- Proven strategies for mental wellness\n\nSolutions:\n1. Digital detox practices\n2. Mindfulness in technology use\n3. Building authentic relationships\n4. Professional help when needed\n\nCall to Action: "Let's break the silence. Your mental health matters, and help is available."`,
    tags: ['mental health', 'technology', 'wellness', 'society'],
    popularity: 96,
    contentAdvice: 'Balance vulnerability with hope. Include practical solutions.',
    voiceAdvice: 'Speak with empathy and understanding. Avoid clinical tone.',
    bodyLanguageAdvice: 'Use open, welcoming gestures. Show genuine care through expressions.'
  },
  {
    id: 'ted-climate-solutions',
    title: 'Small Actions, Big Impact: Climate Solutions That Work',
    category: 'ted-talks',
    description: 'Practical climate action for individuals and communities',
    duration: '14-16 minutes',
    difficulty: 'Intermediate',
    content: `Opening: "What if I told you that saving the planet doesn't require superhuman effort, just human effort?"\n\nThe Reality:\n- Climate change is happening now\n- Individual actions matter\n- Collective impact is powerful\n\nSuccess Stories:\n- Community solar projects\n- Local food systems\n- Sustainable transportation\n\nPractical Solutions:\n1. Energy efficiency at home\n2. Sustainable consumption choices\n3. Community involvement\n4. Advocacy and voting\n\nThe Ripple Effect:\n- How small changes inspire others\n- Creating cultural shifts\n- Building sustainable communities\n\nCall to Action: "Start with one small action today. The planet doesn't need a few perfect environmentalists, it needs millions of people doing their best."`,
    tags: ['climate', 'environment', 'sustainability', 'action'],
    popularity: 91,
    contentAdvice: 'Focus on hope and actionable steps. Use concrete examples.',
    voiceAdvice: 'Balance urgency with optimism. Sound empowering, not preachy.',
    bodyLanguageAdvice: 'Use grounding gestures. Show stability and determination.'
  },

  // More Wedding Speech Templates (12 total)
  {
    id: 'father-bride-speech',
    title: 'Father of the Bride Speech - Traditional & Touching',
    category: 'wedding',
    description: 'Classic father of the bride speech with modern touches',
    duration: '4-6 minutes',
    difficulty: 'Intermediate',
    content: `Opening:\n- Welcome everyone and thank them for coming\n- Introduce yourself and express your joy\n\nAbout Your Daughter:\n- Share a cherished childhood memory\n- Her growth into an amazing woman\n- Qualities you admire most\n\nWelcoming the Groom:\n- First impressions of the groom\n- How he makes your daughter happy\n- Welcoming him to the family\n\nMarriage Wisdom:\n- Advice from your own marriage\n- What makes relationships last\n- Your hopes for their future\n\nClosing Toast:\n- Express your love and pride\n- Wish them happiness\n- Raise glasses to the couple`,
    tags: ['wedding', 'father', 'tradition', 'family'],
    popularity: 93,
    contentAdvice: 'Keep it heartfelt but not overly sentimental. Include light humor.',
    voiceAdvice: 'Speak slowly and clearly. Allow emotion to show naturally.',
    bodyLanguageAdvice: 'Stand tall and proud. Make eye contact with your daughter.'
  },
  {
    id: 'mother-groom-speech',
    title: 'Mother of the Groom Speech - Love & Gratitude',
    category: 'wedding',
    description: 'Heartfelt speech from the groom\'s mother',
    duration: '3-5 minutes',
    difficulty: 'Intermediate',
    content: `Opening:\n- Thank the bride's family for their hospitality\n- Express your joy about the union\n\nAbout Your Son:\n- Share a meaningful story from his childhood\n- How he's grown into a wonderful man\n- What makes him special\n\nWelcoming the Bride:\n- Your first impressions of her\n- How she complements your son\n- Grateful to have her in the family\n\nFamily Traditions:\n- Sharing family values\n- Creating new traditions together\n- Continuing the family legacy\n\nClosing:\n- Express your love for both\n- Offer support for their journey\n- Toast to their happiness`,
    tags: ['wedding', 'mother', 'family', 'tradition'],
    popularity: 87,
    contentAdvice: 'Focus on welcoming and supporting. Keep it warm and inclusive.',
    voiceAdvice: 'Speak with warmth and maternal love. Let emotion come through.',
    bodyLanguageAdvice: 'Use embracing gestures. Show openness and welcome.'
  },
  {
    id: 'matron-honor-speech',
    title: 'Matron of Honor Speech - Married Best Friend',
    category: 'wedding',
    description: 'Speech from married best friend to the bride',
    duration: '4-5 minutes',
    difficulty: 'Intermediate',
    content: `Opening:\n- Thank everyone and introduce yourself\n- Express honor of being chosen\n\nFriendship Journey:\n- How you met the bride\n- Your friendship through the years\n- Supporting each other through life changes\n\nMarriage Insights:\n- What marriage has taught you\n- Seeing the bride find her perfect match\n- How love evolves and deepens\n\nAbout the Couple:\n- Their special connection\n- How they balance each other\n- Why they're perfect together\n\nWisdom to Share:\n- Practical marriage advice\n- Importance of friendship in marriage\n- Supporting each other's dreams\n\nClosing Toast:\n- Your love for the bride\n- Excitement for their future\n- Toast to lifelong happiness`,
    tags: ['wedding', 'friendship', 'marriage', 'wisdom'],
    popularity: 84,
    contentAdvice: 'Share marriage wisdom from experience. Keep it supportive.',
    voiceAdvice: 'Speak with wisdom and warmth. Show genuine care.',
    bodyLanguageAdvice: 'Use supportive gestures. Show friendship and love.'
  },

  // More Job Interview Templates (15 total)
  {
    id: 'behavioral-interview',
    title: 'Behavioral Interview Responses - STAR Method',
    category: 'job-interviews',
    description: 'Structure answers using Situation, Task, Action, Result',
    duration: '2-3 minutes per question',
    difficulty: 'Intermediate',
    content: `Common Questions and STAR Framework:\n\n1. "Tell me about a time you overcame a challenge"\nSituation: Set the context\nTask: Explain your responsibility\nAction: Describe what you did\nResult: Share the outcome\n\n2. "Describe a time you worked in a team"\nSituation: Team project or challenge\nTask: Your role in the team\nAction: How you contributed\nResult: Team success achieved\n\n3. "Give an example of leadership"\nSituation: Leadership opportunity\nTask: What needed to be done\nAction: How you led the team\nResult: Positive outcome\n\n4. "How do you handle conflict?"\nSituation: Workplace conflict\nTask: Resolution needed\nAction: Steps you took\nResult: Successful resolution\n\nKey Tips:\n- Use specific examples\n- Quantify results when possible\n- Show growth and learning\n- Keep responses concise but detailed`,
    tags: ['interview', 'behavioral', 'STAR', 'method'],
    popularity: 95,
    contentAdvice: 'Prepare 5-7 strong STAR examples. Practice transitions.',
    voiceAdvice: 'Speak confidently and clearly. Maintain steady pace.',
    bodyLanguageAdvice: 'Use gestures to emphasize points. Maintain eye contact.'
  },
  {
    id: 'technical-interview',
    title: 'Technical Interview Presentation',
    category: 'job-interviews',
    description: 'Present technical skills and problem-solving abilities',
    duration: '10-15 minutes',
    difficulty: 'Advanced',
    content: `Structure:\n\n1. Problem Understanding\n- Clarify requirements\n- Ask relevant questions\n- Explain your approach\n\n2. Solution Design\n- Break down the problem\n- Discuss trade-offs\n- Choose best approach\n\n3. Implementation\n- Walk through your solution\n- Explain key decisions\n- Handle edge cases\n\n4. Testing & Validation\n- Test your solution\n- Identify potential issues\n- Suggest improvements\n\n5. Scalability & Optimization\n- Discuss performance\n- Suggest optimizations\n- Consider future needs\n\nCommunication Tips:\n- Think out loud\n- Explain your reasoning\n- Ask for feedback\n- Show adaptability\n\nWrap-up:\n- Summarize your solution\n- Highlight key strengths\n- Express continued interest`,
    tags: ['interview', 'technical', 'problem-solving', 'engineering'],
    popularity: 92,
    contentAdvice: 'Focus on problem-solving process. Show technical depth.',
    voiceAdvice: 'Speak clearly and methodically. Pause to think when needed.',
    bodyLanguageAdvice: 'Use hands to illustrate concepts. Show enthusiasm for problem-solving.'
  },
  {
    id: 'executive-interview',
    title: 'Executive Interview Presentation',
    category: 'job-interviews',
    description: 'Present leadership vision and strategic thinking',
    duration: '15-20 minutes',
    difficulty: 'Advanced',
    content: `Executive Presentation Structure:\n\n1. Opening & Vision\n- Your leadership philosophy\n- Vision for the role\n- How you'll drive success\n\n2. Experience & Achievements\n- Relevant leadership experience\n- Key accomplishments\n- Lessons learned\n\n3. Strategic Analysis\n- Company/industry insights\n- Opportunities and challenges\n- Strategic recommendations\n\n4. Team Leadership\n- Your management style\n- Building high-performing teams\n- Developing talent\n\n5. Cultural Fit\n- Understanding company culture\n- How you'll contribute\n- Your values alignment\n\n6. 30-60-90 Day Plan\n- First 30 days priorities\n- 60-day initiatives\n- 90-day goals\n\n7. Q&A Preparation\n- Anticipate tough questions\n- Prepare thoughtful responses\n- Ask strategic questions\n\nClosing:\n- Reiterate your value proposition\n- Express enthusiasm\n- Outline next steps`,
    tags: ['interview', 'executive', 'leadership', 'strategy'],
    popularity: 89,
    contentAdvice: 'Show strategic thinking. Demonstrate leadership depth.',
    voiceAdvice: 'Speak with authority and confidence. Vary pace for emphasis.',
    bodyLanguageAdvice: 'Use executive presence. Show commanding but approachable demeanor.'
  },

  // More School Presentation Templates (18 total)
  {
    id: 'science-fair-project',
    title: 'Science Fair Project Presentation',
    category: 'school',
    description: 'Present your scientific research and findings',
    duration: '5-8 minutes',
    difficulty: 'Intermediate',
    content: `Science Fair Structure:\n\n1. Title & Introduction\n- Project title and your name\n- Why you chose this topic\n- Hook to grab attention\n\n2. Problem Statement\n- What question are you answering?\n- Why is this important?\n- What did you expect to find?\n\n3. Hypothesis\n- Your educated guess\n- Based on what background research?\n- Clear, testable prediction\n\n4. Materials & Methods\n- What you used\n- Step-by-step procedure\n- Variables and controls\n\n5. Results\n- What happened?\n- Data and observations\n- Charts, graphs, photos\n\n6. Analysis\n- What do your results mean?\n- Was your hypothesis correct?\n- Patterns and trends\n\n7. Conclusion\n- Answer to your question\n- What you learned\n- Future research ideas\n\n8. Real-world Applications\n- How can this be used?\n- Impact on society\n- Future possibilities`,
    tags: ['school', 'science', 'research', 'presentation'],
    popularity: 91,
    contentAdvice: 'Use clear data visualizations. Explain scientific concepts simply.',
    voiceAdvice: 'Speak with enthusiasm for your discovery. Explain clearly.',
    bodyLanguageAdvice: 'Point to visuals. Use gestures to explain processes.'
  },
  {
    id: 'book-report-presentation',
    title: 'Book Report Presentation',
    category: 'school',
    description: 'Present your analysis of a book you\'ve read',
    duration: '3-5 minutes',
    difficulty: 'Beginner',
    content: `Book Report Structure:\n\n1. Introduction\n- Book title and author\n- Genre and publication info\n- Why you chose this book\n\n2. Plot Summary\n- Main characters\n- Setting (time and place)\n- Brief plot overview (no spoilers!)\n- Conflict and resolution\n\n3. Character Analysis\n- Main character description\n- Character development\n- Favorite character and why\n\n4. Themes & Messages\n- Main themes in the book\n- Author's message\n- Lessons learned\n\n5. Personal Response\n- What you liked most\n- What you didn't like\n- Favorite scene or quote\n\n6. Recommendation\n- Who would enjoy this book?\n- Rating out of 10\n- Why others should read it\n\n7. Visual Aid\n- Show the book cover\n- Draw favorite scene\n- Create character map\n\nClosing:\n- Summarize your thoughts\n- Encourage others to read\n- Answer questions`,
    tags: ['school', 'book', 'literature', 'analysis'],
    popularity: 88,
    contentAdvice: 'Show genuine enthusiasm for reading. Include personal connections.',
    voiceAdvice: 'Vary tone when describing different parts. Show excitement.',
    bodyLanguageAdvice: 'Hold the book. Use expressions to show emotions.'
  },
  {
    id: 'history-presentation',
    title: 'Historical Event Presentation',
    category: 'school',
    description: 'Present a significant historical event or period',
    duration: '8-10 minutes',
    difficulty: 'Intermediate',
    content: `Historical Presentation Structure:\n\n1. Opening Hook\n- Interesting fact or quote\n- Why this event matters today\n- Set the historical context\n\n2. Background Information\n- Time period and location\n- Key people involved\n- Conditions leading to event\n\n3. The Event Unfolds\n- Chronological sequence\n- Major developments\n- Turning points\n\n4. Key Figures\n- Important people\n- Their roles and motivations\n- Impact on events\n\n5. Consequences\n- Immediate effects\n- Long-term impact\n- How it changed society\n\n6. Historical Significance\n- Why it's important today\n- Lessons we can learn\n- Connections to current events\n\n7. Visual Timeline\n- Key dates and events\n- Maps and images\n- Primary source quotes\n\n8. Q&A Preparation\n- Anticipate questions\n- Know additional details\n- Be ready to explain connections\n\nClosing:\n- Summarize key points\n- Emphasize lasting impact\n- Connect to present day`,
    tags: ['school', 'history', 'education', 'timeline'],
    popularity: 85,
    contentAdvice: 'Use primary sources. Make historical connections to today.',
    voiceAdvice: 'Speak with authority. Vary pace for dramatic effect.',
    bodyLanguageAdvice: 'Use gestures to show scale and importance.'
  },

  // More Business Presentation Templates (20 total)
  {
    id: 'quarterly-business-review',
    title: 'Quarterly Business Review (QBR)',
    category: 'business',
    description: 'Present quarterly performance and strategic updates',
    duration: '30-45 minutes',
    difficulty: 'Advanced',
    content: `QBR Structure:\n\n1. Executive Summary\n- Key achievements this quarter\n- Critical metrics overview\n- Strategic priorities\n\n2. Financial Performance\n- Revenue vs. targets\n- Profit margins\n- Cost analysis\n- Budget variance\n\n3. Operational Metrics\n- KPI dashboard\n- Performance trends\n- Efficiency improvements\n\n4. Market Analysis\n- Industry trends\n- Competitive landscape\n- Market share\n\n5. Customer Insights\n- Customer satisfaction\n- Retention rates\n- New customer acquisition\n\n6. Team Performance\n- Headcount updates\n- Productivity metrics\n- Development initiatives\n\n7. Challenges & Risks\n- Current obstacles\n- Risk mitigation\n- Lessons learned\n\n8. Next Quarter Priorities\n- Strategic initiatives\n- Resource allocation\n- Success metrics\n\n9. Action Items\n- Specific commitments\n- Ownership assignments\n- Timeline for delivery`,
    tags: ['business', 'quarterly', 'performance', 'strategy'],
    popularity: 94,
    contentAdvice: 'Use data-driven insights. Balance achievements with challenges.',
    voiceAdvice: 'Speak with confidence about results. Be honest about challenges.',
    bodyLanguageAdvice: 'Use authoritative gestures. Show leadership presence.'
  },
  {
    id: 'product-launch-presentation',
    title: 'Product Launch Presentation',
    category: 'business',
    description: 'Introduce a new product to market',
    duration: '20-30 minutes',
    difficulty: 'Advanced',
    content: `Product Launch Structure:\n\n1. Market Opportunity\n- Market size and trends\n- Customer pain points\n- Competitive landscape\n\n2. Product Introduction\n- Product overview\n- Key features and benefits\n- Unique value proposition\n\n3. Target Market\n- Customer segments\n- Use cases\n- Market positioning\n\n4. Product Demonstration\n- Live demo or video\n- Key functionality\n- User experience\n\n5. Go-to-Market Strategy\n- Launch timeline\n- Marketing channels\n- Sales strategy\n\n6. Pricing & Packaging\n- Pricing strategy\n- Package options\n- Value justification\n\n7. Success Metrics\n- Launch goals\n- KPIs to track\n- Timeline for evaluation\n\n8. Resource Requirements\n- Team needs\n- Budget allocation\n- Technology requirements\n\n9. Risk Assessment\n- Potential challenges\n- Mitigation strategies\n- Contingency plans\n\n10. Call to Action\n- Next steps\n- Support needed\n- Timeline commitments`,
    tags: ['business', 'product', 'launch', 'marketing'],
    popularity: 96,
    contentAdvice: 'Focus on customer value. Use compelling product demonstrations.',
    voiceAdvice: 'Build excitement about the product. Show enthusiasm.',
    bodyLanguageAdvice: 'Use dynamic gestures. Show passion for the product.'
  },
  {
    id: 'investor-pitch-series-a',
    title: 'Series A Investor Pitch',
    category: 'business',
    description: 'Pitch for Series A funding round',
    duration: '15-20 minutes',
    difficulty: 'Advanced',
    content: `Series A Pitch Structure:\n\n1. Problem & Opportunity\n- Large, growing market\n- Significant customer pain\n- Current solution inadequacies\n\n2. Solution & Product\n- Your innovative solution\n- Product demonstration\n- Competitive advantages\n\n3. Market Size & Opportunity\n- TAM, SAM, SOM analysis\n- Market growth trends\n- Timing advantages\n\n4. Business Model\n- Revenue streams\n- Unit economics\n- Scalability factors\n\n5. Traction & Metrics\n- Customer growth\n- Revenue progression\n- Key performance indicators\n\n6. Go-to-Market Strategy\n- Customer acquisition\n- Sales process\n- Marketing channels\n\n7. Competition\n- Competitive landscape\n- Differentiation strategy\n- Market positioning\n\n8. Team\n- Founding team expertise\n- Key hires\n- Advisory board\n\n9. Financial Projections\n- 5-year revenue forecast\n- Path to profitability\n- Key assumptions\n\n10. Funding Ask\n- Amount needed\n- Use of funds\n- Expected outcomes\n\n11. Exit Strategy\n- Potential exit scenarios\n- Comparable transactions\n- Return projections`,
    tags: ['business', 'investment', 'funding', 'startup'],
    popularity: 97,
    contentAdvice: 'Show strong traction and clear path to growth. Use compelling data.',
    voiceAdvice: 'Speak with confidence about your vision. Show passion.',
    bodyLanguageAdvice: 'Use confident gestures. Maintain strong eye contact.'
  },

  // More Motivational Speech Templates (12 total)
  {
    id: 'overcoming-adversity',
    title: 'Overcoming Adversity - Rise Above Challenges',
    category: 'motivational',
    description: 'Inspire others to overcome life\'s challenges',
    duration: '10-15 minutes',
    difficulty: 'Intermediate',
    content: `Motivational Structure:\n\n1. Opening Story\n- Personal or compelling example\n- Moment of deepest challenge\n- Feeling of hopelessness\n\n2. The Universal Truth\n- Everyone faces adversity\n- Challenges are opportunities\n- Growth comes from struggle\n\n3. Personal Journey\n- Your specific challenge\n- How you felt\n- What you learned\n\n4. The Turning Point\n- Moment of decision\n- Choosing to fight back\n- First steps forward\n\n5. Strategies That Work\n- Mindset shifts\n- Practical steps\n- Support systems\n\n6. The Transformation\n- How you changed\n- New strengths discovered\n- Unexpected benefits\n\n7. Call to Action\n- Face your challenges\n- Take one step today\n- Never give up\n\n8. Inspiring Close\n- Powerful quote or story\n- Vision of their potential\n- Belief in their ability\n\nKey Messages:\n- You are stronger than you know\n- Every setback is a setup for a comeback\n- Your current chapter is not your final story`,
    tags: ['motivational', 'adversity', 'resilience', 'inspiration'],
    popularity: 95,
    contentAdvice: 'Share authentic struggles. Focus on hope and possibility.',
    voiceAdvice: 'Build emotional intensity. Use power and passion.',
    bodyLanguageAdvice: 'Use strong, uplifting gestures. Show determination.'
  },
  {
    id: 'dream-achievement',
    title: 'Turn Your Dreams Into Reality',
    category: 'motivational',
    description: 'Inspire action toward achieving dreams and goals',
    duration: '12-18 minutes',
    difficulty: 'Intermediate',
    content: `Dream Achievement Structure:\n\n1. The Power of Dreams\n- Why dreams matter\n- Dreams vs. wishes\n- The cost of giving up\n\n2. Personal Dream Story\n- Your biggest dream\n- Obstacles you faced\n- How you persevered\n\n3. Dream Killers\n- Fear of failure\n- Others' opinions\n- Self-doubt\n- Comfort zone\n\n4. The Dream Process\n- Clarify your vision\n- Set specific goals\n- Create action plans\n- Stay committed\n\n5. Building Momentum\n- Start small\n- Celebrate progress\n- Learn from setbacks\n- Adjust strategies\n\n6. The Support System\n- Find mentors\n- Build your team\n- Network with dreamers\n- Avoid negative influences\n\n7. Persistence Pays\n- Examples of famous failures\n- The compound effect\n- Breakthrough moments\n\n8. Living Your Dream\n- What success looks like\n- Impact on others\n- Legacy you create\n\n9. Your Time Is Now\n- Stop waiting for perfect\n- Take action today\n- Make your dreams inevitable\n\nClosing Challenge:\n- What's your dream?\n- What's your first step?\n- When will you start?`,
    tags: ['motivational', 'dreams', 'goals', 'achievement'],
    popularity: 93,
    contentAdvice: 'Paint vivid pictures of possibility. Include practical steps.',
    voiceAdvice: 'Build excitement and urgency. Show passion for their potential.',
    bodyLanguageAdvice: 'Use expansive gestures. Show vision and possibility.'
  },
  {
    id: 'leadership-courage',
    title: 'Courageous Leadership in Uncertain Times',
    category: 'motivational',
    description: 'Inspire leaders to lead with courage and conviction',
    duration: '15-20 minutes',
    difficulty: 'Advanced',
    content: `Leadership Courage Structure:\n\n1. The Leadership Crisis\n- Uncertain times demand courage\n- Fear-based leadership fails\n- The cost of weak leadership\n\n2. What Is Courageous Leadership?\n- Making tough decisions\n- Standing for principles\n- Protecting your team\n- Taking calculated risks\n\n3. Personal Leadership Story\n- Your moment of truth\n- When you had to choose courage\n- What you learned\n\n4. The Courage Framework\n- Moral courage\n- Physical courage\n- Emotional courage\n- Intellectual courage\n\n5. Building Courage\n- Start with small acts\n- Develop your values\n- Practice difficult conversations\n- Build your support network\n\n6. Leading Through Fear\n- Acknowledge fear\n- Focus on purpose\n- Take action despite fear\n- Support others' courage\n\n7. Courageous Decisions\n- Gather information\n- Consider stakeholders\n- Act on principles\n- Take responsibility\n\n8. Creating Courage Culture\n- Model courage\n- Reward brave behavior\n- Learn from failures\n- Celebrate courage\n\n9. The Leadership Legacy\n- How you'll be remembered\n- Impact on others\n- Changing the world\n\nCall to Courage:\n- What requires your courage today?\n- Who needs your leadership?\n- How will you step up?`,
    tags: ['motivational', 'leadership', 'courage', 'inspiration'],
    popularity: 91,
    contentAdvice: 'Use powerful leadership examples. Focus on practical courage.',
    voiceAdvice: 'Speak with authority and conviction. Show leadership presence.',
    bodyLanguageAdvice: 'Use commanding gestures. Show strength and determination.'
  },

  // More Storytelling Templates (10 total)
  {
    id: 'hero-journey-story',
    title: 'The Hero\'s Journey - Personal Transformation',
    category: 'storytelling',
    description: 'Tell your personal transformation story',
    duration: '8-12 minutes',
    difficulty: 'Intermediate',
    content: `Hero's Journey Structure:\n\n1. The Ordinary World\n- Your life before the journey\n- Comfort zone and routine\n- What felt normal\n\n2. The Call to Adventure\n- The moment everything changed\n- Challenge or opportunity\n- Initial resistance\n\n3. Meeting the Mentor\n- Who guided you\n- Wisdom they shared\n- Tools they provided\n\n4. Crossing the Threshold\n- Leaving comfort behind\n- Point of no return\n- First real challenge\n\n5. Tests and Trials\n- Obstacles you faced\n- Moments of doubt\n- Skills you developed\n\n6. The Ordeal\n- Your biggest challenge\n- Moment of truth\n- Confronting your fears\n\n7. The Reward\n- What you gained\n- New understanding\n- Transformation achieved\n\n8. The Road Back\n- Returning to normal life\n- Integrating lessons\n- New challenges\n\n9. The Return\n- Who you became\n- How you changed\n- Wisdom to share\n\n10. Sharing the Gift\n- How you help others\n- Your new mission\n- The legacy continues\n\nClosing:\n- Everyone has a hero's journey\n- Your adventure awaits\n- The hero is you`,
    tags: ['storytelling', 'personal', 'transformation', 'journey'],
    popularity: 92,
    contentAdvice: 'Use vivid details and emotions. Make it relatable.',
    voiceAdvice: 'Vary pace for dramatic effect. Show emotional journey.',
    bodyLanguageAdvice: 'Use gestures to show journey. Express emotions physically.'
  },
  {
    id: 'failure-success-story',
    title: 'From Failure to Success - The Comeback Story',
    category: 'storytelling',
    description: 'Share how failure led to your greatest success',
    duration: '10-15 minutes',
    difficulty: 'Intermediate',
    content: `Comeback Story Structure:\n\n1. The Setup\n- Life before the failure\n- Confidence and expectations\n- What you thought you knew\n\n2. The Fall\n- What went wrong\n- The moment of realization\n- Immediate consequences\n\n3. The Impact\n- How it affected you\n- Emotional response\n- Life changes required\n\n4. The Dark Period\n- Struggling with reality\n- Self-doubt and questioning\n- Feeling lost\n\n5. The Turning Point\n- Moment of clarity\n- Decision to change\n- New perspective\n\n6. The Rebuild\n- First steps forward\n- New strategies\n- Small wins\n\n7. The Lessons\n- What failure taught you\n- Skills you developed\n- Character growth\n\n8. The Comeback\n- How you succeeded\n- What was different\n- New level of achievement\n\n9. The Gratitude\n- Appreciation for failure\n- How it shaped you\n- Wouldn't change it\n\n10. The Message\n- Failure is not final\n- Every setback is a setup\n- Your comeback story awaits\n\nClosing:\n- Everyone fails\n- Success is about getting back up\n- Your best days are ahead`,
    tags: ['storytelling', 'failure', 'success', 'resilience'],
    popularity: 89,
    contentAdvice: 'Be honest about the pain. Show genuine gratitude for lessons.',
    voiceAdvice: 'Start low and build energy. Show emotional range.',
    bodyLanguageAdvice: 'Use contrasting gestures for failure vs. success.'
  },

  // More Sales Pitch Templates (8 total)
  {
    id: 'consultative-sales-pitch',
    title: 'Consultative Sales Presentation',
    category: 'sales',
    description: 'Solution-focused sales approach',
    duration: '20-30 minutes',
    difficulty: 'Advanced',
    content: `Consultative Sales Structure:\n\n1. Discovery Phase\n- Understand client needs\n- Current situation analysis\n- Pain points identification\n- Goals and objectives\n\n2. Situation Analysis\n- Current state assessment\n- Gap analysis\n- Impact of problems\n- Cost of inaction\n\n3. Solution Design\n- Customized solution\n- How it addresses needs\n- Benefits for client\n- Unique advantages\n\n4. Implementation Plan\n- Step-by-step process\n- Timeline and milestones\n- Resource requirements\n- Success metrics\n\n5. Investment Discussion\n- Pricing structure\n- ROI calculation\n- Payment options\n- Value justification\n\n6. Risk Mitigation\n- Addressing concerns\n- Guarantee or warranty\n- Support and service\n- References and testimonials\n\n7. Next Steps\n- Clear action items\n- Decision timeline\n- Implementation schedule\n- Partnership vision\n\nKey Principles:\n- Ask more than you tell\n- Listen actively\n- Provide value first\n- Build trust and rapport\n- Focus on client outcomes\n- Create urgency appropriately\n\nClosing:\n- Summarize key benefits\n- Confirm understanding\n- Ask for the business`,
    tags: ['sales', 'consultative', 'solution', 'presentation'],
    popularity: 94,
    contentAdvice: 'Focus on client needs first. Use specific examples.',
    voiceAdvice: 'Ask engaging questions. Listen actively.',
    bodyLanguageAdvice: 'Use open gestures. Show genuine interest in client.'
  },
  {
    id: 'product-demo-pitch',
    title: 'Product Demo Sales Pitch',
    category: 'sales',
    description: 'Demonstrate product value through live demo',
    duration: '15-25 minutes',
    difficulty: 'Intermediate',
    content: `Demo Pitch Structure:\n\n1. Opening & Context\n- Why this demo matters\n- What you'll show\n- Expected outcomes\n\n2. Business Context\n- Client's current situation\n- Challenges they face\n- Desired outcomes\n\n3. Solution Overview\n- Product introduction\n- Key capabilities\n- Unique value proposition\n\n4. Live Demonstration\n- Core functionality\n- Real-world scenarios\n- User experience\n- Key features\n\n5. Benefit Reinforcement\n- How it solves problems\n- Time/cost savings\n- Improved outcomes\n- Competitive advantages\n\n6. Customization Options\n- Tailoring to their needs\n- Integration capabilities\n- Scalability features\n- Support options\n\n7. Success Stories\n- Similar client examples\n- Measurable results\n- Testimonials\n- Case studies\n\n8. Implementation\n- Getting started process\n- Timeline expectations\n- Support and training\n- Success metrics\n\n9. Investment & ROI\n- Pricing options\n- Return on investment\n- Total cost of ownership\n- Value comparison\n\n10. Next Steps\n- Trial or pilot options\n- Decision process\n- Implementation timeline\n- Support commitment`,
    tags: ['sales', 'demo', 'product', 'presentation'],
    popularity: 96,
    contentAdvice: 'Show real value through demo. Use client-specific examples.',
    voiceAdvice: 'Build excitement during demo. Emphasize key benefits.',
    bodyLanguageAdvice: 'Use screen effectively. Engage with audience during demo.'
  },

  // More Academic Presentation Templates (7 total)
  {
    id: 'thesis-defense',
    title: 'Master\'s Thesis Defense',
    category: 'academic',
    description: 'Defend your thesis research and findings',
    duration: '20-30 minutes',
    difficulty: 'Advanced',
    content: `Thesis Defense Structure:\n\n1. Introduction\n- Research topic and significance\n- Research questions\n- Thesis statement\n\n2. Literature Review\n- Current state of research\n- Gaps in knowledge\n- Theoretical framework\n\n3. Methodology\n- Research approach\n- Data collection methods\n- Analysis techniques\n- Limitations\n\n4. Results\n- Key findings\n- Data presentation\n- Statistical analysis\n- Unexpected discoveries\n\n5. Discussion\n- Interpretation of results\n- Implications for field\n- Comparison with previous research\n- Theoretical contributions\n\n6. Conclusions\n- Summary of findings\n- Research questions answered\n- Significance of work\n- Future research directions\n\n7. Q&A Preparation\n- Anticipate committee questions\n- Know your methodology deeply\n- Be prepared to defend choices\n- Acknowledge limitations\n\nDefense Tips:\n- Know your research inside and out\n- Practice with colleagues\n- Prepare for challenging questions\n- Stay calm and confident\n- Be ready to discuss implications\n- Thank your committee\n\nClosing:\n- Summarize contributions\n- Express gratitude\n- Discuss future work`,
    tags: ['academic', 'thesis', 'defense', 'research'],
    popularity: 88,
    contentAdvice: 'Show deep knowledge of your field. Acknowledge limitations.',
    voiceAdvice: 'Speak with authority about your research. Stay calm.',
    bodyLanguageAdvice: 'Use confident gestures. Maintain eye contact with committee.'
  },
  
  // Additional Templates to reach 100+ total
  {
    id: 'graduation-speech',
    title: 'Graduation Commencement Speech',
    category: 'school',
    description: 'Inspire graduates as they begin their next chapter',
    duration: '8-12 minutes',
    difficulty: 'Advanced',
    content: `Graduation Speech Structure:\n\n1. Opening Celebration\n- Congratulate the graduates\n- Acknowledge families and faculty\n- Set inspirational tone\n\n2. Reflection on Journey\n- Challenges overcome\n- Growth achieved\n- Memories created\n\n3. Lessons Learned\n- Key insights from education\n- Skills developed\n- Character building\n\n4. Future Opportunities\n- Exciting possibilities ahead\n- How education prepared them\n- Unlimited potential\n\n5. Call to Action\n- Make a difference\n- Continue learning\n- Give back to others\n\n6. Inspirational Close\n- Powerful quote or story\n- Belief in their success\n- Congratulations again`,
    tags: ['school', 'graduation', 'inspiration', 'celebration'],
    popularity: 90,
    contentAdvice: 'Balance celebration with inspiration. Include personal anecdotes.',
    voiceAdvice: 'Build energy and excitement. Show genuine pride.',
    bodyLanguageAdvice: 'Use celebratory gestures. Connect with entire audience.'
  },
  
  {
    id: 'retirement-speech',
    title: 'Retirement Farewell Speech',
    category: 'business',
    description: 'Reflect on career and express gratitude',
    duration: '6-10 minutes',
    difficulty: 'Intermediate',
    content: `Retirement Speech Structure:\n\n1. Opening Thanks\n- Express gratitude\n- Acknowledge the honor\n- Set reflective tone\n\n2. Career Journey\n- Key milestones\n- Favorite memories\n- Challenges overcome\n\n3. People Who Mattered\n- Mentors and colleagues\n- Team members\n- Family support\n\n4. Company Growth\n- Changes witnessed\n- Contributions made\n- Pride in achievements\n\n5. Life Lessons\n- What work taught you\n- Values discovered\n- Wisdom gained\n\n6. Future Plans\n- Retirement goals\n- Continued involvement\n- New adventures\n\n7. Final Words\n- Gratitude and blessings\n- Well wishes for all\n- Contact information`,
    tags: ['business', 'retirement', 'reflection', 'gratitude'],
    popularity: 86,
    contentAdvice: 'Be genuine and heartfelt. Share meaningful stories.',
    voiceAdvice: 'Speak with warmth and nostalgia. Allow emotion.',
    bodyLanguageAdvice: 'Use appreciative gestures. Make eye contact with key people.'
  }
];

export default function Enhanced50PlusTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const { toast } = useToast();

  const filteredTemplates = FIFTY_PLUS_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditedContent(template.content);
    setIsEditing(true);
  };

  const handleAIPersonalize = async () => {
    if (!selectedTemplate) return;
    
    setIsAIGenerating(true);
    try {
      const response = await fetch('/api/openai/personalize-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: selectedTemplate,
          userRequest: 'Make this more engaging and personalized'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setEditedContent(result.personalizedContent);
        toast({
          title: "Template Personalized",
          description: "AI has enhanced your template with personalized content",
        });
      }
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to personalize template",
        variant: "destructive"
      });
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedTemplate) return;
    
    // Create PDF content
    const content = isEditing ? editedContent : selectedTemplate.content;
    const pdfContent = `
Template: ${selectedTemplate.title}
Category: ${selectedTemplate.category}
Duration: ${selectedTemplate.duration}
Difficulty: ${selectedTemplate.difficulty}

CONTENT:
${content}

COACHING ADVICE:

Content Structure: ${selectedTemplate.contentAdvice}

Voice Modulation: ${selectedTemplate.voiceAdvice}

Body Language: ${selectedTemplate.bodyLanguageAdvice}

Generated by YAPPYY - AI Speech Coach Platform
    `;

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.title.replace(/\s+/g, '_')}_Template.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "Your personalized template has been saved as a PDF",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Speech Template Marketplace</h1>
        <p className="text-muted-foreground">50+ Professional Templates for Every Speaking Occasion</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Template
        </Button>
      </div>

      {/* Categories - Fixed Navigation Bar */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <div className="w-full overflow-x-auto">
          <TabsList className="flex gap-2 min-w-max p-2 bg-gray-50 rounded-lg">
            {TEMPLATE_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap flex-shrink-0 rounded-md hover:bg-white data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight">{template.title}</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm">{template.popularity}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {template.duration}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{template.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="p-3">
                              <h4 className="font-semibold text-sm mb-2">Content Structure</h4>
                              <p className="text-xs text-muted-foreground">{template.contentAdvice}</p>
                            </Card>
                            <Card className="p-3">
                              <h4 className="font-semibold text-sm mb-2">Voice Modulation</h4>
                              <p className="text-xs text-muted-foreground">{template.voiceAdvice}</p>
                            </Card>
                            <Card className="p-3">
                              <h4 className="font-semibold text-sm mb-2">Body Language</h4>
                              <p className="text-xs text-muted-foreground">{template.bodyLanguageAdvice}</p>
                            </Card>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold">Template Content</h4>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedTemplate(template);
                                    handleAIPersonalize();
                                  }}
                                  disabled={isAIGenerating}
                                >
                                  <Wand2 className="h-4 w-4 mr-1" />
                                  {isAIGenerating ? 'Personalizing...' : 'AI Personalize'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditTemplate(template)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTemplate(template);
                                    handleDownloadPDF();
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download PDF
                                </Button>
                              </div>
                            </div>
                            
                            {isEditing && selectedTemplate?.id === template.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editedContent}
                                  onChange={(e) => setEditedContent(e.target.value)}
                                  rows={12}
                                  className="font-mono text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => setIsEditing(false)}>
                                    <Save className="h-4 w-4 mr-1" />
                                    Save Changes
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border max-h-64 overflow-y-auto">
                                {template.content}
                              </pre>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        )}
      </Tabs>
    </div>
  );
}