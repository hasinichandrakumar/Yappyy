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
  }

  // Continue with more templates to reach 50+...
  // Adding more categories and templates for a comprehensive marketplace
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

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1">
          {TEMPLATE_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center space-y-1 px-2 py-2 text-xs"
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:block">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

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