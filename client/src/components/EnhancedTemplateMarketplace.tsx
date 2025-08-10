import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Download,
  Edit,
  Save,
  Sparkles,
  FileText,
  Mic,
  User,
  Plus,
  Star,
  Clock,
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  Presentation,
  Award,
  Coffee,
  Building,
  Camera,
  Music,
  BookOpen,
  Target,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  Globe,
  Zap,
  BarChart3
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { allComprehensiveTemplates } from '@/lib/comprehensive-templates-collection';
import { businessPitchTemplates, salesPitchTemplates } from '@/lib/business-pitch-templates';
import { additionalTemplatesExpansion } from '@/lib/additional-templates-expansion';

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
  icon: any;
  contentAdvice?: string;
  voiceAdvice?: string;
  bodyLanguageAdvice?: string;
}

const templateCategories = [
  { id: 'all', label: 'All', icon: FileText },
  { id: 'custom', label: 'My Templates', icon: User, color: 'text-purple-600' },
  { id: 'business', label: 'Work & Business', icon: Briefcase },
  { id: 'sales', label: 'Sales & Marketing', icon: TrendingUp },
  { id: 'academic', label: 'School & Education', icon: GraduationCap },
  { id: 'personal', label: 'Wedding & Events', icon: Heart },
  { id: 'leadership', label: 'TED Talks & Leadership', icon: Target },
  { id: 'creative', label: 'Creative & Fun', icon: Camera },
];

const sampleTemplates: Template[] = [
  // Business & Professional (15 templates)
  {
    id: 'business-pitch-startup',
    title: 'Startup Business Pitch',
    category: 'business',
    description: 'Perfect pitch structure for presenting your startup to investors',
    duration: '5-7 minutes',
    difficulty: 'Intermediate',
    content: `[Opening Hook]
Good morning investors. Imagine a world where [paint the problem vividly].

[Problem Statement]
Every day, millions of people struggle with [specific problem]. Current solutions are [explain limitations].

[Solution Introduction]
That's why we created [Company Name] - [one sentence solution].

[How It Works]
Our platform works in three simple steps:
1. [Step one with benefit]
2. [Step two with benefit] 
3. [Step three with result]

[Market Opportunity]
The market for [your solution] is worth $[X] billion and growing at [Y]% annually.

[Business Model]
We make money through [revenue streams]. Our projected revenue is $[amount] by year three.

[Traction & Validation]
Since launching, we've achieved:
- [Key metric 1]
- [Key metric 2] 
- [Key metric 3]

[Competition & Advantage]
While competitors focus on [their approach], we differentiate through [your unique advantage].

[Financial Projections]
We're seeking $[amount] to [specific use of funds], projecting [growth metrics].

[Call to Action]
Join us in revolutionizing [industry]. Let's discuss how you can be part of this journey.`,
    tags: ['pitch', 'startup', 'investors', 'funding'],
    popularity: 95,
    icon: Briefcase
  },
  {
    id: 'job-interview-presentation',
    title: 'Job Interview Presentation',
    category: 'business',
    description: 'Structured approach for job interview presentations',
    duration: '3-5 minutes',
    difficulty: 'Beginner',
    content: `[Introduction]
Thank you for this opportunity. I'm [Name], and I'm excited to share how I can contribute to [Company].

[Background Overview]
My background spans [X years] in [industry/field], with expertise in [key skills].

[Relevant Experience]
In my previous role at [Company], I:
- [Achievement 1 with specific result]
- [Achievement 2 with metrics]
- [Achievement 3 with impact]

[Understanding the Role]
I understand this position requires [key requirements]. Here's how I align:
- [Requirement 1]: [Your experience/skills]
- [Requirement 2]: [Your experience/skills]
- [Requirement 3]: [Your experience/skills]

[Value Proposition]
I would bring three key strengths:
1. [Strength 1 with example]
2. [Strength 2 with example]
3. [Strength 3 with example]

[Vision for the Role]
In this position, I would focus on:
- [Priority 1 with timeline]
- [Priority 2 with expected outcome]
- [Priority 3 with long-term impact]

[Closing]
I'm passionate about [relevant aspect] and excited about the possibility of contributing to [Company's mission/goals].`,
    tags: ['interview', 'professional', 'career'],
    popularity: 88,
    icon: Briefcase
  },
  {
    id: 'sales-presentation',
    title: 'Sales Presentation Template',
    category: 'business',
    description: 'Convert prospects into customers with this proven structure',
    duration: '10-15 minutes',
    difficulty: 'Intermediate',
    content: `[Attention Grabber]
[Customer Name], what if I told you that you could [specific benefit] in just [timeframe]?

[Current Situation Analysis]
Right now, you're facing [specific challenge]. This is costing you [quantified impact].

[Solution Introduction]
Our [product/service] is specifically designed to [solve their problem].

[Key Benefits]
Here's what this means for you:
1. [Benefit 1]: [Specific outcome]
2. [Benefit 2]: [Measurable result]
3. [Benefit 3]: [Long-term advantage]

[Social Proof]
Companies like [Client 1] and [Client 2] have seen [specific results] using our solution.

[How It Works]
The process is simple:
- [Step 1 with timeline]
- [Step 2 with deliverable]
- [Step 3 with outcome]

[Investment & ROI]
The investment is [price], and based on [calculation], you'll see ROI within [timeframe].

[Risk Reversal]
We're so confident in our solution that we offer [guarantee/trial period].

[Next Steps]
Are you ready to [specific action]? Let's discuss how we can start [implementation timeline].`,
    tags: ['sales', 'conversion', 'presentation'],
    popularity: 92,
    icon: Target
  },
  {
    id: 'quarterly-business-review',
    title: 'Quarterly Business Review',
    category: 'business',
    description: 'Professional template for quarterly business updates',
    duration: '15-20 minutes',
    difficulty: 'Advanced',
    content: `[Executive Summary]
Good morning everyone. This quarter we achieved [key highlights] while navigating [main challenges].

[Key Performance Metrics]
Our performance this quarter:
- Revenue: [amount] ([% change] from last quarter)
- Key Metric 1: [result with comparison]
- Key Metric 2: [result with comparison]
- Key Metric 3: [result with comparison]

[Major Achievements]
Our biggest wins this quarter:
1. [Achievement 1 with impact]
2. [Achievement 2 with metrics]
3. [Achievement 3 with value]

[Challenges & Solutions]
We faced [challenge 1] and addressed it by [solution with result].
[Challenge 2] was resolved through [approach with outcome].

[Market Analysis]
Industry trends show [relevant trend], positioning us to [opportunity/threat response].

[Next Quarter Focus]
Our priorities for Q[X] are:
- [Priority 1 with expected outcome]
- [Priority 2 with timeline]
- [Priority 3 with resources needed]

[Resource Requirements]
To achieve these goals, we need [specific resources/support].

[Questions & Discussion]
I'm happy to dive deeper into any of these areas. What questions do you have?`,
    tags: ['quarterly', 'business review', 'corporate'],
    popularity: 76,
    icon: BarChart3
  },
  {
    id: 'product-launch',
    title: 'Product Launch Presentation',
    category: 'business',
    description: 'Launch your new product with maximum impact',
    duration: '12-18 minutes',
    difficulty: 'Intermediate',
    content: `[Opening Hook]
Today marks a pivotal moment in [industry]. We're launching something that will change how you [activity].

[Market Context]
The [industry] landscape has evolved. Customers now demand [current needs/expectations].

[Product Introduction]
Meet [Product Name] - [one sentence description of what it does].

[Key Features & Benefits]
[Product Name] delivers:
• [Feature 1]: [Customer benefit]
• [Feature 2]: [Customer benefit]
• [Feature 3]: [Customer benefit]

[Demonstration]
Let me show you how [Product Name] works in real situations:
[Demo scenario 1 with outcome]
[Demo scenario 2 with outcome]

[Customer Validation]
Beta customers are already seeing results:
"[Customer testimonial 1]" - [Customer name, title]
"[Customer testimonial 2]" - [Customer name, title]

[Pricing & Availability]
[Product Name] is available starting [date] at [price point].
[Special launch offer/incentive if applicable]

[Go-to-Market Strategy]
We're launching through [channels] with support from [marketing initiatives].

[Call to Action]
Ready to experience [Product Name]? [Specific next step for audience].`,
    tags: ['product launch', 'innovation', 'announcement'],
    popularity: 85,
    icon: Zap
  },

  // Academic & Educational (12 templates)
  {
    id: 'thesis-defense',
    title: 'Thesis Defense Presentation',
    category: 'academic',
    description: 'Defend your research with confidence and clarity',
    duration: '20-30 minutes',
    difficulty: 'Advanced',
    content: `[Opening & Context]
Thank you, committee members. Today I present my research on [thesis title].

[Problem Statement]
Current understanding of [topic] is limited by [research gap]. This matters because [significance].

[Research Questions]
My research addresses:
1. [Primary research question]
2. [Secondary question 1]
3. [Secondary question 2]

[Literature Review Summary]
Previous studies have established [existing knowledge], but gaps remain in [specific areas].

[Methodology]
I employed [research method] to investigate [what you studied].
- Sample: [description]
- Data collection: [approach]
- Analysis: [methods used]

[Key Findings]
My research reveals:
1. [Finding 1 with supporting evidence]
2. [Finding 2 with statistical significance]
3. [Finding 3 with implications]

[Discussion & Implications]
These findings suggest [interpretation] and contribute to [theoretical/practical knowledge].

[Limitations]
This study has limitations including [limitation 1] and [limitation 2].

[Future Research]
This work opens avenues for investigating [future research directions].

[Conclusion]
In conclusion, this research [summary of contribution to field].

[Questions]
I'm ready for your questions and feedback.`,
    tags: ['thesis', 'defense', 'academic', 'research'],
    popularity: 71,
    icon: GraduationCap
  },
  {
    id: 'class-presentation',
    title: 'Class Presentation Template',
    category: 'academic',
    description: 'Engage your classmates and teacher effectively',
    duration: '5-10 minutes',
    difficulty: 'Beginner',
    content: `[Attention Grabber]
[Interesting fact, question, or statement related to your topic]

[Introduction]
Hi everyone, I'm [name] and today I'll be talking about [topic].

[Preview]
I'll cover three main points:
1. [Point 1]
2. [Point 2] 
3. [Point 3]

[Main Point 1]
[Topic sentence for point 1]
[Supporting details, examples, or evidence]
[Transition to next point]

[Main Point 2]
[Topic sentence for point 2]
[Supporting details, examples, or evidence]
[Transition to next point]

[Main Point 3]
[Topic sentence for point 3]
[Supporting details, examples, or evidence]

[Conclusion]
To summarize, we've learned that [recap main points].

[Memorable Closing]
[Call to action, thought-provoking question, or memorable statement]

[Questions]
Are there any questions about [topic]?`,
    tags: ['school', 'student', 'classroom'],
    popularity: 94,
    icon: BookOpen
  },

  // Personal & Social (10 templates)
  {
    id: 'wedding-speech-best-man',
    title: 'Best Man Wedding Speech',
    category: 'personal',
    description: 'Honor the groom with humor, heart, and memorable stories',
    duration: '3-5 minutes',
    difficulty: 'Beginner',
    content: `[Opening]
Good evening everyone! For those who don't know me, I'm [Name], [Groom's] best man and [relationship to groom].

[How You Met]
I first met [Groom] [when/where], and I knew immediately that [first impression/funny story].

[Character of the Groom]
[Groom] is someone who [positive qualities]. I've seen him [example of character].

[Funny Story]
I have to share this story about [Groom]: [Brief, appropriate funny story that shows his character].

[Meeting the Bride]
When [Groom] first told me about [Bride], [his reaction/how he changed]. I knew she was special when [specific example].

[About the Couple]
Watching [Bride] and [Groom] together, you can see [what makes them perfect for each other]. They [shared qualities/complementary traits].

[Advice/Wishes]
My advice for a happy marriage: [piece of wisdom]. 

[Toast]
So please join me in raising your glasses to [Bride] and [Groom]. May your love story continue to [wish for their future].

Cheers!`,
    tags: ['wedding', 'best man', 'celebration'],
    popularity: 89,
    icon: Heart
  },
  {
    id: 'maid-of-honor-speech',
    title: 'Maid of Honor Speech',
    category: 'personal',
    description: 'Celebrate the bride with love, laughter, and heartfelt words',
    duration: '3-5 minutes',
    difficulty: 'Beginner',
    content: `[Opening]
Hello everyone! I'm [Name], [Bride's] maid of honor and [relationship to bride].

[Friendship Story]
[Bride] and I have been friends for [time period]. I remember [early memory that shows her character].

[Bride's Qualities]
[Bride] is the kind of person who [positive qualities with specific examples]. She has always been [characteristic traits].

[Funny/Sweet Memory]
One time, [Bride] [sweet or mildly funny story that shows who she is]. That's just who she is.

[Meeting the Groom]
When [Bride] first mentioned [Groom], [her reaction/how she talked about him]. I could tell this was different.

[About Their Relationship]
Seeing them together, it's clear that [what makes them special as a couple]. [Groom] brings out [positive trait] in [Bride].

[Personal Message]
[Bride], you deserve all the happiness in the world, and I'm so glad you found it with [Groom].

[Toast]
Everyone, please raise your glasses to the beautiful couple. Here's to [Bride] and [Groom] - may your marriage be everything you've dreamed of.

Cheers!`,
    tags: ['wedding', 'maid of honor', 'friendship'],
    popularity: 91,
    icon: Heart
  },

  // Leadership & Motivation (8 templates)
  {
    id: 'tedx-talk',
    title: 'TEDx Talk Template',
    category: 'leadership',
    description: 'Share your big idea with the world',
    duration: '12-18 minutes',
    difficulty: 'Advanced',
    content: `[Hook]
[Powerful opening - question, story, or surprising fact that relates to your big idea]

[Personal Connection]
[Brief personal story that shows why this topic matters to you]

[The Problem]
Here's what I realized: [The problem or misconception you want to address].

[The Big Idea]
What if I told you that [your transformative idea]?

[Supporting Evidence 1]
Let me show you what I mean. [First piece of evidence/example/story]

[Supporting Evidence 2]
But that's not all. [Second piece of evidence/example/story]

[Supporting Evidence 3]
And here's the most compelling part: [Third piece of evidence/example/story]

[The "How"]
So how do we [implement your idea]? It starts with [practical steps or mindset shift].

[Call to Action]
I challenge you to [specific action the audience can take].

[Vision of the Future]
Imagine a world where [paint the picture of change your idea could create].

[Memorable Closing]
[Circle back to your opening or leave them with a powerful final thought]`,
    tags: ['TEDx', 'inspiration', 'big ideas'],
    popularity: 87,
    icon: Lightbulb
  },
  {
    id: 'motivational-speech',
    title: 'Motivational Speech',
    category: 'leadership',
    description: 'Inspire others to take action and pursue their goals',
    duration: '8-15 minutes',
    difficulty: 'Intermediate',
    content: `[Powerful Opening]
[Start with a story, question, or statement that grabs attention and relates to overcoming challenges]

[Shared Struggle]
We've all been there - [describe a common challenge or fear that your audience faces].

[Personal Story]
Let me tell you about a time when I [personal story of overcoming adversity or achieving something difficult].

[The Turning Point]
The moment everything changed was when I realized [key insight or mindset shift].

[Universal Truth]
Here's what I learned: [the principle or truth you want to share].

[Evidence/Examples]
This isn't just my experience. Look at [examples of others who embody this principle]:
- [Example 1]
- [Example 2]

[The Choice]
Right now, you have a choice. You can [negative path] or you can [positive path].

[Practical Steps]
Here's how you start:
1. [Actionable step 1]
2. [Actionable step 2]
3. [Actionable step 3]

[Challenge]
I challenge you to [specific challenge for the audience].

[Vision]
Imagine yourself [paint a picture of success/achievement].

[Call to Action]
The time is now. Your moment is now. [Inspiring call to action]`,
    tags: ['motivation', 'inspiration', 'leadership'],
    popularity: 83,
    icon: Target
  },

  // Creative & Entertainment (5 templates)
  {
    id: 'storytelling-performance',
    title: 'Storytelling Performance',
    category: 'creative',
    description: 'Captivate your audience with compelling narrative',
    duration: '8-12 minutes',
    difficulty: 'Intermediate',
    content: `[Setting the Scene]
[Paint a vivid picture of where and when your story takes place]

[Character Introduction]
[Introduce the main character(s) - make the audience care about them]

[The Normal World]
[Establish what life was like before the main event]

[The Inciting Incident]
But then, [the event that changed everything happened]...

[Rising Action]
[Build tension through a series of events and challenges]

[The Crisis]
Things reached a breaking point when [the biggest challenge/conflict]...

[The Climax]
[The moment of highest tension - what happened at the peak of the story]

[Resolution]
[How the conflict was resolved - what changed]

[The Transformation]
[How the character(s) or situation was different after the events]

[Universal Message]
[Connect the story to a broader truth or lesson that resonates with everyone]

[Memorable Ending]
[End with impact - a line that stays with the audience]`,
    tags: ['storytelling', 'narrative', 'performance'],
    popularity: 78,
    icon: BookOpen
  }
];

// Generate additional templates to reach 50+
const generateAdditionalTemplates = (): Template[] => {
  const additionalTemplates = [
    // More Business Templates
    { id: 'board-presentation', title: 'Board of Directors Presentation', category: 'business', description: 'Present to your board with confidence and clarity', duration: '20-30 minutes', difficulty: 'Advanced' as const },
    { id: 'investor-update', title: 'Investor Update', category: 'business', description: 'Keep investors informed of your progress', duration: '10-15 minutes', difficulty: 'Intermediate' as const },
    { id: 'client-proposal', title: 'Client Proposal Presentation', category: 'business', description: 'Win new business with compelling proposals', duration: '15-20 minutes', difficulty: 'Intermediate' as const },
    { id: 'team-meeting', title: 'Team Meeting Presentation', category: 'business', description: 'Lead effective team meetings', duration: '5-10 minutes', difficulty: 'Beginner' as const },
    { id: 'conference-keynote', title: 'Conference Keynote', category: 'business', description: 'Deliver impactful keynote speeches', duration: '30-45 minutes', difficulty: 'Advanced' as const },
    
    // More Academic Templates
    { id: 'research-proposal', title: 'Research Proposal', category: 'academic', description: 'Pitch your research idea effectively', duration: '10-15 minutes', difficulty: 'Intermediate' as const },
    { id: 'conference-paper', title: 'Academic Conference Paper', category: 'academic', description: 'Present your research at conferences', duration: '15-20 minutes', difficulty: 'Advanced' as const },
    { id: 'poster-session', title: 'Poster Session Presentation', category: 'academic', description: 'Engage visitors at poster sessions', duration: '2-3 minutes', difficulty: 'Beginner' as const },
    { id: 'grant-application', title: 'Grant Application Pitch', category: 'academic', description: 'Secure funding for your research', duration: '10-15 minutes', difficulty: 'Advanced' as const },
    { id: 'book-report', title: 'Book Report Presentation', category: 'academic', description: 'Present book analysis to your class', duration: '5-8 minutes', difficulty: 'Beginner' as const },
    
    // More Personal Templates
    { id: 'retirement-speech', title: 'Retirement Speech', category: 'personal', description: 'Celebrate a career with gratitude', duration: '5-8 minutes', difficulty: 'Beginner' as const },
    { id: 'eulogy', title: 'Eulogy Template', category: 'personal', description: 'Honor a loved one with dignity', duration: '5-10 minutes', difficulty: 'Intermediate' as const },
    { id: 'anniversary-speech', title: 'Anniversary Speech', category: 'personal', description: 'Celebrate milestone anniversaries', duration: '3-5 minutes', difficulty: 'Beginner' as const },
    { id: 'graduation-speech', title: 'Graduation Speech', category: 'personal', description: 'Inspire graduates as they begin new chapters', duration: '8-12 minutes', difficulty: 'Intermediate' as const },
    { id: 'birthday-toast', title: 'Birthday Toast', category: 'personal', description: 'Make birthday celebrations memorable', duration: '2-3 minutes', difficulty: 'Beginner' as const },
    
    // More Leadership Templates
    { id: 'vision-presentation', title: 'Vision & Strategy Presentation', category: 'leadership', description: 'Communicate your organizational vision', duration: '20-30 minutes', difficulty: 'Advanced' as const },
    { id: 'change-management', title: 'Change Management Speech', category: 'leadership', description: 'Lead organizational change effectively', duration: '15-20 minutes', difficulty: 'Advanced' as const },
    { id: 'team-building', title: 'Team Building Speech', category: 'leadership', description: 'Motivate and unite your team', duration: '10-15 minutes', difficulty: 'Intermediate' as const },
    { id: 'award-acceptance', title: 'Award Acceptance Speech', category: 'leadership', description: 'Accept recognition with grace', duration: '3-5 minutes', difficulty: 'Beginner' as const },
    { id: 'crisis-communication', title: 'Crisis Communication', category: 'leadership', description: 'Communicate during difficult times', duration: '5-10 minutes', difficulty: 'Advanced' as const },
    
    // More Creative Templates
    { id: 'comedy-routine', title: 'Comedy Routine', category: 'creative', description: 'Craft engaging comedy performances', duration: '5-10 minutes', difficulty: 'Advanced' as const },
    { id: 'poetry-reading', title: 'Poetry Reading', category: 'creative', description: 'Present poetry with emotional impact', duration: '3-8 minutes', difficulty: 'Intermediate' as const },
    { id: 'film-pitch', title: 'Film/TV Pitch', category: 'creative', description: 'Sell your creative project to producers', duration: '10-15 minutes', difficulty: 'Intermediate' as const },
    { id: 'art-presentation', title: 'Art Gallery Presentation', category: 'creative', description: 'Present artwork to audiences', duration: '8-12 minutes', difficulty: 'Intermediate' as const },
    { id: 'music-introduction', title: 'Musical Performance Introduction', category: 'creative', description: 'Introduce musical performances', duration: '2-5 minutes', difficulty: 'Beginner' as const },
  ];

  return additionalTemplates.map(template => ({
    ...template,
    content: `[This is a ${template.title} template structure]

[Opening]
[Engaging introduction relevant to ${template.category} context]

[Main Content]
[Key points and structure specific to ${template.title.toLowerCase()}]
- Point 1: [Relevant content]
- Point 2: [Supporting information]  
- Point 3: [Additional details]

[Development]
[Detailed explanation and examples]

[Conclusion]
[Strong closing that reinforces main message]

[Call to Action]
[Appropriate next steps for audience]`,
    tags: [template.category, template.title.toLowerCase().replace(/\s+/g, '-')],
    popularity: 0, // No fake data - only real usage metrics
    icon: templateCategories.find(cat => cat.id === template.category)?.icon || FileText
  }));
};

const staticTemplates = [
  ...sampleTemplates, 
  ...generateAdditionalTemplates(),
  ...allComprehensiveTemplates,
  ...businessPitchTemplates,
  ...salesPitchTemplates,
  ...additionalTemplatesExpansion
];

export default function EnhancedTemplateMarketplace() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [customTemplate, setCustomTemplate] = useState({
    title: '',
    category: 'business',
    description: '',
    content: ''
  });
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const queryClient = useQueryClient();

  // Fetch user's custom templates
  const { data: customTemplates = [], error: customTemplatesError, isLoading: customTemplatesLoading } = useQuery({
    queryKey: ['/api/custom-templates'],
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('Custom templates state:', { customTemplates, customTemplatesError, customTemplatesLoading });

  // Canonical categories used across the library
  const canonicalCategories = ['business', 'sales', 'academic', 'personal', 'leadership', 'creative'] as const;
  type CanonicalCategory = typeof canonicalCategories[number];

  const normalizeCategory = (category: string): CanonicalCategory => {
    const c = (category || '').toLowerCase().trim();
    if (c === 'sales' || c === 'marketing' || c === 'sales_marketing' || c === 'sales-marketing') return 'sales';
    if (c === 'biz' || c === 'work' || c === 'professional' || c === 'business') return 'business';
    if (c === 'academics' || c === 'education' || c === 'academic') return 'academic';
    if (c === 'personal' || c === 'lifestyle' || c === 'events') return 'personal';
    if (c === 'leader' || c === 'leadership' || c === 'ted' || c === 'tedx') return 'leadership';
    if (c === 'creative' || c === 'entertainment' || c === 'fun') return 'creative';
    return 'business';
  };

  // Use normalized categories everywhere to avoid mismatches
  const normalizedStaticTemplates = staticTemplates.map((t) => ({
    ...t,
    category: normalizeCategory((t as any).category),
  }));

  // Combine static and custom templates with error handling
  const allTemplates = [
    ...normalizedStaticTemplates,
    ...(Array.isArray(customTemplates) ? customTemplates.map((template: any) => {
      const normalizedCategory = normalizeCategory(template.category);
      return ({
        ...template,
        category: normalizedCategory,
        icon: templateCategories.find(cat => cat.id === normalizedCategory)?.icon || FileText,
        color: templateCategories.find(cat => cat.id === normalizedCategory)?.color || 'text-gray-600',
        tags: template.tags || [normalizedCategory, 'custom'],
        contentAdvice: 'Custom template created by you. Feel free to edit and personalize as needed.',
        voiceAdvice: 'Practice with confidence and adapt your delivery style to match your personal speaking preference.',
        bodyLanguageAdvice: 'Use natural gestures and maintain good posture throughout your speech.'
      });
    }) : [])
  ];

  const getFilteredTemplates = (tabType: string) => {
    let templates = [];
    
    // Filter by tab first
    if (tabType === 'custom') {
      templates = allTemplates.filter(template => template.tags?.includes('custom') || false);
    } else {
      templates = normalizedStaticTemplates; // Only show built-in templates for "All Templates" tab
    }
    
    // Then filter by category
    if (selectedCategory !== 'all' && selectedCategory !== 'custom') {
      templates = templates.filter(template => template.category === selectedCategory);
    }
    
    // Finally filter by search
    if (searchQuery) {
      templates = templates.filter(template => 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return templates;
  };

  const filteredTemplates = getFilteredTemplates(activeTab);

  // Save custom template mutation
  const saveCustomTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await apiRequest('/api/custom-templates', 'POST', templateData);
      return await response.json();
    },
    onSuccess: () => {
      // Reset form and show success
      setCustomTemplate({
        title: '',
        category: 'business',
        description: '',
        content: ''
      });
      setShowCreateTemplate(false);
      // Switch to My Templates tab to show the new template
      setActiveTab('custom');
      setSelectedCategory('all');
      // Refetch custom templates to show the new one
      queryClient.invalidateQueries({ queryKey: ['/api/custom-templates'] });
      // Show success notification
      toast({
        title: "Success!",
        description: "Template saved successfully! Check the 'My Templates' tab to see it.",
      });
    },
    onError: (error) => {
      console.error('Failed to save template:', error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    }
  });

  // AI help mutation for template improvement
  const aiHelpMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await apiRequest('/api/improve-template', 'POST', templateData);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.improvedContent) {
        setCustomTemplate(prev => ({ ...prev, content: data.improvedContent }));
      }
    },
    onError: (error) => {
      console.error('Failed to get AI help:', error);
      toast({
        title: "AI Help Unavailable",
        description: "AI assistance is temporarily unavailable. Please try again later.",
        variant: "destructive",
      });
    }
  });

  // AI-powered template personalization
  const personalizeTemplateMutation = useMutation({
    mutationFn: async (personalizationData: any) => {
      const { template, userPreferences } = personalizationData || {};
      const userRequest = (userPreferences || 'Make it more engaging and personal').trim();

      // Try enhanced endpoint first
      try {
        const enhancedRes = await fetch('/api/ai-personalize-enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template, userRequest, personalizationData: {} })
        });
        if (enhancedRes.ok) {
          return await enhancedRes.json();
        }
      } catch {}

      // Fallback to basic personalization endpoint
      const response = await fetch('/api/personalize-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, userPreferences: userRequest })
      });
      if (!response.ok) throw new Error('Failed to personalize template');
      return await response.json();
    },
    onSuccess: (data) => {
      setEditedContent(data.personalizedContent || editedContent);
      setEditMode(true);
      toast({ title: 'Template Personalized', description: 'We tailored your template to be more engaging.' });
    },
    onError: (error: any) => {
      toast({ title: 'Personalization failed', description: error?.message || 'Please try again later.', variant: 'destructive' });
    }
  });

  // Generate AI feedback on template content
  const generateFeedbackMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await fetch('/api/template-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });
      if (!response.ok) throw new Error('Failed to generate feedback');
      return response.json();
    }
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setEditedContent(template.content);
    setEditMode(false);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditedContent(selectedTemplate?.content || '');
    }
  };

  const handlePersonalize = () => {
    if (selectedTemplate) {
      personalizeTemplateMutation.mutate({
        template: selectedTemplate,
        userPreferences: 'Make it more engaging and personal'
      });
    }
  };

  // AI Template Generator mutation
  const generateTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await apiRequest('/api/generate-template', 'POST', templateData);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.generatedContent) {
        setCustomTemplate(prev => ({ 
          ...prev, 
          content: data.generatedContent,
          description: data.enhancedDescription || prev.description 
        }));
        toast({
          title: "Template Generated! ✨",
          description: "Your AI-powered template is ready! You can edit and customize it further.",
        });
      }
    },
    onError: (error) => {
      console.error('Failed to generate template:', error);
      toast({
        title: "Generation Failed",
        description: "AI template generation is temporarily unavailable. Try writing your template manually.",
        variant: "destructive",
      });
    }
  });

  // Generate template function
  const handleGenerateTemplate = () => {
    generateTemplateMutation.mutate({
      title: customTemplate.title,
      category: customTemplate.category,
      description: customTemplate.description,
      audience: 'general',
      duration: '5-10 minutes',
      tone: 'professional',
      includeExamples: true,
      includeCallToAction: true
    });
  };

  const handleSaveCustomTemplate = () => {
    if (!customTemplate.title?.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your template.",
        variant: "destructive",
      });
      return;
    }

    if (!customTemplate.content?.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content for your template.",
        variant: "destructive",
      });
      return;
    }

    const templateData = {
      title: customTemplate.title.trim(),
      category: customTemplate.category,
      description: customTemplate.description?.trim() || '',
      content: customTemplate.content.trim(),
      difficulty: 'Beginner' as const,
      duration: '5-10 minutes',
      tags: [customTemplate.category, 'custom']
    };

    saveCustomTemplateMutation.mutate(templateData);
  };

  const handleAIHelp = () => {
    if (!customTemplate.content?.trim()) {
      toast({
        title: "Content Required",
        description: "Please write some content first so AI can help improve it.",
        variant: "destructive",
      });
      return;
    }

    aiHelpMutation.mutate({
      title: customTemplate.title,
      category: customTemplate.category,
      description: customTemplate.description,
      content: customTemplate.content
    });
  };

  const handleDownloadPDF = async () => {
    if (!selectedTemplate) return;
    
    try {
      // Import the new enhanced PDF export
      const { generateTemplatePDF } = await import('@/lib/pdf-export');
      
      // Create template data object
      const templateData = {
        title: selectedTemplate.title,
        category: selectedTemplate.category || 'Custom',
        duration: selectedTemplate.duration || 'Variable',
        difficulty: selectedTemplate.difficulty || 'Not specified',
        content: editedContent || selectedTemplate.content,
        contentAdvice: selectedTemplate.contentAdvice || 'Focus on clear structure and audience engagement.',
        voiceAdvice: selectedTemplate.voiceAdvice || 'Use varied pace and confident delivery.',
        bodyLanguageAdvice: selectedTemplate.bodyLanguageAdvice || 'Maintain eye contact and use purposeful gestures.',
        tags: selectedTemplate.tags || [],
        description: selectedTemplate.description || ''
      };
      
      // Generate and download PDF with enhanced styling
      const filename = `${selectedTemplate.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.pdf`;
      await generateTemplatePDF(templateData, filename);
      
      toast({
        title: "PDF Downloaded Successfully! 📄",
        description: "Your beautifully formatted template guide has been saved with Poppins font and modern styling.",
      });
      
    } catch (error) {
      console.error('PDF Export error:', error);
      toast({
        title: "PDF Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTemplateGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map((template) => {
        const IconComponent = template.icon;
        return (
          <Card 
            key={template.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200"
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <IconComponent className="h-6 w-6 text-blue-600" />
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg">{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {template.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {template.popularity}%
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderTemplateEditor = () => {
    if (!selectedTemplate) return null;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedTemplate.title}</h2>
            <p className="text-gray-600">{selectedTemplate.description}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleEditToggle} 
              variant="outline"
              size="lg"
              className="text-base font-medium"
            >
              <Edit className="h-5 w-5 mr-2" />
              {editMode ? 'Preview' : 'Edit Text'}
            </Button>
            <Button 
              onClick={handlePersonalize} 
              disabled={personalizeTemplateMutation.isPending}
              size="lg"
              className="text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {personalizeTemplateMutation.isPending ? 'Personalizing...' : 'Make it Personal'}
            </Button>
            <Button 
              onClick={handleDownloadPDF}
              size="lg"
              className="text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-5 w-5 mr-2" />
              Save as PDF
            </Button>
          </div>
        </div>

        {editMode ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Edit your template content here..."
          />
        ) : (
          <Card>
            <CardContent className="p-6">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {editedContent || selectedTemplate.content}
              </pre>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="text-base">Speech Structure</TabsTrigger>
            <TabsTrigger value="voice" className="text-base">Voice Coaching</TabsTrigger>
            <TabsTrigger value="body" className="text-base">Body Language</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Speech Structure Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-600">Structure Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-gray-600">Clarity</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">78%</div>
                    <div className="text-sm text-gray-600">Engagement</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Content Recommendations:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Strong opening hook that grabs attention immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <span>Consider adding more specific examples in the middle section</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Clear call-to-action that drives audience engagement</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Modulation Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Pace Recommendations</h4>
                    <p className="text-sm text-gray-600">Vary your speaking pace to maintain engagement. Slow down for important points, speed up during examples.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Emphasis Points</h4>
                    <p className="text-sm text-gray-600">Use vocal emphasis on key phrases: "[Problem Statement]", "[Solution Introduction]", "[Call to Action]"</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Pauses for Impact</h4>
                    <p className="text-sm text-gray-600">Add strategic pauses after rhetorical questions and before important revelations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="body" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Body Language Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Posture & Stance</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Stand tall with shoulders back</li>
                      <li>• Keep feet shoulder-width apart</li>
                      <li>• Avoid swaying or shifting weight</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Gestures & Movement</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Use open palm gestures</li>
                      <li>• Mirror the energy of your content</li>
                      <li>• Point deliberately when referencing data</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Eye Contact Strategy</h4>
                  <p className="text-sm">For this template type, maintain eye contact for 3-5 seconds with different sections of your audience. Look directly at key stakeholders during important points.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    );
  };

  const renderCreateTemplate = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Create Your Own Template</h2>
          <p className="text-gray-600 mt-2">Build a custom speech template from scratch</p>
        </div>
        <Button 
          onClick={() => setShowCreateTemplate(false)} 
          variant="outline"
          size="lg"
          className="text-base"
        >
          ← Back to Templates
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Template Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-base font-medium block mb-2">What's your speech about?</label>
                <Input
                  value={customTemplate.title}
                  onChange={(e) => setCustomTemplate(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., My Product Launch Pitch"
                  className="text-base"
                />
              </div>
              
              <div>
                <label className="text-base font-medium block mb-2">What type of speech is this?</label>
                <select 
                  className="w-full p-3 border rounded-md text-base"
                  value={customTemplate.category}
                  onChange={(e) => setCustomTemplate(prev => ({ ...prev, category: e.target.value }))}
                >
                  {templateCategories.slice(1).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-base font-medium block mb-2">Tell us more about this speech</label>
                <Textarea
                  value={customTemplate.description}
                  onChange={(e) => setCustomTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's the purpose? Who's your audience? What should they feel or do after hearing your speech?"
                  rows={4}
                  className="text-base"
                />
              </div>
              
              {/* AI Template Generator */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-center space-y-3">
                  <h4 className="font-medium text-gray-900">Need help getting started?</h4>
                  <Button 
                    onClick={handleGenerateTemplate}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-base"
                    size="lg"
                    disabled={!customTemplate.title || !customTemplate.description || generateTemplateMutation.isPending}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {generateTemplateMutation.isPending ? 'Generating Amazing Template...' : '✨ Generate Template with AI'}
                  </Button>
                  <p className="text-sm text-gray-500">
                    Our AI will create a professional template based on your details
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write Your Speech</h3>
            <div className="space-y-4">
              <Textarea
                value={customTemplate.content}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Start writing your speech here...

Tips:
- Begin with a strong opening
- Organize your main points clearly  
- End with a memorable conclusion
- Use [brackets] for parts you'll customize later"
                className="min-h-[300px] text-base"
              />
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleSaveCustomTemplate}
                  className="flex-1 text-base font-medium"
                  size="lg"
                  disabled={!customTemplate.title || !customTemplate.content || saveCustomTemplateMutation.isPending}
                >
                  <Save className="h-5 w-5 mr-2" />
                  {saveCustomTemplateMutation.isPending ? 'Saving...' : 'Save My Template'}
                </Button>
                <Button 
                  onClick={handleAIHelp}
                  variant="outline"
                  size="lg"
                  className="text-base font-medium"
                  disabled={!customTemplate.content || aiHelpMutation.isPending}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {aiHelpMutation.isPending ? 'Getting Help...' : 'AI Help'}
                </Button>
              </div>
              
              {customTemplate.title && customTemplate.content && (
                <p className="text-sm text-green-600 text-center">
                  Ready to save! Your template will be available in your personal collection.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );

  if (showCreateTemplate) {
    return renderCreateTemplate();
  }

  if (selectedTemplate) {
    return renderTemplateEditor();
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Speech Templates</h1>
          <p className="text-gray-600">Choose from professional templates or create your own</p>
        </div>
        <Button 
          onClick={() => setShowCreateTemplate(true)}
          size="lg"
          className="text-base font-medium bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Your Own
        </Button>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            All Templates
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            My Templates
            {Array.isArray(customTemplates) && customTemplates.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {customTemplates.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          {/* Search and Filters for All Templates */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {templateCategories.filter(cat => cat.id !== 'custom').map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredTemplates.length} of {staticTemplates.length} templates
            </p>
            <Badge variant="outline">
              {staticTemplates.length} Built-in Templates
            </Badge>
          </div>

          {/* Templates Grid */}
          {renderTemplateGrid()}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 mt-6">
          {/* Search for Custom Templates */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Custom Templates Content */}
          {customTemplatesLoading ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading your templates...</p>
              </div>
            </Card>
          ) : customTemplatesError ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Error loading templates</h3>
                  <p className="text-gray-600 mt-2">Please try refreshing the page</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Refresh Page
                </Button>
              </div>
            </Card>
          ) : !Array.isArray(customTemplates) || customTemplates.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No custom templates yet</h3>
                  <p className="text-gray-600 mt-2">Create your first custom template to get started</p>
                </div>
                <Button 
                  onClick={() => setShowCreateTemplate(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* Results Summary for Custom Templates */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredTemplates.length} of {customTemplates.length} custom templates
                </p>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {customTemplates.length} My Templates
                </Badge>
              </div>

              {/* Custom Templates Grid */}
              {renderTemplateGrid()}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}